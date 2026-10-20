'use client'

import { ReactLenis } from 'lenis/react'
import { useDesktopMotion } from './useDesktopMotion'
import { useEffect, type ReactNode } from 'react'

export function ProjectPageClient({ children }: { children: ReactNode }) {
  const desktopMotion = useDesktopMotion()

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

  return (
    <ReactLenis
      root
      options={{
        autoRaf: desktopMotion,
        lerp: 0.14,
        smoothWheel: desktopMotion,
        wheelMultiplier: 1,
        touchMultiplier: 1.15,
        syncTouch: false,
        anchors: desktopMotion ? { offset: -88, duration: 1 } : false,
      }}
    >
      {body}
    </ReactLenis>
  )
}
