'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AdminSignOut } from '@/components/admin/AdminSignOut'

const nav = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/site', label: 'Site & About' },
  { href: '/admin/skills', label: 'Skills' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/experience', label: 'Experience' },
  { href: '/admin/education', label: 'Education' },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <aside className="admin-sidebar">
      <p className="admin-brand">Portfolio Admin</p>
      <nav>
        {nav.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link key={item.href} href={item.href} className={active ? 'is-active' : undefined}>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="admin-sidebar-foot">
        <Link href="/" target="_blank">
          View site
        </Link>
        <AdminSignOut />
      </div>
    </aside>
  )
}
