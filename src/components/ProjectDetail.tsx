'use client'

import { gmailComposeUrl } from '@/lib/contact'

import Link from 'next/link'
import { useRef, useState } from 'react'
import type { Project, SiteSettings, SocialLink } from '@/types/content'
import { MermaidDiagram } from './MermaidDiagram'
import { ProjectGallery } from './ProjectGallery'
import { TechIcon } from './TechIcon'
import { ReferenceIcon } from './ReferenceIcon'
import { CopyEmail, RollingLabel } from './ReferenceUI'
import { Lines } from './PortfolioMotion'
import { useImageResolution } from './useImageResolution'

export function ProjectDetail({ project, site, socials, nextProject }: { project: Project; site: SiteSettings; socials: SocialLink[]; nextProject?: Project }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const coverRef = useRef<HTMLImageElement>(null)
  const coverSize = useImageResolution(project.cover, coverRef)
  const brand = site.name.split(' ').find(word => word.toLowerCase() === 'ghayoor') || site.name.split(' ')[0]
  const sections = [['overview', 'Overview'], ...(project.features.length ? [['features', 'Features']] : []), ...(project.architecture || project.workflow ? [['architecture', 'Architecture']] : []), ...(project.challenges.length ? [['challenges', 'Challenges']] : []), ...(project.gallery.length ? [['screenshots', 'Screenshots']] : []), ...(project.results ? [['results', 'Results']] : [])]
  return <div className="reference-portfolio ref-case-study">
    <a className="skip-link" href="#case-main">Skip to project</a>
    <aside className={`ref-case-sidebar${menuOpen ? ' is-expanded' : ''}`} aria-label="Project navigation">
      <div className="ref-panel ref-sidebar-intro"><div className="ref-sidebar-top"><Link className="ref-logo" href="/#top">{brand}<sup>®</sup></Link><div className="ref-social-icons">{socials.map(social => <a key={social.label} href={social.url} aria-label={social.label} target="_blank" rel="noreferrer"><ReferenceIcon name={social.label.toLowerCase()} /></a>)}<button className="ref-menu-toggle" aria-label="Toggle project navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>☰</button></div></div><p>Considered interfaces.<br />Dependable systems.<br />A closer look at the work.</p></div>
      <div className="ref-panel ref-case-summary"><span className="ref-eyebrow">Project / {project.year}</span><h2>{project.name}</h2><p>{project.tag}</p><Link href="/#work" className="ref-case-back"><span>←</span><RollingLabel>All selected work</RollingLabel></Link></div>
      <nav className="ref-panel ref-nav">{sections.map(([id, label], i) => <a href={`#${id}`} key={id} onClick={() => setMenuOpen(false)}><span className="ref-case-nav-number">0{i + 1}</span><span className="ref-nav-label"><RollingLabel>{label}</RollingLabel></span></a>)}</nav>
      <div className="ref-case-contact"><CopyEmail email={site.email} /><a href={gmailComposeUrl(site.email)} target="_blank" rel="noopener noreferrer" className="ref-button"><RollingLabel>Let’s talk</RollingLabel><span>↗</span></a></div>
    </aside>
    <main id="case-main" className="ref-case-main">
      <header className="ref-case-hero"><div className="ref-case-topline"><Link href="/#work"><RollingLabel>← Selected work</RollingLabel></Link><span>{project.year} / {project.tag}</span></div><h1>{project.name}<span className="ref-case-title-arrow" aria-hidden="true">↗</span></h1><div className="ref-case-intro"><p>{project.hook}</p><div className="ref-case-actions">{project.links.live && <a className="ref-button" href={project.links.live} target="_blank" rel="noreferrer"><RollingLabel>View live project</RollingLabel><span>↗</span></a>}{project.links.github && <a className="ref-button ref-case-secondary" href={project.links.github} target="_blank" rel="noreferrer"><ReferenceIcon name="github" /><RollingLabel>View source</RollingLabel></a>}</div></div><div className="ref-case-tags">{project.stack.map(item => <span key={item.id}>{item.name}</span>)}</div></header>
      <figure className="ref-case-cover" style={{ maxWidth: coverSize.width }}><div className="ref-case-browser"><span><i /><i /><i /></span><span>{project.name} / Project preview</span><a href={project.cover} target="_blank" rel="noopener noreferrer" aria-label={`View full-size ${project.name} preview`}>↗</a></div><img src={project.cover} alt={`${project.name} project preview`} fetchPriority="high" ref={coverRef} /></figure>
      <section id="overview" className="ref-case-section"><div className="ref-case-section-title"><span className="ref-eyebrow">01 / Overview</span><h2><Lines>{'The idea.\nThe execution.'}</Lines></h2></div><div className="ref-case-overview">{project.problem && <article><h3>The problem</h3><p>{project.problem}</p></article>}{project.role && <article><h3>My role</h3><p>{project.role}</p></article>}{project.stack.length > 0 && <article><h3>Built with</h3><ul className="ref-case-stack">{project.stack.map(item => <li key={item.id}><TechIcon id={item.id} title={item.name} src={item.icon_url} /><span>{item.name}</span></li>)}</ul></article>}</div></section>
      {project.features.length > 0 && <section id="features" className="ref-case-section ref-case-dark"><div className="ref-case-section-title"><span className="ref-eyebrow">Inside the product</span><h2><Lines>{'Built to work.\nMade to feel right.'}</Lines></h2></div><div className="ref-case-features">{project.features.map((feature, i) => <article key={feature}><span>0{i + 1}</span><h3>{feature}</h3><span aria-hidden="true">↗</span></article>)}</div></section>}
      {(project.architecture || project.workflow) && <section id="architecture" className="ref-case-section ref-case-diagrams"><div className="ref-case-section-title"><span className="ref-eyebrow">Under the surface</span><h2><Lines>{'How it\ncomes together.'}</Lines></h2></div><div>{project.architecture && <article className="ref-panel"><h3>System architecture</h3><MermaidDiagram chart={project.architecture} title={`${project.name} architecture`} /></article>}{project.workflow && <article className="ref-panel"><h3>Product workflow</h3><MermaidDiagram chart={project.workflow} title={`${project.name} workflow`} /></article>}</div></section>}
      {project.challenges.length > 0 && <section id="challenges" className="ref-case-section"><div className="ref-case-section-title"><span className="ref-eyebrow">Decisions that matter</span><h2><Lines>{'Challenges\n& solutions.'}</Lines></h2></div><div className="ref-case-challenges">{project.challenges.map((item, i) => <article className="ref-panel" key={item.title || item.problem}><span className="ref-square">0{i + 1}</span><h3>{item.title}</h3><div><span className="ref-eyebrow">Challenge</span><p>{item.problem}</p></div><div><span className="ref-eyebrow">Solution</span><p>{item.solution}</p></div></article>)}</div></section>}
      {project.gallery.length > 0 && <section id="screenshots" className="ref-case-section ref-case-gallery"><div className="ref-case-section-title"><span className="ref-eyebrow">A closer look</span><h2><Lines>{'The product,\nin detail.'}</Lines></h2></div><ProjectGallery key={project.slug} images={project.gallery} projectName={project.name} /></section>}
      {project.results && <section id="results" className="ref-case-section ref-case-results"><span className="ref-eyebrow">The outcome</span><h2><Lines>What the work delivered.</Lines></h2><p>{project.results}</p></section>}
      {nextProject && <Link href={`/work/${nextProject.slug}`} className="ref-case-next"><span className="ref-eyebrow">Next selected project</span><div><h2>{nextProject.name}</h2><span aria-hidden="true">↗</span></div><p>{nextProject.tag}</p></Link>}
      <footer className="ref-case-footer"><span>© {new Date().getFullYear()} {site.name}</span><Link href="/#work"><RollingLabel>Back to selected work</RollingLabel> ↗</Link></footer>
    </main>
  </div>
}
