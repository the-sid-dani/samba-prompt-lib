-- Drop the incorrect foreign key constraint
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Add the correct foreign key constraint to next_auth.users
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_id_fkey 
FOREIGN KEY (id) 
REFERENCES next_auth.users(id) 
ON DELETE CASCADE;

-- Now run the backfill again
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