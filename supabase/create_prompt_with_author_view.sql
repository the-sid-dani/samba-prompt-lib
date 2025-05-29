-- Create a view that joins prompts with user information
create or replace view public.prompts_with_authors as
select 
  p.*,
  u.email as author_email,
  coalesce(u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)) as author_name
from 
  public.prompt p
  left join auth.users u on p.user_id = u.id;

-- Grant select permission on the view
grant select on public.prompts_with_authors to authenticated, anon; 