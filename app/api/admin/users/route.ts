import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createSupabaseAdminClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin status
    const session = await auth()
    if (!session?.user?.email?.endsWith('@samba.tv')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createSupabaseAdminClient()

    // Get all users with their prompt counts
    const { data: profiles } = await supabase
      .from('profiles')
      .select(`
        id,
        name,
        email,
        avatar_url,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false })

    if (!profiles) {
      return NextResponse.json({ users: [] })
    }

    // Get prompt counts for each user
    const { data: promptCounts } = await supabase
      .from('prompt')
      .select('user_id')
      .not('user_id', 'is', null)

    const userPromptCounts = promptCounts?.reduce((acc, prompt) => {
      const userId = prompt.user_id
      if (userId) {
        acc[userId] = (acc[userId] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>) || {}

    // Get user favorites counts
    const { data: favoriteCounts } = await supabase
      .from('user_favorites')
      .select('user_id')

    const userFavoriteCounts = favoriteCounts?.reduce((acc, favorite) => {
      const userId = favorite.user_id
      if (userId) {
        acc[userId] = (acc[userId] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>) || {}

    // Get user interactions for activity tracking
    const { data: recentInteractions } = await supabase
      .from('user_interactions')
      .select('user_id, created_at')
      .order('created_at', { ascending: false })

    const userLastActivity = recentInteractions?.reduce((acc, interaction) => {
      const userId = interaction.user_id
      if (userId && !acc[userId]) {
        acc[userId] = interaction.created_at
      }
      return acc
    }, {} as Record<string, string>) || {}

    // Format users data
    const users = profiles.map(profile => {
      const lastActivity = userLastActivity[profile.id] || profile.updated_at || profile.created_at
      const daysSinceLastActivity = lastActivity ? Math.floor(
        (Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24)
      ) : 0
      
      // Determine user status based on activity
      let status: 'active' | 'inactive' | 'new' = 'active'
      if (daysSinceLastActivity > 30) {
        status = 'inactive'
      } else if (daysSinceLastActivity <= 7 && userPromptCounts[profile.id] === undefined) {
        status = 'new'
      }

      // Use stored role from database (fallback to email-based calculation if role column doesn't exist yet)
      const role = (profile as any).role || (profile.email?.endsWith('@samba.tv') ? 'admin' : 'member')

      const user = {
        id: profile.id,
        name: profile.name || 'Unknown',
        email: profile.email || '',
        avatar: profile.avatar_url,
        role,
        status,
        lastActive: lastActivity,
        promptCount: userPromptCounts[profile.id] || 0,
        favoriteCount: userFavoriteCounts[profile.id] || 0,
        joinedAt: profile.created_at,
        daysSinceLastActivity
      }

      // Debug logging for the first few users
      if (profiles.indexOf(profile) < 3) {
        console.log(`User ${profile.email}:`, {
          promptCount: userPromptCounts[profile.id],
          lastActivity,
          daysSinceLastActivity,
          status,
          role
        })
      }

      return user
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching admin users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}