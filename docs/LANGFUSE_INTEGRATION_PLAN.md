# Langfuse Integration Plan for SambaTV Prompt Library

## Executive Summary

This document outlines a comprehensive integration plan for adding Langfuse's evaluation, experimentation, and observability capabilities to the SambaTV Prompt Library. Langfuse provides all the features planned for Phoenix integration but with simpler architecture and faster implementation.

## Table of Contents
1. [Why Langfuse Over Phoenix](#why-langfuse-over-phoenix)
2. [Feature Mapping: Phoenix → Langfuse](#feature-mapping-phoenix--langfuse)
3. [Playground Decision](#playground-decision)
4. [Architecture Overview](#architecture-overview)
5. [Implementation Phases](#implementation-phases)
6. [AI Product Manager Requirements](#ai-product-manager-requirements)
7. [Timeline & Effort Estimation](#timeline--effort-estimation)

## Why Langfuse Over Phoenix?

### Technical Advantages
- ✅ **Purpose-Built for LLMs** - Native prompt management, not general ML observability
- ✅ **Simpler Architecture** - Single service vs Phoenix's 4+ microservices
- ✅ **Easier Integration** - SDK-based, no complex Docker orchestration
- ✅ **Better LLM Features** - Native cost tracking, token counting, prompt versioning

### Business Advantages
- ✅ **Faster Time to Market** - 3-5 days vs 2-3 weeks
- ✅ **Lower Operational Cost** - Less infrastructure to maintain
- ✅ **Open Source** - Can self-host or use cloud
- ✅ **Active LLM Community** - Regular updates for latest models

## Feature Mapping: Phoenix → Langfuse

| Phoenix Feature | Langfuse Equivalent | Implementation Complexity |
|-----------------|-------------------|-------------------------|
| **Trace Collection** | Native tracing with spans | ✅ Simple (SDK) |
| **Evaluation Runs** | Datasets & Experiments | ✅ Simple |
| **LLM-as-Judge** | Built-in evaluators (Ragas, custom) | ✅ Simple |
| **Human Annotations** | Annotation queues with scoring | ✅ Simple |
| **A/B Testing** | Prompt versioning & experiments | ✅ Simple |
| **Real-time Updates** | Webhooks + polling | ⚠️ Different approach |
| **Analytics Dashboard** | Native analytics views | ✅ Better than Phoenix |
| **Cost Tracking** | Built-in with model pricing | ✅ Superior |
| **Custom Evaluations** | External eval pipelines | ✅ Simple |
| **Parallel Execution** | Batch API + async processing | ✅ Simple |

## Playground Decision

### Keep Your Existing Playground ✅

**Reasons:**
1. **Already Built** - Sophisticated UI with all features working
2. **Custom Features** - Variable templates, model preferences, token counting
3. **Brand Consistency** - Matches your SambaTV design system
4. **User Familiarity** - Users already know how to use it
5. **Integration Ready** - Just add Langfuse tracking to existing code

**What Langfuse Adds:**
- Trace every playground execution
- Track costs and performance
- Enable evaluation on outputs
- Connect to datasets for testing

### Integration Points
```typescript
// Your existing playground + Langfuse tracking
const trace = langfuse.trace({
  name: 'playground-execution',
  userId: session.user.id,
  metadata: { 
    promptId,
    variables: templateVariables 
  }
});

// Your existing LLM call
const response = await generateWithModel(...);

// Track in Langfuse
generation.end({
  output: response.output,
  usage: response.usage
});
```

## Architecture Overview

### Current State
```
┌─────────────────────────────────────────┐
│     SambaTV Prompt Library (Next.js)    │
├─────────────────────────────────────────┤
│ • Prompt Management                     │
│ • Playground (Keep existing)            │
│ • Custom Analytics                      │
│ • User Profiles                         │
│ • Google OAuth                          │
│ • Supabase Backend                      │
└─────────────────────────────────────────┘
```

### Future State with Langfuse
```
┌─────────────────────────────────────────────────────────┐
│              SambaTV Prompt Library + Langfuse          │
├─────────────────────────────────────────────────────────┤
│                    Application Layer                     │
│  ┌──────────────┐ ┌─────────────┐ ┌─────────────────┐ │
│  │   Existing   │ │  Langfuse   │ │      New        │ │
│  │  Playground  │ │   Traces    │ │  Evaluations    │ │
│  └──────────────┘ └─────────────┘ └─────────────────┘ │
├─────────────────────────────────────────────────────────┤
│                     Data Layer                          │
│  ┌──────────────┐ ┌─────────────┐ ┌─────────────────┐ │
│  │   Supabase   │ │  Langfuse   │ │   Shared        │ │
│  │  (Primary)   │ │   (Eval)    │ │   Analytics     │ │
│  └──────────────┘ └─────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Implementation Phases

### Phase 1: Foundation (Day 1-2)

#### 1.1 Setup & Configuration
```bash
# Already installed but needs configuration
npm install langfuse langfuse-node
```

```env
# .env.local
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_BASE_URL=https://cloud.langfuse.com
NEXT_PUBLIC_LANGFUSE_ENABLED=true
NEXT_PUBLIC_LANGFUSE_PROJECT_ID=your-project-id
```

#### 1.2 Activate Existing Integration
```typescript
// The code is already written in lib/langfuse/client.ts
// Just needs environment variables to activate
```

#### 1.3 Database Schema for Evaluations
```sql
-- Store references to Langfuse data
CREATE TABLE prompt_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID REFERENCES prompts(id),
  langfuse_dataset_id TEXT,
  langfuse_run_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  config JSONB DEFAULT '{}',
  results JSONB,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE evaluation_annotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trace_id TEXT NOT NULL, -- Langfuse trace ID
  prompt_id UUID REFERENCES prompts(id),
  annotator_id UUID REFERENCES profiles(id),
  scores JSONB NOT NULL, -- {quality: 4, relevance: 5, ...}
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_evaluations_prompt ON prompt_evaluations(prompt_id);
CREATE INDEX idx_annotations_trace ON evaluation_annotations(trace_id);
```

### Phase 2: Core Features (Day 3-5)

#### 2.1 Dataset Management
```typescript
// app/api/datasets/route.ts
import { getLangfuse } from '@/lib/langfuse/client';

export async function POST(request: Request) {
  const { name, description, items } = await request.json();
  const langfuse = getLangfuse();
  
  // Create dataset in Langfuse
  const dataset = await langfuse.createDataset({
    name,
    description,
    metadata: { createdBy: session.user.id }
  });
  
  // Add items (test cases)
  for (const item of items) {
    await langfuse.createDatasetItem({
      datasetName: dataset.name,
      input: item.input,
      expectedOutput: item.expectedOutput,
      metadata: item.metadata
    });
  }
  
  return Response.json({ datasetId: dataset.id });
}
```

#### 2.2 Evaluation Runs
```typescript
// app/api/evaluations/run/route.ts
export async function POST(request: Request) {
  const { promptId, datasetId, config } = await request.json();
  const langfuse = getLangfuse();
  
  // Get dataset items
  const dataset = await langfuse.getDataset(datasetId);
  const items = await langfuse.getDatasetItems({ datasetName: dataset.name });
  
  // Create evaluation run
  const evaluation = await supabase
    .from('prompt_evaluations')
    .insert({
      prompt_id: promptId,
      langfuse_dataset_id: datasetId,
      name: config.name,
      status: 'running',
      config
    })
    .select()
    .single();
  
  // Run evaluations in parallel
  const batchSize = 5;
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    await Promise.all(batch.map(async (item) => {
      const trace = langfuse.trace({
        name: 'evaluation-run',
        metadata: {
          evaluationId: evaluation.id,
          datasetItemId: item.id
        }
      });
      
      // Generate response
      const generation = trace.generation({
        name: 'eval-generation',
        input: item.input,
        model: config.model
      });
      
      const response = await generateWithModel({
        prompt: promptContent,
        variables: item.input,
        model: config.model
      });
      
      generation.end({
        output: response.output,
        usage: response.usage
      });
      
      // Run evaluators
      if (config.evaluators.includes('llm-judge')) {
        const score = await runLLMJudge({
          input: item.input,
          output: response.output,
          expected: item.expectedOutput
        });
        
        trace.score({
          name: 'llm-judge',
          value: score.value,
          comment: score.reasoning
        });
      }
    }));
  }
  
  // Update evaluation status
  await supabase
    .from('prompt_evaluations')
    .update({ status: 'completed' })
    .eq('id', evaluation.id);
}
```

#### 2.3 Human Annotation Queue
```typescript
// components/annotations/AnnotationQueue.tsx
export function AnnotationQueue({ promptId }: { promptId: string }) {
  const [traces, setTraces] = useState<Trace[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Fetch traces needing annotation
  useEffect(() => {
    fetchTracesForAnnotation(promptId).then(setTraces);
  }, [promptId]);
  
  const handleScore = async (scores: Record<string, number>) => {
    const trace = traces[currentIndex];
    
    // Save to database
    await fetch('/api/annotations', {
      method: 'POST',
      body: JSON.stringify({
        traceId: trace.id,
        promptId,
        scores,
        comment: annotationComment
      })
    });
    
    // Save to Langfuse
    const langfuse = getLangfuse();
    Object.entries(scores).forEach(([name, value]) => {
      langfuse.score({
        traceId: trace.id,
        name: `human-${name}`,
        value,
        comment: annotationComment
      });
    });
    
    // Move to next
    setCurrentIndex(i => i + 1);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Annotation Queue</CardTitle>
        <CardDescription>
          {currentIndex + 1} of {traces.length} traces
        </CardDescription>
      </CardHeader>
      <CardContent>
        {traces[currentIndex] && (
          <div className="space-y-4">
            <div>
              <Label>Input</Label>
              <pre className="bg-muted p-4 rounded">
                {traces[currentIndex].input}
              </pre>
            </div>
            
            <div>
              <Label>Output</Label>
              <pre className="bg-muted p-4 rounded">
                {traces[currentIndex].output}
              </pre>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <ScoreInput 
                label="Quality" 
                onChange={(v) => handleScore({ quality: v })}
              />
              <ScoreInput 
                label="Relevance" 
                onChange={(v) => handleScore({ relevance: v })}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### Phase 3: Advanced Features (Day 6-8)

#### 3.1 Trace Visualization
```typescript
// app/traces/[traceId]/page.tsx
export default function TracePage({ params }: { params: { traceId: string } }) {
  const [trace, setTrace] = useState<Trace | null>(null);
  
  useEffect(() => {
    getLangfuse().getTrace(params.traceId).then(setTrace);
  }, [params.traceId]);
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Trace Details</h1>
      
      {trace && (
        <div className="space-y-6">
          {/* Trace Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Execution Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <TraceTimeline spans={trace.spans} />
            </CardContent>
          </Card>
          
          {/* Token Usage & Costs */}
          <div className="grid grid-cols-3 gap-4">
            <MetricCard 
              title="Total Tokens" 
              value={trace.usage?.totalTokens || 0}
            />
            <MetricCard 
              title="Latency" 
              value={`${trace.latency}ms`}
            />
            <MetricCard 
              title="Cost" 
              value={`$${trace.totalCost?.toFixed(4) || 0}`}
            />
          </div>
          
          {/* Scores */}
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {trace.scores?.map(score => (
                  <div key={score.id} className="flex justify-between">
                    <span>{score.name}</span>
                    <Badge>{score.value}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
```

#### 3.2 Evaluation Dashboard
```typescript
// app/evaluations/page.tsx
export default function EvaluationsPage() {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="datasets">Datasets</TabsTrigger>
        <TabsTrigger value="runs">Evaluation Runs</TabsTrigger>
        <TabsTrigger value="annotations">Annotations</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LangfuseEmbed view="analytics" />
          <RecentEvaluations />
        </div>
      </TabsContent>
      
      <TabsContent value="datasets">
        <DatasetManager />
      </TabsContent>
      
      <TabsContent value="runs">
        <EvaluationRunsTable />
      </TabsContent>
      
      <TabsContent value="annotations">
        <AnnotationDashboard />
      </TabsContent>
    </Tabs>
  );
}
```

### Phase 4: Integration & Polish (Day 9-10)

#### 4.1 Connect Everything
- Link prompts to their evaluation results
- Add evaluation metrics to prompt cards
- Show trace counts and success rates
- Enable filtering by evaluation scores

#### 4.2 Performance Optimization
```typescript
// Use React Query for caching
const { data: traces } = useQuery({
  queryKey: ['traces', promptId],
  queryFn: () => fetchTracesForPrompt(promptId),
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Batch API calls
const batchedEvaluations = useMemo(() => 
  batchEvaluationRequests(evaluations, 10),
  [evaluations]
);
```

## AI Product Manager Requirements

### 1. Dataset Creation ✅
```typescript
// Features to implement:
- CSV/JSON import for test cases
- Manual test case creation UI
- Dataset versioning
- Shareable dataset links
- Dataset statistics dashboard
```

### 2. Parallel Evaluation Runs ✅
```typescript
// Implementation approach:
- Queue-based evaluation system
- Configurable parallelism (1-20 concurrent)
- Progress tracking with ETA
- Partial results viewing
- Automatic retry on failures
```

### 3. LLM Response Annotations ✅
```typescript
// Annotation features:
- Multi-dimensional scoring (quality, relevance, safety)
- Bulk annotation interface
- Keyboard shortcuts for speed
- Inter-annotator agreement metrics
- Export annotations as training data
```

### 4. Comprehensive Tracing ✅
```typescript
// Trace visibility:
- Full request/response capture
- Token-by-token streaming view
- Latency breakdown by component
- Error stack traces
- Trace comparison view
```

### 5. A/B Testing & Experiments ✅
```typescript
// Experimentation features:
- Prompt version comparison
- Statistical significance testing
- Automatic winner selection
- Gradual rollout capabilities
- Experiment templates
```

## Timeline & Effort Estimation

### Week 1: Core Integration (3 days)
- **Day 1**: Setup & activate existing integration
- **Day 2**: Database schema & basic API endpoints
- **Day 3**: Dataset management & evaluation runs

### Week 2: UI & Advanced Features (4 days)
- **Day 4**: Annotation interface
- **Day 5**: Trace visualization
- **Day 6**: Evaluation dashboard
- **Day 7**: Integration & testing

### Week 3: Polish & Deploy (3 days)
- **Day 8**: Performance optimization
- **Day 9**: Documentation & team training
- **Day 10**: Deploy with feature flags

## Deployment Strategy

### Phase 1: Soft Launch
```typescript
// Feature flags
if (process.env.NEXT_PUBLIC_LANGFUSE_ENABLED === 'true') {
  // Show evaluation features
}
```

### Phase 2: Gradual Rollout
- Start with power users
- Gather feedback
- Iterate on UI/UX
- Full rollout after 1 week

## Self-Hosting Option (Future)

```yaml
# docker-compose.yml for self-hosted Langfuse
version: '3.8'

services:
  langfuse:
    image: ghcr.io/langfuse/langfuse:latest
    ports:
      - "3001:3000"
    environment:
      - DATABASE_URL=${LANGFUSE_DATABASE_URL}
      - NEXTAUTH_SECRET=${LANGFUSE_AUTH_SECRET}
      - NEXTAUTH_URL=https://langfuse.sambatv.com
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=langfuse
      - POSTGRES_USER=langfuse
      - POSTGRES_PASSWORD=${LANGFUSE_DB_PASSWORD}
    volumes:
      - langfuse-postgres:/var/lib/postgresql/data

volumes:
  langfuse-postgres:
```

## Cost Analysis

### Langfuse Cloud
- Free tier: 10k observations/month
- Team: $49/month (100k observations)
- Enterprise: Custom pricing

### Self-Hosted
- Infrastructure: ~$50-100/month
- Maintenance: 2-4 hours/month
- Full data control

## Success Metrics

1. **Adoption Metrics**
   - 80% of prompts have evaluation data within 1 month
   - 50+ datasets created in first month
   - 100+ annotation tasks completed weekly

2. **Quality Metrics**
   - 25% improvement in prompt success rates
   - 50% reduction in debugging time
   - 90% user satisfaction with evaluation features

3. **Performance Metrics**
   - <100ms trace ingestion latency
   - <2s evaluation dashboard load time
   - 99.9% uptime for evaluation APIs

## Conclusion

Langfuse provides all the evaluation and observability features planned for Phoenix but with:
- **Simpler implementation** (3-10 days vs 2-3 weeks)
- **Better LLM features** (purpose-built for prompts)
- **Lower operational complexity** (single service)
- **Active community** (regular updates for new models)

The integration enhances your existing playground while adding powerful evaluation capabilities that will help your team build better prompts faster.