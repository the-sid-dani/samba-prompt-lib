'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, GitFork, ArrowLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { createPrompt, getCategories } from '@/app/actions/prompts'
import { useAsyncOperation } from '@/hooks/use-api-error'
import { cn } from '@/lib/utils'
import TagInput from '@/components/tag-input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  content: z.string().min(1, 'Prompt content is required').min(10, 'Prompt content must be at least 10 characters'),
  category_id: z.number().min(1, 'Please select a category'),
  tags: z.array(z.string()).min(1, 'Please add at least one tag').max(5, 'Maximum 5 tags allowed'),
  examples: z.array(z.object({
    input: z.string(),
    output: z.string(),
    description: z.string().optional()
  })).optional(),
})

type FormData = z.infer<typeof formSchema>

interface ForkPromptFormProps {
  originalPrompt: {
    id: number
    title: string
    description: string
    content: string
    category_id: number
    tags: string[]
    examples?: any[]
  }
}

export function ForkPromptForm({ originalPrompt }: ForkPromptFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { execute, isLoading } = useAsyncOperation()
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([])
  
  // Convert original examples to the expected format
  const convertedExamples = (originalPrompt.examples || []).map((example: any) => {
    if (typeof example === 'string') {
      return { input: example, output: '', description: '' }
    }
    return {
      input: example.input || '',
      output: example.output || '',
      description: example.description || ''
    }
  })
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: originalPrompt.title,
      description: originalPrompt.description,
      content: originalPrompt.content,
      category_id: originalPrompt.category_id,
      tags: originalPrompt.tags || [],
      examples: convertedExamples,
    },
  })
  
  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getCategories()
        setCategories(cats)
      } catch (error) {
        console.error('Error fetching categories:', error)
        toast({
          title: 'Error',
          description: 'Failed to load categories. Please refresh the page.',
          variant: 'destructive',
        })
      }
    }
    
    fetchCategories()
  }, [toast])
  
  const onSubmit = async (data: FormData) => {
    console.log('Form data being submitted:', data)
    
    const promptData = {
      ...data,
      forked_from: originalPrompt.id,
    }
    
    console.log('Processed prompt data:', promptData)
    
    const result = await execute(createPrompt, promptData)
    
    console.log('Create prompt result:', result)
    
    if (result) {
      toast({
        title: 'Fork created successfully!',
        description: 'Your forked prompt has been saved.',
      })
      
      // Force refresh the pages to ensure they show updated data
      router.refresh()
      router.push(`/prompt/${result.id}`)
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        
        <div className="text-sm text-muted-foreground">
          Forking from: {originalPrompt.title}
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter prompt title..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Describe what your prompt does..."
                    className="resize-y min-h-[80px] max-h-[200px]"
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Content */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt Content</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Enter your prompt content..."
                    className="resize-y min-h-[300px] max-h-[500px] font-mono"
                    rows={12}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Category */}
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => field.onChange(category.id)}
                        className={cn(
                          "flex items-center justify-center px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors min-h-[36px]",
                          field.value === category.id
                            ? "bg-primary text-white"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Tags */}
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <TagInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Add tags..."
                    maxTags={5}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Examples */}
          <FormField
            control={form.control}
            name="examples"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Examples (Optional)</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {(field.value || []).map((example, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Example {index + 1}</h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newExamples = (field.value || []).filter((_, i) => i !== index)
                              field.onChange(newExamples)
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <label className="text-sm font-medium">Input</label>
                            <Textarea
                              value={example.input}
                              onChange={(e) => {
                                const newExamples = [...(field.value || [])]
                                newExamples[index] = { ...newExamples[index], input: e.target.value }
                                field.onChange(newExamples)
                              }}
                              placeholder="Example input..."
                              className="mt-1"
                              rows={2}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Output</label>
                            <Textarea
                              value={example.output}
                              onChange={(e) => {
                                const newExamples = [...(field.value || [])]
                                newExamples[index] = { ...newExamples[index], output: e.target.value }
                                field.onChange(newExamples)
                              }}
                              placeholder="Expected output..."
                              className="mt-1"
                              rows={2}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Description (Optional)</label>
                            <Input
                              value={example.description || ''}
                              onChange={(e) => {
                                const newExamples = [...(field.value || [])]
                                newExamples[index] = { ...newExamples[index], description: e.target.value }
                                field.onChange(newExamples)
                              }}
                              placeholder="Brief description..."
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        field.onChange([...(field.value || []), { input: '', output: '', description: '' }])
                      }}
                      disabled={(field.value || []).length >= 5}
                    >
                      Add Example
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Fork...
                </>
              ) : (
                <>
                  <GitFork className="h-4 w-4 mr-2" />
                  Create Fork
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
} 