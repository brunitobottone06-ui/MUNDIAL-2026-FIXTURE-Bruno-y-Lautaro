import { useState, useEffect, useCallback, useRef } from 'react'
import { LIVE_MODE, WC_LEAGUE, WC_SEASON, POLL_INTERVAL_LIVE, POLL_INTERVAL_STANDBY } from '../config.js'
import { TEAM_API_MAP } from '../data/teamApiMap.js'

/* ── Reverse lookup: API team ID → FIFA code ── */
const API_ID_TO_CODE = Object.fromEntries(
  Object.entries(TEAM_API_MAP)
    .filter(([, v]) => v.id)
    .map(([code, v]) => [v.id, code])
)

/* ── Status codes de API-Football → nuestro estado ── */
function apiStatusToEstado(short) {
  const LIVE_CODES  = ['1H', '2H', 'HT', 'ET', 'BT', 'P', 'LIVE', 'INT']
  const FINAL_CODES = ['FT', 'AET', 'PEN']
  if (LIVE_CODES.includes(short))  return 'en_vivo'
  if (FINAL_CODES.includes(short)) return 'finalizado'
  return 'programado'
}

/* ── Construye la clave de lookup para un partido ── */
function buildKey(homeCode, awayCode) {
  return `${homeCode}__${awayCode}`
}

/* ── Persistencia de resultados finalizados en localStorage ──
   El plan gratuito de API-Football no entrega season=2026 histórico.
   Cuando el endpoint live reporta un partido como FT, lo guardamos
   aquí para que los standings reflejen partidos ya jugados.
──────────────────────────────────────────────────────────── */
const CACHE_KEY = 'wc2026_results'
function loadCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) ?? '{}') }
  catch { return {} }
}
function saveCache(c) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)) } catch {}
}

/* ─────────────────────────────────────────────────────────────
   useLiveMatches
   ─────────────────────────────────────────────────────────────
   Retorna:
     liveData  — Map { "ARG__FRA": { goles_local, goles_visitante, estado, minuto } }
                 Incluye histórico de partidos finalizados (localStorage).
     hasLive   — boolean: hay partidos EN CURSO en este momento
     error     — string o null
     lastSync  — Date de la última actualización exitosa

   En modo LIVE_MODE=false devuelve todo vacío sin hacer fetch.
───────────────────────────────────────────────────────────── */
export function useLiveMatches() {
  /* Inicializar desde localStorage para standings inmediatos */
  const [liveData, setLiveData] = useState(() => LIVE_MODE ? loadCache() : {})
  const [hasLive,  setHasLive]  = useState(false)
  const [error,    setError]    = useState(null)
  const [lastSync, setLastSync] = useState(null)
  const intervalRef = useRef(null)
  const isMounted   = useRef(true)

  const poll = useCallback(async () => {
    if (!LIVE_MODE) return
    const key = import.meta.env.VITE_API_KEY
    if (!key || key === 'TU_API_KEY_AQUI') return

    try {
      /* Solo partidos LIVE de la World Cup */
      const res = await fetch(
        `https://v3.football.api-sports.io/fixtures?live=all&league=${WC_LEAGUE}`,
        { headers: { 'x-apisports-key': key } }
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      if (!isMounted.current) return

      const fixtures = json.response ?? []
      const liveMap  = {}
      const cache    = loadCache()
      let   dirty    = false

      for (const f of fixtures) {
        const homeCode = API_ID_TO_CODE[f.teams.home.id]
        const awayCode = API_ID_TO_CODE[f.teams.away.id]
        if (!homeCode || !awayCode) continue

        const estado = apiStatusToEstado(f.fixture.status.short)
        const entry  = {
          goles_local:     f.goals.home     ?? 0,
          goles_visitante: f.goals.away     ?? 0,
          estado,
          minuto:          f.fixture.status.elapsed ?? null,
          fixture_id:      f.fixture.id,
        }
        liveMap[buildKey(homeCode, awayCode)] = entry

        /* Guardar en localStorage cuando el partido finaliza */
        if (estado === 'finalizado') {
          const k = buildKey(homeCode, awayCode)
          if (!cache[k]) { cache[k] = entry; dirty = true }
        }
      }

      if (dirty) saveCache(cache)

      /* liveData = histórico persistido + overlay de datos en vivo */
      setLiveData({ ...cache, ...liveMap })
      setHasLive(fixtures.some(f =>
        ['1H','2H','HT','ET','BT','P','LIVE','INT'].includes(f.fixture.status.short)
      ))
      setLastSync(new Date())
      setError(null)

      /* Ajustar el intervalo según haya partidos activos */
      const interval = fixtures.length > 0 ? POLL_INTERVAL_LIVE : POLL_INTERVAL_STANDBY
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = setInterval(poll, interval)
      }
    } catch (err) {
      if (isMounted.current) setError(err.message)
    }
  }, [])

  useEffect(() => {
    if (!LIVE_MODE) return
    isMounted.current = true

    /* Poll inmediato + arrancar el intervalo */
    poll()
    intervalRef.current = setInterval(poll, POLL_INTERVAL_STANDBY)

    return () => {
      isMounted.current = false
      clearInterval(intervalRef.current)
    }
  }, [poll])

  return { liveData, hasLive, error, lastSync }
}

/* ─────────────────────────────────────────────────────────────
   useLiveFixtures
   ─────────────────────────────────────────────────────────────
   Descarga el fixture completo de la API (cuando LIVE_MODE=true).
   En LIVE_MODE=false la FixturePage sigue usando el JSON local.
   Caché a nivel módulo: múltiples instancias comparten el mismo
   resultado sin duplicar requests.
───────────────────────────────────────────────────────────── */
let _fixturesCache = null

export function useLiveFixtures() {
  const [fixtures, setFixtures] = useState(() => _fixturesCache ?? [])
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    if (!LIVE_MODE) return
    const key = import.meta.env.VITE_API_KEY
    if (!key || key === 'TU_API_KEY_AQUI') return
    if (_fixturesCache) { setFixtures(_fixturesCache); return }

    const ctrl = new AbortController()
    setLoading(true)

    fetch(
      `https://v3.football.api-sports.io/fixtures?league=${WC_LEAGUE}&season=${WC_SEASON}`,
      { headers: { 'x-apisports-key': key }, signal: ctrl.signal }
    )
      .then(r => r.json())
      .then(json => {
        const partidos = (json.response ?? []).map(f => {
          const homeCode = API_ID_TO_CODE[f.teams.home.id]  ?? f.teams.home.name
          const awayCode = API_ID_TO_CODE[f.teams.away.id]  ?? f.teams.away.name
          return {
            id:              `API-${f.fixture.id}`,
            fase:            f.league.round?.toLowerCase().includes('group') ? 'grupos' : 'eliminacion',
            grupo:           f.league.round?.replace('Group Stage - ', '') ?? '',
            jornada:         null,
            local:           homeCode,
            visitante:       awayCode,
            goles_local:     f.goals.home,
            goles_visitante: f.goals.away,
            estado:          apiStatusToEstado(f.fixture.status.short),
            minuto:          f.fixture.status.elapsed,
            fecha:           f.fixture.date?.slice(0, 10),
            hora_arg:        toArgTime(f.fixture.date),
            estadio_id:      null,
            estadio_nombre:  f.fixture.venue?.name ?? '',
            fixture_id:      f.fixture.id,
          }
        })
        _fixturesCache = partidos
        setFixtures(partidos)
      })
      .catch(err => { if (err.name !== 'AbortError') setError(err.message) })
      .finally(() => setLoading(false))

    return () => ctrl.abort()
  }, [])

  return { fixtures, loading, error }
}

/* Convierte ISO date string a hora Argentina (UTC-3) */
function toArgTime(isoDate) {
  if (!isoDate) return ''
  const d = new Date(isoDate)
  return d.toLocaleTimeString('es-AR', {
    hour: '2-digit', minute: '2-digit',
    timeZone: 'America/Argentina/Buenos_Aires',
  })
}

/* ─────────────────────────────────────────────────────────────
   Helper: fusiona datos live encima de un partido del JSON local
   Uso: const partidoFinal = mergeWithLive(partido, liveData)
───────────────────────────────────────────────────────────── */
export function mergeWithLive(partido, liveData) {
  if (!LIVE_MODE || !liveData) return partido
  const key  = buildKey(partido.local, partido.visitante)
  const live = liveData[key]
  if (!live) return partido
  return { ...partido, ...live }
}
