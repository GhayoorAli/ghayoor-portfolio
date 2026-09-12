-- Reusable technology icon library for skills and project stacks.
create table if not exists public.technology_icons (
  key text primary key check (key ~ '^[a-z0-9]+$'),
  name text not null,
  icon_url text not null,
  is_builtin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists technology_icons_name_ci_idx
  on public.technology_icons (lower(name));

alter table public.technology_icons enable row level security;

create policy "Public read technology_icons"
  on public.technology_icons for select using (true);
create policy "Auth write technology_icons"
  on public.technology_icons for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

insert into public.technology_icons (key, name, icon_url, is_builtin)
values
  ('php', 'PHP', '/icons/php.svg', true),
  ('laravel', 'Laravel', '/icons/laravel.svg', true),
  ('symfony', 'Symfony', '/icons/symfony.svg', true),
  ('magento', 'Magento 2', '/icons/magento.svg', true),
  ('wordpress', 'WordPress', '/icons/wordpress.svg', true),
  ('nodejs', 'Node.js', '/icons/nodejs.svg', true),
  ('javascript', 'JavaScript', '/icons/javascript.svg', true),
  ('typescript', 'TypeScript', '/icons/typescript.svg', true),
  ('react', 'React', '/icons/react.svg', true),
  ('nextjs', 'Next.js', '/icons/nextjs.svg', true),
  ('vue', 'Vue.js', '/icons/vue.svg', true),
  ('html', 'HTML', '/icons/html.svg', true),
  ('css', 'CSS', '/icons/css.svg', true),
  ('bootstrap', 'Bootstrap', '/icons/bootstrap.svg', true),
  ('tailwindcss', 'Tailwind CSS', '/icons/tailwindcss.svg', true),
  ('framermotion', 'Framer Motion', '/icons/framermotion.svg', true),
  ('sass', 'Sass', '/icons/sass.svg', true),
  ('mysql', 'MySQL', '/icons/mysql.svg', true),
  ('mariadb', 'MariaDB', '/icons/mariadb.svg', true),
  ('postgresql', 'PostgreSQL', '/icons/postgresql.svg', true),
  ('mongodb', 'MongoDB', '/icons/mongodb.svg', true),
  ('redis', 'Redis', '/icons/redis.svg', true),
  ('supabase', 'Supabase', '/icons/supabase.svg', true),
  ('restapi', 'REST API', '/icons/restapi.svg', true),
  ('json', 'JSON', '/icons/json.svg', true),
  ('xml', 'XML', '/icons/xml.svg', true),
  ('yaml', 'YAML', '/icons/yaml.svg', true),
  ('aws', 'AWS', '/icons/aws.svg', true),
  ('docker', 'Docker', '/icons/docker.svg', true),
  ('vercel', 'Vercel', '/icons/vercel.svg', true),
  ('linux', 'Linux', '/icons/linux.svg', true),
  ('windows', 'Windows', '/icons/windows.svg', true),
  ('pest', 'Pest', '/icons/pest.svg', true),
  ('postman', 'Postman', '/icons/postman.svg', true),
  ('github', 'Git / GitHub', '/icons/github.svg', true),
  ('composer', 'Composer', '/icons/composer.svg', true),
  ('jira', 'Jira', '/icons/jira.svg', true),
  ('slack', 'Slack', '/icons/slack.svg', true),
  ('figma', 'Figma', '/icons/figma.svg', true),
  ('phpstorm', 'PHPStorm', '/icons/phpstorm.svg', true),
  ('vscode', 'VS Code', '/icons/vscode.svg', true),
  ('cursor', 'Cursor', '/icons/cursor.svg', true),
  ('claude', 'Claude Code', '/icons/claude.svg', true)
on conflict (key) do update
set
  name = excluded.name,
  icon_url = excluded.icon_url,
  is_builtin = true,
  updated_at = now();

insert into storage.buckets (id, name, public)
values ('technology-icons', 'technology-icons', true)
on conflict (id) do update set public = true;

create policy "Public read technology icon media"
  on storage.objects for select
  using (bucket_id = 'technology-icons');
create policy "Auth upload technology icon media"
  on storage.objects for insert
  with check (bucket_id = 'technology-icons' and auth.role() = 'authenticated');
create policy "Auth update technology icon media"
  on storage.objects for update
  using (bucket_id = 'technology-icons' and auth.role() = 'authenticated');
create policy "Auth delete technology icon media"
  on storage.objects for delete
  using (bucket_id = 'technology-icons' and auth.role() = 'authenticated');
