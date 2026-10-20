'use client'

import { ReactLenis } from 'lenis/react'
import { useDesktopMotion } from './useDesktopMotion'
import { ReferencePortfolio } from '@/components/ReferencePortfolio'
import type { HomeContent } from '@/types/content'

export function HomeShell({ content }: { content: HomeContent }) {
  const desktopMotion = useDesktopMotion()
  const body = <ReferencePortfolio content={content} />
  return <ReactLenis root options={{ autoRaf: desktopMotion, lerp: 0.1, smoothWheel: desktopMotion, anchors: desktopMotion ? { offset: -24, duration: 1.1 } : false }}>{body}</ReactLenis>
}
