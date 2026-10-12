import type { ExperienceItem } from '@/types/content'

type DetailSection = NonNullable<ExperienceItem['sections']>[number]
const heading = /^(Laravel\s*&\s*PHP|PHP\s*&\s*Laravel|React.*Vue\.js|Node\.js|WordPress|Mobile\s*&\s*Delivery|HTML\s*\/.*React|Collaboration|Personal Projects|Responsibilities)$/i
const strings = (value: unknown): string[] => Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
const text = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const companyKey = (value: string) => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '')

export function decodeExperienceDetails(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { points: strings(value), sections: [] as DetailSection[], employment_type: undefined, duration: undefined }
  const data = value as Record<string, unknown>
  const sections: DetailSection[] = Array.isArray(data.sections) ? data.sections.flatMap(item => {
    if (!item || typeof item !== 'object') return []
    const section = item as Record<string, unknown>
    return [{ title: text(section.title) || 'Responsibilities', points: strings(section.points) }]
  }) : []
  return { sections, points: sections.length ? sections.flatMap(section => section.points) : strings(data.highlights), employment_type: text(data.employment_type), duration: text(data.duration) }
}

/** Preserve detailed legacy summaries in Read more while keeping timeline cards compact. */
export function normalizeExperience(item: ExperienceItem, templates: readonly ExperienceItem[] = []): ExperienceItem {
  const role = item.role.replace(/^New role\s*(?=Full\s*Stack)/i, '').trim()
  const template = templates.find(candidate => companyKey(candidate.company) === companyKey(item.company) && candidate.period.match(/\d{4}/)?.[0] === item.period.match(/\d{4}/)?.[0])
  const matchingHighlights = template && item.points.length === template.points.length && item.points.every((point, index) => point === template.points[index])
  const shared = { role, employment_type: item.employment_type ?? template?.employment_type, duration: item.duration ?? template?.duration, sections: item.sections?.length ? item.sections : matchingHighlights ? template.sections : item.sections }
  if (item.summary.length <= 280 && !item.summary.split(/\r?\n/).some(line => heading.test(line.trim()))) return { ...item, ...shared }
  const lines = item.summary.split(/\r?\n/).map(line => line.trim()).filter(Boolean)
  const sections: DetailSection[] = []
  let current: DetailSection | undefined
  const introduction: string[] = []
  for (const line of lines) {
    if (heading.test(line)) { current = { title: line, points: [] }; sections.push(current) }
    else if (current) current.points.push(line.replace(/^[•\-*]\s*/, ''))
    else introduction.push(line)
  }
  const original = item.summary.trim()
  const short = introduction.join(' ').match(/^.{1,280}?(?:[.!?](?:\s|$)|$)/)?.[0]?.trim()
  const summary = template?.summary || short || `${original.slice(0, 260).replace(/\s+\S*$/, '')}…`
  // Include all original text when a long unstructured paragraph is shortened.
  if (!sections.length) sections.push({ title: 'Details', points: [original] })
  else if (introduction.join(' ').length > 280) sections.unshift({ title: 'Details', points: introduction })
  const details = (item.sections || []).map(section => ({ ...section, points: [...section.points] }))
  for (const section of sections) {
    const existing = details.find(group => group.title.toLowerCase() === section.title.toLowerCase())
    if (existing) existing.points = [...new Set([...existing.points, ...section.points])]
    else details.push(section)
  }
  const existing = item.points.filter(point => !details.some(section => section.points.includes(point)))
  if (existing.length) details.push({ title: 'Additional highlights', points: existing })
  return { ...item, role, summary, sections: details, points: details.flatMap(section => section.points), employment_type: shared.employment_type, duration: shared.duration }
}

/** The existing JSONB column supports both legacy arrays and structured details. */
export function encodeExperienceDetails(item: ExperienceItem) {
  return { version: 1, employment_type: item.employment_type || '', duration: item.duration || '', highlights: item.points, sections: item.sections || [] }
}
