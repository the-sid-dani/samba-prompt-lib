import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/utils/supabase/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, context: RouteParams) {
  try {
    const params = await context.params
    const promptId = parseInt(params.id)

    if (isNaN(promptId)) {
      return NextResponse.json(
        { error: 'Invalid prompt ID' },
        { status: 400 }
      )
    }

    console.log(`[Playground API] Fetching prompt ${promptId} for playground`)

    const supabase = createSupabaseAdminClient()

    // Simple query focusing only on data needed for playground (using only existing columns)
    const { data: prompt, error } = await supabase
      .from('prompt')
      .select('id, title, content, description')
      .eq('id', promptId)
      .single()

    if (error) {
      console.error(`[Playground API] Database error:`, error)
      
      // List available prompts for debugging
      const { data: available } = await supabase
        .from('prompt')
        .select('id, title')
        .limit(10)
      
      const availableIds = available?.map((p: any) => p.id) || []
      
      return NextResponse.json(
        { 
          error: `Prompt ${promptId} not found`,
          available: availableIds,
          dbError: error.message 
        },
        { status: 404 }
      )
    }

    if (!prompt) {
      console.error(`[Playground API] No prompt returned for ID ${promptId}`)
      return NextResponse.json(
        { error: `Prompt ${promptId} not found` },
        { status: 404 }
      )
    }

    console.log(`[Playground API] Successfully fetched: ${prompt.title}`)

    return NextResponse.json({
      success: true,
      prompt: {
        id: prompt.id,
        title: prompt.title,
        content: prompt.content,
        system_prompt: '', // Default empty since column doesn't exist
        model: 'claude-3-5-sonnet-20241022', // Default model since column doesn't exist
        description: prompt.description
      }
    })

  } catch (error) {
    console.error('[Playground API] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 