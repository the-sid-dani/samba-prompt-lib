-- Fix Profiles Table References from auth.users to next_auth.users

-- 1. Drop the existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON next_auth.users;

-- 2. Drop the existing function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Recreate the function with correct reference to next_auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, username)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.name, split_part(new.email, '@', 1)),
    split_part(new.email, '@', 1)  -- Always use email prefix for username
  );
  RETURN new;
END;
$$;

-- 4. Create the trigger on the correct table (next_auth.users)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON next_auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. Fix the policies - the update policy might have auth.uid() instead of next_auth.uid()
DO $$
BEGIN
  -- Drop and recreate the update policy to ensure it uses next_auth.uid()
  DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
  
  CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (next_auth.uid() = id);
  
  -- Check if select policy exists before creating
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Profiles are viewable by everyone'
  ) THEN
    CREATE POLICY "Profiles are viewable by everyone"
      ON public.profiles FOR SELECT
      USING (true);
  END IF;
END $$;

-- 6. Verify everything is set up correctly
SELECT 
  'Trigger exists on next_auth.users' as check_item,
  EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE event_object_schema = 'next_auth' 
    AND event_object_table = 'users'
    AND trigger_name = 'on_auth_user_created'
  ) as status;

-- Show current profiles
SELECT id, email, name, username FROM public.profiles LIMIT 5; 