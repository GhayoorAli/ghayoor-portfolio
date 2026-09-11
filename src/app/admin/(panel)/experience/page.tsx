import { ExperienceAdminForm } from '@/components/admin/ExperienceAdminForm'
import { getPortfolioContent } from '@/lib/content'

export default async function AdminExperiencePage() {
  const content = await getPortfolioContent()
  return <ExperienceAdminForm initial={content.experience} />
}
