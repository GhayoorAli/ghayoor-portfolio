'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isSupabaseConfigured()) {
    return (
      <div className="admin-login">
        <div className="admin-login-card">
          <h1>Setup required</h1>
          <p className="admin-lead">
            Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{' '}
            <code>.env.local</code>, then run the SQL migration and create an admin user. See{' '}
            <code>ADMIN.md</code>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-login">
      <form
        className="admin-login-card"
        onSubmit={async (event) => {
          event.preventDefault()
          setLoading(true)
          setError('')
          const supabase = createClient()
          const { error: signError } = await supabase.auth.signInWithPassword({ email, password })
          setLoading(false)
          if (signError) {
            setError(signError.message)
            return
          }
          router.push('/admin')
          router.refresh()
        }}
      >
        <h1>Admin login</h1>
        <p className="admin-lead">Sign in to manage portfolio content.</p>
        {error ? <p className="admin-msg error">{error}</p> : null}
        <div className="admin-grid">
          <div className="admin-field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="admin-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="admin-actions">
          <button className="admin-btn" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  )
}
