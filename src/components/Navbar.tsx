'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { SocialLink } from '@/types/content'

const links = [
  { href: '#about', label: 'About Me' },
  { href: '#skills', label: 'Skills' },
  { href: '#work', label: 'Work' },
  { href: '#contact', label: 'Contact' },
]

type NavbarProps = {
  brand: string
  email: string
  socials: SocialLink[]
}

export function Navbar({ brand, email, socials }: NavbarProps) {
  const pathname = usePathname()
  const onHome = pathname === '/'
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const github = socials.find((s) => s.icon_key === 'github')?.url
  const linkedin = socials.find((s) => s.icon_key === 'linkedin')?.url

  return (
    <>
      {open ? <button className="nav-scrim" type="button" aria-label="Close menu" onClick={() => setOpen(false)} /> : null}

      <header className={`nav-island ${open ? 'is-open' : ''}`}>
        <div className="nav-island-bar">
          <Link
            className="nav-island-brand"
            href={onHome ? '#top' : '/'}
            onClick={() => setOpen(false)}
          >
            {brand}
          </Link>
          <button
            className="nav-island-toggle"
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <span className="nav-island-x" aria-hidden="true" />
            ) : (
              <span className="nav-island-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            )}
          </button>
        </div>

        {open ? (
          <nav className="nav-island-links" aria-label="Primary">
            {links.map((link) => (
              <Link
                key={link.href}
                className="nav-island-link"
                href={onHome ? link.href : `/${link.href}`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="nav-island-meta">
              <a href={`mailto:${email}`}>Email</a>
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
            </div>
          </nav>
        ) : null}
      </header>
    </>
  )
}
