import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * Cache tags used throughout the application for targeted cache invalidation
 */
export const CACHE_TAGS = {
  // Prompt-related tags
  prompts: 'prompts',
  prompt: (id: number) => `prompt-${id}`,
  userPrompts: (userId: string) => `user-prompts-${userId}`,
  categoryPrompts: (categoryId: number) => `category-prompts-${categoryId}`,
  tagPrompts: (tag: string) => `tag-prompts-${tag}`,
  featuredPrompts: 'featured-prompts',
  trendingPrompts: 'trending-prompts',
  
  // Category tags
  categories: 'categories',
  category: (id: number) => `category-${id}`,
  
  // User-specific tags
  userFavorites: (userId: string) => `user-favorites-${userId}`,
  userVotes: (userId: string) => `user-votes-${userId}`,
  userInteractions: (userId: string) => `user-interactions-${userId}`,
  
  // Version and fork tags
  promptVersions: (promptId: number) => `prompt-versions-${promptId}`,
  promptForks: (promptId: number) => `prompt-forks-${promptId}`,
} as const

/**
 * Cache revalidation times in seconds
 */
export const CACHE_TIMES = {
  // Static data that rarely changes
  static: 60 * 60, // 1 hour
  categories: 60 * 30, // 30 minutes
  
  // Dynamic data that changes frequently
  prompts: 60 * 2, // 2 minutes (increased from 30 seconds)
  userSpecific: 60, // 1 minute (increased from 10 seconds)
  trending: 60 * 5, // 5 minutes (increased from 30 seconds)
  
  // Real-time data
  votes: 30, // 30 seconds
  favorites: 30, // 30 seconds
  
  // Page-level caching
  homepage: 300, // 5 minutes
  promptDetail: 600, // 10 minutes
} as const

/**
 * Revalidate multiple tags at once
 */
export function revalidateTags(tags: string[]) {
  tags.forEach(tag => revalidateTag(tag))
}

/**
 * Revalidate all prompt-related caches
 */
export function revalidateAllPromptCaches() {
  revalidateTag(CACHE_TAGS.prompts)
  revalidateTag(CACHE_TAGS.featuredPrompts)
  revalidateTag(CACHE_TAGS.trendingPrompts)
}

/**
 * Revalidate caches after prompt creation
 */
export function revalidateAfterPromptCreate(userId: string, categoryId?: number, tags?: string[]) {
  // Revalidate general prompt lists
  revalidateTag(CACHE_TAGS.prompts)
  revalidateTag(CACHE_TAGS.trendingPrompts)
  
  // Revalidate user-specific caches
  revalidateTag(CACHE_TAGS.userPrompts(userId))
  
  // Revalidate category if provided
  if (categoryId) {
    revalidateTag(CACHE_TAGS.categoryPrompts(categoryId))
  }
  
  // Revalidate tag caches
  if (tags && tags.length > 0) {
    tags.forEach(tag => revalidateTag(CACHE_TAGS.tagPrompts(tag)))
  }
  
  // Revalidate key pages to ensure new prompts show up immediately
  revalidatePath('/')
  revalidatePath('/showcase')
  
  // Revalidate category pages if applicable
  if (categoryId) {
    revalidatePath(`/categories/${categoryId}`)
  }
  
  // Revalidate tag pages if applicable
  if (tags && tags.length > 0) {
    tags.forEach(tag => revalidatePath(`/tags/${tag}`))
  }
}

/**
 * Revalidate caches after prompt update
 */
export function revalidateAfterPromptUpdate(
  promptId: number,
  userId: string,
  oldCategoryId?: number,
  newCategoryId?: number,
  oldTags?: string[],
  newTags?: string[]
) {
  // Revalidate the specific prompt
  revalidateTag(CACHE_TAGS.prompt(promptId))
  
  // Revalidate general lists
  revalidateTag(CACHE_TAGS.prompts)
  
  // Revalidate user prompts
  revalidateTag(CACHE_TAGS.userPrompts(userId))
  
  // Handle category changes
  if (oldCategoryId) {
    revalidateTag(CACHE_TAGS.categoryPrompts(oldCategoryId))
  }
  if (newCategoryId && newCategoryId !== oldCategoryId) {
    revalidateTag(CACHE_TAGS.categoryPrompts(newCategoryId))
  }
  
  // Handle tag changes
  const allTags = new Set([...(oldTags || []), ...(newTags || [])])
  allTags.forEach(tag => revalidateTag(CACHE_TAGS.tagPrompts(tag)))
  
  // Revalidate key pages to reflect prompt updates
  revalidatePath('/')
  revalidatePath('/showcase')
  
  // Revalidate category pages if applicable
  if (oldCategoryId) {
    revalidatePath(`/categories/${oldCategoryId}`)
  }
  if (newCategoryId && newCategoryId !== oldCategoryId) {
    revalidatePath(`/categories/${newCategoryId}`)
  }
  
  // Revalidate tag pages if applicable
  allTags.forEach(tag => revalidatePath(`/tags/${tag}`))
}

/**
 * Revalidate caches after prompt deletion
 */
export function revalidateAfterPromptDelete(
  promptId: number,
  userId: string,
  categoryId?: number,
  tags?: string[]
) {
  // Revalidate the specific prompt
  revalidateTag(CACHE_TAGS.prompt(promptId))
  
  // Revalidate general lists
  revalidateTag(CACHE_TAGS.prompts)
  revalidateTag(CACHE_TAGS.featuredPrompts)
  revalidateTag(CACHE_TAGS.trendingPrompts)
  
  // Revalidate user prompts
  revalidateTag(CACHE_TAGS.userPrompts(userId))
  
  // Revalidate category if provided
  if (categoryId) {
    revalidateTag(CACHE_TAGS.categoryPrompts(categoryId))
  }
  
  // Revalidate tag caches
  if (tags && tags.length > 0) {
    tags.forEach(tag => revalidateTag(CACHE_TAGS.tagPrompts(tag)))
  }
  
  // Revalidate key pages to reflect prompt deletion
  revalidatePath('/')
  revalidatePath('/showcase')
  
  // Revalidate category pages if applicable
  if (categoryId) {
    revalidatePath(`/categories/${categoryId}`)
  }
  
  // Revalidate tag pages if applicable
  if (tags && tags.length > 0) {
    tags.forEach(tag => revalidatePath(`/tags/${tag}`))
  }
}

/**
 * Revalidate caches after vote changes
 */
export function revalidateAfterVote(promptId: number, userId: string) {
  revalidateTag(CACHE_TAGS.prompt(promptId))
  revalidateTag(CACHE_TAGS.userVotes(userId))
  revalidateTag(CACHE_TAGS.prompts) // For sorting by votes
  revalidateTag(CACHE_TAGS.featuredPrompts) // Featured often sorted by votes
}

/**
 * Revalidate caches after favorite changes
 */
export function revalidateAfterFavorite(promptId: number, userId: string) {
  revalidateTag(CACHE_TAGS.prompt(promptId))
  revalidateTag(CACHE_TAGS.userFavorites(userId))
  revalidateTag(CACHE_TAGS.prompts) // Update prompt lists to reflect new favorite counts
  revalidatePath('/favorites') // Ensure favorites page is refreshed
  revalidatePath('/') // Ensure home page is refreshed
}

/**
 * Generate cache key for prompt list queries
 */
export function getPromptListCacheKey(params: {
  page?: number
  limit?: number
  search?: string
  category_id?: number
  tag?: string
  featured?: boolean
  user_id?: string
  sort_by?: string
  sort_order?: string
}): string {
  const parts = ['prompts']
  
  if (params.search) parts.push(`search:${params.search}`)
  if (params.category_id) parts.push(`cat:${params.category_id}`)
  if (params.tag) parts.push(`tag:${params.tag}`)
  if (params.featured !== undefined) parts.push(`featured:${params.featured}`)
  if (params.user_id) parts.push(`user:${params.user_id}`)
  if (params.sort_by) parts.push(`sort:${params.sort_by}`)
  if (params.sort_order) parts.push(`order:${params.sort_order}`)
  if (params.page) parts.push(`page:${params.page}`)
  if (params.limit) parts.push(`limit:${params.limit}`)
  
  return parts.join('-')
}

/**
 * Helper to create fetch options with cache tags
 */
export function fetchWithTags(tags: string | string[], revalidate?: number): RequestInit {
  return {
    next: {
      tags: Array.isArray(tags) ? tags : [tags],
      revalidate,
    },
  }
}

/**
 * Documentation:
 * 
 * Caching Strategy Overview:
 * 
 * 1. Route Segment Caching:
 *    - Static routes (categories, etc.) cached for 1 hour
 *    - Dynamic routes (prompts) cached for 5 minutes
 *    - User-specific data cached for 1 minute
 * 
 * 2. Tag-based Revalidation:
 *    - Each data type has specific cache tags
 *    - CRUD operations trigger targeted revalidation
 *    - Related data is also revalidated (e.g., category lists when a prompt is updated)
 * 
 * 3. On-demand Revalidation:
 *    - All mutation operations (create, update, delete) trigger immediate revalidation
 *    - Only affected caches are invalidated for performance
 * 
 * 4. Time-based Revalidation:
 *    - Different data types have different revalidation periods
 *    - More static data (categories) has longer cache times
 *    - Dynamic data (trending) has shorter cache times
 * 
 * 5. Usage Examples:
 *    
 *    // In a server component or route handler:
 *    const prompts = await fetchPrompts(
 *      { page: 1, limit: 20 },
 *      { tags: [CACHE_TAGS.prompts], revalidate: CACHE_TIMES.prompts }
 *    )
 *    
 *    // After creating a prompt:
 *    revalidateAfterPromptCreate(userId, categoryId, tags)
 *    
 *    // After updating a prompt:
 *    revalidateAfterPromptUpdate(promptId, userId, oldCategoryId, newCategoryId, oldTags, newTags)
 */ 