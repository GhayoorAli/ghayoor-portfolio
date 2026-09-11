'use client'

import { useState } from 'react'
import { revalidatePortfolio } from '@/app/admin/actions'
import { createClient } from '@/lib/supabase/client'
import type { SiteSettings, SocialLink } from '@/types/content'

export function SiteAdminForm({
  initialSite,
  initialSocials,
  settingsId,
}: {
  initialSite: SiteSettings
  initialSocials: SocialLink[]
  settingsId: string | null
}) {
  const [site, setSite] = useState(initialSite)
  const [socials, setSocials] = useState(initialSocials)
  const [statsText, setStatsText] = useState(
    initialSite.stats.map((s) => `${s.value}|${s.label}`).join('\n'),
  )
  const [bodyText, setBodyText] = useState(initialSite.about_body.join('\n\n'))
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const uploadPortrait = async (file: File) => {
    const supabase = createClient()
    const path = `portrait-${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage.from('portraits').upload(path, file, {
      upsert: true,
    })
    if (uploadError) throw uploadError
    const { data } = supabase.storage.from('portraits').getPublicUrl(path)
    setSite((prev) => ({ ...prev, portrait_url: data.publicUrl }))
  }

  const save = async () => {
    setSaving(true)
    setMessage('')
    setError('')
    try {
      const supabase = createClient()
      const stats = statsText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [value, ...rest] = line.split('|')
          return { value: value.trim(), label: rest.join('|').trim() || value.trim() }
        })
      const about_body = bodyText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)

      const payload = {
        name: site.name,
        greeting: site.greeting,
        title: site.title,
        email: site.email,
        location: site.location,
        stats,
        about_kicker: site.about_kicker,
        about_heading: site.about_heading,
        about_body,
        portrait_url: site.portrait_url,
        updated_at: new Date().toISOString(),
      }

      if (settingsId) {
        const { error: updateError } = await supabase.from('site_settings').update(payload).eq('id', settingsId)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase.from('site_settings').insert(payload)
        if (insertError) throw insertError
      }

      await supabase.from('social_links').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      if (socials.length) {
        const { error: socialError } = await supabase.from('social_links').insert(
          socials.map((s, index) => ({
            label: s.label,
            url: s.url,
            icon_key: s.icon_key,
            sort_order: index,
            is_active: s.is_active,
          })),
        )
        if (socialError) throw socialError
      }

      await revalidatePortfolio()
      setMessage('Saved site settings and social links.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1>Site & About</h1>
      <p className="admin-lead">Identity, about copy, portrait, and social links.</p>
      {message ? <p className="admin-msg">{message}</p> : null}
      {error ? <p className="admin-msg error">{error}</p> : null}

      <div className="admin-card">
        <h2>Identity</h2>
        <div className="admin-grid two">
          {(
            [
              ['name', 'Name'],
              ['greeting', 'Greeting'],
              ['title', 'Title'],
              ['email', 'Email'],
              ['location', 'Location'],
            ] as const
          ).map(([key, label]) => (
            <div className="admin-field" key={key}>
              <label>{label}</label>
              <input
                value={site[key]}
                onChange={(e) => setSite((prev) => ({ ...prev, [key]: e.target.value }))}
              />
            </div>
          ))}
        </div>
        <div className="admin-field" style={{ marginTop: 12 }}>
          <label>Stats (one per line: value|label)</label>
          <textarea value={statsText} onChange={(e) => setStatsText(e.target.value)} />
        </div>
      </div>

      <div className="admin-card">
        <h2>About</h2>
        <div className="admin-grid">
          <div className="admin-field">
            <label>Kicker</label>
            <input
              value={site.about_kicker}
              onChange={(e) => setSite((prev) => ({ ...prev, about_kicker: e.target.value }))}
            />
          </div>
          <div className="admin-field">
            <label>Heading</label>
            <input
              value={site.about_heading}
              onChange={(e) => setSite((prev) => ({ ...prev, about_heading: e.target.value }))}
            />
          </div>
          <div className="admin-field">
            <label>Body (paragraphs separated by blank line)</label>
            <textarea value={bodyText} onChange={(e) => setBodyText(e.target.value)} rows={8} />
          </div>
          <div className="admin-field">
            <label>Portrait URL</label>
            <input
              value={site.portrait_url}
              onChange={(e) => setSite((prev) => ({ ...prev, portrait_url: e.target.value }))}
            />
          </div>
          <div className="admin-field">
            <label>Upload portrait</label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                try {
                  await uploadPortrait(file)
                  setMessage('Portrait uploaded — click Save to persist.')
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Upload failed')
                }
              }}
            />
          </div>
          {site.portrait_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={site.portrait_url} alt="" style={{ width: 160, borderRadius: 12 }} />
          ) : null}
        </div>
      </div>

      <div className="admin-card">
        <h2>Social links</h2>
        {socials.map((social, index) => (
          <div className="admin-list-row" key={social.id ?? index}>
            <input
              placeholder="Label"
              value={social.label}
              onChange={(e) =>
                setSocials((prev) => prev.map((s, i) => (i === index ? { ...s, label: e.target.value } : s)))
              }
            />
            <input
              placeholder="URL"
              value={social.url}
              onChange={(e) =>
                setSocials((prev) => prev.map((s, i) => (i === index ? { ...s, url: e.target.value } : s)))
              }
            />
            <input
              placeholder="icon_key"
              value={social.icon_key}
              onChange={(e) =>
                setSocials((prev) =>
                  prev.map((s, i) => (i === index ? { ...s, icon_key: e.target.value } : s)),
                )
              }
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, flex: '0 0 auto' }}>
              <input
                type="checkbox"
                checked={social.is_active}
                onChange={(e) =>
                  setSocials((prev) =>
                    prev.map((s, i) => (i === index ? { ...s, is_active: e.target.checked } : s)),
                  )
                }
              />
              Active
            </label>
            <button
              className="admin-btn danger"
              type="button"
              onClick={() => setSocials((prev) => prev.filter((_, i) => i !== index))}
            >
              Remove
            </button>
          </div>
        ))}
        <div className="admin-actions">
          <button
            className="admin-btn secondary"
            type="button"
            onClick={() =>
              setSocials((prev) => [
                ...prev,
                { label: 'New', url: 'https://', icon_key: 'link', sort_order: prev.length, is_active: true },
              ])
            }
          >
            Add social
          </button>
        </div>
      </div>

      <div className="admin-actions">
        <button className="admin-btn" type="button" disabled={saving} onClick={() => void save()}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}
