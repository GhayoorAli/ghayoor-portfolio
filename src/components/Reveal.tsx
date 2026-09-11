'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { type ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  from?: 'up' | 'left' | 'right' | 'scale'
  as?: 'div' | 'article' | 'li'
}

const offsets = {
  up: { y: 28, x: 0, scale: 1 },
  left: { y: 18, x: -28, scale: 1 },
  right: { y: 18, x: 28, scale: 1 },
  scale: { y: 16, x: 0, scale: 0.97 },
}

/** Safe scroll reveal — never leaves hollow opacity-0 layout holes after mount. */
export function Reveal({ children, className = '', delay = 0, from = 'up', as = 'div' }: RevealProps) {
  const reduce = useReducedMotion()
  const offset = offsets[from]

  if (reduce) {
    if (as === 'li') return <li className={className}>{children}</li>
    if (as === 'article') return <article className={className}>{children}</article>
    return <div className={className}>{children}</div>
  }

  const MotionTag = as === 'li' ? motion.li : as === 'article' ? motion.article : motion.div

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0.001, y: offset.y, x: offset.x, scale: offset.scale }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.18, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.7, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}
