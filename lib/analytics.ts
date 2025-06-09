import { createSupabaseAdminClient } from '@/utils/supabase/server'
import { calculateModelCost, formatCost, type CostBreakdown } from '@/lib/ai-cost-utils'

export interface AnalyticsEvent {
  userId?: string
  promptId?: number
  eventType: string
  eventData?: Record<string, any>
  sessionId?: string
  pageUrl?: string
  ipAddress?: string
  userAgent?: string
  referrer?: string
}

export interface ApiUsageLog {
  userId?: string
  promptId?: number
  provider: string
  model: string
  tokensInput: number
  tokensOutput: number
  costUsd?: number
  requestDurationMs?: number
  status?: 'success' | 'error' | 'timeout'
  errorMessage?: string
}

export interface UserSession {
  userId: string
  sessionId: string
  startedAt?: Date
  endedAt?: Date
  pageViews?: number
  actionsPerformed?: number
  ipAddress?: string
  userAgent?: string
  referrer?: string
}

export class Analytics {
  /**
   * Track a user interaction event using the analytics_events table
   */
  static async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      const supabase = await createSupabaseAdminClient()

      // Insert into analytics_events table
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          user_id: event.userId || null,
          event_type: event.eventType,
          event_data: {
            prompt_id: event.promptId,
            ...event.eventData
          },
          session_id: event.sessionId || null,
          ip_address: event.ipAddress || null,
          user_agent: event.userAgent || null,
          referrer: event.referrer || null,
          page_url: event.pageUrl || null
        })

      if (error) {
        console.error('Failed to insert analytics event:', error)
        return
      }

      console.log(`Analytics event tracked: ${event.eventType}`, {
        userId: event.userId,
        promptId: event.promptId,
        eventData: event.eventData
      })
    } catch (error) {
      console.error('Failed to track analytics event:', error)
    }
  }

  /**
   * Log API usage for cost tracking with automatic cost calculation
   */
  static async logApiUsage(usage: ApiUsageLog): Promise<void> {
    try {
      const supabase = await createSupabaseAdminClient()

      // Calculate cost if not provided
      let costUsd = usage.costUsd
      if (costUsd === undefined) {
        const costCalculation = calculateModelCost(
          usage.provider,
          usage.model,
          usage.tokensInput,
          usage.tokensOutput
        )
        costUsd = costCalculation.totalCost
      }

      // Insert into api_usage_logs table
      const { error } = await supabase
        .from('api_usage_logs')
        .insert({
          user_id: usage.userId || null,
          prompt_id: usage.promptId || null,
          provider: usage.provider,
          model: usage.model,
          tokens_input: usage.tokensInput,
          tokens_output: usage.tokensOutput,
          cost_usd: costUsd,
          request_duration_ms: usage.requestDurationMs || null,
          status: usage.status || 'success',
          error_message: usage.errorMessage || null
        })

      if (error) {
        console.error('Failed to insert API usage log:', error)
        return
      }

      console.log(`API usage logged: ${usage.provider}/${usage.model}`, {
        inputTokens: usage.tokensInput,
        outputTokens: usage.tokensOutput,
        totalTokens: usage.tokensInput + usage.tokensOutput,
        cost: formatCost(costUsd),
        duration: usage.requestDurationMs ? `${usage.requestDurationMs}ms` : 'unknown',
        status: usage.status || 'success',
        userId: usage.userId,
        promptId: usage.promptId
      })
    } catch (error) {
      console.error('Failed to log API usage:', error)
    }
  }

  /**
   * Start a user session
   * TODO: Will use user_sessions table after migration
   */
  static async startSession(session: UserSession): Promise<void> {
    try {
      console.log(`Session started: ${session.sessionId} for user ${session.userId}`, {
        startedAt: session.startedAt || new Date(),
        pageViews: session.pageViews || 0,
        actionsPerformed: session.actionsPerformed || 0
      })
    } catch (error) {
      console.error('Failed to start session:', error)
    }
  }

  /**
   * End a user session
   */
  static async endSession(sessionId: string, actionsPerformed?: number): Promise<void> {
    try {
      console.log(`Session ended: ${sessionId}`, {
        actionsPerformed: actionsPerformed || 0,
        endedAt: new Date()
      })
    } catch (error) {
      console.error('Failed to end session:', error)
    }
  }

  /**
   * Get analytics data for admin dashboard using real analytics_events table
   */
  static async getAnalyticsData(days: number = 30) {
    try {
      console.log(`🔍 [Analytics] Getting analytics data for last ${days} days...`)
      const supabase = await createSupabaseAdminClient()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      console.log(`📅 [Analytics] Start date: ${startDate.toISOString()}`)

      // Get analytics events from the analytics_events table
      const { data: events, error } = await supabase
        .from('analytics_events')
        .select('event_type, event_data, created_at, user_id')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false })
        .limit(1000)

      console.log(`📊 [Analytics] Raw events query result:`, { 
        eventsCount: events?.length || 0, 
        error: error?.message || 'none',
        sampleEvent: events?.[0] || 'none'
      })

      if (error) {
        console.error('❌ [Analytics] Error fetching analytics events:', error)
        throw error
      }

      // Count events by type
      const eventCounts = events?.reduce((acc, event) => {
        acc[event.event_type] = (acc[event.event_type] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

      console.log(`📈 [Analytics] Event counts:`, eventCounts)

      const topEvents = Object.entries(eventCounts)
        .map(([type, count]) => ({ event_type: type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      console.log(`🏆 [Analytics] Top events:`, topEvents)

      // Get daily activity counts
      const dailyActivity = events?.reduce((acc, event) => {
        const date = new Date(event.created_at).toISOString().split('T')[0]
        if (!acc[date]) {
          acc[date] = { date, interactions: 0, unique_users: new Set() }
        }
        acc[date].interactions++
        if (event.user_id) {
          acc[date].unique_users.add(event.user_id)
        }
        return acc
      }, {} as Record<string, any>) || {}

      const dailyMetrics = Object.values(dailyActivity).map((day: any) => ({
        date: day.date,
        total_users: 0,
        new_users: 0,
        active_users: day.unique_users.size,
        total_prompts: 0,
        new_prompts: 0,
        total_api_calls: 0,
        total_tokens_used: 0,
        total_api_cost_usd: 0,
        interactions: day.interactions
      }))

      console.log(`📅 [Analytics] Daily metrics:`, { 
        daysWithActivity: dailyMetrics.length,
        totalInteractions: dailyMetrics.reduce((sum, day) => sum + day.interactions, 0)
      })

      const result = {
        dailyMetrics,
        topEvents,
        totalEvents: events?.length || 0
      }

      console.log(`✅ [Analytics] Final analytics result:`, {
        totalEvents: result.totalEvents,
        topEventsCount: result.topEvents.length,
        dailyMetricsCount: result.dailyMetrics.length
      })

      return result
    } catch (error) {
      console.error('❌ [Analytics] Failed to get analytics data:', error)
      return {
        dailyMetrics: [],
        topEvents: [],
        totalEvents: 0
      }
    }
  }

  /**
   * Get cost analysis for API usage using real api_usage_logs table
   */
  static async getCostAnalysis(days: number = 30): Promise<{
    totalCost: number
    totalTokens: number
    totalCalls: number
    averageCostPerCall: number
    averageCostPerToken: number
    costByProvider: Record<string, { cost: number; calls: number; tokens: number }>
    costByModel: Record<string, { cost: number; calls: number; tokens: number }>
    dailyCosts: Array<{ date: string; cost: number; calls: number }>
  }> {
    try {
      console.log(`💰 [Analytics] Getting cost analysis for last ${days} days...`)
      const supabase = await createSupabaseAdminClient()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      console.log(`📅 [Analytics] Cost analysis start date: ${startDate.toISOString()}`)

      // Get API usage data from the api_usage_logs table
      const { data: apiUsageData, error } = await supabase
        .from('api_usage_logs')
        .select('provider, model, tokens_input, tokens_output, cost_usd, created_at, status')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false })

      console.log(`💰 [Analytics] Raw API usage query result:`, { 
        usageCount: apiUsageData?.length || 0, 
        error: error?.message || 'none',
        sampleUsage: apiUsageData?.[0] || 'none'
      })

      if (error) {
        console.error('❌ [Analytics] Error fetching API usage data:', error)
        throw error
      }

      if (!apiUsageData || apiUsageData.length === 0) {
        console.log('⚠️ [Analytics] No API usage data found')
        return {
          totalCost: 0,
          totalTokens: 0,
          totalCalls: 0,
          averageCostPerCall: 0,
          averageCostPerToken: 0,
          costByProvider: {},
          costByModel: {},
          dailyCosts: []
        }
      }

      // Calculate totals
      let totalCost = 0
      let totalTokens = 0
      const totalCalls = apiUsageData.length
      const costByProvider: Record<string, { cost: number; calls: number; tokens: number }> = {}
      const costByModel: Record<string, { cost: number; calls: number; tokens: number }> = {}
      const dailyCosts: Record<string, { cost: number; calls: number }> = {}

      apiUsageData.forEach(usage => {
        const cost = usage.cost_usd || 0
        const tokens = (usage.tokens_input || 0) + (usage.tokens_output || 0)
        const date = new Date(usage.created_at).toISOString().split('T')[0]

        totalCost += cost
        totalTokens += tokens

        // Group by provider
        if (!costByProvider[usage.provider]) {
          costByProvider[usage.provider] = { cost: 0, calls: 0, tokens: 0 }
        }
        costByProvider[usage.provider].cost += cost
        costByProvider[usage.provider].calls += 1
        costByProvider[usage.provider].tokens += tokens

        // Group by model
        if (!costByModel[usage.model]) {
          costByModel[usage.model] = { cost: 0, calls: 0, tokens: 0 }
        }
        costByModel[usage.model].cost += cost
        costByModel[usage.model].calls += 1
        costByModel[usage.model].tokens += tokens

        // Group by date
        if (!dailyCosts[date]) {
          dailyCosts[date] = { cost: 0, calls: 0 }
        }
        dailyCosts[date].cost += cost
        dailyCosts[date].calls += 1
      })

      const averageCostPerCall = totalCalls > 0 ? totalCost / totalCalls : 0
      const averageCostPerToken = totalTokens > 0 ? totalCost / totalTokens : 0

      const dailyCostsArray = Object.entries(dailyCosts)
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => a.date.localeCompare(b.date))

      const result = {
        totalCost,
        totalTokens,
        totalCalls,
        averageCostPerCall,
        averageCostPerToken,
        costByProvider,
        costByModel,
        dailyCosts: dailyCostsArray
      }

      console.log(`✅ [Analytics] Final cost analysis result:`, {
        totalCost: result.totalCost,
        totalTokens: result.totalTokens,
        totalCalls: result.totalCalls,
        providersCount: Object.keys(result.costByProvider).length,
        modelsCount: Object.keys(result.costByModel).length
      })

      return result
    } catch (error) {
      console.error('❌ [Analytics] Failed to get cost analysis:', error)
      return {
        totalCost: 0,
        totalTokens: 0,
        totalCalls: 0,
        averageCostPerCall: 0,
        averageCostPerToken: 0,
        costByProvider: {},
        costByModel: {},
        dailyCosts: []
      }
    }
  }

  /**
   * Helper method to create API usage log with cost calculation
   */
  static createApiUsageLog(
    provider: string,
    model: string,
    inputTokens: number,
    outputTokens: number,
    options: {
      userId?: string
      promptId?: number
      requestDurationMs?: number
      status?: 'success' | 'error' | 'timeout'
      errorMessage?: string
    } = {}
  ): ApiUsageLog {
    const costCalculation = calculateModelCost(provider, model, inputTokens, outputTokens)
    
    return {
      provider,
      model,
      tokensInput: inputTokens,
      tokensOutput: outputTokens,
      costUsd: costCalculation.totalCost,
      ...options
    }
  }
}

// Convenience functions for common events
export const trackPromptView = (userId: string, promptId: number, sessionId?: string) =>
  Analytics.trackEvent({
    userId,
    promptId,
    eventType: 'view',
    sessionId
  })

export const trackPromptCopy = (userId: string, promptId: number, sessionId?: string) =>
  Analytics.trackEvent({
    userId,
    promptId,
    eventType: 'copy',
    sessionId
  })

export const trackPromptFork = (userId: string, promptId: number, sessionId?: string) =>
  Analytics.trackEvent({
    userId,
    promptId,
    eventType: 'fork',
    sessionId
  })

export const trackPromptShare = (userId: string, promptId: number, sessionId?: string) =>
  Analytics.trackEvent({
    userId,
    promptId,
    eventType: 'share',
    sessionId
  })

export const trackPromptTest = (userId: string, promptId: number, sessionId?: string) =>
  Analytics.trackEvent({
    userId,
    promptId,
    eventType: 'test',
    sessionId
  })

export const trackPlaygroundUsage = (userId: string, promptId?: number, sessionId?: string) =>
  Analytics.trackEvent({
    userId,
    promptId,
    eventType: 'test',
    sessionId
  })

// For events without prompts, we'll just log them for now
export const trackSearch = (userId: string, query: string, resultsCount: number, sessionId?: string) => {
  Analytics.trackEvent({
    userId,
    eventType: 'search',
    eventData: { query, resultsCount },
    sessionId
  })
}

export const trackPageView = (userId?: string, pageUrl?: string, sessionId?: string) => {
  Analytics.trackEvent({
    userId,
    eventType: 'page_view',
    eventData: { pageUrl },
    sessionId,
    pageUrl
  })
} 