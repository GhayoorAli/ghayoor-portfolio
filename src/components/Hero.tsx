import { HeroCanvas } from './HeroCanvas'
import { site } from '../data/site'

export function Hero() {
  return (
    <section className="hero" id="top">
      <HeroCanvas />
      <div className="hero-orbs" aria-hidden="true">
        <span className="orb orb-a" />
        <span className="orb orb-b" />
        <span className="orb orb-c" />
      </div>
      <div className="hero-grain" aria-hidden="true" />
      <div className="hero-vignette" aria-hidden="true" />

      <div className="hero-inner">
        <p className="hero-kicker">
          <span className="pulse-dot" />
          Open to Discuss New Opportunities
        </p>
        <h1 className="hero-title">
          <span className="hero-hello">{site.greeting}</span>
          <span className="hero-name">{site.name}</span>
        </h1>
        <p className="hero-role">{site.title}</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#work">
            View selected work
          </a>
          <a className="btn btn-ghost" href="#about">
            About me
          </a>
        </div>
      </div>

      <div className="hero-stats">
        <ul>
          {site.stats.map((stat) => (
            <li key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <a className="hero-scroll" href="#about" aria-label="Scroll to about">
        <span>Scroll</span>
        <i />
      </a>
    </section>
  )
}
