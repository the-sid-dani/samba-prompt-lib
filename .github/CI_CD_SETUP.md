# GitHub Actions CI/CD Pipeline Setup Guide

This guide will help you configure the GitHub Actions CI/CD pipeline for the SambaTV Prompt Library.

## Overview

The CI/CD pipeline includes:
- 🔨 **Build & Test**: TypeScript checks, linting, and automated tests
- 🔒 **Security Scan**: Vulnerability scanning (only fails on critical issues)
- 🚀 **Deploy to Staging**: Automatic deployment for PRs and staging branch
- 🚀 **Deploy to Production**: Automatic deployment for main branch
- 📢 **Notifications**: Status reports for all pipeline runs

## Required GitHub Secrets

You need to configure these secrets in your GitHub repository settings:

### 1. Vercel Deployment Secrets
Go to Settings → Secrets and variables → Actions, then add:

- `VERCEL_TOKEN` - Get from https://vercel.com/account/tokens
- `VERCEL_ORG_ID` - Found in Vercel project settings
- `VERCEL_PROJECT_ID` - Found in Vercel project settings

### 2. Application Secrets
These should match your `.env.local` values:

- `NEXTAUTH_SECRET` - Your NextAuth secret
- `NEXTAUTH_URL` - Your production URL (e.g., https://prompts.samba.tv)
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `SUPABASE_JWT_SECRET` - Supabase JWT secret
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

### 3. AI Provider Keys (Optional)
- `ANTHROPIC_API_KEY` - Anthropic API key
- `GEMINI_API_KEY` - Google Gemini API key
- `OPENROUTER_API_KEY` - OpenRouter API key

## Setting Up GitHub Environments

1. Go to Settings → Environments
2. Create two environments:
   - **staging**
   - **production**

3. For each environment, you can:
   - Add environment-specific secrets
   - Set deployment protection rules
   - Add required reviewers for production

## How to Configure Secrets

1. Navigate to your repository on GitHub
2. Go to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each secret with its name and value
5. Click "Add secret"

## Vercel Integration

1. Install Vercel GitHub integration: https://vercel.com/docs/git/vercel-for-github
2. Link your GitHub repository to a Vercel project
3. Get your Vercel tokens:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login
   vercel login
   
   # In your project directory
   vercel link
   
   # Get your org and project IDs
   cat .vercel/project.json
   ```

## Pipeline Behavior

### On Pull Request
- Runs build, test, and security checks
- Deploys to staging environment
- Posts status report

### On Push to Staging Branch
- Runs full pipeline
- Deploys to staging environment

### On Push to Main Branch
- Runs full pipeline
- Deploys to production environment
- Runs post-deployment health check

## Security Scanning

The pipeline includes security scanning that:
- Checks for vulnerabilities in dependencies
- Only fails on critical vulnerabilities
- Generates a security report artifact
- Allows moderate and high vulnerabilities (can be reviewed manually)

## Troubleshooting

### Pipeline Fails at Build & Test
- Check TypeScript errors: `pnpm exec tsc --noEmit`
- Fix linting issues: `pnpm lint`
- Ensure tests pass: `pnpm test`

### Pipeline Fails at Security Scan
- Run `pnpm audit` locally
- Update packages with critical vulnerabilities
- Review the security report in GitHub Actions artifacts

### Deployment Fails
- Verify all secrets are set correctly
- Check Vercel project settings
- Ensure Vercel integration is properly configured

## Local Testing

Before pushing, test locally:
```bash
# Type check
pnpm exec tsc --noEmit

# Lint
pnpm lint

# Test
pnpm test

# Security audit
pnpm audit --audit-level high

# Build
pnpm build
```

## Customization

To modify the pipeline:
1. Edit `.github/workflows/ci.yml`
2. Test changes in a feature branch
3. Create a PR to see the pipeline in action

## Support

For issues with:
- **GitHub Actions**: Check the Actions tab in your repository
- **Vercel Deployment**: Check Vercel dashboard logs
- **Security Issues**: Review the security report artifact 