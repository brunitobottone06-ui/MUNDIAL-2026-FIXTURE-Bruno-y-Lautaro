import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { usePlayerPhotos } from '../../hooks/useSportsDB.js'
import PlayerCard from './PlayerCard.jsx'
import './PlayerModal.css'

const SKELETON_COUNT = 12

export default function PlayerModal({ team, squad, squadsLoading, onClose }) {
  const [closing, setClosing] = useState(false)
  const backdropRef = useRef(null)

  const loading = squadsLoading && squad === undefined
  const players = useMemo(() => squad ?? [], [squad])

  const { photos } = usePlayerPhotos(players)

  const handleClose = useCallback(() => {
    setClosing(true)
    setTimeout(onClose, 200)
  }, [onClose])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [handleClose])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  const onBackdropClick = useCallback((e) => {
    if (e.target === backdropRef.current) handleClose()
  }, [handleClose])

  const { team: t } = team

  const modal = (
    <div
      ref={backdropRef}
      className={`player-modal__backdrop${closing ? ' player-modal__backdrop--closing' : ''}`}
      onClick={onBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Plantilla de ${t.name}`}
    >
      <div className={`player-modal__panel${closing ? ' player-modal__panel--closing' : ''}`}>

        {/* Header */}
        <div className="player-modal__header">
          <div className="player-modal__header-bg" />

          {t.logo
            ? <img src={t.logo} alt={t.name} className="player-modal__team-logo" />
            : <div className="player-modal__team-logo-placeholder">{t._flag ?? '🏴'}</div>
          }

          <div className="player-modal__team-info">
            <h2 className="player-modal__team-name">{t.name}</h2>
            <p className="player-modal__team-meta">
              <strong>FIFA World Cup 2026™</strong>
              {t._conf  ? ` · ${t._conf}`    : ''}
              {t._grupo ? ` · Grupo ${t._grupo}` : ''}
            </p>
          </div>

          <button
            className="player-modal__close"
            onClick={handleClose}
            aria-label="Cerrar plantilla"
          >✕</button>
        </div>

        {/* Cargando */}
        {loading && (
          <>
            <div className="player-modal__loading">
              <div className="player-modal__spinner" />
              <p className="player-modal__loading-text">Cargando plantilla…</p>
            </div>
            <div className="player-modal__body">
              <div className="player-modal__grid">
                {Array.from({ length: SKELETON_COUNT }, (_, i) => (
                  <PlayerCard key={i} player={null} index={i} skeleton />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Sin jugadores */}
        {!loading && players.length === 0 && (
          <div className="player-modal__empty">
            <div className="player-modal__empty-icon">📋</div>
            <p className="player-modal__empty-title">Sin jugadores registrados</p>
            <p className="player-modal__empty-sub">
              {t._flag}&nbsp;
              <strong style={{ color: '#F5F0E8' }}>{t.name}</strong> no tiene
              plantilla disponible en la fuente de datos.
            </p>
          </div>
        )}

        {/* Grid de jugadores */}
        {!loading && players.length > 0 && (
          <div className="player-modal__body">
            <p className="player-modal__count">
              <strong>{players.length}</strong> jugadores · fuente: football-data.org
            </p>
            <div className="player-modal__grid">
              {players.map((p, i) => (
                <PlayerCard key={p.id ?? i} player={p} index={i} photo={photos[p.name] ?? null} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
