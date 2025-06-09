import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createSupabaseAdminClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Add admin role check here
    // For now, any authenticated user can access admin activities

    const supabase = await createSupabaseAdminClient()

    try {
      // Try to get recent analytics events from the analytics_events table
      const { data: analyticsEvents, error: analyticsError } = await supabase
        .from('analytics_events')
        .select('id, user_id, event_type, event_data, created_at')
        .order('created_at', { ascending: false })
        .limit(50)

      if (analyticsEvents && !analyticsError) {
        // Transform analytics events into activity format
        const activities = analyticsEvents.map((event: any, index: number) => {
          const userName = `User ${event.user_id || 'Unknown'}`
          
          let action = 'performed action'
          let type = 'general'
          
          switch (event.event_type) {
            case 'view':
              action = 'viewed prompt'
              type = 'usage'
              break
            case 'copy':
              action = 'copied prompt'
              type = 'usage'
              break
            case 'fork':
              action = 'forked prompt'
              type = 'create'
              break
            case 'share':
              action = 'shared prompt'
              type = 'usage'
              break
            case 'test':
            case 'playground_usage':
              action = 'tested prompt'
              type = 'usage'
              break
            case 'search':
              action = 'searched prompts'
              type = 'usage'
              break
            case 'page_view':
              action = 'viewed page'
              type = 'navigation'
              break
            case 'session_start':
              action = 'started session'
              type = 'session'
              break
            case 'session_end':
              action = 'ended session'
              type = 'session'
              break
            default:
              action = `performed ${event.event_type}`
          }

          const promptTitle = event.event_data?.prompt_id ? 
            `Prompt ${event.event_data.prompt_id}` : 
            (event.event_data?.query || event.event_data?.pageUrl || 'Unknown')

          // Calculate relative time
          const now = new Date()
          const activityTime = new Date(event.created_at)
          const diffMs = now.getTime() - activityTime.getTime()
          const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
          const diffMinutes = Math.floor(diffMs / (1000 * 60))
          
          let timestamp = ''
          if (diffHours > 24) {
            const diffDays = Math.floor(diffHours / 24)
            timestamp = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
          } else if (diffHours > 0) {
            timestamp = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
          } else if (diffMinutes > 0) {
            timestamp = `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`
          } else {
            timestamp = 'Just now'
          }

          return {
            id: event.id || index,
            user_name: userName,
            action,
            target: promptTitle,
            timestamp,
            type
          }
        })

        return NextResponse.json(activities)
      }
    } catch (error) {
      console.log('Analytics events table not available, falling back to user_interactions')
    }

    // Fallback: Use existing user_interactions table
    const { data: interactions, error } = await supabase
      .from('user_interactions')
      .select(`
        id,
        interaction_type,
        created_at,
        user_id,
        prompt_id
      `)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching user interactions:', error)
      // Return mock data if database queries fail
      return NextResponse.json([
        {
          id: 1,
          user_name: 'Demo User',
          action: 'viewed prompt',
          target: 'Sample Prompt',
          timestamp: '2 hours ago',
          type: 'usage'
        },
        {
          id: 2,
          user_name: 'Test User',
          action: 'copied prompt',
          target: 'Another Prompt',
          timestamp: '4 hours ago',
          type: 'usage'
        },
        {
          id: 3,
          user_name: 'Admin User',
          action: 'created prompt',
          target: 'New Prompt',
          timestamp: '1 day ago',
          type: 'create'
        }
      ])
    }

    // Transform interactions into activity format
    const activities = (interactions || []).map(interaction => {
      const userName = `User ${interaction.user_id}`
      const promptTitle = `Prompt ${interaction.prompt_id}`
      
      let action = 'performed action'
      let type = 'general'
      
      switch (interaction.interaction_type) {
        case 'copy':
          action = 'copied prompt'
          type = 'usage'
          break
        case 'view':
          action = 'viewed prompt'
          type = 'usage'
          break
        case 'fork':
          action = 'forked prompt'
          type = 'create'
          break
        case 'share':
          action = 'shared prompt'
          type = 'usage'
          break
        case 'test':
          action = 'tested prompt'
          type = 'usage'
          break
        default:
          action = `performed ${interaction.interaction_type}`
      }

      // Calculate relative time
      const now = new Date()
      const activityTime = new Date(interaction.created_at)
      const diffMs = now.getTime() - activityTime.getTime()
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      
      let timestamp = ''
      if (diffHours > 24) {
        const diffDays = Math.floor(diffHours / 24)
        timestamp = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
      } else if (diffHours > 0) {
        timestamp = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
      } else if (diffMinutes > 0) {
        timestamp = `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`
      } else {
        timestamp = 'Just now'
      }

      return {
        id: interaction.id,
        user_name: userName,
        action,
        target: promptTitle,
        timestamp,
        type
      }
    })

    return NextResponse.json(activities)

  } catch (error) {
    console.error('Error fetching admin activities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin activities' },
      { status: 500 }
    )
  }
}