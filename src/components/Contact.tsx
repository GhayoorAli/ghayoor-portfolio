'use client'

import type { SocialLink } from '@/types/content'
import { Reveal } from './Reveal'

export function Contact({
  email,
  github,
  linkedin,
}: {
  email: string
  github: string
  linkedin: string
  socials?: SocialLink[]
}) {
  return (
    <section className="section contact" id="contact">
      <div className="container contact-layout">
        <Reveal className="contact-copy">
          <p className="section-kicker">Contact</p>
          <h2 className="section-title contact-title">Let’s talk.</h2>
          <p className="lede">
            Have a project or role in mind? Reach out — I usually reply within a day or two.
          </p>
        </Reveal>

        <Reveal className="contact-channels" delay={100}>
          <a className="contact-row" href={`mailto:${email}`}>
            <span>Email</span>
            <strong>{email}</strong>
          </a>
          <a className="contact-row" href={linkedin} target="_blank" rel="noreferrer">
            <span>LinkedIn</span>
            <strong>Connect</strong>
          </a>
          <a className="contact-row" href={github} target="_blank" rel="noreferrer">
            <span>GitHub</span>
            <strong>Code</strong>
          </a>
        </Reveal>
      </div>
    </section>
  )
}
