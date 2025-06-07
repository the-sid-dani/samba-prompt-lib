'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, Save, Send, Zap, Plus, X } from 'lucide-react'

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
import { cn } from '@/lib/utils'

import { MarkdownEditor } from '@/components/markdown-editor'
import { useAsyncOperation } from '@/hooks/use-api-error'
import { createPrompt, getCategories, fetchTags, createCategory } from '@/app/actions/prompts'
import { useToast } from '@/hooks/use-toast'
import { TagInput } from '@/components/tag-input'
import { PromptExamplesEditor } from '@/components/prompt-examples-editor'
import { PromptFormPreview } from '@/components/prompt-form-preview'
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
  examples: z.array(z.object({
    input: z.string().min(1, 'Example input is required'),
    output: z.string().min(1, 'Example output is required'),
    description: z.string().optional()
  })).optional().default([]),
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
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  
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
      examples: [],
    },
  })
  
  // Watch the content field for live preview
  const watchedContent = useWatch({
    control: form.control,
    name: 'content',
    defaultValue: ''
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
  
  // Handle creating a new category
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a category name',
        variant: 'destructive',
      })
      return
    }
    
    setIsCreatingCategory(true)
    
    try {
      const newCategory = await createCategory(newCategoryName.trim())
      console.log('Created new category:', newCategory)
      
      // Add to categories list
      setCategories(prev => [...prev, newCategory])
      
      // Select the new category
      form.setValue('category_id', newCategory.id.toString())
      
      // Reset form
      setNewCategoryName('')
      setShowNewCategoryInput(false)
      
      toast({
        title: 'Success',
        description: `Created new category: ${newCategory.name}`,
      })
    } catch (error) {
      console.error('Error creating category:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create category',
        variant: 'destructive',
      })
    } finally {
      setIsCreatingCategory(false)
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
      {/* Navigation */}
      <Navigation showCreateButton={false} />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-4 md:py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section with Samba Branding */}
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Create Your Prompt
              </h1>
            </div>
            <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto px-4">
              Share your AI expertise with the SambaTV community. Your prompts help others unlock the power of AI.
            </p>
          </div>

          <Card className="border-primary/10 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl md:text-2xl font-bold">Submit a New Prompt</CardTitle>
                  <CardDescription className="text-sm">
                    All fields marked with * are required
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              {isDraft && (
                <Alert className="mb-4 md:mb-6 border-primary/20 bg-primary/5">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-sm">
                    You have a saved draft. You can continue editing or{' '}
                    <Button
                      variant="link"
                      className="h-auto p-0 text-destructive hover:text-destructive/80"
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
                  {/* Title Field */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Title *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., 'SEO-Optimized Blog Post Generator'" 
                            className="border-muted-foreground/20 focus:border-primary transition-colors"
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
                        <FormLabel className="text-base font-semibold">Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Explain what your prompt does and when someone would use it..."
                            className="resize-none border-muted-foreground/20 focus:border-primary transition-colors"
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
                        <FormLabel className="text-base font-semibold">Prompt Content *</FormLabel>
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
                  
                  {/* Live Preview */}
                  <PromptFormPreview 
                    content={watchedContent}
                    className="mb-6"
                  />
                  
                  {/* Category Field - Now with clickable badges */}
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Category *</FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                              {categories.map((category) => (
                                <button
                                  key={category.id}
                                  type="button"
                                  onClick={() => field.onChange(category.id.toString())}
                                  className={cn(
                                    "relative flex items-center justify-center min-h-[44px] px-4 py-3 rounded-lg border-2 transition-all duration-200",
                                    "hover:border-primary/50 hover:bg-primary/5",
                                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                                    field.value === category.id.toString()
                                      ? "border-primary bg-primary/10 text-primary font-medium"
                                      : "border-muted-foreground/20 text-muted-foreground"
                                  )}
                                >
                                  <span className="text-sm md:text-base">{category.name}</span>
                                  {field.value === category.id.toString() && (
                                    <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary animate-pulse" />
                                  )}
                                </button>
                              ))}
                              
                              {/* Add New Category Button */}
                              {!showNewCategoryInput && (
                                <button
                                  type="button"
                                  onClick={() => setShowNewCategoryInput(true)}
                                  className={cn(
                                    "relative flex items-center justify-center min-h-[44px] px-4 py-3 rounded-lg border-2 border-dashed transition-all duration-200",
                                    "border-muted-foreground/20 text-muted-foreground hover:border-primary/50 hover:bg-primary/5",
                                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                  )}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  <span className="text-sm md:text-base">Add New</span>
                                </button>
                              )}
                            </div>
                            
                            {/* New Category Input */}
                            {showNewCategoryInput && (
                              <div className="flex flex-col sm:flex-row gap-2">
                                <Input
                                  type="text"
                                  placeholder="Enter new category name..."
                                  value={newCategoryName}
                                  onChange={(e) => setNewCategoryName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault()
                                      handleCreateCategory()
                                    } else if (e.key === 'Escape') {
                                      setShowNewCategoryInput(false)
                                      setNewCategoryName('')
                                    }
                                  }}
                                  className="flex-1 border-muted-foreground/20 focus:border-primary"
                                  disabled={isCreatingCategory}
                                  autoFocus
                                />
                                <div className="flex gap-2">
                                  <Button
                                    type="button"
                                    onClick={handleCreateCategory}
                                    disabled={isCreatingCategory || !newCategoryName.trim()}
                                    size="default"
                                    className="bg-primary hover:bg-primary/90 flex-1 sm:flex-none"
                                  >
                                    {isCreatingCategory ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      'Add'
                                    )}
                                  </Button>
                                  <Button
                                    type="button"
                                    onClick={() => {
                                      setShowNewCategoryInput(false)
                                      setNewCategoryName('')
                                    }}
                                    variant="outline"
                                    size="default"
                                    disabled={isCreatingCategory}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Choose the most appropriate category for your prompt or create a new one
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
                        <FormLabel className="text-base font-semibold">Tags *</FormLabel>
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
                  
                  {/* Examples Field */}
                  <FormField
                    control={form.control}
                    name="examples"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <PromptExamplesEditor
                            examples={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Form Actions with improved styling */}
                  <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSaveDraft}
                      disabled={!form.formState.isDirty || isSubmitting}
                      className="hover:bg-muted w-full sm:w-auto"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save as Draft
                    </Button>
                    
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
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
          
          {/* Help text section */}
          <div className="mt-6 md:mt-8 text-center text-sm text-muted-foreground px-4">
            <p>Need help? Check out our <a href="/guide" className="text-primary hover:underline">prompt writing guide</a></p>
          </div>
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