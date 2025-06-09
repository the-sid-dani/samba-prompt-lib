-- Identify unused tags (tags in the tags table but not used by any prompts)

-- Step 1: Show unused tags
SELECT 
    t.id,
    t.name,
    t.created_at,
    COUNT(pt.prompt_id) as usage_count
FROM tags t
LEFT JOIN prompt_tags pt ON t.id = pt.tag_id
GROUP BY t.id, t.name, t.created_at
HAVING COUNT(pt.prompt_id) = 0
ORDER BY t.name;

-- Step 2: Count unused vs used tags
SELECT 
    CASE 
        WHEN usage_count = 0 THEN 'Unused'
        ELSE 'Used'
    END as status,
    COUNT(*) as tag_count
FROM (
    SELECT 
        t.id,
        COUNT(pt.prompt_id) as usage_count
    FROM tags t
    LEFT JOIN prompt_tags pt ON t.id = pt.tag_id
    GROUP BY t.id
) tag_usage
GROUP BY status;

-- Step 3: OPTIONAL - Delete unused tags (be careful!)
-- DELETE FROM tags
-- WHERE id NOT IN (
--     SELECT DISTINCT tag_id 
--     FROM prompt_tags
-- );

-- Step 4: Show most popular tags
SELECT 
    t.name,
    COUNT(pt.prompt_id) as usage_count
FROM tags t
JOIN prompt_tags pt ON t.id = pt.tag_id
GROUP BY t.id, t.name
ORDER BY usage_count DESC, t.name
LIMIT 20; 