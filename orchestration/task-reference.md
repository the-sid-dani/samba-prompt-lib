# Task Reference Guide

## Taskmaster Integration

This guide maps the original Taskmaster tasks to the orchestration wave plan.

### Source Documents
- **Task Complexity Report**: `/.taskmaster/reports/task-complexity-report.json`
- **Wave Execution Plan**: `/orchestration/waves/wave-execution-plan.xml`

### Task ID Mapping

| Task ID | Title | Complexity | Assigned To | Wave |
|---------|-------|------------|-------------|------|
| 1 | Fork Langfuse Repository | 3 | Agent C | Wave 1 |
| 2 | White-Label UI Customization | 5 | Agent A | Wave 1 |
| 3 | Configure Google OAuth Integration | 5 | Agent B | Wave 1 |
| 4 | Implement Shared Authentication Session | 7 | Agent B | Wave 1 |
| 5 | Configure Model API Integration | 5 | Agent B | Wave 2 |
| 6 | Set Up PostgreSQL Database for Langfuse | 5 | Agent C | Wave 1 |
| 7 | Create Linking Table in Supabase | 6 | Agent B | Wave 2 |
| 8 | Implement 'Test in AI Platform' Button | 6 | Agent A | Wave 2 |
| 9 | Display Evaluation Scores in Main App | 6 | Agent A | Wave 3 |
| 10 | Implement Cost and Usage Data Sharing | 7 | Agent B | Wave 3 |
| 11 | Set Up Subdomain and SSL | 5 | Agent C | Wave 1 |
| 12 | Configure Docker Deployment | 6 | Agent C | Wave 2 |
| 13 | Implement Monitoring and Alerts | 7 | Agent C | Wave 3 |
| 14 | Implement Advanced Playground Features | 8 | Agent A | Wave 4 |
| 15 | Implement Full Tracing Functionality | 8 | Agent B | Wave 4 |
| 16 | Implement Evaluation System | 8 | Agent B | Wave 4 |
| 17 | Implement Dataset Management | 7 | Agent B | Wave 4 |
| 18 | Implement Experimentation System | 8 | Agent C | Wave 4 |
| 19 | Implement Advanced Analytics | 8 | Agent C | Wave 4 |
| 20 | Enhance Prompt Management | 7 | Agent A | Wave 4 |
| 21 | Implement Team Training Module | 7 | Agent A | Wave 5 |
| 22 | Update Documentation | 6 | Agent C | Wave 5 |
| 23 | Implement Feedback Collection System | 6 | Agent A | Wave 5 |
| 24 | Perform Security Audit | 9 | Agent B & C | Wave 5 |
| 25 | Conduct Performance Optimization | 8 | Agent C | Wave 5 |
| 30 | Update Analytics Class for Database Integration | 7 | Agent B | Wave 3 |
| 31 | AI Model Pricing Configuration and Cost Calculation System | 7 | Agent B | Wave 2 |

### Using Taskmaster Details

Each agent should:
1. Read the full task complexity report: `/.taskmaster/reports/task-complexity-report.json`
2. Find their assigned tasks in the mapping above
3. Review the `recommendedSubtasks` and `expansionPrompt` for each task
4. Use the `reasoning` field to understand complexity factors

### Example Task Breakdown

For Task #14 (Advanced Playground Features):
- **Assigned to**: Agent A
- **Complexity**: 8
- **Recommended Subtasks**: 7
- **Expansion**: "UI updates, structured output parsing, function calling support, streaming implementation, conversation history component, API route updates, and feature testing"

Agent A should create subtasks based on this guidance and report progress accordingly.

### Important Notes

1. **Task Dependencies**: Some tasks depend on others. Check the wave plan for sequencing.
2. **Integration Points**: High-complexity tasks often have multiple integration points.
3. **Subtask Creation**: Use the `recommendedSubtasks` count as a minimum guideline.
4. **Complexity Awareness**: Tasks with complexity 7+ need extra planning and coordination.

### For the Orchestrator

When monitoring progress:
- Reference task IDs from the original report
- Use complexity scores to anticipate potential delays
- Pay special attention to tasks with complexity 8-9
- Ensure agents are creating appropriate subtasks