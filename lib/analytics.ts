import { createSupabaseAdminClient } from '@/utils/supabase/server'

export interface AnalyticsEvent {
  userId?: string
  promptId?: number
  eventType: string
  eventData?: Record<string, any>
  sessionId?: string
  pageUrl?: string
}

export interface ApiUsageLog {
  userId?: string
  promptId?: number
  provider: string
  model: string
  tokensInput: number
  tokensOutput: number
  costUsd: number
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
}

export class Analytics {
  /**
   * Track a user interaction event
   * Uses the existing user_interactions table for basic tracking
   */
  static async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      const supabase = await createSupabaseAdminClient()

      // Only track events that have both user and prompt for the current table structure
      if (event.userId && event.promptId && ['view', 'copy', 'fork', 'share', 'test'].includes(event.eventType)) {
        await supabase
          .from('user_interactions')
          .insert({
            user_id: event.userId,
            prompt_id: event.promptId,
            interaction_type: event.eventType as 'view' | 'copy' | 'fork' | 'share' | 'test'
          })
      }

      console.log(`Analytics event tracked: ${event.eventType}`)
    } catch (error) {
      console.error('Failed to track analytics event:', error)
    }
  }

  /**
   * Log API usage for cost tracking
   * For now, we'll store this in a simple way until the full analytics tables are ready
   */
  static async logApiUsage(usage: ApiUsageLog): Promise<void> {
    try {
      // For now, we'll just log this to console until we have the proper table
      console.log(`API usage: ${usage.provider}/${usage.model} - Input: ${usage.tokensInput}, Output: ${usage.tokensOutput}, Cost: $${usage.costUsd}`)
    } catch (error) {
      console.error('Failed to log API usage:', error)
    }
  }

  /**
   * Start a user session
   */
  static async startSession(session: UserSession): Promise<void> {
    try {
      // For now, we'll just log this until we have the proper session table
      console.log(`Session started: ${session.sessionId} for user ${session.userId}`)
    } catch (error) {
      console.error('Failed to start session:', error)
    }
  }

  /**
   * End a user session
   */
  static async endSession(sessionId: string, actionsPerformed?: number): Promise<void> {
    try {
      console.log(`Session ended: ${sessionId}`)
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
        ...day,
        unique_users: day.unique_users.size
      }))

      return {
        dailyMetrics,
        topEvents,
        apiUsage: [] // Will be populated after migration
      }
    } catch (error) {
      console.error('Failed to get analytics data:', error)
      return {
        dailyMetrics: [],
        topEvents: [],
        apiUsage: []
      }
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
  console.log(`Search tracked: ${query} (${resultsCount} results) by ${userId}`)
}

export const trackPageView = (userId?: string, pageUrl?: string, sessionId?: string) => {
  console.log(`Page view tracked: ${pageUrl} by ${userId}`)
} 