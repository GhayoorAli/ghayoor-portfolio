import { site } from '../data/site'
import { Reveal } from './Reveal'

const channels = [
  {
    id: 'email',
    label: 'Gmail',
    hint: 'Write me directly',
    value: site.email,
    href: `mailto:${site.email}`,
    external: false,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z"
        />
      </svg>
    ),
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    hint: 'Connect professionally',
    value: 'in/ghayoorali',
    href: site.socials.linkedin,
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.36 4.26 5.44v6.3ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0Z"
        />
      </svg>
    ),
  },
  {
    id: 'github',
    label: 'GitHub',
    hint: 'Explore my code',
    value: 'GhayoorAli',
    href: site.socials.github,
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.04 10.04 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z"
        />
      </svg>
    ),
  },
] as const

export function Contact() {
  return (
    <section className="section contact" id="contact">
      <div className="container">
        <Reveal className="section-intro contact-intro">
          <p className="section-kicker">Connect</p>
          <h2 className="section-title">Let’s stay in touch.</h2>
          <p className="lede">
            Reach out for collaborations, roles, or a quick hello — pick the channel that fits you best.
          </p>
        </Reveal>

        <ul className="follow-grid">
          {channels.map((channel, index) => (
            <Reveal as="li" className="follow-item" delay={index * 100} from="scale" key={channel.id}>
              <a
                className={`follow-link follow-${channel.id}`}
                href={channel.href}
                target={channel.external ? '_blank' : undefined}
                rel={channel.external ? 'noreferrer' : undefined}
              >
                <span className="follow-icon">{channel.icon}</span>
                <span className="follow-meta">
                  <span className="follow-label">{channel.label}</span>
                  <span className="follow-hint">{channel.hint}</span>
                  <span className="follow-value">{channel.value}</span>
                </span>
                <span className="follow-arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
