import { useCountdown } from '../../hooks/useCountdown.js'

function FlipCard({ value, label, flipping }) {
  const display = String(value).padStart(2, '0')
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`flip-card-face w-20 h-24 sm:w-24 sm:h-28 shadow-lg ${flipping ? 'animate-flip-in' : ''}`}
        style={{ boxShadow: '0 0 12px rgba(200,146,42,0.3)' }}
      >
        <span
          className="font-display text-5xl sm:text-6xl text-blanco leading-none select-none"
          style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
        >
          {display}
        </span>
      </div>
      <span
        className="font-condensed text-[10px] sm:text-xs text-oro tracking-[3px] uppercase"
      >
        {label}
      </span>
    </div>
  )
}

export default function Countdown() {
  const { time, flipping, started } = useCountdown()

  if (started) {
    return (
      <div className="flex items-center justify-center gap-3 py-6">
        <span className="badge-live font-display text-2xl px-6 py-3 text-white rounded-lg"
          style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}>
          ⚽ MUNDIAL EN CURSO
        </span>
      </div>
    )
  }

  if (!time) return null

  return (
    <div className="flex items-end gap-3 sm:gap-5 justify-center">
      <FlipCard value={time.days}  label="DÍAS"  flipping={flipping.days}  />
      <span className="font-display text-4xl text-oro pb-8 leading-none select-none"
        style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}>:</span>
      <FlipCard value={time.hours} label="HORAS" flipping={flipping.hours} />
      <span className="font-display text-4xl text-oro pb-8 leading-none select-none"
        style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}>:</span>
      <FlipCard value={time.mins}  label="MIN"   flipping={flipping.mins}  />
      <span className="font-display text-4xl text-oro pb-8 leading-none select-none"
        style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}>:</span>
      <FlipCard value={time.secs}  label="SEG"   flipping={flipping.secs}  />
    </div>
  )
}
