'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, RotateCcw, Beaker } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

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

export function TemplateVariables({ content, promptId, className, onContentChange }: TemplateVariablesProps) {
  const [variables, setVariables] = useState<TemplateVariable[]>([])
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})
  const [processedContent, setProcessedContent] = useState(content)
  const router = useRouter()

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

  const handleCopyProcessed = () => {
    // Create clean content without highlight markers for copying
    let cleanContent = content
    variables.forEach(variable => {
      const value = variableValues[variable.name] || variable.defaultValue || `{{${variable.name}}}`
      const patterns = [
        new RegExp(`\\{\\{\\s*${variable.name}\\s*\\|[^}]*\\}\\}`, 'g'),
        new RegExp(`\\{\\{\\s*${variable.name}\\s*\\}\\}`, 'g')
      ]
      patterns.forEach(pattern => {
        cleanContent = cleanContent.replace(pattern, value)
      })
    })
    
    navigator.clipboard.writeText(cleanContent)
    toast({
      title: "Copied!",
      description: "Prompt with filled variables copied to clipboard",
    })
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
    <div className={`space-y-4 ${className || ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Template Variables</h3>
          <p className="text-xs text-muted-foreground">Fill in the variables to customize this prompt</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleReset}
            className="text-xs h-8 px-3"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
          <Button
            onClick={handleCopyProcessed}
            className="text-xs h-8 px-3"
          >
            <Copy className="w-3 h-3 mr-1" />
            Copy Filled
          </Button>
          {promptId && (
            <Button
              className="text-xs h-8 px-3"
              onClick={handleTestInPlayground}
            >
              <Beaker className="w-3 h-3 mr-1" />
              Test in Playground
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid gap-3">
        {variables.map(variable => (
          <div key={variable.name} className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor={variable.name} className="text-sm">
                {variable.name}
              </Label>
              {variable.defaultValue && (
                <Badge variant="secondary" className="text-xs">
                  {variable.defaultValue}
                </Badge>
              )}
            </div>
            <Input
              id={variable.name}
              type="text"
              placeholder={variable.defaultValue || `Enter ${variable.name}`}
              value={variableValues[variable.name] || ''}
              onChange={(e) => handleVariableChange(variable.name, e.target.value)}
              className="text-sm"
            />
          </div>
        ))}
      </div>
      
      {hasFilledVariables && (
        <div className="text-xs text-muted-foreground">
          Variables filled! The prompt above shows your customized version.
        </div>
      )}
    </div>
  )
}