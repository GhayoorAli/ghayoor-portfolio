import { useEffect, useRef } from 'react'

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    const root = document.documentElement
    root.classList.add('has-custom-cursor')

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ring = { x: pointer.x, y: pointer.y }
    let visible = false
    let frame = 0

    const interactive = 'a, button, .nav-toggle, .stack-card, .project-card, .timeline-card, .process-step'
    const editable = 'input, textarea, [contenteditable="true"]'

    const setHidden = (hidden: boolean) => {
      dotRef.current?.classList.toggle('is-hidden', hidden)
      ringRef.current?.classList.toggle('is-hidden', hidden)
    }

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY

      if (!visible) {
        visible = true
        ring.x = pointer.x
        ring.y = pointer.y
        root.classList.add('cursor-on')
      }

      const node = event.target as HTMLElement | null
      const typing = Boolean(node?.closest(editable))
      const hover = Boolean(node?.closest(interactive))
      setHidden(typing)
      ringRef.current?.classList.toggle('is-hover', hover && !typing)
    }

    const onDown = () => ringRef.current?.classList.add('is-down')
    const onUp = () => ringRef.current?.classList.remove('is-down')

    const tick = () => {
      ring.x += (pointer.x - ring.x) * 0.18
      ring.y += (pointer.y - ring.y) * 0.18

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`
      }
      frame = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      root.classList.remove('has-custom-cursor', 'cursor-on')
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  )
}
