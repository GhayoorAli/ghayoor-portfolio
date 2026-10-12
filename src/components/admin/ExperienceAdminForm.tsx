'use client'

import { useState } from 'react'
import { revalidatePortfolio } from '@/app/admin/actions'
import { LineListEditor } from '@/components/admin/LineListEditor'
import { TagInput } from '@/components/admin/TagInput'
import { createClient } from '@/lib/supabase/client'
import { encodeExperienceDetails, normalizeExperience } from '@/lib/experience-content'
import type { ExperienceItem } from '@/types/content'

export function ExperienceAdminForm({ initial, profiles = [] }: { initial: ExperienceItem[]; profiles?: ExperienceItem[] }) {
  const [items, setItems] = useState(initial)
  const [savedIds, setSavedIds] = useState(initial.flatMap(item => item.id ? [item.id] : []))
  const [openIndex, setOpenIndex] = useState(0)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    setMessage('')
    setError('')
    try {
      const supabase = createClient()
      if (items.some(item => !item.role.trim() || !item.company.trim())) throw new Error('Add a role title and company before saving.')
      const rows = items.map(item => ({ ...normalizeExperience(item, profiles), id: item.id || crypto.randomUUID() }))
      if (rows.length) {
        const { error: saveError } = await supabase.from('experience').upsert(rows.map((item, index) => ({
          id: item.id, role: item.role.trim(), company: item.company.trim(), period: item.period,
          location: item.location, stack: item.stack, summary: item.summary,
          points: encodeExperienceDetails(item), sort_order: index,
        })))
        if (saveError) throw saveError
      }
      setItems(rows)
      setSavedIds([...new Set([...savedIds, ...rows.map(item => item.id)])])
      const removed = savedIds.filter(id => !rows.some(row => row.id === id))
      if (removed.length) {
        const { error: deleteError } = await supabase.from('experience').delete().in('id', removed)
        if (deleteError) throw deleteError
      }
      setSavedIds(rows.map(item => item.id))
      await revalidatePortfolio()
      setMessage('Experience saved.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return
    setItems((prev) => {
      const next = [...prev]
      const [row] = next.splice(from, 1)
      next.splice(to, 0, row)
      return next
    })
    setOpenIndex(to)
  }

  const patch = (index: number, partial: Partial<ExperienceItem>) => {
    setItems((prev) => prev.map((row, i) => (i === index ? { ...row, ...partial } : row)))
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1>Experience</h1>
          <p className="admin-lead">Short timeline introductions and detailed responsibilities for Read more.</p>
        </div>
        <div className="admin-page-actions">
          <button
            className="admin-btn secondary"
            type="button"
            onClick={() => {
              setItems((prev) => [
                ...prev,
                {
                  role: '',
                  company: '',
                  period: '',
                  location: '',
                  stack: [],
                  summary: '',
                  points: [],
                },
              ])
              setOpenIndex(items.length)
            }}
          >
            Add role
          </button>
          <button className="admin-btn" type="button" disabled={saving} onClick={() => void save()}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </header>

      {message ? <p className="admin-msg">{message}</p> : null}
      {error ? <p className="admin-msg error">{error}</p> : null}

      <div className="admin-stack">
        {items.map((item, index) => {
          const open = openIndex === index
          return (
            <section className={`admin-card admin-accordion ${open ? 'is-open' : ''}`} key={index}>
              <div className="admin-accordion-trigger">
                <button
                  type="button"
                  className="admin-accordion-title"
                  onClick={() => setOpenIndex(open ? -1 : index)}
                >
                  <strong>{item.role || 'Untitled role'}</strong>
                  <p>
                    {[item.company, item.period].filter(Boolean).join(' · ') || 'No company / period yet'}
                  </p>
                </button>
                <div className="admin-toolbar-aside">
                  <button type="button" className="admin-icon-btn" disabled={index === 0} onClick={() => move(index, index - 1)}>
                    ↑
                  </button>
                  <button
                    type="button"
                    className="admin-icon-btn"
                    disabled={index === items.length - 1}
                    onClick={() => move(index, index + 1)}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="admin-icon-btn danger"
                    aria-label="Remove role"
                    onClick={() => {
                      setItems((prev) => prev.filter((_, i) => i !== index))
                      setOpenIndex(0)
                    }}
                  >
                    ×
                  </button>
                  <button
                    type="button"
                    className="admin-icon-btn"
                    aria-label={open ? 'Collapse' : 'Expand'}
                    onClick={() => setOpenIndex(open ? -1 : index)}
                  >
                    {open ? '▾' : '▸'}
                  </button>
                </div>
              </div>

              {open ? (
                <div className="admin-accordion-body">
                  <div className="admin-grid two">
                    <div className="admin-field">
                      <label>Role</label>
                      <input placeholder="Full Stack Developer" value={item.role} onChange={(e) => patch(index, { role: e.target.value })} />
                    </div>
                    <div className="admin-field">
                      <label>Company</label>
                      <input
                        value={item.company}
                        onChange={(e) => patch(index, { company: e.target.value })}
                      />
                    </div>
                    <div className="admin-field">
                      <label>Period</label>
                      <input
                        value={item.period}
                        placeholder="e.g. Oct 2025 — Jan 2026"
                        onChange={(e) => patch(index, { period: e.target.value })}
                      />
                    </div>
                    <div className="admin-field"><label>Employment type</label><input placeholder="Full-time, Work Study, Independent work" value={item.employment_type || ''} onChange={e => patch(index, { employment_type: e.target.value })} /></div>
                    <div className="admin-field"><label>Duration</label><input placeholder="4 yrs, 4 mos" value={item.duration || ''} onChange={e => patch(index, { duration: e.target.value })} /></div>
                    <div className="admin-field">
                      <label>Location</label>
                      <input
                        value={item.location}
                        placeholder="City, Country (Remote)"
                        onChange={(e) => patch(index, { location: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="admin-field" style={{ marginTop: 14 }}>
                    <label>Tech stack</label>
                    <TagInput values={item.stack} onChange={(stack) => patch(index, { stack })} />
                  </div>

                  <div className="admin-field" style={{ marginTop: 14 }}>
                    <label>Timeline summary</label><p className="admin-lead">A short introduction for the card. Put detailed responsibilities below.</p>
                    <textarea
                      rows={3}
                      placeholder="Delivered production web applications and websites for clients…"
                      value={item.summary}
                      onChange={(e) => patch(index, { summary: e.target.value })}
                    />
                    {item.summary.length > 280 && <p className="admin-lead">Long summaries will move into Read more when you save, so the timeline card stays compact.</p>}
                  </div>

                  <div className="admin-field" style={{ marginTop: 14 }}>
                    <label>Read more responsibilities</label>
                    {!item.sections?.length && <LineListEditor
                      values={item.points}
                      onChange={(points) => patch(index, { points })}
                      placeholder="Add a highlight bullet"
                      addLabel="Add"
                    />}
                    {(item.sections || []).map((section, sectionIndex) => <section className="admin-card" key={sectionIndex} style={{ marginTop: 12 }}><div className="admin-field"><label>Group heading</label><input placeholder="Laravel & PHP" value={section.title} onChange={e => { const sections = item.sections!.map((group, i) => i === sectionIndex ? { ...group, title: e.target.value } : group); patch(index, { sections, points: sections.flatMap(group => group.points) }) }} /></div><LineListEditor values={section.points} placeholder="Add a responsibility" onChange={points => { const sections = item.sections!.map((group, i) => i === sectionIndex ? { ...group, points } : group); patch(index, { sections, points: sections.flatMap(group => group.points) }) }} /><button className="admin-btn secondary" type="button" onClick={() => { const sections = item.sections!.filter((_, i) => i !== sectionIndex); patch(index, { sections, points: sections.flatMap(group => group.points) }) }}>Remove group</button></section>)}
                    <button className="admin-btn secondary" type="button" style={{ marginTop: 12 }} onClick={() => { const sections = item.sections?.length ? [...item.sections, { title: '', points: [] }] : [{ title: 'Responsibilities', points: [...item.points] }]; patch(index, { sections }) }}>Add responsibility group</button>
                  </div>
                </div>
              ) : null}
            </section>
          )
        })}
      </div>
    </div>
  )
}
