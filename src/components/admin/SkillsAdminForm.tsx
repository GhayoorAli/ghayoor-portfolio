'use client'

import { useState } from 'react'
import { revalidatePortfolio } from '@/app/admin/actions'
import { IconSelect } from '@/components/admin/IconSelect'
import { ICON_BY_ID } from '@/lib/icon-catalog'
import { createClient } from '@/lib/supabase/client'
import type { SkillGroup } from '@/types/content'

export function SkillsAdminForm({ initialGroups }: { initialGroups: SkillGroup[] }) {
  const [groups, setGroups] = useState(initialGroups)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    setMessage('')
    setError('')
    try {
      const supabase = createClient()
      await supabase.from('skills').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('skill_groups').delete().neq('id', '00000000-0000-0000-0000-000000000000')

      for (const [gi, group] of groups.entries()) {
        const { data, error: groupError } = await supabase
          .from('skill_groups')
          .insert({ category: group.category, sort_order: gi })
          .select('id')
          .single()
        if (groupError) throw groupError
        if (group.items.length) {
          const { error: skillError } = await supabase.from('skills').insert(
            group.items.map((item, ii) => ({
              group_id: data.id,
              name: item.name,
              icon_id: item.icon_id,
              sort_order: ii,
            })),
          )
          if (skillError) throw skillError
        }
      }

      await revalidatePortfolio()
      setMessage('Skills saved.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const moveGroup = (from: number, to: number) => {
    if (to < 0 || to >= groups.length) return
    setGroups((prev) => {
      const next = [...prev]
      const [row] = next.splice(from, 1)
      next.splice(to, 0, row)
      return next
    })
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1>Skills</h1>
          <p className="admin-lead">Organize technology groups. Pick icons from the library — no manual IDs.</p>
        </div>
        <div className="admin-page-actions">
          <button
            className="admin-btn secondary"
            type="button"
            onClick={() =>
              setGroups((prev) => [
                ...prev,
                { category: 'New group', sort_order: prev.length, items: [] },
              ])
            }
          >
            Add group
          </button>
          <button className="admin-btn" type="button" disabled={saving} onClick={() => void save()}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </header>

      {message ? <p className="admin-msg">{message}</p> : null}
      {error ? <p className="admin-msg error">{error}</p> : null}

      <div className="admin-stack">
        {groups.map((group, gi) => (
          <section className="admin-card admin-skill-group" key={gi}>
            <div className="admin-card-toolbar">
              <div className="admin-field admin-field-grow">
                <label>Category</label>
                <input
                  value={group.category}
                  onChange={(e) =>
                    setGroups((prev) =>
                      prev.map((g, i) => (i === gi ? { ...g, category: e.target.value } : g)),
                    )
                  }
                />
              </div>
              <div className="admin-toolbar-aside">
                <span className="admin-meta-pill">{group.items.length} skills</span>
                <button
                  type="button"
                  className="admin-icon-btn"
                  aria-label="Move up"
                  disabled={gi === 0}
                  onClick={() => moveGroup(gi, gi - 1)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="admin-icon-btn"
                  aria-label="Move down"
                  disabled={gi === groups.length - 1}
                  onClick={() => moveGroup(gi, gi + 1)}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="admin-icon-btn danger"
                  aria-label="Remove group"
                  onClick={() => setGroups((prev) => prev.filter((_, i) => i !== gi))}
                >
                  ×
                </button>
              </div>
            </div>

            <div className="admin-skill-table">
              <div className="admin-skill-head">
                <span>Icon</span>
                <span>Display name</span>
                <span />
              </div>
              {group.items.map((item, ii) => (
                <div className="admin-skill-row" key={item.id}>
                  <IconSelect
                    value={item.icon_id}
                    onChange={(iconId, label) =>
                      setGroups((prev) =>
                        prev.map((g, i) =>
                          i === gi
                            ? {
                                ...g,
                                items: g.items.map((it, j) =>
                                  j === ii
                                    ? {
                                        ...it,
                                        icon_id: iconId,
                                        name: it.name.trim() ? it.name : label,
                                      }
                                    : it,
                                ),
                              }
                            : g,
                        ),
                      )
                    }
                  />
                  <input
                    value={item.name}
                    placeholder="Skill name"
                    onChange={(e) =>
                      setGroups((prev) =>
                        prev.map((g, i) =>
                          i === gi
                            ? {
                                ...g,
                                items: g.items.map((it, j) =>
                                  j === ii ? { ...it, name: e.target.value } : it,
                                ),
                              }
                            : g,
                        ),
                      )
                    }
                  />
                  <button
                    type="button"
                    className="admin-icon-btn danger"
                    aria-label="Remove skill"
                    onClick={() =>
                      setGroups((prev) =>
                        prev.map((g, i) =>
                          i === gi ? { ...g, items: g.items.filter((_, j) => j !== ii) } : g,
                        ),
                      )
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="admin-card-footer">
              <button
                className="admin-btn secondary admin-btn-sm"
                type="button"
                onClick={() => {
                  const fallback = ICON_BY_ID.javascript
                  setGroups((prev) =>
                    prev.map((g, i) =>
                      i === gi
                        ? {
                            ...g,
                            items: [
                              ...g.items,
                              {
                                id: `tmp-${Date.now()}`,
                                name: fallback.label,
                                icon_id: fallback.id,
                              },
                            ],
                          }
                        : g,
                    ),
                  )
                }}
              >
                + Add skill
              </button>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
