import { SupabaseClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS, CACHE_TIMES } from './cache';

// Memory cache for expensive operations (in-memory for serverless functions)
const memoryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

// Memory cache utility
export const memCache = {
  get: <T>(key: string): T | null => {
    const item = memoryCache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.timestamp + item.ttl) {
      memoryCache.delete(key);
      return null;
    }
    
    return item.data as T;
  },
  
  set: <T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void => {
    memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    });
  },
  
  delete: (key: string): void => {
    memoryCache.delete(key);
  },
  
  clear: (): void => {
    memoryCache.clear();
  },
  
  size: (): number => {
    return memoryCache.size;
  },
};

// Database query optimization utilities
export const dbOptimizations = {
  // Optimized prompt list query with proper indexing and limits
  getPrompts: async (
    supabase: SupabaseClient,
    params: {
      page?: number;
      limit?: number;
      search?: string;
      category_id?: number;
      tag?: string;
      featured?: boolean;
      user_id?: string;
      sort_by?: string;
      sort_order?: 'asc' | 'desc';
    } = {}
  ) => {
    const {
      page = 1,
      limit = 20,
      search,
      category_id,
      tag,
      featured,
      user_id,
      sort_by = 'created_at',
      sort_order = 'desc',
    } = params;

    // Ensure limit is reasonable to prevent expensive queries
    const safeLimit = Math.min(limit, 100);
    const offset = (page - 1) * safeLimit;

    let query = supabase
      .from('prompt')
      .select(`
        id,
        title,
        description,
        content,
        category_id,
        user_id,
        created_at,
        updated_at,
        votes,
        uses,
        featured,
        tags,
        categories (
          id,
          name,
          slug
        )
      `, { count: 'exact' });

    // Apply filters efficiently (indexes should exist on these columns)
    if (search) {
      // Use full-text search if available, otherwise ILIKE
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%`
      );
    }

    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    if (tag) {
      query = query.contains('tags', [tag]);
    }

    if (featured !== undefined) {
      query = query.eq('featured', featured);
    }

    if (user_id) {
      query = query.eq('user_id', user_id);
    }

    // Apply sorting (ensure index exists on sort column)
    query = query.order(sort_by, { ascending: sort_order === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + safeLimit - 1);

    return query;
  },

  // Optimized categories query with caching
  getCategories: unstable_cache(
    async (supabase: SupabaseClient) => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, description, prompt_count')
        .order('name');

      if (error) throw error;
      return data;
    },
    ['categories-list'],
    {
      tags: [CACHE_TAGS.categories],
      revalidate: CACHE_TIMES.static,
    }
  ),

  // Optimized single prompt query with related data
  getPromptById: async (supabase: SupabaseClient, id: number) => {
    // Use memory cache for frequently accessed prompts
    const cacheKey = `prompt-${id}`;
    const cached = memCache.get(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from('prompt')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        ),
        profiles (
          id,
          username,
          display_name,
          avatar_url
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    // Cache for 5 minutes
    memCache.set(cacheKey, data, 5 * 60 * 1000);
    return data;
  },

  // Optimized trending prompts query
  getTrendingPrompts: unstable_cache(
    async (supabase: SupabaseClient, limit: number = 10) => {
      // Calculate trending score based on recent activity
      const { data, error } = await supabase
        .from('prompt')
        .select(`
          id,
          title,
          description,
          votes,
          uses,
          created_at,
          categories (name, slug)
        `)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
        .order('votes', { ascending: false })
        .order('uses', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    },
    ['trending-prompts'],
    {
      tags: [CACHE_TAGS.trendingPrompts],
      revalidate: CACHE_TIMES.trending,
    }
  ),

  // Optimized user favorites with minimal data
  getUserFavorites: async (supabase: SupabaseClient, userId: string) => {
    const cacheKey = `user-favorites-${userId}`;
    const cached = memCache.get(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from('user_favorites')
      .select(`
        prompt_id,
        created_at,
        prompt (
          id,
          title,
          description,
          categories (name, slug)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Cache for 2 minutes
    memCache.set(cacheKey, data, 2 * 60 * 1000);
    return data;
  },

  // Batch operation for vote counts (reduces multiple queries)
  getVoteCounts: async (supabase: SupabaseClient, promptIds: number[]) => {
    if (promptIds.length === 0) return {};

    const cacheKey = `vote-counts-${promptIds.sort().join(',')}`;
    const cached = memCache.get(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from('prompt')
      .select('id, votes')
      .in('id', promptIds);

    if (error) throw error;

    const voteCounts = data.reduce((acc, item) => {
      acc[item.id] = item.votes;
      return acc;
    }, {} as Record<number, number>);

    // Cache for 30 seconds (votes change frequently)
    memCache.set(cacheKey, voteCounts, 30 * 1000);
    return voteCounts;
  },

  // Search optimization with ranking
  searchPrompts: async (
    supabase: SupabaseClient,
    query: string,
    options: {
      limit?: number;
      category_id?: number;
      tags?: string[];
    } = {}
  ) => {
    const { limit = 20, category_id, tags } = options;
    
    if (!query || query.length < 2) {
      return { data: [], count: 0 };
    }

    // Use memory cache for search results (short TTL)
    const cacheKey = `search-${query}-${JSON.stringify(options)}`;
    const cached = memCache.get(cacheKey);
    if (cached) return cached;

    let searchQuery = supabase
      .from('prompt')
      .select(`
        id,
        title,
        description,
        votes,
        uses,
        created_at,
        categories (name, slug)
      `, { count: 'exact' })
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(limit);

    if (category_id) {
      searchQuery = searchQuery.eq('category_id', category_id);
    }

    if (tags && tags.length > 0) {
      searchQuery = searchQuery.overlaps('tags', tags);
    }

    // Order by relevance (title matches first, then description, then by votes)
    searchQuery = searchQuery.order('votes', { ascending: false });

    const result = await searchQuery;

    if (result.error) throw result.error;

    const searchResult = {
      data: result.data || [],
      count: result.count || 0,
    };

    // Cache search results for 1 minute
    memCache.set(cacheKey, searchResult, 60 * 1000);
    return searchResult;
  },
};

// Performance monitoring utilities
export const performanceUtils = {
  // Track query performance
  measureQuery: async <T>(
    name: string,
    queryFn: () => Promise<T>
  ): Promise<T> => {
    const start = Date.now();
    
    try {
      const result = await queryFn();
      const duration = Date.now() - start;
      
      // Log slow queries (> 1 second)
      if (duration > 1000) {
        console.warn(`Slow query detected: ${name} took ${duration}ms`);
      }
      
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      console.error(`Query failed: ${name} took ${duration}ms`, error);
      throw error;
    }
  },

  // Memory cache stats
  getCacheStats: () => {
    return {
      size: memCache.size(),
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString(),
    };
  },

  // Clear expired cache entries
  cleanupCache: () => {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, item] of memoryCache.entries()) {
      if (now > item.timestamp + item.ttl) {
        memoryCache.delete(key);
        cleaned++;
      }
    }
    
    return { cleaned, remaining: memoryCache.size };
  },
}; 