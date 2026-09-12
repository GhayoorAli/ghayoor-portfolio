'use client'

import { useEffect, useId, useMemo, useState } from 'react'
import {
  ICON_OPTIONS,
  findIconByName,
  normalizeIconName,
  type IconOption,
} from '@/lib/icon-catalog'
import { createClient } from '@/lib/supabase/client'

type IconSelectProps = {
  value: string
  onChange: (iconId: string, label: string) => void
  options?: IconOption[]
  onIconCreated?: (icon: IconOption) => void
  className?: string
}

const MAX_ICON_BYTES = 512 * 1024
const ACCEPTED_ICON_TYPES = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp']

export function IconSelect({
  value,
  onChange,
  options = ICON_OPTIONS,
  onIconCreated,
  className = '',
}: IconSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [iconName, setIconName] = useState('')
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fieldId = useId()
  const option = options.find((item) => item.id === value) ?? findIconByName(value, options)
  const filteredOptions = useMemo(() => {
    const query = normalizeIconName(search)
    if (!query) return options
    return options.filter(
      (item) =>
        normalizeIconName(item.label).includes(query) || normalizeIconName(item.id).includes(query),
    )
  }, [options, search])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const uploadIcon = async () => {
    const name = iconName.trim()
    setError('')
    if (name.length < 2) {
      setError('Enter a descriptive icon name.')
      return
    }
    if (!iconFile) {
      setError('Choose an SVG, PNG, JPG, or WebP icon.')
      return
    }
    if (!ACCEPTED_ICON_TYPES.includes(iconFile.type)) {
      setError('Unsupported file type. Use SVG, PNG, JPG, or WebP.')
      return
    }
    if (iconFile.size > MAX_ICON_BYTES) {
      setError('The icon must be 512 KB or smaller.')
      return
    }
    if (findIconByName(name, options)) {
      setError(`An icon named "${name}" already exists.`)
      return
    }

    const key = normalizeIconName(name)
    if (!key) {
      setError('The icon name must contain letters or numbers.')
      return
    }

    setUploading(true)
    const supabase = createClient()
    const extension = iconFile.name.split('.').pop()?.toLowerCase() || 'svg'
    const path = `${key}/${crypto.randomUUID()}.${extension}`

    try {
      const { error: uploadError } = await supabase.storage
        .from('technology-icons')
        .upload(path, iconFile, { contentType: iconFile.type, upsert: false })
      if (uploadError) throw uploadError

      const { data: publicUrl } = supabase.storage.from('technology-icons').getPublicUrl(path)
      const { data: row, error: insertError } = await supabase
        .from('technology_icons')
        .insert({ key, name, icon_url: publicUrl.publicUrl, is_builtin: false })
        .select('key, name, icon_url, is_builtin')
        .single()

      if (insertError) {
        await supabase.storage.from('technology-icons').remove([path])
        throw insertError
      }

      const created: IconOption = {
        id: row.key,
        label: row.name,
        src: row.icon_url,
        isBuiltIn: row.is_builtin,
      }
      onIconCreated?.(created)
      onChange(created.id, created.label)
      setIconName('')
      setIconFile(null)
      setSearch('')
      setOpen(false)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Icon upload failed.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={`admin-icon-select ${className}`.trim()}>
      <button className="admin-icon-picker-trigger" type="button" onClick={() => setOpen(true)}>
        <span className="admin-icon-preview" aria-hidden="true">
          {option ? <img src={option.src} alt="" width={22} height={22} /> : <span>?</span>}
        </span>
        <span>{option?.label ?? 'Choose icon'}</span>
        <span className="admin-icon-picker-chevron" aria-hidden="true">⌄</span>
      </button>

      {open ? (
        <div className="admin-icon-library-backdrop" role="presentation" onMouseDown={() => setOpen(false)}>
          <section
            className="admin-icon-library"
            role="dialog"
            aria-modal="true"
            aria-label="Choose technology icon"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="admin-icon-library-head">
              <div>
                <h2>Choose an icon</h2>
                <p>Search the library or upload a reusable icon.</p>
              </div>
              <button
                className="admin-icon-btn"
                type="button"
                aria-label="Close icon library"
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </header>

            <div className="admin-field">
              <label htmlFor={`${fieldId}-search`}>Search icons</label>
              <input
                id={`${fieldId}-search`}
                value={search}
                placeholder="Search by technology name"
                autoFocus
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="admin-icon-library-grid">
              {filteredOptions.map((item) => (
                <button
                  className={`admin-icon-library-option ${item.id === option?.id ? 'is-selected' : ''}`}
                  type="button"
                  key={item.id}
                  onClick={() => {
                    onChange(item.id, item.label)
                    setSearch('')
                    setOpen(false)
                  }}
                >
                  <img src={item.src} alt="" width={28} height={28} />
                  <span>{item.label}</span>
                </button>
              ))}
              {filteredOptions.length === 0 ? (
                <p className="admin-icon-library-empty">No matching icons.</p>
              ) : null}
            </div>

            <div className="admin-icon-upload">
              <div>
                <h3>Upload new icon</h3>
                <p>It will be saved to the shared library for future skills and projects.</p>
              </div>
              <div className="admin-icon-upload-fields">
                <div className="admin-field">
                  <label htmlFor={`${fieldId}-name`}>Technology name</label>
                  <input
                    id={`${fieldId}-name`}
                    value={iconName}
                    placeholder="e.g. Supabase"
                    onChange={(event) => setIconName(event.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label htmlFor={`${fieldId}-file`}>Icon file</label>
                  <input
                    id={`${fieldId}-file`}
                    type="file"
                    accept=".svg,.png,.jpg,.jpeg,.webp,image/svg+xml,image/png,image/jpeg,image/webp"
                    onChange={(event) => setIconFile(event.target.files?.[0] ?? null)}
                  />
                </div>
              </div>
              {error ? <p className="admin-inline-error">{error}</p> : null}
              <button className="admin-btn admin-btn-sm" type="button" disabled={uploading} onClick={() => void uploadIcon()}>
                {uploading ? 'Uploading…' : 'Upload and select'}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}
