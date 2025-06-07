'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Example {
  input: string
  output: string
  description?: string
}

interface PromptExamplesEditorProps {
  examples: Example[]
  onChange: (examples: Example[]) => void
  className?: string
}

export function PromptExamplesEditor({ examples, onChange, className }: PromptExamplesEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const addExample = () => {
    onChange([...examples, { input: '', output: '', description: '' }])
    setExpandedIndex(examples.length)
  }

  const removeExample = (index: number) => {
    onChange(examples.filter((_, i) => i !== index))
    if (expandedIndex === index) {
      setExpandedIndex(null)
    }
  }

  const updateExample = (index: number, field: keyof Example, value: string) => {
    const updated = [...examples]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-lg">Examples (Optional)</CardTitle>
        <CardDescription className="text-sm">
          Add examples to show how your prompt works with different inputs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {examples.map((example, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-sm">Example {index + 1}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeExample(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor={`description-${index}`} className="text-sm">
                  Description (Optional)
                </Label>
                <Input
                  id={`description-${index}`}
                  type="text"
                  placeholder="Brief description of this example..."
                  value={example.description || ''}
                  onChange={(e) => updateExample(index, 'description', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor={`input-${index}`} className="text-sm">
                  Input
                </Label>
                <Textarea
                  id={`input-${index}`}
                  placeholder="Example input..."
                  value={example.input}
                  onChange={(e) => updateExample(index, 'input', e.target.value)}
                  className="mt-1 min-h-[80px]"
                  required
                />
              </div>

              <div>
                <Label htmlFor={`output-${index}`} className="text-sm">
                  Expected Output
                </Label>
                <Textarea
                  id={`output-${index}`}
                  placeholder="Expected output..."
                  value={example.output}
                  onChange={(e) => updateExample(index, 'output', e.target.value)}
                  className="mt-1 min-h-[80px]"
                  required
                />
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addExample}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Example
        </Button>
      </CardContent>
    </Card>
  )
}