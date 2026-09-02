import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  shade: number
}

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pointer = { x: 0.5, y: 0.42, tx: 0.5, ty: 0.42 }
    let width = 0
    let height = 0
    let dpr = 1
    let frame = 0
    let time = 0
    let particles: Particle[] = []

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.6)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seedParticles()
    }

    const seedParticles = () => {
      const count = Math.floor((width * height) / 42000)
      particles = Array.from({ length: Math.max(14, Math.min(count, 28)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 1.4 + 0.5,
        shade: Math.random(),
      }))
    }

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.tx = (event.clientX - rect.left) / rect.width
      pointer.ty = (event.clientY - rect.top) / rect.height
    }

    const drawAurora = (offset: number, yRatio: number, amplitude: number, color: string, thickness: number) => {
      ctx.beginPath()
      const steps = Math.ceil(width / 10)
      for (let i = 0; i <= steps; i += 1) {
        const x = (i / steps) * width
        const y =
          height * yRatio +
          Math.sin(x * 0.0022 + time * 0.22 + offset) * amplitude +
          Math.cos(x * 0.0011 + time * 0.14 + offset) * (amplitude * 0.35) +
          (pointer.y - 0.5) * 36
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = color
      ctx.lineWidth = thickness
      ctx.shadowColor = color
      ctx.shadowBlur = 36
      ctx.stroke()
    }

    const tick = () => {
      frame = requestAnimationFrame(tick)
      time += reduceMotion ? 0.003 : 0.01
      pointer.x += (pointer.tx - pointer.x) * 0.045
      pointer.y += (pointer.ty - pointer.y) * 0.045

      ctx.clearRect(0, 0, width, height)

      const gx = width * pointer.x
      const gy = height * pointer.y

      const glow = ctx.createRadialGradient(gx, gy, 20, gx, gy, Math.max(width, height) * 0.48)
      glow.addColorStop(0, 'rgba(109, 92, 236, 0.07)')
      glow.addColorStop(0.4, 'rgba(14, 165, 184, 0.03)')
      glow.addColorStop(1, 'rgba(243, 240, 250, 0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, width, height)

      ctx.save()
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      ctx.globalAlpha = 0.28
      drawAurora(0.15, 0.38, 46, 'rgba(139, 122, 255, 0.16)', 64)
      drawAurora(1.4, 0.58, 38, 'rgba(14, 165, 184, 0.1)', 52)
      ctx.restore()
      ctx.shadowBlur = 0

      for (const p of particles) {
        if (!reduceMotion) {
          p.x += p.vx + (pointer.x - 0.5) * 0.06
          p.y += p.vy + (pointer.y - 0.5) * 0.04
        }
        if (p.x < -20) p.x = width + 20
        if (p.x > width + 20) p.x = -20
        if (p.y < -20) p.y = height + 20
        if (p.y > height + 20) p.y = -20
      }

      ctx.lineWidth = 0.6
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist < 90) {
            ctx.strokeStyle = `rgba(91, 71, 214, ${0.08 * (1 - dist / 90)})`
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      for (const p of particles) {
        const color =
          p.shade > 0.66
            ? 'rgba(109, 92, 236, 0.45)'
            : p.shade > 0.33
              ? 'rgba(91, 71, 214, 0.32)'
              : 'rgba(14, 165, 184, 0.4)'
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove)
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />
}
