'use client'

import { ProjectMarkdown } from '@/components/ProjectMarkdown'

export function ReadmePreview({ value, repository }: { value: string; repository?: string | null }) {
  return <div className="admin-md-preview">{value.trim()
    ? <ProjectMarkdown value={value} repository={repository} />
    : <p className="admin-md-empty">Nothing to preview yet.</p>}</div>
}
