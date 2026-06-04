import { useState, useMemo, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import data from '../data/worldcup-data.json'
import MatchCard from '../components/fixture/MatchCard.jsx'

gsap.registerPlugin(ScrollTrigger)

const GRUPOS = ['Todos', 'A','B','C','D','E','F','G','H','I','J','K','L']

/* Bloque de partidos de un día — anima sus hijos al aparecer */
function DayBlock({ fecha, partidos }) {
  const blockRef = useRef(null)

  useEffect(() => {
    const el = blockRef.current
    if (!el) return
    const cards = el.querySelectorAll('.match-row')
    gsap.set(cards, { opacity: 0, x: -20 })

    const ctx = gsap.context(() => {
      gsap.to(cards, {
        opacity: 1, x: 0,
        duration: 0.55,
        ease: 'power3.out',
        stagger: { each: 0.06, ease: 'none' },
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      })
    }, el)

    return () => ctx.revert()
  }, [partidos])

  return (
    <div ref={blockRef}>
      {/* Day header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(to bottom, #C8922A, #E5B857)' }} />
        <h3 className="font-condensed text-blanco text-base tracking-wider">
          {formatFecha(fecha)}
        </h3>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, rgba(27,58,107,0.8), transparent)' }} />
        <span className="font-condensed text-gris text-xs">{partidos.length} {partidos.length === 1 ? 'partido' : 'partidos'}</span>
      </div>

      <div className="space-y-2 mb-7">
        {partidos.map(p => <MatchCard key={p.id} partido={p} />)}
      </div>
    </div>
  )
}

export default function FixturePage() {
  const [filtroGrupo, setFiltroGrupo] = useState('Todos')
  const headerRef = useRef(null)

  /* GSAP entrance del header */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, { y: -20, opacity: 0, duration: 0.6, ease: 'power3.out' })
    }, headerRef)
    return () => ctx.revert()
  }, [])

  const partidos = useMemo(() => {
    if (filtroGrupo === 'Todos') return data.partidos
    return data.partidos.filter(p => p.grupo === filtroGrupo)
  }, [filtroGrupo])

  const porFecha = useMemo(() => {
    return partidos.reduce((acc, p) => {
      if (!acc[p.fecha]) acc[p.fecha] = []
      acc[p.fecha].push(p)
      return acc
    }, {})
  }, [partidos])

  const totalPartidos = data.partidos.length

  return (
    <section>
      {/* Header */}
      <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="font-condensed text-gris text-xs tracking-widest mb-1">FASE DE GRUPOS · JUNIO 2026</p>
          <h2 className="font-display text-4xl sm:text-5xl"
            style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", color: '#C8922A' }}>
            FIXTURE
          </h2>
          <p className="font-condensed text-gris text-sm mt-0.5">
            {filtroGrupo === 'Todos'
              ? `${totalPartidos} partidos · 12 grupos`
              : `${partidos.length} partidos · Grupo ${filtroGrupo}`}
          </p>
        </div>

        {/* Filtros de grupo */}
        <div className="flex flex-wrap gap-1.5">
          {GRUPOS.map(g => (
            <button
              key={g}
              onClick={() => setFiltroGrupo(g)}
              className="font-condensed text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150"
              style={{
                background:   filtroGrupo === g ? '#D10A11' : '#152238',
                color:        filtroGrupo === g ? '#fff'    : '#8A8A8A',
                transform:    filtroGrupo === g ? 'scale(1.05)' : 'scale(1)',
                boxShadow:    filtroGrupo === g ? '0 0 12px rgba(209,10,17,0.4)' : 'none',
                transition:   'all 0.18s cubic-bezier(0.34,1.56,0.64,1)',
              }}
              onMouseEnter={e => {
                if (filtroGrupo !== g) {
                  e.currentTarget.style.color     = '#F5F0E8'
                  e.currentTarget.style.background = '#1B3A6B'
                  e.currentTarget.style.transform  = 'scale(1.05)'
                }
              }}
              onMouseLeave={e => {
                if (filtroGrupo !== g) {
                  e.currentTarget.style.color     = '#8A8A8A'
                  e.currentTarget.style.background = '#152238'
                  e.currentTarget.style.transform  = 'scale(1)'
                }
              }}
            >
              {g === 'Todos' ? 'TODOS' : `${g}`}
            </button>
          ))}
        </div>
      </div>

      {/* Partidos por fecha */}
      <div>
        {Object.entries(porFecha).map(([fecha, ps]) => (
          <DayBlock key={fecha} fecha={fecha} partidos={ps} />
        ))}
      </div>

      {partidos.length === 0 && (
        <div className="text-center py-16">
          <span className="text-4xl animate-bounce-ball inline-block">⚽</span>
          <p className="font-condensed text-gris text-lg mt-3">Sin partidos para este grupo</p>
        </div>
      )}
    </section>
  )
}

function formatFecha(iso) {
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  }).toUpperCase()
}
