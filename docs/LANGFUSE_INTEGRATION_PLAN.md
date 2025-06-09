# Langfuse Integration Plan for SambaTV Prompt Library

## Why Langfuse Over Phoenix?

- ✅ **Better UI/UX** - Clean, modern interface perfect for prompt management
- ✅ **Open Source** - Can self-host or use cloud (your choice)
- ✅ **Easier Integration** - Simple SDK, no complex Docker setup needed
- ✅ **Perfect Fit** - Built specifically for LLM apps and prompt management
- ✅ **Cost Tracking** - Beautiful cost analytics out of the box

## Integration Options

### Option 1: Cloud Langfuse (Recommended to Start)
- **Pros**: Zero setup, instant access, free tier
- **Cons**: Data on their servers (but they're SOC2 compliant)
- **Time**: 30 minutes to integrate

### Option 2: Self-Hosted Langfuse
- **Pros**: Full control, on your infrastructure
- **Cons**: Need to maintain it
- **Time**: 2-3 hours to set up

## Implementation Plan (Cloud Version First)

### Step 1: Account Setup (5 minutes)
1. Create account at https://cloud.langfuse.com/signup
2. Create a new project for "SambaTV Prompt Library"
3. Get your API keys:
   - Public Key (LANGFUSE_PUBLIC_KEY)
   - Secret Key (LANGFUSE_SECRET_KEY)

### Step 2: Install Langfuse SDK (5 minutes)
```bash
npm install langfuse langfuse-node
```

### Step 3: Environment Variables
Add to `.env.local`:
```env
# Langfuse Cloud
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_BASE_URL=https://cloud.langfuse.com

# Feature Flag
NEXT_PUBLIC_LANGFUSE_ENABLED=true
```

### Step 4: Create Langfuse Client (10 minutes)
```typescript
// lib/langfuse/client.ts
import { Langfuse } from 'langfuse';

let langfuseInstance: Langfuse | null = null;

export function getLangfuse(): Langfuse {
  if (!langfuseInstance) {
    langfuseInstance = new Langfuse({
      publicKey: process.env.LANGFUSE_PUBLIC_KEY!,
      secretKey: process.env.LANGFUSE_SECRET_KEY!,
      baseUrl: process.env.LANGFUSE_BASE_URL || 'https://cloud.langfuse.com',
      enabled: process.env.NEXT_PUBLIC_LANGFUSE_ENABLED === 'true'
    });
  }
  return langfuseInstance;
}

// Helper to flush events before serverless function ends
export async function flushLangfuse() {
  await getLangfuse().flush();
}
```

### Step 5: Integrate with Your Playground (20 minutes)
```typescript
// In your playground API route
import { getLangfuse, flushLangfuse } from '@/lib/langfuse/client';

export async function POST(request: Request) {
  const langfuse = getLangfuse();
  const { prompt, model, userId } = await request.json();
  
  // Start a trace
  const trace = langfuse.trace({
    name: 'playground-generation',
    userId,
    metadata: { promptId: prompt.id },
    tags: ['playground']
  });
  
  // Track the generation
  const generation = trace.generation({
    name: 'llm-call',
    model,
    modelParameters: { temperature: 0.7 },
    input: prompt.content,
  });
  
  try {
    // Your existing LLM call
    const response = await callLLM(prompt, model);
    
    // Track completion
    generation.end({
      output: response.text,
      usage: {
        promptTokens: response.promptTokens,
        completionTokens: response.completionTokens,
        totalCost: response.cost
      }
    });
    
    // Track success
    trace.score({
      name: 'user-feedback',
      value: 1
    });
    
    return Response.json(response);
  } catch (error) {
    generation.end({
      error: error.message
    });
    throw error;
  } finally {
    await flushLangfuse();
  }
}
```

### Step 6: Add Langfuse UI Components (30 minutes)

#### Option A: Embed Langfuse Dashboard (Fastest)
```typescript
// components/langfuse/LangfuseEmbed.tsx
export function LangfuseEmbed({ view }: { view: 'traces' | 'sessions' | 'analytics' }) {
  // Langfuse provides embeddable views with auth tokens
  const embedUrl = `https://cloud.langfuse.com/project/${PROJECT_ID}/${view}?embed=true`;
  
  return (
    <iframe
      src={embedUrl}
      className="w-full h-[800px] border-0 rounded-lg"
    />
  );
}
```

#### Option B: Use Langfuse Data in Your UI
```typescript
// lib/langfuse/analytics.ts
export async function getPromptAnalytics(promptId: string) {
  const langfuse = getLangfuse();
  
  // Fetch traces for this prompt
  const traces = await langfuse.getTraces({
    filter: {
      metadata: { promptId }
    },
    limit: 100
  });
  
  // Calculate metrics
  return {
    totalRuns: traces.length,
    avgLatency: traces.reduce((sum, t) => sum + t.latency, 0) / traces.length,
    totalCost: traces.reduce((sum, t) => sum + (t.totalCost || 0), 0),
    successRate: traces.filter(t => !t.error).length / traces.length
  };
}
```

### Step 7: Prompt Management Integration
```typescript
// When user saves a prompt, sync to Langfuse
export async function syncPromptToLangfuse(prompt: Prompt) {
  const langfuse = getLangfuse();
  
  await langfuse.createPrompt({
    name: `prompt-${prompt.id}`,
    prompt: prompt.content,
    config: {
      model: prompt.model,
      temperature: prompt.temperature
    },
    labels: ['production'],
    tags: prompt.tags
  });
}
```

## What You Get Immediately

### 1. Beautiful Traces View
- See every prompt execution
- Token usage and costs
- Latency breakdowns
- Error tracking

### 2. Analytics Dashboard
- Cost per user/prompt
- Performance metrics
- Usage trends
- Model comparison

### 3. Prompt Management
- Version control
- A/B testing
- Performance tracking
- Direct deployment

### 4. Evaluations
- User feedback collection
- LLM-as-judge
- Custom scoring
- Annotation queues

## Self-Hosted Setup (Optional Later)

If you want to self-host:

```bash
# Option 1: Docker
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  -e NEXTAUTH_SECRET=... \
  ghcr.io/langfuse/langfuse:latest

# Option 2: Docker Compose
curl -L https://raw.githubusercontent.com/langfuse/langfuse/main/docker-compose.yml > docker-compose.yml
docker-compose up
```

## Timeline

### Today (1 hour)
1. Create Langfuse account (5 min)
2. Add SDK and env vars (10 min)
3. Basic integration in playground (20 min)
4. Test trace collection (10 min)
5. View traces in Langfuse dashboard (15 min)

### Tomorrow (2 hours)
1. Add cost tracking
2. Implement prompt syncing
3. Add evaluation collection
4. Create analytics views

### Week 1
1. Full UI integration
2. Custom dashboards
3. A/B testing setup
4. Team onboarding

## Advantages Over Phoenix

1. **No Docker Required** - Just npm install
2. **Better Prompt UI** - Purpose-built for prompts
3. **Easier Integration** - Simple SDK vs complex microservices
4. **Faster Setup** - 1 hour vs 1-2 days
5. **Open Source** - Can customize if needed

## Next Steps

1. Create your Langfuse account
2. Get API keys
3. I'll implement the integration code
4. You'll have traces flowing in 30 minutes!