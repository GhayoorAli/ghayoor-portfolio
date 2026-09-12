'use client'

import { ReactLenis } from 'lenis/react'
import { useReducedMotion } from 'framer-motion'
import { useEffect, type ReactNode } from 'react'

export function ProjectPageClient({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()

  useEffect(() => {
    document.documentElement.classList.remove('no-js')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const body = (
    <>
      <div className="site-grain" aria-hidden="true" />
      {children}
    </>
  )

  if (reduce) return body

  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        lerp: 0.14,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.15,
        syncTouch: false,
      }}
    >
      {body}
    </ReactLenis>
  )
}
