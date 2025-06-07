'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { GitFork, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { forkPrompt } from '@/app/actions/prompts'
import { useAsyncOperation } from '@/hooks/use-api-error'
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

interface ForkButtonProps {
  promptId: number
  promptTitle: string
  variant?: 'default' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  showLabel?: boolean
}

export function ForkButton({
  promptId,
  promptTitle,
  variant = 'outline',
  size = 'default',
  className,
  showLabel = true,
}: ForkButtonProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { execute, isLoading } = useAsyncOperation()
  
  // Debug log
  console.log('ForkButton render - promptId:', promptId)
  
  const handleFork = async () => {
    console.log('Forking prompt:', promptId)
    
    const result = await execute(forkPrompt, promptId)
    
    if (result) {
      console.log('Fork successful:', result)
      
      toast({
        title: 'Prompt forked successfully!',
        description: 'Your forked version has been created.',
      })
      
      // Redirect to the forked prompt detail page
      router.push(`/prompt/${result.id}`)
    }
    
    setShowConfirmDialog(false)
  }
  
  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setShowConfirmDialog(true)}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {showLabel && 'Forking...'}
          </>
        ) : (
          <>
            <GitFork className="h-4 w-4 mr-2" />
            {showLabel && 'Fork'}
          </>
        )}
      </Button>
      
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Fork this prompt?</AlertDialogTitle>
            <AlertDialogDescription>
              This will create your own copy of "{promptTitle}" that you can edit and customize. 
              The original prompt will remain unchanged.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleFork}>
              Fork Prompt
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 