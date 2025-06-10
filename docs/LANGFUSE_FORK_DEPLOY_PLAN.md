# Langfuse Fork & Deploy Plan for SambaTV Prompt Library

## Executive Summary

This document outlines a rapid fork-and-deploy strategy for integrating ALL of Langfuse's features into the SambaTV Prompt Library. Instead of building integrations, we'll fork Langfuse's open-source codebase, white-label it with minimal changes, and deploy it as part of our platform. This approach gives us their entire feature set in 1-2 days instead of weeks.

## Table of Contents
1. [Why Fork Langfuse](#why-fork-langfuse)
2. [Features We Get for Free](#features-we-get-for-free)
3. [Fork & Deploy Strategy](#fork--deploy-strategy)
4. [White-Label Customization](#white-label-customization)
5. [Database Integration](#database-integration)
6. [Implementation Steps](#implementation-steps)
7. [Timeline: 1-2 Days](#timeline-1-2-days)

## Why Fork Langfuse?

### Instant Features
- ✅ **Complete Platform** - Get ALL features immediately, not just selected ones
- ✅ **Open Source** - Fork and modify freely under MIT license
- ✅ **Production Ready** - Battle-tested by thousands of teams
- ✅ **White-Label Ready** - Designed to be customizable

### Fork vs Integration Benefits
- ✅ **1-2 Days** vs weeks of integration work
- ✅ **100% Features** vs cherry-picking capabilities
- ✅ **Full Control** - Modify anything we need
- ✅ **Easy Updates** - Pull upstream changes when needed

## Features We Get for Free

### Complete Feature Set - Day 1
| Feature | What We Get |
|---------|-------------|
| **Playground** | Advanced prompt testing with structured outputs, tools, streaming |
| **Tracing** | Full observability for every LLM call with timeline views |
| **Evaluations** | LLM-as-judge with 20+ built-in evaluators |
| **Human Annotation** | Queue management with custom scoring dimensions |
| **Datasets** | Test case management with import/export |
| **Experiments** | A/B testing with statistical significance |
| **Analytics** | Cost tracking, latency analysis, success rates |
| **Prompt Management** | Versioning, tagging, search |
| **Sessions** | Group related traces for user journeys |
| **Scores** | Custom metrics and KPIs |
| **Users & Projects** | Multi-tenant support built-in |
| **API Access** | Full REST API for everything |

## Fork & Deploy Strategy

### What We'll Do

1. **Fork Langfuse Repository**
   ```bash
   git clone https://github.com/langfuse/langfuse.git sambatv-langfuse
   cd sambatv-langfuse
   ```

2. **Connect to Our Infrastructure**
   - Point to our existing Supabase database
   - Use our Google OAuth for authentication
   - Route LLM calls through our existing APIs

3. **White-Label Customization**
   - Replace Langfuse branding with SambaTV
   - Update color scheme to match our design
   - Remove features we don't need (if any)
   - Add our custom model connections

4. **Deploy as Part of Our App**
   - Run as a separate service on same domain
   - Share authentication with main app
   - Unified navigation between systems

## White-Label Customization

### Minimal Changes Needed

```typescript
// 1. Update branding in packages/web/src/styles/globals.css
:root {
  --primary-color: #E50914; // SambaTV red
  --logo-url: '/sambatv-logo.png';
}

// 2. Update app name in packages/web/src/constants.ts
export const APP_NAME = 'SambaTV AI Platform';
export const APP_DESCRIPTION = 'Internal prompt engineering and evaluation';

// 3. Configure our model providers in packages/shared/src/server/models.ts
export const MODEL_PROVIDERS = {
  anthropic: { apiKey: process.env.ANTHROPIC_API_KEY },
  google: { apiKey: process.env.GOOGLE_API_KEY },
  openrouter: { apiKey: process.env.OPENROUTER_API_KEY }
};

// 4. Update auth to use our Google OAuth
// Already supports Google OAuth - just configure!
```

### What Stays the Same
- All functionality remains intact
- Database schema works as-is
- API endpoints unchanged
- UI components just restyled

## Database Integration

### Approach: Dual Database with Cross-Links

```mermaid
graph LR
    A[SambaTV Supabase] <--> B[Langfuse Postgres]
    A --> C[prompts table]
    A --> D[users table]
    B --> E[traces table]
    B --> F[scores table]
    C -.->|prompt_id reference| E
    D -.->|user_id reference| E
```

### Simple Linking Tables
```sql
-- In our Supabase, just add one table
CREATE TABLE prompt_traces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id INTEGER REFERENCES prompts(id),
  langfuse_trace_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- That's it! Langfuse handles everything else
```

### Environment Configuration
```env
# Langfuse will use its own database
DATABASE_URL=postgresql://user:pass@localhost:5432/langfuse

# But shares our auth
NEXTAUTH_URL=https://prompts.sambatv.com
AUTH_GOOGLE_CLIENT_ID=our-existing-google-oauth
AUTH_GOOGLE_CLIENT_SECRET=our-existing-secret
AUTH_GOOGLE_ALLOWED_DOMAINS=samba.tv
```

## Implementation Steps

### Hour 1-2: Fork and Setup
```bash
# 1. Fork the repository
git clone https://github.com/langfuse/langfuse.git sambatv-ai-platform
cd sambatv-ai-platform

# 2. Install dependencies
pnpm install

# 3. Set up environment
cp .env.example .env.local
# Edit with our credentials
```

### Hour 3-4: White-Label Changes
```bash
# Quick branding updates
# 1. Replace logo files
cp /path/to/sambatv-logo.png packages/web/public/logo.png

# 2. Update theme colors
sed -i 's/#0EA5E9/#E50914/g' packages/web/src/styles/globals.css

# 3. Update app name
sed -i 's/Langfuse/SambaTV AI Platform/g' packages/web/src/constants.ts
```

### Hour 5-6: Connect Our APIs
```typescript
// packages/shared/src/server/llm-api-keys.ts
// Add our model configurations
export const modelProviders = {
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    models: ['claude-3-5-sonnet', 'claude-3-opus', 'claude-3-haiku']
  },
  google: {
    apiKey: process.env.GOOGLE_GEMINI_API_KEY,
    models: ['gemini-1.5-pro', 'gemini-1.5-flash']
  },
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    models: ['gpt-4o', 'llama-3.1-70b', 'mixtral-8x7b']
  }
};
```

### Hour 7-8: Integration Points
```typescript
// 1. Add navigation link from our app to Langfuse
// In our Next.js app navigation
<Link href="https://ai.sambatv.com" target="_blank">
  AI Platform →
</Link>

// 2. Share auth session
// Langfuse already supports Google OAuth
// Just configure with same credentials

// 3. Link prompts to traces
// When user clicks "Test in Playground" 
const testInPlayground = (promptId: number) => {
  window.location.href = `https://ai.sambatv.com/playground?promptId=${promptId}`;
};
```

### Hour 9-10: Deploy
```bash
# Using Docker Compose
docker-compose up -d

# Or deploy to Vercel
vercel --prod

# Configure subdomain
# ai.sambatv.com → Langfuse instance
# prompts.sambatv.com → Existing app
```

### Final Configuration
```nginx
# Nginx config for unified domain
server {
  server_name prompts.sambatv.com;
  
  location / {
    proxy_pass http://localhost:3000; # Existing app
  }
  
  location /ai {
    proxy_pass http://localhost:3001; # Langfuse
  }
}
```

## Timeline: 1-2 Days

### Day 1 (With Claude)
- **Morning (2-3 hours)**
  - Fork repository ✓
  - Set up development environment ✓
  - Configure environment variables ✓
  - Test locally ✓

- **Afternoon (3-4 hours)**
  - White-label branding ✓
  - Configure authentication ✓
  - Connect our API keys ✓
  - Test all features ✓

### Day 2 (If needed)
- **Morning (2-3 hours)**
  - Deploy to production ✓
  - Configure domain/subdomain ✓
  - Set up monitoring ✓
  
- **Afternoon (2-3 hours)**
  - Team training ✓
  - Documentation ✓
  - Go live! 🚀

## What About Our Existing Code?

### Keep What Works
- **Prompt Library**: Stays exactly as is
- **User Management**: Keep using our Supabase profiles
- **Categories/Tags**: No changes needed
- **Search/Filter**: Works perfectly

### Small Integration Points
```typescript
// 1. Add "Open in AI Platform" button
// In components/prompt-card.tsx
<Button 
  variant="outline"
  onClick={() => window.open(`https://ai.sambatv.com/playground?prompt=${encodeURIComponent(prompt.content)}`)}
>
  Test in AI Platform →
</Button>

// 2. Show evaluation scores from Langfuse
// Quick API call to get scores
const scores = await fetch(`https://ai.sambatv.com/api/public/scores?promptId=${prompt.id}`);

// 3. That's it! Everything else is in Langfuse
```

## Benefits of This Approach

### Immediate Value
1. **Day 1 Features**: Everything works immediately
2. **No Integration Bugs**: Using proven, tested code
3. **Future Updates**: Pull from upstream when new features ship
4. **Community Support**: Benefit from Langfuse community

### Long-term Advantages
1. **Maintenance**: Langfuse team maintains core functionality
2. **Scalability**: Already handles millions of traces
3. **Flexibility**: Can modify anything since we own the fork
4. **Exit Strategy**: Data is portable if we need to change

## Next Steps

1. **Get approval** for the fork-and-deploy approach
2. **Fork Langfuse** repository
3. **Execute Day 1** plan with Claude
4. **Deploy** to production
5. **Train team** and iterate

This approach gives us a complete LLM platform in 1-2 days instead of weeks of custom development!