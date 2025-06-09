import { createSupabaseAdminClient } from '@/utils/supabase/server'
import { calculateModelCost, formatCost, type CostCalculation } from '@/lib/ai-cost-utils'

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
   * Track a user interaction event
   * Uses the existing user_interactions table for basic tracking
   * TODO: Will use analytics_events table after migration
   */
  static async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      const supabase = await createSupabaseAdminClient()

      // Track in the existing user_interactions table for now
      if (event.userId && event.promptId && ['view', 'copy', 'fork', 'share', 'test'].includes(event.eventType)) {
        await supabase
          .from('user_interactions')
          .insert({
            user_id: event.userId,
            prompt_id: event.promptId,
            interaction_type: event.eventType as 'view' | 'copy' | 'fork' | 'share' | 'test'
          })
      }

      // Log additional event data for future analytics table
      console.log(`Analytics event tracked: ${event.eventType}`, {
        userId: event.userId,
        promptId: event.promptId,
        eventData: event.eventData,
        sessionId: event.sessionId,
        pageUrl: event.pageUrl
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

      // Log to console with cost information (will be database later)
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

      // TODO: Store in api_usage_logs table after migration
      // const supabase = await createSupabaseAdminClient()
      // await supabase.from('api_usage_logs').insert({...})
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
   * Get analytics data for admin dashboard
   */
  static async getAnalyticsData(days: number = 30) {
    try {
      const supabase = await createSupabaseAdminClient()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // Get user interactions as analytics events
      const { data: events } = await supabase
        .from('user_interactions')
        .select('interaction_type, created_at, user_id, prompt_id')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false })
        .limit(1000)

      // Count events by type
      const eventCounts = events?.reduce((acc, event) => {
        acc[event.interaction_type] = (acc[event.interaction_type] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

      const topEvents = Object.entries(eventCounts)
        .map(([type, count]) => ({ event_type: type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      // Get daily activity counts
      const dailyActivity = events?.reduce((acc, event) => {
        const date = new Date(event.created_at).toISOString().split('T')[0]
        if (!acc[date]) {
          acc[date] = { date, interactions: 0, unique_users: new Set() }
        }
        acc[date].interactions++
        acc[date].unique_users.add(event.user_id)
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

      // Mock API usage data (will be real after migration)
      const apiUsage = {
        totalCalls: 0,
        totalCost: 0,
        totalTokens: 0,
        byProvider: {}
      }

      return {
        dailyMetrics,
        topEvents,
        apiUsage
      }
    } catch (error) {
      console.error('Failed to get analytics data:', error)
      return {
        dailyMetrics: [],
        topEvents: [],
        apiUsage: {
          totalCalls: 0,
          totalCost: 0,
          totalTokens: 0,
          byProvider: {}
        }
      }
    }
  }

  /**
   * Get cost analysis for API usage
   * This will work with real data after migration
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
      // TODO: Replace with real database query after migration
      // For now, return mock data structure
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
    } catch (error) {
      console.error('Failed to get cost analysis:', error)
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