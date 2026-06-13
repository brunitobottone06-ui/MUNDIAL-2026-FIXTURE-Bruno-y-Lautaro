import './PlayerCard.css'

/* Maneja formato football-data.org ("Defence","Midfield","Offence")
   y API-Football ("Defender","Midfielder","Attacker") */
function posClass(pos) {
  if (!pos) return ''
  const p = pos.toLowerCase()
  if (p === 'offence'  || p === 'attacker'  || p.includes('forward'))  return 'player-card__pos--at'
  if (p === 'midfield' || p === 'midfielder')                           return 'player-card__pos--md'
  if (p === 'defence'  || p === 'defender'  || p.includes('back'))     return 'player-card__pos--df'
  if (p === 'goalkeeper')                                               return 'player-card__pos--gk'
  return ''
}

function posLabel(pos) {
  if (!pos) return ''
  const p = pos.toLowerCase()
  if (p === 'offence'  || p === 'attacker'  || p.includes('forward'))  return 'DEL'
  if (p === 'midfield' || p === 'midfielder')                           return 'MED'
  if (p === 'defence'  || p === 'defender'  || p.includes('back'))     return 'DEF'
  if (p === 'goalkeeper')                                               return 'POR'
  return pos.slice(0, 3).toUpperCase()
}

const POS_AVATAR_BG = {
  goalkeeper: 'linear-gradient(135deg, #00B341 0%, #005520 100%)',
  defence:    'linear-gradient(135deg, #1B4A8B 0%, #0A1628 100%)',
  defender:   'linear-gradient(135deg, #1B4A8B 0%, #0A1628 100%)',
  midfield:   'linear-gradient(135deg, #C8922A 0%, #7a5618 100%)',
  midfielder: 'linear-gradient(135deg, #C8922A 0%, #7a5618 100%)',
  offence:    'linear-gradient(135deg, #D10A11 0%, #7a060a 100%)',
  attacker:   'linear-gradient(135deg, #D10A11 0%, #7a060a 100%)',
}

function avatarBg(pos) {
  return POS_AVATAR_BG[pos?.toLowerCase()] ?? 'linear-gradient(135deg, #1B3A6B 0%, #0A1628 100%)'
}

function getInitials(name) {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function calcAge(dateOfBirth) {
  if (!dateOfBirth) return null
  const birth = new Date(dateOfBirth)
  const now   = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
  return age
}

/* ──────────────────────────────────────────────────────────────
   PlayerCard — football-data.org squads schema
   prop `player` shape:
     { id, name, position, dateOfBirth, nationality }
   position: "Goalkeeper" | "Defence" | "Midfield" | "Offence"
────────────────────────────────────────────────────────────── */
export default function PlayerCard({ player, index, photo = null, skeleton = false }) {

  if (skeleton) {
    return (
      <article className="player-card player-card--skeleton">
        <div className="player-card__photo-wrap" />
        <div className="player-card__body">
          <p className="player-card__name">Cargando…</p>
          <p className="player-card__age">— años</p>
          <div className="player-card__stats">
            <div className="player-card__stat" style={{ gridColumn: 'span 2' }} />
            <div className="player-card__stat" style={{ gridColumn: 'span 2' }} />
          </div>
        </div>
      </article>
    )
  }

  const name        = player.name        ?? '—'
  const position    = player.position    ?? ''
  const dateOfBirth = player.dateOfBirth ?? null
  const nationality = player.nationality ?? ''
  const age         = calcAge(dateOfBirth)

  return (
    <article
      className="player-card player-card--reveal"
      style={{ animationDelay: `${Math.min(index * 0.04, 0.8)}s` }}
    >
      {/* ── Foto o Avatar CSS con iniciales ── */}
      <div className="player-card__photo-wrap">
        {photo ? (
          <img
            src={photo}
            alt={name}
            className="player-card__photo"
            loading="lazy"
            onError={e => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div
          className="player-card__avatar"
          style={{
            background: avatarBg(position),
            display: photo ? 'none' : 'flex',
          }}
        >
          <span className="player-card__avatar-initials">{getInitials(name)}</span>
        </div>

        <div className="player-card__photo-fade" />

        {position && (
          <span className={`player-card__pos ${posClass(position)}`}>
            {posLabel(position)}
          </span>
        )}

        <span className="player-card__number">{index + 1}</span>
      </div>

      {/* ── Info ── */}
      <div className="player-card__body">
        <p className="player-card__name" title={name}>{name}</p>
        <p className="player-card__age">
          {age ? `${age} años` : '—'}
        </p>

        <div className="player-card__stats">
          <div className="player-card__stat" style={{ gridColumn: 'span 2' }}>
            <span className="player-card__stat-label">Posición</span>
            <span className="player-card__stat-value" style={{ fontSize: '0.72rem' }}>
              {position || '—'}
            </span>
          </div>
          <div className="player-card__stat" style={{ gridColumn: 'span 2' }}>
            <span className="player-card__stat-label">Nac.</span>
            <span className="player-card__stat-value" style={{ fontSize: '0.65rem' }}>
              {nationality || '—'}
            </span>
          </div>
        </div>
      </div>

      <div className="player-card__shine" aria-hidden />
    </article>
  )
}
