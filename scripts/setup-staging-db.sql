-- Staging Database Setup Script
-- Run this script in your Supabase staging project SQL editor

-- Note: This script assumes you have already created the staging Supabase project
-- and have access to the SQL editor in the Supabase dashboard

-- 1. Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create tables (copy from production schema)
-- You should copy the exact schema from your production database
-- This can be done by:
-- 1. Going to your production Supabase project
-- 2. Navigate to Settings > Database
-- 3. Copy the schema SQL
-- 4. Paste it here

-- Example placeholder - replace with your actual schema:
-- CREATE TABLE IF NOT EXISTS profiles (
--   id UUID REFERENCES auth.users ON DELETE CASCADE,
--   email TEXT,
--   full_name TEXT,
--   avatar_url TEXT,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   PRIMARY KEY (id)
-- );

-- 3. Set up Row Level Security (RLS)
-- Copy all RLS policies from production

-- 4. Insert test data for staging
-- Add sample data for testing purposes

-- Example test data:
-- INSERT INTO categories (name, description) VALUES
--   ('Test Category 1', 'Sample category for testing'),
--   ('Test Category 2', 'Another sample category');

-- 5. Create staging-specific configurations
-- Add any staging-specific settings or data

-- Note: Remember to:
-- 1. Never copy production user data to staging
-- 2. Use anonymized test data only
-- 3. Set up appropriate RLS policies
-- 4. Test all functionality after setup 