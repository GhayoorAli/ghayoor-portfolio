import { certifications, education } from '../data/site'
import { Reveal } from './Reveal'

export function Education() {
  return (
    <section className="section credentials" id="education">
      <div className="container">
        <Reveal className="section-intro">
          <p className="section-kicker">Education & Certifications</p>
          <h2 className="section-title">Learning that supports the craft.</h2>
        </Reveal>

        <Reveal className="credentials-block" from="left">
          <h3 className="credentials-heading">Education</h3>
          <ol className="edu-list">
            {education.map((item) => (
              <li key={item.school} className="edu-item">
                <span className="edu-mark" aria-hidden="true" />
                <div className="edu-copy">
                  <p className="edu-period">{item.period}</p>
                  <h4>{item.school}</h4>
                  <p className="edu-degree">{item.degree}</p>
                  <p className="edu-place">{item.place}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal className="credentials-block cert-block" delay={100} from="up">
          <h3 className="credentials-heading">Certifications</h3>
          <ul className="cert-gallery">
            {certifications.map((item, index) => {
              const media = (
                <figure className="cert-frame">
                  <img src={item.image} alt={`${item.title} — ${item.issuer}`} loading="lazy" />
                </figure>
              )

              return (
                <Reveal as="li" className="cert-item" delay={index * 70} from="scale" key={`${item.title}-${item.date}`}>
                  {item.url ? (
                    <a className="cert-shot" href={item.url} target="_blank" rel="noreferrer">
                      {media}
                      <span className="cert-caption">
                        <strong>{item.title}</strong>
                        <span>
                          {item.issuer} · {item.date}
                        </span>
                        <em>Verify certificate →</em>
                      </span>
                    </a>
                  ) : (
                    <div className="cert-shot is-static">
                      {media}
                      <span className="cert-caption">
                        <strong>{item.title}</strong>
                        <span>
                          {item.issuer} · {item.date}
                          {'note' in item && item.note ? ` · ${item.note}` : ''}
                        </span>
                      </span>
                    </div>
                  )}
                </Reveal>
              )
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
