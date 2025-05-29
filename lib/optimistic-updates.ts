import { Database } from '@/types/database.types'

type Prompt = Database['public']['Tables']['prompt']['Row']

/**
 * Optimistic update utilities for client-side state management
 * These functions help provide instant feedback while waiting for server responses
 */

/**
 * Optimistically update vote count
 */
export function optimisticVoteUpdate(
  prompt: Prompt,
  voteType: 'up' | 'down',
  previousVote: 'up' | 'down' | null
): Prompt {
  let newVotes = prompt.votes

  // Remove previous vote effect
  if (previousVote === 'up') {
    newVotes -= 1
  } else if (previousVote === 'down') {
    newVotes += 1
  }

  // Add new vote effect
  if (voteType === 'up') {
    newVotes += 1
  } else if (voteType === 'down') {
    newVotes -= 1
  }

  return {
    ...prompt,
    votes: Math.max(0, newVotes),
  }
}

/**
 * Optimistically toggle vote
 */
export function optimisticToggleVote(
  currentVote: 'up' | 'down' | null,
  clickedVote: 'up' | 'down'
): 'up' | 'down' | null {
  // If clicking the same vote, remove it
  if (currentVote === clickedVote) {
    return null
  }
  // Otherwise, set the new vote
  return clickedVote
}

/**
 * Optimistically update uses count when copying
 */
export function optimisticUsesUpdate(prompt: Prompt): Prompt {
  return {
    ...prompt,
    uses: prompt.uses + 1,
  }
}

/**
 * Create an optimistic prompt for immediate display
 */
export function createOptimisticPrompt(
  data: {
    title: string
    description: string
    content: string
    category_id?: number | null
    tags?: string[]
  },
  userId: string,
  tempId: string
): Prompt & { isOptimistic: true; tempId: string } {
  const now = new Date().toISOString()
  
  return {
    id: -1, // Temporary ID, will be replaced by server
    title: data.title,
    description: data.description,
    content: data.content,
    category_id: data.category_id || null,
    tags: data.tags || [],
    user_id: userId,
    featured: false,
    uses: 0,
    votes: 0,
    created_at: now,
    updated_at: now,
    isOptimistic: true,
    tempId,
  }
}

/**
 * Update an optimistic prompt with server data
 */
export function replaceOptimisticPrompt<T extends Prompt>(
  prompts: T[],
  tempId: string,
  serverPrompt: T
): T[] {
  return prompts.map(prompt => {
    if ('tempId' in prompt && prompt.tempId === tempId) {
      return serverPrompt
    }
    return prompt
  })
}

/**
 * Remove an optimistic prompt (in case of error)
 */
export function removeOptimisticPrompt<T extends Prompt>(
  prompts: T[],
  tempId: string
): T[] {
  return prompts.filter(prompt => {
    if ('tempId' in prompt && prompt.tempId === tempId) {
      return false
    }
    return true
  })
}

/**
 * Optimistic favorite toggle
 */
export function optimisticFavoriteUpdate(
  isFavorited: boolean
): boolean {
  return !isFavorited
}

/**
 * Hook usage example:
 * 
 * ```tsx
 * import { useOptimistic } from 'react'
 * import { optimisticVoteUpdate, optimisticToggleVote } from '@/lib/optimistic-updates'
 * 
 * function PromptCard({ prompt, userVote }) {
 *   const [optimisticPrompt, setOptimisticPrompt] = useOptimistic(prompt)
 *   const [optimisticVote, setOptimisticVote] = useOptimistic(userVote)
 *   
 *   const handleVote = async (voteType: 'up' | 'down') => {
 *     // Update UI immediately
 *     setOptimisticVote(optimisticToggleVote(optimisticVote, voteType))
 *     setOptimisticPrompt(optimisticVoteUpdate(optimisticPrompt, voteType, optimisticVote))
 *     
 *     try {
 *       // Make server request
 *       const result = await voteOnPrompt(prompt.id, voteType)
 *       
 *       // Server will revalidate cache and update the actual data
 *       // The optimistic update will be replaced with real data
 *     } catch (error) {
 *       // Revert optimistic update on error
 *       setOptimisticVote(userVote)
 *       setOptimisticPrompt(prompt)
 *     }
 *   }
 * }
 * ```
 */

/**
 * Documentation:
 * 
 * Optimistic Updates Strategy:
 * 
 * 1. Immediate Feedback:
 *    - Update UI instantly when user performs an action
 *    - Don't wait for server response
 *    - Provides snappy, responsive experience
 * 
 * 2. Server Synchronization:
 *    - Server actions trigger cache revalidation
 *    - Real data replaces optimistic data automatically
 *    - Ensures eventual consistency
 * 
 * 3. Error Handling:
 *    - Revert optimistic updates if server request fails
 *    - Show error message to user
 *    - Maintain data integrity
 * 
 * 4. Best Practices:
 *    - Use for non-critical updates (votes, favorites)
 *    - Always validate on server
 *    - Keep optimistic logic simple
 *    - Test error scenarios thoroughly
 */ 