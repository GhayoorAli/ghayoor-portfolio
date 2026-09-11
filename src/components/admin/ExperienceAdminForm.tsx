'use client'

import { useState } from 'react'
import { revalidatePortfolio } from '@/app/admin/actions'
import { LineListEditor } from '@/components/admin/LineListEditor'
import { TagInput } from '@/components/admin/TagInput'
import { createClient } from '@/lib/supabase/client'
import type { ExperienceItem } from '@/types/content'

export function ExperienceAdminForm({ initial }: { initial: ExperienceItem[] }) {
  const [items, setItems] = useState(initial)
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
      await supabase.from('experience').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      if (items.length) {
        const { error: insertError } = await supabase.from('experience').insert(
          items.map((item, index) => ({
            role: item.role,
            company: item.company,
            period: item.period,
            location: item.location,
            stack: item.stack,
            summary: item.summary,
            points: item.points,
            sort_order: index,
          })),
        )
        if (insertError) throw insertError
      }
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
          <p className="admin-lead">Timeline roles, tech tags, and highlight bullets.</p>
        </div>
        <div className="admin-page-actions">
          <button
            className="admin-btn secondary"
            type="button"
            onClick={() => {
              setItems((prev) => [
                ...prev,
                {
                  role: 'New role',
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
                      <input value={item.role} onChange={(e) => patch(index, { role: e.target.value })} />
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
                    <label>Summary</label>
                    <textarea
                      rows={3}
                      value={item.summary}
                      onChange={(e) => patch(index, { summary: e.target.value })}
                    />
                  </div>

                  <div className="admin-field" style={{ marginTop: 14 }}>
                    <label>Highlights</label>
                    <LineListEditor
                      values={item.points}
                      onChange={(points) => patch(index, { points })}
                      placeholder="Add a highlight bullet"
                      addLabel="Add"
                    />
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
