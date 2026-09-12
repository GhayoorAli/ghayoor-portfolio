import { getFallbackContent } from '@/lib/fallback-content'
import { ICON_OPTIONS, mergeIconOptions, type IconOption } from '@/lib/icon-catalog'
import { applyReadmeToProject } from '@/lib/project-readme'
import { isSupabaseConfigured } from '@/lib/supabase/client'
import { createClient } from '@/lib/supabase/server'
import type {
  CertificationItem,
  EducationItem,
  ExperienceItem,
  PortfolioContent,
  Project,
  ProjectChallenge,
  SkillGroup,
  SocialLink,
  SiteSettings,
  WorkflowItem,
} from '@/types/content'

export function supabaseReady() {
  return isSupabaseConfigured()
}

export async function getPortfolioContent(): Promise<PortfolioContent> {
  if (!supabaseReady()) return getFallbackContent()

  try {
    const supabase = await createClient()
    const [
      settingsRes,
      socialsRes,
      groupsRes,
      skillsRes,
      technologyIconsRes,
      projectsRes,
      stackRes,
      imagesRes,
      experienceRes,
      educationRes,
      certsRes,
      workflowRes,
    ] = await Promise.all([
      supabase.from('site_settings').select('*').limit(1).maybeSingle(),
      supabase.from('social_links').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('skill_groups').select('*').order('sort_order'),
      supabase.from('skills').select('*').order('sort_order'),
      supabase.from('technology_icons').select('*').order('name'),
      supabase.from('projects').select('*').eq('is_published', true).order('sort_order'),
      supabase.from('project_stack').select('*').order('sort_order'),
      supabase.from('project_images').select('*').order('sort_order'),
      supabase.from('experience').select('*').order('sort_order'),
      supabase.from('education').select('*').order('sort_order'),
      supabase.from('certifications').select('*').order('sort_order'),
      supabase.from('workflow_steps').select('*').order('sort_order'),
    ])

    if (settingsRes.error || !settingsRes.data) {
      console.warn('Supabase content unavailable, using fallback:', settingsRes.error?.message)
      return getFallbackContent()
    }

    const settings = settingsRes.data
    const site: SiteSettings = {
      name: settings.name,
      greeting: settings.greeting,
      title: settings.title,
      email: settings.email,
      location: settings.location,
      stats: settings.stats ?? [],
      about_kicker: settings.about_kicker,
      about_heading: settings.about_heading,
      about_body: settings.about_body ?? [],
      portrait_url: settings.portrait_url || '/images/portrait.webp',
    }

    const socials: SocialLink[] = (socialsRes.data ?? []).map((row) => ({
      id: row.id,
      label: row.label,
      url: row.url,
      icon_key: row.icon_key,
      sort_order: row.sort_order,
      is_active: row.is_active,
    }))

    const technologyIcons = mergeIconOptions(
      (technologyIconsRes.data ?? []).map((row) => ({
        id: row.key,
        label: row.name,
        src: row.icon_url,
        isBuiltIn: row.is_builtin,
      })),
    )
    const iconById = new Map(technologyIcons.map((icon) => [icon.id, icon]))

    const skillsByGroup = new Map<string, SkillGroup['items']>()
    for (const skill of skillsRes.data ?? []) {
      const list = skillsByGroup.get(skill.group_id) ?? []
      list.push({
        id: skill.id,
        name: skill.name,
        icon_id: skill.icon_id,
        icon_url: iconById.get(skill.icon_id)?.src,
      })
      skillsByGroup.set(skill.group_id, list)
    }

    const skillGroups: SkillGroup[] = (groupsRes.data ?? []).map((group) => ({
      id: group.id,
      category: group.category,
      sort_order: group.sort_order,
      items: skillsByGroup.get(group.id) ?? [],
    }))

    const stackByProject = new Map<string, Project['stack']>()
    for (const row of stackRes.data ?? []) {
      const list = stackByProject.get(row.project_id) ?? []
      list.push({
        id: row.icon_id,
        name: row.name,
        icon_url: iconById.get(row.icon_id)?.src,
      })
      stackByProject.set(row.project_id, list)
    }

    const galleryByProject = new Map<string, string[]>()
    for (const row of imagesRes.data ?? []) {
      const list = galleryByProject.get(row.project_id) ?? []
      list.push(row.url)
      galleryByProject.set(row.project_id, list)
    }

    const projects: Project[] = (projectsRes.data ?? []).map((row) => {
      const project: Project = {
        id: row.id,
        slug: row.slug,
        name: row.name,
        hook: row.hook,
        cover: row.cover_url,
        tag: row.tag,
        year: row.year,
        problem: row.problem,
        role: row.role,
        stack: stackByProject.get(row.id) ?? [],
        features: row.features ?? [],
        challenges: (row.challenges ?? []) as ProjectChallenge[],
        architecture: row.architecture,
        workflow: row.workflow,
        links: { live: row.live_url, github: row.github_url },
        gallery: galleryByProject.get(row.id) ?? [],
        results: row.results,
        readme: row.readme ?? '',
        sort_order: row.sort_order,
        is_published: row.is_published,
      }
      return row.readme ? applyReadmeToProject(project, row.readme, technologyIcons) : project
    })

    const experience: ExperienceItem[] = (experienceRes.data ?? []).map((row) => ({
      id: row.id,
      role: row.role,
      company: row.company,
      period: row.period,
      location: row.location,
      stack: row.stack ?? [],
      summary: row.summary,
      points: row.points ?? [],
      sort_order: row.sort_order,
    }))

    const education: EducationItem[] = (educationRes.data ?? []).map((row) => ({
      id: row.id,
      school: row.school,
      degree: row.degree,
      period: row.period,
      place: row.place,
      sort_order: row.sort_order,
    }))

    const certifications: CertificationItem[] = (certsRes.data ?? []).map((row) => ({
      id: row.id,
      title: row.title,
      issuer: row.issuer,
      platform: row.platform,
      date: row.date,
      note: row.note,
      image: row.image_url,
      url: row.url,
      sort_order: row.sort_order,
    }))

    const workflow: WorkflowItem[] =
      workflowRes.data && workflowRes.data.length > 0
        ? workflowRes.data.map((row) => ({
            step: row.step,
            title: row.title,
            text: row.text,
          }))
        : getFallbackContent().workflow

    return {
      site,
      socials,
      skillGroups,
      projects,
      experience,
      education,
      certifications,
      workflow,
    }
  } catch (error) {
    console.warn('Failed to load Supabase content:', error)
    return getFallbackContent()
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const content = await getPortfolioContent()
  return content.projects.find((project) => project.slug === slug) ?? null
}

export async function getTechnologyIcons(): Promise<IconOption[]> {
  if (!supabaseReady()) return mergeIconOptions([])

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('technology_icons').select('*').order('name')
    if (error) return mergeIconOptions([])
    return mergeIconOptions(
      (data ?? []).map((row) => ({
        id: row.key,
        label: row.name,
        src: row.icon_url,
        isBuiltIn: row.is_builtin,
      })),
    )
  } catch {
    return ICON_OPTIONS.map((icon) => ({ ...icon, isBuiltIn: true }))
  }
}

export async function getAllProjectsAdmin() {
  if (!supabaseReady()) return getFallbackContent().projects
  const supabase = await createClient()
  const technologyIcons = await getTechnologyIcons()
  const iconById = new Map(technologyIcons.map((icon) => [icon.id, icon]))
  const { data: projects } = await supabase.from('projects').select('*').order('sort_order')
  const { data: stack } = await supabase.from('project_stack').select('*').order('sort_order')
  const { data: images } = await supabase.from('project_images').select('*').order('sort_order')

  const stackByProject = new Map<string, Project['stack']>()
  for (const row of stack ?? []) {
    const list = stackByProject.get(row.project_id) ?? []
    list.push({
      id: row.icon_id,
      name: row.name,
      icon_url: iconById.get(row.icon_id)?.src,
    })
    stackByProject.set(row.project_id, list)
  }
  const galleryByProject = new Map<string, string[]>()
  for (const row of images ?? []) {
    const list = galleryByProject.get(row.project_id) ?? []
    list.push(row.url)
    galleryByProject.set(row.project_id, list)
  }

  return (projects ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    hook: row.hook,
    cover: row.cover_url,
    tag: row.tag,
    year: row.year,
    problem: row.problem,
    role: row.role,
    stack: stackByProject.get(row.id) ?? [],
    features: row.features ?? [],
    challenges: (row.challenges ?? []) as ProjectChallenge[],
    architecture: row.architecture,
    workflow: row.workflow,
    links: { live: row.live_url, github: row.github_url },
    gallery: galleryByProject.get(row.id) ?? [],
    results: row.results,
    readme: row.readme ?? '',
    sort_order: row.sort_order,
    is_published: row.is_published,
  }))
}
