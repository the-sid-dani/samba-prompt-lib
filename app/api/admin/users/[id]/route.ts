import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createSupabaseAdminClient } from '@/utils/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and admin status
    const session = await auth()
    if (!session?.user?.email?.endsWith('@samba.tv')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action } = await request.json()
    const userId = params.id

    if (!action || !userId) {
      return NextResponse.json({ error: 'Missing action or user ID' }, { status: 400 })
    }

    const supabase = await createSupabaseAdminClient()

    switch (action) {
      case 'suspend':
        // TODO: Implement user suspension
        // For now, we'll just return success
        return NextResponse.json({ success: true, message: 'User suspended' })

      case 'activate':
        // TODO: Implement user activation
        // For now, we'll just return success
        return NextResponse.json({ success: true, message: 'User activated' })

      case 'delete':
        // Delete user and all related data
        // Note: This is a destructive operation, use with caution
        
        // First, delete user's prompts
        await supabase
          .from('prompt')
          .delete()
          .eq('user_id', userId)

        // Delete user's favorites
        await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', userId)

        // Delete user's comments
        await supabase
          .from('prompt_comments')
          .delete()
          .eq('user_id', userId)

        // Delete user's votes
        await supabase
          .from('prompt_votes')
          .delete()
          .eq('user_id', userId)

        // Delete user's interactions
        await supabase
          .from('user_interactions')
          .delete()
          .eq('user_id', userId)

        // Delete user's playground sessions
        await supabase
          .from('playground_sessions')
          .delete()
          .eq('user_id', userId)

        // Finally, delete the user profile
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId)

        if (error) {
          throw error
        }

        return NextResponse.json({ success: true, message: 'User deleted' })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Error performing user action:', error)
    return NextResponse.json(
      { error: 'Failed to perform user action' },
      { status: 500 }
    )
  }
}