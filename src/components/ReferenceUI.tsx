'use client'

import { useEffect, useRef, useState } from 'react'
import { ReferenceIcon } from './ReferenceIcon'

export function StatValue({ value }: { value: string }) {
  const plus = value.endsWith('+')
  return <span className="ref-stat-value">{plus ? value.slice(0, -1) : value}{plus && <span>+</span>}</span>
}

export function RollingLabel({ children }: { children: string }) {
  return <span className="ref-roll"><span>{children}</span><span aria-hidden="true">{children}</span></span>
}

export function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
  return <button className="ref-panel ref-email" aria-label={`Copy ${email} to clipboard`} onClick={async () => {
    try { await navigator.clipboard.writeText(email); setStatus('Copied to clipboard') }
    catch { setStatus('Unable to copy') }
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setStatus(''), 2000)
  }}><span className="ref-email-address">{email}</span><ReferenceIcon name={status === 'Copied to clipboard' ? 'check' : 'copy'} /><span className={`ref-copy-tooltip${status ? ' is-feedback' : ''}`} role="status">{status || 'Copy to clipboard'}</span></button>
}
