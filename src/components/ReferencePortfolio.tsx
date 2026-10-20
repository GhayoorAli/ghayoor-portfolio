'use client'

import { gmailComposeUrl } from '@/lib/contact'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion, useMotionValue, useTransform } from 'framer-motion'
import type { ExperienceItem, HomeContent } from '@/types/content'
import { Reveal } from './Reveal'
import { useLandingSequence } from './useLandingSequence'
import { useHeroMorph } from './useHeroMorph'
import { SelectedWork } from './SelectedWork'
import { ReferenceIcon } from './ReferenceIcon'
import { CopyEmail, RollingLabel, StatValue } from './ReferenceUI'
import { SkillsSection } from './SkillsSection'
import { Benefits, Chat, CredentialCarousel, FAQGroup, Lines, StoryButton, TimelinePath, Year } from './PortfolioMotion'

const navigationItems = [
  ['top', 'Home', '⌂'], ['about', 'About me', '◕'], ['work', 'Projects', '▣'],
  ['benefits', 'What I Bring', '▤'], ['skills', 'Skills', 'ϟ'],
  ['credentials', 'Qualifications', '♟'], ['faq', 'FAQ', '?'],
] as const

function ExperienceDetails({ item }: { item: ExperienceItem }) {
  const sections = item.sections?.length ? item.sections : [{ title: 'Responsibilities', points: item.points }]
  return <div className="ref-experience-layout">
    <div className="ref-experience-overview">
      <p className="ref-experience-intro">{item.summary}</p>
      <dl className="ref-experience-meta">
        <div><dt>Company</dt><dd>{item.company}{item.employment_type && <span>{item.employment_type}</span>}</dd></div>
        <div><dt>Period</dt><dd>{item.period}{item.duration && <span>{item.duration}</span>}</dd></div>
        {item.location && <div><dt>Location</dt><dd>{item.location}</dd></div>}
      </dl>
    </div>
    <div className={`ref-experience-workspace${sections.length === 3 ? ' ref-experience-workspace--balanced' : ''}${sections.length >= 4 ? ' ref-experience-workspace--many' : ''}`}>
      {sections.map((section, sectionIndex) => <section className="ref-experience-panel" key={section.title}>
        <div className="ref-experience-panel-heading"><div className="ref-experience-panel-title"><span className="ref-experience-section-index" aria-hidden="true">{String(sectionIndex + 1).padStart(2, '0')}</span><h3>{section.title}</h3></div><span>{String(section.points.length).padStart(2, '0')} {section.points.length === 1 ? 'contribution' : 'contributions'}</span></div>
        <ul>{section.points.map((point, index) => {
          const firstSpace = point.indexOf(' ')
          return <li key={`${index}-${point}`}><span className="ref-experience-point-marker" aria-hidden="true" /><p>{firstSpace > 0 ? <><strong>{point.slice(0, firstSpace)}</strong>{point.slice(firstSpace)}</> : point}</p></li>
        })}</ul>
      </section>)}
    </div>
  </div>
}

export function ReferencePortfolio({ content }: { content: HomeContent }) {
  const pageRef = useLandingSequence()
  useHeroMorph(pageRef)
  const { site } = content
  const portraitUrl = site.portrait_url === '/images/portrait-side-pose.png'
    ? '/images/portrait-side-pose.lossless.webp' : site.portrait_url
  const navigation = useMemo(() => navigationItems.filter(([id]) => id !== 'faq' || content.faqs.length > 0), [content.faqs.length])
  const brand = site.name.split(' ').find(name => name.toLowerCase() === 'ghayoor') || site.name.split(' ')[0]
  const [active, setActive] = useState('top')
  const [menuOpen, setMenuOpen] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const heroProgress = useMotionValue(0)
  const blur = useTransform(heroProgress, [0, .65], ['blur(0px)', 'blur(90px)'])
  const portraitOpacity = useTransform(heroProgress, [0, .7], [1, .3])
  const heroFade = useTransform(heroProgress, [.05, .2], [1, 0])

  useEffect(() => {
    let frame = 0
    const updateActive = () => {
      const hero = heroRef.current
      if (hero) heroProgress.set(Math.max(0, Math.min(1, -hero.getBoundingClientRect().top / hero.offsetHeight)))
      let current = 'top'
      navigation.forEach(([id]) => {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top <= window.innerHeight * .4) current = id
      })
      setActive(current)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(() => { frame = 0; updateActive() })
    }
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('keydown', closeOnEscape)
    updateActive()
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [heroProgress, navigation])

  const stats = [site.stats[1], site.stats[0]].filter(Boolean)
  const milestones = [
    ...content.education.map(item => ({ date: item.period, title: item.degree, text: item.school, detail: item.place, kind: 'Education', company: '', details: undefined })),
    ...content.experience.map(item => ({ date: item.period, title: item.role, text: item.summary, detail: item.company, kind: 'Experience', company: `${item.company}${item.employment_type ? ` · ${item.employment_type}` : ''}`, details: <ExperienceDetails item={item} /> })),
  ].sort((a, b) => Number(a.date.match(/\d{4}/)?.[0] ?? 0) - Number(b.date.match(/\d{4}/)?.[0] ?? 0))
  const questions = content.faqs.map(item => [item.question, item.answer])

  return (
    <div className="reference-portfolio" ref={pageRef} data-intro="loading">
      <a className="skip-link" href="#about">Skip to content</a>
      <aside className={`ref-sidebar ${active !== 'top' ? 'is-visible' : ''} ${menuOpen ? 'is-expanded' : ''}`} aria-label="Portfolio navigation">
        <div className="ref-panel ref-sidebar-intro"><div className="ref-sidebar-top"><a href="#top" className="ref-logo" data-destination="logo">{brand}</a><div className="ref-social-icons">{content.socials.map(social => <a key={social.label} href={social.url} target="_blank" rel="noreferrer" aria-label={social.label}><ReferenceIcon name={social.label.toLowerCase()} /></a>)}<button className="ref-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation">☰</button></div></div><p>Working closely with your team to deliver thoughtful interfaces, reliable systems, and long-term value.</p></div>
        <div className="ref-panel ref-sidebar-stats">{stats.map((stat, index) => <div key={stat.label} data-destination={`stat-bg-${index}`}><strong data-destination={`stat-icon-${index}`}>{index === 0 ? '↗' : <StatValue value={stat.value} />}</strong><span data-destination={`stat-text-${index}`}>{index === 0 ? `${stat.value} Projects` : <>Years of<br />experience</>}</span></div>)}</div>
        <nav className="ref-panel ref-nav">{navigation.map(([id, label]) => <a key={id} href={`#${id}`} className={active === id ? 'is-active' : ''} onClick={() => setMenuOpen(false)}><span aria-hidden="true"><ReferenceIcon name={id} /></span><span className="ref-nav-label" data-destination={`nav-${id}`}><RollingLabel>{label}</RollingLabel></span></a>)}</nav>
        <div className="ref-panel ref-stack-marquee"><div className="ref-stack-track">{[0, 1].map(copy => <div className="ref-stack-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{['Laravel', 'React', 'Next.js', 'Vue', 'TypeScript', 'React Native', 'Docker', 'WordPress', 'PHP'].map(technology => <span key={technology}>{technology}</span>)}</div>)}</div></div>
        <CopyEmail email={site.email} />
        <a href={gmailComposeUrl(site.email)} target="_blank" rel="noopener noreferrer" className="ref-button ref-sidebar-cta" data-destination="cta-bg"><span data-destination="cta-label"><RollingLabel>Let’s talk</RollingLabel></span><span>↗</span></a>
      </aside>
      <main>
        <section className="ref-hero" id="top" ref={heroRef}>
          <div className="ref-hero-sticky"><h1 data-morph="logo" data-start="0" data-end=".44" className="ref-wordmark" aria-label={brand}><span className="ref-wordmark-intro"><svg viewBox="0 0 1000 300" aria-hidden="true">{Array.from(brand.toUpperCase()).map((letter, index, letters) => <g className="ref-intro-letter" style={{ '--letter-index': index } as React.CSSProperties} key={index}><text x={index * 1000 / letters.length} y="270" textLength={1000 / letters.length} lengthAdjust="spacingAndGlyphs">{letter}</text></g>)}</svg></span></h1>
          <nav className="ref-hero-nav" aria-label="Main"><div>{navigation.slice(0, 3).map(([id, label]) => <a key={id} data-morph={`nav-${id}`} data-uniform="true" data-start={.01 + navigation.findIndex(item => item[0] === id) * .01} data-end={.3 + navigation.findIndex(item => item[0] === id) * .01} href={`#${id}`}><span className="ref-nav-reveal"><RollingLabel>{label}</RollingLabel></span></a>)}</div><div>{navigation.slice(3).map(([id, label]) => <a key={id} data-morph={`nav-${id}`} data-uniform="true" data-start={.01 + navigation.findIndex(item => item[0] === id) * .01} data-end={.3 + navigation.findIndex(item => item[0] === id) * .01} href={`#${id}`}><span className="ref-nav-reveal"><RollingLabel>{label}</RollingLabel></span></a>)}</div></nav>

          <motion.div className="ref-portrait-backdrop" style={reduce ? undefined : { filter: blur, opacity: portraitOpacity }}><img className="ref-portrait-image" src={portraitUrl} alt={site.name} fetchPriority="high" decoding="async" /></motion.div>
          <div className="ref-hero-center"><div className="ref-hero-badges"><div className="ref-glass ref-project-badge"><span className="ref-stat-glass" data-morph="stat-bg-0" /><strong data-morph="stat-icon-0" data-uniform="true">↗</strong><span data-morph="stat-text-0" data-uniform="true">{site.stats[1]?.value || content.projects.length}<br />Projects</span></div><div className="ref-glass ref-years-badge"><span className="ref-stat-glass" data-morph="stat-bg-1" /><strong data-morph="stat-icon-1" data-uniform="true"><StatValue value={site.stats[0]?.value || '4+'} /></strong><span data-morph="stat-text-1" data-uniform="true">Years of<br />experience</span></div></div><div className="ref-hero-pitch"><motion.p style={reduce ? undefined : { opacity: heroFade }}><span className="ref-hero-heading-line">Yes, I’m</span><span className="ref-hero-heading-line">Full Stack</span><span className="ref-hero-heading-line">Developer</span></motion.p><div><a className="ref-button ref-primary-cta" href={gmailComposeUrl(site.email)} target="_blank" rel="noopener noreferrer"><span className="ref-cta-bg" data-morph="cta-bg" data-end=".35" /><span className="ref-cta-label" data-morph="cta-label" data-end=".35" data-uniform="true"><RollingLabel>Let’s talk</RollingLabel></span></a><motion.a style={reduce ? undefined : { opacity: heroFade }} className="ref-button" href="#about"><RollingLabel>About me</RollingLabel></motion.a></div></div><motion.ul style={reduce ? undefined : { opacity: heroFade }} className="ref-glass ref-traits">{['Problem solver', 'Team player', 'Clean code', 'Product-focused', 'Curious'].map((trait, i) => <li key={trait}><span aria-hidden="true"><ReferenceIcon name={['Problem Solver', 'reliable', 'strategist', 'builder', 'efficient'][i]} /></span>{trait}</li>)}</motion.ul></div>
          </div>
        </section>
        <section className="ref-section ref-journey" id="about"><div className="ref-section-heading"><span className="ref-eyebrow">Start small. Grow big.</span><h2><Lines>{"About Me (&)\nMy Journey"}</Lines></h2><p>Every step has shaped how I build.<br />The education, experience and ideas<br />behind the work I do today.</p></div><div className="ref-timeline"><TimelinePath />{milestones.map((item, i) => <motion.div initial={reduce ? false : { scale: .6, y: 40, opacity: 0 }} whileInView={{ scale: 1, y: 0, opacity: 1 }} viewport={{ once: true, amount: .3 }} transition={{ duration: 1.1, ease: [.16, 1, .3, 1] }} className={`ref-milestone milestone-${i % 2}`} key={`${item.title}-${item.date}`}><span className="ref-timeline-dot" /><div className="ref-panel ref-milestone-card"><Year year={item.date.match(/\d{4}/)?.[0].slice(2) || "00"} /><h3><Lines>{item.title}</Lines></h3>{item.company && <p className="ref-milestone-company">{item.company}</p>}<p className="ref-milestone-summary"><Lines>{item.text}</Lines></p><div className="ref-milestone-meta"><span>{item.kind}<br />{item.date}</span><StoryButton title={item.title} kind={item.kind} text={item.kind === 'Experience' ? item.text : `${item.detail}. ${item.text} (${item.date})`} details={item.details} /></div></div></motion.div>)}</div></section>
        <SelectedWork projects={content.projects} />
        <section className="ref-section ref-benefits" id="benefits"><Benefits /></section>
        <SkillsSection groups={content.skillGroups} />
        <section className="ref-section ref-contact" id="contact"><div className="ref-contact-content"><h2><Lines>{"Let’s Build\nSomething Useful"}</Lines></h2><p>Open to full-time, part-time, remote or hybrid roles. I enjoy working on products end to end, from the Backend to Frontend.</p><div className="ref-contact-person"><span className="ref-contact-avatar"><img src={portraitUrl} alt={site.name} loading="lazy" decoding="async" /></span><Chat email={site.email} /></div></div></section>
        <section className="ref-section ref-credentials" id="credentials"><div className="ref-section-heading"><span className="ref-eyebrow">Education & certifications</span><h2><Lines>{"The Learning\nBehind the Work"}</Lines></h2></div><CredentialCarousel count={content.certifications.length}>{content.certifications.map((cert, i) => <Reveal className="ref-panel ref-credential" key={cert.title} delay={i * 20}><span className="ref-square">↗</span><h3>{cert.title}</h3><p>{cert.issuer}</p><div className="ref-credential-image"><img draggable={false} src={cert.image} alt={`${cert.title} certificate`} loading="lazy" decoding="async" /></div><div className="ref-credential-meta"><span>{cert.date}</span>{cert.url && <a href={cert.url} target="_blank" rel="noreferrer">View credential ↗</a>}</div></Reveal>)}</CredentialCarousel></section>
        <div className="ref-bottom-wordmark" aria-hidden="true"><svg viewBox="0 0 1000 300"><text x="0" y="270" textLength="1000" lengthAdjust="spacingAndGlyphs">{brand.toUpperCase()}</text></svg></div>
        {questions.length > 0 && <section className="ref-section ref-faq" id="faq"><div className="ref-section-heading"><span className="ref-eyebrow">FAQ</span><h2><Lines>{"Got any\nquestions?"}</Lines></h2></div><FAQGroup questions={questions} /></section>}
      </main>
      <footer className="ref-footer"><span>© {new Date().getFullYear()} {site.name}</span><a href={gmailComposeUrl(site.email)} target="_blank" rel="noopener noreferrer">{site.email} ↗</a><a href="#top">Back to top ↑</a></footer>
    </div>
  )
}
