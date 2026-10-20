'use client'

import { ReactLenis } from 'lenis/react'
import { useReducedMotion } from 'framer-motion'
import { ReferencePortfolio } from '@/components/ReferencePortfolio'
import type { HomeContent } from '@/types/content'

export function HomeShell({ content }: { content: HomeContent }) {
  const reduce = useReducedMotion()
  const body = <ReferencePortfolio content={content} />
  if (reduce) return body
  return <ReactLenis root options={{ autoRaf: true, lerp: 0.1, smoothWheel: true, anchors: { offset: -24, duration: 1.1 } }}>{body}</ReactLenis>
}
