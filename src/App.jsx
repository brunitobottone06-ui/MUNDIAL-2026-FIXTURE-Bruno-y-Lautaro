import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import HeroSection  from './components/hero/HeroSection.jsx'
import FixturePage  from './pages/FixturePage.jsx'
import GruposPage   from './pages/GruposPage.jsx'
import EstadiosPage from './pages/EstadiosPage.jsx'
import EquiposPage  from './pages/EquiposPage.jsx'
import { useGSAPReveal } from './hooks/useGSAPReveal.js'

const TABS = [
  { id: 'home',     label: 'Inicio'   },
  { id: 'fixture',  label: 'Fixture'  },
  { id: 'grupos',   label: 'Grupos'   },
  { id: 'equipos',  label: 'Equipos'  },
  { id: 'estadios', label: 'Estadios' },
]

export default function App() {
  const [activeTab,  setActiveTab]  = useState('home')
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef(null)

  function navigate(tab) {
    setActiveTab(tab)
    setMobileOpen(false)
    if (tab !== 'home') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* Fade entre páginas */
  const pageRef = useRef(null)
  useEffect(() => {
    const el = pageRef.current
    if (!el) return
    gsap.fromTo(el,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    )
  }, [activeTab])

  return (
    <div className="min-h-screen bg-azul-noche text-blanco font-barlow">
      {/* Canvas confetti */}
      <canvas
        id="confetti-canvas"
        className="fixed inset-0 pointer-events-none z-[9999]"
        style={{ width: '100vw', height: '100vh' }}
      />

      {/* ── Navbar ── */}
      <header
        className="sticky top-0 z-50 border-b border-azul-acento"
        style={{
          background: 'rgba(21,34,56,0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        {/* Barra dorada superior */}
        <div className="h-px w-full"
          style={{ background: 'linear-gradient(90deg, transparent 0%, #C8922A 30%, #E5B857 50%, #C8922A 70%, transparent 100%)' }}
        />

        <div className="max-w-site mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2.5 shrink-0 group"
            style={{ transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <div className="trophy-glow w-8 h-8 flex items-center justify-center">
              <span className="text-xl relative z-10">⚽</span>
            </div>
            <div className="leading-none">
              <p className="font-display text-oro tracking-wide leading-none text-xl"
                style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}>
                FIFA WORLD CUP 2026™
              </p>
              <p className="font-condensed text-gris text-[10px] tracking-[3px]">USA · CANADÁ · MÉXICO</p>
            </div>
          </button>

          {/* Desktop nav */}
          <nav ref={navRef} className="hidden md:flex items-center gap-0.5">
            {TABS.map(tab => (
              <NavButton key={tab.id} tab={tab} active={activeTab === tab.id} onClick={() => navigate(tab.id)} />
            ))}
          </nav>

          {/* Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg"
            style={{ transition: 'background 0.15s' }}
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Menú"
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(27,58,107,0.5)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div className="w-5 flex flex-col gap-1.5">
              <span className="block h-px w-full"
                style={{ background: mobileOpen ? '#C8922A' : '#F5F0E8', transform: mobileOpen ? 'rotate(45deg) translate(2px, 4px)' : 'none', transition: 'transform 0.2s, background 0.2s' }} />
              <span className="block h-px w-full"
                style={{ background: '#F5F0E8', opacity: mobileOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
              <span className="block h-px w-full"
                style={{ background: mobileOpen ? '#C8922A' : '#F5F0E8', transform: mobileOpen ? 'rotate(-45deg) translate(2px, -4px)' : 'none', transition: 'transform 0.2s, background 0.2s' }} />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="md:hidden px-4 pb-4 pt-2 flex flex-col gap-1 border-t border-azul-acento"
            style={{ background: 'rgba(21,34,56,0.98)', animation: 'fadeUp 0.2s ease forwards' }}
          >
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => navigate(tab.id)}
                className="font-condensed font-semibold text-left px-4 py-2.5 rounded-lg text-sm"
                style={{
                  background:  activeTab === tab.id ? '#D10A11' : 'transparent',
                  color:       activeTab === tab.id ? '#fff'    : '#8A8A8A',
                  transition:  'all 0.15s ease',
                }}
                onMouseEnter={e => { if (activeTab !== tab.id) e.currentTarget.style.background = 'rgba(27,58,107,0.5)'; e.currentTarget.style.color = '#F5F0E8' }}
                onMouseLeave={e => { if (activeTab !== tab.id) e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = activeTab === tab.id ? '#fff' : '#8A8A8A' }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ── Contenido ── */}
      <main ref={pageRef}>
        {activeTab === 'home' && (
          <>
            <HeroSection onNavigate={navigate} />
            <div className="max-w-site mx-auto px-4 py-14">
              <QuickStats onNavigate={navigate} />
            </div>
          </>
        )}
        {activeTab !== 'home' && (
          <div className="max-w-site mx-auto px-4 py-8">
            {activeTab === 'fixture'  && <FixturePage />}
            {activeTab === 'grupos'   && <GruposPage />}
            {activeTab === 'equipos'  && <EquiposPage />}
            {activeTab === 'estadios' && <EstadiosPage />}
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t mt-16 py-10 text-center relative overflow-hidden"
        style={{ borderColor: 'rgba(27,58,107,0.5)', background: '#0D1E36' }}>
        {/* Glow background sutil */}
        <div className="absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(200,146,42,0.4), transparent)' }} />

        <div
          className="font-display text-2xl mb-2"
          style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", color: '#C8922A' }}
        >
          FIFA WORLD CUP 2026™
        </div>
        <p className="font-condensed text-gris text-xs tracking-widest mb-4">
          11 JUN — 19 JUL · USA · CANADÁ · MÉXICO · 48 SELECCIONES
        </p>
        <div className="flex justify-center gap-6">
          {TABS.filter(t => t.id !== 'home').map(tab => (
            <button
              key={tab.id}
              onClick={() => navigate(tab.id)}
              className="font-condensed text-xs tracking-wider"
              style={{ color: '#8A8A8A', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#C8922A'}
              onMouseLeave={e => e.currentTarget.style.color = '#8A8A8A'}
            >
              {tab.label.toUpperCase()}
            </button>
          ))}
        </div>
        <p className="font-condensed text-[10px] mt-5 opacity-30" style={{ color: '#8A8A8A' }}>
          Sitio no oficial · Datos sujetos a confirmación oficial FIFA
        </p>
      </footer>
    </div>
  )
}

/* ── NavButton con underline animada ── */
function NavButton({ tab, active, onClick }) {
  const btnRef = useRef(null)
  const lineRef = useRef(null)

  function onEnter() {
    if (active) return
    gsap.to(lineRef.current, { scaleX: 1, duration: 0.2, ease: 'power2.out' })
    gsap.to(btnRef.current,  { color: '#F5F0E8', duration: 0.15 })
  }
  function onLeave() {
    if (active) return
    gsap.to(lineRef.current, { scaleX: 0, duration: 0.2, ease: 'power2.in' })
    gsap.to(btnRef.current,  { color: '#8A8A8A', duration: 0.15 })
  }

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative font-condensed font-semibold text-sm px-4 py-2 rounded-lg"
      style={{
        color:      active ? '#fff'    : '#8A8A8A',
        background: active ? '#D10A11' : 'transparent',
        boxShadow:  active ? '0 0 14px rgba(209,10,17,0.4)' : 'none',
        transition: 'background 0.2s, box-shadow 0.2s',
      }}
    >
      {tab.label}
      {/* Underline deslizante solo para inactivos */}
      {!active && (
        <span
          ref={lineRef}
          className="absolute bottom-0.5 left-2 right-2 h-px rounded-full"
          style={{
            background: '#D10A11',
            transform: 'scaleX(0)',
            transformOrigin: 'left',
          }}
        />
      )}
    </button>
  )
}

/* ── QuickStats con glow-border en el trofeo ── */
function QuickStats({ onNavigate }) {
  const containerRef = useGSAPReveal({ stagger: 0.08, y: 30, duration: 0.65, start: 'top 90%' })

  const stats = [
    { icon: '⚽', value: '48', label: 'SELECCIONES', tab: 'equipos',  glow: false },
    { icon: '🏟️', value: '16', label: 'ESTADIOS',    tab: 'estadios', glow: false },
    { icon: '📅', value: '104', label: 'PARTIDOS',   tab: 'fixture',  glow: false },
    { icon: '🏆', value: '1',   label: 'TROFEO',     tab: 'fixture',  glow: true  },
  ]

  return (
    <div>
      <div className="text-center mb-8">
        <p className="font-condensed text-gris text-xs tracking-widest mb-1">EL TORNEO MÁS GRANDE DE LA HISTORIA</p>
        <h3 className="font-display text-3xl sm:text-4xl"
          style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", color: '#F5F0E8' }}>
          NÚMEROS DEL MUNDIAL
        </h3>
      </div>

      <div
        ref={containerRef}
        className="grid grid-cols-2 md:grid-cols-4 gap-5"
      >
        {stats.map(({ icon, value, label, tab, glow }) => (
          <StatCard
            key={label}
            icon={icon} value={value} label={label}
            tab={tab} glow={glow} onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  )
}

function StatCard({ icon, value, label, tab, glow, onNavigate }) {
  const cardRef = useRef(null)

  function onEnter() {
    gsap.to(cardRef.current, {
      y: -6, scale: 1.03,
      duration: 0.4, ease: 'power3.out',
    })
  }
  function onLeave() {
    gsap.to(cardRef.current, {
      y: 0, scale: 1,
      duration: 0.45, ease: 'power3.out',
    })
  }

  return (
    <button
      ref={cardRef}
      onClick={() => onNavigate(tab)}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`${glow ? 'glow-border' : 'card-premium'} w-full p-6 text-center relative`}
      style={{ willChange: 'transform' }}
    >
      {/* Ícono */}
      <span className="text-4xl mb-4 block"
        style={{ filter: glow ? 'drop-shadow(0 0 12px rgba(200,146,42,0.7))' : undefined }}
      >{icon}</span>

      {/* Valor */}
      <p
        className="font-display leading-none mb-1"
        style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: 'clamp(36px, 5vw, 52px)',
          background: glow
            ? 'linear-gradient(175deg, #E5B857 0%, #C8922A 50%, #f0cc6e 100%)'
            : undefined,
          WebkitBackgroundClip: glow ? 'text' : undefined,
          WebkitTextFillColor:  glow ? 'transparent' : undefined,
          backgroundClip:       glow ? 'text' : undefined,
          color: glow ? undefined : '#C8922A',
        }}
      >
        {value}
      </p>

      <p className="font-condensed text-gris text-xs tracking-widest">{label}</p>

      {/* Shine sweep interno */}
      {!glow && (
        <div className="card-shine pointer-events-none absolute inset-0 rounded-xl"
          style={{
            background: 'linear-gradient(105deg, transparent 30%, rgba(229,184,87,0.15) 50%, transparent 70%)',
            opacity: 0,
          }}
        />
      )}
    </button>
  )
}
