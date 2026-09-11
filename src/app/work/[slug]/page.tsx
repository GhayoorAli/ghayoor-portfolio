import { notFound } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
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

  const brand = content.site.name.split(' ').filter(Boolean).slice(-1)[0] || content.site.name

  return (
    <ProjectPageClient>
      <Navbar brand={brand} email={content.site.email} socials={content.socials} />
      <ProjectDetail project={project} />
      <Footer name={content.site.name} email={content.site.email} socials={content.socials} />
    </ProjectPageClient>
  )
}
