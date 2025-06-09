-- Analytics Tracking Migration
-- Up Migration --------------------------------------------------------------

-- 1. Create analytics_events table for tracking all user interactions
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB DEFAULT '{}',
  session_id VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  page_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create api_usage_logs table for tracking API costs and token usage
CREATE TABLE IF NOT EXISTS public.api_usage_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  prompt_id BIGINT REFERENCES public.prompt(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- 'openai', 'anthropic', etc.
  model VARCHAR(100) NOT NULL,
  tokens_input INTEGER DEFAULT 0,
  tokens_output INTEGER DEFAULT 0,
  tokens_total INTEGER GENERATED ALWAYS AS (tokens_input + tokens_output) STORED,
  cost_usd DECIMAL(10, 6) DEFAULT 0,
  request_duration_ms INTEGER,
  status VARCHAR(20) DEFAULT 'success', -- 'success', 'error', 'timeout'
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create daily_metrics table for aggregated daily statistics
CREATE TABLE IF NOT EXISTS public.daily_metrics (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  total_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  total_prompts INTEGER DEFAULT 0,
  new_prompts INTEGER DEFAULT 0,
  total_api_calls INTEGER DEFAULT 0,
  total_tokens_used INTEGER DEFAULT 0,
  total_api_cost_usd DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Create user_sessions table for detailed session tracking
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id VARCHAR(255) NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  page_views INTEGER DEFAULT 0,
  actions_performed INTEGER DEFAULT 0,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Add indexes for performance
CREATE INDEX IF NOT EXISTS analytics_events_user_id_idx ON public.analytics_events (user_id);
CREATE INDEX IF NOT EXISTS analytics_events_event_type_idx ON public.analytics_events (event_type);
CREATE INDEX IF NOT EXISTS analytics_events_created_at_idx ON public.analytics_events (created_at);

CREATE INDEX IF NOT EXISTS api_usage_logs_user_id_idx ON public.api_usage_logs (user_id);
CREATE INDEX IF NOT EXISTS api_usage_logs_prompt_id_idx ON public.api_usage_logs (prompt_id);
CREATE INDEX IF NOT EXISTS api_usage_logs_created_at_idx ON public.api_usage_logs (created_at);
CREATE INDEX IF NOT EXISTS api_usage_logs_provider_idx ON public.api_usage_logs (provider);

CREATE INDEX IF NOT EXISTS daily_metrics_date_idx ON public.daily_metrics (date);

CREATE INDEX IF NOT EXISTS user_sessions_user_id_idx ON public.user_sessions (user_id);
CREATE INDEX IF NOT EXISTS user_sessions_session_id_idx ON public.user_sessions (session_id);
CREATE INDEX IF NOT EXISTS user_sessions_started_at_idx ON public.user_sessions (started_at);

-- 6. Enable Row Level Security
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for analytics_events
CREATE POLICY "Users can view their own analytics events" ON public.analytics_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert analytics events" ON public.analytics_events
  FOR INSERT WITH CHECK (true);

-- 8. RLS Policies for api_usage_logs
CREATE POLICY "Users can view their own API usage" ON public.api_usage_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert API usage logs" ON public.api_usage_logs
  FOR INSERT WITH CHECK (true);

-- 9. RLS Policies for daily_metrics (admin only)
CREATE POLICY "Admins can view daily metrics" ON public.daily_metrics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND email LIKE '%@samba.tv'
    )
  );

CREATE POLICY "System can manage daily metrics" ON public.daily_metrics
  FOR ALL WITH CHECK (true);

-- 10. RLS Policies for user_sessions
CREATE POLICY "Users can view their own sessions" ON public.user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage user sessions" ON public.user_sessions
  FOR ALL WITH CHECK (true);

-- 11. Create function to update daily metrics
CREATE OR REPLACE FUNCTION update_daily_metrics()
RETURNS void AS $$
BEGIN
  INSERT INTO public.daily_metrics (
    date,
    total_users,
    new_users,
    active_users,
    total_prompts,
    new_prompts,
    total_api_calls,
    total_tokens_used,
    total_api_cost_usd
  )
  SELECT
    CURRENT_DATE,
    (SELECT COUNT(*) FROM public.profiles),
    (SELECT COUNT(*) FROM public.profiles WHERE DATE(created_at) = CURRENT_DATE),
    (SELECT COUNT(DISTINCT user_id) FROM public.analytics_events WHERE DATE(created_at) = CURRENT_DATE),
    (SELECT COUNT(*) FROM public.prompt),
    (SELECT COUNT(*) FROM public.prompt WHERE DATE(created_at) = CURRENT_DATE),
    (SELECT COUNT(*) FROM public.api_usage_logs WHERE DATE(created_at) = CURRENT_DATE),
    (SELECT COALESCE(SUM(tokens_total), 0) FROM public.api_usage_logs WHERE DATE(created_at) = CURRENT_DATE),
    (SELECT COALESCE(SUM(cost_usd), 0) FROM public.api_usage_logs WHERE DATE(created_at) = CURRENT_DATE)
  ON CONFLICT (date) DO UPDATE SET
    total_users = EXCLUDED.total_users,
    new_users = EXCLUDED.new_users,
    active_users = EXCLUDED.active_users,
    total_prompts = EXCLUDED.total_prompts,
    new_prompts = EXCLUDED.new_prompts,
    total_api_calls = EXCLUDED.total_api_calls,
    total_tokens_used = EXCLUDED.total_tokens_used,
    total_api_cost_usd = EXCLUDED.total_api_cost_usd,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Down Migration ------------------------------------------------------------
-- Note: Uncomment these lines if you need to rollback

-- DROP FUNCTION IF EXISTS update_daily_metrics();
-- DROP TABLE IF EXISTS public.user_sessions;
-- DROP TABLE IF EXISTS public.daily_metrics;
-- DROP TABLE IF EXISTS public.api_usage_logs;
-- DROP TABLE IF EXISTS public.analytics_events; 