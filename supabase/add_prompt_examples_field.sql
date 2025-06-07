-- Add examples field to prompt table
ALTER TABLE public.prompt 
ADD COLUMN IF NOT EXISTS examples JSONB DEFAULT '[]'::jsonb;

-- Update the column comment
COMMENT ON COLUMN public.prompt.examples IS 'Array of example usage cases for the prompt';

-- Example structure for the examples field:
-- [
--   {
--     "input": "User input example",
--     "output": "Expected AI output",
--     "description": "Optional description of this example"
--   }
-- ]