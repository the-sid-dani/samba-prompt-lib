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
    // For now, any authenticated user can access admin prompts

    const supabase = await createSupabaseAdminClient()

    // For now, return mock data since the exact schema may vary
    // TODO: Update with actual database query after schema is confirmed
    const transformedPrompts = [
      {
        id: 1,
        title: 'Sample Prompt 1',
        description: 'A sample prompt for testing',
        uses: 150,
        votes: 25,
        featured: true,
        created_at: new Date().toISOString(),
        author_name: 'Demo User',
        category_name: 'General',
        status: 'approved'
      },
      {
        id: 2,
        title: 'Sample Prompt 2',
        description: 'Another sample prompt',
        uses: 75,
        votes: 12,
        featured: false,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        author_name: 'Test User',
        category_name: 'Development',
        status: 'pending'
      }
    ]

    return NextResponse.json(transformedPrompts)

  } catch (error) {
    console.error('Error fetching admin prompts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin prompts' },
      { status: 500 }
    )
  }
}