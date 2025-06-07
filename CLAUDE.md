# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a SambaTV Internal Prompt Library built with Next.js 15, using App Router architecture. It's a platform for SambaTV employees to discover, create, share, and test AI prompts.

Key features include:
- Authentication via Google OAuth for SambaTV enterprise accounts
- Prompt management (create, browse, search, filter)
- Playground for testing prompts with various AI models
- User profiles and prompt tracking
- Responsive design for all devices

## Development Commands

```bash
# Install dependencies
npm install

# Run development server with Turbopack
npm run dev

# Build for production
npm run build

# Run production server
npm run start

# Lint code
npm run lint

# Type check (inferred from tsconfig.json)
tsc --noEmit
```

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Model API Keys
GOOGLE_GEMINI_API_KEY=your-gemini-key
ANTHROPIC_API_KEY=your-anthropic-key
OPENROUTER_API_KEY=your-openrouter-key
```

## Architecture

### Frontend Architecture

- **App Router**: Uses Next.js 15 App Router for routing and rendering
- **UI Components**: Leverages shadcn/ui with Tailwind CSS for styling
- **Authentication**: Uses NextAuth with Google OAuth, restricted to SambaTV domains
- **State Management**: Server-side data fetching with Next.js cache mechanisms

### Backend Architecture

- **API Routes**: Implemented in the `/app/api` directory with route handlers
- **Database**: Supabase (PostgreSQL) for data storage
- **Authentication**: NextAuth integrated with Supabase for user management
- **Error Handling**: Comprehensive error handling system with custom error classes
- **Caching**: Sophisticated cache management with tag-based invalidation

### Database Schema

The application uses the following main tables in Supabase:
- `users` - User profiles (integrated with NextAuth)
- `prompts` - AI prompt templates
- `prompt_versions` - Version history for prompts
- `prompt_forks` - Forked prompts tracking
- `user_favorites` - User's favorite prompts
- `categories` - Prompt categories
- `tags` - Prompt tags

### API Structure

The API follows REST conventions:
- `GET /api/prompts` - List prompts with pagination, filtering, and sorting
- `POST /api/prompts` - Create a new prompt
- `GET /api/prompts/[id]` - Get a specific prompt
- `PUT /api/prompts/[id]` - Update a prompt
- `DELETE /api/prompts/[id]` - Delete a prompt

All API routes include:
- Error handling with proper status codes
- Rate limiting
- Authentication/authorization checks
- Cache management
- Input validation with Zod schemas

## Caching Strategy

The application implements a sophisticated caching strategy:
- **Tag-based invalidation**: Related cached data is invalidated when needed
- **Time-based revalidation**: Different data types have different cache times
- **Targeted revalidation**: Only affected caches are invalidated for performance

Tags are defined in `lib/cache.ts` and used throughout the application.

## Authentication Flow

1. User signs in with Google OAuth (restricted to SambaTV domain)
2. NextAuth creates a session and JWT
3. The session includes a Supabase access token
4. API routes use this token to authenticate with Supabase
5. Authorization is checked for protected operations

## Code Organization

- `/app`: Next.js App Router pages and layouts
- `/app/api`: API route handlers
- `/app/actions`: Server actions
- `/components`: React components
- `/lib`: Utility functions and configuration
- `/utils`: Helper functions
- `/hooks`: Custom React hooks
- `/types`: TypeScript type definitions
- `/public`: Static assets

## Working with the Codebase

When making changes:
1. Understand the caching implications (see `lib/cache.ts`)
2. Follow proper error handling patterns (see `lib/error-handling.ts`)
3. Implement proper validation with Zod schemas
4. Add appropriate rate limiting for new API endpoints
5. Ensure authentication/authorization is checked for protected operations