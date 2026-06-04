import { useState, useMemo, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import data from '../data/worldcup-data.json'
import { useGSAPRevealItem } from '../hooks/useGSAPReveal.js'

gsap.registerPlugin(ScrollTrigger)

const CONFEDERACIONES = ['Todas', 'UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC', 'OFC']

/* TeamCard con shine-sweep + micro 3D tilt */
function TeamCard({ codigo, sel }) {
  const cardRef = useRef(null)

  function onMove(e) {
    const el   = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 14
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 10
    gsap.to(el, {
      rotateY: x, rotateX: -y,
      duration: 0.25, ease: 'power2.out', overwrite: true,
    })
  }

  function onEnter() {
    const el = cardRef.current
    if (!el) return
    gsap.to(el, {
      y: -6, scale: 1.03,
      duration: 0.35, ease: 'power3.out', overwrite: true,
    })
    /* Shine sweep */
    const shine = el.querySelector('.team-shine')
    if (shine) {
      gsap.fromTo(shine,
        { x: '-120%', skewX: -12, opacity: 1 },
        { x:  '220%', skewX: -12, opacity: 0, duration: 0.55, ease: 'power2.out' }
      )
    }
  }

  function onLeave() {
    const el = cardRef.current
    if (!el) return
    gsap.to(el, {
      y: 0, scale: 1, rotateY: 0, rotateX: 0,
      duration: 0.5, ease: 'power3.out', overwrite: true,
    })
  }

  return (
    <div
      ref={cardRef}
      className="card-premium flex flex-col items-center gap-3 p-4 cursor-pointer"
      style={{ perspective: '600px', transformStyle: 'preserve-3d' }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
    >
      {/* Shine layer */}
      <div className="team-shine pointer-events-none absolute inset-0 rounded-xl z-20"
        style={{
          background: 'linear-gradient(105deg, transparent 30%, rgba(229,184,87,0.2) 50%, transparent 70%)',
          willChange: 'transform, opacity',
        }}
      />

      {/* Blob de color del país */}
      <div className="relative w-14 h-14 flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full opacity-20 transition-opacity duration-200 group-hover:opacity-50"
          style={{ background: `radial-gradient(circle, ${sel.color_principal}, transparent)` }}
        />
        <span className="text-4xl relative z-10 drop-shadow-md">{sel.bandera}</span>
      </div>

      <div className="text-center">
        <p className="font-condensed font-bold text-blanco text-sm leading-tight">{sel.nombre}</p>
        <div className="flex items-center justify-center gap-1.5 mt-1.5">
          <span className="font-condensed text-[9px] tracking-wider" style={{ color: '#8A8A8A' }}>
            {sel.confederacion}
          </span>
          <span style={{ color: '#8A8A8A', opacity: 0.4 }}>·</span>
          <span
            className="font-condensed text-[10px] font-bold px-1.5 py-0.5 rounded-md text-white"
            style={{ background: '#D10A11', letterSpacing: '0.05em' }}
          >
            GRP {sel.grupo}
          </span>
        </div>
      </div>

      {/* Stripe de colores del equipo */}
      <div
        className="w-full h-px rounded-full opacity-50"
        style={{ background: `linear-gradient(to right, ${sel.color_principal}, ${sel.color_secundario})` }}
      />
    </div>
  )
}

export default function EquiposPage() {
  const [confed, setConfed] = useState('Todas')
  const [search, setSearch] = useState('')
  const gridRef  = useRef(null)
  const headRef  = useGSAPRevealItem({ y: -18, duration: 0.5 })

  const equipos = useMemo(() => {
    return Object.entries(data.selecciones).filter(([, sel]) => {
      const matchC = confed === 'Todas' || sel.confederacion === confed
      const matchS = !search || sel.nombre.toLowerCase().includes(search.toLowerCase())
      return matchC && matchS
    })
  }, [confed, search])

  /* Re-anima el grid al cambiar filtro */
  useEffect(() => {
    const el = gridRef.current
    if (!el) return
    const cards = el.querySelectorAll('.card-premium')
    gsap.fromTo(cards,
      { opacity: 0, y: 20, scale: 0.96 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.4, ease: 'power3.out',
        stagger: { each: 0.035, ease: 'none' },
      }
    )
  }, [equipos])

  return (
    <section>
      {/* Header */}
      <div ref={headRef} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
        <div>
          <p className="font-condensed text-gris text-xs tracking-widest mb-1">FIFA WORLD CUP 2026™</p>
          <h2 className="font-display text-4xl sm:text-5xl"
            style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", color: '#C8922A' }}>
            LAS 48 SELECCIONES
          </h2>
          <p className="font-condensed text-gris text-sm mt-0.5">
            {equipos.length} equipos · 6 confederaciones
          </p>
        </div>

        <input
          type="text"
          placeholder="Buscar selección..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="rounded-xl px-4 py-2 text-sm placeholder-gris focus:outline-none w-full sm:w-52"
          style={{
            background: '#152238',
            border: '1px solid #1B3A6B',
            color: '#F5F0E8',
            transition: 'border-color 0.2s',
          }}
          onFocus={e  => { e.target.style.borderColor = '#C8922A'; e.target.style.boxShadow = '0 0 0 1px rgba(200,146,42,0.2)' }}
          onBlur={e   => { e.target.style.borderColor = '#1B3A6B'; e.target.style.boxShadow = 'none' }}
        />
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-7">
        {CONFEDERACIONES.map(c => (
          <button
            key={c}
            onClick={() => setConfed(c)}
            className="font-condensed text-xs font-semibold px-3.5 py-1.5 rounded-lg"
            style={{
              background:  confed === c ? '#D10A11' : '#152238',
              color:       confed === c ? '#fff'    : '#8A8A8A',
              boxShadow:   confed === c ? '0 0 14px rgba(209,10,17,0.45)' : 'none',
              transform:   confed === c ? 'scale(1.06)' : 'scale(1)',
              transition:  'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
              border:      '1px solid transparent',
            }}
            onMouseEnter={e => {
              if (confed !== c) {
                e.currentTarget.style.color      = '#F5F0E8'
                e.currentTarget.style.background  = '#1B3A6B'
                e.currentTarget.style.transform   = 'scale(1.06)'
                e.currentTarget.style.borderColor = 'rgba(200,146,42,0.3)'
              }
            }}
            onMouseLeave={e => {
              if (confed !== c) {
                e.currentTarget.style.color       = '#8A8A8A'
                e.currentTarget.style.background  = '#152238'
                e.currentTarget.style.transform   = 'scale(1)'
                e.currentTarget.style.borderColor = 'transparent'
              }
            }}
          >
            {c.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3"
      >
        {equipos.map(([codigo, sel]) => (
          <TeamCard key={codigo} codigo={codigo} sel={sel} />
        ))}
      </div>

      {equipos.length === 0 && (
        <div className="text-center py-16">
          <span className="text-4xl">🔍</span>
          <p className="font-condensed text-gris text-lg mt-3">Sin resultados para "{search}"</p>
        </div>
      )}
    </section>
  )
}
