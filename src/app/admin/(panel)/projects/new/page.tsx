import { ProjectAdminForm } from '@/components/admin/ProjectAdminForm'
import { getTechnologyIcons } from '@/lib/content'

export default async function NewProjectPage() {
  const icons = await getTechnologyIcons()
  return <ProjectAdminForm initial={null} initialIcons={icons} />
}
