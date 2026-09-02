import { about, site } from '../data/site'
import { Reveal } from './Reveal'

export function About() {
  return (
    <section className="section about" id="about">
      <div className="container">
        <div className="about-layout">
          <Reveal className="about-portrait" from="left">
            <div className="about-portrait-glow" aria-hidden="true" />
            <div className="about-portrait-plate" aria-hidden="true" />
            <figure className="about-portrait-frame">
              <img
                src="/images/portrait.webp?v=2"
                alt={site.name}
                width={640}
                height={800}
              />
            </figure>
          </Reveal>

          <Reveal className="about-copy" delay={120} from="right">
            <p className="section-kicker">{about.kicker}</p>
            <h2 className="section-title">{about.heading}</h2>
            {about.body.map((paragraph) => (
              <p key={paragraph} className="lede">
                {paragraph}
              </p>
            ))}
            <p className="about-note">Currently building with Laravel, MySQL, React, and Next.js — open to discuss new opportunities.</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
