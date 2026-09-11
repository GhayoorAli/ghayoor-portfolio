import {
  about,
  certifications,
  education,
  experience,
  projects,
  site,
  stackGroups,
  workflow,
} from '@/data/site'
import type { PortfolioContent } from '@/types/content'

export function getFallbackContent(): PortfolioContent {
  return {
    site: {
      name: site.name,
      greeting: site.greeting,
      title: site.title,
      email: site.email,
      location: site.location,
      stats: [...site.stats],
      about_kicker: about.kicker,
      about_heading: about.heading,
      about_body: [...about.body],
      portrait_url: '/images/portrait.webp',
    },
    socials: [
      {
        label: 'GitHub',
        url: site.socials.github,
        icon_key: 'github',
        sort_order: 0,
        is_active: true,
      },
      {
        label: 'LinkedIn',
        url: site.socials.linkedin,
        icon_key: 'linkedin',
        sort_order: 1,
        is_active: true,
      },
    ],
    skillGroups: stackGroups.map((group, gi) => ({
      category: group.category,
      sort_order: gi,
      items: group.items.map((item, ii) => ({
        id: `${gi}-${ii}`,
        name: item.name,
        icon_id: item.id,
      })),
    })),
    projects: projects.map((project, index) => ({
      ...project,
      sort_order: index,
      is_published: true,
    })),
    experience: experience.map((item, index) => ({ ...item, sort_order: index })),
    education: education.map((item, index) => ({ ...item, sort_order: index })),
    certifications: certifications.map((item, index) => ({
      ...item,
      note: item.note ?? null,
      sort_order: index,
    })),
    workflow: [...workflow],
  }
}
