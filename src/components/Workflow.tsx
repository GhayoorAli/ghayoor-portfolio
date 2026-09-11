'use client'

import type { WorkflowItem } from '@/types/content'
import { Reveal } from './Reveal'

export function Workflow({ items }: { items: WorkflowItem[] }) {
  if (!items.length) return null

  return (
    <section className="section process" id="process">
      <div className="container">
        <Reveal className="section-intro">
          <p className="section-kicker">How I work</p>
          <h2 className="section-title">From idea to launch.</h2>
        </Reveal>

        <ol className="process-list">
          {items.map((item, index) => (
            <Reveal as="li" className="process-row" key={item.step} delay={index * 60}>
              <span className="process-step">{item.step}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
