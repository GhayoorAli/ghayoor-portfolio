import { ExperienceAdminForm } from '@/components/admin/ExperienceAdminForm'
import { getFallbackContent } from '@/lib/fallback-content'
import { getPortfolioContent } from '@/lib/content'

export default async function AdminExperiencePage() {
  const content = await getPortfolioContent()
  return <ExperienceAdminForm initial={content.experience} profiles={getFallbackContent().experience} />
}
