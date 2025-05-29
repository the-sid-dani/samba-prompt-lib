'use server';

import { createSupabaseAdminClient } from '@/utils/supabase/server';
import { auth } from '@/lib/auth';

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Fetch user's created prompts with pagination
export async function fetchUserPrompts(
  userId: string,
  params: PaginationParams = {}
): Promise<PaginatedResponse<any>> {
  const { page = 1, limit = 12 } = params;
  const offset = (page - 1) * limit;
  
  const supabase = createSupabaseAdminClient();
  
  // Get total count
  const { count } = await supabase
    .from('prompt')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);
  
  // Get paginated data
  const { data, error } = await supabase
    .from('prompt')
    .select(`
      *,
      categories(*),
      user_favorites(user_id),
      prompt_votes(vote_type, user_id),
      prompt_forks!prompt_forks_original_prompt_id_fkey(id)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (error) {
    console.error('Error fetching user prompts:', error);
    return {
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
        hasMore: false,
      },
    };
  }
  
  const totalPages = Math.ceil((count || 0) / limit);
  
  return {
    data: data || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages,
      hasMore: page < totalPages,
    },
  };
}

// Fetch user's forked prompts with pagination
export async function fetchUserForkedPrompts(
  userId: string,
  params: PaginationParams = {}
): Promise<PaginatedResponse<any>> {
  const { page = 1, limit = 12 } = params;
  const offset = (page - 1) * limit;
  
  const supabase = createSupabaseAdminClient();
  
  // Get the forked prompts created by this user that have an original_prompt_id
  // (meaning they are forks of other prompts)
  const { data: forkedPrompts, error, count } = await supabase
    .from('prompt')
    .select(`
      *,
      categories(*),
      user_favorites(user_id),
      prompt_votes(vote_type, user_id),
      prompt_forks!prompt_forks_forked_prompt_id_fkey(
        original_prompt_id,
        original_prompt:prompt!prompt_forks_original_prompt_id_fkey(
          id,
          title,
          user_id,
          profiles:user_id(name, username, email)
        )
      )
    `, { count: 'exact' })
    .eq('user_id', userId)
    .not('prompt_forks', 'is', null)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (error) {
    console.error('Error fetching forked prompts:', error);
    return {
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
        hasMore: false,
      },
    };
  }
  
  const totalPages = Math.ceil((count || 0) / limit);
  
  return {
    data: forkedPrompts || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages,
      hasMore: page < totalPages,
    },
  };
}

// Fetch user's favorite prompts with pagination
export async function fetchUserFavorites(
  userId: string,
  params: PaginationParams = {}
): Promise<PaginatedResponse<any>> {
  const { page = 1, limit = 12 } = params;
  const offset = (page - 1) * limit;
  
  const supabase = createSupabaseAdminClient();
  
  // Get total count of favorites
  const { count } = await supabase
    .from('user_favorites')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);
  
  // Get favorite relationships
  const { data: favorites } = await supabase
    .from('user_favorites')
    .select('prompt_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  const promptIds = favorites?.map(f => f.prompt_id) || [];
  
  if (promptIds.length === 0) {
    return {
      data: [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: 0,
        hasMore: false,
      },
    };
  }
  
  // Get the actual prompt data
  const { data, error } = await supabase
    .from('prompt')
    .select(`
      *,
      categories(*),
      user_favorites(user_id),
      prompt_votes(vote_type, user_id),
      prompt_forks!prompt_forks_original_prompt_id_fkey(id),
      profiles:user_id(id, name, username, email, avatar_url)
    `)
    .in('id', promptIds);
  
  if (error) {
    console.error('Error fetching favorite prompts:', error);
    return {
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
        hasMore: false,
      },
    };
  }
  
  const totalPages = Math.ceil((count || 0) / limit);
  
  return {
    data: data || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages,
      hasMore: page < totalPages,
    },
  };
}

// Fetch user's activity with pagination
export async function fetchUserActivity(
  userId: string,
  params: PaginationParams = {}
): Promise<PaginatedResponse<any>> {
  const { page = 1, limit = 20 } = params;
  const offset = (page - 1) * limit;
  
  const supabase = createSupabaseAdminClient();
  
  // Get user interactions
  const { data, error, count } = await supabase
    .from('user_interactions')
    .select(`
      *,
      prompt:prompt_id(
        id,
        title,
        description,
        categories(*)
      )
    `, { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (error) {
    console.error('Error fetching user activity:', error);
    return {
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
        hasMore: false,
      },
    };
  }
  
  const totalPages = Math.ceil((count || 0) / limit);
  
  return {
    data: data || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages,
      hasMore: page < totalPages,
    },
  };
} 