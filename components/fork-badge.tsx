import Link from 'next/link'
import { GitFork } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ForkBadgeProps {
  forkedFrom: {
    id: number
    title: string
    user_id: string
    profiles: {
      id: string
      username: string | null
      name: string | null
      email: string | null
      avatar_url: string | null
    }
  }
  className?: string
}

export function ForkBadge({ forkedFrom, className }: ForkBadgeProps) {
  const authorName = forkedFrom.profiles?.username || 
                     forkedFrom.profiles?.name || 
                     forkedFrom.profiles?.email?.split('@')[0] || 
                     'Unknown'

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs font-medium">
        <GitFork className="w-3 h-3" />
        <span>Fork</span>
      </span>
      <span className="text-sm text-muted-foreground">
        Forked from{' '}
        <Link 
          href={`/prompt/${forkedFrom.id}`}
          className="font-medium text-foreground hover:text-red-600 hover:underline"
        >
          {forkedFrom.title}
        </Link>
        {' '}by{' '}
        <Link 
          href={`/users/${forkedFrom.profiles.id}`}
          className="font-medium text-foreground hover:text-red-600 hover:underline"
        >
          {authorName}
        </Link>
      </span>
    </div>
  )
}