-- Remove '(Fork)' suffix from prompt titles
-- This script cleans up any prompts that have '(Fork)' appended to their titles

-- First, let's see how many prompts have this issue
SELECT COUNT(*) as affected_prompts
FROM prompt
WHERE title LIKE '%(Fork)%';

-- Update prompts to remove '(Fork)' suffix
UPDATE prompt
SET title = TRIM(REGEXP_REPLACE(title, '\s*\(Fork\)\s*', '', 'g'))
WHERE title LIKE '%(Fork)%';

-- Verify the update
SELECT id, title, forked_from
FROM prompt
WHERE title ~ '\(Fork\)'
LIMIT 10;