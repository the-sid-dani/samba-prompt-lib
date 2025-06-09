-- Simple script to just populate the tags table with existing tags from prompts

-- Step 1: Clear out unused tags (optional - be careful!)
-- DELETE FROM tags WHERE id NOT IN (
--     SELECT DISTINCT t.id 
--     FROM tags t
--     JOIN prompts p ON t.name = ANY(p.tags)
-- );

-- Step 2: Insert all unique tags from prompts into tags table
INSERT INTO tags (name, created_at)
SELECT DISTINCT 
    unnest(tags) as name,
    NOW() as created_at
FROM prompts
WHERE tags IS NOT NULL
  AND tags != '{}'  -- Skip empty arrays
ON CONFLICT (name) DO NOTHING;

-- Step 3: Verify what tags were added
SELECT name, created_at 
FROM tags 
ORDER BY created_at DESC, name; 