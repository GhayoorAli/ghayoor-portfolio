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

For an existing project, also run:

[`supabase/migrations/20260912001000_technology_icons.sql`](supabase/migrations/20260912001000_technology_icons.sql)

This creates the reusable technology icon library and its public `technology-icons` Storage bucket.

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

## Import a project from a README

The new/edit project form can import project text without AI. Paste the complete README into
**Import from README**. Normal GitHub Markdown is detected from headings such as Overview, Features,
Tech Stack, Problem, Role, Challenges, Architecture, Workflow, and Results. Setup, installation,
environment, testing, contributing, and licence sections are ignored.

For exact imports across repositories, the optional structured block below is also supported:
````markdown
<!-- portfolio:start -->
```yaml
name: Project Name
slug: project-name
tag: Web application
year: "2026"
live_url: https://example.com
github_url: https://github.com/user/repository
hook: >
  A short description shown on the homepage.
problem: >
  The problem this project solves.
role: >
  Your responsibilities in the project.
features:
  - First important feature
  - Second important feature
stack:
  - Next.js
  - Laravel
challenges:
  - title: A technical challenge
    problem: >
      What was difficult.
    solution: >
      How it was solved.
results: >
  The final outcome.
architecture: |
  graph TD
    Browser --> API
    API --> Database
workflow: |
  sequenceDiagram
    User->>API: Send request
```
<!-- portfolio:end -->
````

Imported fields replace matching form values but never modify the cover or gallery. Automatic Markdown
detection reports missing fields for review. Unknown technology names are imported with a warning so
their icon can be selected manually.

## Technology icon library

In Skills, click **Choose icon** to search all built-in and uploaded icons. If an icon is missing, use
**Upload new icon** in the chooser:

- Enter the technology's proper display name.
- Upload an SVG, PNG, JPG, or WebP file no larger than 512 KB.
- Click **Upload and select**.

The icon is stored in Supabase Storage and remains available to future skills and README project-stack
imports. Name matching ignores case and punctuation, so `Supabase`, `SUPABASE`, and `supabase` resolve
to the same library entry.

## Deploy

- Frontend: Vercel (set the same env vars).
- Database / Auth / Storage: Supabase.
- After content edits in admin, paths are revalidated so the public site updates.
