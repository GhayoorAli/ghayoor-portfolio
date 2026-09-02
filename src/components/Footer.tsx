import { site } from '../data/site'
import { Reveal } from './Reveal'

export function Footer() {
  return (
    <footer className="footer">
      <Reveal className="container footer-row">
        <p>© {new Date().getFullYear()} {site.name}</p>
        <p>Designed & built with care.</p>
      </Reveal>
    </footer>
  )
}
