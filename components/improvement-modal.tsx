'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Lightbulb, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { suggestImprovement } from '@/app/actions/prompts'
import { useAsyncOperation } from '@/hooks/use-api-error'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { MarkdownEditor } from '@/components/markdown-editor'

interface ImprovementModalProps {
  promptId: number
  promptTitle: string
  currentContent: string
  onSuccess?: () => void
}

export function ImprovementModal({
  promptId,
  promptTitle,
  currentContent,
  onSuccess,
}: ImprovementModalProps) {
  const [open, setOpen] = useState(false)
  const [suggestion, setSuggestion] = useState('')
  const [rationale, setRationale] = useState('')
  const { toast } = useToast()
  const { execute, isLoading } = useAsyncOperation()
  
  // Debug log
  console.log('ImprovementModal render - promptId:', promptId)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!suggestion.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide an improvement suggestion',
        variant: 'destructive',
      })
      return
    }
    
    console.log('Submitting improvement suggestion')
    
    const result = await execute(suggestImprovement, {
      prompt_id: promptId,
      suggestion: suggestion.trim(),
      rationale: rationale.trim() || undefined,
    })
    
    if (result) {
      console.log('Improvement suggestion submitted:', result)
      
      toast({
        title: 'Success!',
        description: 'Your improvement suggestion has been submitted.',
      })
      
      // Reset form
      setSuggestion('')
      setRationale('')
      setOpen(false)
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess()
      }
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Lightbulb className="h-4 w-4 mr-2" />
          Suggest Improvement
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Suggest an Improvement</DialogTitle>
            <DialogDescription>
              Help improve "{promptTitle}" by suggesting a better version. Your suggestion will be reviewed by the prompt owner.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-6">
            {/* Current prompt content for reference */}
            <div className="space-y-2">
              <Label>Current Prompt Content (for reference)</Label>
              <div className="bg-gray-50 p-4 rounded-lg max-h-48 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-600">
                  {currentContent}
                </pre>
              </div>
            </div>
            
            {/* Improved version */}
            <div className="space-y-2">
              <Label htmlFor="suggestion">
                Your Improved Version <span className="text-red-500">*</span>
              </Label>
              <MarkdownEditor
                value={suggestion}
                onChange={setSuggestion}
                placeholder="Provide your improved version of the prompt here..."
                minHeight={200}
              />
              <p className="text-sm text-gray-500">
                {suggestion.length}/5000 characters
              </p>
            </div>
            
            {/* Rationale */}
            <div className="space-y-2">
              <Label htmlFor="rationale">
                Explanation (Optional)
              </Label>
              <Textarea
                id="rationale"
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                placeholder="Explain why this improvement makes the prompt better..."
                rows={3}
                maxLength={1000}
              />
              <p className="text-sm text-gray-500">
                Briefly explain your improvements. This helps the prompt owner understand your changes.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !suggestion.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Suggestion'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 