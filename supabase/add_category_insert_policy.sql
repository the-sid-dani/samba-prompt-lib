-- Add RLS policy to allow authenticated users to create categories
create policy "Authenticated users can create categories" on public.categories
  as permissive for insert
  to authenticated
  with check (true);

-- Note: We might want to restrict this to certain users or add validation in the future 