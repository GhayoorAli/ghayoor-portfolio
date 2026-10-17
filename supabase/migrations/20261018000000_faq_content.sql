-- Store the ordered FAQ list atomically alongside the existing site settings.
-- NULL preserves the current default questions until the first admin save.
-- An empty array intentionally removes all questions.
-- The existing site_settings RLS policies allow public reads and authenticated writes.
alter table public.site_settings
  add column if not exists faqs jsonb
  check (faqs is null or jsonb_typeof(faqs) = 'array');
