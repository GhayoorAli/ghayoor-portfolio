'use client'

import { useEffect } from 'react'

export function useHeroMorph(root: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const page = root.current
    if (!page) return
    const media = matchMedia('(min-width: 901px) and (prefers-reduced-motion: no-preference)')
    let frame = 0
    let pairs: { source: HTMLElement; target: HTMLElement; dx: number; dy: number; sx: number; sy: number; start: number; end: number }[] = []
    const measure = () => {
      pairs.forEach(({ source, target }) => { source.style.transform = ''; source.style.opacity = ''; source.style.pointerEvents = ''; target.style.opacity = ''; const sourceControl = source.closest<HTMLElement>('a,button'); const targetControl = target.closest<HTMLElement>('a,button'); if (sourceControl) { sourceControl.tabIndex = 0; sourceControl.style.pointerEvents = '' }; if (targetControl) targetControl.tabIndex = 0 })
      pairs = []
      if (!media.matches) { page.style.removeProperty('--morph'); const sidebar = page.querySelector<HTMLElement>('.ref-sidebar'); if (sidebar) { sidebar.inert = false; sidebar.style.pointerEvents = '' }; return }
      page.querySelectorAll<HTMLElement>('[data-morph]').forEach(source => {
        const target = page.querySelector<HTMLElement>(`[data-destination="${source.dataset.morph}"]`)
        if (!target) return
        const a = source.getBoundingClientRect(), b = target.getBoundingClientRect()
        const label = source.querySelector<HTMLElement>('.ref-nav-reveal') || source
        const content = label.getBoundingClientRect()
        const ratio = parseFloat(getComputedStyle(target).fontSize) / parseFloat(getComputedStyle(label).fontSize)
        const uniform = source.dataset.uniform === 'true'
        const stickyTop = page.querySelector('.ref-hero-sticky')?.getBoundingClientRect().top || 0
        pairs.push({ source, target, dx: b.left - a.left - (uniform ? (content.left - a.left) * ratio : 0), dy: b.top - (a.top - stickyTop) - (uniform ? (content.top - a.top) * ratio : 0), sx: uniform ? ratio : b.width / a.width, sy: uniform ? ratio : b.height / a.height, start: Number(source.dataset.start || .03), end: Number(source.dataset.end || .4) })
      })
      update()
    }
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (!media.matches) return
        const progress = Math.min(1, window.scrollY / (window.innerHeight * 3))
        page.style.setProperty('--morph', String(progress))
        const sidebar = page.querySelector<HTMLElement>('.ref-sidebar')
        if (sidebar) { sidebar.inert = progress < .35; sidebar.style.pointerEvents = progress < .35 ? 'none' : 'auto' }
        page.style.setProperty('--sidebar-reveal', String(Math.max(0, Math.min(1, (progress - .31) / .08))))
        pairs.forEach(({ source, target, dx, dy, sx, sy, start, end }) => {
          const p = Math.max(0, Math.min(1, (progress - start) / (end - start)))
          source.style.transform = `translate(${dx * p}px, ${dy * p}px) scale(${1 + (sx - 1) * p}, ${1 + (sy - 1) * p})`
          source.style.opacity = p > .94 ? String((1 - p) / .06) : '1'
          source.style.pointerEvents = p > .94 ? 'none' : ''
          if (source.matches('a,button')) source.tabIndex = p > .94 ? -1 : 0
          const targetControl = target.closest<HTMLElement>('a,button')
          if (targetControl) targetControl.tabIndex = p > .94 ? 0 : -1
          if (source.dataset.morph === 'cta-label') { const control = source.closest('a'); if (control) { control.tabIndex = p > .94 ? -1 : 0; control.style.pointerEvents = p > .94 ? 'none' : '' } }
          target.style.opacity = p > .94 ? String((p - .94) / .06) : '0'
        })
      })
    }
    document.fonts.ready.then(measure)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', measure)
    media.addEventListener('change', measure)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', measure); media.removeEventListener('change', measure) }
  }, [root])
}

