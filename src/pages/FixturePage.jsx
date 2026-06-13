import { useState, useMemo, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import data from '../data/worldcup-data.json'
import MatchCard from '../components/fixture/MatchCard.jsx'
import { useWCFixtures, useWCLive, mergeLive } from '../hooks/useFootballData.js'

gsap.registerPlugin(ScrollTrigger)

const GRUPOS = ['Todos', 'A','B','C','D','E','F','G','H','I','J','K','L']

function DayBlock({ fecha, partidos }) {
  const blockRef = useRef(null)

  useEffect(() => {
    const el = blockRef.current
    if (!el) return
    const cards = el.querySelectorAll('.match-row')
    gsap.set(cards, { opacity: 0, x: -20 })
    const ctx = gsap.context(() => {
      gsap.to(cards, {
        opacity: 1, x: 0, duration: 0.55, ease: 'power3.out',
        stagger: { each: 0.06, ease: 'none' },
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
      })
    }, el)
    return () => ctx.revert()
  }, [partidos])

  return (
    <div ref={blockRef} className="mb-8">
      {/* Encabezado de día — estilo editorial mundialista */}
      <div
        className="flex items-center gap-3 mb-3 px-3 py-2 rounded-lg relative overflow-hidden"
        style={{
          background: 'linear-gradient(90deg, rgba(27,58,107,0.55) 0%, rgba(27,58,107,0.15) 70%, transparent 100%)',
          borderLeft: '3px solid #C8922A',
        }}
      >
        <h3
          className="font-condensed font-bold text-sm tracking-widest uppercase"
          style={{
            background: 'linear-gradient(90deg, #E5B857 0%, #C8922A 60%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {formatFecha(fecha)}
        </h3>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, rgba(200,146,42,0.3), transparent)' }} />
        <span
          className="font-condensed font-bold text-xs px-2 py-0.5 rounded"
          style={{ background: 'rgba(200,146,42,0.12)', color: '#C8922A', border: '1px solid rgba(200,146,42,0.25)' }}
        >
          {partidos.length} {partidos.length === 1 ? 'PARTIDO' : 'PARTIDOS'}
        </span>
      </div>
      <div className="space-y-2">
        {partidos.map(p => <MatchCard key={p.id} partido={p} />)}
      </div>
    </div>
  )
}

/* Skeleton de carga — muestra mientras llega la primera respuesta de la API */
function LoadingSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-14 rounded-xl" style={{ background: '#152238', opacity: 0.6 - i * 0.08 }} />
      ))}
    </div>
  )
}

export default function FixturePage() {
  const [filtroGrupo, setFiltroGrupo] = useState('Todos')
  const headerRef = useRef(null)

  /* ── football-data.org hooks ── */
  const { fixtures, loading, error } = useWCFixtures()
  const { liveMatches, hasLive, lastSync } = useWCLive()

  /* GSAP entrance del header */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, { y: -20, opacity: 0, duration: 0.6, ease: 'power3.out' })
    }, headerRef)
    return () => ctx.revert()
  }, [])

  /* Fuente de partidos: API (con overlay live) o JSON como fallback */
  const allPartidos = useMemo(() => {
    const base = fixtures.length > 0 ? fixtures : data.partidos
    return base.map(p => mergeLive(p, liveMatches))
  }, [fixtures, liveMatches])

  const partidos = useMemo(() => {
    if (filtroGrupo === 'Todos') return allPartidos
    return allPartidos.filter(p => p.grupo === filtroGrupo)
  }, [allPartidos, filtroGrupo])

  const porFecha = useMemo(() => {
    return partidos.reduce((acc, p) => {
      if (!p.fecha) return acc
      if (!acc[p.fecha]) acc[p.fecha] = []
      acc[p.fecha].push(p)
      return acc
    }, {})
  }, [partidos])

  return (
    <section>
      {/* Header */}
      <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="font-condensed font-bold text-xs tracking-widest mb-1" style={{ color: '#8A8A8A' }}>FASE DE GRUPOS · JUNIO 2026</p>
          <div className="flex items-center gap-3">
            <h2
              className="font-display text-gold-gradient"
              style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 'clamp(3rem, 7vw, 5rem)', lineHeight: 1 }}
            >
              FIXTURE
            </h2>
            {hasLive && (
              <span
                className="font-condensed font-bold text-sm px-3 py-1 rounded-lg"
                style={{
                  background: 'rgba(209,10,17,0.15)',
                  border: '1px solid rgba(209,10,17,0.6)',
                  color: '#ff4444',
                  animation: 'glow-breathe 1.4s ease-in-out infinite',
                }}
              >
                🔴 EN VIVO
              </span>
            )}
          </div>
          <p className="font-condensed text-gris text-sm mt-0.5">
            {filtroGrupo === 'Todos'
              ? `${allPartidos.length} partidos · 12 grupos`
              : `${partidos.length} partidos · Grupo ${filtroGrupo}`}
            {lastSync && (
              <span className="ml-2" style={{ color: '#00B341', fontSize: '0.65rem' }}>
                · Actualizado {lastSync.toLocaleTimeString('es-AR', {
                  hour: '2-digit', minute: '2-digit', second: '2-digit'
                })}
              </span>
            )}
            {error && !fixtures.length && (
              <span className="ml-2 text-[0.65rem]" style={{ color: '#C8922A' }}>
                · Usando datos locales
              </span>
            )}
          </p>
        </div>

        {/* Filtros de grupo */}
        <div className="flex flex-wrap gap-1.5">
          {GRUPOS.map(g => (
            <button
              key={g}
              onClick={() => setFiltroGrupo(g)}
              className="font-condensed text-xs font-semibold px-3 py-1.5 rounded-lg"
              style={{
                background:   filtroGrupo === g ? '#D10A11' : '#152238',
                color:        filtroGrupo === g ? '#fff'    : '#8A8A8A',
                transform:    filtroGrupo === g ? 'scale(1.05)' : 'scale(1)',
                boxShadow:    filtroGrupo === g ? '0 0 12px rgba(209,10,17,0.4)' : 'none',
                transition:   'all 0.18s cubic-bezier(0.34,1.56,0.64,1)',
              }}
              onMouseEnter={e => {
                if (filtroGrupo !== g) {
                  e.currentTarget.style.color      = '#F5F0E8'
                  e.currentTarget.style.background = '#1B3A6B'
                  e.currentTarget.style.transform  = 'scale(1.05)'
                }
              }}
              onMouseLeave={e => {
                if (filtroGrupo !== g) {
                  e.currentTarget.style.color      = '#8A8A8A'
                  e.currentTarget.style.background = '#152238'
                  e.currentTarget.style.transform  = 'scale(1)'
                }
              }}
            >
              {g === 'Todos' ? 'TODOS' : g}
            </button>
          ))}
        </div>
      </div>

      {/* Partidos */}
      {loading && !fixtures.length ? (
        <LoadingSkeleton />
      ) : (
        <div>
          {Object.entries(porFecha)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([fecha, ps]) => (
              <DayBlock key={fecha} fecha={fecha} partidos={ps} />
            ))}
        </div>
      )}

      {!loading && partidos.length === 0 && (
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
