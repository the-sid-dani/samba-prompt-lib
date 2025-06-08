'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Hash, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getTags } from '@/app/actions/tags'

interface Tag {
  id: number
  name: string
  usage_count: number
}

interface TagCloudProps {
  onTagClick?: (tag: string) => void
  className?: string
  maxTags?: number
  showTitle?: boolean
  title?: string
  description?: string
}

export default function TagCloud({ 
  onTagClick, 
  className, 
  maxTags = 50,
  showTitle = true,
  title = "Popular Tags",
  description = "Explore prompts by popular tags"
}: TagCloudProps) {
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTagsData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const tagsData = await getTags()
      
      // Filter out tags with zero usage and sort by usage count
      const activeTags = tagsData
        .filter(tag => tag.usage_count > 0)
        .sort((a, b) => b.usage_count - a.usage_count)
        .slice(0, maxTags)
      
      setTags(activeTags)
    } catch (error) {
      console.error('Error fetching tags:', error)
      setError('Failed to load tags')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTagsData()
  }, [maxTags])

  // Calculate tag sizes based on usage count
  const getTagSize = (usage_count: number, maxUsage: number, minUsage: number) => {
    if (maxUsage === minUsage) return 'text-sm'
    
    const ratio = (usage_count - minUsage) / (maxUsage - minUsage)
    
    if (ratio > 0.8) return 'text-2xl font-bold'
    if (ratio > 0.6) return 'text-xl font-semibold'
    if (ratio > 0.4) return 'text-lg font-medium'
    if (ratio > 0.2) return 'text-base'
    return 'text-sm'
  }

  // Calculate tag colors based on usage count
  const getTagColor = (usage_count: number, maxUsage: number, minUsage: number) => {
    if (maxUsage === minUsage) return 'secondary'
    
    const ratio = (usage_count - minUsage) / (maxUsage - minUsage)
    
    if (ratio > 0.7) return 'default'
    if (ratio > 0.4) return 'secondary'
    return 'outline'
  }

  const handleTagClick = (tagName: string) => {
    if (onTagClick) {
      onTagClick(tagName)
    }
  }

  const maxUsage = Math.max(...tags.map(t => t.usage_count), 1)
  const minUsage = Math.min(...tags.map(t => t.usage_count), 0)

  const TagCloudContent = () => (
    <div className="flex flex-wrap gap-2 justify-center items-center">
      {tags.map((tag) => {
        const sizeClass = getTagSize(tag.usage_count, maxUsage, minUsage)
        const colorVariant = getTagColor(tag.usage_count, maxUsage, minUsage)
        
        return (
          <Badge
            key={tag.id}
            variant={colorVariant}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-md",
              "flex items-center gap-1 px-3 py-1.5",
              sizeClass,
              onTagClick && "hover:bg-primary hover:text-primary-foreground"
            )}
            onClick={() => handleTagClick(tag.name)}
            title={`${tag.name} (${tag.usage_count} uses)`}
          >
            <Hash className="w-3 h-3" />
            <span>{tag.name}</span>
            <span className="text-xs opacity-70">({tag.usage_count})</span>
          </Badge>
        )
      })}
    </div>
  )

  if (showTitle) {
    return (
      <Card className={className}>
        <CardHeader className="text-center">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Hash className="w-5 h-5" />
                {title}
              </CardTitle>
              {description && (
                <CardDescription className="mt-2">
                  {description}
                </CardDescription>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchTagsData}
              disabled={isLoading}
            >
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Loading tags...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-sm text-destructive mb-4">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchTagsData}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : tags.length === 0 ? (
            <div className="text-center py-8">
              <Hash className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No tags found</p>
            </div>
          ) : (
            <TagCloudContent />
          )}
        </CardContent>
      </Card>
    )
  }

  // Return just the cloud content without card wrapper
  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center py-8", className)}>
        <RefreshCw className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn("text-center py-8", className)}>
        <p className="text-sm text-destructive">{error}</p>
      </div>
    )
  }

  if (tags.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <p className="text-sm text-muted-foreground">No tags found</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <TagCloudContent />
    </div>
  )
} 