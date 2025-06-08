import { NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/utils/supabase/server'

export async function GET() {
  try {
    const supabase = createSupabaseAdminClient()
    
    // Test basic connection
    const { data: prompts, error } = await supabase
      .from('prompt')
      .select('id, title, created_at')
      .limit(10)
    
    if (error) {
      return NextResponse.json({
        status: 'error',
        message: 'Database query failed',
        error: error.message,
        code: error.code
      }, { status: 500 })
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection working',
      promptCount: prompts?.length || 0,
      availablePrompts: prompts?.map(p => ({ id: p.id, title: p.title })) || [],
      envCheck: {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.SUPABASE_SECRET_KEY,
        urlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 