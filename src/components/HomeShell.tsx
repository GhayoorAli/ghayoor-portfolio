'use client'

import { ReactLenis, useLenis } from 'lenis/react'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useReducedMotion } from 'framer-motion'
import { About } from '@/components/About'
import { Contact } from '@/components/Contact'
import { Education } from '@/components/Education'
import { Experience } from '@/components/Experience'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { Navbar } from '@/components/Navbar'
import { Projects } from '@/components/Projects'
import { Skills } from '@/components/Skills'
import { Workflow } from '@/components/Workflow'
import type { PortfolioContent } from '@/types/content'

function HashScroll() {
  const pathname = usePathname()
  const lenis = useLenis()

  useEffect(() => {
    if (pathname !== '/' || !lenis) return
    const id = window.location.hash.replace('#', '')
    if (!id) return
    const node = document.getElementById(id)
    if (!node) return
    const t = window.setTimeout(() => {
      lenis.scrollTo(node, { offset: -80, duration: 0.9 })
    }, 80)
    return () => window.clearTimeout(t)
  }, [pathname, lenis])

  return null
}

export function HomeShell({ content }: { content: PortfolioContent }) {
  const reduce = useReducedMotion()

  useEffect(() => {
    document.documentElement.classList.remove('no-js')
  }, [])

  const github = content.socials.find((s) => s.icon_key === 'github')?.url ?? content.socials[0]?.url ?? '#'
  const linkedin =
    content.socials.find((s) => s.icon_key === 'linkedin')?.url ?? content.socials[1]?.url ?? '#'

  const brand = content.site.name.split(' ').filter(Boolean).slice(-1)[0] || content.site.name

  const body = (
    <>
      <div className="site-grain" aria-hidden="true" />
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <Navbar brand={brand} email={content.site.email} socials={content.socials} />
      <main>
        <Hero site={content.site} />
        <About site={content.site} />
        <Skills groups={content.skillGroups} />
        <Experience items={content.experience} />
        <Education education={content.education} certifications={content.certifications} />
        <Projects projects={content.projects} />
        <Workflow items={content.workflow} />
        <Contact email={content.site.email} github={github} linkedin={linkedin} socials={content.socials} />
      </main>
      <Footer name={content.site.name} email={content.site.email} socials={content.socials} />
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
        anchors: {
          offset: -80,
          duration: 0.85,
        },
      }}
    >
      <HashScroll />
      {body}
    </ReactLenis>
  )
}
