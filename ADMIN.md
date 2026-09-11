# Admin + Supabase setup

This portfolio is a **Next.js App Router** app with an optional **Supabase** CMS.

## 1. Create a Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. Copy **Project URL**, **anon public** key, and **service_role** key from Project Settings → API.

## 2. Configure env

```bash
cp .env.example .env.local
```

Fill in:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (seed script only — never expose in the browser)

## 3. Run the SQL migration

In the Supabase SQL editor, paste and run:

[`supabase/migrations/20260308000000_portfolio_cms.sql`](supabase/migrations/20260308000000_portfolio_cms.sql)

This creates tables, RLS policies, and public Storage buckets: `portraits`, `projects`, `certificates`.

## 4. Create an admin user

Authentication → Users → Add user (email + password).  
Use that account at `/admin/login`.

## 5. Seed current portfolio content

```bash
npm run seed
```

Loads site, skills, projects (MeetMe, Meridian, …), experience, education, certs, and workflow from the local seed in `src/data/site.ts`.

## 6. Run the app

```bash
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

Without Supabase env vars, the public site still works from **local seed data**; admin login shows a setup message until env is configured.

## Deploy

- Frontend: Vercel (set the same env vars).
- Database / Auth / Storage: Supabase.
- After content edits in admin, paths are revalidated so the public site updates.
