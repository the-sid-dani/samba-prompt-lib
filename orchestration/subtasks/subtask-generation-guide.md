# Subtask Generation Guide

## Integration with Taskmaster

This orchestration system works WITH Taskmaster's subtask breakdown. Each agent should use Taskmaster's recommendations to create detailed subtasks.

## Process Flow

1. **Taskmaster Provides**: Task complexity analysis with recommended subtask counts
2. **Orchestrator Distributes**: Tasks to appropriate agents based on specialization
3. **Agents Generate**: Detailed subtasks using Taskmaster's expansion prompts
4. **Agents Execute**: Subtasks in parallel within their domain
5. **Orchestrator Monitors**: Subtask progress and integration points

## Subtask Generation Template

For each assigned task, agents should:

### 1. Read Task Details
From `/.taskmaster/reports/task-complexity-report.json`:
- Task ID and Title
- Complexity Score
- Recommended Subtasks count
- Expansion Prompt (guides breakdown)
- Reasoning (explains complexity)

### 2. Generate Subtasks
Create a subtask file: `/orchestration/subtasks/agent-[A/B/C]-task-[ID]-subtasks.json`

```json
{
  "taskId": 14,
  "taskTitle": "Implement Advanced Playground Features",
  "agent": "A",
  "complexityScore": 8,
  "recommendedSubtasks": 7,
  "generatedSubtasks": [
    {
      "id": "14.1",
      "title": "Design structured output UI components",
      "description": "Create React components for JSON/XML output display",
      "priority": "high",
      "dependencies": [],
      "estimatedHours": 4,
      "status": "pending"
    },
    {
      "id": "14.2", 
      "title": "Implement output parsing logic",
      "description": "Parse and validate structured outputs from AI responses",
      "priority": "high",
      "dependencies": ["14.1"],
      "estimatedHours": 3,
      "status": "pending"
    },
    {
      "id": "14.3",
      "title": "Add streaming support UI",
      "description": "Create streaming response display with progress indicators",
      "priority": "medium",
      "dependencies": [],
      "estimatedHours": 5,
      "status": "pending"
    },
    {
      "id": "14.4",
      "title": "Build function calling interface",
      "description": "UI for defining and testing function calls",
      "priority": "medium",
      "dependencies": ["14.1"],
      "estimatedHours": 6,
      "status": "pending"
    },
    {
      "id": "14.5",
      "title": "Create conversation history component",
      "description": "Multi-turn conversation UI with context management",
      "priority": "medium",
      "dependencies": [],
      "estimatedHours": 4,
      "status": "pending"
    },
    {
      "id": "14.6",
      "title": "Update API routes for new features",
      "description": "Coordinate with Agent B for API requirements",
      "priority": "high",
      "dependencies": ["14.2", "14.4"],
      "estimatedHours": 2,
      "status": "pending",
      "integrationWith": "Agent B"
    },
    {
      "id": "14.7",
      "title": "Comprehensive feature testing",
      "description": "Test all playground features with various models",
      "priority": "high",
      "dependencies": ["14.1", "14.2", "14.3", "14.4", "14.5", "14.6"],
      "estimatedHours": 3,
      "status": "pending"
    }
  ],
  "totalEstimatedHours": 27,
  "integrationPoints": [
    {
      "subtask": "14.6",
      "agent": "B",
      "description": "API contract for structured output and function calling"
    }
  ]
}
```

### 3. Report Subtask Progress

Update progress reports to include subtask status:

```xml
<task>
  <task_id>14</task_id>
  <title>Implement Advanced Playground Features</title>
  <status>in_progress</status>
  <completion_percentage>28</completion_percentage>
  <subtasks_completed>2</subtasks_completed>
  <subtasks_total>7</subtasks_total>
  <current_subtask>14.3</current_subtask>
</task>
```

## Example: Wave 1 Subtask Breakdown

### Agent A - Task 2: White-Label UI Customization
Based on complexity score 5 and 6 recommended subtasks:

1. **2.1** - Replace logo files and assets (2h)
2. **2.2** - Update theme variables and colors (3h)
3. **2.3** - Modify favicon and app icons (1h)
4. **2.4** - Update meta tags and app name (2h)
5. **2.5** - Style UI components with new theme (4h)
6. **2.6** - Test branding consistency across pages (2h)

### Agent B - Task 3: Configure Google OAuth Integration
Based on complexity score 5 and 5 recommended subtasks:

1. **3.1** - Set up NextAuth.js configuration (3h)
2. **3.2** - Implement Google OAuth provider (2h)
3. **3.3** - Add domain restriction logic (@samba.tv) (2h)
4. **3.4** - Update auth UI with branding (1h)
5. **3.5** - End-to-end authentication testing (2h)

### Agent C - Task 1: Fork Langfuse Repository
Based on complexity score 3 and 4 recommended subtasks:

1. **1.1** - Fork repository and set up remotes (0.5h)
2. **1.2** - Install dependencies and verify build (1h)
3. **1.3** - Configure environment variables (1h)
4. **1.4** - Verify development environment works (0.5h)

## Orchestrator Subtask Monitoring

The orchestrator should:
1. Verify agents create appropriate subtask breakdowns
2. Check subtask counts match recommendations
3. Monitor dependencies between subtasks
4. Track integration points across agents
5. Aggregate subtask completion for wave progress

## Benefits of Subtask Integration

1. **Granular Progress Tracking**: See exactly where each task stands
2. **Better Time Estimation**: Sum of subtask hours = realistic timeline
3. **Dependency Management**: Clear view of blocking relationships
4. **Integration Planning**: Identify cross-agent dependencies early
5. **Risk Identification**: Spot complex subtasks that might delay