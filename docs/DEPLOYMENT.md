# Deployment Guide

This document outlines the CI/CD pipeline and deployment process for the SambaTV Prompt Web App.

## Overview

Our deployment strategy uses GitHub Actions for CI/CD with Vercel for hosting. We maintain two environments:

- **Staging**: Deployed on every pull request for testing
- **Production**: Deployed when changes are merged to the main branch

## CI/CD Pipeline

### Workflow File: `.github/workflows/ci.yml`

The pipeline consists of 5 main jobs:

1. **Build & Test**: Builds the application and runs quality checks
2. **Security Scan**: Performs security audits and dependency checks
3. **Deploy to Staging**: Deploys PR changes to staging environment
4. **Deploy to Production**: Deploys main branch to production
5. **Notify Team**: Sends deployment status notifications

### Triggers

- **Push to main**: Triggers production deployment
- **Push to staging**: Triggers staging deployment
- **Pull Request**: Triggers staging deployment and testing

## Environment Setup

### Required GitHub Secrets

#### Vercel Configuration
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

#### Production Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
NEXTAUTH_SECRET=your_production_nextauth_secret
NEXTAUTH_URL=https://your-production-domain.com
GOOGLE_CLIENT_ID=your_production_google_client_id
GOOGLE_CLIENT_SECRET=your_production_google_client_secret
```

#### Staging Environment Variables
```
STAGING_SUPABASE_URL=your_staging_supabase_url
STAGING_SUPABASE_ANON_KEY=your_staging_anon_key
STAGING_SUPABASE_SERVICE_ROLE_KEY=your_staging_service_role_key
STAGING_NEXTAUTH_SECRET=your_staging_nextauth_secret
STAGING_NEXTAUTH_URL=https://your-staging-domain.com
STAGING_GOOGLE_CLIENT_ID=your_staging_google_client_id
STAGING_GOOGLE_CLIENT_SECRET=your_staging_google_client_secret
```

#### AI API Keys (Shared across environments)
```
ANTHROPIC_API_KEY=your_anthropic_api_key
GEMINI_API_KEY=your_gemini_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

### Setting Up GitHub Secrets

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each secret listed above

### Setting Up Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Link project: `vercel link`
4. Get project info: `vercel project ls`
5. Add the Vercel secrets to GitHub

## Deployment Process

### Staging Deployment

1. Create a feature branch
2. Make your changes
3. Push to GitHub
4. Create a pull request
5. CI/CD automatically deploys to staging
6. Review changes on staging URL
7. Merge PR when ready

### Production Deployment

1. Merge PR to main branch
2. CI/CD automatically deploys to production
3. Health check verifies deployment
4. Team receives notification

## Health Checks

The application includes a health check endpoint at `/api/health` that verifies:

- Database connectivity
- Environment variable configuration
- API operational status

### Health Check Response

```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "environment": "production",
  "checks": {
    "database": "connected",
    "environment": "configured",
    "api": "operational"
  }
}
```

## Security

### Security Scanning

The pipeline includes:

- `pnpm audit` for dependency vulnerabilities
- OSSF Scorecard for supply chain security
- Automated security updates via Dependabot

### Environment Isolation

- Staging and production use separate Supabase projects
- Environment-specific secrets and configurations
- No production data in staging environment

## Monitoring

### Build Monitoring

- GitHub Actions provides build status and logs
- Failed builds prevent deployment
- Security scan failures block deployment

### Application Monitoring

- Health check endpoint for uptime monitoring
- Vercel provides performance analytics
- Error tracking via application logs

## Rollback Procedures

### Automatic Rollback

If health checks fail after deployment, the pipeline will:

1. Log the failure
2. Notify the team
3. Maintain previous deployment

### Manual Rollback

1. Go to Vercel dashboard
2. Select the project
3. Navigate to deployments
4. Click "Promote to Production" on a previous deployment

Or via CLI:
```bash
vercel rollback [deployment-url]
```

## Troubleshooting

### Common Issues

#### Build Failures

1. Check GitHub Actions logs
2. Verify all dependencies are installed
3. Ensure TypeScript types are correct
4. Check for linting errors

#### Deployment Failures

1. Verify Vercel secrets are correct
2. Check environment variables
3. Ensure Supabase is accessible
4. Verify domain configuration

#### Health Check Failures

1. Check database connectivity
2. Verify environment variables
3. Check API endpoint accessibility
4. Review application logs

### Getting Help

1. Check GitHub Actions logs for detailed error messages
2. Review Vercel deployment logs
3. Check Supabase dashboard for database issues
4. Contact the development team

## Best Practices

### Before Deployment

- [ ] Run tests locally
- [ ] Check for TypeScript errors
- [ ] Verify environment variables
- [ ] Test database migrations
- [ ] Review security implications

### After Deployment

- [ ] Verify health check passes
- [ ] Test critical user flows
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Validate environment-specific features

### Emergency Procedures

1. **Critical Bug**: Immediately rollback to previous version
2. **Security Issue**: Take application offline, fix, then redeploy
3. **Database Issue**: Check Supabase status, verify connections
4. **Performance Issue**: Monitor metrics, scale if necessary

## Maintenance

### Regular Tasks

- Update dependencies monthly
- Review security scan results
- Monitor deployment metrics
- Update documentation as needed
- Test rollback procedures quarterly

### Scheduled Maintenance

- Database backups (automated via Supabase)
- Security updates (automated via Dependabot)
- Performance optimization reviews
- Documentation updates 