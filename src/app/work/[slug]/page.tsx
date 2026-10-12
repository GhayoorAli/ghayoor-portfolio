import { notFound } from 'next/navigation'
import { ProjectDetail } from '@/components/ProjectDetail'
import { ProjectPageClient } from '@/components/ProjectPageClient'
import { getPortfolioContent, getProjectBySlug } from '@/lib/content'

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
  const [project, content] = await Promise.all([getProjectBySlug(slug), getPortfolioContent()])
  if (!project) notFound()

  const index = content.projects.findIndex(item => item.slug === project.slug)
  const nextProject = content.projects.length > 1 ? content.projects[(index + 1) % content.projects.length] : undefined

  return (
    <ProjectPageClient>
      <ProjectDetail project={project} site={content.site} socials={content.socials} nextProject={nextProject} />
    </ProjectPageClient>
  )
}
