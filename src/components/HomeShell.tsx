'use client'

import { ReactLenis } from 'lenis/react'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
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

export function HomeShell({ content }: { content: PortfolioContent }) {
  const pathname = usePathname()

  useEffect(() => {
    document.documentElement.classList.remove('no-js')
  }, [])

  useEffect(() => {
    const id = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : ''
    if (!id || pathname !== '/') return
    const node = document.getElementById(id)
    if (!node) return
    const t = window.setTimeout(() => {
      node.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 160)
    return () => window.clearTimeout(t)
  }, [pathname])

  const github = content.socials.find((s) => s.icon_key === 'github')?.url ?? content.socials[0]?.url ?? '#'
  const linkedin =
    content.socials.find((s) => s.icon_key === 'linkedin')?.url ?? content.socials[1]?.url ?? '#'

  const brand = content.site.name.split(' ').filter(Boolean).slice(-1)[0] || content.site.name

  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        lerp: 0.085,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        anchors: { offset: -80, duration: 1 },
      }}
    >
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
    </ReactLenis>
  )
}
