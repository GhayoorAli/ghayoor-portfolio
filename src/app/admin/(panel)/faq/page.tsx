import { FAQAdminForm } from '@/components/admin/FAQAdminForm'
import { getPortfolioContent } from '@/lib/content'

export default async function AdminFAQPage() {
  const content = await getPortfolioContent()
  return <FAQAdminForm initialFAQs={content.faqs} />
}
