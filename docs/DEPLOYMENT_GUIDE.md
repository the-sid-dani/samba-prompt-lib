# Deployment Guide

This comprehensive guide covers all aspects of deploying the SambaTV Prompt Library application, including CI/CD pipeline configuration, environment setup, and operational procedures.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [CI/CD Pipeline](#cicd-pipeline)
5. [Deployment Process](#deployment-process)
6. [Database Management](#database-management)
7. [Monitoring & Observability](#monitoring--observability)
8. [Rollback Procedures](#rollback-procedures)
9. [Troubleshooting](#troubleshooting)
10. [Quick Reference](#quick-reference)

## Overview

Our deployment architecture uses:
- **GitHub Actions** for CI/CD automation
- **Vercel** for hosting and deployment
- **Supabase** for database and authentication
- **Environment-based deployments** (staging/production)
- **Automated testing** and quality checks
- **Health monitoring** and error tracking

### Deployment Flow
```
Code Push → GitHub Actions → Build & Test → Deploy → Health Check → Monitor
```

## Prerequisites

### Required Accounts
- [x] GitHub repository access
- [x] Vercel account with project access
- [x] Supabase project access
- [x] Domain management (if using custom domains)

### Required Tools
```bash
# Local development
node >= 18.0.0
pnpm >= 8.0.0
git >= 2.30.0

# Optional tools
vercel CLI (for manual deployments)
supabase CLI (for database management)
```

### Access Requirements
- GitHub repository write access
- Vercel project deployment permissions
- Supabase project admin access
- Environment variable management access

## Environment Setup

### Environment Variables

#### Production Environment Variables
```bash
# Authentication
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-production-domain.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# AI Services
ANTHROPIC_API_KEY=your-anthropic-key
GEMINI_API_KEY=your-gemini-key
OPENROUTER_API_KEY=your-openrouter-key

# Deployment
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id
```

#### Staging Environment Variables
```bash
# Same as production but with staging-specific values
NEXTAUTH_URL=https://your-staging-domain.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://your-staging-project.supabase.co
# ... other staging-specific values
```

### GitHub Secrets Configuration

Navigate to your GitHub repository → Settings → Secrets and variables → Actions

**Required Secrets:**
1. `VERCEL_TOKEN` - Vercel deployment token
2. `VERCEL_ORG_ID` - Vercel organization ID
3. `VERCEL_PROJECT_ID` - Vercel project ID
4. `NEXTAUTH_SECRET` - NextAuth secret key
5. `NEXTAUTH_URL` - Production URL
6. `GOOGLE_CLIENT_ID` - Google OAuth client ID
7. `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
8. `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
9. `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
10. `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
11. `ANTHROPIC_API_KEY` - Anthropic API key
12. `GEMINI_API_KEY` - Google Gemini API key
13. `OPENROUTER_API_KEY` - OpenRouter API key

### Vercel Project Setup

1. **Connect Repository:**
   ```bash
   # Via Vercel Dashboard
   1. Go to Vercel Dashboard
   2. Click "New Project"
   3. Import from GitHub
   4. Select your repository
   ```

2. **Configure Build Settings:**
   ```bash
   # Build Command
   pnpm build
   
   # Output Directory
   .next
   
   # Install Command
   pnpm install
   
   # Development Command
   pnpm dev
   ```

3. **Environment Variables:**
   - Add all production environment variables in Vercel Dashboard
   - Ensure staging environment has separate values

## CI/CD Pipeline

### GitHub Actions Workflow

Our CI/CD pipeline (`.github/workflows/ci.yml`) includes:

#### 1. Build and Test Job
```yaml
- Checkout code
- Setup Node.js and pnpm
- Install dependencies
- Run linting (ESLint)
- Run type checking (TypeScript)
- Run tests (Vitest)
- Build application
- Generate test coverage
```

#### 2. Security Scan Job
```yaml
- Audit dependencies for vulnerabilities
- Check for security issues
- Generate security report
```

#### 3. Deploy to Staging Job
```yaml
- Triggers on: Pull requests, staging branch pushes
- Run database migrations (when enabled)
- Deploy to Vercel staging
- Run health checks
- Verify deployment
```

#### 4. Deploy to Production Job
```yaml
- Triggers on: Main branch pushes
- Run database migrations (when enabled)
- Deploy to Vercel production
- Run health checks
- Verify deployment
- Send notifications
```

#### 5. Notification Job
```yaml
- Send deployment status notifications
- Update team on success/failure
- Provide deployment URLs and logs
```

### Workflow Triggers

| Event | Staging | Production |
|-------|---------|------------|
| Push to `main` | ❌ | ✅ |
| Push to `staging` | ✅ | ❌ |
| Pull Request | ✅ | ❌ |
| Manual trigger | ✅ | ✅ |

## Deployment Process

### Automatic Deployment

#### Production Deployment
1. **Merge to main branch**
2. **CI pipeline triggers automatically**
3. **Build and test execution**
4. **Security scanning**
5. **Database migrations** (when enabled)
6. **Vercel deployment**
7. **Health check verification**
8. **Team notification**

#### Staging Deployment
1. **Create pull request** or **push to staging branch**
2. **CI pipeline triggers automatically**
3. **Build and test execution**
4. **Deploy to staging environment**
5. **Health check verification**
6. **Ready for testing**

### Manual Deployment

#### Via GitHub Actions
```bash
# Trigger manual deployment
1. Go to GitHub Actions tab
2. Select "CI/CD Pipeline" workflow
3. Click "Run workflow"
4. Select branch and environment
5. Click "Run workflow"
```

#### Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Deploy to staging
vercel
```

#### Emergency Deployment
```bash
# Use emergency rollback script
npm run rollback:emergency

# Or manual Vercel rollback
vercel rollback [deployment-url] --prod
```

## Database Management

### Migration System

#### Running Migrations
```bash
# Run pending migrations
npm run migrate

# Rollback last migration
npm run migrate:rollback

# Check migration status
npm run migrate:status
```

#### Creating Migrations
```bash
# Create new migration file
touch supabase/migrations/$(date +%Y%m%d_%H%M%S)_description.sql

# Example migration structure
-- Migration: Add new table
-- Created: 2024-12-08 12:00:00

CREATE TABLE IF NOT EXISTS new_table (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Migration Best Practices
- **Always test migrations in staging first**
- **Use descriptive migration names**
- **Include rollback instructions**
- **Backup database before production migrations**
- **Keep migrations idempotent**

### Database Backup

#### Automated Backups
- Supabase provides automatic daily backups
- Retention period: 7 days (free tier), 30 days (pro tier)
- Point-in-time recovery available

#### Manual Backup
```bash
# Create manual backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
psql $DATABASE_URL < backup_file.sql
```

## Monitoring & Observability

### Health Checks

#### Endpoint: `/api/health`
```json
{
  "status": "ok",
  "timestamp": "2024-12-08T12:00:00Z",
  "database": "connected",
  "environment": "production",
  "version": "1.0.0"
}
```

#### Monitoring Commands
```bash
# Check application health
curl https://your-app.vercel.app/api/health

# Verify rollback
npm run rollback:verify

# Monitor performance
curl -w "@curl-format.txt" -s -o /dev/null https://your-app.vercel.app
```

### Error Tracking

#### Vercel Analytics
- Automatic error capture
- Performance monitoring
- Real user metrics
- Geographic insights

#### Custom Monitoring
- Global error boundary
- API error handling
- Database connectivity monitoring
- Performance tracking

### Alerting

#### Critical Alerts
- Application down (health check failures)
- High error rates (>5% in 5 minutes)
- Database connectivity issues
- Authentication service failures

#### Warning Alerts
- Slow response times (>2s average)
- High memory usage (>80%)
- Unusual traffic patterns
- Failed deployments

## Rollback Procedures

### Automatic Rollback
- Health check failures trigger automatic rollback
- Build failures prevent deployment promotion
- Performance degradation can trigger rollback

### Manual Rollback

#### Emergency Rollback
```bash
# Quick emergency rollback
npm run rollback:emergency

# Verify rollback success
npm run rollback:verify
```

#### Vercel Dashboard Rollback
1. Go to Vercel Dashboard → Project → Deployments
2. Find last known good deployment
3. Click "Promote to Production"

#### Git-based Rollback
```bash
# Revert specific commit
git revert <commit-hash>
git push origin main

# Reset to previous version (use with caution)
git reset --hard <good-commit-hash>
git push --force origin main
```

### Rollback Decision Matrix

| Severity | Condition | Action | Timeline |
|----------|-----------|--------|----------|
| **P0** | Complete outage | Immediate rollback | < 5 minutes |
| **P1** | Critical feature broken | Rollback if no quick fix | < 15 minutes |
| **P2** | Performance degradation | Rollback if >50% impact | < 30 minutes |
| **P3** | Minor issues | Fix forward preferred | No immediate rollback |

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build logs
1. Go to GitHub Actions → Failed workflow
2. Expand "Build and Test" job
3. Review error messages

# Common fixes
- Update dependencies: pnpm update
- Clear cache: rm -rf .next node_modules && pnpm install
- Check TypeScript errors: pnpm type-check
```

#### Deployment Failures
```bash
# Check Vercel logs
1. Go to Vercel Dashboard → Project → Functions
2. Review error logs and stack traces

# Common fixes
- Verify environment variables
- Check API routes for errors
- Validate database connectivity
```

#### Environment Variable Issues
```bash
# Verify variables are set
1. Check GitHub Secrets
2. Check Vercel Environment Variables
3. Ensure variable names match exactly

# Test locally
cp .env.example .env.local
# Add your local environment variables
pnpm dev
```

#### Database Connection Issues
```bash
# Test database connectivity
npm run test:db-connection

# Check Supabase status
1. Go to Supabase Dashboard
2. Check project status
3. Review connection logs
```

### Debug Commands

```bash
# Local development
pnpm dev                    # Start development server
pnpm build                  # Test production build
pnpm test                   # Run test suite
pnpm lint                   # Check code quality

# Deployment testing
npm run rollback:verify     # Verify deployment health
curl /api/health           # Check health endpoint
vercel logs                # View deployment logs

# Database testing
npm run migrate            # Run migrations
npm run test:db           # Test database connection
```

### Log Analysis

#### GitHub Actions Logs
- Build and test output
- Deployment status
- Error messages and stack traces

#### Vercel Function Logs
- Runtime errors
- Performance metrics
- Request/response data

#### Application Logs
- Custom application logging
- Error boundary captures
- Performance monitoring data

## Quick Reference

### Essential Commands

```bash
# Development
pnpm dev                    # Start development server
pnpm build                  # Build for production
pnpm test                   # Run tests
pnpm lint                   # Lint code

# Deployment
git push origin main        # Deploy to production
git push origin staging     # Deploy to staging
npm run rollback:emergency  # Emergency rollback
npm run rollback:verify     # Verify deployment

# Database
npm run migrate            # Run migrations
npm run migrate:rollback   # Rollback migrations

# Monitoring
curl /api/health          # Health check
npm run test:db           # Database connectivity
```

### Important URLs

#### Production
- **Application:** https://sambatv-prompt-lib-sid-danis-projects.vercel.app
- **Health Check:** https://sambatv-prompt-lib-sid-danis-projects.vercel.app/api/health
- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Actions:** https://github.com/sidart10/sambtv-prompt-lib/actions

#### Staging
- **Application:** [Staging URL from PR deployments]
- **Health Check:** [Staging URL]/api/health

#### Management
- **Supabase Dashboard:** https://supabase.com/dashboard
- **GitHub Repository:** https://github.com/sidart10/sambtv-prompt-lib

### Environment Variables Checklist

#### Required for All Environments
- [ ] `NEXTAUTH_SECRET`
- [ ] `NEXTAUTH_URL`
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`

#### Required for CI/CD
- [ ] `VERCEL_TOKEN`
- [ ] `VERCEL_ORG_ID`
- [ ] `VERCEL_PROJECT_ID`

#### Optional (AI Features)
- [ ] `ANTHROPIC_API_KEY`
- [ ] `GEMINI_API_KEY`
- [ ] `OPENROUTER_API_KEY`

### Emergency Contacts

- **Technical Lead:** [Contact Information]
- **DevOps Engineer:** [Contact Information]
- **Project Manager:** [Contact Information]

### Support Resources

- **Documentation:** This guide and related docs in `/docs`
- **Issue Tracking:** GitHub Issues
- **Team Communication:** [Your team communication channel]
- **Monitoring:** Vercel Dashboard and Analytics

---

## Additional Documentation

For more detailed information, see:
- [Database Migration Guide](./DATABASE_MIGRATIONS.md)
- [Monitoring Setup](./MONITORING_SETUP.md)
- [Rollback Procedures](./ROLLBACK_PROCEDURES.md)
- [Staging Environment Setup](./STAGING_SETUP.md)

---

**Last Updated:** December 8, 2024  
**Version:** 1.0.0  
**Maintained by:** Development Team 