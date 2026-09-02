import { experience } from '../data/site'
import { Reveal } from './Reveal'

export function Experience() {
  return (
    <section className="section experience" id="experience">
      <div className="container">
        <Reveal className="section-intro">
          <p className="section-kicker">Experience</p>
          <h2 className="section-title">Places the craft was sharpened.</h2>
        </Reveal>

        <ol className="timeline">
          {experience.map((item, index) => (
            <Reveal as="li" className="timeline-item" delay={index * 100} from="right" key={`${item.role}-${item.period}`}>
              <div className="timeline-meta">
                <span>{item.period}</span>
              </div>
              <div className="timeline-card">
                <h3>{item.role}</h3>
                <p className="timeline-company">
                  {item.company}
                  <span> · {item.location}</span>
                </p>
                <ul className="timeline-stack">
                  {item.stack.map((tool) => (
                    <li key={tool}>{tool}</li>
                  ))}
                </ul>
                <p className="timeline-summary">{item.summary}</p>
                <ul>
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
