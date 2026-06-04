export function useConfetti() {
  const triggerConfetti = (canvasId = 'confetti-canvas') => {
    const canvas = document.getElementById(canvasId)
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    const COLORS = ['#D10A11', '#C8922A', '#F5F0E8', '#00B341', '#E5B857']
    const particles = Array.from({ length: 200 }, () => ({
      x:        Math.random() * canvas.width,
      y:        Math.random() * canvas.height * 0.3,
      vx:       (Math.random() - 0.5) * 10,
      vy:       Math.random() * -12 - 4,
      color:    COLORS[Math.floor(Math.random() * COLORS.length)],
      size:     Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 8,
      alpha:    1,
    }))

    let frame
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let alive = false
      for (const p of particles) {
        p.x        += p.vx
        p.vy       += 0.3
        p.y        += p.vy
        p.rotation += p.rotSpeed
        p.alpha    -= 0.008
        if (p.alpha > 0) alive = true
        ctx.save()
        ctx.globalAlpha = Math.max(p.alpha, 0)
        ctx.fillStyle   = p.color
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5)
        ctx.restore()
      }
      if (alive) frame = requestAnimationFrame(animate)
      else ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    animate()
    return () => cancelAnimationFrame(frame)
  }
  return { triggerConfetti }
}
