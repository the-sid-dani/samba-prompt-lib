# Tags Migration Guide

## Current Situation
- The `prompts` table has a `tags` column storing tags as a string array (e.g., `["coding", "ai"]`)
- A `tags` table exists but contains unused tags
- A `prompt_tags` junction table exists but is not being used
- The app currently reads tags directly from `prompts.tags` array

## Migration Strategy

### Phase 1: Populate Tables (Safe - Won't Break App)
1. Run `scripts/safe-tags-migration.sql` to:
   - Populate `tags` table with all unique tags from prompts
   - Populate `prompt_tags` junction table with relationships
   - Keep the `prompts.tags` column intact

### Phase 2: Update Application Code
Before removing the `prompts.tags` column, update your app to use the junction table:

1. **Update queries** to join through `prompt_tags`:
   ```sql
   -- Old way
   SELECT * FROM prompts WHERE 'coding' = ANY(tags);
   
   -- New way
   SELECT DISTINCT p.* 
   FROM prompts p
   JOIN prompt_tags pt ON p.id = pt.prompt_id
   JOIN tags t ON pt.tag_id = t.id
   WHERE t.name = 'coding';
   ```

2. **Update tag insertions** when creating prompts:
   ```typescript
   // Instead of inserting tags directly into prompts.tags
   // Insert tag relationships into prompt_tags
   ```

3. **Update the view** created in the migration for easier querying

### Phase 3: Clean Up (Only After App Updates)
1. Run cleanup queries to remove unused tags
2. Drop the `prompts.tags` column: `ALTER TABLE prompts DROP COLUMN tags;`

## Benefits of Migration
- Normalized database structure
- Better performance for tag queries
- Easier tag management (rename, merge, delete)
- Consistent tag naming
- Tag statistics and analytics

## Rollback Plan
If something goes wrong:
1. The `prompts.tags` column remains untouched during migration
2. Simply continue using the old method
3. Clear the `prompt_tags` table if needed

## Testing
After running the migration, verify:
1. All prompts have the same tags in both systems
2. Tag counts match
3. No data loss occurred 