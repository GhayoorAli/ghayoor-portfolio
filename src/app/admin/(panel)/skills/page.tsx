import { SkillsAdminForm } from '@/components/admin/SkillsAdminForm'
import { getPortfolioContent, getTechnologyIcons } from '@/lib/content'

export default async function AdminSkillsPage() {
  const [content, icons] = await Promise.all([getPortfolioContent(), getTechnologyIcons()])
  return <SkillsAdminForm initialGroups={content.skillGroups} initialIcons={icons} />
}
