'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp, Copy, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { SimpleMarkdown } from '@/components/simple-markdown'

interface Example {
  input: string
  output: string
  description?: string
}

interface PromptExamplesProps {
  examples: Example[]
  className?: string
}

export function PromptExamples({ examples, className }: PromptExamplesProps) {
  const { toast } = useToast()
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  if (!examples || examples.length === 0) {
    return null
  }

  const handleCopy = (text: string, type: 'input' | 'output') => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `Example ${type} copied to clipboard`,
    })
  }

  return (
    <Card className={cn("mb-4 sm:mb-6", className)}>
      <CardHeader>
        <CardTitle className="text-lg">Examples</CardTitle>
        <CardDescription className="text-sm">
          See how this prompt works with different inputs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {examples.map((example, index) => {
          const isExpanded = expandedIndex === index
          
          return (
            <div
              key={index}
              className={cn(
                "border rounded-lg transition-all duration-200",
                isExpanded ? "border-primary/50 bg-primary/5" : "border-gray-200"
              )}
            >
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        Example {index + 1}
                      </Badge>
                      {example.description && (
                        <span className="text-sm text-gray-600 truncate">
                          {example.description}
                        </span>
                      )}
                    </div>
                    {!isExpanded && (
                      <p className="text-sm text-gray-600 truncate">
                        {example.input}
                      </p>
                    )}
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                </div>
              </button>
              
              {isExpanded && (
                <div className="px-4 pb-4 space-y-4">
                  {/* Input Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Input:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(example.input, 'input')}
                        className="h-7 text-xs"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <SimpleMarkdown
                        content={example.input}
                        className="text-sm prose-sm"
                      />
                    </div>
                  </div>

                  {/* Arrow Separator */}
                  <div className="flex justify-center">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>

                  {/* Output Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Output:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(example.output, 'output')}
                        className="h-7 text-xs"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="bg-primary/5 p-3 rounded-md border border-primary/20">
                      <SimpleMarkdown
                        content={example.output}
                        className="text-sm prose-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}