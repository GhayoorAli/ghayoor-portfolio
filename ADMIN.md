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

For an existing project, also run these migrations in order:

- [`20260912000000_project_readme.sql`](supabase/migrations/20260912000000_project_readme.sql) adds full README storage.
- [`20260912001000_technology_icons.sql`](supabase/migrations/20260912001000_technology_icons.sql) creates the reusable uploaded icon library and its Storage bucket.
- [`20261017000000_project_ordering.sql`](supabase/migrations/20261017000000_project_ordering.sql) adds the authenticated, transactional project-order action.

- [`20261018000000_faq_content.sql`](supabase/migrations/20261018000000_faq_content.sql) adds editable FAQ storage to site settings.

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

## Reorder projects

On **Admin → Projects**, drag a project's grip or use its up/down arrows, then click **Save order**.
The work grid, project-page sidebar, and next-project links use the saved order. Drafts remain in the admin list but are
omitted from the public portfolio. New projects are appended to the end.

Order changes save as one transaction. If another session adds or removes a project, reload the list
before saving again. Run the ordering migration above before using this feature.

## Project README

Paste the complete README into the project editor. The public project page displays all its content in
its original order, with no required headings. The **Preview** tab uses the same renderer as the public
page. Supported content includes:

- Arbitrary headings, paragraphs, nested and numbered lists, checklists, and blockquotes.
- GitHub-style tables, links, images/badges, code blocks, and collapsible details.
- Mermaid diagrams in fenced `mermaid` blocks; invalid diagrams fall back to readable source.

Wide tables and code scroll within their containers on small screens. Safe embedded HTML is supported;
scripts and event handlers are stripped. GitHub-relative image and document paths resolve using the
project's GitHub repository URL and its default branch. Custom GitHub components and executable code
are not rendered. Projects without a README retain their existing case-study layout.

## Technology icons

The shared chooser includes roughly 4,000 packaged icons from [Devicon](https://github.com/devicons/devicon)
(MIT) and [Simple Icons](https://github.com/simple-icons/simple-icons) (CC0), in addition to existing local
and uploaded icons. Icons are served by the app, so visitors do not need a third-party icon service.
Not every technology has an icon; custom uploads remain available.

For new projects, technologies are detected from README text, lists, and tables. A technology/stack
section improves matching, but is optional. Review the **Technologies** section, correct matches with
**Choose icon**, or use **Add technology**. **Detect from README** replaces manual selections with a
fresh detection. Existing projects preserve their saved selections until you run detection again.

Skills uses the same searchable chooser. You can select any bundled icon directly without downloading
or uploading files. Custom uploads still accept SVG, PNG, JPG, and WebP up to 512 KB and are reusable
across Skills and projects.

After upgrading either icon package, regenerate the searchable catalogue:

```bash
npm run icons:generate
```

## Validation

```bash
npm test
npm run build
```

## Deploy

- Frontend: Vercel (set the same env vars).
- Database / Auth / Storage: Supabase.
- After content edits in admin, paths are revalidated so the public site updates.

## Manage FAQs

Open **Admin → FAQ** to edit existing questions and answers, add new entries, remove entries,
or change their order with the up/down arrows. Click **Save changes** to update the public FAQ.
Answers support multiple paragraphs. Removing every question and saving hides the FAQ section.

Run the FAQ migration above once before saving. Existing questions remain visible until your first save.
FAQ saves update only the FAQ list, preserving your other site settings. The list is saved in one
atomic update using the existing authenticated site-settings permissions.
