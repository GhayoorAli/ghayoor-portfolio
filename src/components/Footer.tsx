import type { SocialLink } from '@/types/content'

export function Footer({
  name,
  email,
  socials,
}: {
  name: string
  email: string
  socials: SocialLink[]
}) {
  const year = new Date().getFullYear()
  const github = socials.find((s) => s.icon_key === 'github')?.url
  const linkedin = socials.find((s) => s.icon_key === 'linkedin')?.url
  const brand = name.split(' ').filter(Boolean).slice(-1)[0] || name

  return (
    <footer className="footer">
      <div className="footer-watermark" aria-hidden="true">
        {brand.toUpperCase()}
      </div>
      <div className="container footer-grid">
        <div>
          <p className="footer-tag">Software, built with intention.</p>
        </div>
        <div>
          <p className="footer-label">/Quick links</p>
          <nav className="footer-links" aria-label="Footer">
            <a href="#top">Home</a>
            <a href="#about">About Me</a>
            <a href="#skills">Skills</a>
            <a href="#work">Work</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
        <div>
          <p className="footer-label">/Contact</p>
          <nav className="footer-links footer-links-plain">
            <a href={`mailto:${email}`}>{email}</a>
            {github ? (
              <a href={github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            ) : null}
            {linkedin ? (
              <a href={linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            ) : null}
          </nav>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>
          © {year} {name}
        </p>
      </div>
    </footer>
  )
}
