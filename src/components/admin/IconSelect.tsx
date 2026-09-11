'use client'

import { ICON_BY_ID, ICON_OPTIONS } from '@/lib/icon-catalog'

type IconSelectProps = {
  value: string
  onChange: (iconId: string, label: string) => void
  className?: string
}

export function IconSelect({ value, onChange, className = '' }: IconSelectProps) {
  const option = ICON_BY_ID[value]

  return (
    <div className={`admin-icon-select ${className}`.trim()}>
      <span className="admin-icon-preview" aria-hidden="true">
        {option ? <img src={option.src} alt="" width={22} height={22} /> : <span>?</span>}
      </span>
      <select
        value={ICON_BY_ID[value] ? value : ''}
        onChange={(e) => {
          const id = e.target.value
          const next = ICON_BY_ID[id]
          if (!next) return
          onChange(next.id, next.label)
        }}
      >
        {!ICON_BY_ID[value] ? <option value="">Select icon…</option> : null}
        {ICON_OPTIONS.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
