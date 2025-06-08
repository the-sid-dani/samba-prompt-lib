# Staging Environment Setup Guide

This document provides step-by-step instructions for setting up the staging environment for the SambaTV Prompt Web App.

## Overview

The staging environment is used to test changes before they reach production. It mirrors the production setup but uses separate resources to ensure isolation.

## Prerequisites

- Access to Supabase dashboard
- Access to Google Cloud Console (for OAuth setup)
- Access to Vercel dashboard
- GitHub repository admin access

## 1. Supabase Staging Project Setup

### Create Staging Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Set project name: `sambatv-prompt-lib-staging`
5. Set database password (save securely)
6. Choose region (same as production for consistency)
7. Click "Create new project"

### Configure Database Schema

1. Wait for project to be ready
2. Go to SQL Editor
3. Run the production database schema (copy from production or use migration files)
4. Verify all tables are created correctly

### Set up Row Level Security (RLS)

1. Go to Authentication → Policies
2. Copy all RLS policies from production
3. Test policies with sample data

### Get Staging Credentials

1. Go to Settings → API
2. Copy the following values:
   - Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
   - Anon public key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - Service role key (`SUPABASE_SERVICE_ROLE_KEY`)

## 2. Google OAuth Staging Setup

### Create Staging OAuth Application

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project or create a new one for staging
3. Navigate to APIs & Services → Credentials
4. Click "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type: "Web application"
6. Set name: "SambaTV Prompt Library - Staging"
7. Add authorized redirect URIs:
   ```
   https://your-staging-app.vercel.app/api/auth/callback/google
   ```
8. Save and copy:
   - Client ID (`GOOGLE_CLIENT_ID`)
   - Client Secret (`GOOGLE_CLIENT_SECRET`)

### Configure OAuth Consent Screen

1. Go to OAuth consent screen
2. Set up staging-specific consent screen
3. Add test users if needed
4. Configure scopes (email, profile)

## 3. Vercel Staging Deployment

### Create Staging Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import your GitHub repository
3. Set project name: `sambatv-prompt-lib-staging`
4. Configure build settings:
   - Framework Preset: Next.js
   - Build Command: `pnpm build`
   - Output Directory: `.next`
   - Install Command: `pnpm install`

### Configure Environment Variables

Add the following environment variables in Vercel:

```bash
# Supabase (Staging)
NEXT_PUBLIC_SUPABASE_URL=https://your-staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_staging_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_staging_service_role_key

# NextAuth (Staging)
NEXTAUTH_SECRET=your_staging_nextauth_secret_min_32_chars
NEXTAUTH_URL=https://your-staging-app.vercel.app

# Google OAuth (Staging)
GOOGLE_CLIENT_ID=your_staging_google_client_id
GOOGLE_CLIENT_SECRET=your_staging_google_client_secret

# AI API Keys (Same as Production)
ANTHROPIC_API_KEY=your_anthropic_api_key
GEMINI_API_KEY=your_gemini_api_key
OPENROUTER_API_KEY=your_openrouter_api_key

# Environment Identifier
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=staging
NEXT_PUBLIC_ENABLE_DEBUG=true
NEXT_PUBLIC_SHOW_STAGING_BANNER=true
```

### Configure Deployment Settings

1. Set production branch: `staging`
2. Enable automatic deployments from `staging` branch
3. Configure preview deployments for pull requests

## 4. GitHub Secrets Configuration

Add the following secrets to your GitHub repository:

### Staging-Specific Secrets

```bash
# Staging Supabase
STAGING_SUPABASE_URL=https://your-staging-project.supabase.co
STAGING_SUPABASE_ANON_KEY=your_staging_anon_key
STAGING_SUPABASE_SERVICE_ROLE_KEY=your_staging_service_role_key

# Staging NextAuth
STAGING_NEXTAUTH_SECRET=your_staging_nextauth_secret
STAGING_NEXTAUTH_URL=https://your-staging-app.vercel.app

# Staging Google OAuth
STAGING_GOOGLE_CLIENT_ID=your_staging_google_client_id
STAGING_GOOGLE_CLIENT_SECRET=your_staging_google_client_secret
```

### Vercel Integration Secrets

```bash
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_staging_vercel_project_id
```

## 5. Testing Staging Environment

### Automated Testing

The CI/CD pipeline will automatically:
1. Run tests on pull requests
2. Deploy to staging environment
3. Run health checks
4. Report deployment status

### Manual Testing Checklist

- [ ] Application loads correctly
- [ ] Authentication works with Google OAuth
- [ ] Database connections are working
- [ ] All API endpoints respond correctly
- [ ] Environment-specific features work (debug mode, staging banner)
- [ ] Performance is acceptable
- [ ] No production data is accessible

### Health Check Verification

Visit the health check endpoint:
```
https://your-staging-app.vercel.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "environment": "staging",
  "checks": {
    "database": "connected",
    "environment": "configured",
    "api": "operational"
  }
}
```

## 6. Staging Workflow

### Development Process

1. Create feature branch from `main`
2. Develop and test locally
3. Create pull request to `main`
4. CI/CD automatically deploys to staging
5. Test changes on staging environment
6. Merge PR when staging tests pass
7. Changes automatically deploy to production

### Staging Branch Management

- The `staging` branch mirrors `main` for staging deployments
- Pull requests trigger staging deployments
- Staging environment is updated on every PR

### Data Management

- Staging uses separate database from production
- No production data should be in staging
- Use test data for staging environment
- Regular cleanup of staging data

## 7. Monitoring and Maintenance

### Monitoring

- Monitor staging deployments in Vercel dashboard
- Check GitHub Actions for CI/CD status
- Monitor Supabase staging project health
- Review staging application logs

### Maintenance Tasks

- Keep staging environment in sync with production configuration
- Update staging data periodically
- Clean up old staging deployments
- Update staging secrets when production secrets change

## 8. Troubleshooting

### Common Issues

#### Deployment Failures

1. Check GitHub Actions logs
2. Verify environment variables in Vercel
3. Check Supabase project status
4. Verify OAuth configuration

#### Authentication Issues

1. Check Google OAuth configuration
2. Verify redirect URIs
3. Check NextAuth configuration
4. Verify environment variables

#### Database Connection Issues

1. Check Supabase project status
2. Verify database credentials
3. Check RLS policies
4. Test database connectivity

### Getting Help

1. Check deployment logs in Vercel
2. Review GitHub Actions workflow logs
3. Check Supabase project logs
4. Contact development team

## 9. Security Considerations

### Environment Isolation

- Staging and production use completely separate resources
- No cross-environment data access
- Separate OAuth applications
- Separate API keys where possible

### Access Control

- Limit staging environment access to development team
- Use test accounts for staging authentication
- Regular security reviews of staging configuration

### Data Protection

- No production data in staging
- Use anonymized test data
- Regular cleanup of staging data
- Secure handling of staging credentials

## 10. Staging Environment URLs

- **Application**: `https://your-staging-app.vercel.app`
- **Health Check**: `https://your-staging-app.vercel.app/api/health`
- **Supabase Dashboard**: `https://supabase.com/dashboard/project/your-staging-project-id`
- **Vercel Dashboard**: `https://vercel.com/your-team/sambatv-prompt-lib-staging`

## Next Steps

After completing this setup:

1. Test the complete staging workflow
2. Document any environment-specific configurations
3. Set up monitoring and alerting
4. Train team on staging environment usage
5. Establish staging data management procedures 