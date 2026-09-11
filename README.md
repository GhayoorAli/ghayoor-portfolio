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
