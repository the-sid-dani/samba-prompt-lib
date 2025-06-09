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

    // Format users data
    const users = profiles?.map(profile => ({
      id: profile.id,
      name: profile.name || 'Unknown',
      email: profile.email || '',
      avatar: profile.avatar_url,
      role: 'user', // TODO: Implement role system
      status: 'active' as const, // TODO: Implement user status system
      lastActive: profile.updated_at || profile.created_at,
      promptCount: userPromptCounts[profile.id] || 0
    })) || []

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching admin users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}