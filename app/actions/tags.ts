'use server'

import { createSupabaseAdminClient } from '@/utils/supabase/server'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache'
import { z } from 'zod'

// Tag schemas
const createTagSchema = z.object({
  name: z.string().min(1).max(50).trim(),
})

const updateTagSchema = z.object({
  name: z.string().min(1).max(50).trim(),
})

// Category schemas
const updateCategorySchema = z.object({
  name: z.string().min(1).max(100).trim(),
  description: z.string().nullable().optional(),
  display_order: z.number().int().min(0).optional(),
})

// Get all tags with usage count
export async function getTags() {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn('Supabase not configured, returning empty tags array')
      return []
    }

    const supabase = await createSupabaseAdminClient()
    
    // Get all tags
    const { data: tags, error: tagsError } = await supabase
      .from('tags')
      .select('*')
      .order('name')
    
    if (tagsError) throw tagsError
    
    // Get usage count for each tag
    const { data: promptTags, error: promptTagsError } = await supabase
      .from('prompt_tags')
      .select('tag_id')
    
    if (promptTagsError) throw promptTagsError
    
    // Count usage for each tag
    const tagUsageCount = promptTags.reduce((acc, pt) => {
      acc[pt.tag_id] = (acc[pt.tag_id] || 0) + 1
      return acc
    }, {} as Record<number, number>)
    
    // Add usage count to tags
    const tagsWithUsage = tags.map(tag => ({
      ...tag,
      usage_count: tagUsageCount[tag.id] || 0
    }))
    
    return tagsWithUsage
  } catch (error) {
    console.error('Error fetching tags:', error)
    return []
  }
}

// Create a new tag
export async function createTag(name: string) {
  const supabase = await createSupabaseAdminClient()
  
  try {
    const validatedData = createTagSchema.parse({ name })
    
    const { data, error } = await supabase
      .from('tags')
      .insert({ name: validatedData.name })
      .select()
      .single()
    
    if (error) throw error
    
    // Revalidate tags cache
    revalidateTag(CACHE_TAGS.prompts)
    
    return data
  } catch (error) {
    console.error('Error creating tag:', error)
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message)
    }
    throw new Error('Failed to create tag')
  }
}

// Update a tag
export async function updateTag(id: number, name: string) {
  const supabase = await createSupabaseAdminClient()
  
  try {
    const validatedData = updateTagSchema.parse({ name })
    
    const { data, error } = await supabase
      .from('tags')
      .update({ name: validatedData.name })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    // Revalidate tags cache
    revalidateTag(CACHE_TAGS.prompts)
    
    return data
  } catch (error) {
    console.error('Error updating tag:', error)
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message)
    }
    throw new Error('Failed to update tag')
  }
}

// Delete a tag
export async function deleteTag(id: number) {
  const supabase = await createSupabaseAdminClient()
  
  try {
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    // Revalidate tags cache
    revalidateTag(CACHE_TAGS.prompts)
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting tag:', error)
    throw new Error('Failed to delete tag')
  }
}

// Update a category
export async function updateCategory(id: number, data: z.infer<typeof updateCategorySchema>) {
  const supabase = await createSupabaseAdminClient()
  
  try {
    const validatedData = updateCategorySchema.parse(data)
    
    const { data: category, error } = await supabase
      .from('categories')
      .update(validatedData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    // Revalidate categories cache
    revalidateTag(CACHE_TAGS.categories)
    revalidateTag(CACHE_TAGS.categoryPrompts(id))
    
    return category
  } catch (error) {
    console.error('Error updating category:', error)
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message)
    }
    throw new Error('Failed to update category')
  }
}

// Delete a category
export async function deleteCategory(id: number) {
  const supabase = await createSupabaseAdminClient()
  
  try {
    // Check if category has prompts
    const { data: prompts, error: checkError } = await supabase
      .from('prompt')
      .select('id')
      .eq('category_id', id)
      .limit(1)
    
    if (checkError) throw checkError
    
    if (prompts && prompts.length > 0) {
      throw new Error('Cannot delete category with existing prompts')
    }
    
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    // Revalidate categories cache
    revalidateTag(CACHE_TAGS.categories)
    revalidateTag(CACHE_TAGS.categoryPrompts(id))
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting category:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to delete category')
  }
}

// Merge tags (combine multiple tags into one)
export async function mergeTags(sourceTagIds: number[], targetTagId: number) {
  const supabase = await createSupabaseAdminClient()
  
  try {
    // Get all prompt_tags entries for source tags
    const { data: promptTags, error: fetchError } = await supabase
      .from('prompt_tags')
      .select('prompt_id, tag_id')
      .in('tag_id', sourceTagIds)
    
    if (fetchError) throw fetchError
    
    // Group by prompt_id to avoid duplicates
    const promptsToUpdate = new Set<number>()
    promptTags.forEach(pt => {
      if (pt.tag_id !== targetTagId) {
        promptsToUpdate.add(pt.prompt_id)
      }
    })
    
    // Delete old prompt_tags entries
    const { error: deleteError } = await supabase
      .from('prompt_tags')
      .delete()
      .in('tag_id', sourceTagIds)
    
    if (deleteError) throw deleteError
    
    // Insert new prompt_tags entries for target tag
    const newPromptTags = Array.from(promptsToUpdate).map(promptId => ({
      prompt_id: promptId,
      tag_id: targetTagId
    }))
    
    if (newPromptTags.length > 0) {
      const { error: insertError } = await supabase
        .from('prompt_tags')
        .insert(newPromptTags)
        .select()
      
      if (insertError) throw insertError
    }
    
    // Delete source tags
    const { error: deleteTagsError } = await supabase
      .from('tags')
      .delete()
      .in('id', sourceTagIds)
    
    if (deleteTagsError) throw deleteTagsError
    
    // Revalidate caches
    revalidateTag(CACHE_TAGS.prompts)
    sourceTagIds.forEach(tagId => revalidateTag(CACHE_TAGS.tagPrompts(tagId.toString())))
    revalidateTag(CACHE_TAGS.tagPrompts(targetTagId.toString()))
    
    return { success: true, affectedPrompts: promptsToUpdate.size }
  } catch (error) {
    console.error('Error merging tags:', error)
    throw new Error('Failed to merge tags')
  }
}

// Get related tags (tags that often appear together)
export async function getRelatedTags(tagId: number, limit: number = 10) {
  const supabase = await createSupabaseAdminClient()
  
  try {
    // Get all prompts that have this tag
    const { data: promptsWithTag, error: promptsError } = await supabase
      .from('prompt_tags')
      .select('prompt_id')
      .eq('tag_id', tagId)
    
    if (promptsError) throw promptsError
    
    const promptIds = promptsWithTag.map(pt => pt.prompt_id)
    
    if (promptIds.length === 0) return []
    
    // Get all tags for these prompts
    const { data: relatedPromptTags, error: relatedError } = await supabase
      .from('prompt_tags')
      .select('tag_id, tags!inner(id, name)')
      .in('prompt_id', promptIds)
      .neq('tag_id', tagId)
    
    if (relatedError) throw relatedError
    
    // Count occurrences of each tag
    const tagCounts = relatedPromptTags.reduce((acc, pt) => {
      const tag = pt.tags as any
      if (tag) {
        acc[tag.id] = {
          ...tag,
          count: (acc[tag.id]?.count || 0) + 1
        }
      }
      return acc
    }, {} as Record<number, { id: number; name: string; count: number }>)
    
    // Sort by count and return top tags
    const sortedTags = Object.values(tagCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
    
    return sortedTags
  } catch (error) {
    console.error('Error getting related tags:', error)
    throw new Error('Failed to get related tags')
  }
} 