import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/utils/supabase/server'
import { auth } from '@/lib/auth'
import { Database } from '@/types/database.types'
import { z } from 'zod'
import { 
  CACHE_TAGS, 
  CACHE_TIMES, 
  revalidateAfterPromptUpdate, 
  revalidateAfterPromptDelete 
} from '@/lib/cache'
import { 
  withErrorHandler, 
  validateRequestBody, 
  checkRateLimit,
  AuthenticationError,
  AuthorizationError,
  NotFoundError
} from '@/lib/error-handling'

type PromptUpdate = Database['public']['Tables']['prompt']['Update']

// Schema for updating a prompt
const updatePromptSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).max(1000).optional(),
  content: z.string().min(1).optional(),
  category_id: z.number().nullable().optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
})

// Schema for route params
const paramsSchema = z.object({
  id: z.coerce.number().int().positive(),
})

type Props = {
  params: {
    id: string
  }
}

// GET /api/prompts/[id] - Get a specific prompt by ID
export const GET = withErrorHandler(async (request: NextRequest, { params }: Props) => {
  const { id } = paramsSchema.parse(params)
  
  // Rate limiting
  const identifier = request.headers.get('x-forwarded-for') || 'anonymous'
  checkRateLimit(identifier, 200, 60000) // 200 requests per minute
  
  const supabase = createSupabaseAdminClient()
  
  // Fetch the prompt with related data
  const { data: prompt, error } = await supabase
    .from('prompt')
    .select(`
      *,
      categories(*),
      user_favorites(user_id),
      prompt_votes(vote_type),
      prompt_forks(id),
      prompt_versions(*)
    `)
    .eq('id', id)
    .single()
  
  if (error || !prompt) {
    throw new NotFoundError('Prompt not found')
  }
  
  // Calculate additional metrics
  const upvotes = prompt.prompt_votes?.filter(vote => vote.vote_type === 'up').length || 0
  const downvotes = prompt.prompt_votes?.filter(vote => vote.vote_type === 'down').length || 0
  const forkCount = prompt.prompt_forks?.length || 0
  
  // Remove raw vote data before sending response
  const { prompt_votes, prompt_forks, ...promptData } = prompt
  
  const response = NextResponse.json({
    prompt: {
      ...promptData,
      upvotes,
      downvotes,
      forkCount,
    }
  })
  
  // Add cache control headers
  response.headers.set(
    'Cache-Control',
    `s-maxage=${CACHE_TIMES.promptDetail}, stale-while-revalidate`
  )
  
  return response
})

// PUT /api/prompts/[id] - Update an existing prompt
export const PUT = withErrorHandler(async (request: NextRequest, { params }: Props) => {
  // Check authentication
  const session = await auth()
  if (!session?.user?.id) {
    throw new AuthenticationError()
  }
  
  // Rate limiting
  checkRateLimit(session.user.id, 60, 60000) // 60 updates per minute
  
  const { id } = paramsSchema.parse(params)
  const validatedData = await validateRequestBody<z.infer<typeof updatePromptSchema>>(
    request,
    updatePromptSchema
  )
  
  const supabase = createSupabaseAdminClient()
  
  // Check if user owns the prompt and get current data for cache invalidation
  const { data: existingPrompt, error: fetchError } = await supabase
    .from('prompt')
    .select('user_id, category_id, tags')
    .eq('id', id)
    .single()
  
  if (fetchError || !existingPrompt) {
    throw new NotFoundError('Prompt not found')
  }
  
  if (existingPrompt.user_id !== session.user.id) {
    throw new AuthorizationError('You can only update your own prompts')
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
    console.error('Error updating prompt:', updateError)
    throw new Error('Failed to update prompt')
  }
  
  // Revalidate relevant caches
  revalidateAfterPromptUpdate(
    id,
    session.user.id,
    existingPrompt.category_id || undefined,
    validatedData.category_id !== undefined ? validatedData.category_id || undefined : existingPrompt.category_id || undefined,
    existingPrompt.tags || undefined,
    validatedData.tags || existingPrompt.tags || undefined
  )
  
  return NextResponse.json({ prompt })
})

// DELETE /api/prompts/[id] - Delete a prompt
export const DELETE = withErrorHandler(async (request: NextRequest, { params }: Props) => {
  // Check authentication
  const session = await auth()
  if (!session?.user?.id) {
    throw new AuthenticationError()
  }
  
  // Rate limiting
  checkRateLimit(session.user.id, 30, 60000) // 30 deletions per minute
  
  const { id } = paramsSchema.parse(params)
  
  const supabase = createSupabaseAdminClient()
  
  // Check if user owns the prompt and get data for cache invalidation
  const { data: existingPrompt, error: fetchError } = await supabase
    .from('prompt')
    .select('user_id, category_id, tags')
    .eq('id', id)
    .single()
  
  if (fetchError || !existingPrompt) {
    throw new NotFoundError('Prompt not found')
  }
  
  if (existingPrompt.user_id !== session.user.id) {
    throw new AuthorizationError('You can only delete your own prompts')
  }
  
  // Delete the prompt (cascade will handle related records)
  const { error: deleteError } = await supabase
    .from('prompt')
    .delete()
    .eq('id', id)
  
  if (deleteError) {
    console.error('Error deleting prompt:', deleteError)
    throw new Error('Failed to delete prompt')
  }
  
  // Revalidate relevant caches
  revalidateAfterPromptDelete(
    id,
    session.user.id,
    existingPrompt.category_id || undefined,
    existingPrompt.tags || undefined
  )
  
  return NextResponse.json(
    { message: 'Prompt deleted successfully' },
    { status: 200 }
  )
}) 