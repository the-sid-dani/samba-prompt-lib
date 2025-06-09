-- Safe migration that populates tags without breaking the existing app

-- Step 1: Populate the tags table with all unique tags from prompts
INSERT INTO tags (name, created_at)
SELECT DISTINCT 
    unnest(tags) as name,
    NOW() as created_at
FROM prompt
WHERE tags IS NOT NULL
  AND tags != '{}'
ON CONFLICT (name) DO NOTHING;

-- Step 2: Populate the existing prompt_tags junction table
-- Clear existing entries first (in case there are any)
TRUNCATE prompt_tags;

-- Insert the relationships
INSERT INTO prompt_tags (prompt_id, tag_id)
SELECT 
    p.id as prompt_id,
    t.id as tag_id
FROM prompt p
CROSS JOIN LATERAL unnest(p.tags) AS tag_name
JOIN tags t ON t.name = tag_name
WHERE p.tags IS NOT NULL
  AND p.tags != '{}'
ON CONFLICT DO NOTHING;

-- Step 3: Verify the migration
SELECT 
    COUNT(DISTINCT name) as unique_tags_count,
    COUNT(*) as total_relationships
FROM tags t
JOIN prompt_tags pt ON t.id = pt.tag_id;

-- Step 4: Check a few examples
SELECT 
    p.id,
    p.title,
    p.tags as original_tags,
    ARRAY_AGG(t.name ORDER BY t.name) as migrated_tags
FROM prompt p
LEFT JOIN prompt_tags pt ON p.id = pt.prompt_id
LEFT JOIN tags t ON pt.tag_id = t.id
WHERE p.tags IS NOT NULL
  AND p.tags != '{}'
GROUP BY p.id, p.title, p.tags
LIMIT 5; 