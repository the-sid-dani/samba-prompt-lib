import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { fetchPromptById } from '@/app/actions/prompts'
import { ForkPromptForm } from './components/ForkPromptForm'

interface ForkPromptPageProps {
  params: Promise<{ id: string }>
}

export default async function ForkPromptPage({ params }: ForkPromptPageProps) {
  const session = await auth()
  
  if (!session?.user?.id) {
    // Redirect to sign in
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
          <p>You need to be signed in to fork prompts.</p>
        </div>
      </div>
    )
  }

  const resolvedParams = await params
  const promptId = parseInt(resolvedParams.id, 10)
  
  if (isNaN(promptId) || promptId < 1) {
    notFound()
  }
  
  // Fetch the original prompt to fork
  const originalPrompt = await fetchPromptById(promptId, session.user.id)
  
  if (!originalPrompt) {
    notFound()
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Fork Prompt</h1>
          <p className="text-muted-foreground">
            Create your own copy of "{originalPrompt.title}". Make any changes you want before saving.
          </p>
        </div>
        
        <ForkPromptForm originalPrompt={originalPrompt} />
      </div>
    </div>
  )
} 