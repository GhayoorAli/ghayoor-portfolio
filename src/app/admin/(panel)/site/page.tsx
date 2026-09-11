import { SiteAdminForm } from '@/components/admin/SiteAdminForm'
import { getPortfolioContent, supabaseReady } from '@/lib/content'
import { createClient } from '@/lib/supabase/server'

export default async function AdminSitePage() {
  const content = await getPortfolioContent()
  let settingsId: string | null = null
  let socials = content.socials

  if (supabaseReady()) {
    const supabase = await createClient()
    const { data } = await supabase.from('site_settings').select('id').limit(1).maybeSingle()
    settingsId = data?.id ?? null
    const { data: socialRows } = await supabase.from('social_links').select('*').order('sort_order')
    if (socialRows) {
      socials = socialRows.map((row) => ({
        id: row.id,
        label: row.label,
        url: row.url,
        icon_key: row.icon_key,
        sort_order: row.sort_order,
        is_active: row.is_active,
      }))
    }
  }

  return <SiteAdminForm initialSite={content.site} initialSocials={socials} settingsId={settingsId} />
}
