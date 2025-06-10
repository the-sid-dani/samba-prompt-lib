'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TemplateVariables } from '@/components/template-variables'
import { PromptContentRenderer } from '@/components/prompt-content-renderer'
import { ForkButton } from '@/components/fork-button'
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
    console.log('All variables filled:', variables)
  }, [variables])

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
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="text-xs text-muted-foreground flex-1">
              {processedContent ? (
                <span>Variables filled! The prompt above shows your customized version.</span>
              ) : (
                <span>Tip: Variables in <span className="text-red-600 font-medium">{`{{red}}`}</span> can be customized above</span>
              )}
            </div>
            {user && (
              <ForkButton
                promptId={prompt.id}
                promptTitle={prompt.title}
                promptDescription={prompt.description}
                promptContent={prompt.content}
                categoryId={prompt.category_id || 1}
                tags={prompt.tags || []}
                className="bg-primary text-white hover:bg-primary/90 w-full sm:w-auto shrink-0"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )
}