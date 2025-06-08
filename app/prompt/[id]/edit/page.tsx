import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { fetchPromptById } from '@/app/actions/prompts'
import EditPromptForm from './components/EditPromptForm'

export default async function EditPromptPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  
  // Check authentication
  if (!session?.user?.id) {
    redirect('/')
  }
  
  // Await params
  const resolvedParams = await params
  
  // Fetch prompt data
  const promptId = parseInt(resolvedParams.id, 10)
  if (isNaN(promptId)) {
    notFound()
  }
  
  const prompt = await fetchPromptById(promptId, session.user.id)
  
  if (!prompt) {
    notFound()
  }
  
  // Check ownership
  if (prompt.user_id !== session.user.id) {
    redirect(`/prompt/${promptId}`)
  }
  
  // Pass the prompt data to the edit form component
  return <EditPromptForm prompt={prompt} />
} 