-- Create public profiles table
create table if not exists public.profiles (
  id uuid primary key references next_auth.users(id) on delete cascade,
  email text,
  name text,
  username text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
-- Allow users to view all profiles (for displaying author names)
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

-- Allow users to update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Create a trigger to create a profile entry when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, username)
  values (
    new.id,
    new.email,
    coalesce(new.name, split_part(new.email, '@', 1)),
    split_part(new.email, '@', 1)  -- Always use email prefix for username
  );
  return new;
end;
$$;

-- Trigger the function every time a user is created
create or replace trigger on_auth_user_created
  after insert on next_auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill existing users
insert into public.profiles (id, email, name, username)
select 
  id,
  email,
  coalesce(name, split_part(email, '@', 1)),
  split_part(email, '@', 1)  -- Always use email prefix for username
from next_auth.users
on conflict (id) do nothing;

-- Create an index for better performance
create index idx_profiles_id on public.profiles(id); 