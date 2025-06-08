'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { GitFork, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { fetchPromptForks } from '@/app/actions/prompts'
import { Skeleton } from '@/components/ui/skeleton'

interface Fork {
  id: number
  created_at: string
  forked_prompt: {
    id: number
    title: string
    description: string
    uses: number
    votes: number
    created_at: string
    profiles: {
      id: string
      username: string | null
      name: string | null
      email: string | null
      avatar_url: string | null
    }
  }
}

interface PromptForksDropdownProps {
  promptId: number
  forkCount: number
}

export function PromptForksDropdown({ promptId, forkCount }: PromptForksDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [forks, setForks] = useState<Fork[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    if (isOpen && !hasLoaded && forkCount > 0) {
      setIsLoading(true)
      fetchPromptForks(promptId)
        .then((data) => {
          setForks(data as unknown as Fork[])
          setHasLoaded(true)
        })
        .catch((error) => {
          console.error('Failed to fetch forks:', error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [isOpen, hasLoaded, promptId, forkCount])

  if (forkCount === 0) {
    return (
      <div className="flex items-center gap-1 sm:gap-2 text-gray-600">
        <GitFork className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="text-sm sm:text-base font-semibold">0</span>
      </div>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 sm:gap-2 px-2 hover:bg-gray-100"
        >
          <GitFork className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          <span className="text-sm sm:text-base font-semibold">{forkCount}</span>
          {isOpen ? (
            <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="w-[320px] sm:w-[380px] max-h-[400px] overflow-y-auto"
      >
        <DropdownMenuLabel className="font-medium text-sm">
          <div className="flex items-center justify-between">
            <span>Forked Versions ({forkCount})</span>
            <Link 
              href={`/prompt/${promptId}/forks`}
              className="text-xs text-primary hover:underline font-normal"
              onClick={(e) => e.stopPropagation()}
            >
              View all
            </Link>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : forks.length > 0 ? (
          <>
            {forks.map((fork) => {
              const author = fork.forked_prompt.profiles
              const authorName = author?.username || author?.name || author?.email?.split('@')[0] || 'Anonymous'
              const initials = authorName.slice(0, 2).toUpperCase()
              
              return (
                <DropdownMenuItem key={fork.id} asChild>
                  <Link 
                    href={`/prompt/${fork.forked_prompt.id}`}
                    className="flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-50"
                  >
                    <Avatar className="h-8 w-8 mt-0.5">
                      <AvatarImage src={author?.avatar_url || ''} alt={authorName} />
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {fork.forked_prompt.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-xs text-gray-600">
                              by <span className="font-medium">{authorName}</span>
                            </p>
                            <span className="text-xs text-gray-400">•</span>
                            <p className="text-xs text-gray-500">
                              {new Date(fork.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" />
                      </div>
                      {fork.forked_prompt.description && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {fork.forked_prompt.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                        <span>{fork.forked_prompt.uses} uses</span>
                        <span>{fork.forked_prompt.votes} votes</span>
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              )
            })}
          </>
        ) : (
          <div className="p-4 text-center text-sm text-gray-500">
            No forks found
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}