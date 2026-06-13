/**
 * Genera src/data/player-photos.json
 * Ejecutar: node scripts/fetch-player-photos.js
 *
 * Fuente: TheSportsDB (gratuita, sin autenticación)
 * Estrategia:
 *   searchteams?t={name} → filtrar por strSport=Soccer → selección nacional
 *   lookup_all_players?id={teamId} → todos los jugadores
 */

import fs    from 'fs'
import path  from 'path'
import https from 'https'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TSDB = 'https://www.thesportsdb.com/api/v1/json/3'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'WC2026-Build/1.0' } }, res => {
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString()
        if (body.trim().startsWith('<')) {
          reject(Object.assign(new Error('RATE_LIMITED'), { isRateLimit: true }))
          return
        }
        try { resolve(JSON.parse(body)) }
        catch { reject(new Error(`JSON_PARSE`)) }
      })
    })
    req.on('error', reject)
    req.setTimeout(25000, () => { req.destroy(); reject(new Error('TIMEOUT')) })
  })
}

async function getRetry(url) {
  let backoff = 12000
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      return await get(url)
    } catch (e) {
      if (attempt === 5) throw e
      const wait = e.isRateLimit ? backoff : 4000
      console.log(`    ↻ intento ${attempt} (${e.message}) — esperar ${wait / 1000}s...`)
      await sleep(wait)
      if (e.isRateLimit) backoff = Math.min(backoff * 1.5, 60000)
    }
  }
}

function normKey(name) {
  return (name ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim()
}

/* Selecciones WC2026: los nombres deben coincidir con TheSportsDB */
const TEAMS = [
  { code: 'ARG', names: ['Argentina'] },
  { code: 'BRA', names: ['Brazil'] },
  { code: 'FRA', names: ['France'] },
  { code: 'GER', names: ['Germany'] },
  { code: 'ESP', names: ['Spain'] },
  { code: 'POR', names: ['Portugal'] },
  { code: 'NED', names: ['Netherlands', 'Holland'] },
  { code: 'BEL', names: ['Belgium'] },
  { code: 'ENG', names: ['England'] },
  { code: 'CRO', names: ['Croatia'] },
  { code: 'MAR', names: ['Morocco'] },
  { code: 'SEN', names: ['Senegal'] },
  { code: 'JPN', names: ['Japan'] },
  { code: 'KOR', names: ['South Korea', 'Korea Republic'] },
  { code: 'USA', names: ['United States', 'USA'] },
  { code: 'MEX', names: ['Mexico'] },
  { code: 'CAN', names: ['Canada'] },
  { code: 'AUS', names: ['Australia'] },
  { code: 'SUI', names: ['Switzerland'] },
  { code: 'ECU', names: ['Ecuador'] },
  { code: 'URU', names: ['Uruguay'] },
  { code: 'COL', names: ['Colombia'] },
  { code: 'GHA', names: ['Ghana'] },
  { code: 'TUN', names: ['Tunisia'] },
  { code: 'IRN', names: ['Iran'] },
  { code: 'QAT', names: ['Qatar'] },
  { code: 'KSA', names: ['Saudi Arabia'] },
  { code: 'CZE', names: ['Czech Republic', 'Czechia'] },
  { code: 'AUT', names: ['Austria'] },
  { code: 'SWE', names: ['Sweden'] },
  { code: 'NOR', names: ['Norway'] },
  { code: 'TUR', names: ['Turkey', 'Turkiye'] },
  { code: 'EGY', names: ['Egypt'] },
  { code: 'CIV', names: ['Ivory Coast', "Cote d'Ivoire"] },
  { code: 'RSA', names: ['South Africa'] },
  { code: 'ALG', names: ['Algeria'] },
  { code: 'COD', names: ['DR Congo', 'Congo DR'] },
  { code: 'NZL', names: ['New Zealand'] },
  { code: 'CPV', names: ['Cape Verde'] },
  { code: 'JOR', names: ['Jordan'] },
  { code: 'IRQ', names: ['Iraq'] },
  { code: 'UZB', names: ['Uzbekistan'] },
  { code: 'CUW', names: ['Curacao'] },
  { code: 'HAI', names: ['Haiti'] },
  { code: 'PAR', names: ['Paraguay'] },
  { code: 'PAN', names: ['Panama'] },
  { code: 'BIH', names: ['Bosnia and Herzegovina', 'Bosnia'] },
  { code: 'SCO', names: ['Scotland'] },
  { code: 'CRC', names: ['Costa Rica'] },
]

function isSoccer(team) {
  const sport = (team.strSport ?? '').toLowerCase()
  return sport === 'soccer' || sport === 'football'
}

function pickNationalTeam(teams, searchName) {
  if (!teams?.length) return null

  /* 1. Solo equipos de fútbol */
  const soccer = teams.filter(isSoccer)
  const pool   = soccer.length ? soccer : teams

  /* 2. Liga "International" → muy probable que sea la selección */
  const intl = pool.filter(t => t.strLeague?.toLowerCase().includes('international'))
  if (intl.length === 1) return intl[0]
  if (intl.length > 1) {
    /* Excluir sub-20, mujeres, etc. */
    const senior = intl.find(t =>
      !/u\d{2}|under|youth|women|femenin|ladies/i.test(t.strTeam ?? '')
    )
    return senior ?? intl[0]
  }

  /* 3. Nombre exacto del equipo = nombre buscado */
  const exact = pool.find(t =>
    t.strTeam?.toLowerCase() === searchName.toLowerCase()
  )
  if (exact) return exact

  /* 4. FIFA/World Cup en el nombre de la liga */
  const fifa = pool.find(t =>
    t.strLeague?.toLowerCase().includes('world cup') ||
    t.strLeague?.toLowerCase().includes('fifa')
  )
  if (fifa) return fifa

  return pool[0] ?? null
}

async function searchTeam(searchName) {
  const url = `${TSDB}/searchteams.php?t=${encodeURIComponent(searchName)}`
  const data = await getRetry(url)
  return data?.teams ?? []
}

async function fetchTeamPhotos(code, names) {
  let team = null

  /* Probar cada nombre alternativo */
  for (const name of names) {
    let allTeams
    try {
      allTeams = await searchTeam(name)
    } catch (e) {
      console.log(`  [${code}] ✗ ${name}: ${e.message.slice(0, 50)}`)
      continue
    }

    team = pickNationalTeam(allTeams, name)
    if (team) {
      console.log(`  [${code}] ✓ "${team.strTeam}" id=${team.idTeam} sport="${team.strSport}" league="${team.strLeague}"`)
      break
    }

    console.log(`  [${code}] ~ "${name}": ${allTeams.length} resultados, ninguno válido`)
    await sleep(1000)
  }

  if (!team) {
    console.log(`  [${code}] ✗ No encontrado`)
    return {}
  }

  await sleep(1800)

  let playersData
  try {
    playersData = await getRetry(`${TSDB}/lookup_all_players.php?id=${team.idTeam}`)
  } catch (e) {
    console.log(`  [${code}] ✗ Jugadores: ${e.message.slice(0, 40)}`)
    return {}
  }

  const photos = {}
  for (const p of (playersData.player ?? [])) {
    const photo = p.strThumb || p.strCutout || p.strRender
    if (p.strPlayer && photo) {
      photos[normKey(p.strPlayer)] = photo
    }
  }

  console.log(`  [${code}] → ${Object.keys(photos).length} fotos`)
  return photos
}

async function main() {
  console.log('═══════════════════════════════════════════════')
  console.log('   WC2026 Player Photos — TheSportsDB Build    ')
  console.log(`   ${TEAMS.length} selecciones · ~${TEAMS.length * 2} requests`)
  console.log('═══════════════════════════════════════════════\n')

  const all  = {}
  const done = []
  const fail = []

  for (let i = 0; i < TEAMS.length; i++) {
    const { code, names } = TEAMS[i]
    console.log(`[${String(i + 1).padStart(2)}/${TEAMS.length}] ${code}`)

    const photos = await fetchTeamPhotos(code, names)
    const count  = Object.keys(photos).length

    Object.assign(all, photos)

    if (count > 0) done.push({ code, count })
    else           fail.push(code)

    if (i < TEAMS.length - 1) await sleep(2500)
  }

  console.log('\n═══════════ RESUMEN ═══════════')
  console.log(`✓ ${done.length} equipos con fotos:`)
  done.forEach(({ code, count }) => console.log(`    ${code}: ${count}`))
  if (fail.length) {
    console.log(`✗ ${fail.length} sin fotos: ${fail.join(', ')}`)
  }

  const total = Object.keys(all).length
  console.log(`\n✓ Total: ${total} fotos únicas`)

  const outPath = path.resolve(__dirname, '..', 'src', 'data', 'player-photos.json')
  fs.writeFileSync(outPath, JSON.stringify(all, null, 2), 'utf8')
  const kb = (fs.statSync(outPath).size / 1024).toFixed(1)
  console.log(`✓ Guardado en src/data/player-photos.json (${kb} KB)`)
  console.log('\n→ Listo. Reiniciá el servidor: npm run dev')
}

main().catch(e => { console.error('\n✗ Error fatal:', e.message); process.exit(1) })
