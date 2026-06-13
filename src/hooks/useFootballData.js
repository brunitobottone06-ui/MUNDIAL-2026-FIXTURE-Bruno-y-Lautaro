import { useState, useEffect, useCallback, useRef } from 'react'
import localData from '../data/worldcup-data.json'

/* ══════════════════════════════════════════════════════════════
   football-data.org v4 — hook central
   Doc: https://www.football-data.org/documentation/quickstart
   Free tier: 10 req/min · WC2026 incluido
══════════════════════════════════════════════════════════════ */

/* Proxy relativo: Vite lo redirige en dev, Vercel Function lo maneja en producción.
   El X-Auth-Token se agrega en el servidor — nunca se expone en el bundle del browser. */
const BASE = '/api/fd'
const COMP = 'WC'

/* ── Cache en memoria con TTL ── */
const _cache = new Map()

async function fdFetch(path, ttlMs = 60_000, signal) {
  if (ttlMs > 0) {
    const hit = _cache.get(path)
    if (hit && Date.now() - hit.ts < ttlMs) return hit.data
  }
  const res = await fetch(`${BASE}${path}`, { signal })
  if (!res.ok) throw new Error(`football-data.org ${res.status}: ${res.statusText}`)
  const data = await res.json()
  if (ttlMs > 0) _cache.set(path, { data, ts: Date.now() })
  return data
}

/* ── football-data.org status → nuestro estado ── */
function toEstado(status) {
  if (['IN_PLAY', 'PAUSED', 'HALF_TIME'].includes(status)) return 'en_vivo'
  if (['FINISHED', 'AWARDED'].includes(status))            return 'finalizado'
  return 'programado'
}

/* ── "GROUP_A" → "A"  |  "Group A" → "A" ── */
function groupLetter(g) {
  const m = g?.match(/([A-L])$/)
  return m?.[1] ?? ''
}

/* ── UTC ISO → hora Argentina ── */
function toArgTime(utcDate) {
  if (!utcDate) return ''
  return new Date(utcDate).toLocaleTimeString('es-AR', {
    hour: '2-digit', minute: '2-digit',
    timeZone: 'America/Argentina/Buenos_Aires',
  })
}

/* ── Correcciones TLA football-data.org → código FIFA de nuestro JSON ──
   La mayoría coincide directamente. Estos son los casos especiales. ── */
const FD_TLA_TO_FIFA = {
  SAU: 'KSA',  // Arabia Saudita
  IRI: 'IRN',  // Irán
  DRC: 'COD',  // Congo DR
  BOS: 'BIH',  // Bosnia
  WAL: 'WAL',  // Gales (si aplica)
  CIV: 'CIV',  // Costa de Marfil (mismo)
  URY: 'URU',  // Uruguay — FD usa URY, nuestro JSON usa URU
}
function normCode(tla) {
  return tla ? (FD_TLA_TO_FIFA[tla] ?? tla) : null
}

/* ── Partido FD → formato interno ── */
function mapMatch(m) {
  const local     = normCode(m.homeTeam?.tla)
  const visitante = normCode(m.awayTeam?.tla)
  const estado    = toEstado(m.status)
  const gl = estado !== 'programado' ? (m.score?.fullTime?.home ?? null) : null
  const gv = estado !== 'programado' ? (m.score?.fullTime?.away ?? null) : null

  /* Intentar mapear estadio_id buscando por nombre en nuestro JSON */
  const estadioMatch = localData.estadios.find(e =>
    m.venue && e.nombre.toLowerCase().includes(m.venue.toLowerCase().slice(0, 6))
  )

  /* Lookup en JSON local para datos enriquecidos (nombre en español, etc.) */
  const jLocal     = local     ? localData.selecciones[local]     : null
  const jVisitante = visitante ? localData.selecciones[visitante] : null

  return {
    id:              `FD-${m.id}`,
    fase:            m.stage === 'GROUP_STAGE' ? 'grupos' : 'eliminacion',
    grupo:           groupLetter(m.group),
    jornada:         m.matchday,
    local,
    visitante,
    goles_local:     gl,
    goles_visitante: gv,
    estado,
    minuto:          m.minute ?? null,
    fecha:           m.utcDate?.slice(0, 10),
    hora_arg:        toArgTime(m.utcDate),
    estadio_id:      estadioMatch?.id ?? null,
    estadio_nombre:  m.venue ?? estadioMatch?.nombre ?? '',
    fixture_id:      m.id,
    /* Nombres enriquecidos del JSON local si TLA coincide */
    _localNombre:     jLocal?.nombre,
    _visitanteNombre: jVisitante?.nombre,
  }
}

/* ── Standings FD → { A: [{code,pj,g,e,p,gf,gc,dg,pts}], B: [...], ... } ── */
function mapStandings(fdStandings) {
  const result = {}
  for (const s of (fdStandings ?? [])) {
    if (s.type !== 'TOTAL') continue
    const letra = groupLetter(s.group)
    if (!letra) continue
    result[letra] = s.table.map(row => ({
      code: normCode(row.team?.tla),
      pj:   row.playedGames,
      g:    row.won,
      e:    row.draw,
      p:    row.lost,
      gf:   row.goalsFor,
      gc:   row.goalsAgainst,
      dg:   row.goalDifference,
      pts:  row.points,
    }))
  }
  return result
}

/* ══════════════════════════════════════════════════════════════
   useWCFixtures — todos los partidos del Mundial
   TTL 5 min → se refresca solo, no quema requests
══════════════════════════════════════════════════════════════ */
export function useWCFixtures() {
  const [fixtures, setFixtures] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    const ctrl = new AbortController()

    const load = async () => {
      setLoading(true)
      try {
        const json = await fdFetch(`/competitions/${COMP}/matches`, 5 * 60_000, ctrl.signal)
        if (!isMounted.current) return
        setFixtures((json.matches ?? []).map(mapMatch))
        setError(null)
      } catch (e) {
        if (e.name === 'AbortError' || !isMounted.current) return
        setError(e.message)
        /* Fallback al JSON estático si la API falla */
        setFixtures([])
      } finally {
        if (isMounted.current) setLoading(false)
      }
    }

    load()
    /* Re-fetch cada 5 min para capturar resultados nuevos */
    const iv = setInterval(load, 5 * 60_000)
    return () => {
      isMounted.current = false
      ctrl.abort()
      clearInterval(iv)
    }
  }, [])

  return { fixtures, loading, error }
}

/* ══════════════════════════════════════════════════════════════
   useWCLive — partidos en este momento (IN_PLAY / PAUSED)
   Poll cada 30 s durante partidos, cada 2 min en standby
══════════════════════════════════════════════════════════════ */
export function useWCLive() {
  const [liveMatches, setLiveMatches] = useState([])
  const [hasLive,     setHasLive]     = useState(false)
  const [lastSync,    setLastSync]    = useState(null)
  const [error,       setError]       = useState(null)
  const intervalRef = useRef(null)
  const isMounted   = useRef(true)

  const poll = useCallback(async () => {
    try {
      /* Sin TTL — siempre fresco para datos en vivo */
      const json = await fdFetch(`/competitions/${COMP}/matches?status=IN_PLAY`, 0)
      if (!isMounted.current) return

      const live = (json.matches ?? []).map(mapMatch)
      setLiveMatches(live)
      setHasLive(live.length > 0)
      setLastSync(new Date())
      setError(null)

      /* Ajustar intervalo según haya partidos activos */
      const next = live.length > 0 ? 30_000 : 120_000
      clearInterval(intervalRef.current)
      intervalRef.current = setInterval(poll, next)
    } catch (e) {
      if (isMounted.current) setError(e.message)
    }
  }, [])

  useEffect(() => {
    isMounted.current = true
    poll()
    intervalRef.current = setInterval(poll, 120_000)
    return () => {
      isMounted.current = false
      clearInterval(intervalRef.current)
    }
  }, [poll])

  return { liveMatches, hasLive, lastSync, error }
}

/* ══════════════════════════════════════════════════════════════
   useWCStandings — tabla de posiciones por grupo
   Poll cada 5 min — standings solo cambian al terminar un partido
══════════════════════════════════════════════════════════════ */
export function useWCStandings() {
  const [standings, setStandings] = useState({})
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const isMounted   = useRef(true)

  const load = useCallback(async () => {
    try {
      const json = await fdFetch(`/competitions/${COMP}/standings`, 5 * 60_000)
      if (!isMounted.current) return
      setStandings(mapStandings(json.standings))
      setError(null)
    } catch (e) {
      if (isMounted.current) setError(e.message)
    } finally {
      if (isMounted.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    isMounted.current = true
    load()
    const iv = setInterval(load, 5 * 60_000)
    return () => {
      isMounted.current = false
      clearInterval(iv)
    }
  }, [load])

  return { standings, loading, error }
}

/* ══════════════════════════════════════════════════════════════
   mergeLive — superpone datos en vivo sobre un partido base
   Busca por clave "local__visitante"
══════════════════════════════════════════════════════════════ */
export function mergeLive(partido, liveMatches) {
  if (!liveMatches?.length) return partido
  const key  = `${partido.local}__${partido.visitante}`
  const live = liveMatches.find(m => `${m.local}__${m.visitante}` === key)
  return live ? { ...partido, ...live } : partido
}

/* ══════════════════════════════════════════════════════════════
   useWCSquads — plantillas de las 48 selecciones del Mundial
   Fuente: GET /competitions/WC/teams (football-data.org)
   TTL 1 hora — los planteles no cambian durante el torneo
══════════════════════════════════════════════════════════════ */
const POS_ORDER_FD = { Goalkeeper: 0, Defence: 1, Midfield: 2, Offence: 3 }

export function useWCSquads() {
  const [squadsMap, setSquadsMap] = useState({})
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    const ctrl = new AbortController()

    const load = async () => {
      try {
        const json = await fdFetch('/competitions/WC/teams', 60 * 60_000, ctrl.signal)
        if (!isMounted.current) return

        const map = {}
        for (const team of (json.teams ?? [])) {
          const code = normCode(team.tla)
          if (!code) continue
          const sorted = [...(team.squad ?? [])].sort((a, b) =>
            (POS_ORDER_FD[a.position] ?? 9) - (POS_ORDER_FD[b.position] ?? 9)
          )
          map[code] = sorted.map(p => ({
            id:          p.id,
            name:        p.name,
            position:    p.position,
            dateOfBirth: p.dateOfBirth,
            nationality: p.nationality,
          }))
        }
        setSquadsMap(map)
        setError(null)
      } catch (e) {
        if (e.name === 'AbortError' || !isMounted.current) return
        setError(e.message)
      } finally {
        if (isMounted.current) setLoading(false)
      }
    }

    load()
    return () => {
      isMounted.current = false
      ctrl.abort()
    }
  }, [])

  return { squadsMap, loading, error }
}
