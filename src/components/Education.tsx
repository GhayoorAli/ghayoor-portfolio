'use client'

import type { CertificationItem, EducationItem } from '@/types/content'
import { Reveal } from './Reveal'

export function Education({
  education,
  certifications,
}: {
  education: EducationItem[]
  certifications: CertificationItem[]
}) {
  return (
    <section className="section credentials" id="education">
      <div className="container">
        <Reveal className="section-intro">
          <p className="section-kicker">Education</p>
          <h2 className="section-title">The foundation behind the work.</h2>
        </Reveal>

        <div className="edu-grid">
          <Reveal className="edu-block">
            <h3 className="block-label">Schools</h3>
            <ul className="edu-list">
              {education.map((item) => (
                <li key={item.school}>
                  <span>{item.period}</span>
                  <strong>{item.school}</strong>
                  <p>{item.degree}</p>
                  <em>{item.place}</em>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="edu-block" delay={80}>
            <h3 className="block-label">Certifications</h3>
            <ul className="cert-strip">
              {certifications.map((item) => {
                const inner = (
                  <>
                    <span className="cert-thumb">
                      <img
                        className="cert-thumb-img"
                        src={item.image}
                        alt={`${item.title} certificate`}
                        loading="lazy"
                      />
                      <img className="cert-zoom" src={item.image} alt="" aria-hidden="true" />
                    </span>
                    <span className="cert-copy">
                      <strong>{item.title}</strong>
                      <small>
                        {item.issuer} · {item.date}
                      </small>
                    </span>
                  </>
                )
                return (
                  <li key={`${item.title}-${item.date}`}>
                    {item.url ? (
                      <a className="cert-card" href={item.url} target="_blank" rel="noreferrer">
                        {inner}
                      </a>
                    ) : (
                      <div className="cert-card">{inner}</div>
                    )}
                  </li>
                )
              })}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
