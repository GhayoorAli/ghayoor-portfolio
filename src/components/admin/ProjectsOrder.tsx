'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'
import { saveProjectOrder } from '@/app/admin/actions'
import type { Project } from '@/types/content'

export function ProjectsOrder({ initial }: { initial: Project[] }) {
  const [projects, setProjects] = useState(initial)
  const [dragged, setDragged] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const editable = projects.length > 0 && projects.every(project => project.id)

  const move = (from: number, to: number) => {
    if (saving || !editable || from === to || from < 0 || to < 0 || to >= projects.length) return
    setProjects(previous => {
      const next = [...previous]
      next.splice(to, 0, next.splice(from, 1)[0])
      return next
    })
    setDirty(true)
    setMessage('')
  }

  const save = async () => {
    setSaving(true)
    setMessage('')
    try {
      await saveProjectOrder(projects.map(project => project.id!))
      setDirty(false)
      setMessage('Project order saved.')
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save project order.')
    } finally {
      setSaving(false)
    }
  }

  return <div className="admin-card">
    <div className="admin-section-head">
      <p className="admin-section-sub">Drag the grip or use the arrows, then save. Published projects appear in this order on the portfolio.</p>
      <button className="admin-btn admin-btn-sm" type="button" disabled={!dirty || saving || !editable} onClick={() => startTransition(save)}>{saving ? 'Saving…' : 'Save order'}</button>
    </div>
    <p role="status" aria-live="polite">{message || (dirty ? 'Order changed — save to apply.' : '')}</p>
    {!editable && <p className="admin-section-sub">{projects.length ? 'Connect and seed Supabase to reorder projects.' : 'Add a project to get started.'}</p>}
    <div className="admin-project-order-list">
      {projects.map((project, index) => <div key={project.id ?? project.slug}
        className={`admin-project-order-row${dragged === project.id ? ' is-dragging' : ''}`}
        onDragOver={event => { if (dragged) { event.preventDefault(); event.dataTransfer.dropEffect = 'move' } }}
        onDrop={event => { event.preventDefault(); move(projects.findIndex(item => item.id === dragged), index); setDragged(null) }}>
        <button type="button" className="admin-icon-btn admin-drag-grip" disabled={!editable || saving} draggable={editable && !saving}
          aria-label={`Drag ${project.name} to reorder`}
          onDragStart={event => { setDragged(project.id!); event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', project.id!) }}
          onDragEnd={() => setDragged(null)}>⠿</button>
        <span className="admin-order-number">{index + 1}</span>
        {project.cover && <img className="admin-thumb" src={project.cover} alt="" />}
        <div className="admin-project-order-name"><strong>{project.name}</strong><span>{project.tag}</span></div>
        <span className="admin-meta-pill">{project.is_published ? 'Published' : 'Draft'}</span>
        <div className="admin-project-order-controls">
          <button className="admin-icon-btn" type="button" aria-label={`Move ${project.name} up`} disabled={!editable || saving || index === 0} onClick={() => move(index, index - 1)}>↑</button>
          <button className="admin-icon-btn" type="button" aria-label={`Move ${project.name} down`} disabled={!editable || saving || index === projects.length - 1} onClick={() => move(index, index + 1)}>↓</button>
          {project.id && <Link className="admin-btn secondary admin-btn-sm" href={`/admin/projects/${project.id}`}>Edit</Link>}
        </div>
      </div>)}
    </div>
  </div>
}
