import { notFound } from 'next/navigation'
import { ProjectAdminForm } from '@/components/admin/ProjectAdminForm'
import { getAllProjectsAdmin, getTechnologyIcons } from '@/lib/content'

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [projects, icons] = await Promise.all([getAllProjectsAdmin(), getTechnologyIcons()])
  const project = projects.find((item) => item.id === id)
  if (!project) notFound()
  return <ProjectAdminForm initial={project} initialIcons={icons} />
}
