export default async function handler(req, res) {
  const parts   = Array.isArray(req.query.path) ? req.query.path : [req.query.path ?? '']
  const subPath = '/' + parts.join('/')

  const extra = { ...req.query }
  delete extra.path
  const qs = new URLSearchParams(extra).toString()

  const url = `https://api.football-data.org/v4${subPath}${qs ? '?' + qs : ''}`

  try {
    const upstream = await fetch(url, {
      headers: { 'X-Auth-Token': process.env.FD_KEY ?? '' },
    })
    const body = await upstream.json()
    res.setHeader('Cache-Control', 'no-store')
    res.status(upstream.status).json(body)
  } catch (err) {
    res.status(500).json({ error: 'proxy_error', detail: err.message })
  }
}
