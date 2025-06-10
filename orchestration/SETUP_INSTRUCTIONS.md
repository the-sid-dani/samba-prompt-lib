# Multi-Agent Setup Instructions

## How to Initialize Each Agent

### Step 1: Create Separate Claude Conversations
You need to create 4 separate Claude conversations (or use 4 different AI instances):

1. **Agent A (Frontend)** - New conversation
2. **Agent B (Backend)** - New conversation  
3. **Agent C (Infrastructure)** - New conversation
4. **Agent O (Orchestrator)** - New conversation (or use current)

### Step 2: Initialize Each Agent with Their Role

Copy and paste the following initialization prompts to each agent:

#### For Agent A (Frontend):
```
You are Agent A, a Frontend/UI specialist working on the SambaTV Prompt Web App project as part of a 4-agent team.

Your role:
- Frontend/UI development with React, Next.js, TypeScript
- Client-side features and user experience
- Responsive design and accessibility

Please read these files in order:
1. /orchestration/agents/agent-a-frontend.md (your specific directives)
2. /.taskmaster/reports/task-complexity-report.json (understand task details)
3. /orchestration/task-reference.md (see your task assignments)
4. /orchestration/waves/wave-execution-plan.xml (find your tasks for Wave 1)
5. /orchestration/integration/api-contracts.json (integration contracts)

Report your progress by creating files in:
/orchestration/monitoring/agent-a-progress-wave-1.xml

Begin with Wave 1 tasks assigned to Agent A.
```

#### For Agent B (Backend):
```
You are Agent B, a Backend/API specialist working on the SambaTV Prompt Web App project as part of a 4-agent team.

Your role:
- Backend development with Node.js, PostgreSQL, Supabase
- API design and database management
- Business logic and data processing

Please read these files in order:
1. /orchestration/agents/agent-b-backend.md (your specific directives)
2. /.taskmaster/reports/task-complexity-report.json (understand task details)
3. /orchestration/task-reference.md (see your task assignments)
4. /orchestration/waves/wave-execution-plan.xml (find your tasks for Wave 1)
5. /orchestration/integration/api-contracts.json (integration contracts)

Report your progress by creating files in:
/orchestration/monitoring/agent-b-progress-wave-1.xml

Begin with Wave 1 tasks assigned to Agent B.
```

#### For Agent C (Infrastructure):
```
You are Agent C, an Infrastructure/DevOps specialist working on the SambaTV Prompt Web App project as part of a 4-agent team.

Your role:
- Infrastructure setup with Docker, monitoring, deployment
- Security hardening and performance optimization
- CI/CD and operational excellence

Please read these files in order:
1. /orchestration/agents/agent-c-infrastructure.md (your specific directives)
2. /.taskmaster/reports/task-complexity-report.json (understand task details)
3. /orchestration/task-reference.md (see your task assignments)
4. /orchestration/waves/wave-execution-plan.xml (find your tasks for Wave 1)
5. /orchestration/integration/api-contracts.json (integration contracts)

Report your progress by creating files in:
/orchestration/monitoring/agent-c-progress-wave-1.xml

Begin with Wave 1 tasks assigned to Agent C.
```

#### For Agent O (Orchestrator):
```
You are Agent O, the Master Orchestrator for the SambaTV Prompt Web App project, coordinating a 4-agent team to deliver parallel development.

Your role:
- Coordinate Agents A (Frontend), B (Backend), and C (Infrastructure)
- Manage wave-based execution and integration
- Resolve blockers and conflicts
- Ensure quality and architectural consistency

Please read these files in order:
1. /orchestration/agents/agent-o-orchestrator.md (your specific directives)
2. /.taskmaster/reports/task-complexity-report.json (understand all tasks)
3. /orchestration/task-reference.md (task-to-agent mapping)
4. /orchestration/waves/wave-execution-plan.xml (understand all waves)
5. /orchestration/integration/api-contracts.json (integration standards)
6. /orchestration/monitoring/orchestrator-communication-log.md (track communications)

Monitor progress by reading files in:
/orchestration/monitoring/agent-*-progress-*.xml

Begin by verifying all agents are initialized and starting Wave 1 coordination.
```

### Step 3: Communication Between Agents

Since agents can't directly talk to each other, communication happens through:

1. **File-Based Communication**:
   - Progress reports in `/orchestration/monitoring/`
   - Shared contracts in `/orchestration/integration/`
   - Code commits and documentation

2. **You as the Intermediary**:
   - Check each agent's progress
   - Copy important updates between agents
   - Resolve conflicts and questions

## Orchestrator Workflow

As the orchestrator (this conversation or a dedicated one), your workflow is:

### 1. Monitor Progress
```bash
# Check all agent progress reports
ls orchestration/monitoring/agent-*-progress-*.xml
```

### 2. Relay Important Information
When Agent A needs something from Agent B:
- Agent A documents the need in their progress report
- You see this in monitoring
- You tell Agent B about the requirement
- Agent B implements and reports completion
- You inform Agent A it's ready

### 3. Resolve Integration Issues
When conflicts arise:
- Identify the conflict from progress reports
- Analyze the issue
- Provide resolution to affected agents
- Update integration contracts if needed

### 4. Coordinate Wave Transitions
When Wave 1 is complete:
- Verify all agents completed their tasks
- Run integration tests
- Approve transition to Wave 2
- Inform all agents to proceed

## Example Communication Flow

### Agent A reports:
```xml
<progress_report agent="A" wave="1" timestamp="2025-01-10T10:00:00Z">
  <task_id>2</task_id>
  <status>blocked</status>
  <completion_percentage>60</completion_percentage>
  <current_activity>Waiting for auth endpoints from Agent B</current_activity>
  <blockers>Need /api/auth/session endpoint specification</blockers>
</progress_report>
```

### Orchestrator Action:
1. Read Agent A's blocker
2. Check Agent B's progress
3. Message Agent B: "Agent A needs the /api/auth/session endpoint. Please prioritize this and update the API contracts."
4. Once Agent B completes, message Agent A: "The auth endpoint is now available in the API contracts file."

## Practical Tips

1. **Use Clear File Naming**: Include wave numbers and timestamps
2. **Regular Check-ins**: Monitor progress every few hours
3. **Batch Communications**: Collect multiple updates before switching agents
4. **Document Decisions**: Keep a decision log in `/orchestration/reports/`
5. **Version Control**: Commit changes regularly so all agents see updates

## Alternative Setup Options

### Option 1: Sequential Sessions
- Work with one agent at a time
- Complete their tasks, then switch
- Less efficient but simpler

### Option 2: Automated Scripts
- Create scripts that check progress files
- Generate summary reports
- Flag conflicts automatically

### Option 3: Single Agent Mode
- One agent plays all roles
- Reference the wave plan
- Work through tasks systematically

## Getting Started Checklist

- [ ] Create separate conversations for each agent
- [ ] Initialize each agent with their role prompt
- [ ] Ensure all agents can access the repository
- [ ] Set up your monitoring routine
- [ ] Begin Wave 1 execution
- [ ] Monitor and coordinate progress