'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

interface SimpleMarkdownProps {
  content: string
  className?: string
}

export function SimpleMarkdown({ content, className }: SimpleMarkdownProps) {
  return (
    <div className={cn(
      "prose prose-gray dark:prose-invert max-w-none",
      "prose-headings:font-semibold",
      "prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg",
      "prose-p:text-gray-700 dark:prose-p:text-gray-300",
      "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
      "prose-code:text-sm prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded",
      "prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:overflow-x-auto prose-pre:p-4 prose-pre:rounded-lg",
      "prose-blockquote:border-l-primary prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400",
      "prose-ul:list-disc prose-ol:list-decimal",
      "prose-table:border-collapse prose-th:border prose-th:border-gray-300 prose-td:border prose-td:border-gray-300",
      className
    )}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}