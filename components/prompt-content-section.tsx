'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TemplateVariables } from '@/components/template-variables'
import { PromptContentRenderer } from '@/components/prompt-content-renderer'
import { PromptExamples } from '@/components/prompt-examples'

interface PromptContentSectionProps {
  prompt: {
    id: number
    content: string
    title: string
    description: string
    category_id?: number | null
    tags?: string[]
    examples?: any[]
  }
  user: any
  isOwner: boolean
}

export function PromptContentSection({ prompt, user, isOwner }: PromptContentSectionProps) {
  const [processedContent, setProcessedContent] = useState<string | undefined>()
  const [variables, setVariables] = useState<Record<string, string>>({})

  const handleVariableChange = useCallback((varName: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [varName]: value
    }))
  }, [])

  const handleVariablesFilled = useCallback(() => {
    // You can add any logic here when all variables are filled
    console.log('All variables filled')
  }, [])

  return (
    <>
      {/* Template Variables */}
      <TemplateVariables 
        content={prompt.content}
        className="mb-4 sm:mb-6"
        onContentChange={setProcessedContent}
        promptId={prompt.id}
        variables={variables}
        onVariableChange={handleVariableChange}
        onVariablesFilled={handleVariablesFilled}
      />

      {/* Examples */}
      {prompt.examples && Array.isArray(prompt.examples) && prompt.examples.length > 0 && (
        <PromptExamples 
          examples={prompt.examples}
          className="mb-4 sm:mb-6"
        />
      )}

      {/* Prompt Content */}
      <Card className="mb-4 sm:mb-6">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Prompt</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
          <div className="bg-muted p-3 sm:p-4 md:p-6 rounded-lg overflow-x-auto">
            <PromptContentRenderer 
              content={prompt.content}
              processedContent={processedContent}
              showVariables={true}
            />
          </div>
          <div className="mt-3 sm:mt-4">
            <div className="text-xs text-muted-foreground">
              {processedContent ? (
                <span>Variables filled! Your customized values are highlighted in <span className="text-red-600 font-medium">red</span> above.</span>
              ) : (
                <span>Tip: Variables in <span className="text-red-600 font-medium">{`{{red}}`}</span> can be customized above</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}