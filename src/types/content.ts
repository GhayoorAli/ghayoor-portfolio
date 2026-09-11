export type SiteStat = { value: string; label: string }

export type SocialLink = {
  id?: string
  label: string
  url: string
  icon_key: string
  sort_order: number
  is_active: boolean
}

export type SiteSettings = {
  name: string
  greeting: string
  title: string
  email: string
  location: string
  stats: SiteStat[]
  about_kicker: string
  about_heading: string
  about_body: string[]
  portrait_url: string
}

export type SkillItem = { id: string; name: string; icon_id: string }
export type SkillGroup = { id?: string; category: string; sort_order: number; items: SkillItem[] }

export type ProjectChallenge = {
  title: string
  problem: string
  solution: string
}

export type ProjectStackItem = { id: string; name: string }

export type Project = {
  id?: string
  slug: string
  name: string
  hook: string
  cover: string
  tag: string
  year: string
  problem: string
  role: string
  stack: ProjectStackItem[]
  features: string[]
  challenges: ProjectChallenge[]
  architecture?: string | null
  workflow?: string | null
  links: { live: string | null; github: string | null }
  gallery: string[]
  results?: string | null
  sort_order?: number
  is_published?: boolean
}

export type ExperienceItem = {
  id?: string
  role: string
  company: string
  period: string
  location: string
  stack: string[]
  summary: string
  points: string[]
  sort_order?: number
}

export type EducationItem = {
  id?: string
  school: string
  degree: string
  period: string
  place: string
  sort_order?: number
}

export type CertificationItem = {
  id?: string
  title: string
  issuer: string
  platform: string
  date: string
  note?: string | null
  image: string
  url: string | null
  sort_order?: number
}

export type WorkflowItem = {
  step: string
  title: string
  text: string
}

export type PortfolioContent = {
  site: SiteSettings
  socials: SocialLink[]
  skillGroups: SkillGroup[]
  projects: Project[]
  experience: ExperienceItem[]
  education: EducationItem[]
  certifications: CertificationItem[]
  workflow: WorkflowItem[]
}
