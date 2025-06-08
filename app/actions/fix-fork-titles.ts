'use server'

import { createSupabaseAdminClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

type UpdateResult = {
  id: number
  success: boolean
  error?: string
  oldTitle?: string
  newTitle?: string
}

export async function fixForkTitles() {
  try {
    const supabase = createSupabaseAdminClient()
    
    // First, get all prompts with '(Fork)' in the title
    const { data: affectedPrompts, error: fetchError } = await supabase
      .from('prompt')
      .select('id, title')
      .like('title', '%(Fork)%')
    
    if (fetchError) {
      throw new Error(`Failed to fetch prompts: ${fetchError.message}`)
    }
    
    console.log(`Found ${affectedPrompts?.length || 0} prompts with '(Fork)' in title`)
    
    // Update each prompt to remove '(Fork)' from the title
    const updates = affectedPrompts?.map(async (prompt: { id: number; title: string }): Promise<UpdateResult> => {
      const cleanTitle = prompt.title.replace(/\s*\(Fork\)\s*/g, '').trim()
      
      const { error: updateError } = await supabase
        .from('prompt')
        .update({ title: cleanTitle })
        .eq('id', prompt.id)
      
      if (updateError) {
        console.error(`Failed to update prompt ${prompt.id}:`, updateError)
        return { id: prompt.id, success: false, error: updateError.message }
      }
      
      return { id: prompt.id, success: true, oldTitle: prompt.title, newTitle: cleanTitle }
    }) || []
    
    const results = await Promise.all(updates)
    
    // Revalidate the home page to show updated titles
    revalidatePath('/')
    
    const successCount = results.filter((r: UpdateResult) => r.success).length
    const failureCount = results.filter((r: UpdateResult) => !r.success).length
    
    return {
      success: true,
      message: `Updated ${successCount} prompts. ${failureCount} failures.`,
      details: results
    }
  } catch (error) {
    console.error('Error in fixForkTitles:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
} 