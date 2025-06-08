# Database Migration Strategy

This document outlines the database migration strategy for the SambaTV Prompt Library application using Supabase.

## Overview

Our migration system provides:
- **Automated migrations** during CI/CD deployments
- **Version tracking** to ensure migrations are applied only once
- **Rollback capabilities** for emergency situations
- **Environment separation** between staging and production
- **Backup creation** before production migrations

## Migration Files

### Location
All migration files are stored in `supabase/migrations/` directory.

### Naming Convention
Migration files should follow this naming pattern:
```YYYYMMDD_HHMMSS_description.sql
```

Examples:
- `20241208_120000_create_users_table.sql`
- `20241208_130000_add_email_index.sql`
- `20241208_140000_update_prompts_schema.sql`

### File Structure
Each migration file should contain:
```sql
-- Migration: Description of what this migration does
-- Created: YYYY-MM-DD
-- Author: Developer Name

-- Migration SQL goes here
CREATE TABLE IF NOT EXISTS example_table (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_example_name ON example_table(name);

-- Add comments
COMMENT ON TABLE example_table IS 'Example table for demonstration';
```

## Migration Script Usage

### Running Migrations

#### In CI/CD Pipeline
Migrations run automatically during deployment:
```bash
# This happens automatically in GitHub Actions
node scripts/migrate-database.js
```

#### Manual Execution
For local development or manual deployment:
```bash
# Run pending migrations
npm run migrate

# Or directly with node
node scripts/migrate-database.js migrate
```

#### Environment Variables Required
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NODE_ENV=production  # For backup creation
```

### Rollback Procedures

#### Emergency Rollback
```bash
# Rollback the last applied migration
node scripts/migrate-database.js rollback
```

**⚠️ Important Notes:**
- Rollback only removes the migration record from `_migrations` table
- **Schema changes are NOT automatically reverted**
- Manual schema restoration may be required
- Consider restoring from backup for complex rollbacks

## Migration Tracking

### Migrations Table
The system automatically creates a `_migrations` table to track applied migrations:

```sql
CREATE TABLE _migrations (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) UNIQUE NOT NULL,
  applied_at TIMESTAMP DEFAULT NOW(),
  checksum VARCHAR(64)
);
```

### Fields Explanation
- **id**: Auto-incrementing primary key
- **filename**: Name of the migration file
- **applied_at**: Timestamp when migration was applied
- **checksum**: SHA-256 hash of migration content for integrity verification

## CI/CD Integration

### GitHub Actions Workflow
Migrations are integrated into the deployment pipeline:

```yaml
- name: Run Database Migrations
  run: |
    npm install
    node scripts/migrate-database.js
  env:
    NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
    SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
    NODE_ENV: production
```

### Deployment Flow
1. **Build & Test** - Code is built and tested
2. **Security Scan** - Dependencies are scanned for vulnerabilities
3. **Database Migration** - Pending migrations are applied
4. **Application Deployment** - New version is deployed
5. **Health Check** - Deployment is verified

## Environment Strategy

### Staging Environment
- **Purpose**: Test migrations before production
- **Database**: Separate Supabase project for staging
- **Process**: Migrations run on PR deployments to staging
- **Validation**: Manual testing and automated tests verify migration success

### Production Environment
- **Purpose**: Live application database
- **Database**: Production Supabase project
- **Process**: Migrations run on main branch deployments
- **Backup**: Automatic backup creation before migrations
- **Monitoring**: Health checks verify successful deployment

## Best Practices

### Writing Migrations

#### 1. Make Migrations Idempotent
Always use `IF NOT EXISTS` or similar constructs:
```sql
-- ✅ Good
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY
);

-- ❌ Bad
CREATE TABLE users (
  id SERIAL PRIMARY KEY
);
```

#### 2. Add Proper Indexes
Include necessary indexes in the same migration:
```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes immediately
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at);
```

#### 3. Handle Data Migrations Carefully
For data transformations, consider:
```sql
-- Update in batches for large tables
UPDATE users 
SET email_verified = false 
WHERE email_verified IS NULL 
AND id BETWEEN 1 AND 1000;

-- Add constraints after data cleanup
ALTER TABLE users 
ADD CONSTRAINT check_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
```

#### 4. Document Breaking Changes
```sql
-- BREAKING CHANGE: This migration removes the deprecated 'old_column'
-- Ensure all application code has been updated before applying
ALTER TABLE users DROP COLUMN IF EXISTS old_column;
```

### Testing Migrations

#### 1. Test in Staging First
- Always test migrations in staging environment
- Verify application functionality after migration
- Check performance impact on large tables

#### 2. Backup Before Major Changes
```bash
# Create manual backup before risky migrations
supabase db dump --file backup-before-migration.sql
```

#### 3. Monitor Migration Performance
- Test migrations on production-sized datasets
- Consider migration timing for low-traffic periods
- Monitor database performance during migration

## Troubleshooting

### Common Issues

#### 1. Migration Fails Midway
```bash
# Check migration status
SELECT * FROM _migrations ORDER BY applied_at DESC;

# Manual cleanup may be required
# Review failed migration and fix issues
# Re-run migration after fixes
```

#### 2. Checksum Mismatch
```bash
# If migration file was modified after being applied
# Remove from _migrations table and re-apply
DELETE FROM _migrations WHERE filename = 'problematic_migration.sql';
```

#### 3. Permission Issues
```bash
# Ensure service role key has proper permissions
# Check Supabase dashboard for RLS policies
# Verify environment variables are set correctly
```

### Emergency Procedures

#### 1. Rollback Process
1. **Immediate**: Use rollback script to remove migration record
2. **Assessment**: Determine if schema changes need manual reversion
3. **Restoration**: Restore from backup if necessary
4. **Verification**: Test application functionality
5. **Communication**: Notify team of rollback and next steps

#### 2. Database Restoration
```bash
# If backup restoration is needed
supabase db reset --file backup-before-migration.sql
```

## Monitoring and Alerts

### Health Checks
The application includes health checks that verify:
- Database connectivity
- Migration table accessibility
- Basic query functionality

### Monitoring Integration
Consider integrating with monitoring tools:
- **Sentry**: For migration error tracking
- **DataDog**: For database performance monitoring
- **Slack/Discord**: For deployment notifications

## Security Considerations

### Service Role Key
- **Storage**: Store in GitHub Secrets, never in code
- **Rotation**: Regularly rotate service role keys
- **Permissions**: Use least-privilege principle

### Migration Content
- **Review**: All migrations should be code-reviewed
- **Validation**: Test migrations in staging first
- **Backup**: Always backup before production migrations

## Future Enhancements

### Planned Improvements
1. **Automated Backup Integration**: Direct Supabase backup API integration
2. **Migration Validation**: Pre-flight checks for migration safety
3. **Performance Monitoring**: Track migration execution time and impact
4. **Advanced Rollback**: Automated schema rollback for simple changes
5. **Migration Dependencies**: Support for migration dependencies and ordering

### Tools Integration
- **Supabase CLI**: Enhanced integration with official tooling
- **Database Diff Tools**: Automated schema comparison
- **Migration Generators**: Tools to generate migrations from schema changes

---

For questions or issues with database migrations, refer to this documentation or contact the development team. 