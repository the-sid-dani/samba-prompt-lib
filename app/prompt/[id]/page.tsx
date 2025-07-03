import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Heart, Share2, Flag, Edit, MessageSquare, GitFork, Lightbulb, Copy, ExternalLink, Beaker } from "lucide-react";
import Navigation from "@/components/navigation/Navigation";
import UserMenu from "@/components/user/UserMenu";
import SignIn from "@/components/sign-in";
import Image from "next/image";
import config from "@/config";
import { auth } from "@/lib/auth";
import { fetchPromptById } from "@/app/actions/prompts";
import { PromptCopyButton } from "@/components/prompt-copy-button";
import { ForkButton } from "@/components/fork-button";
import { FavoriteButton } from "@/components/favorite-button";
import { ImprovementModal } from "@/components/improvement-modal";
import { ImprovementsList } from "@/components/improvements-list";
import { DeletePromptButton } from "@/components/delete-prompt-button";
import { PromptForksDropdown } from "@/components/prompt-forks-dropdown";
import { SimpleMarkdown } from "@/components/simple-markdown";
import { PromptContentSection } from "@/components/prompt-content-section";
import { ForkBadge } from "@/components/fork-badge";
import { PromptDescriptionSection } from "@/components/prompt-description-section";

export default async function PromptDetailPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const user = session?.user;
    
    // Await params first
    const resolvedParams = await params;
    
    // Validate and parse the ID
    const promptId = parseInt(resolvedParams.id, 10);
    
    // Return 404 for invalid IDs
    if (isNaN(promptId) || promptId < 1) {
      notFound();
    }
    
    // Fetch prompt data with error handling
    let prompt;
    try {
      console.log('[PromptDetailPage] Fetching prompt with ID:', promptId);
      prompt = await fetchPromptById(promptId, user?.id);
      console.log('[PromptDetailPage] Prompt data received:', prompt ? 'Found' : 'Not found');
    } catch (error) {
      // Log error for monitoring but don't expose internal errors
      console.error('[PromptDetailPage] Error fetching prompt:', error);
      // Throw to trigger error boundary
      throw new Error('Failed to load prompt. Please try again later.');
    }
    
    // Return 404 if prompt doesn't exist
    if (!prompt) {
      console.log('[PromptDetailPage] No prompt found, returning 404');
      notFound();
    }

    const isOwner = user?.id === prompt.user_id;

    // Calculate stats
    const bookmarkCount = prompt.user_favorites?.length || 0;
    const forkCount = prompt.forkCount || prompt.prompt_forks?.length || 0;
    const copyCount = prompt.uses || 0;

    return (
      <div className="min-h-screen bg-background transition-[background-color] duration-300">
        {/* Navigation */}
        <Navigation />

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center text-sm sm:text-base text-muted-foreground hover:text-foreground mb-4 sm:mb-6">
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            Back to prompts
          </Link>

          {/* Prompt Header */}
          <div className="bg-card rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
            <div className="mb-4 sm:mb-6">
              {/* Tags with Delete Button */}
              <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {prompt.categories && (
                    <Badge variant="secondary" className="px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm">
                      {prompt.categories.name}
                    </Badge>
                  )}
                  {prompt.tags && prompt.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
                {isOwner && (
                  <DeletePromptButton
                    promptId={promptId}
                    promptTitle={prompt.title}
                  />
                )}
              </div>
              
              {/* Title */}
              <div className="flex items-start justify-between gap-4 mb-3 sm:mb-4">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">{prompt.title}</h1>
                {isOwner && (
                  <Link href={`/prompt/${promptId}/edit`}>
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm shrink-0">
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      Edit
                    </Button>
                  </Link>
                )}
              </div>
              
              {/* Fork Badge */}
              {prompt.forked_from && (
                <ForkBadge 
                  forkedFrom={prompt.forked_from} 
                  className="mb-3 sm:mb-4"
                />
              )}
              
              {/* Author and Date */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                <span>
                  by <span className="font-medium text-foreground">
                    {prompt.profiles?.username || 
                     prompt.profiles?.name || 
                     prompt.profiles?.email?.split('@')[0] || 
                     'Anonymous'}
                  </span>
                </span>
                <span className="hidden sm:inline">•</span>
                <span>{new Date(prompt.created_at).toLocaleDateString()}</span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
                {user ? (
                  <FavoriteButton
                    promptId={promptId}
                    initialFavorited={prompt.isFavorited || false}
                    favoriteCount={bookmarkCount}
                    showCount={true}
                    size="default"
                    variant="ghost"
                  />
                ) : (
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                    <span className="text-sm sm:text-base font-semibold text-foreground">{bookmarkCount}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 sm:gap-2">
                  <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  <span className="text-sm sm:text-base font-semibold text-foreground">{copyCount}</span>
                </div>
                <PromptForksDropdown promptId={promptId} forkCount={forkCount} />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <PromptCopyButton
                  promptId={promptId}
                  text={prompt.content}
                  label="Copy"
                  className="bg-coral-600 hover:bg-coral-700 w-full sm:w-auto"
                />
              </div>
            </div>
          </div>

          {/* Description Section - Collapsible */}
          <PromptDescriptionSection description={prompt.description} />

          {/* Prompt Content Section - Client Component */}
          <PromptContentSection 
            prompt={{
              id: promptId,
              content: prompt.content,
              title: prompt.title,
              description: prompt.description,
              category_id: prompt.category_id,
              tags: prompt.tags,
              examples: prompt.examples as any[]
            }}
            user={user}
            isOwner={isOwner}
          />




        </div>

        {/* Login Prompt for Non-authenticated Users */}
        {!user && (
          <div className="fixed bottom-0 inset-x-0 bg-background border-t shadow-lg p-3 sm:p-4">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-center sm:text-left">
                <p className="font-semibold text-foreground text-sm sm:text-base">Want to use this prompt?</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Sign in to copy and customize prompts</p>
              </div>
              <SignIn />
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    // Re-throw to trigger error boundary
    throw error;
  }
} 