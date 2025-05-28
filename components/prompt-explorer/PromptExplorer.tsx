"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Filter, TrendingUp, Star, Eye, Copy, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UserMenu from "@/components/user/UserMenu";
import SignIn from "@/components/sign-in";
import config from "@/config";

interface PromptExplorerProps {
  user: any;
}

// Mock data for demonstration
const categories = [
  { id: "all", name: "All", icon: "🌟" },
  { id: "marketing", name: "Marketing", icon: "📢" },
  { id: "sales", name: "Sales", icon: "💼" },
  { id: "development", name: "Development", icon: "💻" },
  { id: "data", name: "Data Analysis", icon: "📊" },
  { id: "hr", name: "HR", icon: "👥" },
  { id: "finance", name: "Finance", icon: "💰" },
  { id: "legal", name: "Legal", icon: "⚖️" },
  { id: "support", name: "Customer Support", icon: "🎧" },
  { id: "research", name: "Research", icon: "🔬" },
];

const mockPrompts = [
  {
    id: 1,
    title: "Sales Email Optimizer",
    description: "Craft compelling sales emails that convert. This prompt helps you write personalized outreach that resonates with prospects.",
    category: "sales",
    tags: ["email", "outreach", "conversion"],
    author: "Sarah Chen",
    authorRole: "Sales Director",
    uses: 1547,
    votes: 234,
    featured: true,
  },
  {
    id: 2,
    title: "Market Analysis Report Generator",
    description: "Generate comprehensive market analysis reports with key insights, competitor analysis, and actionable recommendations.",
    category: "marketing",
    tags: ["analysis", "reporting", "strategy"],
    author: "Mike Johnson",
    authorRole: "Marketing Manager",
    uses: 892,
    votes: 156,
    featured: true,
  },
  {
    id: 3,
    title: "Code Review Assistant",
    description: "Get detailed code reviews with suggestions for improvements, potential bugs, and best practices for any programming language.",
    category: "development",
    tags: ["coding", "review", "quality"],
    author: "Alex Kumar",
    authorRole: "Senior Engineer",
    uses: 2103,
    votes: 412,
    featured: false,
  },
  {
    id: 4,
    title: "Employee Performance Review Writer",
    description: "Create balanced, constructive performance reviews that provide clear feedback and actionable development goals.",
    category: "hr",
    tags: ["performance", "feedback", "management"],
    author: "Lisa Wang",
    authorRole: "HR Director",
    uses: 673,
    votes: 89,
    featured: false,
  },
  {
    id: 5,
    title: "Financial Report Summarizer",
    description: "Transform complex financial data into clear, executive-ready summaries with key metrics and insights highlighted.",
    category: "finance",
    tags: ["reporting", "analysis", "summary"],
    author: "David Park",
    authorRole: "CFO",
    uses: 1205,
    votes: 198,
    featured: true,
  },
  {
    id: 6,
    title: "Customer Support Response Template",
    description: "Generate empathetic, solution-focused responses to customer inquiries while maintaining brand voice.",
    category: "support",
    tags: ["customer service", "communication", "templates"],
    author: "Emily Rodriguez",
    authorRole: "Support Lead",
    uses: 3421,
    votes: 567,
    featured: false,
  },
];

export default function PromptExplorer({ user }: PromptExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [filteredPrompts, setFilteredPrompts] = useState(mockPrompts);

  useEffect(() => {
    let filtered = mockPrompts;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(prompt => prompt.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(prompt => 
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort prompts
    switch (sortBy) {
      case "popular":
        filtered.sort((a, b) => b.uses - a.uses);
        break;
      case "trending":
        filtered.sort((a, b) => b.votes - a.votes);
        break;
      case "newest":
        // In real app, would sort by created_at
        filtered.reverse();
        break;
    }

    setFilteredPrompts(filtered);
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <Image 
                  src="/images/sambatv-icon.png" 
                  alt="SambaTV" 
                  width={32} 
                  height={32}
                  className="rounded"
                />
                <span className="text-xl font-bold text-gray-900">{config.metadata.title}</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link href="/submit">
                    <Button className="bg-primary hover:bg-primary/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Prompt
                    </Button>
                  </Link>
                  <UserMenu />
                </>
              ) : (
                <SignIn />
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 via-white to-primary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Craft Perfect AI Prompts
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover and share powerful prompts for AI models across SambaTV
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search prompts by title, description, or tags..."
              className="pl-12 pr-4 py-6 text-lg rounded-full border-2 border-gray-200 focus:border-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Quick Stats */}
          <div className="mt-8 flex justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{mockPrompts.length}+</div>
              <div className="text-sm text-gray-600">Prompts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50+</div>
              <div className="text-sm text-gray-600">Contributors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-gray-600">Monthly Uses</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Categories */}
          <aside className="w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition-colors ${
                      selectedCategory === category.id
                        ? "bg-primary text-white"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <span className="text-xl">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Filters and Sorting */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <Tabs value={sortBy} onValueChange={setSortBy}>
                  <TabsList>
                    <TabsTrigger value="popular">Most Popular</TabsTrigger>
                    <TabsTrigger value="trending">Trending</TabsTrigger>
                    <TabsTrigger value="newest">Newest</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="text-sm text-gray-600">
                Showing {filteredPrompts.length} prompts
              </div>
            </div>

            {/* Featured Section */}
            {selectedCategory === "all" && (
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
                      <PromptCard key={prompt.id} prompt={prompt} featured />
                    ))}
                </div>
              </div>
            )}

            {/* Prompt Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPrompts
                .filter(p => !p.featured || selectedCategory !== "all")
                .map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
            </div>

            {/* Empty State */}
            {filteredPrompts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No prompts found matching your criteria.</p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Login Prompt for Non-authenticated Users */}
      {!user && (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t shadow-lg p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Join SambaTV Prompt Library</p>
              <p className="text-sm text-gray-600">Sign in to create and save prompts</p>
            </div>
            <SignIn />
          </div>
        </div>
      )}
    </div>
  );
}

// Prompt Card Component
function PromptCard({ prompt, featured = false }: { prompt: any; featured?: boolean }) {
  const categoryInfo = categories.find(c => c.id === prompt.category);

  return (
    <Link href={`/prompt/${prompt.id}`}>
      <Card className={`h-full hover:shadow-lg transition-shadow cursor-pointer ${
        featured ? "border-primary" : ""
      }`}>
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <Badge variant="secondary" className="text-xs">
              {categoryInfo?.icon} {categoryInfo?.name}
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
          <div className="flex flex-wrap gap-2 mb-4">
            {prompt.tags.map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {prompt.uses}
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {prompt.votes}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t flex items-center justify-between">
            <div className="text-sm">
              <p className="font-medium text-gray-900">{prompt.author}</p>
              <p className="text-gray-500 text-xs">{prompt.authorRole}</p>
            </div>
            <Button size="sm" variant="ghost" className="text-primary">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
} 