import type { HomeContent, PortfolioContent } from '@/types/content'

export function toHomeContent(content: PortfolioContent): HomeContent {
  const { projects, workflow: _workflow, ...home } = content
  return {
    ...home,
    projects: projects.map(({ slug, name, hook, cover, stack }) => ({
      slug, name, hook, cover, stack: stack.slice(0, 3),
    })),
  }
}
