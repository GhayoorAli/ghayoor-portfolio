'use client'

import type { SkillGroup } from '@/types/content'
import { Reveal } from './Reveal'
import { TechIcon } from './TechIcon'

export function Skills({ groups }: { groups: SkillGroup[] }) {
  return (
    <section className="section skills" id="skills">
      <div className="container">
        <Reveal className="section-intro">
          <p className="section-kicker">Skills</p>
          <h2 className="section-title">Skills & Technologies</h2>
        </Reveal>

        <ul className="skill-rows">
          {groups.map((group, index) => (
            <Reveal as="li" className="skill-row" key={group.category} delay={index * 50}>
              <h3>{group.category}</h3>
              <ul className="skill-tools">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <TechIcon id={item.icon_id || item.id} title={item.name} />
                    <span>{item.name}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
