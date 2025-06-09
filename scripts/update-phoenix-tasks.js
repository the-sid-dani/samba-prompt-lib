#!/usr/bin/env node

/**
 * Script to update Phoenix tasks (32-46) with solo developer optimizations
 * Run with: node scripts/update-phoenix-tasks.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the current tasks.json
const tasksPath = path.join(__dirname, '../tasks/tasks.json');
const tasksData = JSON.parse(fs.readFileSync(tasksPath, 'utf8'));

// Simplified Phoenix tasks for solo dev
const phoenixUpdates = {
  32: {
    title: "Phoenix Docker Setup - Solo Dev Edition",
    description: "Get Phoenix running locally in Docker with minimal configuration for rapid integration.",
    details: `1. Create docker-compose.yml with Phoenix, PostgreSQL, and Redis services
2. Use the provided configuration from the Phoenix Integration Plan
3. Add environment variables to .env.local
4. Run 'docker-compose up -d'
5. Verify Phoenix is accessible at http://localhost:6006`,
    mvpApproach: "Use Phoenix's Docker image as-is, no custom builds needed",
    timeEstimate: "4-6 hours",
    testStrategy: "Access http://localhost:6006 and verify Phoenix UI loads. Test that all services are running with 'docker-compose ps'."
  },
  
  33: {
    title: "Phoenix Auth Bridge - Simple JWT",
    description: "Create a minimal authentication bridge that converts NextAuth sessions to Phoenix JWTs.",
    details: `1. Create lib/phoenix/auth.ts with a simple getPhoenixToken function
2. Use jsonwebtoken to sign JWTs with user info from NextAuth session
3. Include user id, email, name, and expiration in the token
4. No complex RBAC needed for MVP - Phoenix will handle its own permissions`,
    mvpApproach: "Skip complex RBAC, just pass user info to Phoenix",
    timeEstimate: "2-4 hours",
    testStrategy: "Generate tokens and decode them to verify contents. Test with actual NextAuth sessions."
  },
  
  34: {
    title: "Phoenix Integration Tables - Minimal Schema",
    description: "Add only the essential tables needed to link Phoenix data with your prompts.",
    details: `1. Create a simple migration with two tables:
   - prompt_evaluations: Links prompts to Phoenix evaluation IDs
   - prompt_traces: Links prompts to Phoenix trace IDs
2. Store only the Phoenix reference IDs, not the actual data
3. Let Phoenix handle all the complex data storage
4. Run migration in Supabase dashboard`,
    mvpApproach: "Store only Phoenix IDs, let Phoenix handle all data storage",
    timeEstimate: "1-2 hours",
    testStrategy: "Insert test records and verify foreign keys work correctly."
  },
  
  35: {
    title: "Phoenix API Proxy - REST Only",
    description: "Create a simple API proxy that forwards requests to Phoenix with authentication.",
    details: `1. Create app/api/phoenix/[...path]/route.ts as a catch-all route
2. Extract session, generate Phoenix token, forward requests
3. Handle all HTTP methods (GET, POST, PUT, DELETE)
4. Add error handling for failed requests
5. Skip GraphQL federation - just use REST`,
    mvpApproach: "Simple REST proxy, skip GraphQL complexity",
    timeEstimate: "4-6 hours",
    testStrategy: "Make various API calls through the proxy and verify responses match direct Phoenix calls."
  },
  
  36: {
    title: "Phoenix UI Integration - Iframe First",
    description: "Embed Phoenix UI using iframes for instant full functionality, then progressively enhance.",
    details: `1. Create PhoenixEmbed component that generates authenticated iframe URLs
2. Add Phoenix views to your app:
   - /evaluations page with embedded evaluation dashboard
   - /traces page with trace explorer
   - Trace panel in playground
3. Style iframes to match your app's design
4. Phase 2: Optionally replace iframes with Phoenix React components later`,
    mvpApproach: "Start with iframes for full features immediately",
    timeEstimate: "1-2 days",
    testStrategy: "Verify all Phoenix features work through iframes. Test authentication passes correctly.",
    combinedWith: [37]
  },
  
  37: {
    // This task is now combined with 36
    merged: true,
    mergedInto: 36
  },
  
  38: {
    title: "Phoenix WebSocket - Simple Integration",
    description: "Connect to Phoenix WebSocket for real-time updates using their existing implementation.",
    details: `1. Install socket.io-client
2. Create simple connection function that passes auth token
3. Listen for Phoenix events (evaluation updates, trace completion)
4. Update UI or trigger refetches when events arrive
5. No need to implement complex event handling - just connect and listen`,
    mvpApproach: "Use Phoenix's WebSocket as-is, just connect and listen",
    timeEstimate: "2-4 hours",
    testStrategy: "Trigger Phoenix events and verify updates are received in your app.",
    dependencies: [35] // Simplified dependencies
  },
  
  39: {
    title: "Phoenix Analytics & Experiments - Embedded Views",
    description: "Add Phoenix analytics and experimentation features using embedded views.",
    details: `1. Create new pages for analytics and experiments
2. Embed Phoenix views using the PhoenixEmbed component
3. Add navigation menu items for new features
4. Optionally fetch summary stats for homepage display
5. Let Phoenix handle all the complex analytics logic`,
    mvpApproach: "Embed Phoenix views directly, customize later if needed",
    timeEstimate: "1 day",
    testStrategy: "Navigate to new pages and verify all Phoenix features are accessible.",
    combinedWith: [40]
  },
  
  40: {
    // This task is now combined with 39
    merged: true,
    mergedInto: 39
  },
  
  41: {
    title: "Phoenix Performance & Basic Testing",
    description: "Add basic performance optimizations and smoke tests for Phoenix integration.",
    details: `1. Add lazy loading for Phoenix embeds to improve initial page load
2. Implement token caching to reduce auth overhead
3. Add loading skeletons while Phoenix content loads
4. Create basic smoke tests for critical paths
5. Skip complex performance optimization for MVP`,
    mvpApproach: "Focus on perceived performance, skip complex optimizations",
    timeEstimate: "4-6 hours",
    testStrategy: "Measure page load times before/after optimizations. Run smoke tests.",
    combinedWith: [42]
  },
  
  42: {
    // This task is now combined with 41
    merged: true,
    mergedInto: 41
  },
  
  43: {
    title: "Phoenix Deployment & Quick Docs",
    description: "Deploy Phoenix integration behind a feature flag and create minimal documentation.",
    details: `1. Add PHOENIX_ENABLED feature flag to environment variables
2. Conditionally show Phoenix features based on flag
3. Update production docker-compose with Phoenix services
4. Create a simple README for Phoenix features
5. Deploy with flag OFF initially
6. Test with select users before general release`,
    mvpApproach: "Ship behind feature flag, iterate based on feedback",
    timeEstimate: "1 day",
    testStrategy: "Verify app works normally with flag off. Test all features with flag on.",
    combinedWith: [44, 45, 46],
    dependencies: [41] // Simplified to just depend on testing
  },
  
  44: { merged: true, mergedInto: 43 },
  45: { merged: true, mergedInto: 43 },
  46: { merged: true, mergedInto: 43 }
};

// Update tasks
tasksData.tasks = tasksData.tasks.map(task => {
  if (phoenixUpdates[task.id]) {
    const update = phoenixUpdates[task.id];
    
    // If task is merged, mark it appropriately
    if (update.merged) {
      return {
        ...task,
        status: "merged",
        mergedInto: update.mergedInto,
        description: `This task has been merged into Task ${update.mergedInto} for simplified solo development.`
      };
    }
    
    // Otherwise, update the task
    return {
      ...task,
      ...update,
      // Preserve some original fields
      id: task.id,
      status: task.status,
      priority: task.priority,
      // Simplify dependencies if provided
      dependencies: update.dependencies || task.dependencies.filter(d => d < 32 || d > 46),
      // Add new fields
      mvpApproach: update.mvpApproach,
      timeEstimate: update.timeEstimate,
      combinedWith: update.combinedWith || []
    };
  }
  return task;
});

// Save the updated tasks
fs.writeFileSync(tasksPath, JSON.stringify(tasksData, null, 2));

console.log('✅ Phoenix tasks updated for solo development!');
console.log('\nKey changes:');
console.log('- Simplified task descriptions and approaches');
console.log('- Added time estimates for realistic planning');
console.log('- Combined related tasks (36-37, 39-40, 41-42, 43-46)');
console.log('- Added MVP approaches to each task');
console.log('- Reduced dependencies for parallel work');
console.log('\nTotal estimated time: 2-3 weeks');