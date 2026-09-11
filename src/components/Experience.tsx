'use client'

import type { ExperienceItem } from '@/types/content'
import { Reveal } from './Reveal'

export function Experience({ items }: { items: ExperienceItem[] }) {
  return (
    <section className="section experience" id="experience">
      <div className="container">
        <Reveal className="section-intro">
          <p className="section-kicker">Experience</p>
          <h2 className="section-title">Years spent solving real problems.</h2>
        </Reveal>

        <ol className="exp-list">
          {items.map((item, index) => (
            <Reveal as="li" className="exp-row" delay={index * 60} key={`${item.role}-${item.period}`}>
              <div className="exp-meta">
                <span>{item.period}</span>
                <span>{item.location}</span>
              </div>
              <div className="exp-body">
                <h3>{item.role}</h3>
                <p className="exp-company">{item.company}</p>
                <p className="exp-stack">{item.stack.join(' · ')}</p>
                <p className="exp-summary">{item.summary}</p>
                <ul className="exp-points">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
