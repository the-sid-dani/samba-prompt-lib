import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createSupabaseAdminClient } from '@/utils/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Add admin role check here
    // For now, any authenticated user can perform admin actions

    const { action } = await request.json()
    const promptId = params.id

    const supabase = await createSupabaseAdminClient()

    switch (action) {
      case 'feature':
        // Toggle featured status
        const { data: currentPrompt } = await supabase
          .from('prompt')
          .select('featured')
          .eq('id', promptId)
          .single()

        const newFeaturedStatus = !currentPrompt?.featured

        const { error: updateError } = await supabase
          .from('prompt')
          .update({ featured: newFeaturedStatus })
          .eq('id', promptId)

        if (updateError) throw updateError

        return NextResponse.json({ 
          message: `Prompt ${newFeaturedStatus ? 'featured' : 'unfeatured'} successfully`,
          featured: newFeaturedStatus
        })

      case 'approve':
        // For now, just return success - actual approval logic would be implemented here
        return NextResponse.json({ message: 'Prompt approval not yet implemented' })

      case 'delete':
        // Delete the prompt
        const { error: deleteError } = await supabase
          .from('prompt')
          .delete()
          .eq('id', promptId)

        if (deleteError) throw deleteError

        return NextResponse.json({ message: 'Prompt deleted successfully' })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Error performing prompt action:', error)
    return NextResponse.json(
      { error: 'Failed to perform prompt action' },
      { status: 500 }
    )
  }
}