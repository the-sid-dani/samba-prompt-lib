import { NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/utils/supabase/server'

export async function POST() {
  try {
    const supabase = createSupabaseAdminClient()
    
    // First, get all prompts with "(Fork)" in their titles
    const { data: forkedPrompts, error: fetchError } = await supabase
      .from('prompt')
      .select('id, title')
      .like('title', '%(Fork)%')
    
    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to fetch prompts', details: fetchError.message },
        { status: 500 }
      )
    }
    
    if (!forkedPrompts || forkedPrompts.length === 0) {
      return NextResponse.json({ 
        message: 'No prompts with "(Fork)" in titles found',
        count: 0 
      })
    }
    
    // Delete all prompts with "(Fork)" in their titles
    const { error: deleteError, count } = await supabase
      .from('prompt')
      .delete()
      .like('title', '%(Fork)%')
    
    if (deleteError) {
      return NextResponse.json(
        { error: 'Failed to delete prompts', details: deleteError.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      message: `Successfully deleted ${count || forkedPrompts.length} prompts with "(Fork)" in titles`,
      count: count || forkedPrompts.length,
      deletedPrompts: forkedPrompts
    })
    
  } catch (error) {
    console.error('Error in cleanup-fork-titles:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}