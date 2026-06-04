import { useState, useEffect, useRef } from 'react'

const TARGET = new Date('2026-06-11T19:00:00Z') // 16:00 ARG = UTC-3

function calcDiff() {
  const diff = TARGET - Date.now()
  if (diff <= 0) return null
  return {
    days:  Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    mins:  Math.floor((diff % 3_600_000)  / 60_000),
    secs:  Math.floor((diff % 60_000)     / 1_000),
  }
}

export function useCountdown() {
  const [time,     setTime]     = useState(calcDiff)
  const [flipping, setFlipping] = useState({ days: false, hours: false, mins: false, secs: false })
  const prevRef = useRef(time)

  useEffect(() => {
    const id = setInterval(() => {
      const next = calcDiff()
      const prev = prevRef.current
      if (next && prev) {
        const newFlip = {}
        for (const k of ['days','hours','mins','secs']) {
          newFlip[k] = next[k] !== prev[k]
        }
        if (Object.values(newFlip).some(Boolean)) {
          setFlipping(newFlip)
          setTimeout(() => setFlipping({ days: false, hours: false, mins: false, secs: false }), 400)
        }
      }
      prevRef.current = next
      setTime(next)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return { time, flipping, started: time === null }
}
