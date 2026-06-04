import { useRef } from 'react'
import data from '../data/worldcup-data.json'
import GrupoTable from '../components/grupos/GrupoTable.jsx'
import { useGSAPReveal, useGSAPRevealItem } from '../hooks/useGSAPReveal.js'

export default function GruposPage() {
  const grupos   = Object.entries(data.grupos)
  const gridRef  = useGSAPReveal({ stagger: 0.06, y: 36, duration: 0.65, start: 'top 85%' })
  const headRef  = useGSAPRevealItem({ y: -20, duration: 0.55 })

  return (
    <section>
      {/* Header */}
      <div ref={headRef} className="mb-8">
        <p className="font-condensed text-gris text-xs tracking-widest mb-1">FASE DE GRUPOS · 12 GRUPOS · 4 EQUIPOS</p>
        <h2
          className="font-display text-4xl sm:text-5xl"
          style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", color: '#C8922A' }}
        >
          TABLA DE GRUPOS
        </h2>
        <p className="font-condensed text-gris text-sm mt-0.5">
          Los 2 primeros de cada grupo + los 8 mejores terceros clasifican a dieciseisavos
        </p>
      </div>

      {/* Grid de grupos */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
      >
        {grupos.map(([letra, grupo]) => (
          <GrupoTable key={letra} letra={letra} equipos={grupo.equipos} />
        ))}
      </div>

      {/* Info footer */}
      <div className="mt-10 p-5 rounded-xl border"
        style={{ background: 'rgba(21,34,56,0.6)', borderColor: 'rgba(27,58,107,0.6)' }}>
        <h3 className="font-condensed text-oro text-lg mb-3">FORMATO DEL TORNEO</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { fase: 'GRUPOS',       desc: '12 grupos × 4',  icon: '🏟️' },
            { fase: '1/32',         desc: '32 equipos',      icon: '⚔️' },
            { fase: 'OCTAVOS',      desc: '16 equipos',      icon: '🔥' },
            { fase: 'GRAN FINAL',   desc: 'MetLife · 19 Jul', icon: '🏆' },
          ].map(({ fase, desc, icon }) => (
            <div key={fase} className="flex flex-col items-center gap-1">
              <span className="text-2xl">{icon}</span>
              <p className="font-condensed font-bold text-blanco text-sm">{fase}</p>
              <p className="font-condensed text-gris text-xs">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
