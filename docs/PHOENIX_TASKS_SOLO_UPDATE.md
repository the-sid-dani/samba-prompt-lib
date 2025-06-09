# Phoenix Tasks - Solo Developer Updates

## Overview
This document contains simplified versions of Phoenix tasks (32-46) optimized for solo development. These maintain full feature parity while being achievable in 2-3 weeks.

## Updated Tasks

### Task 32: Phoenix Docker Setup (4-6 hours)
```json
{
  "id": 32,
  "title": "Phoenix Docker Setup - Solo Dev Edition",
  "description": "Get Phoenix running locally in Docker with minimal configuration for rapid integration.",
  "details": "1. Create docker-compose.yml:\n   ```yaml\n   version: '3.8'\n   services:\n     phoenix:\n       image: arizephoenix/phoenix:latest\n       ports:\n         - '6006:6006'\n       environment:\n         - PHOENIX_SECRET_KEY=${PHOENIX_SECRET_KEY}\n         - PHOENIX_DATABASE_URL=postgresql://phoenix:phoenix@postgres:5432/phoenix\n       volumes:\n         - phoenix-data:/data\n     postgres:\n       image: postgres:15-alpine\n       environment:\n         - POSTGRES_PASSWORD=phoenix\n         - POSTGRES_DB=phoenix\n     redis:\n       image: redis:7-alpine\n   ```\n\n2. Add to .env.local:\n   - PHOENIX_SECRET_KEY=generate-random-key\n   - PHOENIX_URL=http://localhost:6006\n\n3. Run: docker-compose up -d\n\n4. Verify Phoenix is running at http://localhost:6006",
  "mvpApproach": "Use Phoenix's Docker image as-is, no custom builds needed",
  "timeEstimate": "4-6 hours",
  "testStrategy": "Access http://localhost:6006 and verify Phoenix UI loads",
  "status": "pending",
  "dependencies": [29, 30],
  "priority": "high"
}
```

### Task 33: Simple Auth Bridge (2-4 hours)
```json
{
  "id": 33,
  "title": "Phoenix Auth Bridge - Simple JWT",
  "description": "Create a minimal authentication bridge that converts NextAuth sessions to Phoenix JWTs.",
  "details": "1. Create lib/phoenix/auth.ts:\n   ```typescript\n   import jwt from 'jsonwebtoken';\n   import { Session } from 'next-auth';\n   \n   export function getPhoenixToken(session: Session): string {\n     return jwt.sign(\n       {\n         sub: session.user.id,\n         email: session.user.email,\n         name: session.user.name,\n         exp: Math.floor(Date.now() / 1000) + 3600\n       },\n       process.env.PHOENIX_SECRET_KEY!\n     );\n   }\n   ```\n\n2. That's it! Use this token in Phoenix API calls.",
  "mvpApproach": "Skip complex RBAC, just pass user info to Phoenix",
  "timeEstimate": "2-4 hours",
  "testStrategy": "Generate token and decode it to verify contents",
  "status": "pending",
  "dependencies": [32],
  "priority": "high"
}
```

### Task 34: Phoenix Database Tables (1-2 hours)
```json
{
  "id": 34,
  "title": "Phoenix Integration Tables - Minimal Schema",
  "description": "Add only the essential tables needed to link Phoenix data with your prompts.",
  "details": "1. Create migration:\n   ```sql\n   -- Just store Phoenix references\n   CREATE TABLE prompt_evaluations (\n     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n     prompt_id UUID REFERENCES prompts(id),\n     phoenix_eval_id TEXT UNIQUE,\n     created_at TIMESTAMPTZ DEFAULT NOW()\n   );\n   \n   CREATE TABLE prompt_traces (\n     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n     prompt_id UUID REFERENCES prompts(id),\n     phoenix_trace_id TEXT UNIQUE,\n     created_at TIMESTAMPTZ DEFAULT NOW()\n   );\n   ```\n\n2. Run migration in Supabase",
  "mvpApproach": "Store only Phoenix IDs, let Phoenix handle all data storage",
  "timeEstimate": "1-2 hours",
  "testStrategy": "Insert test records and verify foreign keys work",
  "status": "pending",
  "dependencies": [32],
  "priority": "medium"
}
```

### Task 35: Simple API Proxy (4-6 hours)
```json
{
  "id": 35,
  "title": "Phoenix API Proxy - REST Only",
  "description": "Create a simple API proxy that forwards requests to Phoenix with authentication.",
  "details": "1. Create app/api/phoenix/[...path]/route.ts:\n   ```typescript\n   export async function handler(req: NextRequest) {\n     const session = await getServerSession();\n     if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });\n     \n     const phoenixToken = getPhoenixToken(session);\n     const path = req.nextUrl.pathname.replace('/api/phoenix/', '');\n     \n     const response = await fetch(`${process.env.PHOENIX_URL}/api/${path}`, {\n       method: req.method,\n       headers: {\n         'Authorization': `Bearer ${phoenixToken}`,\n         'Content-Type': 'application/json'\n       },\n       body: req.body\n     });\n     \n     return NextResponse.json(await response.json());\n   }\n   ```\n\n2. Test with: fetch('/api/phoenix/evaluations')",
  "mvpApproach": "Simple REST proxy, skip GraphQL complexity",
  "timeEstimate": "4-6 hours",
  "testStrategy": "Make API calls through proxy and verify responses",
  "status": "pending",
  "dependencies": [33],
  "priority": "high"
}
```

### Task 36-37: Phoenix UI Integration (1-2 days)
```json
{
  "id": 36,
  "title": "Phoenix UI Integration - Iframe First",
  "description": "Embed Phoenix UI using iframes for instant full functionality, then progressively enhance.",
  "details": "1. Create components/phoenix/PhoenixEmbed.tsx:\n   ```typescript\n   export function PhoenixEmbed({ view, promptId }: Props) {\n     const { data: session } = useSession();\n     const token = getPhoenixToken(session);\n     const phoenixUrl = `${process.env.NEXT_PUBLIC_PHOENIX_URL}/${view}?token=${token}&promptId=${promptId}`;\n     \n     return (\n       <div className=\"relative w-full h-[600px] rounded-lg overflow-hidden\">\n         <iframe\n           src={phoenixUrl}\n           className=\"absolute inset-0 w-full h-full border-0\"\n           sandbox=\"allow-same-origin allow-scripts\"\n         />\n       </div>\n     );\n   }\n   ```\n\n2. Add to pages:\n   - /evaluations: <PhoenixEmbed view=\"evaluations\" />\n   - /traces: <PhoenixEmbed view=\"traces\" />\n   - /playground: Add trace panel with <PhoenixEmbed view=\"trace\" promptId={id} />\n\n3. Phase 2 (optional): Replace iframes with Phoenix React components",
  "mvpApproach": "Start with iframes for full features immediately",
  "timeEstimate": "1-2 days",
  "testStrategy": "Verify all Phoenix features work through iframes",
  "status": "pending",
  "dependencies": [35],
  "priority": "high",
  "combinedWith": [37]
}
```

### Task 38: Basic WebSocket Connection (2-4 hours)
```json
{
  "id": 38,
  "title": "Phoenix WebSocket - Simple Integration",
  "description": "Connect to Phoenix WebSocket for real-time updates using their existing implementation.",
  "details": "1. Create lib/phoenix/websocket.ts:\n   ```typescript\n   import { io } from 'socket.io-client';\n   \n   export function connectPhoenix(session: Session) {\n     const token = getPhoenixToken(session);\n     const socket = io(process.env.NEXT_PUBLIC_PHOENIX_WS_URL!, {\n       auth: { token }\n     });\n     \n     socket.on('evaluation:update', (data) => {\n       // Update your UI or trigger refetch\n       console.log('Evaluation updated:', data);\n     });\n     \n     return socket;\n   }\n   ```\n\n2. Use in components that need real-time updates",
  "mvpApproach": "Use Phoenix's WebSocket as-is, just connect and listen",
  "timeEstimate": "2-4 hours",
  "testStrategy": "Trigger Phoenix events and verify updates received",
  "status": "pending",
  "dependencies": [35],
  "priority": "medium"
}
```

### Task 39-40: Combined Analytics & Experiments (1 day)
```json
{
  "id": 39,
  "title": "Phoenix Analytics & Experiments - Embedded Views",
  "description": "Add Phoenix analytics and experimentation features using embedded views.",
  "details": "1. Add new routes:\n   - app/analytics/page.tsx: <PhoenixEmbed view=\"analytics\" />\n   - app/experiments/page.tsx: <PhoenixEmbed view=\"experiments\" />\n\n2. Update navigation to include new menu items\n\n3. Optional: Add quick stats to homepage using Phoenix API:\n   ```typescript\n   const stats = await fetch('/api/phoenix/stats').then(r => r.json());\n   ```",
  "mvpApproach": "Embed Phoenix views directly, customize later if needed",
  "timeEstimate": "1 day",
  "testStrategy": "Navigate to new pages and verify Phoenix features work",
  "status": "pending",
  "dependencies": [36],
  "priority": "medium",
  "combinedWith": [40]
}
```

### Task 41-42: Performance & Testing (4-6 hours)
```json
{
  "id": 41,
  "title": "Phoenix Performance & Basic Testing",
  "description": "Add basic performance optimizations and smoke tests for Phoenix integration.",
  "details": "1. Performance:\n   - Add lazy loading for Phoenix embeds\n   - Cache Phoenix tokens for 1 hour\n   - Add loading skeletons\n\n2. Basic tests:\n   - Phoenix service is running\n   - Auth token generation works\n   - API proxy returns data\n   - UI embeds load correctly",
  "mvpApproach": "Focus on perceived performance, skip complex optimizations",
  "timeEstimate": "4-6 hours",
  "testStrategy": "Manual testing + basic integration tests",
  "status": "pending",
  "dependencies": [39],
  "priority": "medium",
  "combinedWith": [42]
}
```

### Task 43-46: Deploy & Document (1 day)
```json
{
  "id": 43,
  "title": "Phoenix Deployment & Quick Docs",
  "description": "Deploy Phoenix integration behind a feature flag and create minimal documentation.",
  "details": "1. Add feature flag:\n   ```typescript\n   export const PHOENIX_ENABLED = process.env.NEXT_PUBLIC_PHOENIX_ENABLED === 'true';\n   ```\n\n2. Update Docker deployment:\n   - Add Phoenix services to production docker-compose\n   - Set environment variables\n\n3. Create quick docs:\n   - How to access Phoenix features\n   - Basic troubleshooting\n   - Feature flag control\n\n4. Deploy with feature flag OFF\n\n5. Test with select users\n\n6. Enable for all users when ready",
  "mvpApproach": "Ship behind feature flag, iterate based on feedback",
  "timeEstimate": "1 day",
  "testStrategy": "Test with feature flag on/off, verify no impact when off",
  "status": "pending",
  "dependencies": [41],
  "priority": "high",
  "combinedWith": [44, 45, 46]
}
```

## Summary of Changes

### What We Simplified:
1. **Docker Setup**: Use Phoenix's image as-is (6 hours → 30 minutes)
2. **Auth**: Simple JWT conversion (2 days → 2 hours)
3. **Database**: Minimal linking tables (1 day → 1 hour)
4. **API**: REST proxy only (2 days → 4 hours)
5. **UI**: Iframe first, enhance later (1 week → 1 day)
6. **Testing**: Smoke tests only (1 week → included in tasks)
7. **Deployment**: Feature flag approach (1 week → 1 day)

### What We Kept:
- ✅ All Phoenix features (evaluations, traces, experiments)
- ✅ Real-time updates
- ✅ Full analytics capabilities
- ✅ Same user experience

### New Timeline:
- **Week 1**: Tasks 32-37 (Core integration)
- **Week 2**: Tasks 38-43 (Polish and deploy)
- **Week 3**: Buffer for issues and enhancement

### Combined Tasks:
- Tasks 36 & 37 → Single UI integration task
- Tasks 39 & 40 → Single analytics/experiments task
- Tasks 41 & 42 → Single performance/testing task
- Tasks 43-46 → Single deployment task

This approach gets you to production in 2 weeks with full Phoenix features!