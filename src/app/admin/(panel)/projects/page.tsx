import Link from 'next/link'
import { ProjectsOrder } from '@/components/admin/ProjectsOrder'
import { getAllProjectsAdmin } from '@/lib/content'

export default async function AdminProjectsPage() {
  const projects = await getAllProjectsAdmin()

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1>Projects</h1>
          <p className="admin-lead">Case studies shown on the work grid and `/work/[slug]` pages.</p>
        </div>
        <div className="admin-page-actions">
          <Link className="admin-btn" href="/admin/projects/new">
            New project
          </Link>
        </div>
      </header>

      <ProjectsOrder initial={projects} />
    </div>
  )
}
