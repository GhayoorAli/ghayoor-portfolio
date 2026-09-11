import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
      // Allow admin UI to load and show setup/login messaging without env.
      return response
    }
    return response
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request: { headers: request.headers } })
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isAdmin = path.startsWith('/admin')
  const isLogin = path.startsWith('/admin/login')

  if (isAdmin && !isLogin && !user) {
    const redirect = request.nextUrl.clone()
    redirect.pathname = '/admin/login'
    return NextResponse.redirect(redirect)
  }

  if (isLogin && user) {
    const redirect = request.nextUrl.clone()
    redirect.pathname = '/admin'
    return NextResponse.redirect(redirect)
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
