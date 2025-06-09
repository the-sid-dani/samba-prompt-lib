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

    // Get recent user interactions
    const { data: interactions, error } = await supabase
      .from('user_interactions')
      .select(`
        id,
        interaction_type,
        created_at,
        profiles:user_id (
          name,
          email
        ),
        prompt:prompt_id (
          title
        )
      `)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      throw error
    }

    // Transform interactions into activity format
    const activities = (interactions || []).map(interaction => {
      const userName = interaction.profiles?.name || 
                      interaction.profiles?.email?.split('@')[0] || 
                      'Unknown User'
      
      const promptTitle = interaction.prompt?.title || 'Unknown Prompt'
      
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
        case 'create':
          action = 'created prompt'
          type = 'create'
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