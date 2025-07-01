"use client";

import { useState, useEffect, useTransition, useCallback, useRef } from "react";
import { Search, Plus, TrendingUp, Star, Heart, Eye, Copy, Sparkles, GitFork, Tag, Filter, CalendarDays, Users, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import Navigation from '@/components/navigation/Navigation';
import { PromptCopyButton } from "@/components/prompt-copy-button";
import { FavoriteButton } from "@/components/favorite-button";
import SignIn from "@/components/sign-in";
import { LazyLoad } from "@/components/ui/lazy-load";
import { useDebounce } from "@/lib/mobile-performance";
import { ForkBadge } from "@/components/fork-badge";
import { fetchPrompts, fetchTags } from "@/app/actions/prompts";
import { DateRange } from "react-day-picker";

interface PromptExplorerProps {
  user: any;
  prompts?: any[];
  categories?: any[];
  initiallyLoaded?: boolean;
  initialFilters?: {
    search?: string;
    category?: string;
    tags?: string[];
    dateRange?: DateRange;
    popularity?: [number, number];
    author?: string;
    sort?: string;
  };
}

interface FilterState {
  search: string;
  selectedCategory: string;
  selectedTags: string[];
  dateRange: DateRange | undefined;
  popularityRange: [number, number];
  selectedAuthor: string;
  sortBy: string;
}

export default function PromptExplorer({ 
  user, 
  prompts: propsPrompts, 
  categories: propsCategories,
  initiallyLoaded = false,
  initialFilters = {}
}: PromptExplorerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // State for data and UI - ALL HOOKS MUST BE AT THE TOP
  const [prompts, setPrompts] = useState(propsPrompts || []);
  const [loading, setLoading] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [availableAuthors, setAvailableAuthors] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const mountedRef = useRef(true);
  
  // Initialize filters from URL parameters or props
  const [filters, setFilters] = useState<FilterState>(() => {
    if (typeof window === 'undefined') {
      // Server-side: use initialFilters
      return {
        search: initialFilters.search || "",
        selectedCategory: initialFilters.category || "all",
        selectedTags: initialFilters.tags || [],
        dateRange: initialFilters.dateRange,
        popularityRange: [0, 1000],
        selectedAuthor: initialFilters.author || "",
        sortBy: initialFilters.sort || "popular"
      };
    } else {
      // Client-side: use URL params
      const initialSearch = searchParams.get('search') || initialFilters.search || "";
      return {
        search: initialSearch,
        selectedCategory: searchParams.get('category') || initialFilters.category || "all",
        selectedTags: searchParams.get('tags')?.split(',') || initialFilters.tags || [],
        dateRange: initialFilters.dateRange,
        popularityRange: [0, 1000],
        selectedAuthor: searchParams.get('author') || initialFilters.author || "",
        sortBy: searchParams.get('sort') || initialFilters.sort || "popular"
      };
    }
  });

  // Debounce search for better performance
  const debouncedSearchQuery = useDebounce(filters.search, 300);
  
  const displayCategories = propsCategories ? 
    [{ id: "all", name: "All" }, ...propsCategories.map(cat => ({ id: cat.id.toString(), name: cat.name }))] 
    : [{ id: "all", name: "All" }];

  // Update URL when filters change
  const updateURL = useCallback((newFilters: FilterState) => {
    if (typeof window === 'undefined') return; // Skip on server
    
    const params = new URLSearchParams();
    
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.selectedCategory && newFilters.selectedCategory !== 'all') {
      params.set('category', newFilters.selectedCategory);
    }
    if (newFilters.selectedTags.length > 0) {
      params.set('tags', newFilters.selectedTags.join(','));
    }
    if (newFilters.selectedAuthor) {
      params.set('author', newFilters.selectedAuthor);
    }
    if (newFilters.sortBy) {
      params.set('sort', newFilters.sortBy);
    }
    
    const newURL = params.toString() ? `/?${params.toString()}` : '/';
    router.replace(newURL, { scroll: false });
  }, [router]);

  // Fetch all available tags from database (separate from current page prompts)
  const fetchAllTags = useCallback(async () => {
    try {
      console.log('🏷️ [PromptExplorer] Fetching all available tags...');
      const tags = await fetchTags(); // Fetch all tags without query
      console.log('🏷️ [PromptExplorer] Fetched', tags.length, 'total tags:', tags.slice(0, 5));
      setAvailableTags(tags);
    } catch (error) {
      console.error('❌ [PromptExplorer] Error fetching tags:', error);
      setAvailableTags([]); // Fallback to empty array
    }
  }, []);

  // Function to fetch prompts with current filters
  const fetchFilteredPrompts = useCallback(async (currentFilters: FilterState) => {
    if (!isHydrated) return; // Don't fetch until hydrated
    
    try {
      setLoading(true);
      
      console.log('🔍 [PromptExplorer] Fetching prompts with filters:', currentFilters);

      const searchParams: any = {
        page: 1,
        limit: 50,
      };

      // Search filtering
      if (currentFilters.search) {
        searchParams.search = currentFilters.search;
      }
      
      // Category filtering
      if (currentFilters.selectedCategory && currentFilters.selectedCategory !== 'all') {
        searchParams.category = currentFilters.selectedCategory;
      }
      
      // Multi-tag filtering
      if (currentFilters.selectedTags.length > 0) {
        searchParams.tags = currentFilters.selectedTags;
      }
      
      // Author filtering
      if (currentFilters.selectedAuthor) {
        searchParams.author = currentFilters.selectedAuthor;
      }
      
      // Date range filtering
      if (currentFilters.dateRange?.from) {
        searchParams.created_after = currentFilters.dateRange.from.toISOString();
      }
      if (currentFilters.dateRange?.to) {
        searchParams.created_before = currentFilters.dateRange.to.toISOString();
      }
      
      // Popularity filtering
      if (currentFilters.popularityRange) {
        searchParams.min_popularity = currentFilters.popularityRange[0];
        searchParams.max_popularity = currentFilters.popularityRange[1];
      }
      
      // Sorting
      if (currentFilters.sortBy) {
        searchParams.sort_by = currentFilters.sortBy;
        searchParams.sort_order = 'desc';
      }

      const result = await fetchPrompts(searchParams);
      const newPrompts = result.prompts || [];
      
      console.log('✅ [PromptExplorer] Successfully fetched', newPrompts.length, 'prompts');
      console.log('🔍 [PromptExplorer] First few prompts:', newPrompts.slice(0, 3).map(p => ({ id: p.id, title: p.title })));
      
      console.log('📝 [PromptExplorer] Setting prompts state with', newPrompts.length, 'prompts');
      setPrompts(newPrompts);
      console.log('📝 [PromptExplorer] Prompts state set completed');
      
      // Extract unique authors from the results
      const authors = [...new Set(newPrompts.map(prompt => prompt.profiles?.name || prompt.profiles?.username).filter(Boolean))] as string[];
      setAvailableAuthors(authors);
      
    } catch (error) {
      console.error('❌ [PromptExplorer] Error fetching prompts:', error);
    } finally {
      setLoading(false);
    }
  }, [isHydrated]);

  // Handle filter changes (except search which has its own effect)
  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    startTransition(() => {
      fetchFilteredPrompts(updatedFilters);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, updateURL, fetchFilteredPrompts]);

  // Handle direct search input changes
  const handleSearchChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  }, []);

  // Toggle tag filter
  const toggleTag = useCallback((tag: string) => {
    const newTags = filters.selectedTags.includes(tag) 
      ? filters.selectedTags.filter(t => t !== tag)
      : [...filters.selectedTags, tag];
    handleFilterChange({ selectedTags: newTags });
  }, [filters.selectedTags, handleFilterChange]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    const clearedFilters: FilterState = {
      search: "",
      selectedCategory: "all",
      selectedTags: [],
      dateRange: undefined,
      popularityRange: [0, 1000],
      selectedAuthor: "",
      sortBy: "popular"
    };
    setFilters(clearedFilters);
    updateURL(clearedFilters);
    startTransition(() => {
      fetchFilteredPrompts(clearedFilters);
    });
  }, [updateURL, fetchFilteredPrompts]);

  // Hydration detection - critical for SSR/CSR sync
  useEffect(() => {
    console.log('💧 [PromptExplorer] Hydration completed');
    setIsHydrated(true);
  }, []);

  // Initial data load - handle server-side vs client-side data properly
  useEffect(() => {
    if (!isHydrated) return; // Wait for hydration
    
    console.log('🚀 [PromptExplorer] Component mounting after hydration...');
    console.log('🚀 [PromptExplorer] initiallyLoaded:', initiallyLoaded);
    console.log('🚀 [PromptExplorer] propsPrompts:', propsPrompts?.length || 0);
    console.log('🚀 [PromptExplorer] current prompts state:', prompts.length);
    
    // Always fetch all tags on initial load (regardless of server-side data)
    fetchAllTags();
    
    if (initiallyLoaded && propsPrompts && propsPrompts.length > 0) {
      console.log('✅ [PromptExplorer] Using server-side data:', propsPrompts.length, 'prompts');
      setPrompts(propsPrompts);
      setLoading(false); // Ensure loading is false since we have data
    } else if (!initiallyLoaded) {
      console.log('🔄 [PromptExplorer] No server-side data, fetching client-side...');
      if (mountedRef.current) {
        // Add a small delay to ensure all effects are set up
        setTimeout(() => {
          if (mountedRef.current) {
            fetchFilteredPrompts(filters);
          }
        }, 100);
      }
    } else {
      console.log('⚠️ [PromptExplorer] Server-side loading indicated but no data provided');
      if (mountedRef.current) {
        fetchFilteredPrompts(filters);
      }
    }
    
    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]); // Only depend on hydration completion

  // Consolidated effect for handling filter changes including debounced search
  useEffect(() => {
    if (!isHydrated || !mountedRef.current) return;
    
    console.log('🔄 [PromptExplorer] Filters or search changed, fetching data...');
    console.log('🔄 [PromptExplorer] Current filters:', filters);
    console.log('🔄 [PromptExplorer] Debounced search:', debouncedSearchQuery);
    
    const updatedFilters = { ...filters, search: debouncedSearchQuery };
    updateURL(updatedFilters);
    
    startTransition(() => {
      fetchFilteredPrompts(updatedFilters);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery, filters.selectedCategory, filters.selectedTags, filters.sortBy, filters.selectedAuthor, JSON.stringify(filters.dateRange), JSON.stringify(filters.popularityRange), isHydrated]);

  // Refresh data when user returns to the page (especially after creating/editing prompts)
  useEffect(() => {
    if (!isHydrated) return;
    
    let isSubscribed = true;
    
    const handleVisibilityChange = () => {
      if (!document.hidden && isSubscribed && !loading && mountedRef.current) {
        console.log('👁️ [PromptExplorer] Page became visible, refreshing data...');
        startTransition(() => {
          fetchFilteredPrompts(filters);
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      isSubscribed = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [filters, loading, fetchFilteredPrompts, isHydrated]);

  // Show loading spinner until hydration is complete (prevents hydration mismatch)
  if (!isHydrated) {
    console.log('⏳ [PromptExplorer] Waiting for hydration...');
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if any filters are active (excluding search from badge display)
  const hasActiveFilters = filters.selectedCategory !== 'all' || 
    filters.selectedTags.length > 0;

  console.log('🎨 [PromptExplorer] Rendering with prompts.length:', prompts.length);
  console.log('🎨 [PromptExplorer] Loading state:', loading);
  console.log('🎨 [PromptExplorer] Current filters:', filters);

  return (
    <div className="min-h-screen bg-background transition-[background-color] duration-300">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-8 sm:py-12 md:py-16 transition-[background-color] duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-3 sm:mb-4">
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
            Craft Perfect AI Prompts
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Discover and share powerful prompts for AI models across SambaTV
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative px-4 sm:px-0">
            <Search className="absolute left-[40px] sm:left-[28px] md:left-[28px] top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none z-10" />
            <Input
              type="text"
              placeholder="Search by title, description, category or prompt text..."
              className="pl-[70px] sm:pl-[62px] md:pl-[62px] pr-4 py-3 sm:py-4 md:py-6 text-sm sm:text-base md:text-base rounded-full border-2 border-border focus:border-primary bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={filters.search || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
              autoComplete="off"
              spellCheck="false"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="w-full">
          {/* Filters */}
          <div className="mb-4 space-y-3">
            {/* Category Filter - Hidden for now */}
            <div className="hidden">
              <h3 className="text-sm font-medium text-foreground mb-2">Filter by category</h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {displayCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleFilterChange({ selectedCategory: category.id })}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      filters.selectedCategory === category.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tag Filter */}
            {availableTags.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-foreground">Filter by tags</h3>
                  <span className="text-xs text-muted-foreground">
                    {availableTags.length} tags available
                  </span>
                </div>
                <div className="relative">
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 scroll-smooth">
                    {availableTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1 shrink-0 ${
                          filters.selectedTags.includes(tag)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </button>
                    ))}
                  </div>
                  {/* Scroll indicators - always show on all screen sizes */}
                  <div className="absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none flex items-center justify-end pr-1">
                    <div className="text-xs text-muted-foreground animate-pulse">→</div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Active Filters Display with Clear All Button */}
          {hasActiveFilters && (
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-2">
                {filters.selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Category: {displayCategories.find(c => c.id === filters.selectedCategory)?.name}
                    <button onClick={() => handleFilterChange({ selectedCategory: "all" })} className="ml-1">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {filters.selectedTags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    Tag: {tag}
                    <button onClick={() => toggleTag(tag)} className="ml-1">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="text-primary hover:text-primary/80 shrink-0"
              >
                <X className="w-4 h-4 mr-2" />
                Clear All Filters
              </Button>
            </div>
          )}

          {/* Sorting and Results Count */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
            <div className="flex flex-1 items-center gap-2 sm:gap-4 overflow-x-auto">
              {/* Sort Tabs */}
              <Tabs value={filters.sortBy} onValueChange={(value) => {
                console.log('Sort tab clicked:', value);
                handleFilterChange({ sortBy: value });
              }} className="w-full sm:w-auto">
                <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:flex">
                  <TabsTrigger value="popular" className="text-xs sm:text-sm">Popular</TabsTrigger>
                  <TabsTrigger value="trending" className="text-xs sm:text-sm">Trending</TabsTrigger>
                  <TabsTrigger value="newest" className="text-xs sm:text-sm">Newest</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-right flex items-center gap-2">
              Showing {prompts.length} prompts
            </div>
          </div>

          {/* Featured Section */}
          {filters.selectedCategory === "all" && filters.selectedTags.length === 0 && prompts.some(p => p.featured) && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500" />
                Featured Prompts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prompts
                  .filter(p => p.featured)
                  .slice(0, 2)
                  .map((prompt) => (
                    <PromptCard key={prompt.id} prompt={prompt} user={user} featured />
                  ))}
              </div>
            </div>
          )}

          {/* Prompt Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prompts
              .filter(p => !p.featured || filters.selectedCategory !== "all" || filters.selectedTags.length > 0)
              .map((prompt) => (
                <LazyLoad key={prompt.id} threshold={0.1}>
                  <PromptCard prompt={prompt} user={user} />
                </LazyLoad>
              ))}
          </div>

          {/* Empty State */}
          {prompts.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No prompts found matching your criteria.</p>
              <Button variant="outline" onClick={clearAllFilters}>
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Login Prompt for Non-authenticated Users */}
      {!user && (
        <div className="fixed bottom-0 inset-x-0 bg-background border-t shadow-lg p-3 sm:p-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="text-center sm:text-left">
              <p className="font-semibold text-foreground text-sm sm:text-base">Join SambaTV Prompt Library</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Sign in to create and save prompts</p>
            </div>
            <SignIn />
          </div>
        </div>
      )}
    </div>
  );
}

// Prompt Card Component
function PromptCard({ prompt, user, featured = false }: { prompt: any; user: any; featured?: boolean }) {
  // Debug: Check if content is available
  console.log('Prompt card data:', { 
    id: prompt.id, 
    title: prompt.title, 
    hasContent: !!prompt.content,
    contentLength: prompt.content?.length || 0 
  });
  
  console.log('Creating link to:', `/prompt/${prompt.id}`);
  
  return (
    <Link href={`/prompt/${prompt.id}`}>
      <Card className={`h-full hover:shadow-lg transition-shadow cursor-pointer card-hover tap-highlight ${
        featured ? "border-primary" : ""
      }`}>
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <Badge variant="secondary" className="text-xs">
              {prompt.categories?.name || 'General'}
            </Badge>
            {featured && (
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
            )}
          </div>
          <CardTitle className="line-clamp-2">{prompt.title}</CardTitle>
          {prompt.forked_from && (
            <div className="mt-2 mb-2">
              <ForkBadge forkedFrom={prompt.forked_from} className="text-xs" />
            </div>
          )}
          <CardDescription className="line-clamp-3">
            {prompt.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {prompt.tags && prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {prompt.tags.slice(0, 3).map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {prompt.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{prompt.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
          
          {/* Stats section */}
          <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
            {user ? (
              <FavoriteButton
                promptId={prompt.id}
                initialFavorited={prompt.isFavorited || false}
                favoriteCount={prompt.favoriteCount || prompt.user_favorites?.length || 0}
                showCount={true}
                size="sm"
                variant="ghost"
              />
            ) : (
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{prompt.favoriteCount || prompt.user_favorites?.length || 0}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <GitFork className="w-4 h-4" />
              <span>{prompt.prompt_forks?.length || prompt.forkCount || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Copy className="w-4 h-4" />
              <span>{prompt.uses || 0}</span>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t flex items-center justify-between">
            <div className="text-sm">
              <p className="font-medium text-foreground">
                by {
                  prompt.profiles?.username ||
                  prompt.profiles?.name || 
                  prompt.profiles?.email?.split('@')[0] ||
                  'Anonymous'
                }
              </p>
            </div>
            <PromptCopyButton
              promptId={prompt.id}
              text={prompt.content || ''}
              label=""
              variant="ghost"
              className="text-primary touch-scale"
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
} 