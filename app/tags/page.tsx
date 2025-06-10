'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/navigation/Navigation'
import TagCloud from '@/components/tag-cloud'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Hash, Search } from 'lucide-react'
import { getTags } from '@/app/actions/tags'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

interface Tag {
  id: number
  name: string
  usage_count: number
}

function TagsGrid() {
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadTags = async () => {
      try {
        const tagsData = await getTags()
        
        // Filter out tags with zero usage and sort by usage count
        const activeTags = tagsData
          .filter((tag: Tag) => tag.usage_count > 0)
          .sort((a: Tag, b: Tag) => b.usage_count - a.usage_count)

        setTags(activeTags)
      } catch (error) {
        console.error('Error loading tags:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTags()
  }, [])

  const handleTagClick = (tag: string) => {
    router.push(`/tags/${encodeURIComponent(tag)}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tags...</p>
        </div>
      </div>
    )
  }

  if (tags.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Hash className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No tags found</h3>
          <p className="text-muted-foreground text-center max-w-md">
            No tags are currently in use. Tags will appear here once prompts are created with tags.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Tag Cloud Section */}
      <TagCloud 
        onTagClick={handleTagClick}
        maxTags={100}
        title="Tag Cloud"
        description="Popular tags sized by usage frequency"
      />
      
      {/* All Tags Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            All Tags
          </CardTitle>
          <CardDescription>
            Browse all {tags.length} active tags alphabetically
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {tags
              .sort((a: Tag, b: Tag) => a.name.localeCompare(b.name))
              .map((tag: Tag) => (
                <Link
                  key={tag.id}
                  href={`/tags/${encodeURIComponent(tag.name)}`}
                  className="group"
                >
                  <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/50 group-hover:scale-105">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <Hash className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="font-medium truncate">{tag.name}</span>
                        </div>
                        <Badge variant="secondary" className="ml-2 flex-shrink-0">
                          {tag.usage_count}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function TagsPage() {
  return (
    <>
      <Navigation />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Hash className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Browse Tags
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore prompts organized by tags. Click on any tag to discover related prompts and find exactly what you're looking for.
            </p>
          </div>

          <Suspense 
            fallback={
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading tags...</p>
                </div>
              </div>
            }
          >
            <TagsGrid />
          </Suspense>
        </div>
      </div>
    </>
  )
} 