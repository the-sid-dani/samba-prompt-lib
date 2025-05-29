-- First, let's check what users exist in next_auth schema
SELECT id, email, name, "emailVerified" 
FROM next_auth.users 
LIMIT 10;

-- Manual backfill for existing users from next_auth
-- This will create profile entries for all next_auth.users that don't have profiles yet
INSERT INTO public.profiles (id, email, name, username, created_at, updated_at)
SELECT 
  u.id,
  u.email,
  COALESCE(
    u.name,
    split_part(u.email, '@', 1)
  ) as name,
  split_part(u.email, '@', 1) as username,
  CURRENT_TIMESTAMP as created_at,
  CURRENT_TIMESTAMP as updated_at
FROM next_auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
);

-- Verify the profiles were created
SELECT * FROM public.profiles; 