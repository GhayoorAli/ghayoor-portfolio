'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import type { PortfolioContent } from '@/types/content'
import { Lines } from './PortfolioMotion'

export function SelectedWork({ projects }: { projects: PortfolioContent['projects'] }) {
  const sectionRef = useRef<HTMLElement>(null)
  const windowRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [distance, setDistance] = useState(0)
  const [pinned, setPinned] = useState(false)
  const [revealed, setRevealed] = useState<number[]>([])
  const targetX = useMotionValue(0)
  const x = useSpring(targetX, { stiffness: 100, damping: 30, restDelta: .1 })

  useEffect(() => {
    const section = sectionRef.current, windowEl = windowRef.current, track = trackRef.current
    if (!section || !windowEl || !track) return
    const media = matchMedia('(min-width: 768px)')
    let travel = 0, enabled = false, frame = 0, cancelled = false
    const seen = new Set<number>()
    const cards = Array.from(track.children) as HTMLElement[]
    const reveal = () => {
      const bounds = windowEl.getBoundingClientRect()
      if (bounds.top >= innerHeight * .8 || bounds.bottom <= 0) return
      const trackLeft = track.getBoundingClientRect().left
      cards.forEach((card, index) => {
        const left = trackLeft + card.offsetLeft
        if (left < bounds.right && left + card.offsetWidth > bounds.left) seen.add(index)
      })
      setRevealed(previous => previous.length === seen.size ? previous : [...seen])
    }
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (enabled) {
          const progress = Math.max(0, Math.min(1, -section.getBoundingClientRect().top / Math.max(1, section.offsetHeight - innerHeight)))
          targetX.set(-travel * progress)
        }
        reveal()
      })
    }
    const measure = () => {
      enabled = media.matches && !reduced
      // Layout widths stay stable while the inner cards scale into view.
      const inset = enabled ? windowEl.clientWidth * .55 : 0
      travel = Math.max(0, inset + track.offsetWidth - windowEl.clientWidth)
      setDistance(travel)
      setPinned(enabled && travel > 0)
      if (!enabled) { targetX.jump(0); x.jump(0) }
      update()
    }
    const observer = new ResizeObserver(measure)
    observer.observe(windowEl); observer.observe(track)
    const unsubscribe = x.on('change', reveal)
    window.addEventListener('scroll', update, { passive: true })
    windowEl.addEventListener('scroll', reveal, { passive: true })
    window.addEventListener('resize', measure)
    media.addEventListener('change', measure)
    measure()
    document.fonts.ready.then(() => { if (!cancelled) measure() })
    return () => {
      cancelled = true; cancelAnimationFrame(frame); observer.disconnect(); unsubscribe()
      window.removeEventListener('scroll', update); windowEl.removeEventListener('scroll', reveal)
      window.removeEventListener('resize', measure); media.removeEventListener('change', measure)
    }
  }, [projects.length, reduced, targetX, x])

  return <section className={`ref-work${pinned ? ' is-pinned' : ''}`} id="work" ref={sectionRef} style={{ height: pinned ? `calc(100svh + ${Math.max(400, distance * 1.5)}px)` : 'auto' }}>
    <div className="ref-work-sticky">
      <div className="ref-section-heading ref-work-heading"><div><span className="ref-eyebrow">Selected work</span><h2><Lines>{'Built with intention,\nMade to Perform'}</Lines></h2></div><p>From thoughtful interfaces to dependable systems. Explore the products I’ve built and the decisions that made them work.</p></div>
      <div className="ref-project-window" ref={windowRef} data-lenis-prevent-horizontal={pinned ? undefined : ''} tabIndex={pinned ? -1 : 0} aria-label="Selected projects"><motion.div className="ref-project-track" ref={trackRef} style={pinned ? { x } : undefined}>
        {projects.map((project, index) => <div className="ref-project-shell" key={project.slug}><motion.div initial={reduced ? false : { scale: .6, y: '10%', opacity: 0 }} animate={reduced || revealed.includes(index) ? { scale: 1, y: 0, opacity: 1 } : { scale: .6, y: '10%', opacity: 0 }} transition={{ duration: reduced ? 0 : 1.1, delay: index < 2 ? index * .1 : 0, ease: [.16, 1, .3, 1] }}><Link href={`/work/${project.slug}`} className="ref-project"><img className="ref-project-ambient" src={project.cover} alt="" aria-hidden="true" loading="lazy" draggable={false} /><div className="ref-project-device"><div className="ref-device-bar"><i /><i /><i /><span>{project.name}</span></div><img src={project.cover} alt={`${project.name} project preview`} loading="lazy" draggable={false} /></div><div className="ref-project-top"><span className="ref-project-number">{String(index + 1).padStart(2, '0')}</span><div className="ref-project-tags">{project.stack.slice(0, 3).map(tool => <span key={tool.id}>{tool.name}</span>)}</div></div><div className="ref-project-copy"><h3>{project.name}</h3><p>{project.hook}</p></div><span className="ref-project-arrow" aria-hidden="true">↗</span></Link></motion.div></div>)}
      </motion.div></div><span className="ref-work-hint">{pinned ? 'Scroll to explore' : 'Swipe to explore'} <span>↔</span></span>
    </div>
  </section>
}
