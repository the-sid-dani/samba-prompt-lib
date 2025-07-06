'use server'

import { getSupabaseClient, createSupabaseAdminClient } from '@/utils/supabase/server'
import { auth } from '@/lib/auth'
import { Database } from '@/types/database.types'
import { z } from 'zod'
import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { revalidateTag, revalidatePath } from 'next/cache'
import { 
  CACHE_TAGS, 
  CACHE_TIMES,
  revalidateAfterPromptCreate,
  revalidateAfterPromptUpdate,
  revalidateAfterPromptDelete,
  revalidateAfterVote,
  revalidateAfterFavorite,
  revalidateAllPromptCaches
} from '@/lib/cache'

type Prompt = Database['public']['Tables']['prompt']['Row']
type PromptInsert = Database['public']['Tables']['prompt']['Insert']
type PromptUpdate = Database['public']['Tables']['prompt']['Update']

// Type for prompt with category
type PromptWithCategory = Prompt & {
  categories: Database['public']['Tables']['categories']['Row'] | null
  profiles?: {
    id: string
    email: string | null
    name: string | null
    username: string | null
  } | null
}

// Type for prompt with all relations
type PromptWithRelations = PromptWithCategory & {
  user_favorites: Array<{ user_id: string }>
  prompt_votes: Array<{ vote_type: string; user_id: string }>
  prompt_forks: Array<{ id: number }>
  prompt_versions: Array<Database['public']['Tables']['prompt_versions']['Row']>
  upvotes?: number
  downvotes?: number
  forkCount?: number
  isFavorited?: boolean
  userVote?: 'up' | 'down' | null
  profiles?: {
    id: string
    email: string | null
    name: string | null
    username: string | null
  } | null
  forked_from?: {
    id: number
    title: string
    user_id: string
    profiles: {
      id: string
      username: string | null
      name: string | null
      email: string | null
      avatar_url: string | null
    }
  }
}

// Input schemas
const createPromptSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(1000),
  content: z.string().min(1),
  category_id: z.number().nullable().optional(),
  tags: z.array(z.string()).optional().default([]),
  examples: z.array(z.object({
    input: z.string(),
    output: z.string(),
    description: z.string().optional()
  })).optional().default([]),
  forked_from: z.number().optional(),
})

const updatePromptSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).max(1000).optional(),
  content: z.string().min(1).optional(),
  category_id: z.number().nullable().optional(),
  tags: z.array(z.string()).optional(),
  examples: z.array(z.object({
    input: z.string(),
    output: z.string(),
    description: z.string().optional()
  })).optional(),
})

const fetchPromptsSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  category_id: z.number().int().positive().optional(),
  tag: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  user_id: z.string().optional(),
  author: z.string().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  popularity_min: z.number().int().min(0).optional(),
  popularity_max: z.number().int().optional(),
  sort_by: z.enum(['created_at', 'updated_at', 'votes', 'uses', 'title']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
})

// Input schemas for improvements
const suggestImprovementSchema = z.object({
  prompt_id: z.number().int().positive(),
  suggestion: z.string().min(10).max(5000),
  rationale: z.string().max(1000).optional(),
})

const reviewImprovementSchema = z.object({
  improvement_id: z.number().int().positive(),
  status: z.enum(['accepted', 'rejected']),
  review_note: z.string().optional(),
})

// Cached function to get categories
export const getCategories = unstable_cache(
  async () => {
    try {
      // Check if Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.warn('Supabase not configured, returning empty categories array')
        return []
      }

      const supabase = createSupabaseAdminClient()
      
      const { data: categories, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true })
      
      if (error) {
        console.error('Error fetching categories:', error)
        return []
      }
      
      return categories || []
    } catch (error) {
      console.error('Error in getCategories:', error)
      return []
    }
  },
  ['categories'],
  {
    tags: [CACHE_TAGS.categories],
    revalidate: CACHE_TIMES.static,
  }
)

// Cached function to get categories with prompt counts
export const getCategoriesWithCounts = unstable_cache(
  async () => {
    try {
      // Check if Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.warn('Supabase not configured, returning empty categories array')
        return []
      }

      const supabase = createSupabaseAdminClient()
      
      // First get all categories
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true })
      
      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError)
        return []
      }
      
      if (!categories || categories.length === 0) {
        return []
      }
      
      // Get prompt counts for each category
      const categoriesWithCounts = await Promise.all(
        categories.map(async (category) => {
          const { count, error: countError } = await supabase
            .from('prompt')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id)
          
          if (countError) {
            console.error(`Error counting prompts for category ${category.id}:`, countError)
            return { ...category, prompt_count: 0 }
          }
          
          return { ...category, prompt_count: count || 0 }
        })
      )
      
      return categoriesWithCounts
    } catch (error) {
      console.error('Error in getCategoriesWithCounts:', error)
      return []
    }
  },
  ['categories-with-counts'],
  {
    tags: [CACHE_TAGS.categories, CACHE_TAGS.prompts],
    revalidate: CACHE_TIMES.prompts,
  }
)

// Create a new category
export async function createCategory(name: string, description?: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Unauthorized: Must be logged in to create categories')
    }
    
    const supabase = createSupabaseAdminClient()
    
    // Check if category already exists
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .ilike('name', name)
      .single()
    
    if (existing) {
      throw new Error('Category already exists')
    }
    
    // Get the next display order
    const { data: maxOrder } = await supabase
      .from('categories')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1)
      .single()
    
    const nextOrder = (maxOrder?.display_order || 0) + 1
    
    // Create the category
    const { data: category, error } = await supabase
      .from('categories')
      .insert({
        name,
        description: description || `${name} related prompts`,
        display_order: nextOrder
      })
      .select()
      .single()
    
    if (error) {
      throw new Error(`Failed to create category: ${error.message}`)
    }
    
    // Revalidate categories cache
    revalidateTag(CACHE_TAGS.categories)
    
    return category
  } catch (error) {
    console.error('Error in createCategory:', error)
    throw error
  }
}

// Update an existing category
export async function updateCategory(id: number, name: string, description?: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Unauthorized: Must be logged in to update categories')
    }
    
    const supabase = createSupabaseAdminClient()
    
    // Check if another category with the same name exists (excluding current one)
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .ilike('name', name)
      .neq('id', id)
      .single()
    
    if (existing) {
      throw new Error('Another category with this name already exists')
    }
    
    // Update the category
    const { data: category, error } = await supabase
      .from('categories')
      .update({
        name,
        description: description || `${name} related prompts`
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      throw new Error(`Failed to update category: ${error.message}`)
    }
    
    // Revalidate categories cache
    revalidateTag(CACHE_TAGS.categories)
    
    return category
  } catch (error) {
    console.error('Error in updateCategory:', error)
    throw error
  }
}

// Fetch prompts with filtering and pagination
export async function fetchPrompts(input?: Partial<z.infer<typeof fetchPromptsSchema>>) {
  // Map frontend sort values to backend column names
  const sortMapping: Record<string, string> = {
    'popular': 'uses',      // Popular = most used
    'trending': 'votes',    // Trending = most voted
    'newest': 'created_at'  // Newest = most recently created
  }
  
  // Transform the input to map sort_by values
  const transformedInput = input ? {
    ...input,
    sort_by: input.sort_by && sortMapping[input.sort_by] ? sortMapping[input.sort_by] : input.sort_by
  } : {}
  
  const params = fetchPromptsSchema.parse(transformedInput)
  
  console.log('📋 [fetchPrompts] Called with params:', params)
  
  // Build cache tags based on parameters
  const cacheTags: string[] = [CACHE_TAGS.prompts]
  if (params.category_id) cacheTags.push(CACHE_TAGS.categoryPrompts(params.category_id))
  if (params.tag) cacheTags.push(CACHE_TAGS.tagPrompts(params.tag))
  if (params.user_id) cacheTags.push(CACHE_TAGS.userPrompts(params.user_id))
  
  // Create a unique cache key based on all parameters
  const cacheKey = [
    'prompts',
    String(params.page),
    String(params.limit),
    params.search || '',
    String(params.category_id || ''),
    params.tag || '',
    params.tags?.join(',') || '',
    String(params.featured || ''),
    params.user_id || '',
    params.author || '',
    params.date_from || '',
    params.date_to || '',
    String(params.popularity_min || ''),
    String(params.popularity_max || ''),
    params.sort_by,
    params.sort_order,
  ]

  console.log('💾 [fetchPrompts] Cache key:', cacheKey.join('-'))

  const cachedFetch = unstable_cache(
    async () => {
      try {
        console.log('🔄 [fetchPrompts] Cache miss - fetching fresh data from database');
        
        // Check if Supabase is configured
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
          console.warn('Supabase not configured, returning empty prompts array')
          return {
            prompts: [] as PromptWithCategory[],
            pagination: {
              page: params.page,
              limit: params.limit,
              total: 0,
              totalPages: 1,
              hasMore: false,
            },
          }
        }

        const supabase = createSupabaseAdminClient()
        console.log('✅ [fetchPrompts] Created supabase client');
        
        // Build the query
        let query = supabase
          .from('prompt')
          .select(`
            *,
            categories(*),
            user_favorites(user_id),
            prompt_forks!prompt_forks_original_prompt_id_fkey(id)
          `, { count: 'exact' })
        
        console.log('🔧 [fetchPrompts] Built base query');
        
        // Apply filters
        if (params.search) {
          query = query.or(
            `title.ilike.%${params.search}%,description.ilike.%${params.search}%,content.ilike.%${params.search}%`
          )
        }
        
        if (params.category_id) {
          query = query.eq('category_id', params.category_id)
        }
        
        if (params.tag) {
          query = query.contains('tags', [params.tag])
        }
        
        // Multi-tag filtering (any tag can be present - OR logic)
        if (params.tags && params.tags.length > 0) {
          query = query.overlaps('tags', params.tags)
        }
        
        if (params.featured !== undefined) {
          query = query.eq('featured', params.featured)
        }
        
        if (params.user_id) {
          query = query.eq('user_id', params.user_id)
        }
        
        // Date range filtering
        if (params.date_from) {
          query = query.gte('created_at', params.date_from)
        }
        
        if (params.date_to) {
          query = query.lte('created_at', params.date_to)
        }

        // Popularity range filtering
        if (params.popularity_min !== undefined) {
          query = query.gte('uses', params.popularity_min)
        }
        
        if (params.popularity_max !== undefined) {
          query = query.lte('uses', params.popularity_max)
        }
        
        // Apply sorting - special handling for trending
        if (params.sort_by === 'votes') {
          // For trending, we'll fetch all and sort by recent activity later
          query = query.order('created_at', { ascending: false })
        } else {
          query = query.order(params.sort_by, { ascending: params.sort_order === 'asc' })
        }
        
        // Apply pagination
        const from = (params.page - 1) * params.limit
        const to = from + params.limit - 1
        query = query.range(from, to)
        
        console.log('Executing query...');
        const { data: prompts, error, count } = await query
        
        console.log('Query result:', {
          promptsCount: prompts?.length || 0,
          totalCount: count,
          error: error?.message
        });
        
        if (error) {
          console.error('Database error:', error);
          throw new Error(`Failed to fetch prompts: ${error.message}`)
        }
        
        // If no prompts, return empty result
        if (!prompts || prompts.length === 0) {
          console.log('No prompts found, returning empty result');
          return {
            prompts: [] as PromptWithCategory[],
            pagination: {
              page: params.page,
              limit: params.limit,
              total: count || 0,
              totalPages: 1,
              hasMore: false,
            },
          }
        }
        
        // Fetch profile data for all prompts
        const userIds = [...new Set(prompts.map(p => p.user_id))].filter(Boolean)
        
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, email, name, username, avatar_url')
          .in('id', userIds)
        
        if (profileError) {
          console.warn('Error fetching profiles:', profileError);
        }
        
        // Create a map for quick lookup
        const profileMap = new Map(profiles?.map(p => [p.id, p]) || [])
        
        // Enrich prompts with profile data
        const enrichedPrompts = prompts.map(prompt => {
          const userFavorites = (prompt.user_favorites || []) as Array<{ user_id: string }>
          const isFavorited = params.user_id ? userFavorites.some(fav => fav.user_id === params.user_id) : false
          
          return {
            ...prompt,
            profiles: profileMap.get(prompt.user_id) || null,
            isFavorited,
            favoriteCount: userFavorites.length,
            forked_from: null // Simplified for now
          }
        })
        
        console.log('Successfully processed', enrichedPrompts.length, 'prompts');
        
        const totalPages = Math.ceil((count || 0) / params.limit)
        
        return {
          prompts: enrichedPrompts as PromptWithCategory[],
          pagination: {
            page: params.page,
            limit: params.limit,
            total: count || 0,
            totalPages: totalPages,
            hasMore: params.page < totalPages,
          },
        }
      } catch (error) {
        console.error('Error in fetchPrompts:', error)
        throw error
      }
    },
    cacheKey,
    {
      tags: cacheTags,
      revalidate: CACHE_TIMES.prompts,
    }
  )
  
  const startTime = Date.now()
  const result = await cachedFetch()
  const endTime = Date.now()
  
  console.log(`⚡ [fetchPrompts] Completed in ${endTime - startTime}ms - returned ${result.prompts.length} prompts`)
  
  return result
}

// Fetch a single prompt by ID with all relations
export async function fetchPromptById(id: number, userId?: string): Promise<PromptWithRelations | null> {
  console.log('🔍 [fetchPromptById] Called with id:', id, 'userId:', userId);
  
  // Create a cached version for this specific ID
  const getCachedPrompt = unstable_cache(
    async (promptId: number, currentUserId?: string) => {
      try {
        console.log('🔄 [fetchPromptById] Cache miss - fetching fresh data for promptId:', promptId);
        const supabase = createSupabaseAdminClient()
        
        // First, let's try a simple query to see if the prompt exists
        const { data: simplePrompt, error: simpleError } = await supabase
          .from('prompt')
          .select('id, title')
          .eq('id', promptId)
          .single()
        
        console.log('🔄 [fetchPromptById] Simple query result:', simplePrompt, 'error:', simpleError);
        
        const { data: prompt, error } = await supabase
          .from('prompt')
          .select(`
            *,
            categories(*),
            user_favorites(user_id),
            prompt_votes(vote_type, user_id),
            prompt_forks!prompt_forks_original_prompt_id_fkey(id),
            prompt_versions(*)
          `)
          .eq('id', promptId)
          .single()
        
        console.log('🔄 [fetchPromptById] Full query result:', prompt ? 'Found prompt' : 'No prompt', 'error:', error);
        
        if (error || !prompt) {
          console.log('🔄 [fetchPromptById] Returning null due to error or no prompt');
          return null
        }
        
        // Fetch profile data
        let profileData = null
        if (prompt.user_id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, email, name, username')
            .eq('id', prompt.user_id)
            .single()
          
          profileData = profile
        }
        
        // Fetch fork origin info if this prompt was forked
        let forkedFrom = null;
        const { data: forkRelation } = await supabase
          .from('prompt_forks')
          .select(`
            original_prompt_id,
            original_prompt:prompt!prompt_forks_original_prompt_id_fkey(
              id,
              title,
              user_id
            )
          `)
          .eq('forked_prompt_id', promptId)
          .single();
        
        if (forkRelation && forkRelation.original_prompt) {
          // Fetch the profile data for the original prompt author
          const { data: originalAuthorProfile } = await supabase
            .from('profiles')
            .select('id, username, name, email, avatar_url')
            .eq('id', forkRelation.original_prompt.user_id)
            .single();
          
          if (originalAuthorProfile) {
            forkedFrom = {
              ...forkRelation.original_prompt,
              profiles: originalAuthorProfile
            };
          }
        }
        
        // Cast the prompt to any to handle the complex type
        const promptData = prompt as any
        
        // Calculate metrics
        const promptVotes = (promptData.prompt_votes || []) as Array<{ vote_type: string; user_id: string }>
        const userFavorites = (promptData.user_favorites || []) as Array<{ user_id: string }>
        const promptForks = (promptData.prompt_forks || []) as Array<{ id: number }>
        
        const upvotes = promptVotes.filter(vote => vote.vote_type === 'up').length
        const downvotes = promptVotes.filter(vote => vote.vote_type === 'down').length
        const forkCount = promptForks.length
        
        // Check if current user has favorited or voted
        const isFavorited = currentUserId ? userFavorites.some(fav => fav.user_id === currentUserId) : false
        const userVote = currentUserId 
          ? promptVotes.find(vote => vote.user_id === currentUserId)?.vote_type as 'up' | 'down' | undefined
          : undefined
        
        // Construct the return object
        const result: PromptWithRelations = {
          id: promptData.id,
          title: promptData.title,
          description: promptData.description,
          content: promptData.content,
          category_id: promptData.category_id,
          tags: promptData.tags,
          user_id: promptData.user_id,
          featured: promptData.featured,
          uses: promptData.uses,
          votes: promptData.votes,
          created_at: promptData.created_at,
          updated_at: promptData.updated_at,
          examples: promptData.examples,
          categories: promptData.categories as Database['public']['Tables']['categories']['Row'] | null,
          user_favorites: userFavorites,
          prompt_votes: promptVotes,
          prompt_forks: promptForks,
          prompt_versions: (promptData.prompt_versions || []) as Array<Database['public']['Tables']['prompt_versions']['Row']>,
          upvotes,
          downvotes,
          forkCount,
          isFavorited,
          userVote: userVote || null,
          profiles: profileData,
          forked_from: forkedFrom || undefined,
        }
        
        return result
      } catch (error) {
        console.error('Error in fetchPromptById:', error)
        throw error
      }
    },
    [`prompt-${id}${userId ? `-${userId}` : ''}`],
    {
      tags: [CACHE_TAGS.prompt(id)],
      revalidate: CACHE_TIMES.promptDetail,
    }
  )
  
  console.log('🔄 [fetchPromptById] About to call getCachedPrompt');
  const result = await getCachedPrompt(id, userId);
  console.log('🔄 [fetchPromptById] Final result:', result ? 'Found prompt' : 'null');
  return result;
}

// Create a new prompt
export async function createPrompt(input: z.infer<typeof createPromptSchema>) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Unauthorized: Must be logged in to create prompts')
    }
    
    const validatedData = createPromptSchema.parse(input)
    // Use admin client to avoid redirect issues in server actions
    const supabase = createSupabaseAdminClient()
    
    // Separate forked_from from the main prompt data
    const { forked_from, ...promptDataWithoutFork } = validatedData
    
    const promptData: PromptInsert = {
      ...promptDataWithoutFork,
      user_id: session.user.id,
    }
    
    const { data: prompt, error } = await supabase
      .from('prompt')
      .insert(promptData)
      .select('*, categories(*)')
      .single()
    
    if (error) {
      throw new Error(`Failed to create prompt: ${error.message}`)
    }

    // Track prompt creation analytics
    try {
      // Check if analytics environment is configured before attempting to track
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { Analytics } = await import('@/lib/analytics')
      await Analytics.trackEvent({
        userId: session.user.id,
        promptId: prompt.id,
        eventType: 'prompt_create',
        eventData: {
          title: prompt.title,
          category_id: prompt.category_id,
          tags: prompt.tags,
          is_fork: !!forked_from,
          forked_from: forked_from
        }
      })
      }
    } catch (analyticsError) {
      console.error('Failed to track prompt creation analytics:', analyticsError)
      // Don't throw - analytics failure should not prevent prompt creation
    }
    
    // If this is a fork, create the fork relationship
    if (forked_from) {
      const { error: forkError } = await supabase
        .from('prompt_forks')
        .insert({
          original_prompt_id: forked_from,
          forked_prompt_id: prompt.id,
        })
      
      if (forkError) {
        console.error('Failed to record fork relationship:', forkError)
        // Don't throw here, the prompt was created successfully
      }
      
      // Track user interaction
      const { error: interactionError } = await supabase
        .from('user_interactions')
        .insert({
          user_id: session.user.id,
          prompt_id: forked_from,
          interaction_type: 'fork',
        })
      
      if (interactionError) {
        console.error('Failed to track fork interaction:', interactionError)
      }

      // Track fork analytics
      try {
        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const { Analytics } = await import('@/lib/analytics')
        await Analytics.trackEvent({
          userId: session.user.id,
          promptId: forked_from,
          eventType: 'fork',
          eventData: {
            new_prompt_id: prompt.id,
            new_prompt_title: prompt.title
          }
        })
        }
      } catch (analyticsError) {
        console.error('Failed to track fork analytics:', analyticsError)
        // Don't throw - analytics failure should not prevent prompt creation
      }
      
      // Revalidate the original prompt's cache to update fork count
      revalidateTag(CACHE_TAGS.prompt(forked_from))
    }
    
    // Revalidate caches - add more extensive revalidation
    revalidateAfterPromptCreate(
      session.user.id,
      validatedData.category_id || undefined,
      validatedData.tags
    )
    
    // Aggressive cache revalidation for immediate updates
    revalidatePath('/', 'layout')
    revalidatePath('/')
    revalidatePath('/prompt')
    revalidatePath('/categories')
    revalidatePath('/showcase')
    if (validatedData.category_id) {
      revalidatePath(`/categories/${validatedData.category_id}`)
    }
    
    // Revalidate tags pages
    if (validatedData.tags && validatedData.tags.length > 0) {
      validatedData.tags.forEach(tag => {
        revalidatePath(`/tags/${encodeURIComponent(tag)}`)
      })
    }
    
    // Force revalidate all prompt-related cache tags
    revalidateAllPromptCaches()
    
    return prompt as PromptWithCategory
  } catch (error) {
    console.error('Error in createPrompt:', error)
    throw error
  }
}

// Update an existing prompt
export async function updatePrompt(id: number, input: z.infer<typeof updatePromptSchema>) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Unauthorized: Must be logged in to update prompts')
    }
    
    const validatedData = updatePromptSchema.parse(input)
    // Use admin client to avoid redirect issues in server actions
    const supabase = createSupabaseAdminClient()
    
    // Check ownership and get current data
    const { data: existingPrompt, error: fetchError } = await supabase
      .from('prompt')
      .select('user_id, category_id, tags')
      .eq('id', id)
      .single()
    
    if (fetchError || !existingPrompt) {
      throw new Error('Prompt not found')
    }
    
    if (existingPrompt.user_id !== session.user.id) {
      throw new Error('Forbidden: You can only update your own prompts')
    }
    
    // Update the prompt
    const updateData: PromptUpdate = {
      ...validatedData,
      updated_at: new Date().toISOString(),
    }
    
    const { data: prompt, error: updateError } = await supabase
      .from('prompt')
      .update(updateData)
      .eq('id', id)
      .select('*, categories(*)')
      .single()
    
    if (updateError) {
      throw new Error(`Failed to update prompt: ${updateError.message}`)
    }
    
    // Revalidate caches - add more extensive revalidation
    revalidateAfterPromptUpdate(
      id,
      session.user.id,
      existingPrompt.category_id || undefined,
      validatedData.category_id !== undefined ? validatedData.category_id || undefined : existingPrompt.category_id || undefined,
      existingPrompt.tags || undefined,
      validatedData.tags || existingPrompt.tags || undefined
    )
    
    // Aggressive cache revalidation for immediate updates
    revalidatePath('/', 'layout')
    revalidatePath('/')
    revalidatePath('/prompt')
    revalidatePath('/categories')
    revalidatePath('/showcase')
    revalidatePath(`/prompt/${id}`)
    if (validatedData.category_id) {
      revalidatePath(`/categories/${validatedData.category_id}`)
    }
    if (existingPrompt.category_id && existingPrompt.category_id !== validatedData.category_id) {
      revalidatePath(`/categories/${existingPrompt.category_id}`)
    }
    
    // Revalidate tags pages
    const finalTags = validatedData.tags || existingPrompt.tags || []
    if (finalTags.length > 0) {
      finalTags.forEach(tag => {
        revalidatePath(`/tags/${encodeURIComponent(tag)}`)
      })
    }
    if (existingPrompt.tags && existingPrompt.tags.length > 0) {
      existingPrompt.tags.forEach(tag => {
        revalidatePath(`/tags/${encodeURIComponent(tag)}`)
      })
    }
    
    // Force revalidate all prompt-related cache tags
    revalidateAllPromptCaches()
    
    return prompt as PromptWithCategory
  } catch (error) {
    console.error('Error in updatePrompt:', error)
    throw error
  }
}

// Delete a prompt
export async function deletePrompt(id: number) {
  try {
    console.log(`🗑️ [Delete] Starting deletion of prompt ${id}`)
    
    // Check environment variables first
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ [Delete] Missing Supabase environment variables')
      throw new Error('Supabase configuration is missing. Admin operations cannot be performed.')
    }
    
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Unauthorized: Must be logged in to delete prompts')
    }
    
    console.log(`👤 [Delete] User ${session.user.id} attempting to delete prompt ${id}`)
    
    const supabase = createSupabaseAdminClient()
    
    // Check ownership and get current data
    const { data: existingPrompt, error: fetchError } = await supabase
      .from('prompt')
      .select('user_id, category_id, tags')
      .eq('id', id)
      .single()
    
    if (fetchError) {
      console.error('Error fetching prompt for deletion:', fetchError)
      throw new Error(`Prompt not found: ${fetchError.message}`)
    }
    
    if (!existingPrompt) {
      throw new Error('Prompt not found')
    }
    
    if (existingPrompt.user_id !== session.user.id) {
      throw new Error('Forbidden: You can only delete your own prompts')
    }
    
    // Use admin client for deleting related records to bypass RLS
    const adminSupabase = createSupabaseAdminClient()
    
    // Test admin client connectivity first
    console.log(`Testing admin client for prompt ${id} deletion...`)
    try {
      const { data: testData, error: testError } = await adminSupabase
        .from('prompt')
        .select('id')
        .eq('id', id)
        .single()
      
      if (testError) {
        console.error('Admin client test failed:', testError)
        throw new Error(`Admin client not working: ${testError.message}`)
      }
      console.log(`Admin client test successful for prompt ${id}`)
    } catch (testError) {
      console.error('Admin client connectivity test failed:', testError)
      throw new Error(`Cannot connect with admin client: ${testError}`)
    }
    
    console.log(`Starting deletion of prompt ${id} and related records...`)
    
    // Delete related records first to avoid foreign key constraint violations
    
    // 1. Delete prompt fork relationships (both as original and as fork) - separate operations
    console.log(`Deleting fork relationships for prompt ${id}...`)
    
    // Delete where this prompt is the original
    const { error: forkDeleteError1 } = await adminSupabase
      .from('prompt_forks')
      .delete()
      .eq('original_prompt_id', id)
    
    if (forkDeleteError1) {
      console.error('Error deleting prompt forks (as original):', forkDeleteError1)
      // Continue - this is not critical for deletion
    } else {
      console.log(`Deleted fork relationships where prompt ${id} is original`)
    }
    
    // Delete where this prompt is the fork
    const { error: forkDeleteError2 } = await adminSupabase
      .from('prompt_forks')
      .delete()
      .eq('forked_prompt_id', id)
    
    if (forkDeleteError2) {
      console.error('Error deleting prompt forks (as fork):', forkDeleteError2)
      // Continue - this is not critical for deletion
    } else {
      console.log(`Deleted fork relationships where prompt ${id} is forked`)
    }
    
    // 2. Delete user favorites (critical for referential integrity)
    console.log(`Deleting favorites for prompt ${id}...`)
    const { error: favoritesDeleteError } = await adminSupabase
      .from('user_favorites')
      .delete()
      .eq('prompt_id', id)
    
    if (favoritesDeleteError) {
      console.error('Error deleting prompt favorites:', favoritesDeleteError)
      throw new Error(`Failed to delete prompt favorites: ${favoritesDeleteError.message}`)
    }
    console.log(`Deleted favorites for prompt ${id}`)
    
    // 3. Delete user interactions (important for analytics)
    console.log(`Deleting interactions for prompt ${id}...`)
    const { error: interactionsDeleteError } = await adminSupabase
      .from('user_interactions')
      .delete()
      .eq('prompt_id', id)
    
    if (interactionsDeleteError) {
      console.error('Error deleting user interactions:', interactionsDeleteError)
      // Continue - this is not critical for deletion
    } else {
      console.log(`Deleted interactions for prompt ${id}`)
    }
    
    // 4. Delete prompt_tags (important for foreign key constraints)
    console.log(`Deleting prompt_tags for prompt ${id}...`)
    const { error: tagsDeleteError } = await adminSupabase
      .from('prompt_tags')
      .delete()
      .eq('prompt_id', id)
    
    if (tagsDeleteError) {
      console.error('Error deleting prompt_tags:', tagsDeleteError)
      // Continue - this is not always critical for deletion
    } else {
      console.log(`Deleted prompt_tags for prompt ${id}`)
    }

    // 5. Delete optional related records (non-critical, may not exist)
    const optionalTables = [
      { table: 'prompt_votes', name: 'votes' },
      { table: 'prompt_versions', name: 'versions' },
      { table: 'prompt_improvements', name: 'improvements' },
      { table: 'prompt_comments', name: 'comments' },
      { table: 'api_usage_logs', name: 'api usage logs' },
      { table: 'playground_sessions', name: 'playground sessions' }
    ]
    
    for (const { table, name } of optionalTables) {
      try {
        console.log(`Deleting ${name} for prompt ${id}...`)
        const { error } = await adminSupabase
          .from(table as any)
          .delete()
          .eq('prompt_id', id)
        
        if (error) {
          console.log(`Table ${table} may not exist or error occurred:`, error.message)
        } else {
          console.log(`Deleted ${name} for prompt ${id}`)
        }
      } catch (error) {
        console.log(`Skipping ${table} (table may not exist):`, error)
      }
    }
    
    // 6. Finally, delete the prompt itself using admin client to ensure it works
    console.log(`Deleting main prompt ${id}...`)
    const { error: deleteError, count } = await adminSupabase
      .from('prompt')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id) // Double-check ownership for safety
    
    if (deleteError) {
      console.error('Error deleting main prompt:', deleteError)
      
      // Check if it's a foreign key constraint error
      if (deleteError.code === '23503') {
        console.error('❌ [Delete] Foreign key constraint violation:', deleteError.details)
        throw new Error(`Cannot delete prompt: It is still referenced by other records. ${deleteError.details}`)
      }
      
      throw new Error(`Failed to delete prompt: ${deleteError.message}`)
    }
    
    console.log(`Successfully deleted prompt ${id}, deleted ${count} record(s)`)
    
    console.log(`✅ [Delete] Successfully deleted prompt ${id} and all related records`)
    
    // Revalidate caches
    revalidateAfterPromptDelete(
      id,
      session.user.id,
      existingPrompt.category_id || undefined,
      existingPrompt.tags || undefined
    )
    
    return { success: true, message: 'Prompt deleted successfully' }
  } catch (error) {
    console.error('❌ [Delete] Error in deletePrompt:', error)
    
    // Fallback: Try simple deletion if complex deletion fails
    try {
      console.log(`🔄 [Delete] Attempting fallback deletion for prompt ${id}`)
      const session = await auth()
      if (!session?.user?.id) {
        throw error // Re-throw original error if no session
      }
      
      const adminSupabase = createSupabaseAdminClient()
      
      // Just try to delete the main prompt directly and let database handle cascading deletes
      const { error: fallbackError } = await adminSupabase
        .from('prompt')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id)
      
      if (fallbackError) {
        console.error('❌ [Delete] Fallback deletion also failed:', fallbackError)
        throw error // Re-throw original error
      }
      
      console.log(`✅ [Delete] Fallback deletion successful for prompt ${id}`)
      
      // Still revalidate caches on success
      revalidateAfterPromptDelete(id, session.user.id)
      
      return { success: true, message: 'Prompt deleted successfully (via fallback)' }
    } catch (fallbackError) {
      console.error('❌ [Delete] Both primary and fallback deletion failed:', fallbackError)
      throw error // Re-throw original error
    }
  }
}

// Fetch prompts by user
export async function fetchPromptsByUser(userId: string, page = 1, limit = 20) {
  return fetchPrompts({ user_id: userId, page, limit })
}

// Fetch prompts by category
export async function fetchPromptsByCategory(categoryId: number, page = 1, limit = 20) {
  return fetchPrompts({ category_id: categoryId, page, limit })
}

// Fetch prompts by tag
export async function fetchPromptsByTag(tag: string, page = 1, limit = 20) {
  return fetchPrompts({ tag, page, limit })
}

// Fetch featured prompts
export async function fetchFeaturedPrompts(limit = 10) {
  return fetchPrompts({ featured: true, limit, sort_by: 'votes', sort_order: 'desc', page: 1 })
}

// Fetch trending prompts (based on recent activity)
export async function fetchTrendingPrompts(limit = 10) {
  try {
    const supabase = createSupabaseAdminClient()
    
    // Get prompts with most interactions in the last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const { data: interactions, error: interactionsError } = await supabase
      .from('user_interactions')
      .select('prompt_id')
      .gte('created_at', sevenDaysAgo.toISOString())
    
    if (interactionsError) {
      throw new Error(`Failed to fetch interactions: ${interactionsError.message}`)
    }
    
    // Count interactions per prompt
    const promptCounts = interactions?.reduce((acc, interaction) => {
      acc[interaction.prompt_id] = (acc[interaction.prompt_id] || 0) + 1
      return acc
    }, {} as Record<number, number>) || {}
    
    // Get top prompt IDs
    const topPromptIds = Object.entries(promptCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([id]) => parseInt(id))
    
    if (topPromptIds.length === 0) {
      // Fallback to most voted if no recent interactions
      return fetchPrompts({ limit, sort_by: 'votes', sort_order: 'desc', page: 1 })
    }
    
    // Fetch the actual prompts
    const { data: prompts, error } = await supabase
      .from('prompt')
      .select('*, categories(*)')
      .in('id', topPromptIds)
    
    if (error) {
      throw new Error(`Failed to fetch trending prompts: ${error.message}`)
    }
    
    // Sort by interaction count
    const sortedPrompts = prompts?.sort((a, b) => 
      (promptCounts[b.id] || 0) - (promptCounts[a.id] || 0)
    ) || []
    
    return {
      prompts: sortedPrompts as PromptWithCategory[],
      pagination: {
        page: 1,
        limit,
        total: sortedPrompts.length,
        totalPages: 1,
        hasMore: false,
      },
    }
  } catch (error) {
    console.error('Error in fetchTrendingPrompts:', error)
    throw error
  }
}

// Toggle favorite status for a prompt
export async function toggleFavorite(promptId: number) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Unauthorized: Must be logged in to favorite prompts')
    }
    
    const supabase = await getSupabaseClient()
    
    // Check if already favorited
    const { data: existing, error: checkError } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('prompt_id', promptId)
      .eq('user_id', session.user.id)
      .single()
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
      throw new Error(`Failed to check favorite status: ${checkError.message}`)
    }
    
    if (existing) {
      // Remove favorite
      const { error: deleteError } = await supabase
        .from('user_favorites')
        .delete()
        .eq('id', existing.id)
      
      if (deleteError) {
        throw new Error(`Failed to remove favorite: ${deleteError.message}`)
      }
      
      // Track unfavorite analytics
      try {
        const { Analytics } = await import('@/lib/analytics')
        await Analytics.trackEvent({
          userId: session.user.id,
          promptId: promptId,
          eventType: 'unfavorite',
          eventData: {}
        })
      } catch (analyticsError) {
        console.error('Failed to track unfavorite analytics:', analyticsError)
      }

      // Revalidate caches
      revalidateAfterFavorite(promptId, session.user.id)
      
      return { favorited: false }
    } else {
      // Add favorite
      const { error: insertError } = await supabase
        .from('user_favorites')
        .insert({ prompt_id: promptId, user_id: session.user.id })
      
      if (insertError) {
        throw new Error(`Failed to add favorite: ${insertError.message}`)
      }
      
      // Track favorite analytics
      try {
        const { Analytics } = await import('@/lib/analytics')
        await Analytics.trackEvent({
          userId: session.user.id,
          promptId: promptId,
          eventType: 'favorite',
          eventData: {}
        })
      } catch (analyticsError) {
        console.error('Failed to track favorite analytics:', analyticsError)
      }

      // Revalidate caches
      revalidateAfterFavorite(promptId, session.user.id)
      
      return { favorited: true }
    }
  } catch (error) {
    console.error('Error in toggleFavorite:', error)
    throw error
  }
}

// Vote on a prompt
export async function voteOnPrompt(promptId: number, voteType: 'up' | 'down') {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Unauthorized: Must be logged in to vote on prompts')
    }
    
    const supabase = await getSupabaseClient()
    
    // Check existing vote
    const { data: existing, error: checkError } = await supabase
      .from('prompt_votes')
      .select('id, vote_type')
      .eq('prompt_id', promptId)
      .eq('user_id', session.user.id)
      .single()
    
    if (checkError && checkError.code !== 'PGRST116') {
      throw new Error(`Failed to check vote status: ${checkError.message}`)
    }
    
    if (existing) {
      if (existing.vote_type === voteType) {
        // Remove vote if clicking the same vote type
        const { error: deleteError } = await supabase
          .from('prompt_votes')
          .delete()
          .eq('id', existing.id)
        
        if (deleteError) {
          throw new Error(`Failed to remove vote: ${deleteError.message}`)
        }
        
        // Update prompt vote count
        await updatePromptVoteCount(promptId, voteType, -1)

        // Track vote removal analytics
        try {
          const { Analytics } = await import('@/lib/analytics')
          await Analytics.trackEvent({
            userId: session.user.id,
            promptId: promptId,
            eventType: 'vote_remove',
            eventData: {
              previous_vote_type: voteType
            }
          })
        } catch (analyticsError) {
          console.error('Failed to track vote removal analytics:', analyticsError)
        }
        
        // Revalidate caches
        revalidateAfterVote(promptId, session.user.id)
        
        return { vote: null }
      } else {
        // Update vote type
        const { error: updateError } = await supabase
          .from('prompt_votes')
          .update({ vote_type: voteType })
          .eq('id', existing.id)
        
        if (updateError) {
          throw new Error(`Failed to update vote: ${updateError.message}`)
        }
        
        // Update prompt vote counts
        await updatePromptVoteCount(promptId, existing.vote_type as 'up' | 'down', -1)
        await updatePromptVoteCount(promptId, voteType, 1)

        // Track vote change analytics
        try {
          const { Analytics } = await import('@/lib/analytics')
          await Analytics.trackEvent({
            userId: session.user.id,
            promptId: promptId,
            eventType: 'vote_change',
            eventData: {
              previous_vote_type: existing.vote_type,
              new_vote_type: voteType
            }
          })
        } catch (analyticsError) {
          console.error('Failed to track vote change analytics:', analyticsError)
        }
        
        // Revalidate caches
        revalidateAfterVote(promptId, session.user.id)
        
        return { vote: voteType }
      }
    } else {
      // Add new vote
      const { error: insertError } = await supabase
        .from('prompt_votes')
        .insert({ prompt_id: promptId, user_id: session.user.id, vote_type: voteType })
      
      if (insertError) {
        throw new Error(`Failed to add vote: ${insertError.message}`)
      }
      
      // Update prompt vote count
      await updatePromptVoteCount(promptId, voteType, 1)

      // Track new vote analytics
      try {
        const { Analytics } = await import('@/lib/analytics')
        await Analytics.trackEvent({
          userId: session.user.id,
          promptId: promptId,
          eventType: 'vote',
          eventData: {
            vote_type: voteType
          }
        })
      } catch (analyticsError) {
        console.error('Failed to track new vote analytics:', analyticsError)
      }
      
      // Revalidate caches
      revalidateAfterVote(promptId, session.user.id)
      
      return { vote: voteType }
    }
  } catch (error) {
    console.error('Error in voteOnPrompt:', error)
    throw error
  }
}

// Helper function to update prompt vote count
async function updatePromptVoteCount(promptId: number, voteType: 'up' | 'down', change: number) {
  const supabase = createSupabaseAdminClient()
  
  // Get current votes
  const { data: prompt, error: fetchError } = await supabase
    .from('prompt')
    .select('votes')
    .eq('id', promptId)
    .single()
  
  if (fetchError) {
    throw new Error(`Failed to fetch prompt for vote update: ${fetchError.message}`)
  }
  
  // Update votes (simplified - in production you might track up/down separately)
  const newVotes = Math.max(0, (prompt.votes || 0) + (voteType === 'up' ? change : -change))
  
  const { error: updateError } = await supabase
    .from('prompt')
    .update({ votes: newVotes })
    .eq('id', promptId)
  
  if (updateError) {
    throw new Error(`Failed to update prompt vote count: ${updateError.message}`)
  }
}

// Fetch existing tags for autocomplete - using normalized tags table
export async function fetchTags(query?: string): Promise<string[]> {
  try {
    const supabase = createSupabaseAdminClient()
    
    console.log('fetchTags called with query:', query)
    
    // Use the normalized tags table with usage count from prompt_tags junction table
    let dbQuery = supabase
      .from('tags')
      .select(`
        name,
        prompt_tags(count)
      `)
      .order('name', { ascending: true })
    
    // Apply query filter if provided
    if (query && query.length >= 2) {
      dbQuery = dbQuery.ilike('name', `%${query}%`)
    }
    
    const { data: tagsData, error } = await dbQuery
    
    if (error) {
      console.error('Error fetching tags from tags table:', error)
      
      // Fallback to old method if tags table query fails
      console.log('Falling back to old tags method...')
      return await fetchTagsFromPrompts(query)
    }
    
    console.log('Tags fetched from normalized table:', tagsData?.length || 0)
    
    // Calculate usage count for each tag and sort by popularity
    const tagsWithUsage = tagsData?.map(tag => ({
      name: tag.name,
      usage_count: tag.prompt_tags?.length || 0
    })) || []
    
    // Sort by usage count (descending), then alphabetically
    const sortedTags = tagsWithUsage
      .sort((a, b) => {
        if (b.usage_count !== a.usage_count) {
          return b.usage_count - a.usage_count
        }
        return a.name.localeCompare(b.name)
      })
      .map(tag => tag.name)
    
    console.log('Returning', sortedTags.length, 'tags (no limit applied)')
    
    // Return ALL tags (removed the slice limit)
    return sortedTags
  } catch (error) {
    console.error('Error in fetchTags:', error)
    
    // Fallback to old method
    return await fetchTagsFromPrompts(query)
  }
}

// Fallback function using the old prompt.tags array method
async function fetchTagsFromPrompts(query?: string): Promise<string[]> {
  try {
    const supabase = createSupabaseAdminClient()
    
    console.log('Using fallback: fetching tags from prompt.tags arrays')
    
    const dbQuery = supabase
      .from('prompt')
      .select('tags')
      .not('tags', 'is', null)
      .limit(1000) // Limit to recent prompts for better performance
      .order('created_at', { ascending: false })
    
    const { data: prompts, error } = await dbQuery
    
    if (error) {
      console.error('Error fetching tags from prompts:', error)
      throw new Error(`Failed to fetch tags: ${error.message}`)
    }
    
    // Extract and count unique tags more efficiently
    const tagCounts = new Map<string, number>()
    
    prompts?.forEach(prompt => {
      if (prompt.tags && Array.isArray(prompt.tags)) {
        prompt.tags.forEach(tag => {
          if (typeof tag === 'string' && tag.trim()) {
            const normalizedTag = tag.toLowerCase().trim()
            // Pre-filter during extraction if query is provided
            if (!query || query.length < 2 || normalizedTag.includes(query.toLowerCase())) {
              tagCounts.set(normalizedTag, (tagCounts.get(normalizedTag) || 0) + 1)
            }
          }
        })
      }
    })
    
    // Convert to array and sort by popularity, then alphabetically
    let uniqueTags = Array.from(tagCounts.entries())
      .sort((a, b) => {
        // First sort by popularity (descending)
        if (b[1] !== a[1]) {
          return b[1] - a[1]
        }
        // Then sort alphabetically for tags with same popularity
        return a[0].localeCompare(b[0])
      })
      .map(([tag]) => tag)
    
    // Additional filtering if query is provided and wasn't pre-filtered
    if (query && query.length >= 2) {
      const lowerQuery = query.toLowerCase()
      uniqueTags = uniqueTags.filter(tag => tag.includes(lowerQuery))
    }
    
    console.log('Fallback method returning', uniqueTags.length, 'tags (no limit applied)')
    
    // Return ALL tags (removed the slice limit)
    return uniqueTags
  } catch (error) {
    console.error('Error in fetchTagsFromPrompts fallback:', error)
    return []
  }
}

// Global map to track recent increment operations (server-side protection)
const recentIncrements = new Map<string, number>()

// Increment prompt uses counter when copied - atomic database operation
export async function incrementPromptUses(promptId: number) {
  try {
    const session = await auth()
    const userId = session?.user?.id
    
    console.log('Incrementing uses for prompt:', promptId, 'by user:', userId)
    
    const adminSupabase = createSupabaseAdminClient()
    
    // Get current value first
    const { data: currentData, error: fetchError } = await adminSupabase
      .from('prompt')
      .select('uses')
      .eq('id', promptId)
      .single()
    
    if (fetchError) {
      console.error('Error fetching current uses:', fetchError)
      throw new Error('Failed to fetch current usage count')
    }
    
    const currentUses = currentData?.uses || 0
    const newUses = currentUses + 1
    
    console.log(`Current uses: ${currentUses}, incrementing to: ${newUses}`)
    
    // Atomic update with a WHERE clause to prevent race conditions
    const { data, error } = await adminSupabase
      .from('prompt')
      .update({ 
        uses: newUses,
        updated_at: new Date().toISOString()
      })
      .eq('id', promptId)
      .eq('uses', currentUses) // Only update if uses hasn't changed
      .select('uses')
      .single()
    
    if (error) {
      console.error('Error incrementing uses:', error)
      // If the update failed due to race condition, try once more
      if (error.code === 'PGRST116') { // No rows affected
        console.log('Race condition detected, retrying...')
        // Recursive call with retry
        return await incrementPromptUses(promptId)
      }
      throw new Error('Failed to increment usage count')
    }
    
    console.log('Successfully incremented uses for prompt:', promptId, 'new count:', data?.uses)

    // Track prompt usage analytics
    try {
      const { Analytics } = await import('@/lib/analytics')
      await Analytics.trackEvent({
        userId: userId,
        promptId: promptId,
        eventType: 'prompt_use',
        eventData: {
          new_use_count: data?.uses || newUses
        }
      })
    } catch (analyticsError) {
      console.error('Failed to track prompt usage analytics:', analyticsError)
    }
    
    // Revalidate caches to ensure updated counts are shown everywhere
    revalidateTag(CACHE_TAGS.prompt(promptId)) // Individual prompt cache
    revalidateTag(CACHE_TAGS.prompts) // Main prompts list cache (homepage)
    
    return {
      success: true,
      newCount: data?.uses || newUses
    }
  } catch (error) {
    console.error('Error incrementing prompt uses:', error)
    throw error
  }
}

// Fork a prompt to create a user's own copy
export async function forkPrompt(promptId: number) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Unauthorized: Must be logged in to fork prompts')
    }
    
    const userId = session.user.id
    console.log('Forking prompt:', promptId, 'for user:', userId)
    
    const supabase = await getSupabaseClient()
    
    // First, fetch the original prompt
    const { data: originalPrompt, error: fetchError } = await supabase
      .from('prompt')
      .select('*')
      .eq('id', promptId)
      .single()
    
    if (fetchError || !originalPrompt) {
      throw new Error('Original prompt not found')
    }
    
    // Create the forked prompt
    const forkedPromptData: PromptInsert = {
      title: originalPrompt.title, // Keep the same title
      description: originalPrompt.description,
      content: originalPrompt.content,
      category_id: originalPrompt.category_id,
      tags: originalPrompt.tags || [],
      examples: originalPrompt.examples || [],
      user_id: userId,
      featured: false, // Forked prompts start as non-featured
      uses: 0, // Reset uses counter
      votes: 0, // Reset votes
    }
    
    const { data: forkedPrompt, error: insertError } = await supabase
      .from('prompt')
      .insert(forkedPromptData)
      .select('*, categories(*)')
      .single()
    
    if (insertError) {
      throw new Error(`Failed to create forked prompt: ${insertError.message}`)
    }
    
    // Record the fork relationship
    const { error: forkError } = await supabase
      .from('prompt_forks')
      .insert({
        original_prompt_id: promptId,
        forked_prompt_id: forkedPrompt.id,
        user_id: userId,
      })
    
    if (forkError) {
      console.error('Failed to record fork relationship:', forkError)
      // Don't throw here, the fork was successful even if we couldn't record the relationship
    }
    
    // Track user interaction
    const { error: interactionError } = await supabase
      .from('user_interactions')
      .insert({
        user_id: userId,
        prompt_id: promptId,
        interaction_type: 'fork',
      })
    
    if (interactionError) {
      console.error('Failed to track fork interaction:', interactionError)
    }
    
    // Revalidate caches
    revalidateAfterPromptCreate(
      userId,
      forkedPrompt.category_id || undefined,
      forkedPrompt.tags || undefined
    )
    revalidateTag(CACHE_TAGS.prompt(promptId)) // Update original prompt's fork count
    
    console.log('Successfully forked prompt:', promptId, 'as:', forkedPrompt.id)
    return forkedPrompt as PromptWithCategory
  } catch (error) {
    console.error('Error in forkPrompt:', error)
    throw error
  }
}

// Submit an improvement suggestion for a prompt
export async function suggestImprovement(input: z.infer<typeof suggestImprovementSchema>) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Unauthorized: Must be logged in to suggest improvements')
    }
    
    const validatedData = suggestImprovementSchema.parse(input)
    const userId = session.user.id
    
    console.log('Suggesting improvement for prompt:', validatedData.prompt_id)
    
    const supabase = await getSupabaseClient()
    
    // Check if prompt exists
    const { data: prompt, error: promptError } = await supabase
      .from('prompt')
      .select('id, user_id')
      .eq('id', validatedData.prompt_id)
      .single()
    
    if (promptError || !prompt) {
      throw new Error('Prompt not found')
    }
    
    // Don't allow users to suggest improvements to their own prompts
    if (prompt.user_id === userId) {
      throw new Error('You cannot suggest improvements to your own prompts')
    }
    
    // Create the improvement suggestion
    const { data: improvement, error: insertError } = await supabase
      .from('prompt_improvements')
      .insert({
        prompt_id: validatedData.prompt_id,
        suggestion: validatedData.suggestion,
        rationale: validatedData.rationale || null,
        created_by: userId,
        status: 'pending',
      })
      .select()
      .single()
    
    if (insertError) {
      throw new Error(`Failed to submit improvement suggestion: ${insertError.message}`)
    }
    
    // Track user interaction
    await supabase
      .from('user_interactions')
      .insert({
        user_id: userId,
        prompt_id: validatedData.prompt_id,
        interaction_type: 'improvement_suggestion',
      })
    
    // Revalidate prompt cache
    revalidateTag(CACHE_TAGS.prompt(validatedData.prompt_id))
    
    console.log('Successfully submitted improvement suggestion:', improvement.id)
    return improvement
  } catch (error) {
    console.error('Error in suggestImprovement:', error)
    throw error
  }
}

// Fetch improvements for a prompt
export async function fetchPromptImprovements(promptId: number) {
  try {
    const session = await auth()
    const userId = session?.user?.id
    
    const supabase = createSupabaseAdminClient()
    
    // Fetch prompt to check ownership
    const { data: prompt, error: promptError } = await supabase
      .from('prompt')
      .select('user_id')
      .eq('id', promptId)
      .single()
    
    if (promptError || !prompt) {
      throw new Error('Prompt not found')
    }
    
    const isOwner = userId && prompt.user_id === userId
    
    // Build query based on ownership
    let query = supabase
      .from('prompt_improvements')
      .select('*')
      .eq('prompt_id', promptId)
      .order('created_at', { ascending: false })
    
    // Non-owners can only see accepted improvements
    if (!isOwner) {
      query = query.eq('status', 'accepted')
    }
    
    const { data: improvements, error } = await query
    
    if (error) {
      throw new Error(`Failed to fetch improvements: ${error.message}`)
    }
    
    return improvements || []
  } catch (error) {
    console.error('Error in fetchPromptImprovements:', error)
    throw error
  }
}

// Review an improvement suggestion (accept/reject)
export async function reviewImprovement(input: z.infer<typeof reviewImprovementSchema>) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Unauthorized: Must be logged in to review improvements')
    }
    
    const validatedData = reviewImprovementSchema.parse(input)
    const userId = session.user.id
    
    console.log('Reviewing improvement:', validatedData.improvement_id)
    
    const supabase = await getSupabaseClient()
    
    // Fetch the improvement and related prompt
    const { data: improvement, error: fetchError } = await supabase
      .from('prompt_improvements')
      .select(`
        *,
        prompt:prompt_id (
          id,
          user_id,
          title,
          content,
          description
        )
      `)
      .eq('id', validatedData.improvement_id)
      .single()
    
    if (fetchError || !improvement) {
      throw new Error('Improvement suggestion not found')
    }
    
    // Check if user owns the prompt
    if (improvement.prompt.user_id !== userId) {
      throw new Error('Only prompt owners can review improvement suggestions')
    }
    
    // Update the improvement status
    const { error: updateError } = await supabase
      .from('prompt_improvements')
      .update({
        status: validatedData.status,
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', validatedData.improvement_id)
    
    if (updateError) {
      throw new Error(`Failed to update improvement status: ${updateError.message}`)
    }
    
    // If accepted, create a new version of the prompt
    if (validatedData.status === 'accepted') {
      // Get current version number
      const { data: versions, error: versionError } = await supabase
        .from('prompt_versions')
        .select('version_number')
        .eq('prompt_id', improvement.prompt_id)
        .order('version_number', { ascending: false })
        .limit(1)
      
      if (versionError) {
        console.error('Error fetching versions:', versionError)
      }
      
      const nextVersion = versions && versions.length > 0 ? versions[0].version_number + 1 : 1
      
      // Create a version record
      await supabase
        .from('prompt_versions')
        .insert({
          prompt_id: improvement.prompt_id,
          version_number: nextVersion,
          title: improvement.prompt.title,
          description: improvement.prompt.description,
          content: improvement.suggestion, // Use the suggested improvement as the new content
          change_summary: improvement.rationale || `Improvement suggestion by user applied`,
          created_by: userId,
        })
      
      // Update the main prompt with the improvement
      await supabase
        .from('prompt')
        .update({
          content: improvement.suggestion,
          updated_at: new Date().toISOString(),
        })
        .eq('id', improvement.prompt_id)
    }
    
    // Revalidate prompt cache
    revalidateTag(CACHE_TAGS.prompt(improvement.prompt_id))
    
    console.log('Successfully reviewed improvement:', validatedData.improvement_id)
    return { success: true, status: validatedData.status }
  } catch (error) {
    console.error('Error in reviewImprovement:', error)
    throw error
  }
}

// Fetch user's improvement suggestions
export async function fetchUserImprovements(userId?: string) {
  try {
    const session = await auth()
    const currentUserId = userId || session?.user?.id
    
    if (!currentUserId) {
      throw new Error('User ID required')
    }
    
    const supabase = createSupabaseAdminClient()
    
    const { data: improvements, error } = await supabase
      .from('prompt_improvements')
      .select(`
        *,
        prompt:prompt_id (
          id,
          title,
          user_id
        )
      `)
      .eq('created_by', currentUserId)
      .order('created_at', { ascending: false })
    
    if (error) {
      throw new Error(`Failed to fetch user improvements: ${error.message}`)
    }
    
    return improvements || []
  } catch (error) {
    console.error('Error in fetchUserImprovements:', error)
    throw error
  }
}

// Fetch all forks of a prompt
export async function fetchPromptForks(promptId: number) {
  try {
    const supabase = createSupabaseAdminClient();
    
    console.log('Fetching forks for promptId:', promptId);
    
    // First, let's get the fork relationships
    const { data: forkRelations, error: forkError } = await supabase
      .from('prompt_forks')
      .select('*')
      .eq('original_prompt_id', promptId);

    console.log('Fork relations:', forkRelations, 'Error:', forkError);

    if (forkError) {
      throw new Error(`Failed to fetch fork relations: ${forkError.message}`);
    }

    if (!forkRelations || forkRelations.length === 0) {
      console.log('No fork relations found');
      return [];
    }

    // Now get the actual forked prompts with their details
    const forkedPromptIds = forkRelations.map(rel => rel.forked_prompt_id);
    console.log('Forked prompt IDs:', forkedPromptIds);
    
    const { data: forkedPrompts, error: promptError } = await supabase
      .from('prompt')
      .select(`
        id,
        title,
        description,
        uses,
        votes,
        created_at,
        user_id
      `)
      .in('id', forkedPromptIds);

    console.log('Forked prompts:', forkedPrompts, 'Error:', promptError);

    if (promptError) {
      throw new Error(`Failed to fetch forked prompts: ${promptError.message}`);
    }

    // Get profiles separately to avoid join issues
    const userIds = (forkedPrompts || []).map(p => p.user_id).filter(Boolean);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, name, email, avatar_url')
      .in('id', userIds);

    console.log('Profiles:', profiles);

    // Combine the data and format it
    const forks = (forkedPrompts || []).map(prompt => {
      const forkRelation = forkRelations.find(rel => rel.forked_prompt_id === prompt.id);
      const profile = profiles?.find(p => p.id === prompt.user_id);
      
      return {
        id: forkRelation?.id || prompt.id,
        created_at: forkRelation?.created_at || prompt.created_at,
        forked_prompt: {
          ...prompt,
          profiles: profile
        }
      };
    });

    console.log('Final forks data:', forks);

    // Sort by creation date
    forks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return forks;
  } catch (error) {
    console.error('Error in fetchPromptForks:', error);
    return []; // Return empty array instead of throwing to prevent client crashes
  }
} 