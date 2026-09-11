'use client'

import { useState } from 'react'

type LineListProps = {
  values: string[]
  onChange: (next: string[]) => void
  placeholder?: string
  addLabel?: string
}

export function LineListEditor({
  values,
  onChange,
  placeholder = 'New item',
  addLabel = 'Add item',
}: LineListProps) {
  const [draft, setDraft] = useState('')

  return (
    <div className="admin-line-list">
      {values.map((line, index) => (
        <div className="admin-line-row" key={`${index}-${line.slice(0, 12)}`}>
          <span className="admin-line-index">{index + 1}</span>
          <input
            value={line}
            onChange={(e) =>
              onChange(values.map((v, i) => (i === index ? e.target.value : v)))
            }
          />
          <button
            type="button"
            className="admin-icon-btn danger"
            aria-label="Remove"
            onClick={() => onChange(values.filter((_, i) => i !== index))}
          >
            ×
          </button>
        </div>
      ))}
      <div className="admin-line-row is-draft">
        <span className="admin-line-index">+</span>
        <input
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              const next = draft.trim()
              if (!next) return
              onChange([...values, next])
              setDraft('')
            }
          }}
        />
        <button
          type="button"
          className="admin-btn secondary admin-btn-sm"
          onClick={() => {
            const next = draft.trim()
            if (!next) return
            onChange([...values, next])
            setDraft('')
          }}
        >
          {addLabel}
        </button>
      </div>
    </div>
  )
}
