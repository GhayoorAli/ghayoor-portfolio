'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import type { SiteSettings } from '@/types/content'

/** Short lockup like the video: FULL STACK / DEVELOPER */
function splitRole(title: string) {
  let cleaned = title
    .trim()
    .replace(/^(i['’]?m|i am)\s+(a\s+|an\s+)?/i, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (!cleaned) cleaned = title.trim()
  const words = cleaned.split(/\s+/).filter(Boolean)

  if (words.length <= 1) return { lines: [cleaned.toUpperCase()] }
  if (words.length === 2) return { lines: words.map((w) => w.toUpperCase()) }
  if (words.length === 3) {
    return {
      lines: [`${words[0]} ${words[1]}`.toUpperCase(), words[2].toUpperCase()],
    }
  }
  const mid = Math.ceil(words.length / 2)
  return {
    lines: [
      words.slice(0, mid).join(' ').toUpperCase(),
      words.slice(mid).join(' ').toUpperCase(),
    ],
  }
}

export function Hero({ site }: { site: SiteSettings }) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  /*
    Reference timeline:
    0.00–0.12  lockup holds
    0.12–0.36  lockup exits while portrait lifts
    0.34–0.56  portrait crosses edge-on and reveals red face
    0.48–0.94  Hey/copy rise from below and settle
    0.94–1.00  brief settled handoff before the section releases

    Every range includes 0 and 1. Motion 13 otherwise remixes a range
    after its final stop, which made the title reappear at the boundary.
  */

  const rotateY = useTransform(
    scrollYProgress,
    [0, 0.12, 0.34, 0.48, 0.7, 0.9, 1],
    [0, 0, 82, 102, 168, 180, 180],
  )

  const cardScale = useTransform(
    scrollYProgress,
    [0, 0.12, 0.44, 0.94, 1],
    [0.54, 0.54, 0.7, 1, 1],
  )
  const cardY = useTransform(
    scrollYProgress,
    [0, 0.12, 0.44, 0.94, 1],
    [36, 36, 20, 0, 0],
  )
  const cardYVh = useTransform(cardY, (v) => `${v}vh`)
  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.34, 1],
    [1, 1, 0, 0],
  )
  const titleY = useTransform(scrollYProgress, [0, 0.12, 0.36, 1], [0, 0, -58, -58])
  const titleYVh = useTransform(titleY, (v) => `${v}vh`)
  const titleScale = useTransform(scrollYProgress, [0, 0.12, 0.36, 1], [1, 1, 0.98, 0.98])

  const introOpacity = useTransform(
    scrollYProgress,
    [0, 0.46, 0.62, 0.9, 1],
    [0, 0, 0.35, 1, 1],
  )
  const introY = useTransform(
    scrollYProgress,
    [0, 0.42, 0.62, 0.94, 1],
    ['34vh', '34vh', '15vh', '0vh', '0vh'],
  )

  const role = splitRole(site.title)
  const lead = site.about_body[0] ?? ''
  const lead2 = site.about_body[1] ?? ''

  if (reduce) {
    return (
      <section className="hero-story hero-story-static" id="top">
        <span id="about" className="hero-about-anchor" aria-hidden="true" />
        <div className="hero-sticky">
          <div className="hero-intro is-static">
            <div className="hero-intro-left">
              <h1 className="hero-intro-hey">Hey!</h1>
              {lead ? <p className="hero-intro-sub">{lead}</p> : null}
            </div>
            <div className="hero-portrait-static">
              <div className="hero-portrait-red" aria-hidden="true" />
              <img src={site.portrait_url} alt={site.name} />
            </div>
            <div className="hero-intro-right">
              {lead2 ? <p className="hero-intro-lead">{lead2}</p> : null}
              <a className="hero-intro-cta" href="#work">
                Get Started
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="hero-story" id="top" ref={ref}>
      <span id="about" className="hero-about-anchor" aria-hidden="true" />
      <div className="hero-sticky">
        <motion.div
          className="hero-lockup"
          style={{ opacity: titleOpacity, scale: titleScale, y: titleYVh }}
        >
          <h1 className="hero-role-lockup">
            {role.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <span className="hero-deco hero-deco-star" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="none">
              <path
                fill="currentColor"
                d="M32 2c1.2 10.8 8.4 18 19.2 19.2C40.4 22.4 33.2 29.6 32 40.4 30.8 29.6 23.6 22.4 12.8 21.2 23.6 20 30.8 12.8 32 2Z"
              />
              <path
                fill="url(#starShine)"
                opacity="0.4"
                d="M32 8c.7 6.4 4.8 10.6 11.2 11.2C36.8 20 32.6 24.2 32 30.6c-.6-6.4-4.8-10.6-11.2-11.2C27.2 18.6 31.4 14.4 32 8Z"
              />
              <defs>
                <linearGradient id="starShine" x1="20" y1="10" x2="44" y2="34">
                  <stop stopColor="#fff" stopOpacity="0.55" />
                  <stop offset="1" stopColor="#8b7cff" stopOpacity="0.3" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className="hero-deco hero-deco-bolt" aria-hidden="true">
            <svg viewBox="0 0 48 64" fill="none">
              <path fill="currentColor" d="M28 2 8 36h14L16 62l28-40H28L36 2H28Z" />
              <path
                fill="url(#boltShine)"
                opacity="0.45"
                d="M27 6 12 34h10l-4 18 18-26H24l6-20h-3Z"
              />
              <defs>
                <linearGradient id="boltShine" x1="12" y1="8" x2="36" y2="48">
                  <stop stopColor="#fff" stopOpacity="0.5" />
                  <stop offset="1" stopColor="#7a6cff" stopOpacity="0.25" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </motion.div>

        <div className="hero-portrait-stage">
          <motion.div
            className="hero-portrait-card"
            style={{
              rotateY,
              scale: cardScale,
              y: cardYVh,
            }}
          >
            <div className="hero-portrait-face is-gray">
              <img src={site.portrait_url} alt="" />
            </div>
            <div className="hero-portrait-face is-red">
              <div className="hero-portrait-red" aria-hidden="true" />
              <img src={site.portrait_url} alt={site.name} />
            </div>
          </motion.div>
        </div>

        <motion.div
          className="hero-intro"
          style={{ opacity: introOpacity, y: introY }}
        >
          <div className="hero-intro-left">
            <h2 className="hero-intro-hey">Hey!</h2>
            {lead ? <p className="hero-intro-sub">{lead}</p> : null}
          </div>
          <div className="hero-intro-spacer" aria-hidden="true" />
          <div className="hero-intro-right">
            {lead2 ? <p className="hero-intro-lead">{lead2}</p> : null}
            <a className="hero-intro-cta" href="#work">
              Get Started
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
