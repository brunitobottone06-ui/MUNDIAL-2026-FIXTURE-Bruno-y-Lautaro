import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import data from '../../data/worldcup-data.json'

gsap.registerPlugin(ScrollTrigger)

export default function GrupoTable({ letra, equipos }) {
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
      className="rounded-xl overflow-hidden border border-azul-acento relative"
      style={{ background: '#152238' }}
    >
      {/* Header con acento dorado */}
      <div
        className="px-4 py-3 flex items-center justify-between relative overflow-hidden"
        style={{
          background: 'linear-gradient(90deg, #1B3A6B 0%, #152238 100%)',
          borderBottom: '1px solid rgba(200,146,42,0.25)',
        }}
      >
        {/* Línea dorada decorativa izquierda */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5"
          style={{ background: 'linear-gradient(to bottom, #C8922A, #E5B857, #C8922A)' }} />

        <span
          className="font-display text-xl tracking-wider pl-2"
          style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", color: '#C8922A' }}
        >
          GRUPO {letra}
        </span>

        {/* Mini shine sweep en hover del header */}
        <div className="flex gap-1">
          {equipos.map(codigo => (
            <span key={codigo} className="text-xs" title={data.selecciones[codigo]?.nombre}>
              {data.selecciones[codigo]?.bandera}
            </span>
          ))}
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr
            className="font-condensed text-[11px] tracking-wider uppercase"
            style={{ color: '#8A8A8A', borderBottom: '1px solid rgba(27,58,107,0.6)' }}
          >
            <th className="px-4 py-2 text-left">Selección</th>
            <th className="px-1.5 py-2 text-center">PJ</th>
            <th className="px-1.5 py-2 text-center">G</th>
            <th className="px-1.5 py-2 text-center">E</th>
            <th className="px-1.5 py-2 text-center">P</th>
            <th className="px-1.5 py-2 text-center">DG</th>
            <th className="px-1.5 py-2 text-center font-bold" style={{ color: '#F5F0E8' }}>PTS</th>
          </tr>
        </thead>

        <tbody>
          {equipos.map((codigo, i) => {
            const sel = data.selecciones[codigo]
            const isClasificado    = i < 2
            const isPosibleClasif  = i === 2

            return (
              <tr
                key={codigo}
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
                    <span className="text-base leading-none">{sel?.bandera}</span>
                    <span className="font-condensed font-semibold text-blanco text-sm leading-tight">
                      {sel?.nombre ?? codigo}
                    </span>
                  </div>
                </td>
                {['0','0','0','0','0','0'].map((v, j) => (
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
