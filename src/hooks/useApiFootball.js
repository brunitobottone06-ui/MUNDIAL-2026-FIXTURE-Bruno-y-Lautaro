import { useState, useCallback, useRef } from 'react'
import localData from '../data/worldcup-data.json'
import { TEAM_API_MAP } from '../data/teamApiMap.js'

/* ─────────────────────────────────────────────────────────────
   Config — API-Football v3 (api-sports.io directo)
   Doc: https://www.api-football.com/documentation-v3
───────────────────────────────────────────────────────────── */
const API_BASE  = 'https://v3.football.api-sports.io'
const CDN_LOGO  = 'https://media.api-sports.io/football/teams'
const WC_LEAGUE = 1

/* Cache en memoria — evita quemar las 100 req/día del free tier */
const _cache = new Map()

function hasRealKey() {
  const k = import.meta.env.VITE_API_KEY
  return k && k !== 'TU_API_KEY_AQUI' && k.trim().length > 10
}

function getHeaders() {
  return { 'x-apisports-key': import.meta.env.VITE_API_KEY }
}

async function apiFetch(endpoint, signal) {
  const url = `${API_BASE}${endpoint}`
  if (_cache.has(url)) return _cache.get(url)
  const res = await fetch(url, { headers: getHeaders(), signal })
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${res.statusText}`)
  const json = await res.json()
  if (json.errors && Object.keys(json.errors).length > 0) {
    const msg = Object.values(json.errors)[0]
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg))
  }
  _cache.set(url, json)
  return json
}

/* ─────────────────────────────────────────────────────────────
   Construye las 48 selecciones 2026 desde el JSON local
   enriquecidas con logos oficiales de API-Football
   → No consume requests de la API
───────────────────────────────────────────────────────────── */
function buildWC2026Teams() {
  return Object.entries(localData.selecciones).map(([codigo, sel]) => {
    const apiEntry = TEAM_API_MAP[codigo]
    return {
      team: {
        id:      apiEntry?.id ?? null,
        name:    sel.nombre,
        country: sel.confederacion,
        logo:    apiEntry ? `${CDN_LOGO}/${apiEntry.id}.png` : null,
        national: true,
        /* Campos extra del JSON local */
        _flag:   sel.bandera,
        _grupo:  sel.grupo,
        _conf:   sel.confederacion,
        _codigo: codigo,
        _color:  sel.color_principal,
      },
      venue: {},
    }
  })
}

const WC2026_TEAMS = buildWC2026Teams()

/* ─────────────────────────────────────────────────────────────
   Hook: Equipos del Mundial 2026
   Usa siempre los 48 equipos del JSON local + logos de la API.
   No hace ningún request de red para los equipos.
───────────────────────────────────────────────────────────── */
export function useWorldCupTeams() {
  const [teams,   setTeams]   = useState([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const fetchTeams = useCallback(async () => {
    setLoading(true)
    setError(null)
    /* Pequeño delay para que el spinner se vea */
    await new Promise(r => setTimeout(r, 300))
    setTeams(WC2026_TEAMS)
    setLoading(false)
  }, [])

  return { teams, loading, error, demoMode: null, fetchTeams }
}

/* ─────────────────────────────────────────────────────────────
   Hook: Jugadores de un equipo
   Busca en WC2022 (máximo disponible en plan gratuito).
   Si el equipo no estuvo en Qatar 2022 muestra mensaje amable.
───────────────────────────────────────────────────────────── */
export function useTeamPlayers(teamId) {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  /* null = no fetched yet | 'wc2022' | 'none' */
  const [dataSource, setDataSource] = useState(null)
  const abortRef = useRef(null)

  const fetchPlayers = useCallback(async () => {
    if (!teamId) return

    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl

    setLoading(true)
    setError(null)
    setDataSource(null)

    /* Sin key real → no hay players disponibles */
    if (!hasRealKey()) {
      setPlayers([])
      setDataSource('none')
      setLoading(false)
      return
    }

    try {
      /* Intentar WC2022 (season disponible en plan free) */
      const data = await apiFetch(
        `/players?league=${WC_LEAGUE}&season=2022&team=${teamId}&page=1`,
        ctrl.signal
      )
      const list = data.response ?? []
      setPlayers(list)
      setDataSource(list.length > 0 ? 'wc2022' : 'none')
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [teamId])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    setPlayers([])
    setError(null)
    setLoading(false)
    setDataSource(null)
  }, [])

  return { players, loading, error, dataSource, fetchPlayers, reset }
}
