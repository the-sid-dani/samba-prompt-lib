create table public.prompt (
  id integer generated always as identity primary key,
  title text not null,
  description text not null,
  content text not null,
  featured boolean not null default false,
  uses integer not null default 0,
  votes integer not null default 0,
  tags text[] not null default '{}',
  user_id uuid not null default auth.uid(),
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

comment on table public.prompt is 'Contains AI prompts for the SambaTV Internal Prompt Library with details such as title, description, full content, featured flag, usage stats, vote count, and associated tags. Each prompt is linked to its creator via user_id. The table tracks creation and update timestamps to help manage prompt history and modifications.';

alter table public.prompt enable row level security;

create policy "Select prompt policy" on public.prompt
  as permissive for select
  to anon, authenticated
  using (true);

create policy "Insert prompt policy" on public.prompt
  as permissive for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Update prompt policy" on public.prompt
  as permissive for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Delete prompt policy" on public.prompt
  as permissive for delete
  to authenticated
  using (auth.uid() = user_id);