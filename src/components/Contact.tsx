import { useState, type FormEvent } from 'react'
import { site } from '../data/site'
import { Reveal } from './Reveal'

type Status = 'idle' | 'sending' | 'sent'

export function Contact() {
  const [status, setStatus] = useState<Status>('idle')

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    window.setTimeout(() => setStatus('sent'), 900)
  }

  return (
    <section className="section contact" id="contact">
      <div className="container contact-grid">
        <Reveal className="contact-copy" from="left">
          <p className="section-kicker">Contact</p>
          <h2 className="section-title">Let’s build something that lasts.</h2>
          <p className="lede">
            Have a product in mind, a messy codebase that needs care, or a team that needs another pair of
            full-stack hands? Send a note — I read every one.
          </p>
          <ul className="contact-links">
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>
              <a href={site.socials.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href={site.socials.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={140} from="right">
          <form className="contact-form" onSubmit={onSubmit}>
            <label>
              Name
              <input name="name" type="text" autoComplete="name" required placeholder="Your name" />
            </label>
            <label>
              Email
              <input name="email" type="email" autoComplete="email" required placeholder="you@studio.com" />
            </label>
            <label>
              Message
              <textarea name="message" rows={5} required placeholder="What should we make?" />
            </label>
            <button className="btn btn-primary" type="submit" disabled={status !== 'idle'}>
              {status === 'idle' && 'Send message'}
              {status === 'sending' && 'Sending…'}
              {status === 'sent' && 'Message noted'}
            </button>
            {status === 'sent' && (
              <p className="form-note">Thanks — I’ll get back to you shortly.</p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  )
}
