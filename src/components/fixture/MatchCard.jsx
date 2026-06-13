import { useRef, useCallback } from 'react'
import data from '../../data/worldcup-data.json'
import { FlagImg } from '../../utils/flagUtils.jsx'

const ESTADO_CONFIG = {
  programado: { text: 'PRÓ',    cls: 'badge-scheduled' },
  en_vivo:    { text: '🔴 LIVE', cls: 'badge-live'      },
  finalizado: { text: 'FIN',    cls: 'badge-finished'   },
}

/* Shine sweep on hover via JS para máximo control */
function useShine(cardRef) {
  const hasEntered = useRef(false)

  const onEnter = useCallback(() => {
    const el = cardRef.current
    if (!el || hasEntered.current) return
    hasEntered.current = true

    const shine = el.querySelector('.card-shine')
    if (!shine) return

    shine.style.transition = 'none'
    shine.style.transform  = 'translateX(-120%) skewX(-12deg)'
    shine.style.opacity    = '1'

    requestAnimationFrame(() => {
      shine.style.transition = 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.1s'
      shine.style.transform  = 'translateX(220%) skewX(-12deg)'
    })

    setTimeout(() => {
      shine.style.opacity    = '0'
      hasEntered.current     = false
    }, 600)
  }, [])

  const onLeave = useCallback(() => {
    hasEntered.current = false
  }, [])

  return { onEnter, onLeave }
}

export default function MatchCard({ partido }) {
  const cardRef   = useRef(null)
  const { onEnter, onLeave } = useShine(cardRef)

  const local     = data.selecciones[partido.local]
  const visitante = data.selecciones[partido.visitante]
  const estadio   = data.estadios.find(e => e.id === partido.estadio_id)
  const estado    = ESTADO_CONFIG[partido.estado] ?? ESTADO_CONFIG.programado

  const isLive     = partido.estado === 'en_vivo'
  const isFinished = partido.estado === 'finalizado'

  const scoreLocal = partido.goles_local     ?? null
  const scoreVis   = partido.goles_visitante ?? null

  function handleMouseMove(e) {
    const el  = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 6
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 4
    el.style.transform = `translateX(3px) rotateY(${x * 0.5}deg) rotateX(${-y * 0.5}deg)`
  }

  function handleMouseLeave() {
    const el = cardRef.current
    if (el) {
      el.style.transition = 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)'
      el.style.transform  = 'translateX(0) rotateY(0deg) rotateX(0deg)'
      el.style.background = ''
      el.style.borderLeftColor = 'transparent'
      onLeave()
    }
  }

  function handleMouseEnter(e) {
    const el = cardRef.current
    if (el) {
      el.style.transition      = 'background 0.15s ease, border-color 0.15s ease'
      el.style.background      = 'rgba(27,58,107,0.55)'
      el.style.borderLeftColor = '#D10A11'
      onEnter()
    }
  }

  return (
    <div
      ref={cardRef}
      className="match-row rounded-xl px-4 py-3.5 flex items-center gap-4 cursor-pointer select-none"
      style={{
        background: isFinished
          ? 'linear-gradient(135deg, #152238 0%, #0D1929 60%, #111E30 100%)'
          : isLive
          ? 'linear-gradient(135deg, #0f1e10 0%, #0D1929 60%, #111E30 100%)'
          : 'linear-gradient(135deg, #111E30 0%, #0D1829 60%, #0f1a28 100%)',
        border: isFinished
          ? '1px solid rgba(200,146,42,0.25)'
          : isLive
          ? '1px solid rgba(0,179,65,0.3)'
          : '1px solid rgba(27,58,107,0.5)',
        boxShadow: isLive ? '0 0 16px rgba(0,179,65,0.08)' : 'none',
        perspective: '800px',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Shine sweep layer */}
      <div
        className="card-shine pointer-events-none absolute inset-0 rounded-xl z-10"
        style={{
          background: 'linear-gradient(105deg, transparent 35%, rgba(229,184,87,0.18) 50%, transparent 65%)',
          transform: 'translateX(-120%) skewX(-12deg)',
          opacity: 0,
          willChange: 'transform, opacity',
        }}
      />

      {/* Live indicator line */}
      {isLive && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl"
          style={{
            background: 'linear-gradient(to bottom, #D10A11, transparent)',
            animation: 'glow-breathe 1.4s ease-in-out infinite',
          }}
        />
      )}

      {/* Grupo badge */}
      <span
        className="font-condensed font-bold text-xs w-8 text-center shrink-0 tabular-nums"
        style={{ color: '#C8922A' }}
      >
        {partido.grupo}
      </span>

      {/* Equipo local */}
      <div className="flex items-center gap-2 flex-1 justify-end overflow-hidden">
        <span
          className="font-condensed font-bold text-sm text-right leading-tight truncate hidden sm:block transition-colors duration-150"
          style={{ color: isFinished ? '#F5F0E8' : isLive ? '#F5F0E8' : '#c8d4e0' }}
        >
          {local?.nombre ?? partido.local}
        </span>
        <span className="font-condensed font-bold text-xs sm:hidden shrink-0" style={{ color: '#F5F0E8' }}>
          {partido.local}
        </span>
        <FlagImg code={partido.local} alt={local?.nombre ?? partido.local} />
      </div>

      {/* Marcador central */}
      <div className="flex flex-col items-center shrink-0 min-w-[86px] gap-1">
        {isFinished || isLive ? (
          <div
            className="flex items-center gap-1 px-3 py-0.5 rounded-lg"
            style={{
              background: isLive
                ? 'rgba(0,179,65,0.12)'
                : 'rgba(200,146,42,0.1)',
              border: isLive
                ? '1px solid rgba(0,179,65,0.3)'
                : '1px solid rgba(200,146,42,0.25)',
            }}
          >
            <span
              className="font-display text-2xl leading-none tabular-nums"
              style={{
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                color: isLive ? '#00B341' : '#E5B857',
                textShadow: isLive ? '0 0 12px rgba(0,179,65,0.5)' : '0 0 8px rgba(200,146,42,0.3)',
                fontWeight: 900,
              }}
            >{scoreLocal ?? '-'}</span>
            <span className="font-condensed text-xs" style={{ color: '#6a7a8f' }}>–</span>
            <span
              className="font-display text-2xl leading-none tabular-nums"
              style={{
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                color: isLive ? '#00B341' : '#E5B857',
                textShadow: isLive ? '0 0 12px rgba(0,179,65,0.5)' : '0 0 8px rgba(200,146,42,0.3)',
                fontWeight: 900,
              }}
            >{scoreVis ?? '-'}</span>
          </div>
        ) : (
          <span
            className="font-display text-xl leading-none"
            style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              background: 'linear-gradient(90deg, #C8922A, #E5B857)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {partido.hora_arg}
          </span>
        )}

        <div className="flex items-center gap-1">
          <span className={estado.cls}>{estado.text}</span>
          {isLive && partido.minuto != null && (
            <span
              className="font-condensed font-bold text-[11px]"
              style={{ color: '#00B341', animation: 'glow-breathe 1.4s ease-in-out infinite' }}
            >
              {partido.minuto}'
            </span>
          )}
          {isFinished && (
            <span className="text-gris text-[10px] font-condensed">{partido.hora_arg}</span>
          )}
        </div>
      </div>

      {/* Equipo visitante */}
      <div className="flex items-center gap-2 flex-1 justify-start overflow-hidden">
        <FlagImg code={partido.visitante} alt={visitante?.nombre ?? partido.visitante} />
        <span
          className="font-condensed font-bold text-sm leading-tight truncate hidden sm:block"
          style={{ color: isLive ? '#F5F0E8' : undefined }}
        >
          {visitante?.nombre ?? partido.visitante}
        </span>
        <span className="font-condensed font-bold text-xs sm:hidden shrink-0">
          {partido.visitante}
        </span>
      </div>

      {/* Sede */}
      <span className="text-gris text-[11px] text-right shrink-0 hidden lg:block max-w-[140px] leading-tight">
        {estadio?.nombre}
      </span>
    </div>
  )
}
