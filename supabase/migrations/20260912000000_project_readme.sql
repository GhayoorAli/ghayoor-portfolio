alter table public.projects
  add column if not exists readme text not null default '';
