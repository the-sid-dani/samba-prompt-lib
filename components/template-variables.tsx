'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, RotateCcw, Beaker, Variable, AlertCircle } from 'lucide-react'
import { useDebouncedToast } from '@/hooks/use-debounced-toast'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TemplateVariable {
  name: string
  value: string
  defaultValue?: string
}

interface TemplateVariablesProps {
  content: string
  className?: string
  onContentChange?: (content: string | undefined) => void
  promptId?: string | number
  variables: Record<string, string>
  onVariableChange: (varName: string, value: string) => void
  onVariablesFilled?: () => void
}

// Extract template variables from content
function extractVariables(content: string): TemplateVariable[] {
  const variableRegex = /\{\{([^}]+)\}\}/g
  const matches = content.match(variableRegex) || []
  const uniqueVariables = new Set<string>()
  
  const variables: TemplateVariable[] = []
  
  matches.forEach(match => {
    // Remove the {{ }} brackets
    const cleanMatch = match.slice(2, -2).trim()
    
    // Check if it has a default value (format: VARIABLE|default)
    const parts = cleanMatch.split('|')
    const variableName = parts[0].trim()
    const defaultValue = parts.length > 1 ? parts[1].trim() : ''
        
    if (!uniqueVariables.has(variableName)) {
      uniqueVariables.add(variableName)
      variables.push({
        name: variableName,
        value: defaultValue,
        defaultValue: defaultValue
          })
        }
  })
  
  return variables
}

export function TemplateVariables({ 
  content, 
  className,
  onContentChange,
  promptId,
  variables, 
  onVariableChange,
  onVariablesFilled
}: TemplateVariablesProps) {
  const [extractedVariables, setExtractedVariables] = useState<TemplateVariable[]>([])
  const [processedContent, setProcessedContent] = useState('')
  const { toast } = useToast()
  const router = useRouter()

  // Extract variables from content on mount and when content changes
  useEffect(() => {
    const extracted = extractVariables(content)
    setExtractedVariables(extracted)
  }, [content])

  // Update processed content when variables change
  useEffect(() => {
    let processed = content
    extractedVariables.forEach(variable => {
      const value = variables[variable.name] || variable.defaultValue || ''
      if (value) {
        // When a variable has a value, keep the curly braces and wrap the entire thing with highlight markers
        const regex = new RegExp(`\\{\\{\\s*${variable.name}(\\|[^}]*)?\\s*\\}\\}`, 'g')
        processed = processed.replace(regex, `|||HIGHLIGHT|||{{${value}}}|||HIGHLIGHT|||`)
      }
    })
    setProcessedContent(processed)
    onContentChange?.(processed)
  }, [variables, content, extractedVariables]) // Removed onContentChange to prevent infinite loop

  const resetVariables = useCallback(() => {
    extractedVariables.forEach(variable => {
      onVariableChange(variable.name, variable.defaultValue || '')
    })
  }, [extractedVariables, onVariableChange])

  const copyToClipboard = useCallback(async () => {
    try {
      // Remove highlight markers before copying
      const cleanContent = processedContent.replace(/\|\|\|HIGHLIGHT\|\|\|/g, '')
      await navigator.clipboard.writeText(cleanContent)
      toast({
            title: "Copied!",
            description: "Customized prompt copied to clipboard",
          })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }, [processedContent, toast])

  const testInPlayground = useCallback(() => {
    // Also remove highlight markers when testing in playground
    const cleanContent = processedContent.replace(/\|\|\|HIGHLIGHT\|\|\|/g, '')
    const params = new URLSearchParams({
      prompt: cleanContent
    })
    router.push(`/playground?${params.toString()}`)
  }, [processedContent, router])
    
  // Don't render if no variables found
  if (extractedVariables.length === 0) {
    return null
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Customize Variables
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={resetVariables}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            
            <Button
              onClick={copyToClipboard}
              size="sm"
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            
              <Button
              onClick={testInPlayground}
              variant="outline"
                size="sm"
              className="flex items-center gap-2"
              >
              <Beaker className="h-4 w-4" />
              Test in Playground
              </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">


        <div className="grid gap-4">
          {extractedVariables.map((variable) => (
            <div key={variable.name} className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor={variable.name} className="text-sm font-medium">
                  {variable.name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </Label>
                {variable.defaultValue && (
                  <Badge variant="secondary" className="text-xs">
                    Default: {variable.defaultValue}
                  </Badge>
                )}
              </div>
              <Input
                id={variable.name}
                value={variables[variable.name] || ''}
                onChange={(e) => onVariableChange(variable.name, e.target.value)}
                placeholder={variable.defaultValue || `Enter ${variable.name}...`}
                className="w-full"
              />
            </div>
          ))}
        </div>


      </CardContent>
    </Card>
  )
}