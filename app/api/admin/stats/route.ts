import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createSupabaseAdminClient } from '@/utils/supabase/server'
import { Analytics } from '@/lib/analytics'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Add admin role check here
    // For now, any authenticated user can access admin stats

    const supabase = await createSupabaseAdminClient()

    // Get analytics data from the Analytics class
    console.log('🔍 [Admin Stats] Fetching analytics data...')
    const analyticsData = await Analytics.getAnalyticsData(30)
    console.log('📊 [Admin Stats] Analytics data:', JSON.stringify(analyticsData, null, 2))
    
    console.log('💰 [Admin Stats] Fetching cost analysis...')
    const costAnalysis = await Analytics.getCostAnalysis(30)
    console.log('💰 [Admin Stats] Cost analysis:', JSON.stringify(costAnalysis, null, 2))

    // Get recent activity from analytics_events
    console.log('📋 [Admin Stats] Fetching recent activity...')
    const { data: recentEvents, error: eventsError } = await supabase
      .from('analytics_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (eventsError) {
      console.error('❌ [Admin Stats] Error fetching recent events:', eventsError)
    }

    // Format recent events for the frontend
    const recentActivity = (recentEvents || []).map(event => {
      const eventTypeMap: Record<string, string> = {
        'prompt_create': 'prompt_created',
        'user_signin': 'user_registered',
        'prompt_favorite': 'prompt_favorited'
      }

      const descriptionMap: Record<string, string> = {
        'prompt_create': 'Created a new prompt',
        'user_signin': 'User signed in',
        'prompt_favorite': 'Favorited a prompt',
        'prompt_view': 'Viewed a prompt',
        'prompt_copy': 'Copied a prompt',
        'prompt_use': 'Used a prompt',
        'prompt_vote': 'Voted on a prompt',
        'playground_generate': 'Generated AI response',
        'playground_use': 'Used the playground'
      }

      // Get user email from event data or profiles
      const eventData = event.event_data as Record<string, any> | null
      const userEmail = eventData?.email || eventData?.user_email || 'Anonymous'
      const userName = eventData?.name || userEmail.split('@')[0]

      return {
        id: event.id,
        type: eventTypeMap[event.event_type] || event.event_type,
        description: descriptionMap[event.event_type] || event.event_type.replace(/_/g, ' '),
        user: userName,
        timestamp: new Date(event.created_at).toLocaleString()
      }
    })

    console.log('📋 [Admin Stats] Recent activity:', recentActivity.length, 'events')

    // Get basic stats from database
    const { data: promptsData } = await supabase
      .from('prompt')
      .select('id, created_at, featured')
      .order('created_at', { ascending: false })

    const { data: usersData } = await supabase
      .from('profiles')
      .select('id, created_at')
      .order('created_at', { ascending: false })

    const totalPrompts = promptsData?.length || 0
    const featuredPrompts = promptsData?.filter(p => p.featured).length || 0
    const totalUsers = usersData?.length || 0

    // Calculate new prompts and users in the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const newPrompts = promptsData?.filter(p => 
      p.created_at && new Date(p.created_at) > thirtyDaysAgo
    ).length || 0

    const newUsers = usersData?.filter(u => 
      u.created_at && new Date(u.created_at) > thirtyDaysAgo
    ).length || 0

    // Combine all stats in the format expected by the frontend
    const stats = {
      totalUsers,
      totalPrompts,
      totalCategories: 0, // TODO: Add categories count
      totalTags: 0, // TODO: Add tags count
      overview: {
        totalUsers,
        newUsers,
        totalPrompts,
        newPrompts,
        featuredPrompts,
        totalInteractions: analyticsData.topEvents.reduce((sum, event) => sum + event.count, 0),
        totalApiCalls: costAnalysis.totalCalls,
        totalApiCost: costAnalysis.totalCost,
        totalTokensUsed: costAnalysis.totalTokens
      },
      analyticsData: {
        topEvents: analyticsData.topEvents,
        dailyMetrics: analyticsData.dailyMetrics.map(day => ({
          ...day,
          total_users: totalUsers,
          new_users: newUsers,
          total_prompts: totalPrompts,
          new_prompts: newPrompts,
          total_api_calls: costAnalysis.totalCalls,
          total_tokens_used: costAnalysis.totalTokens,
          total_api_cost_usd: costAnalysis.totalCost
        })),
        apiUsage: Object.entries(costAnalysis.costByProvider).map(([provider, data]) => ({
          provider,
          model: 'various',
          request_count: data.calls,
          total_tokens: data.tokens,
          total_cost: data.cost
        }))
      },
      costs: costAnalysis,
      recentActivity: recentActivity,
      systemHealth: {
        status: 'healthy',
        uptime: '99.9%',
        responseTime: '120ms',
        errorRate: '0.1%'
      },
      userStats: {
        newUsersToday: newUsers,
        activeUsers: analyticsData.dailyMetrics.reduce((sum, day) => sum + day.active_users, 0),
        totalSessions: 0 // TODO: Add sessions count
      },
      contentStats: {
        promptsToday: newPrompts,
        totalViews: analyticsData.topEvents.find(e => e.event_type === 'view')?.count || 0,
        totalShares: analyticsData.topEvents.find(e => e.event_type === 'share')?.count || 0
      }
    }

    console.log('📈 [Admin Stats] Final stats overview:', {
      totalInteractions: stats.overview.totalInteractions,
      totalApiCalls: stats.overview.totalApiCalls,
      totalApiCost: stats.overview.totalApiCost,
      topEventsCount: analyticsData.topEvents.length,
      dailyMetricsCount: analyticsData.dailyMetrics.length
    })

    return NextResponse.json(stats)

  } catch (error) {
    console.error('❌ [Admin Stats] Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    )
  }
}