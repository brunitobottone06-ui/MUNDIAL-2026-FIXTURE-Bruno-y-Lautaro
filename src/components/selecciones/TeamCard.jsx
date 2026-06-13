import { useRef, useCallback } from 'react'
import './TeamCard.css'

/* Grupos por confederación — para el badge de color */
const CONF_SHORT = {
  UEFA: 'UEFA', CONMEBOL: 'CONMEBOL', CONCACAF: 'CONCACAF',
  CAF: 'CAF', AFC: 'AFC', OFC: 'OFC',
}

export default function TeamCard({ team, index, onClick }) {
  const shineRef = useRef(null)
  const cardRef  = useRef(null)

  /* Dispara el shine solo en el enter (no en cada mousemove) */
  const onEnter = useCallback(() => {
    const shine = shineRef.current
    if (!shine) return
    shine.style.animation = 'none'
    /* rAF para que el navegador procese el reset antes de re-animar */
    requestAnimationFrame(() => {
      shine.style.animation = ''
    })
  }, [])

  /* 3-D tilt suave via transform directo en el DOM (no GSAP) */
  const onMove = useCallback((e) => {
    const card = cardRef.current
    if (!card) return
    const { left, top, width, height } = card.getBoundingClientRect()
    const x = (e.clientX - left) / width  - 0.5   // -0.5 → +0.5
    const y = (e.clientY - top)  / height - 0.5
    card.style.transform = `
      translateY(-8px) scale(1.03)
      perspective(600px)
      rotateY(${x * 8}deg)
      rotateX(${-y * 6}deg)
    `
  }, [])

  const onLeave = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = 'translateY(0) scale(1) perspective(600px) rotateY(0) rotateX(0)'
  }, [])

  const { team: t, venue } = team
  /* La confederación puede venir en distintos campos según la respuesta */
  const conf = t.country ?? ''

  return (
    <article
      ref={cardRef}
      className="team-card team-card--reveal"
      style={{ animationDelay: `${Math.min(index * 0.05, 1)}s` }}
      onClick={() => onClick(team)}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick(team)}
      aria-label={`Ver plantilla de ${t.name}`}
    >
      {/* Franja dorada superior */}
      <div className="team-card__stripe" />

      {/* Logo */}
      <div className="team-card__logo-wrap">
        {t.logo
          ? <img src={t.logo} alt={t.name} className="team-card__logo" loading="lazy" />
          : <div className="team-card__logo-placeholder">{t._flag ?? '🏴'}</div>
        }
      </div>

      {/* Nombre + badges */}
      <div className="team-card__body">
        <h3 className="team-card__name">{t.name}</h3>
        <div className="team-card__badges">
          {t._grupo && (
            <span className="team-card__badge team-card__badge--grupo">
              Grupo {t._grupo}
            </span>
          )}
          {(t._conf || conf) && (
            <span className="team-card__badge team-card__badge--conf">
              {t._conf ?? conf}
            </span>
          )}
        </div>
      </div>

      {/* CTA hover */}
      <div className="team-card__cta">VER PLANTILLA →</div>

      {/* Shine */}
      <div ref={shineRef} className="team-card__shine" aria-hidden />
    </article>
  )
}
