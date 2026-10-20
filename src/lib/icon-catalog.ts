import { LOCAL_ICONS } from './local-icons'
import bundledIcons from '@/data/technology-icons.json'

export type IconOption = {
  id: string
  label: string
  src: string
  isBuiltIn?: boolean
}

export function normalizeIconName(value: string) {
  return value.toLowerCase().replace(/\+/g, 'plus').replace(/#/g, 'sharp').replace(/[^a-z0-9]/g, '')
}

// Bundled SVGs are served by the app; no third-party image host is needed at runtime.
export const ICON_OPTIONS: IconOption[] = [
  ...LOCAL_ICONS,
  ...bundledIcons.filter(icon => !LOCAL_ICONS.some(local => normalizeIconName(local.label) === normalizeIconName(icon.label) || normalizeIconName(local.id) === normalizeIconName(icon.id.replace(/^(devicon|simple-icons)-/, '')))),
]

export const ICON_BY_ID = Object.fromEntries(ICON_OPTIONS.map((o) => [o.id, o])) as Record<
  string,
  IconOption
>

export function mergeIconOptions(custom: IconOption[]) {
  const merged = new Map<string, IconOption>()
  for (const option of ICON_OPTIONS) merged.set(option.id, { ...option, isBuiltIn: true })
  for (const option of custom) merged.set(option.id, option)
  return [...merged.values()].sort((a, b) => a.label.localeCompare(b.label))
}

export function findIconByName(name: string, options: IconOption[]) {
  const normalized = normalizeIconName(name)
  return options.find(
    (option) =>
      normalizeIconName(option.id) === normalized || normalizeIconName(option.label) === normalized,
  )
}

export const TECH_TAG_SUGGESTIONS = [
  'PHP',
  'Laravel',
  'MySQL',
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Vue.js',
  'HTML/CSS',
  'Git',
  'Jira',
  'PhpStorm',
  'WordPress',
  'Magento 2',
  'Docker',
  'AWS',
  'PostgreSQL',
  'Supabase',
  'Node.js',
  'REST API',
]

export const CERT_PLATFORMS = [
  'Coursera',
  'Udemy',
  'LinkedIn Learning',
  'edX',
  'Google',
  'Meta',
  'AWS',
  'Microsoft',
  'freeCodeCamp',
  'Other',
]
