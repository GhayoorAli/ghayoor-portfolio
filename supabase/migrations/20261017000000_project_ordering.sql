-- Persist the complete order in one transaction, using the caller's existing RLS permissions.
create or replace function public.reorder_projects(project_ids uuid[])
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;
  lock table public.projects in share row exclusive mode;
  if cardinality(project_ids) <> (select count(*) from public.projects)
     or (select count(distinct id) from unnest(project_ids) as ids(id)) <> cardinality(project_ids)
     or exists (select 1 from unnest(project_ids) as ids(id)
                where not exists (select 1 from public.projects p where p.id = ids.id)) then
    raise exception 'The project list changed. Reload this page before saving the order.';
  end if;
  update public.projects p
  set sort_order = ordered.position - 1, updated_at = now()
  from unnest(project_ids) with ordinality as ordered(id, position)
  where p.id = ordered.id;
end;
$$;
revoke all on function public.reorder_projects(uuid[]) from public;
grant execute on function public.reorder_projects(uuid[]) to authenticated;
