/**
 * This is the main app home page
 * The Header component is already included in the app/layout.tsx file
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Plus, TrendingUp, Eye, Star, Clock, Copy, Edit, Trash2 } from "lucide-react";

// Mock data for user's prompts
const userPrompts = [
  {
    id: 1,
    title: "Sales Email Optimizer",
    description: "Craft compelling sales emails that convert.",
    category: "sales",
    uses: 1547,
    votes: 234,
    status: "published",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    title: "Market Analysis Report Generator",
    description: "Generate comprehensive market analysis reports.",
    category: "marketing",
    uses: 892,
    votes: 156,
    status: "draft",
    createdAt: "2024-01-10",
  },
];

const favoritePrompts = [
  {
    id: 3,
    title: "Code Review Assistant",
    author: "Alex Kumar",
    uses: 2103,
    votes: 412,
  },
  {
    id: 6,
    title: "Customer Support Response Template",
    author: "Emily Rodriguez",
    uses: 3421,
    votes: 567,
  },
];

export default function AppDashboard() {
  console.log('Dashboard page rendering - debugging log');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
          <p className="text-gray-600">Manage your prompts and track their performance</p>
        </div>
        <Link href="/submit">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Create New Prompt
          </Button>
        </Link>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-gray-600">Total Prompts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{userPrompts.length}</p>
            <p className="text-sm text-gray-500 mt-1">2 published, 0 drafts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-gray-600">Total Uses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">2.4K</p>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-green-500">+12%</span> this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-gray-600">Total Votes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">390</p>
            <p className="text-sm text-gray-500 mt-1">Across all prompts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-gray-600">Favorites</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{favoritePrompts.length}</p>
            <p className="text-sm text-gray-500 mt-1">Saved prompts</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="my-prompts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="my-prompts">My Prompts</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        {/* My Prompts Tab */}
        <TabsContent value="my-prompts" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Prompts</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Clock className="w-4 h-4 mr-2" />
                View Drafts
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {userPrompts.map((prompt) => (
              <Card key={prompt.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{prompt.title}</h3>
                        <Badge variant={prompt.status === "published" ? "default" : "secondary"}>
                          {prompt.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4">{prompt.description}</p>
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {prompt.uses} uses
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          {prompt.votes} votes
                        </span>
                        <span>Created {prompt.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Favorites Tab */}
        <TabsContent value="favorites" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Favorite Prompts</h2>
          <div className="grid gap-4">
            {favoritePrompts.map((prompt) => (
              <Card key={prompt.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{prompt.title}</h3>
                      <p className="text-sm text-gray-600">by {prompt.author}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {prompt.uses}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {prompt.votes}
                      </span>
                      <Button variant="outline" size="sm">
                        View Prompt
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-500 text-center py-8">
                No recent activity to display. Start exploring and using prompts!
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

