'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, X, Clock, User, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'
import { fetchPromptImprovements, reviewImprovement } from '@/app/actions/prompts'
import { useAsyncOperation } from '@/hooks/use-api-error'
import { useToast } from '@/hooks/use-toast'
import { Database } from '@/types/database.types'
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

type Improvement = Database['public']['Tables']['prompt_improvements']['Row']

interface ImprovementsListProps {
  promptId: number
  isOwner: boolean
  currentContent: string
  refreshTrigger?: number
}

export function ImprovementsList({
  promptId,
  isOwner,
  currentContent,
  refreshTrigger = 0,
}: ImprovementsListProps) {
  const [improvements, setImprovements] = useState<Improvement[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewDialog, setReviewDialog] = useState<{
    open: boolean
    improvement?: Improvement
    action?: 'accept' | 'reject'
  }>({ open: false })
  
  const { execute } = useAsyncOperation()
  const { toast } = useToast()
  
  // Debug log
  console.log('ImprovementsList render - promptId:', promptId, 'isOwner:', isOwner)
  
  // Load improvements
  useEffect(() => {
    async function loadImprovements() {
      console.log('Loading improvements for prompt:', promptId)
      setLoading(true)
      
      try {
        const data = await fetchPromptImprovements(promptId)
        console.log('Loaded improvements:', data.length)
        setImprovements(data)
      } catch (error) {
        console.error('Failed to load improvements:', error)
        toast({
          title: 'Error',
          description: 'Failed to load improvement suggestions',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }
    
    loadImprovements()
  }, [promptId, refreshTrigger]) // Removed toast from dependencies
  
  const handleReview = async () => {
    if (!reviewDialog.improvement || !reviewDialog.action) return
    
    console.log('Reviewing improvement:', reviewDialog.improvement.id, 'Action:', reviewDialog.action)
    
    const result = await execute(reviewImprovement, {
      improvement_id: reviewDialog.improvement.id,
      status: reviewDialog.action === 'accept' ? 'accepted' : 'rejected',
    })
    
    if (result) {
      toast({
        title: 'Success',
        description: `Improvement ${reviewDialog.action === 'accept' ? 'accepted' : 'rejected'}`,
      })
      
      // Update local state
      setImprovements(prev =>
        prev.map(imp =>
          imp.id === reviewDialog.improvement!.id
            ? { ...imp, status: reviewDialog.action === 'accept' ? 'accepted' : 'rejected' }
            : imp
        )
      )
    }
    
    setReviewDialog({ open: false })
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case 'accepted':
        return <Badge variant="outline" className="border-green-500 text-green-700"><Check className="w-3 h-3 mr-1" />Accepted</Badge>
      case 'rejected':
        return <Badge variant="outline" className="border-red-500 text-red-700"><X className="w-3 h-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }
  
  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading improvement suggestions...
      </div>
    )
  }
  
  if (improvements.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No improvement suggestions yet. Be the first to suggest one!
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      {improvements.map((improvement) => (
        <Card key={improvement.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Suggestion by {improvement.created_by}
                </CardTitle>
                <CardDescription>
                  {format(new Date(improvement.created_at), 'PPp')}
                </CardDescription>
              </div>
              {getStatusBadge(improvement.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Rationale */}
            {improvement.rationale && (
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Explanation:
                </p>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {improvement.rationale}
                </p>
              </div>
            )}
            
            {/* Suggested content */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Suggested Improvement:</p>
              <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {improvement.suggestion}
                </pre>
              </div>
            </div>
            
            {/* Review actions for owners */}
            {isOwner && improvement.status === 'pending' && (
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-600 hover:text-green-700"
                  onClick={() => setReviewDialog({
                    open: true,
                    improvement,
                    action: 'accept',
                  })}
                >
                  <Check className="w-4 h-4 mr-1" />
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => setReviewDialog({
                    open: true,
                    improvement,
                    action: 'reject',
                  })}
                >
                  <X className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </div>
            )}
            
            {/* Review info */}
            {improvement.reviewed_at && (
              <p className="text-xs text-gray-500">
                Reviewed by {improvement.reviewed_by} on {format(new Date(improvement.reviewed_at), 'PPp')}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
      
      {/* Review confirmation dialog */}
      <AlertDialog
        open={reviewDialog.open}
        onOpenChange={(open) => setReviewDialog({ open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {reviewDialog.action === 'accept' ? 'Accept' : 'Reject'} this improvement?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {reviewDialog.action === 'accept' 
                ? 'This will update your prompt with the suggested improvement and create a new version.'
                : 'This improvement suggestion will be marked as rejected and will not be applied.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReview}>
              {reviewDialog.action === 'accept' ? 'Accept' : 'Reject'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 