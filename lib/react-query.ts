import { QueryClient, DefaultOptions } from '@tanstack/react-query';

// Cache times in milliseconds
const CACHE_TIMES = {
  // Static data that rarely changes
  categories: 1000 * 60 * 60, // 1 hour
  staticContent: 1000 * 60 * 30, // 30 minutes
  
  // Dynamic content
  prompts: 1000 * 60 * 5, // 5 minutes
  trending: 1000 * 60 * 3, // 3 minutes
  search: 1000 * 60 * 2, // 2 minutes
  
  // User-specific data
  profile: 1000 * 60 * 5, // 5 minutes
  favorites: 1000 * 60 * 2, // 2 minutes
  userPrompts: 1000 * 60 * 3, // 3 minutes
  
  // Real-time data
  votes: 1000 * 30, // 30 seconds
  comments: 1000 * 60, // 1 minute
} as const;

// Stale times - when data is considered stale but still usable
const STALE_TIMES = {
  categories: 1000 * 60 * 30, // 30 minutes
  prompts: 1000 * 60 * 2, // 2 minutes
  trending: 1000 * 60, // 1 minute
  profile: 1000 * 60 * 2, // 2 minutes
  search: 1000 * 30, // 30 seconds
  favorites: 1000 * 60, // 1 minute
  votes: 1000 * 10, // 10 seconds
  comments: 1000 * 30, // 30 seconds
} as const;

// Query key factories for consistent cache management
export const queryKeys = {
  // Prompts
  prompts: {
    all: ['prompts'] as const,
    lists: () => [...queryKeys.prompts.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.prompts.lists(), filters] as const,
    details: () => [...queryKeys.prompts.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.prompts.details(), id] as const,
    trending: () => [...queryKeys.prompts.all, 'trending'] as const,
    featured: () => [...queryKeys.prompts.all, 'featured'] as const,
    search: (query: string) => [...queryKeys.prompts.all, 'search', query] as const,
  },
  
  // Categories
  categories: {
    all: ['categories'] as const,
    lists: () => [...queryKeys.categories.all, 'list'] as const,
    list: (filters?: any) => [...queryKeys.categories.lists(), filters] as const,
    details: () => [...queryKeys.categories.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.categories.details(), id] as const,
  },
  
  // User data
  user: {
    all: ['user'] as const,
    profile: (id: string) => [...queryKeys.user.all, 'profile', id] as const,
    prompts: (id: string, filters?: any) => [...queryKeys.user.all, 'prompts', id, filters] as const,
    favorites: (id: string) => [...queryKeys.user.all, 'favorites', id] as const,
    votes: (id: string) => [...queryKeys.user.all, 'votes', id] as const,
  },
  
  // Comments
  comments: {
    all: ['comments'] as const,
    byPrompt: (promptId: string | number) => [...queryKeys.comments.all, 'byPrompt', promptId] as const,
  },
} as const;

// Default React Query configuration
const queryConfig: DefaultOptions = {
  queries: {
    // Disable automatic retries for failed requests
    retry: (failureCount: number, error: any) => {
      // Don't retry for authentication errors
      if (error?.status === 401 || error?.status === 403) return false;
      // Don't retry for client errors (4xx)
      if (error?.status >= 400 && error?.status < 500) return false;
      // Retry up to 2 times for server errors
      return failureCount < 2;
    },
    
    // Retry delay with exponential backoff
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    
    // Default stale time
    staleTime: STALE_TIMES.prompts,
    
    // Default cache time  
    gcTime: CACHE_TIMES.prompts,
    
    // Refetch on window focus for real-time data
    refetchOnWindowFocus: true,
    
    // Don't refetch on reconnect for cached data
    refetchOnReconnect: 'always',
    
    // Background refetch interval (disabled by default)
    refetchInterval: false,
    
    // Network mode
    networkMode: 'online',
  },
  mutations: {
    // Retry mutations once
    retry: 1,
    
    // Network mode for mutations
    networkMode: 'online',
  },
};

// Create and configure QueryClient
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: queryConfig,
  });
}

// Singleton instance for client-side usage
let queryClientInstance: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    // Server side - always create new instance
    return createQueryClient();
  }
  
  // Client side - reuse or create instance
  if (!queryClientInstance) {
    queryClientInstance = createQueryClient();
  }
  
  return queryClientInstance;
}

// Query options factories with appropriate cache settings
export const queryOptions = {
  // Prompts
  prompts: {
    list: (filters: any = {}) => ({
      queryKey: queryKeys.prompts.list(filters),
      staleTime: STALE_TIMES.prompts,
      gcTime: CACHE_TIMES.prompts,
    }),
    
    detail: (id: string | number) => ({
      queryKey: queryKeys.prompts.detail(id),
      staleTime: STALE_TIMES.prompts,
      gcTime: CACHE_TIMES.prompts,
    }),
    
    trending: () => ({
      queryKey: queryKeys.prompts.trending(),
      staleTime: STALE_TIMES.trending,
      gcTime: CACHE_TIMES.trending,
      refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes for trending
    }),
    
    search: (query: string) => ({
      queryKey: queryKeys.prompts.search(query),
      staleTime: STALE_TIMES.search,
      gcTime: CACHE_TIMES.search,
      enabled: query.length >= 2, // Only search with 2+ characters
    }),
  },
  
  // Categories
  categories: {
    list: () => ({
      queryKey: queryKeys.categories.list(),
      staleTime: STALE_TIMES.categories,
      gcTime: CACHE_TIMES.categories,
      refetchOnWindowFocus: false, // Categories rarely change
    }),
    
    detail: (id: string | number) => ({
      queryKey: queryKeys.categories.detail(id),
      staleTime: STALE_TIMES.categories,
      gcTime: CACHE_TIMES.categories,
    }),
  },
  
  // User data
  user: {
    profile: (id: string) => ({
      queryKey: queryKeys.user.profile(id),
      staleTime: STALE_TIMES.profile,
      gcTime: CACHE_TIMES.profile,
    }),
    
    favorites: (id: string) => ({
      queryKey: queryKeys.user.favorites(id),
      staleTime: STALE_TIMES.favorites,
      gcTime: CACHE_TIMES.favorites,
    }),
    
    votes: (id: string) => ({
      queryKey: queryKeys.user.votes(id),
      staleTime: STALE_TIMES.votes,
      gcTime: CACHE_TIMES.votes,
    }),
  },
  
  // Comments
  comments: {
    byPrompt: (promptId: string | number) => ({
      queryKey: queryKeys.comments.byPrompt(promptId),
      staleTime: STALE_TIMES.comments,
      gcTime: CACHE_TIMES.comments,
    }),
  },
} as const;

// Cache invalidation helpers
export const cacheUtils = {
  // Invalidate all prompt-related queries
  invalidatePrompts: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({
      queryKey: queryKeys.prompts.all,
    });
  },
  
  // Invalidate specific prompt
  invalidatePrompt: (queryClient: QueryClient, id: string | number) => {
    return queryClient.invalidateQueries({
      queryKey: queryKeys.prompts.detail(id),
    });
  },
  
  // Invalidate user data
  invalidateUserData: (queryClient: QueryClient, userId: string) => {
    return Promise.all([
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.profile(userId),
      }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.favorites(userId),
      }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.votes(userId),
      }),
    ]);
  },
  
  // Optimistic updates for votes
  updateVoteCount: (queryClient: QueryClient, promptId: string | number, delta: number) => {
    queryClient.setQueryData(
      queryKeys.prompts.detail(promptId),
      (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          votes: (oldData.votes || 0) + delta,
        };
      }
    );
  },
  
  // Prefetch related data
  prefetchPromptDetails: (queryClient: QueryClient, id: string | number) => {
    return queryClient.prefetchQuery({
      ...queryOptions.prompts.detail(id),
      queryFn: () => fetch(`/api/prompts/${id}`).then(res => res.json()),
    });
  },
} as const; 