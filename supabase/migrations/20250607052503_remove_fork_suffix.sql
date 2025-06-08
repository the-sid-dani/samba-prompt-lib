-- Remove '(Fork)' suffix from prompt titles
-- This script cleans up any prompts that have '(Fork)' appended to their titles

-- Update prompts to remove '(Fork)' suffix
UPDATE prompt
SET title = TRIM(REGEXP_REPLACE(title, '\s*\(Fork\)\s*$', '', 'g'))
WHERE title LIKE '%(Fork)%';

-- Also clean up any double '(Fork)' occurrences 
UPDATE prompt  
SET title = TRIM(REGEXP_REPLACE(title, '\s*\(Fork\)\s*\(Fork\)\s*$', '', 'g'))
WHERE title LIKE '%(Fork)%(Fork)%';

-- Clean up any remaining variations
UPDATE prompt
SET title = TRIM(REGEXP_REPLACE(title, '\s*\(Fork\)\s*', '', 'g'))
WHERE title LIKE '%(Fork)%';
