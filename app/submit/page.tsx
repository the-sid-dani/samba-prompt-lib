'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, Save, Send } from 'lucide-react'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

import { MarkdownEditor } from '@/components/markdown-editor'
import { useAsyncOperation } from '@/hooks/use-api-error'
import { createPrompt, getCategories, fetchTags } from '@/app/actions/prompts'
import { useToast } from '@/hooks/use-toast'
import { TagInput } from '@/components/tag-input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

// Form validation schema
const formSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),
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

// Available AI models (this would come from API in production)
const AI_MODELS = [
  { id: 'gpt-4', name: 'GPT-4' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  { id: 'claude-3', name: 'Claude 3' },
  { id: 'gemini-pro', name: 'Gemini Pro' },
]

export default function SubmitPromptPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const { execute: executeCreate, isLoading: isSubmitting } = useAsyncOperation()
  
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([])
  const [isDraft, setIsDraft] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showDiscardDialog, setShowDiscardDialog] = useState(false)
  
  // Debug log
  console.log('SubmitPromptPage rendered, session:', session, 'status:', status)
  
  // Form setup with React Hook Form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      category_id: '',
      tags: [],
    },
  })
  
  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      console.log('User not authenticated, redirecting to home')
      router.push('/')
    }
  }, [status, router])
  
  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories...')
        const cats = await getCategories()
        console.log('Categories fetched:', cats)
        setCategories(cats)
      } catch (error) {
        console.error('Error fetching categories:', error)
        toast({
          title: 'Error',
          description: 'Failed to load categories',
          variant: 'destructive',
        })
      }
    }
    
    fetchCategories()
  }, [toast])
  
  // Load draft from localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem('prompt-draft')
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft)
        console.log('Loading draft from localStorage:', draft)
        form.reset(draft)
        setIsDraft(true)
        toast({
          title: 'Draft loaded',
          description: 'Your previous draft has been restored',
        })
      } catch (error) {
        console.error('Error loading draft:', error)
      }
    }
  }, [form, toast])
  
  // Auto-save callback for markdown editor
  const handleAutoSave = () => {
    const formData = form.getValues()
    console.log('Auto-saving draft from markdown editor')
    localStorage.setItem('prompt-draft', JSON.stringify(formData))
    setLastSaved(new Date())
    
    // Show subtle feedback without toast to avoid interruption
    if (!isDraft) {
      setIsDraft(true)
    }
  }
  
  // Auto-save draft for all fields
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Only save if form has been touched
      if (form.formState.isDirty) {
        console.log('Auto-saving draft to localStorage:', value)
        localStorage.setItem('prompt-draft', JSON.stringify(value))
        setLastSaved(new Date())
        if (!isDraft) {
          setIsDraft(true)
        }
      }
    })
    
    return () => subscription.unsubscribe()
  }, [form, isDraft])
  
  // Fetch tag suggestions
  const handleFetchTagSuggestions = async (query: string): Promise<string[]> => {
    try {
      console.log('Fetching tag suggestions for query:', query)
      const tags = await fetchTags(query)
      console.log('Received tag suggestions:', tags)
      return tags
    } catch (error) {
      console.error('Error fetching tag suggestions:', error)
      return []
    }
  }
  
  // Handle navigation with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (form.formState.isDirty && !isSubmitting) {
        e.preventDefault()
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [form.formState.isDirty, isSubmitting])
  
  // Enhanced discard draft function
  const handleDiscardDraft = () => {
    console.log('Showing discard confirmation dialog')
    setShowDiscardDialog(true)
  }
  
  const confirmDiscardDraft = () => {
    console.log('Discarding draft')
    localStorage.removeItem('prompt-draft')
    form.reset()
    setIsDraft(false)
    setLastSaved(null)
    setShowDiscardDialog(false)
    toast({
      title: 'Draft discarded',
      description: 'Your draft has been deleted',
    })
  }
  
  // Enhanced form submission with better error handling
  const onSubmit = async (data: FormData) => {
    console.log('Form submitted with data:', data)
    
    // Validate all required fields
    if (!data.title || !data.description || !data.content || !data.category_id || data.tags.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }
    
    // Convert category_id to number
    const promptData = {
      ...data,
      category_id: parseInt(data.category_id),
    }
    
    const result = await executeCreate(createPrompt, promptData)
    
    if (result) {
      console.log('Prompt created successfully:', result)
      
      // Clear draft
      localStorage.removeItem('prompt-draft')
      setIsDraft(false)
      
      toast({
        title: 'Success!',
        description: 'Your prompt has been submitted successfully',
      })
      
      // Small delay before redirect for better UX
      setTimeout(() => {
        router.push(`/prompt/${result.id}`)
      }, 500)
    }
  }
  
  // Handle save as draft
  const handleSaveDraft = () => {
    const formData = form.getValues()
    console.log('Saving draft:', formData)
    localStorage.setItem('prompt-draft', JSON.stringify(formData))
    setIsDraft(true)
    toast({
      title: 'Draft saved',
      description: 'Your prompt has been saved as a draft',
    })
  }
  
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }
  
  if (status === 'unauthenticated') {
    return null
  }
  
  return (
    <>
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Submit a New Prompt</CardTitle>
              <CardDescription>
                Share your prompt with the SambaTV community. All fields marked with * are required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isDraft && (
                <Alert className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You have a saved draft. You can continue editing or{' '}
                    <Button
                      variant="link"
                      className="h-auto p-0 text-destructive"
                      onClick={handleDiscardDraft}
                    >
                      discard it
                    </Button>
                    .
                    {lastSaved && (
                      <span className="text-xs text-muted-foreground ml-2">
                        Last saved: {lastSaved.toLocaleTimeString()}
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              )}
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Title Field */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter a descriptive title for your prompt" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          A clear, concise title (max 100 characters)
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
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Briefly describe what your prompt does and when to use it"
                            className="resize-none"
                            rows={3}
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Brief description of your prompt (max 500 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Content Field with Markdown Editor */}
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prompt Content *</FormLabel>
                        <FormControl>
                          <MarkdownEditor
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Enter your full prompt content here. You can use markdown for formatting."
                            minHeight={300}
                            autoSave={true}
                            onAutoSave={handleAutoSave}
                          />
                        </FormControl>
                        <FormDescription>
                          The full prompt content with markdown formatting support. Includes preview mode and auto-save.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Category Field */}
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the most appropriate category for your prompt
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Tags Field with Enhanced Component */}
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags *</FormLabel>
                        <FormControl>
                          <TagInput
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Type to search or add tags..."
                            maxTags={5}
                            onFetchSuggestions={handleFetchTagSuggestions}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormDescription>
                          Add 1-5 tags to help others find your prompt. Start typing to see suggestions.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Form Actions */}
                  <div className="flex justify-between gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSaveDraft}
                      disabled={!form.formState.isDirty || isSubmitting}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save as Draft
                    </Button>
                    
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary text-primary-foreground"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Submit Prompt
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
      
      {/* Discard Draft Confirmation Dialog */}
      <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard draft?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to discard your draft? This action cannot be undone and all your unsaved changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDiscardDraft}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Discard Draft
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 