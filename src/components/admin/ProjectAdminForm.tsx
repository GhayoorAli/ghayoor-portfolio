'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { revalidatePortfolio } from '@/app/admin/actions'
import { ReadmePreview } from '@/components/admin/ReadmePreview'
import type { IconOption } from '@/lib/icon-catalog'
import { applyReadmeToProject } from '@/lib/project-readme'
import { createClient } from '@/lib/supabase/client'
import type { Project } from '@/types/content'

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
  readme: '',
  is_published: true,
})

const README_HINT = `Use these headings so the public page can style the sections:

## The problem
## My role
## Tech stack
## Features
## Architecture
## Challenges & solutions

You can delete any section you do not need. Installation, env, and licence text can stay out.`

export function ProjectAdminForm({
  initial,
  initialIcons,
}: {
  initial: Project | null
  initialIcons: IconOption[]
}) {
  const router = useRouter()
  const [project, setProject] = useState<Project>(initial ?? emptyProject())
  const [gallery, setGallery] = useState<string[]>(initial?.gallery ?? [])
  const [readme, setReadme] = useState(initial?.readme ?? '')
  const [preview, setPreview] = useState(false)
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
      const styled = applyReadmeToProject({ ...project, gallery }, readme, initialIcons)
      const supabase = createClient()

      const row = {
        slug: styled.slug.trim(),
        name: styled.name.trim(),
        hook: styled.hook,
        cover_url: styled.cover,
        tag: styled.tag,
        year: styled.year,
        problem: styled.problem,
        role: styled.role,
        features: styled.features,
        challenges: styled.challenges,
        architecture: styled.architecture || null,
        workflow: styled.workflow || null,
        results: styled.results || null,
        readme,
        live_url: styled.links.live,
        github_url: styled.links.github,
        is_published: styled.is_published ?? true,
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

      if (styled.stack.length) {
        const { error: stackError } = await supabase.from('project_stack').insert(
          styled.stack.map((item, index) => ({
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
          <p className="admin-lead">
            Basics and images here. Story sections come from the README headings on the public page.
          </p>
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

      <section className="admin-card">
        <div className="admin-section-head">
          <div>
            <h2>Basic info</h2>
            <p className="admin-section-sub">Shown in the hero on `/work/[slug]`</p>
          </div>
        </div>
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

      <section className="admin-card admin-readme-card">
        <div className="admin-section-head">
          <div>
            <h2>README</h2>
            <p className="admin-section-sub">
              Paste GitHub README markdown. The public page styles matching headings the same as
              before — nothing is auto-filled into extra form fields.
            </p>
          </div>
          <div className="admin-readme-tabs" role="tablist" aria-label="README editor">
            <button
              type="button"
              className={`admin-tab ${!preview ? 'is-active' : ''}`}
              onClick={() => setPreview(false)}
            >
              Write
            </button>
            <button
              type="button"
              className={`admin-tab ${preview ? 'is-active' : ''}`}
              onClick={() => setPreview(true)}
            >
              Preview
            </button>
          </div>
        </div>

        {preview ? (
          <ReadmePreview value={readme} />
        ) : (
          <div className="admin-field">
            <label htmlFor="project-readme">Markdown</label>
            <textarea
              id="project-readme"
              className="admin-code admin-readme-editor"
              rows={22}
              value={readme}
              placeholder={README_HINT}
              onChange={(event) => setReadme(event.target.value)}
            />
          </div>
        )}
      </section>

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
