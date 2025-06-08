import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { auth } from '@/lib/auth'
import Navigation from '@/components/navigation/Navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Folder, ArrowLeft, Users, FileText, Heart, GitFork, Copy, Star, Edit } from 'lucide-react'
import { fetchPrompts, getCategories } from '@/app/actions/prompts'
import { PromptCopyButton } from "@/components/prompt-copy-button"
import { FavoriteButton } from "@/components/favorite-button"
import { ForkBadge } from "@/components/fork-badge"
import CategoryEditModal from './components/CategoryEditModal'
import Link from 'next/link'

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const categoryId = category
  
  // Get category details
  const categories = await getCategories()
  const categoryData = categories.find(cat => cat.id.toString() === categoryId)
  
  if (!categoryData) {
    return {
      title: 'Category Not Found - SambaTV Prompt Library',
      description: 'The requested category could not be found.',
    }
  }

  return {
    title: `${categoryData.name} Prompts - SambaTV Prompt Library`,
    description: categoryData.description 
      ? `Browse AI prompts in ${categoryData.name}. ${categoryData.description}`
      : `Browse AI prompts in the ${categoryData.name} category.`,
  }
}

// Simple Prompt Card Component
function PromptCard({ prompt, user }: { prompt: any; user: any }) {
  return (
    <Link href={`/prompt/${prompt.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <Badge variant="secondary" className="text-xs">
              {prompt.categories?.name || 'General'}
            </Badge>
            {prompt.featured && (
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
            <PromptCopyButton
              promptId={prompt.id}
              text={prompt.content || ''}
              label=""
              variant="ghost"
              className="text-primary"
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

async function CategoryPageContent({ categoryId }: { categoryId: string }) {
  // Get user session
  const session = await auth()
  
  // Get category details
  const categories = await getCategories()
  const category = categories.find(cat => cat.id.toString() === categoryId)
  
  if (!category) {
    notFound()
  }

  // Fetch prompts in this category
  const { prompts } = await fetchPrompts({ category_id: parseInt(categoryId) })

  return (
    <div className="space-y-8">
      {/* Category Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                  className="mb-2"
                >
                  <Link href="/categories">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    All Categories
                  </Link>
                </Button>
                <div className="mb-2">
                  <CategoryEditModal category={category} />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Folder className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {category.name}
                  </h1>
                  {category.description && (
                    <p className="text-muted-foreground mt-1 max-w-2xl">
                      {category.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>{prompts.length} prompts</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Category #{category.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Other Categories */}
      {categories.length > 1 && (
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories
            .filter(cat => cat.id !== category.id)
            .sort((a, b) => {
              if (a.display_order !== b.display_order) {
                return a.display_order - b.display_order
              }
              return a.name.localeCompare(b.name)
            })
            .map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}`}
              >
                <button className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200">
                  {cat.name}
                </button>
              </Link>
            ))}
          <Link href="/categories">
            <button className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors bg-primary/10 text-primary hover:bg-primary/20">
              View All
            </button>
          </Link>
        </div>
      )}

      {/* Prompts */}
      {prompts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Folder className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No prompts found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              No prompts are currently in the "{category.name}" category. 
              <br />
              <Link href="/submit" className="text-primary hover:underline">
                Be the first to add one!
              </Link>
            </p>
          </CardContent>
        </Card>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              Prompts in {category.name}
            </h2>
            <Badge variant="secondary">
              {prompts.length} prompts
            </Badge>
          </div>
          
          {/* Simple Prompt Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} user={session?.user || null} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  const categoryId = category

  return (
    <>
      <Navigation />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense 
            fallback={
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading prompts...</p>
                </div>
              </div>
            }
          >
            <CategoryPageContent categoryId={categoryId} />
          </Suspense>
        </div>
      </div>
    </>
  )
} 