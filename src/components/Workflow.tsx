import { workflow } from '../data/site'
import { Reveal } from './Reveal'

export function Workflow() {
  return (
    <section className="section process" id="process">
      <div className="container">
        <Reveal className="section-intro">
          <p className="section-kicker">How I work</p>
          <h2 className="section-title">A calm path from question to launch.</h2>
        </Reveal>

        <ol className="process-list">
          {workflow.map((item, index) => (
            <Reveal as="li" className="process-step" delay={index * 90} from="scale" key={item.step}>
              <span className="process-index">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
