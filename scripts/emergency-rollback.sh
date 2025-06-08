#!/bin/bash

# Emergency Rollback Script for SambaTV Prompt Library
# This script performs an emergency rollback to the last known good deployment

set -e

echo "🚨 EMERGENCY ROLLBACK INITIATED"
echo "Timestamp: $(date)"
echo "User: $(whoami)"
echo "Repository: $(git remote get-url origin)"

# Verify we're in the correct repository
if [[ ! -f "package.json" ]] || ! grep -q "next-saas-starter" package.json; then
  echo "❌ Error: Not in the correct repository directory"
  exit 1
fi

# Get current deployment info
CURRENT_COMMIT=$(git rev-parse HEAD)
CURRENT_BRANCH=$(git branch --show-current)
echo "Current commit: $CURRENT_COMMIT"
echo "Current branch: $CURRENT_BRANCH"

# Ensure we're on main branch
if [[ "$CURRENT_BRANCH" != "main" ]]; then
  echo "⚠️  Warning: Not on main branch. Switching to main..."
  git checkout main
  git pull origin main
fi

# Find last successful deployment
echo "🔍 Searching for last successful deployment..."

# Look for commits with successful deployment indicators
LAST_GOOD=$(git log --format="%H" --grep="✅" --grep="deploy.*success" --grep="production.*deploy" -1)

if [ -z "$LAST_GOOD" ]; then
  echo "⚠️  No deployment success markers found. Looking for recent stable commits..."
  
  # Fallback: look for commits that are not reverts or fixes
  LAST_GOOD=$(git log --format="%H" --grep="^feat:" --grep="^chore:" --grep="^docs:" -1)
  
  if [ -z "$LAST_GOOD" ]; then
    echo "❌ No suitable rollback target found"
    echo "Manual intervention required. Please specify a commit hash:"
    echo "Usage: $0 <commit-hash>"
    exit 1
  fi
fi

echo "📍 Last good commit identified: $LAST_GOOD"
git log --oneline -1 $LAST_GOOD

# Confirm rollback
echo ""
echo "⚠️  WARNING: This will force push to main branch and trigger production deployment"
echo "Current commit: $(git log --oneline -1 $CURRENT_COMMIT)"
echo "Rollback target: $(git log --oneline -1 $LAST_GOOD)"
echo ""

# In CI environment, skip confirmation
if [[ -z "$CI" ]]; then
  read -p "Continue with rollback? (yes/no): " CONFIRM
  if [[ "$CONFIRM" != "yes" ]]; then
    echo "❌ Rollback cancelled"
    exit 1
  fi
fi

# Create emergency rollback branch for tracking
ROLLBACK_BRANCH="emergency-rollback-$(date +%Y%m%d-%H%M%S)"
echo "📝 Creating rollback branch: $ROLLBACK_BRANCH"
git checkout -b "$ROLLBACK_BRANCH"

# Reset to last good commit
echo "⏪ Rolling back to: $LAST_GOOD"
git reset --hard $LAST_GOOD

# Add rollback commit message
git commit --allow-empty -m "🚨 Emergency rollback to $(git log --oneline -1 $LAST_GOOD)

Rollback initiated: $(date)
Previous commit: $CURRENT_COMMIT
Rollback target: $LAST_GOOD
Rollback branch: $ROLLBACK_BRANCH"

# Push rollback to main
echo "🚀 Pushing emergency rollback to main branch..."
git push --force origin main

# Switch back to rollback branch for record keeping
git checkout "$ROLLBACK_BRANCH"
git push origin "$ROLLBACK_BRANCH"

echo ""
echo "✅ Emergency rollback complete!"
echo "📊 Monitoring deployment..."
echo ""

# Wait for deployment to start
sleep 30

# Verify rollback
echo "🔍 Verifying rollback..."

# Health check with retries
MAX_RETRIES=10
RETRY_COUNT=0
HEALTH_URL="https://sambatv-prompt-lib-sid-danis-projects.vercel.app/api/health"

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  echo "Attempt $((RETRY_COUNT + 1))/$MAX_RETRIES: Checking health..."
  
  if curl -f -s "$HEALTH_URL" > /dev/null; then
    echo "✅ Health check passed"
    break
  else
    echo "⏳ Health check failed, retrying in 30 seconds..."
    sleep 30
    RETRY_COUNT=$((RETRY_COUNT + 1))
  fi
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
  echo "❌ Health check failed after $MAX_RETRIES attempts"
  echo "Manual verification required: $HEALTH_URL"
else
  echo "✅ Rollback verification successful"
fi

echo ""
echo "📋 Rollback Summary:"
echo "- Rollback branch: $ROLLBACK_BRANCH"
echo "- Previous commit: $CURRENT_COMMIT"
echo "- Rolled back to: $LAST_GOOD"
echo "- Health check: $HEALTH_URL"
echo "- Vercel dashboard: https://vercel.com/dashboard"
echo ""
echo "🔔 Next steps:"
echo "1. Monitor application performance"
echo "2. Notify team of rollback completion"
echo "3. Investigate root cause of original issue"
echo "4. Plan fix and re-deployment strategy"
echo ""
echo "Remember: Document this incident for post-mortem analysis" 