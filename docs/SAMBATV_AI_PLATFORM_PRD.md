# Product Requirements Document: SambaTV AI Platform (Powered by Langfuse)

## Executive Summary

This PRD outlines our strategy to fork and deploy Langfuse as a white-labeled "SambaTV AI Platform" that provides comprehensive LLM observability, evaluation, and experimentation capabilities. By forking Langfuse's open-source codebase, we get ALL features immediately (playground, traces, evaluations, datasets, experiments, analytics) with minimal customization needed. This approach delivers a production-ready platform in 1-2 days instead of weeks of integration work.

## Table of Contents
1. [Strategic Decision](#strategic-decision)
2. [What We Get](#what-we-get)
3. [User Stories](#user-stories)
4. [Technical Approach](#technical-approach)
5. [White-Label Requirements](#white-label-requirements)
6. [Integration Points](#integration-points)
7. [Deployment Strategy](#deployment-strategy)
8. [Success Metrics](#success-metrics)
9. [Timeline & Resources](#timeline--resources)

## Strategic Decision

### Why Fork Instead of Integrate?

**Traditional Integration Approach**:
- 3-4 weeks of development
- Cherry-pick features one by one
- Build custom UI components
- Maintain integration code forever
- Risk of bugs and edge cases

**Fork & Deploy Approach**:
- 1-2 days to production
- Get 100% of features immediately
- Battle-tested code from day one
- Benefit from upstream updates
- Full control over customization

## What We Get

### Complete Feature Set - Day One

**Playground Features**:
- Advanced prompt editor with syntax highlighting
- Structured output support (JSON mode)
- Function/tool calling interface
- Streaming support
- Multi-turn conversations
- Variable templating
- Model comparison

**Observability Features**:
- Full request/response tracing
- Latency breakdown by component
- Token usage tracking
- Cost calculation per request
- Error tracking and debugging
- Session grouping
- User journey mapping

**Evaluation Features**:
- 20+ pre-built LLM evaluators
- Human annotation queues
- Custom scoring dimensions
- Dataset management
- A/B testing framework
- Statistical significance testing
- Evaluation scheduling

**Analytics Features**:
- Real-time dashboards
- Cost analysis by model/user/prompt
- Performance trends
- Success rate tracking
- Custom metrics
- Export capabilities

## User Stories

### Unchanged User Experience
1. **As a current user**, I can continue using the prompt library exactly as before
2. **As a prompt creator**, I see a new "Test in AI Platform" button that opens advanced testing
3. **As an evaluator**, I access powerful new tools without learning a new system
4. **As an admin**, I get comprehensive analytics without custom development

### New Capabilities
1. **I can** trace every LLM call with full visibility
2. **I can** run automated evaluations on prompt variations
3. **I can** annotate outputs to build quality datasets
4. **I can** compare models side-by-side with identical inputs
5. **I can** track costs down to individual users and prompts
6. **I can** export data for custom analysis

## Technical Approach

### 1. Fork Strategy

```bash
# Step 1: Fork Langfuse repository
git clone https://github.com/langfuse/langfuse.git sambatv-ai-platform

# Step 2: Create our customization branch
git checkout -b sambatv-customizations

# Step 3: Set up upstream for future updates
git remote add upstream https://github.com/langfuse/langfuse.git
```

### 2. Core Customizations

**Branding**:
- Replace Langfuse logo with SambaTV logo
- Update color scheme to match our brand
- Change app name throughout the codebase
- Update favicon and meta tags

**Authentication**:
- Configure Google OAuth with our credentials
- Restrict to @samba.tv domain
- Share session with main prompt library

**Model Configuration**:
- Add our API keys for Anthropic, Google, OpenRouter
- Configure model pricing
- Set up model routing through our existing APIs

### 3. Minimal Code Changes

```typescript
// 1. Update branding (packages/web/src/constants.ts)
export const APP_NAME = "SambaTV AI Platform";
export const APP_DOMAIN = "ai.sambatv.com";

// 2. Configure models (packages/shared/src/server/models.ts)
export const MODEL_DEFINITIONS = {
  ...existingModels,
  // Add our specific models if needed
};

// 3. Update theme (packages/web/src/styles/theme.ts)
export const theme = {
  colors: {
    primary: '#E50914', // SambaTV red
    ...defaultColors
  }
};
```

### 4. Database Strategy

**Option 1: Separate Databases (Recommended)**
- Langfuse uses its own Postgres database
- Link to our prompts via API calls
- Clean separation of concerns

**Option 2: Shared Database**
- Point Langfuse to our Supabase
- Requires schema modifications
- More complex but unified data

## White-Label Requirements

### Visual Customization

```css
/* Main brand colors */
:root {
  --primary: #E50914;        /* SambaTV Red */
  --primary-hover: #C50813;  /* Darker red */
  --background: #000000;     /* Black */
  --foreground: #FFFFFF;     /* White */
  --muted: #1A1A1A;         /* Dark gray */
}

/* Logo replacement */
.logo {
  background-image: url('/sambatv-logo.svg');
}
```

### Configuration Changes

```env
# Environment variables
NEXT_PUBLIC_APP_NAME="SambaTV AI Platform"
NEXT_PUBLIC_APP_DESCRIPTION="Internal LLM evaluation and testing platform"

# Auth configuration
AUTH_GOOGLE_CLIENT_ID=our-existing-client-id
AUTH_GOOGLE_CLIENT_SECRET=our-existing-secret
AUTH_GOOGLE_ALLOWED_DOMAINS=samba.tv

# Model API keys
ANTHROPIC_API_KEY=our-anthropic-key
GOOGLE_GEMINI_API_KEY=our-google-key
OPENROUTER_API_KEY=our-openrouter-key
```

## Integration Points

### 1. From Prompt Library to AI Platform

```typescript
// In our existing prompt library
// components/prompt-card.tsx
<Button
  variant="outline"
  onClick={() => {
    // Open in new tab with prompt pre-loaded
    const params = new URLSearchParams({
      prompt: prompt.content,
      promptId: prompt.id,
      model: userPreferences.model || 'claude-3-5-sonnet'
    });
    window.open(`https://ai.sambatv.com/playground?${params}`);
  }}
>
  <ExternalLink className="w-4 h-4 mr-2" />
  Test in AI Platform
</Button>
```

### 2. Shared Authentication

```typescript
// Both apps use same Google OAuth
// User logs in once, works everywhere
const session = await getServerSession(authOptions);
if (session?.user?.email?.endsWith('@samba.tv')) {
  // Authorized user
}
```

### 3. Cross-Platform Data Access

```typescript
// API endpoint in Langfuse to get evaluation data
// GET /api/public/evaluations?promptId=123
export async function getPromptEvaluations(promptId: string) {
  const traces = await prisma.trace.findMany({
    where: { 
      metadata: {
        path: ['promptId'],
        equals: promptId
      }
    },
    include: { scores: true }
  });
  return traces;
}
```

## Deployment Strategy

### 1. Infrastructure Setup

```yaml
# docker-compose.yml
version: '3.8'

services:
  langfuse:
    build: .
    environment:
      - DATABASE_URL=postgresql://langfuse:password@postgres:5432/langfuse
      - NEXTAUTH_URL=https://ai.sambatv.com
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    ports:
      - "3001:3000"
    
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_USER=langfuse
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=langfuse
    volumes:
      - langfuse-data:/var/lib/postgresql/data

volumes:
  langfuse-data:
```

### 2. Domain Configuration

```nginx
# Subdomain approach (recommended)
ai.sambatv.com → Langfuse deployment
prompts.sambatv.com → Existing prompt library

# OR Subfolder approach
sambatv.com/prompts → Existing library
sambatv.com/ai → Langfuse platform
```

### 3. Deployment Options

**Option A: Vercel (Easiest)**
- Fork includes Vercel configuration
- One-click deploy
- Automatic SSL
- Built-in CDN

**Option B: Docker + Cloud Run**
- More control
- Better for enterprise
- Can run on-premise

**Option C: Kubernetes**
- Full scalability
- Complex but powerful
- Best for large teams

## Success Metrics

### Adoption Metrics (Week 1)
- 100% platform availability
- 50%+ of team using AI platform
- 100+ traces collected
- 10+ evaluation runs completed

### Quality Metrics (Month 1)
- 25% reduction in prompt debugging time
- 50% increase in prompt version testing
- 90% user satisfaction score
- 30% improvement in prompt quality scores

### Business Metrics (Quarter 1)
- 20% reduction in AI costs through optimization
- 40% faster prompt development cycle
- 100% traceability for compliance
- 5x increase in prompt reusability

### Technical Metrics
- < 100ms added latency from tracing
- < 2s page load times
- 99.9% uptime
- < 1% error rate

## Timeline & Resources

### Day 1: Fork and Deploy (6-8 hours with Claude)

**Morning (3-4 hours)**:
1. Fork Langfuse repository ✓
2. Set up local development ✓
3. Configure environment variables ✓
4. Update branding and colors ✓
5. Configure authentication ✓

**Afternoon (3-4 hours)**:
1. Deploy to staging environment ✓
2. Test all features ✓
3. Configure production domain ✓
4. Deploy to production ✓
5. Basic smoke tests ✓

### Day 2: Integration and Polish (4-6 hours)

**Morning (2-3 hours)**:
1. Add integration buttons to prompt library ✓
2. Configure cross-domain authentication ✓
3. Set up API endpoints for data sharing ✓
4. Test end-to-end workflows ✓

**Afternoon (2-3 hours)**:
1. Team training session ✓
2. Documentation updates ✓
3. Monitor initial usage ✓
4. Address any issues ✓

### Resources Needed

**Technical**:
- Access to Langfuse GitHub repo (public)
- Deployment infrastructure (Vercel/Docker)
- SSL certificate for ai.sambatv.com
- PostgreSQL database for Langfuse

**Human**:
- 1 Developer (you + Claude)
- 1 DevOps for deployment help
- Team training time (1 hour)

## Maintenance & Updates

### Keeping Up with Upstream

```bash
# Quarterly update process
# 1. Fetch upstream changes
git fetch upstream
git checkout main
git merge upstream/main

# 2. Resolve conflicts (minimal due to clean separation)
# 3. Test thoroughly
# 4. Deploy update
```

### What We Maintain
- Brand customizations (CSS, logos)
- Environment configuration
- Custom API integrations
- Cross-platform features

### What Langfuse Maintains
- Core functionality
- Bug fixes
- New features
- Security updates
- Performance improvements

## Future Enhancements

### Phase 2: Advanced Customization (Month 2)
- Custom evaluation templates for SambaTV use cases
- Integration with our data pipeline
- Custom dashboards for executives
- Automated prompt deployment pipeline

### Phase 3: Platform Extensions (Quarter 2)
- Connect to production trace data
- Real-time monitoring alerts
- Cost optimization recommendations
- Prompt marketplace for sharing

### Long-term Vision
- Become the central hub for all AI/LLM work at SambaTV
- Expand to other teams and use cases
- Build custom features on top of Langfuse
- Contribute improvements back to open source

## Conclusion

By forking Langfuse instead of building integrations, we can deliver a comprehensive AI platform in 1-2 days that would otherwise take months to build. The platform will be branded as SambaTV's, fully integrated with our existing systems, and provide immediate value to our prompt engineering team.

### Key Benefits
1. **Speed**: 1-2 days vs weeks/months
2. **Completeness**: 100% of features, not just selected ones
3. **Reliability**: Battle-tested by thousands of teams
4. **Maintainability**: Benefit from upstream updates
5. **Flexibility**: Full control to customize as needed

### Next Steps
1. Approve the fork-and-deploy approach
2. Set up infrastructure (domain, database, deployment)
3. Execute the 2-day implementation plan
4. Launch to the team with training
5. Iterate based on feedback

This approach gives us the best of both worlds: the power of an enterprise-grade LLM platform with the flexibility of our own customizations, all delivered at the speed of a hackathon project.