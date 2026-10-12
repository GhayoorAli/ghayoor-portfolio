import type { CSSProperties } from 'react'

export function ReferenceIcon({ name, style }: { name: string; style?: CSSProperties }) {
  const shapes: Record<string, React.ReactNode> = {
    github: <path d="M12 .7a11.3 11.3 0 0 0-3.6 22c.6.1.8-.2.8-.5v-2.1c-3.3.7-4-1.4-4-1.4-.5-1.3-1.3-1.6-1.3-1.6-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5A11.3 11.3 0 0 0 12 .7" />,
    linkedin: <><rect x="1" y="8" width="4.5" height="15" /><circle cx="3.25" cy="3.3" r="2.6" /><path d="M9 8h4.3v2.1c.7-1.3 2-2.5 4.3-2.5 4.5 0 5.4 2.8 5.4 6.4v9h-4.5v-8c0-1.9 0-3.7-2.5-3.7s-2.6 1.9-2.6 3.6V23H9z" /></>,
    copy: <><rect x="8" y="2" width="14" height="14" rx="2" opacity=".5" /><rect x="2" y="8" width="14" height="14" rx="2" /></>,
    check: <path d="m3 12 6 6L21 5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />,
    top: <path d="M3 9 12 2l9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm6 7h6v-5H9z" fillRule="evenodd" />,
    about: <path d="M12 1a11 11 0 1 0 10 15H12V1zm2 0v12h10A12 12 0 0 0 14 1" />,
    work: <><rect x="3" y="3" width="18" height="4" rx="1" /><rect x="2" y="9" width="20" height="13" rx="2" /></>,
    benefits: <><path d="m12 1 11 6-11 6L1 7zm0 14L2 9v4l10 6 10-6V9zm0 6L2 15v4l10 5 10-5v-4z" /></>,
    skills: <path d="M9 1H19l-6 8h6L7 23l3-11H4z" />,
    credentials: <><circle cx="12" cy="6" r="5" /><path d="M3 23v-4a9 9 0 0 1 18 0v4z" /></>,
    faq: <><circle cx="12" cy="12" r="11" /><path d="M9 8a3 3 0 1 1 5 2c-2 1-2 2-2 4m0 3v1" fill="none" stroke="var(--ref-bg)" strokeWidth="2" /></>,
    creative: <path d="M21 5a11 11 0 1 0 0 14l-9-7z" />,
    reliable: <><circle cx="6.5" cy="6.5" r="5.5" /><circle cx="17.5" cy="6.5" r="5.5" /><circle cx="6.5" cy="17.5" r="5.5" /><circle cx="17.5" cy="17.5" r="5.5" /></>,
    strategist: <path d="M3 7a2 2 0 0 1 4 0v7h2V3a2 2 0 0 1 4 0v11h2V6a2 2 0 0 1 4 0v8h2v-3a2 2 0 0 1 3 0v7c0 4-4 6-9 6H8c-4 0-5-3-5-6z" />,
    builder: <path d="m8 1 9 7-5 4 9 7-8 5-9-7 4-4L0 6z" />,
    efficient: <path d="M12 5C2-8-7 6 5 12-8 22 6 31 12 19c10 13 19-1 7-7C32 2 18-7 12 5" />,
  }
  return <svg className="ref-symbol" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={style}>{shapes[name] || shapes.skills}</svg>
}
