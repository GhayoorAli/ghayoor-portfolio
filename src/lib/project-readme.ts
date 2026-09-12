import { parse } from 'yaml'
import {
  ICON_OPTIONS,
  findIconByName,
  normalizeIconName,
  type IconOption,
} from '@/lib/icon-catalog'
import type { Project, ProjectChallenge, ProjectStackItem } from '@/types/content'

export type ProjectReadmeImport = {
  name?: string
  slug?: string
  tag?: string
  year?: string
  hook?: string
  problem?: string
  role?: string
  features?: string[]
  stack?: ProjectStackItem[]
  challenges?: ProjectChallenge[]
  results?: string
  architecture?: string
  workflow?: string
  liveUrl?: string | null
  githubUrl?: string | null
  importedFields: string[]
  warnings: string[]
}

const START_MARKER = '<!-- portfolio:start -->'
const END_MARKER = '<!-- portfolio:end -->'

const ICON_ALIASES: Record<string, string> = {
  git: 'github',
  github: 'github',
  gitgithub: 'github',
  htmlcss: 'html',
  magento2: 'magento',
  next: 'nextjs',
  nextjs: 'nextjs',
  node: 'nodejs',
  nodejs: 'nodejs',
  postgres: 'postgresql',
  tailwind: 'tailwindcss',
  tailwindcss: 'tailwindcss',
  vue: 'vue',
  vuejs: 'vue',
}

function normalize(value: string) {
  return normalizeIconName(value)
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function readString(source: Record<string, unknown>, key: string) {
  if (!(key in source)) return undefined
  const value = source[key]
  if (value === null || value === undefined) return ''
  if (typeof value === 'string' || typeof value === 'number') return String(value).trim()
  throw new Error(`"${key}" must be text.`)
}

function readStringList(source: Record<string, unknown>, key: string) {
  if (!(key in source)) return undefined
  const value = source[key]
  if (!Array.isArray(value)) throw new Error(`"${key}" must be a list.`)
  return value
    .map((item) => (typeof item === 'string' || typeof item === 'number' ? String(item).trim() : ''))
    .filter(Boolean)
}

function mapStack(value: unknown, warnings: string[], iconOptions: IconOption[]) {
  if (!Array.isArray(value)) throw new Error('"stack" must be a list.')

  return value
    .map((item): ProjectStackItem | null => {
      const name =
        typeof item === 'string'
          ? item.trim()
          : item && typeof item === 'object' && 'name' in item
            ? String(item.name).trim()
            : ''
      if (!name) return null

      const requestedId =
        item && typeof item === 'object' && 'id' in item ? normalize(String(item.id)) : normalize(name)
      const aliasedId = ICON_ALIASES[requestedId] ?? requestedId
      const option = findIconByName(aliasedId, iconOptions) ?? findIconByName(name, iconOptions)

      if (!option) {
        warnings.push(`No matching icon was found for "${name}". Select its icon in the Stack tab.`)
        return { id: slugify(name), name }
      }

      return { id: option.id, name: option.label, icon_url: option.src }
    })
    .filter((item): item is ProjectStackItem => item !== null)
}

function mapChallenges(value: unknown) {
  if (!Array.isArray(value)) throw new Error('"challenges" must be a list.')

  return value
    .map((item): ProjectChallenge | null => {
      if (!item || typeof item !== 'object') return null
      const source = item as Record<string, unknown>
      const title = readString(source, 'title') ?? ''
      const problem = readString(source, 'problem') ?? ''
      const solution = readString(source, 'solution') ?? ''
      if (!title && !problem && !solution) return null
      return { title, problem, solution }
    })
    .filter((item): item is ProjectChallenge => item !== null)
}

type MarkdownSection = {
  heading: string
  level: number
  body: string
}

function cleanMarkdown(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[*_~`>#]/g, '')
    .replace(/^\s*[-+]\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function markdownSections(readme: string) {
  const headings = [...readme.matchAll(/^(#{1,6})\s+(.+?)\s*$/gm)]
  return headings.map((match, index): MarkdownSection => {
    const level = match[1].length
    const start = (match.index ?? 0) + match[0].length
    let end = readme.length
    for (let next = index + 1; next < headings.length; next += 1) {
      if (headings[next][1].length <= level) {
        end = headings[next].index ?? readme.length
        break
      }
    }
    return { heading: cleanMarkdown(match[2]), level, body: readme.slice(start, end).trim() }
  })
}

function findSection(sections: MarkdownSection[], names: string[]) {
  const wanted = names.map(normalize)
  return (
    sections.find((section) => wanted.includes(normalize(section.heading))) ??
    sections.find((section) => wanted.some((name) => normalize(section.heading).includes(name)))
  )
}

function firstParagraph(value: string) {
  const withoutNoise = value
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^\s*(?:!\[[^\]]*]\([^)]*\)|<[^>]+>|[-*]\s+\[[ xX]\].*)\s*$/gm, '')
  const paragraphs = withoutNoise.split(/\n\s*\n/)
  for (const paragraph of paragraphs) {
    const cleaned = cleanMarkdown(paragraph)
    if (
      cleaned.length >= 25 &&
      !/^(install|npm |pnpm |yarn |composer |clone |cd |license|copyright)/i.test(cleaned)
    ) {
      return cleaned
    }
  }
  return ''
}

function bulletItems(value: string) {
  return [...value.matchAll(/^\s*[-*+]\s+(?!\[[ xX]\])(.+?)\s*$/gm)]
    .map((match) => cleanMarkdown(match[1]))
    .filter((item) => item.length > 2)
}

function mermaidBlock(value: string) {
  return value.match(/```mermaid\s*([\s\S]*?)```/i)?.[1]?.trim() ?? ''
}

function detectStack(value: string, warnings: string[], iconOptions: IconOption[]) {
  const segments = value
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .split(/[\n,|•·]+/)
    .map((segment) =>
      normalize(
        segment
          .replace(/^\s*[-*+]\s*/, '')
          .replace(/\([^)]*\)/g, ''),
      ),
    )
    .filter(Boolean)
  const detected = iconOptions.filter((option) => {
    const id = normalize(option.id)
    const label = normalize(option.label)
    const aliases = Object.entries(ICON_ALIASES)
      .filter(([, target]) => target === option.id)
      .map(([alias]) => alias)
    return [id, label, ...aliases].some((candidate) =>
      segments.some(
        (segment) =>
          segment === candidate || segment.startsWith(candidate) || segment.endsWith(candidate),
      ),
    )
  }).map((option) => option.label)

  return mapStack([...new Set(detected)], warnings, iconOptions)
}

function detectLinks(readme: string) {
  const markdownLinks = [...readme.matchAll(/\[([^\]]+)]\((https?:\/\/[^)\s]+)\)/gi)].map(
    (match) => ({ label: match[1].toLowerCase(), url: match[2] }),
  )
  const urls = [...readme.matchAll(/https?:\/\/[^\s)<>"']+/gi)].map((match) =>
    match[0].replace(/[.,;]+$/, ''),
  )

  const github =
    markdownLinks.find((link) => /github|source|repository|code/.test(link.label))?.url ??
    urls.find((url) => /github\.com\//i.test(url))
  const live =
    markdownLinks.find((link) => /live|demo|website|production|preview/.test(link.label))?.url ??
    urls.find((url) => !/github\.com|npmjs\.com|shields\.io|localhost/i.test(url))

  return { github: github ?? null, live: live ?? null }
}

function inferTag(readme: string) {
  const source = readme.toLowerCase()
  if (/webrtc|video meeting|video conferenc/.test(source)) return 'Video platform'
  if (/e-?commerce|online store|shopping cart/.test(source)) return 'E-commerce'
  if (/portfolio/.test(source)) return 'Portfolio'
  if (/mobile app|react native|flutter/.test(source)) return 'Mobile application'
  if (/\bapi\b|backend service/.test(source)) return 'API / Backend'
  if (/dashboard|analytics/.test(source)) return 'Dashboard'
  return 'Web application'
}

function challengesFromMarkdown(section?: MarkdownSection) {
  if (!section) return []
  const headings = [...section.body.matchAll(/^#{3,6}\s+(.+?)\s*$/gm)]
  const challenges: ProjectChallenge[] = []

  for (const [index, match] of headings.entries()) {
    const title = cleanMarkdown(match[1])
    const start = (match.index ?? 0) + match[0].length
    const end = headings[index + 1]?.index ?? section.body.length
    const body = section.body.slice(start, end).trim()
    const labeled = body.match(
      /(?:\*\*)?(?:challenge|problem)(?:\*\*)?\s*:?\s*([\s\S]*?)(?=(?:\*\*)?solution(?:\*\*)?\s*:)/i,
    )
    const solution = body.match(/(?:\*\*)?solution(?:\*\*)?\s*:?\s*([\s\S]*)/i)
    const paragraphs = body
      .split(/\n\s*\n/)
      .map(cleanMarkdown)
      .filter(Boolean)
    const problemText = cleanMarkdown(labeled?.[1] ?? paragraphs[0] ?? '')
    const solutionText = cleanMarkdown(solution?.[1] ?? paragraphs[1] ?? '')
    if (title && (problemText || solutionText)) {
      challenges.push({ title, problem: problemText, solution: solutionText })
    }
  }

  return challenges
}

function parsePlainMarkdown(readme: string, iconOptions: IconOption[]) {
  const sections = markdownSections(readme)
  const titleSection = sections.find((section) => section.level === 1)
  const name = titleSection?.heading ?? ''

  const warnings = [
    'Imported using automatic Markdown detection. Review every tab because unstructured READMEs can omit portfolio details.',
  ]
  const overview = findSection(sections, ['overview', 'about', 'description', 'introduction'])
  const problemSection = findSection(sections, ['problem', 'the problem', 'motivation', 'why'])
  const roleSection = findSection(sections, ['my role', 'role', 'responsibilities'])
  const featuresSection = findSection(sections, ['features', 'key features', 'what i built', 'functionality'])
  const stackSection = findSection(sections, ['tech stack', 'technology stack', 'technologies', 'built with'])
  const resultsSection = findSection(sections, ['results', 'outcomes', 'impact'])
  const architectureSection = findSection(sections, ['architecture', 'system architecture'])
  const workflowSection = findSection(sections, ['workflow', 'user flow', 'meeting workflow'])
  const challengesSection = findSection(sections, ['challenges', 'challenges and solutions', 'technical challenges'])
  const links = detectLinks(readme)

  const excluded = /install|setup|getting started|local development|configuration|environment|testing|contribut|license/
  const projectFocusedText = sections
    .filter((section) => !excluded.test(section.heading.toLowerCase()))
    .map((section) => `${section.heading}\n${section.body}`)
    .join('\n')
  const stack = detectStack(stackSection?.body ?? projectFocusedText, warnings, iconOptions)
  const features = featuresSection ? bulletItems(featuresSection.body) : []
  const challenges = challengesFromMarkdown(challengesSection)
  const hook = firstParagraph(overview?.body ?? titleSection?.body ?? readme)
  const yearMatch = projectFocusedText.match(/\b(20\d{2})\b/)

  const result: ProjectReadmeImport = {
    name,
    slug: slugify(name),
    tag: inferTag(projectFocusedText),
    year: yearMatch?.[1] ?? String(new Date().getFullYear()),
    hook,
    problem: problemSection ? firstParagraph(problemSection.body) : '',
    role: roleSection ? firstParagraph(roleSection.body) : '',
    features,
    stack,
    challenges,
    results: resultsSection ? firstParagraph(resultsSection.body) : '',
    architecture: architectureSection ? mermaidBlock(architectureSection.body) : '',
    workflow: workflowSection ? mermaidBlock(workflowSection.body) : '',
    liveUrl: links.live,
    githubUrl: links.github,
    importedFields: [
      'name',
      'slug',
      'tag',
      'year',
      'hook',
      'problem',
      'role',
      'features',
      'stack',
      'challenges',
      'results',
      'architecture',
      'workflow',
      'live_url',
      'github_url',
    ],
    warnings,
  }

  const missing = [
    ['hook', result.hook],
    ['problem', result.problem],
    ['role', result.role],
    ['features', result.features?.length],
    ['stack', result.stack?.length],
    ['challenges', result.challenges?.length],
    ['results', result.results],
  ]
    .filter(([, value]) => !value)
    .map(([field]) => field)
  if (missing.length) warnings.push(`Not found in the README: ${missing.join(', ')}.`)

  return result
}

export function parseProjectReadme(
  readme: string,
  iconOptions: IconOption[] = ICON_OPTIONS,
): ProjectReadmeImport {
  const start = readme.indexOf(START_MARKER)
  const end = readme.indexOf(END_MARKER)
  if (start === -1 && end === -1) return parsePlainMarkdown(readme, iconOptions)
  if (start === -1 || end === -1 || end <= start) throw new Error('The portfolio markers are incomplete.')

  const markedBlock = readme.slice(start + START_MARKER.length, end).trim()
  const fenced = markedBlock.match(/```(?:yaml|yml)?\s*([\s\S]*?)```/i)
  const yaml = (fenced?.[1] ?? markedBlock).trim()
  if (!yaml) throw new Error('The portfolio block is empty.')

  const parsed = parse(yaml) as unknown
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('The portfolio block must contain a YAML object.')
  }

  const root = parsed as Record<string, unknown>
  const nested = root.portfolio
  const source =
    nested && typeof nested === 'object' && !Array.isArray(nested)
      ? (nested as Record<string, unknown>)
      : root
  const warnings: string[] = []
  const result: ProjectReadmeImport = { importedFields: [], warnings }

  const stringFields = [
    ['name', 'name'],
    ['slug', 'slug'],
    ['tag', 'tag'],
    ['year', 'year'],
    ['hook', 'hook'],
    ['problem', 'problem'],
    ['role', 'role'],
    ['results', 'results'],
    ['architecture', 'architecture'],
    ['workflow', 'workflow'],
  ] as const

  for (const [sourceKey, resultKey] of stringFields) {
    const value = readString(source, sourceKey)
    if (value !== undefined) {
      result[resultKey] = value
      result.importedFields.push(sourceKey)
    }
  }

  const features = readStringList(source, 'features')
  if (features !== undefined) {
    result.features = features
    result.importedFields.push('features')
  }

  if ('stack' in source) {
    result.stack = mapStack(source.stack, warnings, iconOptions)
    result.importedFields.push('stack')
  }

  if ('challenges' in source) {
    result.challenges = mapChallenges(source.challenges)
    result.importedFields.push('challenges')
  }

  const liveUrl = readString(source, 'live_url') ?? readString(source, 'liveUrl')
  if (liveUrl !== undefined) {
    result.liveUrl = liveUrl || null
    result.importedFields.push('live_url')
  }

  const githubUrl = readString(source, 'github_url') ?? readString(source, 'githubUrl')
  if (githubUrl !== undefined) {
    result.githubUrl = githubUrl || null
    result.importedFields.push('github_url')
  }

  if (!result.slug && result.name) result.slug = slugify(result.name)
  if (result.importedFields.length === 0) {
    throw new Error('No supported project fields were found in the portfolio block.')
  }

  return result
}

/** Map README headings into the styled project fields. Basics (name, slug, links) stay as entered. */
export function applyReadmeToProject(
  project: Project,
  readme: string,
  iconOptions: IconOption[] = ICON_OPTIONS,
): Project {
  const trimmed = readme.trim()
  if (!trimmed) {
    return {
      ...project,
      readme,
      problem: '',
      role: '',
      features: [],
      stack: [],
      challenges: [],
      architecture: null,
      workflow: null,
      results: null,
    }
  }

  try {
    const imported = parseProjectReadme(trimmed, iconOptions)
    return {
      ...project,
      readme,
      problem: imported.problem ?? '',
      role: imported.role ?? '',
      features: imported.features ?? [],
      stack: imported.stack ?? [],
      challenges: imported.challenges ?? [],
      architecture: imported.architecture || null,
      workflow: imported.workflow || null,
      results: imported.results || null,
    }
  } catch {
    return { ...project, readme }
  }
}
