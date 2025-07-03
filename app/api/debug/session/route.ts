import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createSupabaseAdminClient } from '@/utils/supabase/server'

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ 
        error: 'No session found',
        session: null 
      })
    }

    // Get the user profile from profiles table
    const supabase = await createSupabaseAdminClient()
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user?.id)
      .single()

    // Also check if there's a profile with the email
    const { data: profileByEmail, error: emailError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', session.user?.email)
      .single()

    // Check next_auth users table too
    const { data: authUser, error: authError } = await supabase
      .from('next_auth.users')
      .select('*')
      .eq('id', session.user?.id)
      .single()

    return NextResponse.json({
      session: {
        user: session.user,
        expires: session.expires
      },
      profile: profile || null,
      profileError: profileError?.message || null,
      profileByEmail: profileByEmail || null,
      emailError: emailError?.message || null,
      authUser: authUser || null,
      authError: authError?.message || null,
      debug: {
        sessionUserId: session.user?.id,
        sessionUserEmail: session.user?.email,
        hasSupabaseAdapter: true
      }
    })
  } catch (error) {
    console.error('Debug session error:', error)
    return NextResponse.json(
      { error: 'Failed to debug session', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 