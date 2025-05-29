-- Update the username field to be the email prefix (part before @)
UPDATE public.profiles
SET username = split_part(email, '@', 1)
WHERE email IS NOT NULL;

-- Verify the update
SELECT id, email, name, username FROM public.profiles; 