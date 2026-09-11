'use client'

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useMemo, useRef } from 'react'
import type { SiteSettings } from '@/types/content'
import { Reveal } from './Reveal'

function Manifesto({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const words = useMemo(() => text.trim().split(/\s+/).filter(Boolean), [text])
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.35'],
  })

  if (reduce) {
    return (
      <p className="manifesto" ref={ref}>
        {text}
      </p>
    )
  }

  return (
    <p className="manifesto" ref={ref}>
      {words.map((word, i) => (
        <ManifestoWord key={`${word}-${i}`} index={i} total={words.length} progress={scrollYProgress} word={word} />
      ))}
    </p>
  )
}

function ManifestoWord({
  word,
  index,
  total,
  progress,
}: {
  word: string
  index: number
  total: number
  progress: MotionValue<number>
}) {
  const start = index / total
  const end = Math.min(1, start + 0.18)
  const opacity = useTransform(progress, [start, end], [0.18, 1])
  return (
    <motion.span className="manifesto-word" style={{ opacity }}>
      {word}{' '}
    </motion.span>
  )
}

export function About({ site }: { site: SiteSettings }) {
  const manifesto =
    site.about_heading ||
    'From idea to launch. Clean, scalable digital products built to move fast, stay simple, and perform in real-world use, driven by clarity, structured systems, and intentional design.'

  const rest = site.about_body.slice(2)
  const showContinued = rest.length > 0 || site.stats.length > 0

  return (
    <section className="section about" id="manifesto">
      <div className="container">
        <Reveal>
          <Manifesto text={manifesto} />
        </Reveal>

        {showContinued ? (
          <Reveal className="about-continued">
            {rest.map((paragraph) => (
              <p key={paragraph} className="lede">
                {paragraph}
              </p>
            ))}
            {site.stats.length ? (
              <ul className="about-stats">
                {site.stats.map((stat) => (
                  <li key={stat.label}>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}
