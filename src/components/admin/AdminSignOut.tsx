'use client'

import { useRouter } from 'next/navigation'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'

export function AdminSignOut() {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={async () => {
        if (!isSupabaseConfigured()) {
          router.push('/admin/login')
          return
        }
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/admin/login')
        router.refresh()
      }}
    >
      Sign out
    </button>
  )
}
