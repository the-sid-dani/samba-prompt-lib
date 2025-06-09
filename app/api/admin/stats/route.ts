import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createSupabaseAdminClient } from '@/utils/supabase/server'
import { Analytics } from '@/lib/analytics'

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin status
    const session = await auth()
    if (!session?.user?.email?.endsWith('@samba.tv')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createSupabaseAdminClient()

    // Get total counts
    const [
      { count: totalPrompts },
      { count: totalUsers },
      { count: totalCategories },
      { count: totalTags }
    ] = await Promise.all([
      supabase.from('prompt').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('tags').select('*', { count: 'exact', head: true })
    ])

    // Get today's stats
    const today = new Date().toISOString().split('T')[0]
    const [
      { count: promptsToday },
      { count: newUsersToday }
    ] = await Promise.all([
      supabase
        .from('prompt')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today),
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today)
    ])

    // Get recent activity - recent prompts created
    const { data: recentPrompts } = await supabase
      .from('prompt')
      .select(`
        id,
        title,
        created_at,
        user_id
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    // Get user profiles for recent prompts
    const userIds = recentPrompts?.map(p => p.user_id).filter(Boolean) || []
    const { data: userProfiles } = await supabase
      .from('profiles')
      .select('id, name, email')
      .in('id', userIds)

    const recentActivity = recentPrompts?.map(prompt => {
      const profile = userProfiles?.find(p => p.id === prompt.user_id)
      return {
        id: prompt.id.toString(),
        type: 'prompt_created' as const,
        description: `New prompt "${prompt.title}" was created`,
        user: profile?.name || profile?.email?.split('@')[0] || 'Unknown',
        timestamp: new Date(prompt.created_at).toLocaleDateString()
      }
    }) || []

    // Get top contributors
    const { data: promptsByUser } = await supabase
      .from('prompt')
      .select('user_id')
      .not('user_id', 'is', null)

    // Count prompts per user
    const contributorCounts = promptsByUser?.reduce((acc, prompt) => {
      const userId = prompt.user_id
      if (userId) {
        acc[userId] = (acc[userId] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>) || {}

    // Get top contributor IDs
    const topContributorIds = Object.entries(contributorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([userId]) => userId)

    // Get profiles for top contributors
    const { data: topContributorProfiles } = await supabase
      .from('profiles')
      .select('id, name, email, avatar_url')
      .in('id', topContributorIds)

    const topContributors = topContributorIds.map(userId => {
      const profile = topContributorProfiles?.find(p => p.id === userId)
      return {
        name: profile?.name || profile?.email?.split('@')[0] || 'Unknown',
        promptCount: contributorCounts[userId],
        avatar: profile?.avatar_url
      }
    })

    // Get popular prompts based on uses and favorites
    const { data: popularPromptsData } = await supabase
      .from('prompt')
      .select(`
        id,
        title,
        uses,
        user_favorites(count)
      `)
      .order('uses', { ascending: false })
      .limit(5)

    const popularPrompts = popularPromptsData?.map(prompt => ({
      id: prompt.id.toString(),
      title: prompt.title,
      uses: prompt.uses || 0,
      favorites: Array.isArray(prompt.user_favorites) ? prompt.user_favorites.length : 0
    })) || []



    // System health - check database connectivity
    const { data: healthCheck } = await supabase
      .from('prompt')
      .select('id')
      .limit(1)

    const systemHealth = {
      database: healthCheck ? 'healthy' as const : 'error' as const,
      api: 'healthy' as const,
      storage: 'healthy' as const,
      lastChecked: new Date().toISOString()
    }

    // Get analytics data
    const analyticsData = await Analytics.getAnalyticsData(30)
    
    // Get cost analysis
    const costAnalysis = await Analytics.getCostAnalysis(30)

    const stats = {
      totalPrompts: totalPrompts || 0,
      totalUsers: totalUsers || 0,
      totalCategories: totalCategories || 0,
      totalTags: totalTags || 0,
      recentActivity,
      systemHealth,
      userStats: {
        activeUsers: totalUsers || 0,
        newUsersToday: newUsersToday || 0,
        topContributors
      },
      contentStats: {
        promptsToday: promptsToday || 0,
        popularPrompts
      },
      analyticsData,
      costAnalysis
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    )
  }
}