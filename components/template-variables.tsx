'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, RotateCcw, Beaker } from 'lucide-react'
import { useDebouncedToast } from '@/hooks/use-debounced-toast'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface TemplateVariable {
  name: string
  defaultValue?: string
  description?: string
}

interface TemplateVariablesProps {
  content: string
  promptId?: string | number
  className?: string
  onContentChange?: (content: string | undefined) => void
}

// Robust clipboard function with fallback for mobile
const copyToClipboard = async (text: string): Promise<void> => {
  try {
    // Modern clipboard API with fallback
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
    } else {
      // Fallback method for older browsers or non-secure contexts
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      try {
        document.execCommand('copy')
      } catch (err) {
        throw new Error('Failed to copy using fallback method')
      } finally {
        textArea.remove()
      }
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    throw error
  }
}

export function TemplateVariables({ content, promptId, className, onContentChange }: TemplateVariablesProps) {
  const [variables, setVariables] = useState<TemplateVariable[]>([])
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})
  const [processedContent, setProcessedContent] = useState(content)
  const router = useRouter()
  const { showToast } = useDebouncedToast()
  const { toast: showToastToast } = useToast()

  // Extract template variables from content
  useEffect(() => {
    const extractVariables = () => {
      const variablePattern = /\{\{([^}|]+)(?:\|([^}]*))?\}\}/g
      const foundVariables = new Map<string, TemplateVariable>()
      
      let match
      while ((match = variablePattern.exec(content)) !== null) {
        const name = match[1].trim()
        const defaultValue = match[2]?.trim()
        
        if (!foundVariables.has(name)) {
          foundVariables.set(name, {
            name,
            defaultValue,
            description: `Value for ${name}`
          })
        }
      }
      
      setVariables(Array.from(foundVariables.values()))
    }
    
    extractVariables()
  }, [content])

  // Update processed content when variable values change
  useEffect(() => {
    let newContent = content
    const hasAnyFilledVariables = Object.keys(variableValues).some(
      key => variableValues[key] && variableValues[key] !== ''
    )
    
    if (hasAnyFilledVariables) {
      variables.forEach(variable => {
        const value = variableValues[variable.name] || variable.defaultValue || `{{${variable.name}}}`
        
        // Replace all variations of the variable
        const patterns = [
          new RegExp(`\\{\\{\\s*${variable.name}\\s*\\|[^}]*\\}\\}`, 'g'),
          new RegExp(`\\{\\{\\s*${variable.name}\\s*\\}\\}`, 'g')
        ]
        
        patterns.forEach(pattern => {
          if (value !== `{{${variable.name}}}`) {
            // Add highlight markers for filled variables
            newContent = newContent.replace(pattern, `<mark class="filled-variable">${value}</mark>`)
          }
        })
      })
      
      setProcessedContent(newContent)
      onContentChange?.(newContent)
    } else {
      setProcessedContent(content)
      onContentChange?.(undefined)
    }
  }, [content, variables, variableValues, onContentChange])

  const handleVariableChange = (name: string, value: string) => {
    setVariableValues(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleReset = () => {
    setVariableValues({})
  }

  const handleCopyProcessed = async () => {
    // Create clean content without highlight markers for copying
    let cleanContent = content
    let hasFilledVars = false
    
    variables.forEach(variable => {
      const value = variableValues[variable.name] || variable.defaultValue || `{{${variable.name}}}`
      
      // Check if this variable has been customized (not just using default)
      if (variableValues[variable.name] && variableValues[variable.name] !== '') {
        hasFilledVars = true
      }
      
      const patterns = [
        new RegExp(`\\{\\{\\s*${variable.name}\\s*\\|[^}]*\\}\\}`, 'g'),
        new RegExp(`\\{\\{\\s*${variable.name}\\s*\\}\\}`, 'g')
      ]
      patterns.forEach(pattern => {
        cleanContent = cleanContent.replace(pattern, value)
      })
    })
    
    try {
      await copyToClipboard(cleanContent)
      
      // Only show notification if variables were actually customized
      if (hasFilledVars) {
        showToastToast({
          title: "Copied!",
          description: "Customized prompt copied to clipboard",
        })
      } else {
        showToastToast({
          title: "Copied!",
          description: "Prompt copied to clipboard",
        })
      }
    } catch (error) {
      showToastToast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleTestInPlayground = () => {
    if (!promptId) return
    
    let processedContentWithHighlights = content
    variables.forEach(variable => {
      const value = variableValues[variable.name] || variable.defaultValue || `{{${variable.name}}}`
      
      const pattern = new RegExp(`\\{\\{\\s*${variable.name}(?:\\s*\\|[^}]*)?\\s*\\}\\}`, 'g')

      if (value && value !== `{{${variable.name}}}`) {
        // If the variable is filled, wrap it in the styled mark tag
        processedContentWithHighlights = processedContentWithHighlights.replace(pattern, `<mark class="filled-variable">${value}</mark>`)
      } else {
        // Otherwise, just replace it with the placeholder itself
        processedContentWithHighlights = processedContentWithHighlights.replace(pattern, value)
      }
    })
    
    // Store the HTML-rich content in localStorage
    localStorage.setItem('playground-processed-content', processedContentWithHighlights)
    localStorage.setItem('playground-prompt-id', promptId.toString())
    
    // Navigate to playground
    router.push(`/playground?promptId=${promptId}&processed=true`)
  }

  if (variables.length === 0) {
    return null
  }

  const hasFilledVariables = Object.keys(variableValues).some(
    key => variableValues[key] && variableValues[key] !== ''
  )

  return (
    <Card className={cn("mb-4 sm:mb-6", className)}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <CardTitle className="text-lg">Customize Variables</CardTitle>
          <div className="flex flex-wrap gap-2 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-xs h-8 px-3 flex-1 sm:flex-none min-w-0"
            >
              <RotateCcw className="w-3 h-3 mr-1 shrink-0" />
              <span className="truncate">Reset</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleCopyProcessed}
              className="text-xs h-8 px-3 flex-1 sm:flex-none min-w-0"
            >
              <Copy className="w-3 h-3 mr-1 shrink-0" />
              <span className="truncate">Copy</span>
            </Button>
            {promptId && (
              <Button
                className="text-xs h-8 px-3 flex-1 sm:flex-none min-w-0"
                onClick={handleTestInPlayground}
              >
                <Beaker className="w-3 h-3 mr-1 shrink-0" />
                <span className="truncate sm:inline">Test</span>
                <span className="hidden sm:inline"> in Playground</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {variables.map((variable) => (
          <div key={variable.name} className="space-y-2">
            <Label htmlFor={variable.name} className="text-sm font-medium">
              {variable.name}
              {variable.defaultValue && (
                <span className="text-xs text-muted-foreground ml-2">
                  (default: {variable.defaultValue})
                </span>
              )}
            </Label>
            <Input
              id={variable.name}
              value={variableValues[variable.name] || ''}
              onChange={(e) => handleVariableChange(variable.name, e.target.value)}
              placeholder={variable.defaultValue || `Enter ${variable.name}`}
              className="text-sm"
            />
          </div>
        ))}
        
        {/* Preview */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <Label className="text-sm font-medium mb-2 block">Preview:</Label>
          <div className="text-sm whitespace-pre-wrap break-words">
            {processedContent}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}