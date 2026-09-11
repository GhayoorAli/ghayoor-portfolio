import Link from 'next/link'
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

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Cover</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id ?? project.slug}>
                <td>
                  {project.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="admin-thumb" src={project.cover} alt="" />
                  ) : (
                    <span className="admin-meta-pill">No cover</span>
                  )}
                </td>
                <td>
                  <strong>{project.name}</strong>
                  <div style={{ color: '#5e5878', fontSize: '0.85rem', marginTop: 4 }}>{project.tag}</div>
                </td>
                <td>
                  <code>{project.slug}</code>
                </td>
                <td>
                  <span className="admin-meta-pill">
                    {project.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>
                  {project.id ? (
                    <Link className="admin-btn secondary admin-btn-sm" href={`/admin/projects/${project.id}`}>
                      Edit
                    </Link>
                  ) : (
                    <span style={{ color: '#5e5878', fontSize: '0.85rem' }}>Seed only</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
