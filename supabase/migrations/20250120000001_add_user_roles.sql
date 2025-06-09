-- Add role column to profiles table
-- This migration adds a role column to store user roles persistently

-- Add role column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN role text NOT NULL DEFAULT 'member' 
CHECK (role IN ('admin', 'member'));

-- Update existing users to have admin role if they have @samba.tv email
UPDATE public.profiles 
SET role = 'admin' 
WHERE email LIKE '%@samba.tv';

-- Create index for role column for better query performance
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- Add comment
COMMENT ON COLUMN public.profiles.role IS 'User role: admin or member. Admins have full access, members have limited access.'; 