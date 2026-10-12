'use client'

import { gmailComposeUrl } from '@/lib/contact'

import { useEffect, useRef, useState, type ReactNode, useId } from 'react'
import { createPortal } from 'react-dom'
import { useLenis } from 'lenis/react'
import { RollingLabel } from './ReferenceUI'
import { AnimatePresence, motion, useReducedMotion, useMotionValue, useTransform } from 'framer-motion'

export function Lines({ children, className = '', delay = 0 }: { children: string; className?: string; delay?: number }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const [wrapped, setWrapped] = useState<string[]>([])
  useEffect(() => {
    const element = ref.current
    if (!element || children.includes('\n')) return
    let cancelled = false
    const measure = () => {
      if (cancelled) return
      const groups: string[] = []
      let previous = -1
      element.querySelectorAll<HTMLElement>('.ref-measure-word').forEach(word => {
        if (word.offsetTop !== previous) { groups.push(''); previous = word.offsetTop }
        groups[groups.length - 1] += word.textContent
      })
      const next = groups.map(line => line.trim())
      setWrapped(current => current.join('\n') === next.join('\n') ? current : next)
    }
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    document.fonts.ready.then(measure)
    return () => { cancelled = true; observer.disconnect() }
  }, [children])
  const lines = children.includes('\n') ? children.split('\n') : wrapped.length ? wrapped : [children]
  return <motion.span key={children} ref={ref} className={`ref-lines ${className}`} initial={reduced ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: .2 }}>{!children.includes('\n') && <span className="ref-line-measure" aria-hidden="true">{children.split(' ').map((word, i) => <span className="ref-measure-word" key={i}>{word}{' '}</span>)}</span>}{lines.map((line, index) => <span className="ref-line-mask" key={`${index}-${line}`}><motion.span variants={{ hidden: { y: '110%', opacity: 0, filter: 'blur(6px)' }, visible: { y: 0, opacity: 1, filter: 'blur(0px)' } }} transition={{ duration: .75, delay: delay + index * .09, ease: [.16, 1, .3, 1] }}>{line}</motion.span></span>)}</motion.span>
}

export function Year({ year }: { year: string }) {
  const reduced = useReducedMotion()
  return <strong className="ref-milestone-year">’{year.split('').map((digit, index) => <span className="ref-digit-window" key={index}><motion.span initial={reduced ? false : { y: '0%' }} whileInView={{ y: `-${Number(digit) * 10}%` }} viewport={{ once: true }} transition={{ duration: reduced ? 0 : 1.5, delay: reduced ? 0 : .2 + index * .12, ease: [.16, 1, .3, 1] }}>{Array.from({ length: 10 }, (_, n) => <span key={n}>{n}</span>)}</motion.span></span>)}</strong>
}

function useSectionProgress(ref: React.RefObject<HTMLElement | null>, start: number, end: number, includeHeight = false) {
  const progress = useMotionValue(0)
  useEffect(() => {
    const update = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const distance = window.innerHeight * (start - end) + (includeHeight ? rect.height : 0)
      progress.set(Math.max(0, Math.min(1, (window.innerHeight * start - rect.top) / distance)))
    }
    update(); window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [ref, start, end, includeHeight, progress])
  return progress
}

export function TimelinePath() {
  const ref = useRef<HTMLDivElement>(null)
  const scrollYProgress = useSectionProgress(ref, .9, .8, true)
  const reduced = useReducedMotion()
  const [geometry, setGeometry] = useState({ width: 1000, height: 1200, path: '', tail: '' })
  useEffect(() => {
    const timeline = ref.current?.parentElement
    if (!timeline) return
    const measure = () => {
      const cards = Array.from(timeline.querySelectorAll<HTMLElement>('.ref-milestone'))
      const points = cards.map(card => ({ x: card.offsetLeft - 25, y: card.offsetTop + card.offsetHeight - 25 }))
      if (!points.length) return
      let path = `M ${points[0].x} 0`
      let previous = { x: points[0].x, y: 0 }
      points.forEach(point => {
        const middle = (previous.y + point.y) / 2
        path += ` C ${previous.x} ${middle} ${point.x} ${middle} ${point.x} ${point.y}`
        previous = point
      })
      const height = timeline.offsetHeight
      setGeometry({ width: timeline.clientWidth, height, path, tail: `M ${previous.x} ${previous.y} Q ${previous.x} ${height} ${previous.x + 130} ${height}` })
    }
    const observer = new ResizeObserver(measure)
    observer.observe(timeline)
    timeline.querySelectorAll('.ref-milestone').forEach(card => observer.observe(card))
    measure()
    return () => observer.disconnect()
  }, [])
  return <div className="ref-timeline-path" ref={ref}><svg className="ref-timeline-line" viewBox={`0 0 ${geometry.width} ${geometry.height}`} preserveAspectRatio="none" aria-hidden="true"><motion.path style={reduced ? undefined : { pathLength: scrollYProgress }} d={geometry.path} /><path className="ref-line-dash" d={geometry.tail} /></svg></div>
}

export function StoryButton({ title, text, label = "Read more ↗", details }: { title: string; text: string; label?: string; details?: ReactNode }) {
  const [open, setOpen] = useState(false)
  const lenis = useLenis()
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    const triggerElement = trigger.current
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    lenis?.stop()
    closeRef.current?.focus()
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); if (event.key === 'Tab') { event.preventDefault(); closeRef.current?.focus() } }
    window.addEventListener('keydown', key)
    return () => { document.body.style.overflow = previous; lenis?.start(); window.removeEventListener('keydown', key); triggerElement?.focus() }
  }, [open, lenis])
  return <><button ref={trigger} aria-label={label !== "Read more ↗" ? title : undefined} className="ref-read-more" onClick={() => setOpen(true)}>{label === "Read more ↗" ? <RollingLabel>{label}</RollingLabel> : label}</button>{typeof document !== 'undefined' && createPortal(<AnimatePresence>{open && <motion.div className="ref-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}><motion.div role="dialog" data-lenis-prevent aria-modal="true" aria-labelledby={titleId} className="ref-story-modal" initial={{ scale: .8, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .9, opacity: 0 }} transition={{ type: 'spring', damping: 28, stiffness: 260 }} onClick={event => event.stopPropagation()}><button ref={closeRef} className="ref-modal-close" onClick={() => setOpen(false)} aria-label="Close details">×</button><h2 id={titleId}>{title}</h2><p>{text}</p>{details}</motion.div></motion.div>}</AnimatePresence>, document.body)}</>
}

function Character({ letter, index, count, progress }: { letter: string; index: number; count: number; progress: ReturnType<typeof useMotionValue<number>> }) {
  const opacity = useTransform(progress, [index / count * .8, index / count * .8 + .15], [.12, 1])
  return <motion.span style={{ opacity }}>{letter}</motion.span>
}

export function Benefits() {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduced = useReducedMotion()
  const scrollYProgress = useSectionProgress(ref, .92, .25)
  const message = 'Good planning and solid code, built around what your business actually needs. No fluff, no surprises.'
  const capabilities = [ ['ϟ', 'Development', 'Reliable applications built with Laravel, React and Next.js.'], ['↗', 'Integrations', 'APIs and services connected into one cohesive product.'], ['✦', 'Experience', 'Clear interfaces designed around the people using them.'], ['◕', 'Collaboration', 'Thoughtful communication from the first idea to delivery.'], ['⌁', 'Performance', 'Fast pages, efficient queries and dependable systems.'] ]
  const phrases = ['Good planning', 'and solid code,', 'built around what', 'your business actually needs.', 'No fluff,', 'no surprises.']
  const after = new Map([[0, 3], [1, 0], [2, 1], [3, 2], [5, 4]])
  let position = 0
  return <><h2><Lines>{'What\nI Bring'}</Lines></h2><span className="ref-eyebrow">Capabilities overview</span><p ref={ref} className="ref-character-copy">{phrases.map((phrase, phraseIndex) => {
    const words = phrase.split(' ').map((word, i) => {
      const start = position
      position += word.length + 1
      return <span className="ref-copy-word" key={i}>{Array.from(word).map((letter, j) => reduced ? <span key={j}>{letter}</span> : <Character key={j} letter={letter} index={start + j} count={message.length} progress={scrollYProgress} />)}{' '}</span>
    })
    const capability = after.get(phraseIndex)
    return <span key={phraseIndex}>{words}{capability !== undefined && <motion.span className="ref-inline-capability" initial={reduced ? false : { scale: .5, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true, amount: .8 }} transition={{ duration: .7, delay: capability * .1, ease: [.16, 1, .3, 1] }}><StoryButton title={capabilities[capability][1]} text={capabilities[capability][2]} label={capabilities[capability][0]} /></motion.span>}{phraseIndex === 3 ? <br /> : ' '}</span>
  })}</p></>
}

export function Chat({ email }: { email: string }) {
  const [started, setStarted] = useState(false)
  const [phase, setPhase] = useState(0)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (!started || reduced) return
    const timers = [setTimeout(() => setPhase(1), 850), setTimeout(() => setPhase(2), 2200), setTimeout(() => setPhase(3), 3500)]
    return () => timers.forEach(clearTimeout)
  }, [started, reduced])
  const stage = reduced ? 3 : phase
  const pop = { duration: .4, ease: [.34, 1.56, .64, 1] as const }
  return <motion.div className="ref-chat" onViewportEnter={() => setStarted(true)} viewport={{ once: true, margin: '0px 0px -10% 0px' }}>
    <AnimatePresence initial={!reduced}>
      {stage >= 1 && <motion.div layout key="message" className="ref-chat-bubble" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={pop}><motion.span initial={reduced ? false : { opacity: 0, filter: 'blur(4px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{ delay: .15, duration: .3 }}>Looking for a developer?</motion.span></motion.div>}
      {stage >= 2 && <motion.a layout key="contact-button" href={gmailComposeUrl(email)} target="_blank" rel="noopener noreferrer" className="ref-chat-cta" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={pop}><span className="ref-chat-button-mask"><span>Let’s Talk</span><span aria-hidden="true">Let’s Talk</span></span></motion.a>}
      {stage < 3 && <motion.div layout key="typing" aria-label="Typing" className="ref-chat-typing" initial={{ scale: 0, opacity: 0 }} animate={{ scale: started ? 1 : 0, opacity: started ? 1 : 0 }} exit={{ scale: 0, opacity: 0 }} transition={pop}><span className="ref-typing"><i /><i /><i /></span></motion.div>}
    </AnimatePresence>
  </motion.div>
}

export function FAQGroup({ questions }: { questions: string[][] }) {
  const [twoColumns, setTwoColumns] = useState(true)
  const [opened, setOpened] = useState<Set<number>>(() => new Set())
  useEffect(() => {
    const media = matchMedia('(min-width:581px)')
    const update = () => setTwoColumns(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  const toggle = (index: number) => setOpened(current => {
    const next = new Set(current)
    if (next.has(index)) next.delete(index)
    else next.add(index)
    return next
  })
  const item = (index: number) => <FAQ key={questions[index][0]} question={questions[index][0]} answer={questions[index][1]} open={opened.has(index)} onToggle={() => toggle(index)} />
  return <div className="ref-faq-grid">{twoColumns ? [0, 1].map(column => <div className="ref-faq-column" key={column}>{questions.map((_, index) => index % 2 === column ? item(index) : null)}</div>) : questions.map((_, index) => item(index))}</div>
}

function FAQ({ question, answer, open, onToggle }: { question: string; answer: string; open: boolean; onToggle: () => void }) {
  const reduced = useReducedMotion()
  const answerId = useId()
  return <div className="ref-panel ref-faq-item"><button onClick={onToggle} aria-expanded={open} aria-controls={answerId}>{question}<motion.span animate={{ rotate: open ? 45 : 0 }}>+</motion.span></button><AnimatePresence initial={false}>{open && <motion.div id={answerId} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : .4, ease: [.16, 1, .3, 1] }}><p>{answer}</p></motion.div>}</AnimatePresence></div>
}

export function CredentialCarousel({ children, count }: { children: ReactNode; count: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const frame = useRef(0)
  const drag = useRef<{ x: number; left: number; index: number; time: number; moved: boolean } | null>(null)
  const suppressClick = useRef(false)
  const [active, setActive] = useState(0)
  const [hover, setHover] = useState(false)
  const [dragging, setDragging] = useState(false)
  const cursorX = useMotionValue(0), cursorY = useMotionValue(0)
  const nearest = (track: HTMLElement) => {
    const cards = Array.from(track.children) as HTMLElement[]
    return cards.reduce((best, card, index) => Math.abs(card.offsetLeft - track.scrollLeft) < Math.abs(cards[best].offsetLeft - track.scrollLeft) ? index : best, 0)
  }
  const goTo = (index: number) => {
    const track = ref.current
    const card = track?.children[Math.max(0, Math.min(count - 1, index))] as HTMLElement | undefined
    if (!track || !card) return
    cancelAnimationFrame(frame.current)
    const start = track.scrollLeft, destination = card.offsetLeft, time = performance.now()
    track.style.scrollSnapType = 'none'
    const tick = (now: number) => {
      const progress = matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : Math.min(1, (now - time) / 500)
      const eased = 1 - Math.pow(1 - progress, 3)
      track.scrollLeft = start + (destination - start) * eased
      if (progress < 1) frame.current = requestAnimationFrame(tick)
      else { track.style.scrollSnapType = ''; setActive(nearest(track)) }
    }
    frame.current = requestAnimationFrame(tick)
  }
  useEffect(() => () => cancelAnimationFrame(frame.current), [])
  return <div className="ref-carousel"><div ref={ref} data-lenis-prevent-horizontal className={`ref-credential-grid${dragging ? ' is-dragging' : ''}`} tabIndex={0} aria-label="Certifications, drag or scroll horizontally to explore"
    onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); goTo(active + (event.key === 'ArrowRight' ? 1 : -1)) } }}
    onDragStart={event => event.preventDefault()}
    onClickCapture={event => { if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false } }}
    onPointerEnter={event => { if (event.pointerType === 'mouse') setHover(true) }}
    onPointerLeave={() => { if (!drag.current) setHover(false) }}
    onPointerDown={event => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      cancelAnimationFrame(frame.current)
      suppressClick.current = false
      drag.current = { x: event.clientX, left: event.currentTarget.scrollLeft, index: nearest(event.currentTarget), time: performance.now(), moved: false }
    }}
    onPointerMove={event => {
      const bounds = event.currentTarget.parentElement!.getBoundingClientRect()
      cursorX.set(event.clientX - bounds.left); cursorY.set(event.clientY - bounds.top)
      const start = drag.current
      if (!start) return
      if (Math.abs(start.x - event.clientX) > 5) {
        start.moved = true; setDragging(true); event.currentTarget.style.scrollSnapType = 'none'
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId)
        event.currentTarget.scrollLeft = start.left + start.x - event.clientX
      }
    }}
    onPointerUp={event => {
      const start = drag.current
      drag.current = null; setDragging(false)
      if (!start?.moved) return
      suppressClick.current = true
      const delta = start.x - event.clientX
      const shortSwipe = performance.now() - start.time < 300
      const destination = shortSwipe ? start.index + (delta > 0 ? 1 : -1) : nearest(event.currentTarget)
      goTo(destination)
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
      setHover(event.currentTarget.matches(':hover'))
    }}
    onPointerCancel={event => { drag.current = null; setDragging(false); event.currentTarget.style.scrollSnapType = ''; setHover(false) }}
    onScroll={event => setActive(nearest(event.currentTarget))}>{children}</div>
    <motion.div className="ref-drag-cursor" aria-hidden="true" style={{ x: cursorX, y: cursorY }} animate={{ opacity: hover ? 1 : 0, scale: hover ? 1 : .6 }} transition={{ duration: .15 }}><span>{dragging ? '↔' : 'drag'}</span></motion.div>
    <div className="ref-carousel-dots" aria-label="Select certification">{Array.from({ length: count }, (_, i) => <button key={i} className={i === active ? 'is-active' : ''} aria-label={`Certification ${i + 1}`} aria-pressed={i === active} onClick={() => goTo(i)} />)}</div></div>
}
