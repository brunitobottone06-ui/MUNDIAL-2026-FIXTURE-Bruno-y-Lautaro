import { useRef, useCallback } from 'react'
import data from '../../data/worldcup-data.json'

const ESTADO_CONFIG = {
  programado: { text: 'PRÓ',  cls: 'badge-scheduled' },
  en_vivo:    { text: '● LIVE', cls: 'badge-live'      },
  finalizado: { text: 'FIN',  cls: 'badge-finished'   },
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
      className="match-row bg-azul-medio rounded-xl px-4 py-3.5 flex items-center gap-4 cursor-pointer select-none"
      style={{
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
      <span className="font-condensed text-xs text-gris w-8 text-center shrink-0 tabular-nums">
        {partido.grupo}
      </span>

      {/* Equipo local */}
      <div className="flex items-center gap-2 flex-1 justify-end overflow-hidden">
        <span
          className="font-condensed font-bold text-sm text-right leading-tight truncate hidden sm:block transition-colors duration-150"
          style={{ color: isLive ? '#F5F0E8' : undefined }}
        >
          {local?.nombre ?? partido.local}
        </span>
        <span className="font-condensed font-bold text-xs sm:hidden shrink-0">
          {partido.local}
        </span>
        <span className="text-xl shrink-0">{local?.bandera}</span>
      </div>

      {/* Marcador central */}
      <div className="flex flex-col items-center shrink-0 min-w-[86px] gap-1">
        {isFinished || isLive ? (
          <div className="flex items-center gap-2">
            <span
              className="font-display text-2xl leading-none tabular-nums"
              style={{
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                color: isLive ? '#00B341' : '#F5F0E8',
                textShadow: isLive ? '0 0 12px rgba(0,179,65,0.5)' : undefined,
              }}
            >{scoreLocal ?? '-'}</span>
            <span className="text-gris font-condensed text-base">:</span>
            <span
              className="font-display text-2xl leading-none tabular-nums"
              style={{
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                color: isLive ? '#00B341' : '#F5F0E8',
                textShadow: isLive ? '0 0 12px rgba(0,179,65,0.5)' : undefined,
              }}
            >{scoreVis ?? '-'}</span>
          </div>
        ) : (
          <span
            className="font-display text-xl leading-none"
            style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", color: '#C8922A' }}
          >
            {partido.hora_arg}
          </span>
        )}

        <div className="flex items-center gap-1">
          <span className={estado.cls}>{estado.text}</span>
          {(isFinished || isLive) && (
            <span className="text-gris text-[10px] font-condensed">{partido.hora_arg}</span>
          )}
        </div>
      </div>

      {/* Equipo visitante */}
      <div className="flex items-center gap-2 flex-1 justify-start overflow-hidden">
        <span className="text-xl shrink-0">{visitante?.bandera}</span>
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
