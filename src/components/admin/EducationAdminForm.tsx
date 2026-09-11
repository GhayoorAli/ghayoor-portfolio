'use client'

import { useState } from 'react'
import { revalidatePortfolio } from '@/app/admin/actions'
import { CERT_PLATFORMS } from '@/lib/icon-catalog'
import { createClient } from '@/lib/supabase/client'
import type { CertificationItem, EducationItem } from '@/types/content'

export function EducationAdminForm({
  initialEducation,
  initialCertifications,
}: {
  initialEducation: EducationItem[]
  initialCertifications: CertificationItem[]
}) {
  const [education, setEducation] = useState(initialEducation)
  const [certs, setCerts] = useState(initialCertifications)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<number | null>(null)

  const save = async () => {
    setSaving(true)
    setMessage('')
    setError('')
    try {
      const supabase = createClient()
      await supabase.from('education').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('certifications').delete().neq('id', '00000000-0000-0000-0000-000000000000')

      if (education.length) {
        const { error: eduError } = await supabase.from('education').insert(
          education.map((item, index) => ({
            school: item.school,
            degree: item.degree,
            period: item.period,
            place: item.place,
            sort_order: index,
          })),
        )
        if (eduError) throw eduError
      }

      if (certs.length) {
        const { error: certError } = await supabase.from('certifications').insert(
          certs.map((item, index) => ({
            title: item.title,
            issuer: item.issuer,
            platform: item.platform,
            date: item.date,
            note: item.note,
            image_url: item.image,
            url: item.url,
            sort_order: index,
          })),
        )
        if (certError) throw certError
      }

      await revalidatePortfolio()
      setMessage('Education and certifications saved.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const uploadCertImage = async (index: number, file: File) => {
    setUploading(index)
    setError('')
    try {
      const supabase = createClient()
      const path = `certs/${Date.now()}-${file.name.replace(/\s+/g, '-')}`
      const { error: uploadError } = await supabase.storage.from('projects').upload(path, file, {
        upsert: true,
      })
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('projects').getPublicUrl(path)
      setCerts((prev) => prev.map((row, i) => (i === index ? { ...row, image: data.publicUrl } : row)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(null)
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1>Education</h1>
          <p className="admin-lead">Schools and certificate gallery shown on the public site.</p>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn" type="button" disabled={saving} onClick={() => void save()}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </header>

      {message ? <p className="admin-msg">{message}</p> : null}
      {error ? <p className="admin-msg error">{error}</p> : null}

      <section className="admin-card">
        <div className="admin-section-head">
          <div>
            <h2>Schools</h2>
            <p className="admin-section-sub">Degrees and institutions</p>
          </div>
          <button
            className="admin-btn secondary admin-btn-sm"
            type="button"
            onClick={() =>
              setEducation((prev) => [...prev, { school: '', degree: '', period: '', place: '' }])
            }
          >
            + Add school
          </button>
        </div>

        <div className="admin-stack">
          {education.map((item, index) => (
            <div className="admin-subcard" key={index}>
              <div className="admin-card-toolbar">
                <strong>{item.school || `School ${index + 1}`}</strong>
                <button
                  type="button"
                  className="admin-icon-btn danger"
                  aria-label="Remove school"
                  onClick={() => setEducation((prev) => prev.filter((_, i) => i !== index))}
                >
                  ×
                </button>
              </div>
              <div className="admin-grid two">
                <div className="admin-field">
                  <label>School</label>
                  <input
                    value={item.school}
                    onChange={(e) =>
                      setEducation((prev) =>
                        prev.map((row, i) => (i === index ? { ...row, school: e.target.value } : row)),
                      )
                    }
                  />
                </div>
                <div className="admin-field">
                  <label>Degree</label>
                  <input
                    value={item.degree}
                    onChange={(e) =>
                      setEducation((prev) =>
                        prev.map((row, i) => (i === index ? { ...row, degree: e.target.value } : row)),
                      )
                    }
                  />
                </div>
                <div className="admin-field">
                  <label>Period</label>
                  <input
                    value={item.period}
                    placeholder="2021 — 2024"
                    onChange={(e) =>
                      setEducation((prev) =>
                        prev.map((row, i) => (i === index ? { ...row, period: e.target.value } : row)),
                      )
                    }
                  />
                </div>
                <div className="admin-field">
                  <label>Place</label>
                  <input
                    value={item.place}
                    placeholder="City, Country"
                    onChange={(e) =>
                      setEducation((prev) =>
                        prev.map((row, i) => (i === index ? { ...row, place: e.target.value } : row)),
                      )
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-section-head">
          <div>
            <h2>Certifications</h2>
            <p className="admin-section-sub">Gallery cards with optional verify link</p>
          </div>
          <button
            className="admin-btn secondary admin-btn-sm"
            type="button"
            onClick={() =>
              setCerts((prev) => [
                ...prev,
                {
                  title: '',
                  issuer: '',
                  platform: 'Coursera',
                  date: '',
                  note: null,
                  image: '',
                  url: null,
                },
              ])
            }
          >
            + Add certification
          </button>
        </div>

        <div className="admin-stack">
          {certs.map((item, index) => (
            <div className="admin-subcard admin-cert-card" key={index}>
              <div className="admin-cert-media">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt="" className="admin-cert-preview" />
                ) : (
                  <div className="admin-cert-placeholder">No image</div>
                )}
                <label className="admin-file-btn">
                  {uploading === index ? 'Uploading…' : 'Upload image'}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    disabled={uploading === index}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) void uploadCertImage(index, file)
                    }}
                  />
                </label>
              </div>

              <div className="admin-cert-fields">
                <div className="admin-card-toolbar">
                  <strong>{item.title || `Certificate ${index + 1}`}</strong>
                  <button
                    type="button"
                    className="admin-icon-btn danger"
                    aria-label="Remove certification"
                    onClick={() => setCerts((prev) => prev.filter((_, i) => i !== index))}
                  >
                    ×
                  </button>
                </div>
                <div className="admin-grid two">
                  <div className="admin-field">
                    <label>Title</label>
                    <input
                      value={item.title}
                      onChange={(e) =>
                        setCerts((prev) =>
                          prev.map((row, i) => (i === index ? { ...row, title: e.target.value } : row)),
                        )
                      }
                    />
                  </div>
                  <div className="admin-field">
                    <label>Issuer</label>
                    <input
                      value={item.issuer}
                      onChange={(e) =>
                        setCerts((prev) =>
                          prev.map((row, i) => (i === index ? { ...row, issuer: e.target.value } : row)),
                        )
                      }
                    />
                  </div>
                  <div className="admin-field">
                    <label>Platform</label>
                    <select
                      value={
                        CERT_PLATFORMS.includes(item.platform) ? item.platform : 'Other'
                      }
                      onChange={(e) =>
                        setCerts((prev) =>
                          prev.map((row, i) =>
                            i === index ? { ...row, platform: e.target.value } : row,
                          ),
                        )
                      }
                    >
                      {CERT_PLATFORMS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="admin-field">
                    <label>Date</label>
                    <input
                      value={item.date}
                      placeholder="2024"
                      onChange={(e) =>
                        setCerts((prev) =>
                          prev.map((row, i) => (i === index ? { ...row, date: e.target.value } : row)),
                        )
                      }
                    />
                  </div>
                  <div className="admin-field">
                    <label>Image URL</label>
                    <input
                      value={item.image}
                      onChange={(e) =>
                        setCerts((prev) =>
                          prev.map((row, i) => (i === index ? { ...row, image: e.target.value } : row)),
                        )
                      }
                    />
                  </div>
                  <div className="admin-field">
                    <label>Verify URL</label>
                    <input
                      value={item.url ?? ''}
                      placeholder="https://"
                      onChange={(e) =>
                        setCerts((prev) =>
                          prev.map((row, i) =>
                            i === index ? { ...row, url: e.target.value || null } : row,
                          ),
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
