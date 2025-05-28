# SambaTV Prompt Library Database Setup

## Overview

This directory contains SQL scripts for setting up the SambaTV Prompt Library database in Supabase.

## Files

- `sambatv_prompt_library_tables_2025-05-28T17.sql` - Main schema file with all additional tables
- `nextauth_schema.sql` - NextAuth schema required for authentication
- `0-supabase-sql.md` (in prompt directory) - Original prompt table schema

## Database Architecture

### Core Tables
- **prompt** - Main prompt storage (already exists)
- **categories** - Prompt categorization by department/use case
- **tags** - Flexible tagging system
- **prompt_tags** - Many-to-many relationship between prompts and tags

### Version Control & Collaboration
- **prompt_versions** - Automatic version history tracking
- **prompt_forks** - Track derivative prompts
- **prompt_improvements** - Suggestion and review workflow

### User Engagement
- **user_favorites** - Personal prompt collections
- **prompt_comments** - Discussion threads with nested replies
- **prompt_votes** - Quality rating system

### Analytics & Testing
- **playground_sessions** - AI model testing logs
- **user_interactions** - Usage analytics (views, copies, etc.)

## Authentication Integration

The application uses NextAuth.js with Supabase integration. User authentication is handled through:

1. **NextAuth Provider**: Google OAuth configured for @samba.tv domain
2. **Supabase Auth Functions**: Uses `auth.uid()` to get current user ID
3. **User Table**: NextAuth automatically manages the users table in Supabase

### Important Notes:
- The `users` table is managed by NextAuth and Supabase Auth
- All tables reference user IDs using `uuid` type matching `auth.uid()`
- Row Level Security (RLS) policies use `auth.uid()` for access control

## Setup Instructions

1. **Create Supabase Project**
   - Go to https://supabase.com and create a new project
   - Note your project URL and API keys

2. **Configure Environment Variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SECRET_KEY=your-service-role-key
   SUPABASE_JWT_SECRET=your-jwt-secret
   ```

3. **Run Database Migrations**
   - Open Supabase SQL Editor
   
   **IMPORTANT: Run these in order:**
   
   a. **First, run the NextAuth schema** (required for authentication):
   ```sql
   -- Copy and run the contents of nextauth_schema.sql
   ```
   
   b. **Enable the next_auth schema in API Settings**:
   - Go to Settings → API in your Supabase dashboard
   - Add `next_auth` to the "Exposed schemas" list
   - This allows NextAuth to access the schema
   
   c. **Then, ensure the prompt table exists** (run the SQL from 0-supabase-sql.md if needed)
   
   d. **Finally, run the main schema** from `sambatv_prompt_library_tables_2025-05-28T17.sql`

4. **Verify Setup**
   - Check that all tables are created
   - Verify RLS policies are enabled
   - Test with a sample query
   - Ensure `next_auth` schema is exposed in API settings

## Security Model

- **Row Level Security (RLS)** is enabled on all tables
- **Public Read Access**: Most content is readable by all authenticated users
- **User-Specific Write Access**: Users can only modify their own content
- **Private Data**: Favorites and playground sessions are private to each user

## Database Triggers

The system includes automatic triggers for:
- Vote count updates when users vote
- Usage tracking when prompts are copied or tested
- Version history creation when prompts are edited

## Default Data

The setup includes:
- 10 default categories aligned with SambaTV departments
- 10 common tags for AI models and use cases

## Maintenance

- Database types are automatically generated using Supabase CLI
- Run `npx supabase gen types typescript` to update TypeScript types
- The `stripe_customers` table reference in types should remain commented out 

## Troubleshooting

### AdapterError when signing in
If you get an AdapterError after OAuth authentication:
1. Ensure you've run the `nextauth_schema.sql` script
2. Verify `next_auth` schema is exposed in API settings
3. Check that your service role key is correctly set in `.env.local`
4. Restart your development server after making changes 