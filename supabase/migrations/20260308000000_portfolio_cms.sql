-- Portfolio CMS schema
create extension if not exists "pgcrypto";

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  greeting text not null default '',
  title text not null default '',
  email text not null default '',
  location text not null default '',
  stats jsonb not null default '[]'::jsonb,
  about_kicker text not null default 'About',
  about_heading text not null default '',
  about_body jsonb not null default '[]'::jsonb,
  portrait_url text not null default '/images/portrait.webp',
  updated_at timestamptz not null default now()
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  icon_key text not null default 'link',
  sort_order int not null default 0,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.skill_groups (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.skill_groups(id) on delete cascade,
  name text not null,
  icon_id text not null,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  hook text not null default '',
  cover_url text not null default '',
  tag text not null default '',
  year text not null default '',
  problem text not null default '',
  role text not null default '',
  features jsonb not null default '[]'::jsonb,
  challenges jsonb not null default '[]'::jsonb,
  architecture text,
  workflow text,
  results text,
  live_url text,
  github_url text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.project_stack (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  icon_id text not null,
  name text not null,
  sort_order int not null default 0
);

create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  url text not null,
  sort_order int not null default 0
);

create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  company text not null,
  period text not null default '',
  location text not null default '',
  stack jsonb not null default '[]'::jsonb,
  summary text not null default '',
  points jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  school text not null,
  degree text not null,
  period text not null default '',
  place text not null default '',
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null default '',
  platform text not null default '',
  date text not null default '',
  note text,
  image_url text not null default '',
  url text,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.workflow_steps (
  id uuid primary key default gen_random_uuid(),
  step text not null,
  title text not null,
  text text not null default '',
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;
alter table public.social_links enable row level security;
alter table public.skill_groups enable row level security;
alter table public.skills enable row level security;
alter table public.projects enable row level security;
alter table public.project_stack enable row level security;
alter table public.project_images enable row level security;
alter table public.experience enable row level security;
alter table public.education enable row level security;
alter table public.certifications enable row level security;
alter table public.workflow_steps enable row level security;

-- Public read
create policy "Public read site_settings" on public.site_settings for select using (true);
create policy "Public read social_links" on public.social_links for select using (true);
create policy "Public read skill_groups" on public.skill_groups for select using (true);
create policy "Public read skills" on public.skills for select using (true);
create policy "Public read published projects" on public.projects for select using (is_published = true or auth.role() = 'authenticated');
create policy "Public read project_stack" on public.project_stack for select using (true);
create policy "Public read project_images" on public.project_images for select using (true);
create policy "Public read experience" on public.experience for select using (true);
create policy "Public read education" on public.education for select using (true);
create policy "Public read certifications" on public.certifications for select using (true);
create policy "Public read workflow_steps" on public.workflow_steps for select using (true);

-- Authenticated write (admin)
create policy "Auth write site_settings" on public.site_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth write social_links" on public.social_links for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth write skill_groups" on public.skill_groups for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth write skills" on public.skills for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth write projects" on public.projects for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth write project_stack" on public.project_stack for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth write project_images" on public.project_images for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth write experience" on public.experience for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth write education" on public.education for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth write certifications" on public.certifications for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth write workflow_steps" on public.workflow_steps for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Storage buckets
insert into storage.buckets (id, name, public)
values
  ('portraits', 'portraits', true),
  ('projects', 'projects', true),
  ('certificates', 'certificates', true)
on conflict (id) do nothing;

create policy "Public read portraits" on storage.objects for select using (bucket_id = 'portraits');
create policy "Public read project media" on storage.objects for select using (bucket_id = 'projects');
create policy "Public read certificates media" on storage.objects for select using (bucket_id = 'certificates');

create policy "Auth upload portraits" on storage.objects for insert with check (bucket_id = 'portraits' and auth.role() = 'authenticated');
create policy "Auth update portraits" on storage.objects for update using (bucket_id = 'portraits' and auth.role() = 'authenticated');
create policy "Auth delete portraits" on storage.objects for delete using (bucket_id = 'portraits' and auth.role() = 'authenticated');

create policy "Auth upload projects" on storage.objects for insert with check (bucket_id = 'projects' and auth.role() = 'authenticated');
create policy "Auth update projects" on storage.objects for update using (bucket_id = 'projects' and auth.role() = 'authenticated');
create policy "Auth delete projects" on storage.objects for delete using (bucket_id = 'projects' and auth.role() = 'authenticated');

create policy "Auth upload certificates" on storage.objects for insert with check (bucket_id = 'certificates' and auth.role() = 'authenticated');
create policy "Auth update certificates" on storage.objects for update using (bucket_id = 'certificates' and auth.role() = 'authenticated');
create policy "Auth delete certificates" on storage.objects for delete using (bucket_id = 'certificates' and auth.role() = 'authenticated');
