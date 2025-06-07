'use client'

import { useState } from 'react'
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
    examples?: any[]
  }
  user: any
  isOwner: boolean
}

export function PromptContentSection({ prompt, user, isOwner }: PromptContentSectionProps) {
  const [processedContent, setProcessedContent] = useState<string | undefined>()

  return (
    <>
      {/* Template Variables */}
      <TemplateVariables 
        content={prompt.content}
        className="mb-4 sm:mb-6"
        onContentChange={setProcessedContent}
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
          <div className="bg-gray-50 p-3 sm:p-4 md:p-6 rounded-lg overflow-x-auto">
            <PromptContentRenderer 
              content={prompt.content}
              processedContent={processedContent}
              showVariables={true}
            />
          </div>
          <div className="mt-3 sm:mt-4 flex items-center justify-between">
            <div className="text-xs text-gray-500">
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
                className="bg-primary text-white hover:bg-primary/90"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )
}