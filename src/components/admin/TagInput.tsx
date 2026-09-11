'use client'

import { useState, type KeyboardEvent } from 'react'
import { TECH_TAG_SUGGESTIONS } from '@/lib/icon-catalog'

type TagInputProps = {
  values: string[]
  onChange: (next: string[]) => void
  suggestions?: string[]
  placeholder?: string
}

export function TagInput({
  values,
  onChange,
  suggestions = TECH_TAG_SUGGESTIONS,
  placeholder = 'Add tag and press Enter',
}: TagInputProps) {
  const [draft, setDraft] = useState('')

  const add = (raw: string) => {
    const tag = raw.trim()
    if (!tag) return
    if (values.some((v) => v.toLowerCase() === tag.toLowerCase())) {
      setDraft('')
      return
    }
    onChange([...values, tag])
    setDraft('')
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      add(draft)
    } else if (e.key === 'Backspace' && !draft && values.length) {
      onChange(values.slice(0, -1))
    }
  }

  const unused = suggestions.filter(
    (s) => !values.some((v) => v.toLowerCase() === s.toLowerCase()),
  )

  return (
    <div className="admin-tag-input">
      <div className="admin-tags">
        {values.map((tag) => (
          <span className="admin-tag" key={tag}>
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              onClick={() => onChange(values.filter((v) => v !== tag))}
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={draft}
          placeholder={values.length ? '' : placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => add(draft)}
        />
      </div>
      {unused.length ? (
        <div className="admin-tag-suggestions">
          {unused.slice(0, 10).map((s) => (
            <button key={s} type="button" className="admin-chip-btn" onClick={() => add(s)}>
              + {s}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
