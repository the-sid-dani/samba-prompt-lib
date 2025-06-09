-- Step 1: Extract all unique tags from prompts table and insert into tags table
-- This will only insert tags that don't already exist
INSERT INTO tags (name, created_at)
SELECT DISTINCT 
    unnest(tags) as name,
    NOW() as created_at
FROM prompts
WHERE tags IS NOT NULL
ON CONFLICT (name) DO NOTHING;

-- Step 2: Create a junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS prompt_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
    tag_id INT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(prompt_id, tag_id)
);

-- Step 3: Populate the junction table with existing relationships
INSERT INTO prompt_tags (prompt_id, tag_id)
SELECT 
    p.id as prompt_id,
    t.id as tag_id
FROM prompts p
CROSS JOIN LATERAL unnest(p.tags) AS tag_name
JOIN tags t ON t.name = tag_name
WHERE p.tags IS NOT NULL
ON CONFLICT (prompt_id, tag_id) DO NOTHING;

-- Step 4: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_prompt_tags_prompt_id ON prompt_tags(prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompt_tags_tag_id ON prompt_tags(tag_id);

-- Step 5: Create a view to make querying easier (optional but recommended)
CREATE OR REPLACE VIEW prompts_with_tags AS
SELECT 
    p.*,
    ARRAY_AGG(t.name ORDER BY t.name) AS tag_names,
    ARRAY_AGG(t.id ORDER BY t.name) AS tag_ids
FROM prompts p
LEFT JOIN prompt_tags pt ON p.id = pt.prompt_id
LEFT JOIN tags t ON pt.tag_id = t.id
GROUP BY p.id;

-- Step 6: Verify the migration worked correctly
-- This query should return the same tags for each prompt
SELECT 
    p.id,
    p.title,
    p.tags as original_tags,
    ARRAY_AGG(t.name ORDER BY t.name) as migrated_tags
FROM prompts p
LEFT JOIN prompt_tags pt ON p.id = pt.prompt_id
LEFT JOIN tags t ON pt.tag_id = t.id
WHERE p.tags IS NOT NULL
GROUP BY p.id, p.title, p.tags
LIMIT 10;

-- Step 7: ONLY run this after verifying everything works and updating your application code
-- ALTER TABLE prompts DROP COLUMN tags; 