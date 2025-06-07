'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { deletePrompt } from '@/app/actions/prompts'

interface DeletePromptButtonProps {
  promptId: number
  promptTitle: string
  className?: string
}

export function DeletePromptButton({ promptId, promptTitle, className }: DeletePromptButtonProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deletePrompt(promptId)
      
      toast({
        title: 'Prompt deleted',
        description: 'Your prompt has been successfully deleted.',
      })
      
      // Redirect to home page after deletion
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error deleting prompt:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete prompt. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 ${className}`}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete prompt</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete "{promptTitle}". This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 