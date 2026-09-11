import Link from 'next/link'
import { supabaseReady } from '@/lib/content'

export default function AdminDashboardPage() {
  const ready = supabaseReady()

  return (
    <div>
      <h1>Dashboard</h1>
      <p className="admin-lead">Manage site content, projects, skills, and profile media.</p>
      {!ready ? (
        <p className="admin-msg error">
          Supabase env vars are missing. The public site uses local seed data until you configure Supabase.
        </p>
      ) : (
        <p className="admin-msg">Connected to Supabase. Changes here update the live portfolio after save.</p>
      )}
      <div className="admin-card">
        <h2>Quick links</h2>
        <div className="admin-actions">
          <Link className="admin-btn" href="/admin/projects">
            Projects
          </Link>
          <Link className="admin-btn secondary" href="/admin/site">
            Site & About
          </Link>
          <Link className="admin-btn secondary" href="/admin/skills">
            Skills
          </Link>
        </div>
      </div>
    </div>
  )
}
