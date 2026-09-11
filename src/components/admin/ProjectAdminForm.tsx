'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { revalidatePortfolio } from '@/app/admin/actions'
import { IconSelect } from '@/components/admin/IconSelect'
import { LineListEditor } from '@/components/admin/LineListEditor'
import { createClient } from '@/lib/supabase/client'
import type { Project, ProjectChallenge } from '@/types/content'

const emptyProject = (): Project => ({
  slug: '',
  name: '',
  hook: '',
  cover: '',
  tag: '',
  year: '',
  problem: '',
  role: '',
  stack: [],
  features: [],
  challenges: [],
  architecture: '',
  workflow: '',
  links: { live: null, github: null },
  gallery: [],
  results: '',
  is_published: true,
})

const SECTIONS = [
  { id: 'basics', label: 'Basics' },
  { id: 'story', label: 'Story' },
  { id: 'stack', label: 'Stack' },
  { id: 'challenges', label: 'Challenges' },
  { id: 'media', label: 'Media' },
] as const

type SectionId = (typeof SECTIONS)[number]['id']

export function ProjectAdminForm({ initial }: { initial: Project | null }) {
  const router = useRouter()
  const [project, setProject] = useState<Project>(initial ?? emptyProject())
  const [features, setFeatures] = useState<string[]>(initial?.features ?? [])
  const [gallery, setGallery] = useState<string[]>(initial?.gallery ?? [])
  const [challenges, setChallenges] = useState<ProjectChallenge[]>(initial?.challenges ?? [])
  const [section, setSection] = useState<SectionId>('basics')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const title = useMemo(
    () => (project.id ? `Edit · ${project.name || project.slug}` : 'New project'),
    [project.id, project.name, project.slug],
  )

  const upload = async (file: File, asCover = false) => {
    setUploading(true)
    try {
      const supabase = createClient()
      const path = `${project.slug || 'draft'}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`
      const { error: uploadError } = await supabase.storage.from('projects').upload(path, file, {
        upsert: true,
      })
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('projects').getPublicUrl(path)
      if (asCover) setProject((prev) => ({ ...prev, cover: data.publicUrl }))
      else setGallery((prev) => [...prev, data.publicUrl])
    } finally {
      setUploading(false)
    }
  }

  const save = async () => {
    setSaving(true)
    setMessage('')
    setError('')
    try {
      if (!project.slug.trim() || !project.name.trim()) throw new Error('Slug and name are required')
      const supabase = createClient()

      const row = {
        slug: project.slug.trim(),
        name: project.name.trim(),
        hook: project.hook,
        cover_url: project.cover,
        tag: project.tag,
        year: project.year,
        problem: project.problem,
        role: project.role,
        features,
        challenges,
        architecture: project.architecture || null,
        workflow: project.workflow || null,
        results: project.results || null,
        live_url: project.links.live,
        github_url: project.links.github,
        is_published: project.is_published ?? true,
        updated_at: new Date().toISOString(),
      }

      let projectId = project.id
      if (projectId) {
        const { error: updateError } = await supabase.from('projects').update(row).eq('id', projectId)
        if (updateError) throw updateError
      } else {
        const { data, error: insertError } = await supabase.from('projects').insert(row).select('id').single()
        if (insertError) throw insertError
        projectId = data.id
      }

      await supabase.from('project_stack').delete().eq('project_id', projectId)
      await supabase.from('project_images').delete().eq('project_id', projectId)

      if (project.stack.length) {
        const { error: stackError } = await supabase.from('project_stack').insert(
          project.stack.map((item, index) => ({
            project_id: projectId,
            icon_id: item.id,
            name: item.name,
            sort_order: index,
          })),
        )
        if (stackError) throw stackError
      }

      if (gallery.length) {
        const { error: imageError } = await supabase.from('project_images').insert(
          gallery.map((url, index) => ({ project_id: projectId, url, sort_order: index })),
        )
        if (imageError) throw imageError
      }

      await revalidatePortfolio()
      setMessage('Project saved.')
      router.push('/admin/projects')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!project.id || !confirm('Delete this project?')) return
    const supabase = createClient()
    await supabase.from('projects').delete().eq('id', project.id)
    await revalidatePortfolio()
    router.push('/admin/projects')
    router.refresh()
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <Link className="admin-back" href="/admin/projects">
            ← Projects
          </Link>
          <h1>{title}</h1>
          <p className="admin-lead">Everything that powers the public `/work/[slug]` page.</p>
        </div>
        <div className="admin-page-actions">
          <label className="admin-switch">
            <input
              type="checkbox"
              checked={project.is_published ?? true}
              onChange={(e) => setProject((p) => ({ ...p, is_published: e.target.checked }))}
            />
            <span>{project.is_published ? 'Published' : 'Draft'}</span>
          </label>
          <Link className="admin-btn secondary" href="/admin/projects">
            Cancel
          </Link>
          <button className="admin-btn" type="button" disabled={saving} onClick={() => void save()}>
            {saving ? 'Saving…' : 'Save project'}
          </button>
        </div>
      </header>

      {message ? <p className="admin-msg">{message}</p> : null}
      {error ? <p className="admin-msg error">{error}</p> : null}

      <nav className="admin-tabs" aria-label="Project sections">
        {SECTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`admin-tab ${section === item.id ? 'is-active' : ''}`}
            onClick={() => setSection(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {section === 'basics' ? (
        <section className="admin-card">
          <div className="admin-grid two">
            <div className="admin-field">
              <label>Slug</label>
              <input
                value={project.slug}
                placeholder="meet-me"
                onChange={(e) => setProject((p) => ({ ...p, slug: e.target.value }))}
              />
            </div>
            <div className="admin-field">
              <label>Name</label>
              <input
                value={project.name}
                onChange={(e) => setProject((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="admin-field">
              <label>Category tag</label>
              <input
                value={project.tag}
                placeholder="Video platform"
                onChange={(e) => setProject((p) => ({ ...p, tag: e.target.value }))}
              />
            </div>
            <div className="admin-field">
              <label>Year</label>
              <input
                value={project.year}
                placeholder="2025"
                onChange={(e) => setProject((p) => ({ ...p, year: e.target.value }))}
              />
            </div>
            <div className="admin-field">
              <label>Live URL</label>
              <input
                value={project.links.live ?? ''}
                placeholder="https://"
                onChange={(e) =>
                  setProject((p) => ({ ...p, links: { ...p.links, live: e.target.value || null } }))
                }
              />
            </div>
            <div className="admin-field">
              <label>GitHub URL</label>
              <input
                value={project.links.github ?? ''}
                placeholder="https://github.com/…"
                onChange={(e) =>
                  setProject((p) => ({ ...p, links: { ...p.links, github: e.target.value || null } }))
                }
              />
            </div>
          </div>
          <div className="admin-field" style={{ marginTop: 14 }}>
            <label>Hook</label>
            <textarea
              rows={3}
              value={project.hook}
              onChange={(e) => setProject((p) => ({ ...p, hook: e.target.value }))}
            />
          </div>
        </section>
      ) : null}

      {section === 'story' ? (
        <section className="admin-card">
          <div className="admin-field">
            <label>Problem</label>
            <textarea
              rows={4}
              value={project.problem}
              onChange={(e) => setProject((p) => ({ ...p, problem: e.target.value }))}
            />
          </div>
          <div className="admin-field" style={{ marginTop: 14 }}>
            <label>Role</label>
            <textarea
              rows={3}
              value={project.role}
              onChange={(e) => setProject((p) => ({ ...p, role: e.target.value }))}
            />
          </div>
          <div className="admin-field" style={{ marginTop: 14 }}>
            <label>Features</label>
            <LineListEditor
              values={features}
              onChange={setFeatures}
              placeholder="Add a feature"
              addLabel="Add feature"
            />
          </div>
          <div className="admin-field" style={{ marginTop: 14 }}>
            <label>Results</label>
            <textarea
              rows={4}
              value={project.results ?? ''}
              onChange={(e) => setProject((p) => ({ ...p, results: e.target.value }))}
            />
          </div>
          <div className="admin-grid two" style={{ marginTop: 14 }}>
            <div className="admin-field">
              <label>Architecture (Mermaid)</label>
              <textarea
                className="admin-code"
                rows={10}
                value={project.architecture ?? ''}
                onChange={(e) => setProject((p) => ({ ...p, architecture: e.target.value }))}
              />
            </div>
            <div className="admin-field">
              <label>Workflow (Mermaid)</label>
              <textarea
                className="admin-code"
                rows={10}
                value={project.workflow ?? ''}
                onChange={(e) => setProject((p) => ({ ...p, workflow: e.target.value }))}
              />
            </div>
          </div>
        </section>
      ) : null}

      {section === 'stack' ? (
        <section className="admin-card">
          <div className="admin-section-head">
            <div>
              <h2>Tech stack</h2>
              <p className="admin-section-sub">Shown as icons on the project card and detail page</p>
            </div>
            <button
              className="admin-btn secondary admin-btn-sm"
              type="button"
              onClick={() =>
                setProject((p) => ({ ...p, stack: [...p.stack, { id: 'react', name: 'React' }] }))
              }
            >
              + Add technology
            </button>
          </div>

          <div className="admin-skill-table">
            <div className="admin-skill-head">
              <span>Icon</span>
              <span>Label</span>
              <span />
            </div>
            {project.stack.map((item, index) => (
              <div className="admin-skill-row" key={`${item.id}-${index}`}>
                <IconSelect
                  value={item.id}
                  onChange={(iconId, label) =>
                    setProject((p) => ({
                      ...p,
                      stack: p.stack.map((s, i) =>
                        i === index
                          ? { id: iconId, name: s.name.trim() ? s.name : label }
                          : s,
                      ),
                    }))
                  }
                />
                <input
                  value={item.name}
                  onChange={(e) =>
                    setProject((p) => ({
                      ...p,
                      stack: p.stack.map((s, i) => (i === index ? { ...s, name: e.target.value } : s)),
                    }))
                  }
                />
                <button
                  type="button"
                  className="admin-icon-btn danger"
                  aria-label="Remove"
                  onClick={() =>
                    setProject((p) => ({ ...p, stack: p.stack.filter((_, i) => i !== index) }))
                  }
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {section === 'challenges' ? (
        <section className="admin-card">
          <div className="admin-section-head">
            <div>
              <h2>Challenges</h2>
              <p className="admin-section-sub">Problem → solution pairs</p>
            </div>
            <button
              className="admin-btn secondary admin-btn-sm"
              type="button"
              onClick={() => setChallenges((prev) => [...prev, { title: '', problem: '', solution: '' }])}
            >
              + Add challenge
            </button>
          </div>

          <div className="admin-stack">
            {challenges.map((item, index) => (
              <div className="admin-subcard" key={index}>
                <div className="admin-card-toolbar">
                  <strong>{item.title || `Challenge ${index + 1}`}</strong>
                  <button
                    type="button"
                    className="admin-icon-btn danger"
                    onClick={() => setChallenges((prev) => prev.filter((_, i) => i !== index))}
                  >
                    ×
                  </button>
                </div>
                <div className="admin-field">
                  <label>Title</label>
                  <input
                    value={item.title}
                    onChange={(e) =>
                      setChallenges((prev) =>
                        prev.map((c, i) => (i === index ? { ...c, title: e.target.value } : c)),
                      )
                    }
                  />
                </div>
                <div className="admin-grid two" style={{ marginTop: 12 }}>
                  <div className="admin-field">
                    <label>Challenge</label>
                    <textarea
                      rows={4}
                      value={item.problem}
                      onChange={(e) =>
                        setChallenges((prev) =>
                          prev.map((c, i) => (i === index ? { ...c, problem: e.target.value } : c)),
                        )
                      }
                    />
                  </div>
                  <div className="admin-field">
                    <label>Solution</label>
                    <textarea
                      rows={4}
                      value={item.solution}
                      onChange={(e) =>
                        setChallenges((prev) =>
                          prev.map((c, i) => (i === index ? { ...c, solution: e.target.value } : c)),
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {section === 'media' ? (
        <section className="admin-card">
          <div className="admin-section-head">
            <div>
              <h2>Cover</h2>
              <p className="admin-section-sub">Main project thumbnail</p>
            </div>
            <label className="admin-file-btn">
              {uploading ? 'Uploading…' : 'Upload cover'}
              <input
                type="file"
                accept="image/*"
                hidden
                disabled={uploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  try {
                    await upload(file, true)
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Upload failed')
                  }
                }}
              />
            </label>
          </div>

          <div className="admin-cover-row">
            {project.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.cover} alt="" className="admin-cover-preview" />
            ) : (
              <div className="admin-cert-placeholder">No cover yet</div>
            )}
            <div className="admin-field admin-field-grow">
              <label>Cover URL</label>
              <input
                value={project.cover}
                onChange={(e) => setProject((p) => ({ ...p, cover: e.target.value }))}
              />
            </div>
          </div>

          <div className="admin-section-head" style={{ marginTop: 28 }}>
            <div>
              <h2>Gallery</h2>
              <p className="admin-section-sub">Screenshot carousel images</p>
            </div>
            <label className="admin-file-btn">
              {uploading ? 'Uploading…' : 'Upload image'}
              <input
                type="file"
                accept="image/*"
                hidden
                disabled={uploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  try {
                    await upload(file, false)
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Upload failed')
                  }
                }}
              />
            </label>
          </div>

          <div className="admin-gallery-grid">
            {gallery.map((url, index) => (
              <div className="admin-gallery-item" key={`${url}-${index}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" />
                <button
                  type="button"
                  className="admin-icon-btn danger"
                  aria-label="Remove image"
                  onClick={() => setGallery((prev) => prev.filter((_, i) => i !== index))}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {project.id ? (
        <div className="admin-danger-zone">
          <div>
            <strong>Delete project</strong>
            <p>Removes this project and its stack/images from the CMS.</p>
          </div>
          <button className="admin-btn danger" type="button" onClick={() => void remove()}>
            Delete
          </button>
        </div>
      ) : null}
    </div>
  )
}
