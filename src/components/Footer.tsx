import { site } from '../data/site'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer-row">
        <p>
          © {year} {site.name}
        </p>
        <p className="footer-credit">
          Designed & built by <span>{site.name}</span>
        </p>
        <nav className="footer-links" aria-label="Footer links">
          <a href={`mailto:${site.email}`}>Email</a>
          <a href={site.socials.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={site.socials.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </nav>
      </div>
    </footer>
  )
}
