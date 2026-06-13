import { useState, useRef, useEffect } from 'react'
import { FlagImg } from './utils/flagUtils.jsx'
import gsap from 'gsap'
import data from './data/worldcup-data.json'
import HeroSection  from './components/hero/HeroSection.jsx'
import FixturePage  from './pages/FixturePage.jsx'
import GruposPage   from './pages/GruposPage.jsx'
import EstadiosPage     from './pages/EstadiosPage.jsx'
import SeleccionesPage  from './pages/SeleccionesPage.jsx'
import { useGSAPReveal } from './hooks/useGSAPReveal.js'
import { useWCLive } from './hooks/useFootballData.js'

const TABS = [
  { id: 'home',        label: 'Inicio'      },
  { id: 'fixture',     label: 'Fixture'     },
  { id: 'grupos',      label: 'Grupos'      },
  { id: 'estadios',    label: 'Estadios'    },
  { id: 'selecciones', label: 'Selecciones' },
]

const HOSTS = ['USA', 'CAN', 'MEX']


export default function App() {
  const [activeTab,  setActiveTab]  = useState('home')
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef(null)

  /* Live indicator — activo cuando hay partidos en curso en football-data.org */
  const { hasLive } = useWCLive()

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
              <p className="font-condensed text-gris text-[10px] tracking-[3px]">
                {HOSTS.map((codigo, index) => (
                  <span key={codigo}>
                    <FlagImg code={codigo} alt={data.selecciones[codigo]?.nombre ?? codigo} size={16} className="inline-block mr-1 align-middle" />
                    {data.selecciones[codigo]?.nombre.toUpperCase()}
                    {index < HOSTS.length - 1 && ' · '}
                  </span>
                ))}
              </p>
            </div>
          </button>

          {/* Desktop nav */}
          <nav ref={navRef} className="hidden md:flex items-center gap-0.5">
            {TABS.map(tab => (
              <NavButton
                key={tab.id} tab={tab}
                active={activeTab === tab.id}
                onClick={() => navigate(tab.id)}
                liveIndicator={hasLive && tab.id === 'fixture'}
              />
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
          <div className="relative">
            {/* Glow radial desde arriba — único por página */}
            <div
              className="absolute inset-x-0 top-0 pointer-events-none"
              style={{
                height: '420px',
                background: 'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(27,58,107,0.45) 0%, transparent 70%)',
                zIndex: 0,
              }}
            />
            {/* Línea dorada superior de página */}
            <div className="gold-divider absolute top-0 inset-x-0 z-10" />

            <div className="relative z-10 max-w-site mx-auto px-4 py-8">
              {activeTab === 'fixture'     && <FixturePage />}
              {activeTab === 'grupos'      && <GruposPage />}
              {activeTab === 'estadios'    && <EstadiosPage />}
              {activeTab === 'selecciones' && <SeleccionesPage />}
            </div>
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
          11 JUN — 19 JUL · {HOSTS.map((codigo, index) => (
            <span key={codigo} className="inline-flex items-center gap-1">
              <FlagImg code={codigo} alt={data.selecciones[codigo]?.nombre ?? codigo} size={14} className="inline-block align-middle" />
              {data.selecciones[codigo]?.nombre.toUpperCase()}
              {index < HOSTS.length - 1 && <span className="mx-1">·</span>}
            </span>
          ))} · 48 SELECCIONES
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

        {/* ── Créditos — marca de agua premium ── */}
        <div className="mt-8 pt-6 border-t" style={{ borderColor: 'rgba(27,58,107,0.35)' }}>
          {/* Label */}
          <p className="font-condensed font-bold text-xs tracking-[0.25em] mb-5" style={{ color: '#6a7a8f' }}>
            ⚽&nbsp; DESARROLLADO POR
          </p>

          {/* Cards de los devs */}
          <div className="flex justify-center gap-4 flex-wrap">
            <DevCard
              name="BRUNO BOTTONE ALBERT"
              url="https://www.instagram.com/ph_brunitobottone/"
              handle="ph_brunitobottone"
            />
            <DevCard
              name="LAUTARO MARTINEZ"
              url="https://www.instagram.com/__laumartinezz/"
              handle="__laumartinezz"
            />
          </div>

          {/* Sub-leyenda */}
          <p className="font-condensed text-[10px] mt-5 tracking-widest" style={{ color: 'rgba(138,138,138,0.4)' }}>
            FIFA WORLD CUP 2026™ APP · TODOS LOS DERECHOS RESERVADOS
          </p>
        </div>
      </footer>
    </div>
  )
}

/* ── NavButton con underline animada ── */
function NavButton({ tab, active, onClick, liveIndicator = false }) {
  const btnRef  = useRef(null)
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

      {/* Punto pulsante 🔴 cuando hay partidos en vivo */}
      {liveIndicator && (
        <span
          className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
          style={{
            background: '#D10A11',
            boxShadow: '0 0 6px #D10A11',
            animation: 'glow-breathe 1s ease-in-out infinite',
          }}
        />
      )}

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
    { icon: '⚽', value: '48', label: 'SELECCIONES', tab: 'selecciones', glow: false },
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

/* ── Instagram icon SVG ── */
function InstagramIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  )
}

/* ── DevCard — tarjeta de desarrollador con link a Instagram ── */
function DevCard({ name, url, handle }) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-5 py-3.5 rounded-xl no-underline"
      style={{
        background: hovered
          ? 'linear-gradient(135deg, rgba(131,58,180,0.22) 0%, rgba(253,29,29,0.16) 50%, rgba(252,176,69,0.18) 100%)'
          : 'linear-gradient(135deg, rgba(21,34,56,0.95) 0%, rgba(13,25,41,0.95) 100%)',
        border: hovered
          ? '1px solid rgba(225,48,108,0.55)'
          : '1px solid rgba(200,146,42,0.3)',
        boxShadow: hovered
          ? '0 8px 32px rgba(225,48,108,0.22), 0 0 0 1px rgba(225,48,108,0.15)'
          : '0 2px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(200,146,42,0.08)',
        transform: hovered ? 'translateY(-4px) scale(1.03)' : 'translateY(0) scale(1)',
        transition: 'all 0.28s cubic-bezier(0.34,1.56,0.64,1)',
        textDecoration: 'none',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Ícono Instagram */}
      <div
        className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
        style={{
          background: hovered
            ? 'linear-gradient(45deg, #833AB4, #FD1D1D, #FCB045)'
            : 'rgba(200,146,42,0.15)',
          border: hovered ? 'none' : '1px solid rgba(200,146,42,0.3)',
          color: hovered ? '#fff' : '#C8922A',
          transition: 'all 0.25s ease',
        }}
      >
        <InstagramIcon size={18} />
      </div>

      {/* Nombre + handle */}
      <div className="text-left">
        {/* Nombre del dev */}
        <p
          className="font-condensed font-bold text-sm tracking-wider leading-tight"
          style={{
            color: hovered ? '#f77737' : '#E5B857',
            transition: 'color 0.25s ease',
          }}
        >
          {name}
        </p>
        {/* Handle de Instagram — oro prominente */}
        <p
          className="font-condensed font-bold tracking-wide mt-0.5"
          style={{
            fontSize: '0.82rem',
            color: hovered ? '#e1306c' : '#C8922A',
            textShadow: hovered
              ? '0 0 12px rgba(225,48,108,0.5)'
              : '0 0 10px rgba(200,146,42,0.45)',
            transition: 'color 0.25s ease, text-shadow 0.25s ease',
          }}
        >
          @{handle}
        </p>
      </div>

      {/* Flecha externa */}
      <span
        className="ml-auto text-xs shrink-0"
        style={{ color: hovered ? 'rgba(225,48,108,0.7)' : 'rgba(106,122,143,0.5)', transition: 'color 0.25s, transform 0.25s', transform: hovered ? 'translateX(2px)' : 'none' }}
      >
        ↗
      </span>
    </a>
  )
}
