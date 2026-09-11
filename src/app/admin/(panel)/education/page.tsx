import { EducationAdminForm } from '@/components/admin/EducationAdminForm'
import { getPortfolioContent } from '@/lib/content'

export default async function AdminEducationPage() {
  const content = await getPortfolioContent()
  return (
    <EducationAdminForm
      initialEducation={content.education}
      initialCertifications={content.certifications}
    />
  )
}
