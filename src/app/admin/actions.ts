'use server'

import { revalidatePath } from 'next/cache'

export async function revalidatePortfolio() {
  revalidatePath('/')
  revalidatePath('/work', 'layout')
  revalidatePath('/admin', 'layout')
}


export async function saveProjectOrder(ids: string[]) {
  if (!ids.length || new Set(ids).size !== ids.length || ids.some(id => !/^[a-f0-9-]{36}$/i.test(id))) {
    throw new Error('Invalid project order.')
  }
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Sign in to reorder projects.')
  const { error } = await supabase.rpc('reorder_projects', { project_ids: ids })
  if (error) throw new Error(error.message)
  await revalidatePortfolio()
}

export async function saveFAQs(input: unknown) {
  const { validateFAQs } = await import('@/lib/faq-content')
  const faqs = validateFAQs(input)
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Sign in to save FAQs.')

  const { data: settings, error: loadError } = await supabase.from('site_settings').select('id').limit(1).single()
  if (loadError || !settings) throw new Error('Save your Site & About settings before adding FAQs.')
  const { error } = await supabase.from('site_settings')
    .update({ faqs, updated_at: new Date().toISOString() }).eq('id', settings.id).select('id').single()
  if (error) {
    if (error.code === 'PGRST204' || error.code === '42703') {
      throw new Error('FAQ storage is not set up yet. Run the FAQ migration from ADMIN.md, then try again.')
    }
    throw new Error(error.message)
  }
  await revalidatePortfolio()
}
