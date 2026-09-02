import { stackGroups } from '../data/site'
import { Reveal } from './Reveal'
import { TechIcon } from './TechIcon'

export function Skills() {
  return (
    <section className="section skills" id="skills">
      <div className="container">
        <Reveal className="section-intro">
          <p className="section-kicker">Skills</p>
          <h2 className="section-title">The tools I reach for to ship.</h2>
        </Reveal>

        <div className="stack-board">
          {stackGroups.map((group, groupIndex) => (
            <Reveal key={group.category} className="stack-group" delay={groupIndex * 100}>
              <h3 className="stack-category">{group.category}</h3>
              <ul className="stack-items">
                {group.items.map((item) => (
                  <li key={item.id} className="stack-card">
                    <TechIcon id={item.id} title={item.name} />
                    <span>{item.name}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
