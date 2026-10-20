'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { gmailComposeUrl } from '@/lib/contact'
import type { Project, SiteSettings, SocialLink } from '@/types/content'
import { MermaidDiagram } from './MermaidDiagram'
import { ProjectGallery } from './ProjectGallery'
import { TechIcon } from './TechIcon'
import { ReferenceIcon } from './ReferenceIcon'
import { CopyEmail, RollingLabel } from './ReferenceUI'
import { useImageResolution } from './useImageResolution'

function SectionTitle({ number, label, title }: { number: string; label: string; title: string }) {
  return <header className="ref-case-section-title"><span className="case-chapter">{number} / {label}</span><h2>{title}</h2></header>
}

function featureCopy(feature: string) {
  const separator = feature.search(/[:—]/)
  if (separator > 0 && separator < 58) return { title: feature.slice(0, separator).trim(), text: feature.slice(separator + 1).trim() }
  return { title: '', text: feature }
}

export function ProjectDetail({ project, projects, site, socials, nextProject, readmeContent }: { project: Omit<Project, 'readme'>; projects: Pick<Project, 'slug' | 'name'>[]; site: SiteSettings; socials: SocialLink[]; nextProject?: Pick<Project, 'slug' | 'name' | 'tag' | 'cover'>; readmeContent?: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const coverRef = useRef<HTMLImageElement>(null)
  const coverSize = useImageResolution(project.cover, coverRef)
  const brand = site.name.split(' ').find(word => word.toLowerCase() === 'ghayoor') || site.name.split(' ')[0]
  const hasReadme = Boolean(readmeContent)
  const sections = hasReadme ? [['overview', 'Project story'], ...(project.gallery.length ? [['screenshots', 'Gallery']] : [])] : [['overview', 'Overview'], ...(project.features.length ? [['features', 'Capabilities']] : []), ...(project.architecture || project.workflow ? [['architecture', 'Architecture']] : []), ...(project.challenges.length ? [['challenges', 'Decisions']] : []), ...(project.gallery.length ? [['screenshots', 'Gallery']] : []), ...(project.results ? [['results', 'Outcome']] : [])]

  const chapter = (id: string) => String(sections.findIndex(section => section[0] === id) + 1).padStart(2, '0')
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])

  useEffect(() => {
    const nav = navRef.current
    const link = nav?.querySelector<HTMLElement>('[aria-current="page"]')
    if (!nav || !link || !nav.clientHeight) return
    const bounds = nav.getBoundingClientRect()
    const selected = link.getBoundingClientRect()
    const top = selected.top < bounds.top ? selected.top - bounds.top : selected.bottom > bounds.top + nav.clientHeight ? selected.bottom - bounds.top - nav.clientHeight : 0
    if (top) nav.scrollBy({ top, behavior: 'instant' })
  }, [project.slug, menuOpen])

  return <div className="reference-portfolio ref-case-study">
    <a className="skip-link" href="#case-main">Skip to project</a>
    <aside className={`ref-case-sidebar${menuOpen ? ' is-expanded' : ''}`} aria-label="Project navigation">
      <div className="ref-panel ref-sidebar-intro"><div className="ref-sidebar-top"><Link className="ref-logo" href="/#top">{brand}</Link><div className="ref-social-icons">{socials.map(social => <a key={social.label} href={social.url} aria-label={social.label} target="_blank" rel="noreferrer"><ReferenceIcon name={social.label.toLowerCase()} /></a>)}<button className="ref-menu-toggle" aria-label="Toggle project navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>☰</button></div></div><p>Ideas into interfaces.<br />A closer look at the work.</p></div>
      <div className="ref-panel ref-case-summary"><span className="case-chapter">Selected project</span><h2>{project.name}</h2><p>{project.tag}</p><Link href="/#work" className="ref-case-back">← <RollingLabel>All selected work</RollingLabel></Link></div>
      <nav ref={navRef} className="ref-panel ref-nav" aria-label="Projects" data-lenis-prevent>{projects.map((item, i) => <Link href={`/work/${item.slug}`} key={item.slug} className={project.slug === item.slug ? 'is-active' : ''} aria-current={project.slug === item.slug ? 'page' : undefined} onClick={() => setMenuOpen(false)}><span className="ref-case-nav-number">{String(i + 1).padStart(2, '0')}</span><span className="ref-nav-label"><RollingLabel>{item.name}</RollingLabel></span><span className="case-nav-arrow" aria-hidden="true">↗</span></Link>)}</nav>
      <div className="ref-case-contact"><CopyEmail email={site.email} /><a href={gmailComposeUrl(site.email)} target="_blank" rel="noopener noreferrer" className="ref-button"><RollingLabel>Let’s talk</RollingLabel><span>↗</span></a></div>
    </aside>
    <main id="case-main" className="ref-case-main">
      <header className="ref-case-hero">
        <div className="case-hero-layout"><div className="case-hero-copy"><span className="case-project-label"><i />{project.tag}</span><h1>{project.name}</h1><p className="case-hero-description">{project.hook}</p><div className="ref-case-actions">{project.links.live && <a className="ref-button" href={project.links.live} target="_blank" rel="noreferrer"><RollingLabel>Explore live project</RollingLabel><span>↗</span></a>}{project.links.github && <a className="ref-button ref-case-secondary" href={project.links.github} target="_blank" rel="noreferrer"><ReferenceIcon name="github" /><RollingLabel>View source</RollingLabel></a>}</div></div><div className="case-project-facts"><div><span className="case-chapter">Project year</span><strong>{project.year}</strong></div><div><span className="case-chapter">Focus</span><strong>{project.tag}</strong></div><div><span className="case-chapter">Core technologies</span><div className="ref-case-tags">{project.stack.slice(0, 4).map(item => <span key={item.id}><TechIcon id={item.id} title={item.name} src={item.icon_url} />{item.name}</span>)}</div></div></div></div>
      </header>
      <figure className="ref-case-cover"><div className="case-preview-grid" aria-hidden="true" /><div className="ref-case-screen" style={{ maxWidth: coverSize.width }}><div className="ref-case-browser"><span><i /><i /><i /></span><span>{project.name}</span><a href={project.cover} target="_blank" rel="noopener noreferrer" aria-label={`View full-size ${project.name} preview`}>↗</a></div><img src={project.cover} alt={`${project.name} project preview`} fetchPriority="high" decoding="async" ref={coverRef} /></div><figcaption><span>01 / Project preview</span><a href={project.gallery.length ? '#screenshots' : '#overview'}>{project.gallery.length ? 'Explore the interface ↓' : 'Project overview ↓'}</a></figcaption></figure>
      {hasReadme ? <section id="overview" className="ref-case-section ref-case-readme">{readmeContent}</section> : <>
      <section id="overview" className="ref-case-section"><SectionTitle number={chapter('overview')} label="Overview" title="Behind the build." /><div className="ref-case-overview">{project.problem && <article><span className="case-chapter">The starting point</span><h3>The problem</h3><p>{project.problem}</p></article>}{project.role && <article><span className="case-chapter">My contribution</span><h3>My role</h3><p>{project.role}</p></article>}{project.stack.length > 0 && <article className="case-stack-panel"><span className="case-chapter">Tools & technologies</span><h3>Built with</h3><ul className="ref-case-stack">{project.stack.map(item => <li key={item.id}><TechIcon id={item.id} title={item.name} src={item.icon_url} /><span>{item.name}</span></li>)}</ul></article>}</div></section>
      {project.features.length > 0 && <section id="features" className="ref-case-section ref-case-dark"><SectionTitle number={chapter('features')} label="Capabilities" title="Inside the product." /><div className="ref-case-features">{project.features.map((feature, i) => { const copy = featureCopy(feature); return <article key={feature}><div className="case-feature-top"><span>{String(i + 1).padStart(2, '0')}</span><ReferenceIcon name="skills" /></div>{copy.title && <h3>{copy.title}</h3>}<p>{copy.text}</p></article> })}</div></section>}
      {(project.architecture || project.workflow) && <section id="architecture" className="ref-case-section ref-case-diagrams"><SectionTitle number={chapter('architecture')} label="Architecture" title="How it fits together." /><div>{project.architecture && <article className="ref-panel"><header><span className="case-chapter">System design</span><h3>Architecture</h3></header><MermaidDiagram chart={project.architecture} title={`${project.name} architecture`} /></article>}{project.workflow && <article className="ref-panel"><header><span className="case-chapter">From action to outcome</span><h3>Product workflow</h3></header><MermaidDiagram chart={project.workflow} title={`${project.name} workflow`} /></article>}</div></section>}
      {project.challenges.length > 0 && <section id="challenges" className="ref-case-section"><SectionTitle number={chapter('challenges')} label="Decisions" title="The work behind the work." /><div className="ref-case-challenges">{project.challenges.map((item, i) => <article key={item.title || item.problem}><span className="ref-square">{String(i + 1).padStart(2, '0')}</span><h3>{item.title}</h3><div className="case-challenge-copy"><div><span className="case-chapter">Challenge</span><p>{item.problem}</p></div><div><span className="case-chapter">Solution</span><p>{item.solution}</p></div></div></article>)}</div></section>}
      </>}
      {project.gallery.length > 0 && <section id="screenshots" className="ref-case-section ref-case-gallery"><SectionTitle number={chapter('screenshots')} label="Gallery" title="A closer look." /><ProjectGallery key={project.slug} images={project.gallery} projectName={project.name} /></section>}
      {!hasReadme && project.results && <section id="results" className="ref-case-section ref-case-results"><SectionTitle number={chapter('results')} label="Outcome" title="What the work delivered." /><p>{project.results}</p></section>}
      {nextProject && <Link href={`/work/${nextProject.slug}`} className="case-next-project"><div className="case-next-copy"><span className="case-chapter">Keep exploring / Next project</span><h2>{nextProject.name}</h2><p>{nextProject.tag}</p><span className="case-next-cta">View case study <span aria-hidden="true">↗</span></span></div><div className="case-next-image"><img src={nextProject.cover} alt="" loading="lazy" decoding="async" /></div></Link>}
      <footer className="ref-case-footer"><span>© {new Date().getFullYear()} {site.name}</span></footer>
    </main>
  </div>
}
