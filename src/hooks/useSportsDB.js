import { useState, useCallback, useRef, useEffect } from 'react'
import localData       from '../data/worldcup-data.json'
import { TEAM_API_MAP } from '../data/teamApiMap.js'
import staticPhotos    from '../data/player-photos.json'

/* ── URLs ───────────────────────────────────────────────────── */
const CDN_LOGO    = 'https://media.api-sports.io/football/teams'
const API_BASE    = 'https://v3.football.api-sports.io'
const API_KEY     = import.meta.env.VITE_API_KEY

/* ── Cache en memoria ───────────────────────────────────────── */
const _cache = new Map()

async function apiFetch(endpoint, signal) {
  const url = `${API_BASE}${endpoint}`
  if (_cache.has(url)) return _cache.get(url)
  const res = await fetch(url, {
    headers: { 'x-apisports-key': API_KEY },
    signal,
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  _cache.set(url, json)
  return json
}

/* ── Alias inglés canónico para búsquedas ───────────────────── */
const CODE_TO_ENGLISH = {
  ARG: 'argentina',    BRA: 'brazil',      FRA: 'france',
  GER: 'germany',      ESP: 'spain',       POR: 'portugal',
  NED: 'netherlands',  BEL: 'belgium',     ENG: 'england',
  CRO: 'croatia',      MAR: 'morocco',     SEN: 'senegal',
  JPN: 'japan',        KOR: 'south korea', USA: 'united states',
  MEX: 'mexico',       CAN: 'canada',      AUS: 'australia',
  SUI: 'switzerland',  ECU: 'ecuador',     URU: 'uruguay',
  COL: 'colombia',     GHA: 'ghana',       TUN: 'tunisia',
  IRN: 'iran',         QAT: 'qatar',       KSA: 'saudi arabia',
  CZE: 'czech republic', AUT: 'austria',   SWE: 'sweden',
  NOR: 'norway',       TUR: 'turkey',      EGY: 'egypt',
  CIV: 'ivory coast',  RSA: 'south africa', ALG: 'algeria',
  COD: 'dr congo',     NZL: 'new zealand', CPV: 'cape verde',
  JOR: 'jordan',       IRQ: 'iraq',        UZB: 'uzbekistan',
  CUW: 'curacao',      HAI: 'haiti',       PAR: 'paraguay',
  PAN: 'panama',       BIH: 'bosnia and herzegovina',
  SCO: 'scotland',     CRC: 'costa rica',
}

/* ═══════════════════════════════════════════════════════════════
   API-FOOTBALL PHOTO CACHE
   Pre-carga los IDs/fotos de los 1248 jugadores (48 × 26) en
   background. Persiste en localStorage 30 días.
   Las fotos son URLs públicas CDN — no necesitan auth.
═══════════════════════════════════════════════════════════════ */
const AF_LS_KEY = 'wc2026_af_photos_v2'
const AF_LS_TTL = 30 * 24 * 60 * 60 * 1000   // 30 días

/* Estado global del módulo */
let _afCache     = null              // null = no cargado, {} = vacío/cuota, {…} = OK
let _afPromise   = null              // Promise mientras carga
const _afWaiters = new Set()         // callbacks que esperan el cache

/* Normaliza nombre para comparación: sin acentos, minúsculas */
function normKey(name) {
  return (name ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
}

async function buildAfCache() {
  /* 1 — Intentar localStorage */
  try {
    const raw = localStorage.getItem(AF_LS_KEY)
    if (raw) {
      const { ts, photos } = JSON.parse(raw)
      if (Date.now() - ts < AF_LS_TTL && Object.keys(photos ?? {}).length > 200) {
        return photos
      }
    }
  } catch { /* localStorage no disponible */ }

  /* 2 — Fetch desde API-Football (/players/squads por equipo) */
  const teamIds = Object.values(TEAM_API_MAP).map(t => t.id).filter(Boolean)
  const photos  = {}
  let quotaHit  = false

  const BATCH = 5
  for (let i = 0; i < teamIds.length && !quotaHit; i += BATCH) {
    const batch = teamIds.slice(i, i + BATCH)
    await Promise.all(batch.map(async id => {
      if (quotaHit) return
      try {
        const res = await fetch(`${API_BASE}/players/squads?team=${id}`, {
          headers: { 'x-apisports-key': API_KEY },
        })
        const json = await res.json()
        if (json.errors?.requests) { quotaHit = true; return }
        for (const p of (json.response?.[0]?.players ?? [])) {
          if (p.name && p.photo) photos[normKey(p.name)] = p.photo
        }
      } catch { /* ignorar errores de red individuales */ }
    }))
  }

  /* 3 — Persistir si obtuvimos datos suficientes */
  if (Object.keys(photos).length > 200) {
    try {
      localStorage.setItem(AF_LS_KEY, JSON.stringify({ ts: Date.now(), photos }))
    } catch { /* storage lleno */ }
  }

  return photos
}

/* Inicia la construcción del cache (idempotente) */
export function initAfPhotoCache() {
  if (_afCache !== null || _afPromise) return

  _afPromise = buildAfCache().then(photos => {
    _afCache = photos
    _afPromise = null
    /* Notificar a todos los hooks que esperaban */
    _afWaiters.forEach(fn => fn(photos))
    _afWaiters.clear()
  })
}

/* ═══════════════════════════════════════════════════════════════
   buildLocalTeams — 48 selecciones WC2026 desde JSON local
═══════════════════════════════════════════════════════════════ */
function buildLocalTeams() {
  return Object.entries(localData.selecciones)
    .map(([code, sel]) => {
      const api = TEAM_API_MAP[code]
      return {
        team: {
          id:      api?.id ?? null,
          name:    sel.nombre,
          country: sel.confederacion,
          logo:    api ? `${CDN_LOGO}/${api.id}.png` : null,
          _flag:   sel.bandera,
          _grupo:  sel.grupo,
          _conf:   sel.confederacion,
          _codigo: code,
          _color:  sel.color_principal,
          _nameEN: CODE_TO_ENGLISH[code] ?? sel.nombre,
        },
        venue: {},
      }
    })
    .sort((a, b) => {
      const ga = a.team._grupo ?? 'ZZ'
      const gb = b.team._grupo ?? 'ZZ'
      if (ga !== gb) return ga.localeCompare(gb)
      return a.team.name.localeCompare(b.team.name, 'es')
    })
}

/* ═══════════════════════════════════════════════════════════════
   Hook: Equipos del Mundial 2026
   Usa datos locales — sin llamadas de red. Logos CDN públicos.
═══════════════════════════════════════════════════════════════ */
export function useWC2026Teams() {
  const [teams]   = useState(() => buildLocalTeams())
  const [loading] = useState(false)
  const [error]   = useState(null)

  const fetchTeams = useCallback(() => {}, [])

  return { teams, loading, error, fetchTeams }
}

/* ═══════════════════════════════════════════════════════════════
   Hook: Plantilla completa de un equipo — API-Football v3
   (Legacy — ya no se usa directamente, reemplazado por useWCSquads)
═══════════════════════════════════════════════════════════════ */
const POS_ORDER = { Goalkeeper: 0, Defender: 1, Midfielder: 2, Attacker: 3 }

export function useTeamRoster(teamId) {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const abortRef = useRef(null)

  const fetchPlayers = useCallback(async () => {
    if (!teamId) return
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl
    setLoading(true)
    setError(null)
    try {
      const json = await apiFetch(`/players/squads?team=${teamId}`, ctrl.signal)
      const squad = json.response?.[0]?.players ?? []
      setPlayers([...squad].sort((a, b) =>
        (POS_ORDER[a.position] ?? 9) - (POS_ORDER[b.position] ?? 9)
      ))
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message)
    } finally {
      if (!ctrl.signal.aborted) setLoading(false)
    }
  }, [teamId])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    setPlayers([])
    setError(null)
    setLoading(false)
  }, [])

  return { players, loading, error, fetchPlayers, reset }
}

/* ═══════════════════════════════════════════════════════════════
   Fotos — TheSportsDB (fallback si AF cache no tiene al jugador)
═══════════════════════════════════════════════════════════════ */
const _tsdbCache = new Map() // nameKey → url | null

function normName(name) {
  return name.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

async function fetchOneTsdbPhoto(name) {
  const key = normKey(name)
  if (_tsdbCache.has(key)) return _tsdbCache.get(key)
  try {
    const q   = encodeURIComponent(normName(name))
    const res = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${q}`
    )
    const json = await res.json()
    const url  = json.player?.[0]?.strThumb ?? null
    _tsdbCache.set(key, url)
    return url
  } catch {
    _tsdbCache.set(key, null)
    return null
  }
}

/* ═══════════════════════════════════════════════════════════════
   Hook: usePlayerPhotos
   Prioridad: 1) API-Football CDN (localStorage)  2) TheSportsDB
   Fallback final: avatar CSS con iniciales (en PlayerCard)
═══════════════════════════════════════════════════════════════ */
export function usePlayerPhotos(players) {
  const [photos, setPhotos] = useState({})

  useEffect(() => {
    if (!players?.length) return

    setPhotos({})
    let cancelled = false

    const run = async () => {
      const map     = {}
      const missing = []

      for (const p of players) {
        const key = normKey(p.name)

        /* 1 — JSON estático pre-compilado (instantáneo, sin red) */
        const staticUrl = staticPhotos[key]
        if (staticUrl) { map[p.name] = staticUrl; continue }

        /* 2 — API-Football CDN (localStorage, populated cuando hay quota) */
        const afUrl = _afCache?.[key]
        if (afUrl) { map[p.name] = afUrl; continue }

        /* 3 — TheSportsDB buscado previamente (en memoria) */
        const tsdb = _tsdbCache.get(key)
        if (tsdb !== undefined) { if (tsdb) map[p.name] = tsdb; continue }

        missing.push(p)
      }

      if (Object.keys(map).length && !cancelled) setPhotos({ ...map })
      if (!missing.length || cancelled) return

      /* 4 — TheSportsDB individual para los que quedan sin foto */
      const BATCH = 4
      for (let i = 0; i < missing.length; i += BATCH) {
        if (cancelled) return
        const batch = missing.slice(i, i + BATCH)
        const results = await Promise.allSettled(
          batch.map(p => fetchOneTsdbPhoto(p.name).then(url => ({ name: p.name, url })))
        )
        if (cancelled) return
        for (const r of results) {
          if (r.status === 'fulfilled' && r.value.url) map[r.value.name] = r.value.url
        }
        setPhotos({ ...map })
      }
    }

    run()
    return () => { cancelled = true }
  }, [players])

  return { photos }
}
