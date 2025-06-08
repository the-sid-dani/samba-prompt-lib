# Rollback Procedures

This document outlines the rollback procedures for the SambaTV Prompt Library application, covering both automated and manual rollback scenarios.

## Overview

Our rollback strategy provides multiple layers of protection:
- **Automatic rollbacks** via Vercel deployment management
- **Manual rollbacks** through CI/CD pipeline
- **Database rollbacks** via migration system
- **Emergency procedures** for critical incidents

## Vercel Automatic Rollbacks

### Built-in Rollback Features
Vercel provides automatic rollback capabilities:
- **Health check failures** trigger automatic rollbacks
- **Build failures** prevent deployment promotion
- **Performance degradation** can trigger automatic rollbacks

### Manual Vercel Rollbacks
1. **Via Vercel Dashboard:**
   - Go to Project → Deployments
   - Find the last known good deployment
   - Click "Promote to Production"

2. **Via Vercel CLI:**
   ```bash
   vercel --prod --force
   # Or rollback to specific deployment
   vercel rollback [deployment-url] --prod
   ```

## GitHub Actions Rollback

### Automated Rollback Triggers
Our CI/CD pipeline includes automatic rollback triggers:
- Health check failures after deployment
- Critical error rate thresholds exceeded
- Performance metrics below acceptable levels

### Manual Rollback via GitHub Actions

#### 1. Revert Commit Method
```bash
# Identify the problematic commit
git log --oneline

# Create revert commit
git revert <commit-hash>

# Push to trigger new deployment
git push origin main
```

#### 2. Reset to Previous Version
```bash
# Find last known good commit
git log --oneline

# Reset to previous version
git reset --hard <good-commit-hash>

# Force push (use with caution)
git push --force origin main
```

#### 3. Emergency Rollback Script
```bash
#!/bin/bash
# scripts/emergency-rollback.sh

# Get last successful deployment commit
LAST_GOOD_COMMIT=$(git log --format="%H" --grep="deploy: success" -1)

if [ -z "$LAST_GOOD_COMMIT" ]; then
  echo "No successful deployment found"
  exit 1
fi

echo "Rolling back to: $LAST_GOOD_COMMIT"
git reset --hard $LAST_GOOD_COMMIT
git push --force origin main

echo "Emergency rollback initiated"
```

## Database Rollback Procedures

### Migration Rollback
Our migration system supports rollback operations:

```bash
# Rollback last migration
npm run migrate:rollback

# Rollback to specific migration
npm run migrate:rollback -- --to=20241208_120000
```

### Database Backup Restoration
For critical database issues:

1. **Identify backup to restore:**
   ```sql
   -- List available backups
   SELECT * FROM _migration_backups 
   ORDER BY created_at DESC;
   ```

2. **Restore from backup:**
   ```bash
   # Restore from automated backup
   psql $DATABASE_URL < backup_20241208_120000.sql
   ```

3. **Verify restoration:**
   ```bash
   # Run health check
   curl https://your-app.vercel.app/api/health
   ```

## Rollback Decision Matrix

### When to Rollback

| Severity | Condition | Action | Timeline |
|----------|-----------|--------|----------|
| **P0** | Complete service outage | Immediate rollback | < 5 minutes |
| **P1** | Critical feature broken | Rollback if no quick fix | < 15 minutes |
| **P2** | Performance degradation | Rollback if > 50% impact | < 30 minutes |
| **P3** | Minor issues | Fix forward preferred | No immediate rollback |

### Rollback Triggers
- **Automatic triggers:**
  - Health check failures
  - Error rate > 5% for 5 minutes
  - Response time > 5s for 2 minutes
  - Database connectivity issues

- **Manual triggers:**
  - Critical bug reports
  - Security vulnerabilities
  - Data corruption detected
  - Team decision for stability

## Rollback Procedures by Environment

### Production Rollback
1. **Assess impact and severity**
2. **Notify team via incident channel**
3. **Execute rollback procedure:**
   ```bash
   # Option 1: Vercel Dashboard rollback (fastest)
   # Option 2: Git revert + push
   # Option 3: Emergency script
   ```
4. **Verify rollback success**
5. **Update incident status**
6. **Schedule post-mortem**

### Staging Rollback
1. **Identify issue in staging**
2. **Execute rollback:**
   ```bash
   # Reset staging branch
   git checkout staging
   git reset --hard <last-good-commit>
   git push --force origin staging
   ```
3. **Verify staging environment**
4. **Document issue for investigation**

## Emergency Rollback Checklist

### Immediate Actions (< 5 minutes)
- [ ] Confirm incident severity (P0/P1)
- [ ] Notify incident response team
- [ ] Identify last known good deployment
- [ ] Execute fastest rollback method
- [ ] Verify service restoration

### Follow-up Actions (< 30 minutes)
- [ ] Confirm all systems operational
- [ ] Update status page/communications
- [ ] Gather logs and error details
- [ ] Begin root cause analysis
- [ ] Document incident timeline

### Post-Rollback Actions (< 2 hours)
- [ ] Complete incident report
- [ ] Schedule post-mortem meeting
- [ ] Update rollback procedures if needed
- [ ] Plan fix and re-deployment strategy
- [ ] Communicate resolution to stakeholders

## Rollback Testing

### Regular Rollback Drills
- **Monthly staging rollbacks** to test procedures
- **Quarterly production rollback simulations**
- **Annual disaster recovery exercises**

### Test Scenarios
1. **Planned rollback test:**
   - Deploy test change to staging
   - Execute rollback procedure
   - Verify system restoration

2. **Emergency simulation:**
   - Simulate critical failure
   - Test emergency response time
   - Evaluate team coordination

3. **Database rollback test:**
   - Test migration rollback
   - Verify data integrity
   - Test backup restoration

## Monitoring During Rollbacks

### Key Metrics to Watch
- **Response times** returning to normal
- **Error rates** decreasing
- **Database performance** stable
- **User traffic** patterns
- **Health check** status

### Rollback Verification
```bash
# Health check verification
curl -f https://your-app.vercel.app/api/health

# Performance check
curl -w "@curl-format.txt" -s -o /dev/null https://your-app.vercel.app

# Database connectivity
npm run test:db-connection
```

## Communication During Rollbacks

### Internal Communication
- **Incident channel:** Immediate team notification
- **Status updates:** Every 15 minutes during active incident
- **Resolution notice:** When rollback complete

### External Communication
- **Status page updates** for user-facing issues
- **Customer notifications** for critical impacts
- **Post-incident reports** for transparency

## Rollback Scripts and Tools

### Emergency Rollback Script
```bash
#!/bin/bash
# scripts/emergency-rollback.sh

set -e

echo "🚨 EMERGENCY ROLLBACK INITIATED"
echo "Timestamp: $(date)"

# Get current deployment info
CURRENT_COMMIT=$(git rev-parse HEAD)
echo "Current commit: $CURRENT_COMMIT"

# Find last successful deployment
LAST_GOOD=$(git log --format="%H" --grep="✅ deploy: success" -1)
if [ -z "$LAST_GOOD" ]; then
  echo "❌ No successful deployment found"
  exit 1
fi

echo "Rolling back to: $LAST_GOOD"

# Create rollback branch
git checkout -b "emergency-rollback-$(date +%Y%m%d-%H%M%S)"
git reset --hard $LAST_GOOD

# Push rollback
git push --force origin main

echo "✅ Emergency rollback complete"
echo "Monitor: https://your-app.vercel.app/api/health"
```

### Rollback Verification Script
```bash
#!/bin/bash
# scripts/verify-rollback.sh

echo "🔍 Verifying rollback..."

# Health check
if curl -f -s https://your-app.vercel.app/api/health > /dev/null; then
  echo "✅ Health check passed"
else
  echo "❌ Health check failed"
  exit 1
fi

# Performance check
RESPONSE_TIME=$(curl -w "%{time_total}" -s -o /dev/null https://your-app.vercel.app)
if (( $(echo "$RESPONSE_TIME < 2.0" | bc -l) )); then
  echo "✅ Performance acceptable ($RESPONSE_TIME s)"
else
  echo "⚠️  Performance degraded ($RESPONSE_TIME s)"
fi

echo "✅ Rollback verification complete"
```

## Prevention Strategies

### Reducing Rollback Need
- **Comprehensive testing** in staging
- **Feature flags** for gradual rollouts
- **Blue-green deployments** for zero-downtime
- **Canary releases** for risk mitigation

### Early Warning Systems
- **Monitoring alerts** before user impact
- **Performance degradation** detection
- **Error rate** trend analysis
- **User feedback** monitoring

## Documentation Maintenance

### Regular Updates
- **Monthly review** of rollback procedures
- **Post-incident updates** based on lessons learned
- **Team training** on new procedures
- **Tool updates** and version changes

### Version Control
- All rollback scripts in version control
- Procedure documentation versioned
- Change log for procedure updates
- Team access to latest procedures

---

## Quick Reference

### Emergency Contacts
- **Incident Commander:** [Contact Info]
- **Technical Lead:** [Contact Info]
- **DevOps Engineer:** [Contact Info]

### Key Commands
```bash
# Quick health check
curl https://your-app.vercel.app/api/health

# Emergency rollback
./scripts/emergency-rollback.sh

# Verify rollback
./scripts/verify-rollback.sh

# Database rollback
npm run migrate:rollback
```

### Important URLs
- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Actions:** https://github.com/your-org/repo/actions
- **Monitoring Dashboard:** [Your monitoring URL]
- **Status Page:** [Your status page URL]

Remember: **When in doubt, rollback first, investigate later.** 