import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { auth } from '@/lib/auth'
import Navigation from '@/components/navigation/Navigation'
import PromptExplorer from '@/components/prompt-explorer/PromptExplorer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Hash, ArrowLeft, Users, TrendingUp } from 'lucide-react'
import { fetchPrompts } from '@/app/actions/prompts'
import { getTags, getRelatedTags } from '@/app/actions/tags'
import Link from 'next/link'

interface TagPageProps {
  params: {
    tag: string
  }
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tagName = decodeURIComponent(params.tag)
  
  return {
    title: `${tagName} Prompts - SambaTV Prompt Library`,
    description: `Browse AI prompts tagged with "${tagName}". Find and discover prompts related to ${tagName}.`,
  }
}

async function TagPageContent({ tagName }: { tagName: string }) {
  // Get user session
  const session = await auth()
  
  // Fetch prompts with this tag
  const { prompts } = await fetchPrompts({ tag: tagName })
  
  // Get all tags to check if this tag exists
  const allTags = await getTags()
  const currentTag = allTags.find(tag => tag.name.toLowerCase() === tagName.toLowerCase())
  
  if (!currentTag) {
    notFound()
  }

  // Get related tags
  const relatedTags = await getRelatedTags(currentTag.id, 8)

  return (
    <div className="space-y-8">
      {/* Tag Header */}
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
                  <Link href="/tags">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    All Tags
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Hash className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    #{tagName}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{prompts.length} prompts</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{currentTag.usage_count} total uses</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Related Tags */}
      {relatedTags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Related Tags</CardTitle>
            <CardDescription>
              Tags that are often used together with #{tagName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {relatedTags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tags/${encodeURIComponent(tag.name)}`}
                >
                  <Badge 
                    variant="outline" 
                    className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                  >
                    <Hash className="w-3 h-3 mr-1" />
                    {tag.name}
                    <span className="ml-1 text-xs opacity-70">({tag.count})</span>
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prompts */}
      {prompts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Hash className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No prompts found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              No prompts are currently tagged with "#{tagName}". 
              <br />
              <Link href="/submit" className="text-primary hover:underline">
                Be the first to create one!
              </Link>
            </p>
          </CardContent>
        </Card>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              Prompts tagged with #{tagName}
            </h2>
            <Badge variant="secondary">
              {prompts.length} prompts
            </Badge>
          </div>
          
          <PromptExplorer 
            user={session?.user || null}
            prompts={prompts}
            // Don't show categories filter since we're filtering by tag
            categories={[]}
          />
        </div>
      )}
    </div>
  )
}

export default function TagPage({ params }: TagPageProps) {
  const tagName = decodeURIComponent(params.tag)

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
            <TagPageContent tagName={tagName} />
          </Suspense>
        </div>
      </div>
    </>
  )
} 