# Multi-Agent Task Coordination User Prompt v1.0.0

## Metadata
- **Purpose**: User template for coordinating development tasks across multiple agents
- **Companion To**: system_multi_agent_orchestrator_v1.0.0.md
- **Target Model**: Claude 4 (Opus/Sonnet)
- **Use Case**: Complex development projects requiring parallel execution
- **Version**: 1.0.0
- **Created**: 2025-01-02

---

## Usage Instructions

This prompt template works with the Multi-Agent Orchestrator system prompt to coordinate development across three specialized agents. Use this format to initiate multi-agent development projects.

## Template Structure

```xml
<project_overview>
[Brief description of the overall project goal and scope]
</project_overview>

<technical_requirements>
[Specific technical constraints, frameworks, or technologies that must be used]
</technical_requirements>

<main_development_task>
[Detailed description of what needs to be built, including key features and functionality]
</main_development_task>

<existing_codebase>
[Description of any existing code, APIs, or systems that need to be integrated with]
</existing_codebase>

<success_criteria>
[Clear definition of what constitutes successful completion]
</success_criteria>

<timeline_constraints>
[Any deadline or scheduling requirements]
</timeline_constraints>

<special_considerations>
[Performance requirements, security concerns, scalability needs, etc.]
</special_considerations>
```

## Example Usage

### Example 1: E-commerce Platform Development

```xml
<project_overview>
Build a modern e-commerce platform with real-time inventory management, user authentication, and payment processing capabilities.
</project_overview>

<technical_requirements>
- Frontend: React 18 with TypeScript and Tailwind CSS
- Backend: Node.js with Express and PostgreSQL database
- Infrastructure: Docker containers with AWS deployment
- Authentication: JWT with refresh tokens
- Payment: Stripe integration
</technical_requirements>

<main_development_task>
Create a full-stack e-commerce application with the following core features:
1. User registration/login with email verification
2. Product catalog with search and filtering
3. Shopping cart with persistent state
4. Checkout process with Stripe payment integration
5. Real-time inventory updates
6. Order management and tracking
7. Admin dashboard for product and order management
</main_development_task>

<existing_codebase>
No existing codebase - starting from scratch. Need to integrate with existing Stripe merchant account and potentially connect to third-party inventory management API.
</existing_codebase>

<success_criteria>
- Fully functional e-commerce site with all listed features
- Responsive design works on mobile and desktop
- Secure payment processing with proper error handling
- Real-time inventory updates across all users
- Admin panel allows full CRUD operations
- Site loads in under 3 seconds
- Comprehensive test coverage (>80%)
</success_criteria>

<timeline_constraints>
MVP needed within 4 development waves, with basic functionality operational after 2 waves.
</timeline_constraints>

<special_considerations>
- PCI compliance for payment data handling
- GDPR compliance for user data
- High availability required (99.9% uptime target)
- Support for concurrent users (estimated 1000+ simultaneous)
- Mobile-first responsive design approach
</special_considerations>
```

### Example 2: Data Analytics Dashboard

```xml
<project_overview>
Develop a real-time data analytics dashboard for monitoring business KPIs with interactive visualizations and automated reporting.
</project_overview>

<technical_requirements>
- Frontend: Vue.js 3 with D3.js for visualizations
- Backend: Python FastAPI with Redis for caching
- Database: MongoDB for analytics data storage
- Infrastructure: Kubernetes deployment on Google Cloud
- Real-time: WebSocket connections for live updates
</technical_requirements>

<main_development_task>
Build a comprehensive analytics dashboard featuring:
1. Interactive charts and graphs (line, bar, pie, heatmaps)
2. Real-time data streaming and updates
3. Custom dashboard builder with drag-and-drop widgets
4. User access controls and shared dashboards
5. Automated report generation and email scheduling
6. Data export functionality (CSV, PDF, Excel)
7. Alert system for threshold breaches
</main_development_task>

<existing_codebase>
Connect to existing REST API for data ingestion. Current API endpoints available for user management and basic data queries. Legacy MySQL database contains historical data that needs migration.
</existing_codebase>

<success_criteria>
- Dashboard renders complex visualizations without performance issues
- Real-time updates work smoothly with <100ms latency
- Users can create custom dashboards without technical knowledge
- Automated reports generate and deliver on schedule
- System handles historical data migration successfully
- Mobile responsive design for monitoring on-the-go
</success_criteria>

<timeline_constraints>
Phase 1 (basic dashboard) - 2 waves
Phase 2 (custom builder) - 2 waves  
Phase 3 (automation features) - 2 waves
</timeline_constraints>

<special_considerations>
- Handle large datasets efficiently (millions of records)
- Optimize for fast query performance
- Ensure data visualization accessibility (color blind friendly)
- Implement data privacy controls and audit logging
- Plan for horizontal scaling as data volume grows
</special_considerations>
```

## Orchestrator Activation

After providing your project details using the template above, the orchestrator will:

1. **Analyze your requirements** and break them into parallel workstreams
2. **Generate specific directives** for each of the three agents
3. **Establish integration points** and shared contracts
4. **Create a wave-based development plan** with clear milestones
5. **Set up quality gates** and progress tracking mechanisms

## Agent Specialization Reminders

- **Agent A (Frontend)**: UI/UX, client-side logic, user interactions
- **Agent B (Backend)**: APIs, databases, server-side business logic  
- **Agent C (Infrastructure)**: DevOps, deployment, monitoring, scaling

## Tips for Effective Coordination

1. **Be specific about technical requirements** - this helps with proper task allocation
2. **Clearly define integration points** - reduces conflicts between agents
3. **Include performance and security requirements** - ensures they're built in from the start
4. **Specify existing systems** - helps plan integration strategies
5. **Define success criteria clearly** - enables proper quality assessment

---

**Note**: This prompt works best when you have a clear vision of the end goal and can provide specific technical requirements. The more detailed your input, the more effective the multi-agent coordination will be. 