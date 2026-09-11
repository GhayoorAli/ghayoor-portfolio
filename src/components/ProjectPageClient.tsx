'use client'

import { useEffect, type ReactNode } from 'react'

export function ProjectPageClient({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.remove('no-js')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <>
      <div className="site-grain" aria-hidden="true" />
      {children}
    </>
  )
}
