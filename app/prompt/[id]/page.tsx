import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Star, Eye, ArrowLeft, Heart, Share2, Flag, Edit, MessageSquare } from "lucide-react";
import UserMenu from "@/components/user/UserMenu";
import SignIn from "@/components/sign-in";
import Image from "next/image";
import config from "@/config";
import { auth } from "@/lib/auth";

// Mock prompt data
const mockPrompts: { [key: string]: any } = {
  "1": {
    id: 1,
    title: "Sales Email Optimizer",
    description: "Craft compelling sales emails that convert. This prompt helps you write personalized outreach that resonates with prospects.",
    content: `You are an expert sales copywriter with 20 years of experience writing high-converting sales emails. Your task is to help write a sales email that:

1. Grabs attention with a compelling subject line
2. Personalizes the opening based on the prospect's background
3. Clearly communicates value proposition
4. Includes social proof when relevant
5. Has a clear, low-friction call-to-action

Context about the prospect:
[INSERT PROSPECT DETAILS]

Product/Service being sold:
[INSERT PRODUCT DETAILS]

Write a sales email that feels personal, provides value, and motivates action without being pushy.`,
    category: "sales",
    tags: ["email", "outreach", "conversion"],
    author: "Sarah Chen",
    authorRole: "Sales Director",
    authorId: "user123",
    uses: 1547,
    votes: 234,
    featured: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    versions: 3,
    model: "Works with GPT-4, Claude, Gemini",
  },
};

export default async function PromptDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const user = session?.user;
  const prompt = mockPrompts[params.id];

  if (!prompt) {
    notFound();
  }

  const isOwner = user?.id === prompt.authorId;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <Image 
                  src="/images/sambatv-icon.png" 
                  alt="SambaTV" 
                  width={32} 
                  height={32}
                  className="rounded"
                />
                <span className="text-xl font-bold text-gray-900">{config.metadata.title}</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link href="/submit">
                    <Button variant="outline">Create Prompt</Button>
                  </Link>
                  <UserMenu />
                </>
              ) : (
                <SignIn />
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to prompts
        </Link>

        {/* Prompt Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="secondary">
                  {prompt.category.charAt(0).toUpperCase() + prompt.category.slice(1)}
                </Badge>
                {prompt.featured && (
                  <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-3">{prompt.title}</h1>
              <p className="text-lg text-gray-600 mb-4">{prompt.description}</p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {prompt.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {prompt.uses} uses
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  {prompt.votes} votes
                </span>
                <span>
                  {prompt.versions} versions
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              {user && (
                <>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Prompt
                  </Button>
                  <Button variant="outline">
                    <Heart className="w-4 h-4 mr-2" />
                    Favorite
                  </Button>
                  {isOwner && (
                    <Button variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Author Info */}
          <div className="border-t pt-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold">
                  {prompt.author.split(' ').map((n: string) => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="font-medium">{prompt.author}</p>
                <p className="text-sm text-gray-500">{prompt.authorRole}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <p>Created {new Date(prompt.createdAt).toLocaleDateString()}</p>
              <p>Updated {new Date(prompt.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Prompt Content Tabs */}
        <Tabs defaultValue="prompt" className="space-y-6">
          <TabsList>
            <TabsTrigger value="prompt">Prompt</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="versions">Version History</TabsTrigger>
          </TabsList>

          {/* Prompt Tab */}
          <TabsContent value="prompt">
            <Card>
              <CardHeader>
                <CardTitle>Prompt Template</CardTitle>
                <CardDescription>
                  {prompt.model}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap font-mono text-sm">
                    {prompt.content}
                  </pre>
                </div>
                {user && (
                  <div className="mt-4 flex gap-2">
                    <Button className="bg-primary hover:bg-primary/90">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy to Clipboard
                    </Button>
                    <Button variant="outline">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples">
            <Card>
              <CardHeader>
                <CardTitle>Usage Examples</CardTitle>
                <CardDescription>
                  See how others have used this prompt successfully
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">No examples available yet. Be the first to share your success!</p>
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
                <div className="space-y-4">
                  <div className="border-l-2 border-primary pl-4">
                    <p className="font-medium">Version 3 (Current)</p>
                    <p className="text-sm text-gray-500">Updated {new Date(prompt.updatedAt).toLocaleDateString()}</p>
                    <p className="text-sm mt-1">Improved personalization section and added social proof guidance</p>
                  </div>
                  <div className="border-l-2 border-gray-300 pl-4">
                    <p className="font-medium">Version 2</p>
                    <p className="text-sm text-gray-500">January 18, 2024</p>
                    <p className="text-sm mt-1">Added call-to-action best practices</p>
                  </div>
                  <div className="border-l-2 border-gray-300 pl-4">
                    <p className="font-medium">Version 1</p>
                    <p className="text-sm text-gray-500">January 15, 2024</p>
                    <p className="text-sm mt-1">Initial version</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Report/Flag Section */}
        <div className="mt-6 text-center">
          <Button variant="ghost" className="text-gray-500">
            <Flag className="w-4 h-4 mr-2" />
            Report this prompt
          </Button>
        </div>
      </div>

      {/* Login Prompt for Non-authenticated Users */}
      {!user && (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t shadow-lg p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Want to use this prompt?</p>
              <p className="text-sm text-gray-600">Sign in to copy and customize prompts</p>
            </div>
            <SignIn />
          </div>
        </div>
      )}
    </div>
  );
} 