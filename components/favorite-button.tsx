'use client'

import { useState, useTransition } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { toggleFavorite } from '@/app/actions/prompts'
import { useToast } from '@/hooks/use-toast'
import { useAsyncOperation } from '@/hooks/use-api-error'

interface FavoriteButtonProps {
  promptId: number
  initialFavorited?: boolean
  favoriteCount?: number
  showCount?: boolean
  size?: 'default' | 'sm' | 'lg' | 'icon'
  variant?: 'default' | 'ghost' | 'outline'
  className?: string
  onToggle?: (favorited: boolean) => void
}

export function FavoriteButton({
  promptId,
  initialFavorited = false,
  favoriteCount = 0,
  showCount = true,
  size = 'default',
  variant = 'ghost',
  className,
  onToggle
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited)
  const [count, setCount] = useState(favoriteCount)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const { execute, isLoading } = useAsyncOperation()

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Optimistic update
    const newFavorited = !isFavorited
    setIsFavorited(newFavorited)
    setCount(prev => newFavorited ? prev + 1 : Math.max(0, prev - 1))

    startTransition(async () => {
      try {
        const result = await execute(toggleFavorite, promptId)
        
        // Update based on server response
        if (result) {
          setIsFavorited(result.favorited)
          onToggle?.(result.favorited)
        }
      } catch (error) {
        // Revert optimistic update on error
        setIsFavorited(!newFavorited)
        setCount(prev => !newFavorited ? prev + 1 : Math.max(0, prev - 1))
        
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to update favorite',
          variant: 'destructive'
        })
      }
    })
  }

  const isDisabled = isPending || isLoading

  return (
    <div className="flex items-center gap-1">
      <Button
        size={size}
        variant={variant}
        onClick={handleToggle}
        disabled={isDisabled}
        className={cn(
          'transition-all',
          isFavorited && 'text-red-500 hover:text-red-600',
          className
        )}
        aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        aria-pressed={isFavorited}
      >
        <Heart 
          className={cn(
            'h-4 w-4',
            isFavorited && 'fill-current'
          )}
          aria-hidden="true"
        />
        {showCount && (
          <span className="ml-1">{count}</span>
        )}
      </Button>
    </div>
  )
} 