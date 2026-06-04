import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import Countdown from './Countdown.jsx'

/* ─── Mouse-follow spotlight ──────────────────────────────────────── */
function useMouseGlow(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width)  * 100
      const y = ((e.clientY - rect.top)  / rect.height) * 100
      el.style.setProperty('--mx', `${x}%`)
      el.style.setProperty('--my', `${y}%`)
    }
    el.addEventListener('mousemove', onMove, { passive: true })
    return () => el.removeEventListener('mousemove', onMove)
  }, [])
}

export default function HeroSection({ onNavigate }) {
  const sectionRef = useRef(null)
  const bgRef      = useRef(null)
  useMouseGlow(sectionRef)

  /* ── Parallax scroll ── */
  useEffect(() => {
    const bg = bgRef.current
    if (!bg) return
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      requestAnimationFrame(() => {
        bg.style.transform = `translateY(${window.scrollY * 0.3}px)`
        ticking = false
      })
      ticking = true
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── GSAP entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

      tl.from('.hero-eyebrow', { y: -30, opacity: 0, duration: 0.7 }, 0.15)
        .from('.hero-title',   { y:  80, opacity: 0, duration: 1.0, skewY: 2, transformOrigin: 'left center' }, 0.25)
        .from('.hero-year',    { y:  80, opacity: 0, duration: 1.0, skewY: 2, transformOrigin: 'left center' }, 0.35)
        .from('.hero-sub',     { y:  24, opacity: 0, duration: 0.65 }, 0.65)
        .from('.hero-countdown-label', { y: 16, opacity: 0, duration: 0.5 }, 0.78)
        .from('.hero-countdown',       { y: 24, opacity: 0, duration: 0.6 }, 0.85)
        .from('.hero-ctas > *', {
          y: 20, opacity: 0, duration: 0.5,
          stagger: { each: 0.1, ease: 'power2.out' }
        }, 1.0)
        .from('.hero-scroll', { opacity: 0, duration: 0.5 }, 1.35)
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[96vh] flex flex-col items-center justify-center overflow-hidden"
      style={{
        /* Mouse-follow spotlight via CSS custom props */
        '--mx': '50%', '--my': '50%',
      }}
    >
      {/* ── Background con parallax ── */}
      <div
        ref={bgRef}
        className="absolute inset-[-10%] will-change-transform"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1920&q=80'), linear-gradient(135deg, #0A1628, #152238)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* ── Overlay multicapa ── */}
      <div className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at var(--mx) var(--my),
              rgba(200,146,42,0.07) 0%, transparent 70%),
            linear-gradient(to bottom,
              rgba(10,22,40,0.65) 0%,
              rgba(10,22,40,0.80) 50%,
              rgba(10,22,40,1)    100%)
          `,
        }}
      />

      {/* ── Grain texture ── */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px',
        }}
      />

      {/* ── Líneas horizontales decorativas ── */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(200,146,42,0.4), transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(200,146,42,0.2), transparent)' }} />

      {/* ── Contenido ── */}
      <div className="relative z-10 text-center px-4 w-full max-w-5xl mx-auto">

        {/* Eyebrow */}
        <p className="hero-eyebrow font-condensed text-oro tracking-[6px] text-sm sm:text-base mb-5">
          23ª COPA DEL MUNDO FIFA™ &nbsp;·&nbsp; 48 SELECCIONES
        </p>

        {/* Título principal — dividido para el stagger individual */}
        <div className="overflow-hidden mb-1 leading-none">
          <h1 className="hero-title font-display leading-none"
            style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: 'clamp(72px, 16vw, 168px)',
              color: '#F5F0E8',
              textShadow: '0 2px 60px rgba(0,0,0,0.7)',
            }}
          >MUNDIAL</h1>
        </div>

        <div className="overflow-hidden leading-none mb-7">
          <h2 className="hero-year font-display"
            style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: 'clamp(88px, 20vw, 210px)',
              /* Brillo metálico en el texto */
              background: 'linear-gradient(175deg, #E5B857 0%, #C8922A 35%, #f0cc6e 55%, #C8922A 75%, #a06e18 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 40px rgba(200,146,42,0.5))',
            }}
          >2026</h2>
        </div>

        {/* Subtítulo */}
        <p className="hero-sub font-condensed text-gris tracking-[4px] text-sm sm:text-lg mb-10">
          11 JUN — 19 JUL &nbsp;
          <span className="text-blanco font-semibold">USA</span> &nbsp;·&nbsp;
          <span className="text-blanco font-semibold">CANADÁ</span> &nbsp;·&nbsp;
          <span className="text-blanco font-semibold">MÉXICO</span>
        </p>

        {/* Countdown */}
        <p className="hero-countdown-label font-condensed text-gris text-xs tracking-[3px] mb-4 uppercase">
          Cuenta regresiva al pitazo inicial
        </p>
        <div className="hero-countdown mb-10">
          <Countdown />
        </div>

        {/* CTA buttons */}
        <div className="hero-ctas flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => onNavigate('fixture')}
            className="btn-cta text-lg px-9 py-3 rounded-xl"
          >
            VER FIXTURE
          </button>

          <button
            onClick={() => onNavigate('grupos')}
            className="font-condensed font-bold text-lg px-9 py-3 rounded-xl border-2 tracking-widest transition-all hover:scale-105 active:scale-95"
            style={{
              borderColor: '#C8922A',
              color: '#C8922A',
              transition: 'transform var(--transition-spring), box-shadow var(--transition-fast), background 0.2s, color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background   = '#C8922A'
              e.currentTarget.style.color        = '#0A1628'
              e.currentTarget.style.boxShadow    = '0 0 24px rgba(200,146,42,0.5)'
              e.currentTarget.style.transform    = 'scale(1.05) translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background   = 'transparent'
              e.currentTarget.style.color        = '#C8922A'
              e.currentTarget.style.boxShadow    = 'none'
              e.currentTarget.style.transform    = 'scale(1)'
            }}
          >
            GRUPOS
          </button>

          <button
            onClick={() => onNavigate('estadios')}
            className="font-condensed font-bold text-lg px-9 py-3 rounded-xl border tracking-widest"
            style={{
              borderColor: '#1B3A6B',
              color: '#F5F0E8',
              transition: 'transform var(--transition-spring), box-shadow var(--transition-fast), background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background   = 'rgba(27,58,107,0.8)'
              e.currentTarget.style.borderColor  = '#C8922A'
              e.currentTarget.style.boxShadow    = '0 0 18px rgba(27,58,107,0.5)'
              e.currentTarget.style.transform    = 'scale(1.05) translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background   = 'transparent'
              e.currentTarget.style.borderColor  = '#1B3A6B'
              e.currentTarget.style.boxShadow    = 'none'
              e.currentTarget.style.transform    = 'scale(1)'
            }}
          >
            ESTADIOS
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-condensed text-gris text-[10px] tracking-[4px]">SCROLL</span>
        <div className="w-px h-10 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1/2"
            style={{
              background: 'linear-gradient(to bottom, #C8922A, transparent)',
              animation: 'reveal-up 1.2s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </section>
  )
}
