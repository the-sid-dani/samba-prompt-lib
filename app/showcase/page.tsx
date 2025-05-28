'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Heart, Copy, GitBranch, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ShowcasePage() {
  const { toast } = useToast();

  console.log('Showcase page rendering - debugging log for component verification');

  const handleShowToast = () => {
    toast({
      title: "Component Test",
      description: "Toast notification is working correctly with SambaTV theme!",
    });
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-primary">SambaTV Component Showcase</h1>
        <p className="text-muted-foreground">All shadcn/ui components styled with SambaTV branding</p>
      </div>

      <Separator />

      {/* Buttons Section */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>Various button styles and states</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button variant="default">Primary Button</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button disabled>Disabled</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button onClick={handleShowToast}>
            <Heart className="mr-2 h-4 w-4" />
            Show Toast
          </Button>
        </CardContent>
      </Card>

      {/* Form Elements */}
      <Card>
        <CardHeader>
          <CardTitle>Form Elements</CardTitle>
          <CardDescription>Input fields and form controls</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="user@samba.tv" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Enter your prompt here..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">AI Model</Label>
            <Select>
              <SelectTrigger id="model">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini">Gemini Pro</SelectItem>
                <SelectItem value="claude">Claude 3</SelectItem>
                <SelectItem value="openrouter">OpenRouter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Badges and Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Badges & Alerts</CardTitle>
          <CardDescription>Status indicators and notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge className="bg-primary text-primary-foreground">
              <Heart className="mr-1 h-3 w-3" />
              SambaTV
            </Badge>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Default Alert</AlertTitle>
            <AlertDescription>
              This is a default alert with SambaTV styling.
            </AlertDescription>
          </Alert>

          <Alert className="border-green-500 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Success!</AlertTitle>
            <AlertDescription className="text-green-700">
              Your prompt has been saved successfully.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Tabs Example */}
      <Card>
        <CardHeader>
          <CardTitle>Tabs Component</CardTitle>
          <CardDescription>Tabbed interface example</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="prompt" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="prompt">Prompt</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="prompt" className="space-y-4">
              <div className="space-y-2">
                <Label>Prompt Content</Label>
                <Textarea placeholder="Your prompt content here..." className="min-h-[100px]" />
              </div>
            </TabsContent>
            <TabsContent value="details" className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Created by: John Doe</p>
                <p className="text-sm text-muted-foreground">Model: Gemini Pro</p>
                <p className="text-sm text-muted-foreground">Category: Development</p>
              </div>
            </TabsContent>
            <TabsContent value="history" className="space-y-4">
              <ScrollArea className="h-[100px] w-full rounded-md border p-4">
                <div className="space-y-2">
                  <p className="text-sm">Version 1.2 - Updated prompt structure</p>
                  <p className="text-sm">Version 1.1 - Added examples</p>
                  <p className="text-sm">Version 1.0 - Initial version</p>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialog Example */}
      <Card>
        <CardHeader>
          <CardTitle>Dialog Component</CardTitle>
          <CardDescription>Modal dialog example</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Prompt</DialogTitle>
                <DialogDescription>
                  Make changes to your prompt here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt-title">Title</Label>
                  <Input id="prompt-title" placeholder="My Awesome Prompt" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prompt-content">Content</Label>
                  <Textarea id="prompt-content" placeholder="Enter your prompt..." />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save changes</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Avatar and Dropdown */}
      <Card>
        <CardHeader>
          <CardTitle>Avatar & Dropdown Menu</CardTitle>
          <CardDescription>User profile components</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Open Menu</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Prompt
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <GitBranch className="mr-2 h-4 w-4" />
                  Fork Prompt
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Improve Prompt
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Delete Prompt
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 