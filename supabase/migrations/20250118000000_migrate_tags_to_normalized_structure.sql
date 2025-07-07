-- Migrate existing tags from the prompt.tags array column to the normalized tags and prompt_tags tables

-- First, populate the tags table with all unique tags from the prompt.tags arrays
INSERT INTO tags (name)
SELECT DISTINCT LOWER(TRIM(tag))
FROM prompt, UNNEST(tags) AS tag
WHERE tag IS NOT NULL AND TRIM(tag) != ''
ON CONFLICT (name) DO NOTHING;

-- Then, create the prompt_tags relationships
INSERT INTO prompt_tags (prompt_id, tag_id)
SELECT DISTINCT 
  p.id AS prompt_id,
  t.id AS tag_id
FROM prompt p
CROSS JOIN UNNEST(p.tags) AS tag_name
JOIN tags t ON LOWER(TRIM(tag_name)) = t.name
WHERE p.tags IS NOT NULL AND array_length(p.tags, 1) > 0
ON CONFLICT (prompt_id, tag_id) DO NOTHING;

-- Optional: After verifying the migration, you can drop the tags column from the prompt table
-- This is commented out for safety - run manually after verification
-- ALTER TABLE prompt DROP COLUMN tags;

-- Add a comment to indicate the migration has been completed
COMMENT ON TABLE tags IS 'Normalized tags table - migrated from prompt.tags array column';
COMMENT ON TABLE prompt_tags IS 'Junction table for many-to-many relationship between prompts and tags'; 