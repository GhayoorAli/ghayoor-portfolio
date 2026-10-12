'use client'

import type { PortfolioContent } from '@/types/content'
import { Reveal } from './Reveal'
import { TechIcon } from './TechIcon'
import { ReferenceIcon } from './ReferenceIcon'
import { Lines } from './PortfolioMotion'

const pillars = [
  { title: 'Backend & Data', icon: 'benefits', description: 'Reliable foundations for complex products.', pattern: /backend|database|api/i },
  { title: 'Frontend & UI', icon: 'skills', description: 'Considered interfaces, built for real people.', pattern: /frontend/i },
  { title: 'Tools & Delivery', icon: 'work', description: 'From the first commit to production.', pattern: /cloud|testing|tools/i },
]

export function SkillsSection({ groups }: { groups: PortfolioContent['skillGroups'] }) {
  return <section className="ref-section ref-skills" id="skills"><div className="ref-section-heading"><span className="ref-eyebrow">Skills & technologies</span><h2><Lines>{'Solutions\nThat Deliver'}</Lines></h2><p>From the database to the browser.<br />The tools and technologies I use to<br />build reliable, considered products.</p></div><div className="ref-skill-grid">{pillars.map((pillar, index) => {
    const selected = groups.filter(group => pillar.pattern.test(group.category) || (index === 2 && !pillars.some(p => p.pattern.test(group.category))))
    return <Reveal className="ref-skill-column" key={pillar.title} delay={index * 80}><div className="ref-skill-pillar"><span className="ref-square"><ReferenceIcon name={pillar.icon} /></span><span className="ref-skill-number">0{index + 1}</span><h3>{pillar.title}</h3><p>{pillar.description}</p></div><div className="ref-skill-groups">{selected.map(group => <div className="ref-skill-card" key={group.category}><h4>{group.category}</h4><ul>{group.items.map(item => <li key={item.id}><TechIcon id={item.icon_id} title={item.name} src={item.icon_url} /><span>{item.name}</span></li>)}</ul></div>)}</div><div className="ref-skill-count">{selected.reduce((total, group) => total + group.items.length, 0)} technologies <span>↗</span></div></Reveal>
  })}</div></section>
}
