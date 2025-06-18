'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, GitFork, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { createPrompt, getCategories } from '@/app/actions/prompts'
import { useAsyncOperation } from '@/hooks/use-api-error'
import { cn } from '@/lib/utils'
import TagInput from '@/components/tag-input'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  content: z.string().min(1, 'Prompt content is required').min(10, 'Prompt content must be at least 10 characters'),
  category_id: z.string().min(1, 'Please select a category'),
  tags: z.array(z.string()).min(1, 'Please add at least one tag').max(5, 'Maximum 5 tags allowed'),
})

type FormData = z.infer<typeof formSchema>

interface ForkModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  originalPrompt: {
    id: number
    title: string
    description: string
    content: string
    category_id: number
    tags: string[]
  }
}

export function ForkModal({ open, onOpenChange, originalPrompt }: ForkModalProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { execute, isLoading } = useAsyncOperation()
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([])
  
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
  
  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getCategories()
        setCategories(cats)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    
    if (open) {
      fetchCategories()
    }
  }, [open])
  
  // Pre-populate form when modal opens
  useEffect(() => {
    if (open && originalPrompt) {
      form.reset({
        title: originalPrompt.title,
        description: originalPrompt.description,
        content: originalPrompt.content,
        category_id: originalPrompt.category_id.toString(),
        tags: originalPrompt.tags || [],
      })
    }
  }, [open, originalPrompt, form])
  
  const onSubmit = async (data: FormData) => {
    const promptData = {
      ...data,
      category_id: parseInt(data.category_id),
      forked_from: originalPrompt.id,
    }
    
    const result = await execute(createPrompt, promptData)
    
    if (result) {
      toast({
        title: 'Prompt forked successfully!',
        description: 'You can now edit your forked version.',
      })
      
      onOpenChange(false)
      router.push(`/prompt/${result.id}/edit`)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitFork className="h-5 w-5" />
            Fork Prompt
          </DialogTitle>
          <DialogDescription>
            Create your own copy of this prompt. You can edit any field before creating the fork.
          </DialogDescription>
        </DialogHeader>
        
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
                      className="resize-y min-h-[200px] max-h-[400px]"
                      rows={8}
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
            
            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
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
      </DialogContent>
    </Dialog>
  )
} 