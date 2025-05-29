import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ArrowLeft, Heart, Share2, Flag, Edit, MessageSquare, GitFork, Lightbulb, Copy, ExternalLink } from "lucide-react";
import Navigation from "@/components/navigation/Navigation";
import UserMenu from "@/components/user/UserMenu";
import SignIn from "@/components/sign-in";
import Image from "next/image";
import config from "@/config";
import { auth } from "@/lib/auth";
import { fetchPromptById } from "@/app/actions/prompts";
import { PromptCopyButton } from "@/components/prompt-copy-button";
import { ForkButton } from "@/components/fork-button";
import { ImprovementModal } from "@/components/improvement-modal";
import { ImprovementsList } from "@/components/improvements-list";

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
      prompt = await fetchPromptById(promptId, user?.id);
    } catch (error) {
      // Log error for monitoring but don't expose internal errors
      console.error('Error fetching prompt:', error);
      // Throw to trigger error boundary
      throw new Error('Failed to load prompt. Please try again later.');
    }
    
    // Return 404 if prompt doesn't exist
    if (!prompt) {
      notFound();
    }

    const isOwner = user?.id === prompt.user_id;

    // Calculate stats
    const bookmarkCount = prompt.user_favorites?.length || 0;
    const forkCount = prompt.forkCount || prompt.prompt_forks?.length || 0;
    const copyCount = prompt.uses || 0;

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <Navigation />

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center text-sm sm:text-base text-gray-600 hover:text-gray-900 mb-4 sm:mb-6">
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            Back to prompts
          </Link>

          {/* Prompt Header */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
            <div className="mb-4 sm:mb-6">
              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
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
              
              {/* Title */}
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">{prompt.title}</h1>
              
              {/* Author and Date */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                <span>
                  by <span className="font-medium text-gray-900">
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
                <div className="flex items-center gap-1 sm:gap-2">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  <span className="text-sm sm:text-base font-semibold">{bookmarkCount}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <GitFork className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  <span className="text-sm sm:text-base font-semibold">{forkCount}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  <span className="text-sm sm:text-base font-semibold">{copyCount}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{prompt.description}</p>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2 sm:gap-3">
                <PromptCopyButton
                  promptId={promptId}
                  text={prompt.content}
                  label="Copy"
                  className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                />
                <Button variant="outline" disabled className="w-full sm:w-auto text-xs sm:text-sm">
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Use in Playground
                </Button>
                <Button variant="outline" disabled className="w-full sm:w-auto text-xs sm:text-sm">
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Use in ChatGPT
                </Button>
                <Button variant="outline" disabled className="w-full sm:w-auto text-xs sm:text-sm">
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Use in PromptLayer
                </Button>
              </div>
            </div>
          </div>

          {/* Prompt Content */}
          <Card className="mb-4 sm:mb-6">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Prompt</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <div className="bg-gray-50 p-3 sm:p-4 md:p-6 rounded-lg overflow-x-auto">
                <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm">
                  {prompt.content}
                </pre>
              </div>
              <div className="mt-3 sm:mt-4 flex justify-end">
                {user && !isOwner && (
                  <ForkButton
                    promptId={promptId}
                    promptTitle={prompt.title}
                    className="text-primary hover:text-primary/90"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex flex-wrap gap-2">
              {user && !isOwner && (
                <ImprovementModal
                  promptId={promptId}
                  promptTitle={prompt.title}
                  currentContent={prompt.content}
                />
              )}
              {isOwner && (
                <Link href={`/prompt/${promptId}/edit`}>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    Edit Prompt
                  </Button>
                </Link>
              )}
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm"
                disabled={!user}
              >
                <Heart className={`w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 ${prompt.isFavorited ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">{prompt.isFavorited ? 'Unfavorite' : 'Favorite'}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm"
              >
                <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm"
              >
                <Flag className="w-3 h-3 sm:w-4 sm:h-4 mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Report</span>
              </Button>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="improvements" className="space-y-4 sm:space-y-6">
            <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:flex">
              <TabsTrigger value="improvements" className="text-xs sm:text-sm">
                <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Improvements</span>
                <span className="sm:hidden">Improve</span>
              </TabsTrigger>
              <TabsTrigger value="comments" className="text-xs sm:text-sm">
                <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Comments</span>
                <span className="sm:hidden">Comment</span>
              </TabsTrigger>
              <TabsTrigger value="versions" className="text-xs sm:text-sm">Version History</TabsTrigger>
            </TabsList>

            {/* Improvements Tab */}
            <TabsContent value="improvements">
              <Card>
                <CardHeader>
                  <CardTitle>Improvement Suggestions</CardTitle>
                  <CardDescription>
                    Community suggestions to improve this prompt
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImprovementsList
                    promptId={promptId}
                    isOwner={isOwner}
                    currentContent={prompt.content}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Comments Tab */}
            <TabsContent value="comments">
              <Card>
                <CardHeader>
                  <CardTitle>Comments & Feedback</CardTitle>
                  <CardDescription>
                    Join the discussion about this prompt
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <textarea 
                          className="flex-1 p-3 border rounded-lg resize-none"
                          placeholder="Share your experience with this prompt..."
                          rows={3}
                        />
                        <Button>Post</Button>
                      </div>
                      <p className="text-gray-500 text-center py-8">
                        No comments yet. Be the first to share your thoughts!
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Sign in to join the discussion
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Version History Tab */}
            <TabsContent value="versions">
              <Card>
                <CardHeader>
                  <CardTitle>Version History</CardTitle>
                  <CardDescription>
                    Track changes and improvements to this prompt
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {prompt.prompt_versions && prompt.prompt_versions.length > 0 ? (
                    <div className="space-y-4">
                      {prompt.prompt_versions.map((version, index) => (
                        <div 
                          key={version.id} 
                          className={`border-l-2 ${index === 0 ? 'border-primary' : 'border-gray-300'} pl-4`}
                        >
                          <p className="font-medium">
                            Version {version.version_number} {index === 0 && '(Current)'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(version.created_at).toLocaleDateString()}
                          </p>
                          {version.change_summary && (
                            <p className="text-sm mt-1">{version.change_summary}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No version history available
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Login Prompt for Non-authenticated Users */}
        {!user && (
          <div className="fixed bottom-0 inset-x-0 bg-white border-t shadow-lg p-3 sm:p-4">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-center sm:text-left">
                <p className="font-semibold text-gray-900 text-sm sm:text-base">Want to use this prompt?</p>
                <p className="text-xs sm:text-sm text-gray-600">Sign in to copy and customize prompts</p>
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