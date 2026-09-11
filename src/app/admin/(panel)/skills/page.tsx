import { SkillsAdminForm } from '@/components/admin/SkillsAdminForm'
import { getPortfolioContent } from '@/lib/content'

export default async function AdminSkillsPage() {
  const content = await getPortfolioContent()
  return <SkillsAdminForm initialGroups={content.skillGroups} />
}
