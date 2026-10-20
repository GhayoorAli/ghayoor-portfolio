# Muhammad Ghayoor Ali — Portfolio

Next.js portfolio with an optional Supabase admin CMS (PostgreSQL + Storage).

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without Supabase env vars, the site uses seeded content from `src/data/site.ts`.

## Admin CMS

See [ADMIN.md](ADMIN.md) for Supabase setup, migrations, seeding, and `/admin` login.

## Scripts

| Command | Purpose |
|--------|---------|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run seed` | Seed Supabase from local fallback data |
| `npm run lint` | Oxlint |

## Customize without Supabase

Edit `src/data/site.ts` (seed / offline fallback). Styles live in `src/app/globals.css`.

## Mobile regression audit

After `npm run build` and `npm start`, run `npm run audit:mobile`. The audit checks seven viewport sizes, every published project at three mobile sizes, navigation, dialogs, FAQs, galleries, idle animation work, and repeated cold loads with a throttled connection and CPU. Chrome must be installed; set `AUDIT_BROWSER` to another installed Playwright browser channel if needed. Screenshots and JSON results go to `/tmp/portfolio-mobile-audit`.

For Safari engine coverage, run `npx playwright install webkit`, then `AUDIT_ENGINE=webkit npm run audit:mobile` (layout and interaction checks; CPU/network emulation uses Chromium).

Set `AUDIT_URL` to test another server, `AUDIT_COMPARE_URL` for cold-load comparisons, or `AUDIT_LAYOUT_ONLY=1` to rerun layout checks after a CSS change. Lab timings depend on the machine and connection; they are not field Core Web Vitals.
