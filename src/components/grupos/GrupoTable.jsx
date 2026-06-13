import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import data from '../../data/worldcup-data.json'
import { FlagImg } from '../../utils/flagUtils.jsx'

gsap.registerPlugin(ScrollTrigger)

function calcStandings(equipos, partidos) {
  const stats = {}
  equipos.forEach(code => {
    stats[code] = { pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0 }
  })
  for (const partido of (partidos ?? [])) {
    if (partido.estado === 'programado') continue
    const { local, visitante, goles_local, goles_visitante } = partido
    if (!stats[local] || !stats[visitante]) continue
    const gl = goles_local     ?? 0
    const gv = goles_visitante ?? 0
    stats[local].pj++;    stats[visitante].pj++
    stats[local].gf    += gl; stats[local].gc    += gv
    stats[visitante].gf += gv; stats[visitante].gc += gl
    if      (gl > gv) { stats[local].g++;     stats[visitante].p++ }
    else if (gl < gv) { stats[visitante].g++;  stats[local].p++ }
    else              { stats[local].e++;      stats[visitante].e++ }
  }
  return equipos
    .map(code => ({
      code,
      ...stats[code],
      pts: stats[code].g * 3 + stats[code].e,
      dg:  stats[code].gf - stats[code].gc,
    }))
    .sort((a, b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf)
}

export default function GrupoTable({ letra, equipos, partidos = [], standings = null }) {
  const tableRef = useRef(null)

  /* Stagger en filas al aparecer en viewport */
  useEffect(() => {
    const el = tableRef.current
    if (!el) return
    const rows = el.querySelectorAll('tbody tr')
    gsap.set(rows, { opacity: 0, x: -16 })

    const ctx = gsap.context(() => {
      gsap.to(rows, {
        opacity: 1, x: 0,
        duration: 0.45,
        ease: 'power2.out',
        stagger: 0.07,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  /* Hover en filas — efecto Norris rápido */
  function onRowEnter(e) {
    const row = e.currentTarget
    gsap.to(row, {
      x: 5, backgroundColor: 'rgba(27,58,107,0.7)',
      duration: 0.2, ease: 'power2.out',
      overwrite: true,
    })
  }
  function onRowLeave(e) {
    const row = e.currentTarget
    gsap.to(row, {
      x: 0, backgroundColor: 'transparent',
      duration: 0.3, ease: 'power3.out',
      overwrite: true,
    })
  }

  return (
    <div
      ref={tableRef}
      className="rounded-xl overflow-hidden relative"
      style={{
        background: 'linear-gradient(145deg, #152238 0%, #0D1929 55%, #111E30 100%)',
        border: '1px solid rgba(27,58,107,0.8)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(200,146,42,0.08)',
      }}
    >
      {/* Header con acento dorado mejorado */}
      <div
        className="px-4 py-3 flex items-center justify-between relative overflow-hidden"
        style={{
          background: 'linear-gradient(90deg, rgba(27,58,107,0.95) 0%, rgba(21,34,56,0.85) 60%, rgba(13,25,41,0.7) 100%)',
          borderBottom: '1px solid rgba(200,146,42,0.3)',
        }}
      >
        {/* Línea dorada izquierda */}
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r"
          style={{ background: 'linear-gradient(to bottom, #E5B857, #C8922A, #E5B857)' }} />
        {/* Shine sutil en header */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(229,184,87,0.06) 50%, transparent 70%)' }} />

        <span
          className="font-display text-2xl tracking-widest pl-3 relative z-10"
          style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            background: 'linear-gradient(90deg, #E5B857 0%, #C8922A 70%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          GRUPO {letra}
        </span>

        <div className="flex gap-1.5 items-center relative z-10">
          {equipos.map(codigo => (
            <FlagImg
              key={codigo}
              code={codigo}
              alt={data.selecciones[codigo]?.nombre ?? codigo}
              size={22}
            />
          ))}
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr
            className="font-condensed font-bold text-[11px] tracking-widest uppercase"
            style={{
              color: '#6a7a8f',
              borderBottom: '1px solid rgba(200,146,42,0.15)',
              background: 'rgba(13,25,41,0.5)',
            }}
          >
            <th className="px-4 py-2 text-left">SELECCIÓN</th>
            <th className="px-1.5 py-2 text-center">PJ</th>
            <th className="px-1.5 py-2 text-center">G</th>
            <th className="px-1.5 py-2 text-center">E</th>
            <th className="px-1.5 py-2 text-center">P</th>
            <th className="px-1.5 py-2 text-center">DG</th>
            <th className="px-1.5 py-2 text-center font-bold" style={{ color: '#C8922A' }}>PTS</th>
          </tr>
        </thead>

        <tbody>
          {(standings ?? calcStandings(equipos, partidos)).map((row, i) => {
            const sel = data.selecciones[row.code]
            const isClasificado   = i < 2
            const isPosibleClasif = i === 2
            const cols = [row.pj, row.g, row.e, row.p, row.dg, row.pts]

            return (
              <tr
                key={row.code}
                className="cursor-default"
                style={{
                  borderBottom: i < equipos.length - 1 ? '1px solid rgba(27,58,107,0.4)' : 'none',
                  borderLeft: isClasificado
                    ? '2px solid #00B341'
                    : isPosibleClasif
                    ? '2px solid rgba(200,146,42,0.6)'
                    : '2px solid transparent',
                }}
                onMouseEnter={onRowEnter}
                onMouseLeave={onRowLeave}
              >
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <FlagImg code={row.code} alt={sel?.nombre ?? row.code} size={26} />
                    <span className="font-condensed font-semibold text-blanco text-sm leading-tight">
                      {sel?.nombre ?? row.code}
                    </span>
                  </div>
                </td>
                {cols.map((v, j) => (
                  <td key={j} className="px-1.5 py-2.5 text-center font-condensed text-sm"
                    style={{ color: j === 5 ? '#F5F0E8' : '#8A8A8A', fontWeight: j === 5 ? 700 : 400 }}>
                    {v}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Footer legend */}
      <div className="px-4 py-2 flex items-center gap-4"
        style={{ borderTop: '1px solid rgba(27,58,107,0.4)', background: 'rgba(10,22,40,0.3)' }}>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: '#00B341' }} />
          <span className="font-condensed text-[10px] tracking-wider" style={{ color: '#00B341' }}>
            CLASIFICADOS
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: '#C8922A', opacity: 0.6 }} />
          <span className="font-condensed text-[10px] tracking-wider text-gris">
            POSIBLE 3°
          </span>
        </div>
      </div>
    </div>
  )
}
