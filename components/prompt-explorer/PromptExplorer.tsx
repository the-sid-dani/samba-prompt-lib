"use client";

import { useState, useEffect } from "react";
import { Search, Plus, TrendingUp, Star, Heart, Eye, Copy, Sparkles, GitFork, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from '@/components/navigation/Navigation';
import config from "@/config";
import { PromptCopyButton } from "@/components/prompt-copy-button";
import { FavoriteButton } from "@/components/favorite-button";
import SignIn from "@/components/sign-in";
import { LazyLoad } from "@/components/ui/lazy-load";
import { useDebounce } from "@/lib/mobile-performance";

interface PromptExplorerProps {
  user: any;
  prompts?: any[];
  categories?: any[];
}

export default function PromptExplorer({ user, prompts: propsPrompts, categories: propsCategories }: PromptExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  
  // Debounce search for better performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // Use real data from props
  const displayPrompts = propsPrompts || [];
  const displayCategories = propsCategories ? 
    [{ id: "all", name: "All" }, ...propsCategories.map(cat => ({ id: cat.id.toString(), name: cat.name }))] 
    : [{ id: "all", name: "All" }];
  
  // Extract unique tags from all prompts
  const allTags = Array.from(
    new Set(
      displayPrompts
        .flatMap(prompt => prompt.tags || [])
        .filter((tag): tag is string => typeof tag === 'string')
    )
  ).sort();
  
  const [filteredPrompts, setFilteredPrompts] = useState(displayPrompts);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  useEffect(() => {
    let filtered = displayPrompts;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(prompt => {
        const promptCategory = prompt.category_id?.toString();
        return promptCategory === selectedCategory;
      });
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(prompt => {
        if (!prompt.tags || !Array.isArray(prompt.tags)) return false;
        return selectedTags.some(tag => prompt.tags.includes(tag));
      });
    }

    // Filter by search query (use debounced value)
    if (debouncedSearchQuery) {
      filtered = filtered.filter(prompt => 
        prompt.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        prompt.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        (prompt.tags && Array.isArray(prompt.tags) && 
         prompt.tags.some((tag: string) => tag.toLowerCase().includes(debouncedSearchQuery.toLowerCase())))
      );
    }

    // Sort prompts
    switch (sortBy) {
      case "popular":
        filtered.sort((a, b) => (b.uses || 0) - (a.uses || 0));
        break;
      case "trending":
        filtered.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
        break;
      case "newest":
        filtered.sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return dateB - dateA;
        });
        break;
    }

    setFilteredPrompts(filtered);
  }, [selectedCategory, selectedTags, debouncedSearchQuery, sortBy, displayPrompts]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 via-white to-primary/10 py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-3 sm:mb-4">
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Craft Perfect AI Prompts
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Discover and share powerful prompts for AI models across SambaTV
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative px-4 sm:px-0">
            <Search className="absolute left-[40px] sm:left-[28px] md:left-[28px] top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none z-10" />
            <Input
              type="text"
              placeholder="Search by title, description, category or prompt text..."
              className="pl-[70px] sm:pl-[62px] md:pl-[62px] pr-4 py-3 sm:py-4 md:py-6 text-[11px] sm:text-xs md:text-sm rounded-full border-2 border-gray-200 focus:border-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="w-full">
          {/* Category Filter */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Filter by category</h3>
            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {displayCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="mb-4 sm:mb-6">
              <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Filter by tags</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                      selectedTags.includes(tag)
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </button>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="mt-2 text-xs sm:text-sm text-primary hover:underline"
                >
                  Clear selected tags ({selectedTags.length})
                </button>
              )}
            </div>
          )}

          {/* Sorting and Results Count */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex flex-1 items-center gap-2 sm:gap-4 overflow-x-auto">
              {/* Sort Tabs */}
              <Tabs value={sortBy} onValueChange={setSortBy} className="w-full sm:w-auto">
                <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:flex">
                  <TabsTrigger value="popular" className="text-xs sm:text-sm">Popular</TabsTrigger>
                  <TabsTrigger value="trending" className="text-xs sm:text-sm">Trending</TabsTrigger>
                  <TabsTrigger value="newest" className="text-xs sm:text-sm">Newest</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-right">
              Showing {filteredPrompts.length} prompts
            </div>
          </div>

          {/* Featured Section */}
          {selectedCategory === "all" && selectedTags.length === 0 && filteredPrompts.some(p => p.featured) && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500" />
                Featured Prompts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPrompts
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
            {filteredPrompts
              .filter(p => !p.featured || selectedCategory !== "all" || selectedTags.length > 0)
              .map((prompt) => (
                <LazyLoad key={prompt.id} threshold={0.1}>
                  <PromptCard prompt={prompt} user={user} />
                </LazyLoad>
              ))}
          </div>

          {/* Empty State */}
          {filteredPrompts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No prompts found matching your criteria.</p>
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedTags([]);
              }}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Login Prompt for Non-authenticated Users */}
      {!user && (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t shadow-lg p-3 sm:p-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="text-center sm:text-left">
              <p className="font-semibold text-gray-900 text-sm sm:text-base">Join SambaTV Prompt Library</p>
              <p className="text-xs sm:text-sm text-gray-600">Sign in to create and save prompts</p>
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
          <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
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
              <p className="font-medium text-gray-900">
                by {
                  prompt.profiles?.username ||
                  prompt.profiles?.name || 
                  prompt.profiles?.email?.split('@')[0] ||
                  'Anonymous'
                }
              </p>
            </div>
            <div onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}>
              <PromptCopyButton
                promptId={prompt.id}
                text={prompt.content || ''}
                label=""
                variant="ghost"
                className="text-primary touch-scale"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
} 