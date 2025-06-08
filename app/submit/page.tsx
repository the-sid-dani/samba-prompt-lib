'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
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
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

import { useAsyncOperation } from '@/hooks/use-api-error'
import { createPrompt, getCategories, fetchTags, createCategory } from '@/app/actions/prompts'
import { useToast } from '@/hooks/use-toast'
import TagInput from '@/components/tag-input'
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

// Form validation schema - simplified
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
      router.push('/')
    }
  }, [status, router])
  
  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getCategories()
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
  
  // Load draft from localStorage (only explicit drafts)
  useEffect(() => {
    const savedDraft = localStorage.getItem('prompt-draft')
    const isExplicitDraft = localStorage.getItem('prompt-draft-explicit')
    const autoSavedContent = localStorage.getItem('prompt-auto-save')
    
    if (savedDraft && isExplicitDraft === 'true') {
      try {
        const draft = JSON.parse(savedDraft)
        form.reset(draft)
        setIsDraft(true)
        toast({
          title: 'Draft loaded',
          description: 'Your previous draft has been restored',
        })
      } catch (error) {
        console.error('Error loading draft:', error)
      }
    } else if (autoSavedContent) {
      // Show option to restore auto-saved content
      try {
        const autoSaved = JSON.parse(autoSavedContent)
        // Only show if there's meaningful content
        if (autoSaved.title || autoSaved.description || autoSaved.content) {
          toast({
            title: 'Auto-saved content found',
            description: 'Would you like to restore your previous work? Use "Save as Draft" to keep your work.',
          })
          
          // Optional: Auto-restore after a delay if user doesn't interact
          setTimeout(() => {
            const currentForm = form.getValues()
            // Only auto-restore if form is still empty
            if (!currentForm.title && !currentForm.description && !currentForm.content) {
              form.reset(autoSaved)
              localStorage.removeItem('prompt-auto-save')
              toast({
                title: 'Content restored',
                description: 'Your previous work has been restored',
              })
            }
          }, 5000)
        }
      } catch (error) {
        console.error('Error loading auto-saved content:', error)
        localStorage.removeItem('prompt-auto-save') // Clear corrupted data
      }
    }
  }, [form, toast])
  
  // Auto-save form state (but don't mark as draft)
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (form.formState.isDirty) {
        localStorage.setItem('prompt-auto-save', JSON.stringify(value))
        setLastSaved(new Date())
      }
    })
    
    return () => subscription.unsubscribe()
  }, [form])
  
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
      
      setCategories(prev => [...prev, newCategory])
      form.setValue('category_id', newCategory.id.toString())
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
  
  // Enhanced discard draft function
  const handleDiscardDraft = () => {
    setShowDiscardDialog(true)
  }
  
  const confirmDiscardDraft = () => {
    localStorage.removeItem('prompt-draft')
    localStorage.removeItem('prompt-draft-explicit')
    localStorage.removeItem('prompt-auto-save')
    form.reset()
    setIsDraft(false)
    setLastSaved(null)
    setShowDiscardDialog(false)
    toast({
      title: 'Draft discarded',
      description: 'Your draft has been deleted',
    })
  }
  
  // Form submission
  const onSubmit = async (data: FormData) => {
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
      localStorage.removeItem('prompt-draft')
      localStorage.removeItem('prompt-draft-explicit')
      localStorage.removeItem('prompt-auto-save')
      setIsDraft(false)
      
      toast({
        title: 'Success!',
        description: 'Your prompt has been submitted successfully',
      })
      
      setTimeout(() => {
        router.push(`/prompt/${result.id}`)
      }, 500)
    }
  }
  
  // Handle save as draft
  const handleSaveDraft = () => {
    const formData = form.getValues()
    localStorage.setItem('prompt-draft', JSON.stringify(formData))
    localStorage.setItem('prompt-draft-explicit', 'true')
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
      <Navigation />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-4 md:py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
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
                    You have a saved draft. You can continue editing.
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
                            className="resize-y border-muted-foreground/20 focus:border-primary transition-colors min-h-[80px] max-h-[300px]"
                            rows={3}
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Brief description of your prompt (max 500 characters). Drag the bottom-right corner to resize.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Content Field - Simplified */}
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Prompt Content *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter your full prompt content here. You can use markdown for formatting."
                            className="resize-y border-muted-foreground/20 focus:border-primary transition-colors min-h-[300px] max-h-[600px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          The full prompt content with markdown formatting support. Drag the bottom-right corner to resize.
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
                        <FormLabel className="text-base font-semibold">Category *</FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                              {categories.map((category) => (
                                <button
                                  key={category.id}
                                  type="button"
                                  onClick={() => field.onChange(category.id.toString())}
                                  className={cn(
                                    "flex items-center justify-center px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors min-h-[36px]",
                                    field.value === category.id.toString()
                                      ? "bg-primary text-white"
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  )}
                                >
                                  {category.name}
                                </button>
                              ))}
                              
                              {!showNewCategoryInput && (
                                <button
                                  type="button"
                                  onClick={() => setShowNewCategoryInput(true)}
                                  className="flex items-center justify-center px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-dashed border-gray-300 min-h-[36px]"
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add New
                                </button>
                              )}
                            </div>
                            
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
                  
                  {/* Tags Field */}
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
                  
                  {/* Form Actions */}
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