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

    // Get prompts with author and category information
    const { data: prompts, error } = await supabase
      .from('prompt')
      .select(`
        id,
        title,
        description,
        uses,
        votes,
        featured,
        created_at,
        profiles:author_id (
          name,
          email
        ),
        categories:category_id (
          name
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    // Transform the data to flatten the nested objects
    const transformedPrompts = (prompts || []).map(prompt => ({
      id: prompt.id,
      title: prompt.title,
      description: prompt.description,
      uses: prompt.uses || 0,
      votes: prompt.votes || 0,
      featured: prompt.featured || false,
      created_at: prompt.created_at,
      author_name: prompt.profiles?.name || prompt.profiles?.email || 'Unknown',
      category_name: prompt.categories?.name || 'General',
      status: 'approved' // Default status for now
    }))

    return NextResponse.json(transformedPrompts)

  } catch (error) {
    console.error('Error fetching admin prompts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin prompts' },
      { status: 500 }
    )
  }
}