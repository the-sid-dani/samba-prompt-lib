import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/utils/supabase/server'
import { getHumanReadableModelName, getProviderDisplayName } from '@/lib/model-utils'
import { requireAdmin } from '@/lib/auth-utils'

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin status
    await requireAdmin()
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {

    const supabase = await createSupabaseAdminClient()

    // Get all users with their prompt counts
    const { data: profiles } = await supabase
      .from('profiles')
      .select(`
        id,
        name,
        email,
        avatar_url,
        role,
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

    // Get model usage data for each user
    const { data: modelUsageData } = await supabase
      .from('api_usage_logs')
      .select('user_id, provider, model, tokens_input, tokens_output, cost_usd')
      .not('user_id', 'is', null)

    // Aggregate model usage by user
    const userModelUsage = modelUsageData?.reduce((acc, usage) => {
      const userId = usage.user_id
      if (!userId) return acc
      
      if (!acc[userId]) {
        acc[userId] = {}
      }
      
      const modelKey = `${usage.provider}:${usage.model}`
      if (!acc[userId][modelKey]) {
        acc[userId][modelKey] = {
          provider: usage.provider,
          model: usage.model,
          calls: 0,
          totalTokens: 0,
          totalCost: 0
        }
      }
      
      acc[userId][modelKey].calls += 1
      acc[userId][modelKey].totalTokens += (usage.tokens_input || 0) + (usage.tokens_output || 0)
      acc[userId][modelKey].totalCost += usage.cost_usd || 0
      
      return acc
    }, {} as Record<string, Record<string, { provider: string; model: string; calls: number; totalTokens: number; totalCost: number }>>)

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

      // Use stored role from database (default to member if not set)
      const role = (profile as any).role || 'member'

      // Format model usage for this user
      const modelUsage = userModelUsage?.[profile.id] 
        ? Object.values(userModelUsage[profile.id]).map(usage => ({
            provider: getProviderDisplayName(usage.provider),
            model: getHumanReadableModelName(usage.model),
            modelId: usage.model,
            calls: usage.calls,
            totalTokens: usage.totalTokens,
            totalCost: usage.totalCost
          })).sort((a, b) => b.calls - a.calls) // Sort by most used
        : []

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
        daysSinceLastActivity,
        modelUsage
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