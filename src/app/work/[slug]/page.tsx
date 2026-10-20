import { notFound } from 'next/navigation'
import { ProjectMarkdown } from '@/components/ProjectMarkdown'
import { ProjectDetail } from '@/components/ProjectDetail'
import { ProjectPageClient } from '@/components/ProjectPageClient'
import { getPortfolioContent } from '@/lib/content'

export const revalidate = 60

export async function generateStaticParams() {
  const content = await getPortfolioContent()
  return content.projects.map((project) => ({ slug: project.slug }))
}

export default async function WorkProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const content = await getPortfolioContent()
  const project = content.projects.find(item => item.slug === slug)
  if (!project) notFound()

  const index = content.projects.findIndex(item => item.slug === project.slug)
  const nextProject = content.projects.length > 1 ? content.projects[(index + 1) % content.projects.length] : undefined

  const { readme, ...projectContent } = project
  const nextPreview = nextProject ? { slug: nextProject.slug, name: nextProject.name, tag: nextProject.tag, cover: nextProject.cover } : undefined

  return (
    <ProjectPageClient>
      <ProjectDetail project={projectContent} readmeContent={readme?.trim() ? <ProjectMarkdown value={readme} repository={project.links.github} /> : undefined} projects={content.projects.map(({ slug, name }) => ({ slug, name }))} site={content.site} socials={content.socials} nextProject={nextPreview} />
    </ProjectPageClient>
  )
}
