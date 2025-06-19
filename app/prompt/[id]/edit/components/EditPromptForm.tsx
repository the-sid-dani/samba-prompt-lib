'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, Save, ArrowLeft, Edit } from 'lucide-react'

import Navigation from '@/components/navigation/Navigation'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

import { useAsyncOperation } from '@/hooks/use-api-error'
import { updatePrompt, getCategories, fetchTags } from '@/app/actions/prompts'
import { useToast } from '@/hooks/use-toast'
import TagInput from '@/components/tag-input'
import Link from 'next/link'

// Form validation schema
const formSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string()
    .min(1, 'Description is required'),
  content: z.string()
    .min(1, 'Prompt content is required')
    .min(10, 'Prompt content must be at least 10 characters'),
  category_id: z.string()
    .min(1, 'Please select a category'),
  tags: z.array(z.string())
    .min(1, 'Please add at least one tag')
    .max(5, 'Maximum 5 tags allowed'),
})

type FormData = z.infer<typeof formSchema>

interface PromptData {
  id: number
  title: string
  description: string
  content: string
  category_id: number | null
  tags: string[]
  user_id: string
}

interface EditPromptFormProps {
  prompt: PromptData
}

export default function EditPromptForm({ prompt }: EditPromptFormProps) {
  console.log('EditPromptForm rendered with prompt:', prompt)
  
  const router = useRouter()
  const { toast } = useToast()
  const { execute } = useAsyncOperation()
  
  const [categories, setCategories] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(prompt.category_id?.toString() || '')

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: prompt.title || '',
      description: prompt.description || '',
      content: prompt.content || '',
      category_id: prompt.category_id?.toString() || '',
      tags: prompt.tags || [],
    },
  })

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await getCategories()
        setCategories(categoriesData)
      } catch (error) {
        console.error('Failed to load categories:', error)
        toast({
          title: 'Error',
          description: 'Failed to load categories',
          variant: 'destructive',
        })
      }
    }

    loadCategories()
  }, [toast])

  // Fetch tag suggestions
  const handleFetchTagSuggestions = async (query: string): Promise<string[]> => {
    try {
      const tags = await fetchTags(query)
      return tags
    } catch (error) {
      console.error('Error fetching tag suggestions:', error)
      return []
    }
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    form.setValue('category_id', categoryId, { shouldValidate: true })
  }

  const onSubmit = async (data: FormData) => {
    console.log('Form submitted with data:', data)
    setIsSubmitting(true)

    try {
      await execute(updatePrompt, prompt.id, {
        title: data.title,
        description: data.description,
        content: data.content,
        category_id: parseInt(data.category_id),
        tags: data.tags,
      })

      toast({
        title: 'Success!',
        description: 'Your prompt has been updated successfully.',
      })
      
      // Force refresh the pages to ensure they show updated data
      router.refresh()
      
      // Redirect to the updated prompt page
      router.push(`/prompt/${prompt.id}`)
    } catch (error) {
      console.error('Error updating prompt:', error)
      toast({
        title: 'Error',
        description: 'Failed to update prompt. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Navigation />
      
      <div className="min-h-screen bg-background transition-[background-color] duration-300 py-4 md:py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link href={`/prompt/${prompt.id}`} className="inline-flex items-center text-sm sm:text-base text-muted-foreground hover:text-foreground mb-4 sm:mb-6">
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            Back to prompt
          </Link>

          <Card className="border-primary/10 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Edit className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl md:text-2xl font-bold text-foreground">Edit Prompt</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Update your prompt details and content
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Title Field */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold text-foreground">Title *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Give your prompt a clear, descriptive title"
                            className="border-border focus:border-primary transition-colors bg-background text-foreground"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-muted-foreground">
                          Brief description of your prompt (max 100 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description Field */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold text-foreground">Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide a brief description of what your prompt does and when to use it"
                            className="resize-y border-border focus:border-primary transition-colors min-h-[100px] max-h-[300px] bg-background text-foreground"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-muted-foreground">
                          Brief description of your prompt. Drag the bottom-right corner to resize.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Content Field */}
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold text-foreground">Prompt Content *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter your full prompt content here. You can use markdown for formatting."
                            className="resize-y border-border focus:border-primary transition-colors min-h-[300px] max-h-[600px] bg-background text-foreground"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-muted-foreground">
                          The full prompt content with markdown formatting support. Drag the bottom-right corner to resize.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Category Selection */}
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold text-foreground">Category *</FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {categories.map((category) => (
                                <Button
                                  key={category.id}
                                  type="button"
                                  variant={selectedCategoryId === category.id.toString() ? "default" : "outline"}
                                  className={`text-center justify-center h-auto p-3 ${
                                    selectedCategoryId === category.id.toString() 
                                      ? "bg-primary text-primary-foreground" 
                                      : "hover:border-primary/50 bg-background text-foreground border-border"
                                  }`}
                                  onClick={() => handleCategorySelect(category.id.toString())}
                                >
                                  <div className="font-medium text-sm">{category.name}</div>
                                </Button>
                              ))}
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription className="text-muted-foreground">
                          Choose the most appropriate category for your prompt
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tags Field */}
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold text-foreground">Tags *</FormLabel>
                        <FormControl>
                          <TagInput
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Add tags to help others find your prompt (e.g., writing, code, analysis)"
                            maxTags={5}
                            onFetchSuggestions={handleFetchTagSuggestions}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormDescription className="text-muted-foreground">
                          Add 1-5 tags to help others find your prompt. Start typing to see suggestions.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Section */}
                  <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 pt-6 border-t border-border">
                    <Link href={`/prompt/${prompt.id}`}>
                      <Button
                        type="button"
                        variant="outline"
                        className="hover:bg-muted w-full sm:w-auto bg-background text-foreground border-border"
                      >
                        Cancel
                      </Button>
                    </Link>
                    
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Update Prompt
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
} 