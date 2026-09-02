import { projects } from '../data/site'
import { Reveal } from './Reveal'

export function Projects() {
  return (
    <section className="section work" id="work">
      <div className="container">
        <Reveal className="section-intro">
          <p className="section-kicker">Selected work</p>
          <h2 className="section-title">Projects built end to end.</h2>
        </Reveal>

        <div className="project-grid">
          {projects.map((project, index) => (
            <Reveal
              as="article"
              className={`project-card accent-${project.accent}`}
              delay={index * 90}
              from={index % 2 === 0 ? 'left' : 'right'}
              key={project.name}
            >
              <div className="project-art" aria-hidden="true">
                <div className="project-window">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="project-mock">
                  <em />
                  <em />
                  <em />
                  <em />
                </div>
              </div>
              <div className="project-body">
                <div className="project-meta">
                  <span>{project.tag}</span>
                  <span>{project.year}</span>
                </div>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <ul className="project-tags">
                  {project.stack.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
