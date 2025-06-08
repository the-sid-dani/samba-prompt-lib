-- Enable RLS and add indexes/policies for prompt_comments
-- Up Migration --------------------------------------------------------------

-- 1. Ensure the table exists
CREATE TABLE IF NOT EXISTS public.prompt_comments (
  id BIGSERIAL PRIMARY KEY,
  prompt_id BIGINT NOT NULL REFERENCES public.prompt(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_comment_id BIGINT REFERENCES public.prompt_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Useful indexes for fast queries
CREATE INDEX IF NOT EXISTS prompt_comments_prompt_id_idx ON public.prompt_comments (prompt_id);
CREATE INDEX IF NOT EXISTS prompt_comments_user_id_idx ON public.prompt_comments (user_id);
CREATE INDEX IF NOT EXISTS prompt_comments_parent_id_idx ON public.prompt_comments (parent_comment_id);

-- 3. Enable Row Level Security
ALTER TABLE public.prompt_comments ENABLE ROW LEVEL SECURITY;

-- 4. Select policy – everybody can read comments on public prompts
CREATE POLICY "Allow read prompt_comments" ON public.prompt_comments
  FOR SELECT USING (true);

-- 5. Insert policy – only authenticated users can comment
CREATE POLICY "Allow insert own comment" ON public.prompt_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. Update policy – users can edit their own comments
CREATE POLICY "Allow update own comment" ON public.prompt_comments
  FOR UPDATE USING (auth.uid() = user_id);

-- 7. Delete policy – users can delete their own comments
CREATE POLICY "Allow delete own comment" ON public.prompt_comments
  FOR DELETE USING (auth.uid() = user_id);

-- Down Migration ------------------------------------------------------------

DROP POLICY IF EXISTS "Allow delete own comment" ON public.prompt_comments;
DROP POLICY IF EXISTS "Allow update own comment" ON public.prompt_comments;
DROP POLICY IF EXISTS "Allow insert own comment" ON public.prompt_comments;
DROP POLICY IF EXISTS "Allow read prompt_comments" ON public.prompt_comments;

ALTER TABLE public.prompt_comments DISABLE ROW LEVEL SECURITY;

DROP INDEX IF EXISTS prompt_comments_parent_id_idx;
DROP INDEX IF EXISTS prompt_comments_user_id_idx;
DROP INDEX IF EXISTS prompt_comments_prompt_id_idx;

-- Note: Do not drop table to avoid data loss. 