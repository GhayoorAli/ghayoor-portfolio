'use client'

import { useEffect, useRef } from 'react'
import { useLenis } from 'lenis/react'

export function useLandingSequence() {
  const root = useRef<HTMLDivElement>(null)
  const lenis = useLenis()
  useEffect(() => {
    const page = root.current
    if (!page) return
    let cancelled = false
    let unlock = 0
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const desktop = innerWidth >= 768
    const image = page.querySelector<HTMLImageElement>('.ref-portrait-image')
    const wordmark = page.querySelector<HTMLElement>('.ref-wordmark')
    const rect = wordmark?.getBoundingClientRect()
    page.style.setProperty('--intro-y', `${rect ? (innerHeight - rect.height) / 2 - rect.top : 0}px`)
    const start = async () => {
      // Mobile has no intro: do not wait for fonts or image decoding.
      if (reduced || !desktop) { page.dataset.intro = 'skipped'; return }
      await document.fonts.ready
      if (image) await image.decode().catch(() => undefined)
      if (cancelled) return
      if (reduced || !desktop || scrollY > 10 || location.hash && location.hash !== '#top') {
        page.dataset.intro = 'skipped'
        return
      }
      lenis?.stop()
      page.dataset.intro = 'playing'
      unlock = window.setTimeout(() => { lenis?.start(); page.dataset.introFinished = 'true' }, 2800)
    }
    start()
    return () => { cancelled = true; clearTimeout(unlock); lenis?.start() }
  }, [lenis])
  return root
}
