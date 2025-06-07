'use client'

import { useState, useEffect, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface TemplateVariablesProps {
  content: string
  className?: string
  onContentChange?: (processedContent: string) => void
}

interface Variable {
  name: string
  defaultValue?: string
  description?: string
}

export function TemplateVariables({ content, className, onContentChange }: TemplateVariablesProps) {
  const { toast } = useToast()
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})

  // Extract variables from content
  const variables = useMemo(() => {
    const variablePattern = /\{\{([^}]+)\}\}/g
    const matches = [...content.matchAll(variablePattern)]
    const uniqueVariables = new Map<string, Variable>()

    matches.forEach(match => {
      const fullMatch = match[1].trim()
      // Check if variable has format: name|default|description
      const parts = fullMatch.split('|').map(p => p.trim())
      const name = parts[0]
      
      if (!uniqueVariables.has(name)) {
        uniqueVariables.set(name, {
          name,
          defaultValue: parts[1] || '',
          description: parts[2] || ''
        })
      }
    })

    return Array.from(uniqueVariables.values())
  }, [content])

  // Initialize default values
  useEffect(() => {
    const defaults: Record<string, string> = {}
    variables.forEach(variable => {
      if (variable.defaultValue && !variableValues[variable.name]) {
        defaults[variable.name] = variable.defaultValue
      }
    })
    if (Object.keys(defaults).length > 0) {
      setVariableValues(prev => ({ ...prev, ...defaults }))
    }
  }, [variables])

  // Process content with variable values
  const processedContent = useMemo(() => {
    let processed = content
    variables.forEach(variable => {
      const value = variableValues[variable.name] || variable.defaultValue || `{{${variable.name}}}`
      // Replace all variations of the variable (with or without default/description)
      const patterns = [
        new RegExp(`\\{\\{\\s*${variable.name}\\s*\\|[^}]*\\}\\}`, 'g'),
        new RegExp(`\\{\\{\\s*${variable.name}\\s*\\}\\}`, 'g')
      ]
      patterns.forEach(pattern => {
        processed = processed.replace(pattern, value)
      })
    })
    return processed
  }, [content, variables, variableValues])

  // Notify parent of content changes
  useEffect(() => {
    if (onContentChange) {
      onContentChange(processedContent)
    }
  }, [processedContent, onContentChange])

  const handleVariableChange = (name: string, value: string) => {
    setVariableValues(prev => ({ ...prev, [name]: value }))
  }

  const handleReset = () => {
    const defaults: Record<string, string> = {}
    variables.forEach(variable => {
      if (variable.defaultValue) {
        defaults[variable.name] = variable.defaultValue
      }
    })
    setVariableValues(defaults)
  }

  const handleCopyProcessed = () => {
    navigator.clipboard.writeText(processedContent)
    toast({
      title: "Copied!",
      description: "Processed prompt copied to clipboard",
    })
  }

  if (variables.length === 0) {
    return null
  }

  return (
    <Card className={cn("mb-4 sm:mb-6", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Template Variables</CardTitle>
            <CardDescription className="text-sm mt-1">
              Fill in the variables to customize this prompt
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyProcessed}
              className="text-xs"
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy Filled
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {variables.map((variable) => (
          <div key={variable.name} className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor={variable.name} className="text-sm font-medium">
                {variable.name}
              </Label>
              <Badge variant="secondary" className="text-xs">
                {`{{${variable.name}}}`}
              </Badge>
            </div>
            {variable.description && (
              <p className="text-xs text-gray-600">{variable.description}</p>
            )}
            <Input
              id={variable.name}
              type="text"
              placeholder={variable.defaultValue || `Enter ${variable.name}...`}
              value={variableValues[variable.name] || ''}
              onChange={(e) => handleVariableChange(variable.name, e.target.value)}
              className="text-sm"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}