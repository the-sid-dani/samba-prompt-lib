import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/utils/supabase/server'
import { auth } from '@/lib/auth'
import { Database } from '@/types/database.types'
import { z } from 'zod'
import { CACHE_TAGS, CACHE_TIMES, revalidateAfterPromptCreate } from '@/lib/cache'
import { 
  withErrorHandler, 
  validateRequestBody, 
  checkRateLimit,
  AuthenticationError,
  createErrorResponse
} from '@/lib/error-handling'

type Prompt = Database['public']['Tables']['prompt']['Row']
type PromptInsert = Database['public']['Tables']['prompt']['Insert']

// Schema for creating a new prompt
const createPromptSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(1000),
  content: z.string().min(1),
  category_id: z.number().nullable().optional(),
  tags: z.array(z.string()).optional().default([]),
})

// Schema for query parameters
const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  category_id: z.coerce.number().int().positive().optional(),
  tag: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  user_id: z.string().optional(),
  sort_by: z.enum(['created_at', 'updated_at', 'votes', 'uses', 'title']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
})

// GET /api/prompts - List prompts with pagination and filtering
export const GET = withErrorHandler(async (request: NextRequest) => {
  // Rate limiting for anonymous users
  const session = await auth()
  const identifier = session?.user?.id || request.headers.get('x-forwarded-for') || 'anonymous'
  checkRateLimit(identifier, 100, 60000) // 100 requests per minute
  
  const searchParams = Object.fromEntries(request.nextUrl.searchParams)
  const query = querySchema.parse(searchParams)
  
  const supabase = createSupabaseAdminClient()
  
  // Build the query
  let queryBuilder = supabase
    .from('prompt')
    .select('*, categories(*)', { count: 'exact' })
  
  // Apply filters
  if (query.search) {
    queryBuilder = queryBuilder.or(
      `title.ilike.%${query.search}%,description.ilike.%${query.search}%,content.ilike.%${query.search}%`
    )
  }
  
  if (query.category_id) {
    queryBuilder = queryBuilder.eq('category_id', query.category_id)
  }
  
  if (query.tag) {
    queryBuilder = queryBuilder.contains('tags', [query.tag])
  }
  
  if (query.featured !== undefined) {
    queryBuilder = queryBuilder.eq('featured', query.featured)
  }
  
  if (query.user_id) {
    queryBuilder = queryBuilder.eq('user_id', query.user_id)
  }
  
  // Apply sorting
  queryBuilder = queryBuilder.order(query.sort_by, { ascending: query.sort_order === 'asc' })
  
  // Apply pagination
  const from = (query.page - 1) * query.limit
  const to = from + query.limit - 1
  queryBuilder = queryBuilder.range(from, to)
  
  const { data: prompts, error, count } = await queryBuilder
  
  if (error) {
    console.error('Error fetching prompts:', error)
    throw new Error('Failed to fetch prompts')
  }
  
  const totalPages = Math.ceil((count || 0) / query.limit)
  
  // Build cache tags based on query parameters
  const cacheTags: string[] = [CACHE_TAGS.prompts]
  if (query.category_id) cacheTags.push(CACHE_TAGS.categoryPrompts(query.category_id))
  if (query.tag) cacheTags.push(CACHE_TAGS.tagPrompts(query.tag))
  if (query.featured) cacheTags.push(CACHE_TAGS.featuredPrompts)
  if (query.user_id) cacheTags.push(CACHE_TAGS.userPrompts(query.user_id))
  
  // Set cache headers
  const response = NextResponse.json({
    prompts: prompts || [],
    pagination: {
      page: query.page,
      limit: query.limit,
      total: count || 0,
      totalPages,
      hasMore: query.page < totalPages,
    },
  })
  
  // Add cache control headers
  response.headers.set(
    'Cache-Control',
    `s-maxage=${CACHE_TIMES.prompts}, stale-while-revalidate`
  )
  
  return response
})

// POST /api/prompts - Create a new prompt
export const POST = withErrorHandler(async (request: NextRequest) => {
  // Check authentication
  const session = await auth()
  if (!session?.user?.id) {
    throw new AuthenticationError()
  }
  
  // Rate limiting for authenticated users
  checkRateLimit(session.user.id, 30, 60000) // 30 prompts per minute
  
  // Parse and validate request body
  const validatedData = await validateRequestBody<z.infer<typeof createPromptSchema>>(
    request, 
    createPromptSchema
  )
  
  const supabase = createSupabaseAdminClient()
  
  // Create the prompt
  const promptData: PromptInsert = {
    ...validatedData,
    user_id: session.user.id,
  }
  
  const { data: prompt, error } = await supabase
    .from('prompt')
    .insert(promptData)
    .select('*, categories(*)')
    .single()
  
  if (error) {
    console.error('Error creating prompt:', error)
    throw new Error('Failed to create prompt')
  }
  
  // Revalidate relevant caches
  revalidateAfterPromptCreate(
    session.user.id,
    validatedData.category_id || undefined,
    validatedData.tags
  )
  
  return NextResponse.json(
    { prompt },
    { status: 201 }
  )
}) 