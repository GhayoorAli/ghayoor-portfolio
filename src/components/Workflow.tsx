import { useState, type CSSProperties } from 'react'
import { workflow } from '../data/site'
import { Reveal } from './Reveal'

export function Workflow() {
  const [active, setActive] = useState(0)
  const current = workflow[active]

  return (
    <section className="section process" id="process">
      <div className="container">
        <Reveal className="section-intro process-intro">
          <p className="section-kicker">How I work</p>
          <h2 className="section-title">My Development Process</h2>
        </Reveal>

        <Reveal className="process-orbit" from="scale" delay={80}>
          <div className="process-ring" aria-hidden="true" />

          <div className="process-hub" aria-live="polite">
            <span className="process-hub-step">{current.step}</span>
            <h3>{current.title}</h3>
            <p>{current.text}</p>
          </div>

          <ol className="process-nodes">
            {workflow.map((item, index) => {
              const angle = (360 / workflow.length) * index - 90
              return (
                <li
                  key={item.step}
                  className={`process-node-wrap ${active === index ? 'is-active' : ''}`}
                  style={{ '--angle': `${angle}deg` } as CSSProperties}
                >
                  <button
                    type="button"
                    className="process-node"
                    aria-pressed={active === index}
                    aria-label={`Step ${item.step}: ${item.title}`}
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    onClick={() => setActive(index)}
                  >
                    <span>{item.step}</span>
                  </button>
                </li>
              )
            })}
          </ol>
        </Reveal>

        <ul className="process-legend">
          {workflow.map((item, index) => (
            <li key={item.step} className={active === index ? 'is-active' : ''}>
              <button type="button" onClick={() => setActive(index)}>
                <strong>{item.step}</strong>
                <span>{item.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
