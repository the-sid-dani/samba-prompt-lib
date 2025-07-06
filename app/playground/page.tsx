'use client';

import { useState, useEffect, useCallback, useRef, Suspense, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Copy, 
  AlertCircle, 
  Loader2, 
  Settings,
  RotateCcw,
  Menu,
  Plus,
  Play,
  Code,
  ChevronRight,
  ChevronDown,
  Info,
  Edit3,
  MessageSquarePlus,
  Sparkles,
  SlidersHorizontal,
  Cpu,
  Send,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PromptContentRenderer } from '@/components/prompt-content-renderer';
import Navigation from '@/components/navigation/Navigation';
import { SUPPORTED_MODELS } from '@/lib/ai';
import { useModelPreferences } from '@/hooks/useModelPreferences';
import { estimateTokensFallback } from '@/lib/tokenization';
import SignIn from '@/components/sign-in';
import { ModelVisibilityManager } from '@/components/playground/ModelVisibilityManager';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface PlaygroundState {
  projectTitle: string;
  model: string;
  systemPrompt: string;
  userPrompt: string;
  response: string;
  isRunning: boolean;
  lastSaved: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  messages: Message[];
  estimatedTokens: number;
}

function PlaygroundContent() {
  console.log('[Playground] Rendering modern playground page');
  
  // ALL HOOKS MUST BE AT THE TOP - BEFORE ANY CONDITIONAL LOGIC
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  // Refs
  const userPromptRef = useRef<HTMLTextAreaElement>(null);
  const promptLoadedRef = useRef<string | null>(null);

  // State management
  const [state, setState] = useState<PlaygroundState>({
    projectTitle: "AI Playground Session",
    model: "claude-sonnet-4-20250514",
    systemPrompt: "",
    userPrompt: "",
    response: "",
    isRunning: false,
    lastSaved: new Date().toLocaleString(),
    temperature: 0.7,
    maxTokens: 1000,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    messages: [],
    estimatedTokens: 0,
  });

  const [isSystemPromptOpen, setIsSystemPromptOpen] = useState(false);
  const [isModelSettingsOpen, setIsModelSettingsOpen] = useState(false);
  const [isModelVisibilityOpen, setIsModelVisibilityOpen] = useState(false);
  const [error, setError] = useState('');
  const [modelSearchQuery, setModelSearchQuery] = useState('');
  
  // Template variables state
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [variablesFilled, setVariablesFilled] = useState(false);

  // Check if user is admin
  const isAdmin = session?.user?.email?.endsWith('@samba.tv') || false;

  // Model preferences
  const { preferences, loading: modelPrefsLoading } = useModelPreferences();

  // Get filtered models based on preferences and admin visibility settings
  const getFilteredModels = useCallback(() => {
    // Get admin visibility settings from localStorage
    const adminVisibilityStr = localStorage.getItem('admin-model-visibility');
    const adminVisibility = adminVisibilityStr ? JSON.parse(adminVisibilityStr) : null;
    
    return SUPPORTED_MODELS.filter(model => {
      // First check admin visibility settings (if they exist)
      if (adminVisibility && adminVisibility[model.id] === false) {
        return false;
      }
      
      // Then check user preferences
      return preferences.enabledModels?.has(model.id) ?? false;
    });
  }, [preferences]);

  // Memoize available models to prevent unnecessary recalculations
  const availableModels = useMemo(() => {
    if (modelPrefsLoading) return [];
    return getFilteredModels();
  }, [getFilteredModels, modelPrefsLoading]);

  // Filter models based on search query
  const filteredModels = useMemo(() => {
    if (!modelSearchQuery.trim()) {
      return availableModels.slice(0, 50); // Show first 50 when no search
    }
    
    const query = modelSearchQuery.toLowerCase();
    return availableModels.filter(model => 
      model.name.toLowerCase().includes(query) ||
      model.id.toLowerCase().includes(query) ||
      model.provider.toLowerCase().includes(query)
    ).slice(0, 50); // Limit search results to 50
  }, [availableModels, modelSearchQuery]);

  // Estimate tokens with lightweight fallback for immediate UI feedback
  const estimateTokens = useCallback((text: string): number => {
    return estimateTokensFallback(text);
  }, []);

  // Calculate total tokens for conversation
  const calculateTotalTokens = useCallback(() => {
    let total = 0;
    
    // Add system prompt tokens
    if (state.systemPrompt.trim()) {
      total += estimateTokens(state.systemPrompt);
    }
    
    // Add user prompt tokens
    if (state.userPrompt.trim()) {
      total += estimateTokens(state.userPrompt);
    }
    
    // Add all message tokens
    state.messages.forEach(message => {
      total += estimateTokens(message.content);
    });
    
    return total;
  }, [state.systemPrompt, state.userPrompt, state.messages, estimateTokens]);

  // Update available models when preferences change - REMOVE THIS EFFECT
  // useEffect(() => {
  //   if (!modelPrefsLoading) {
  //     const filtered = getFilteredModels();
  //     setAvailableModels(filtered);
  //   }
  // }, [getFilteredModels, modelPrefsLoading, preferences.enabledModels]);
  
  // Handle selected model becoming unavailable
  useEffect(() => {
    if (!modelPrefsLoading && availableModels.length > 0) {
      const isSelectedModelAvailable = availableModels.find(m => m.id === state.model);
      if (!isSelectedModelAvailable) {
        setState(prev => ({ ...prev, model: availableModels[0].id }));
      }
    }
  }, [availableModels, state.model, modelPrefsLoading]);

  // Update token count when conversation changes
  useEffect(() => {
    const totalTokens = calculateTotalTokens();
    setState(prev => ({ ...prev, estimatedTokens: totalTokens }));
  }, [calculateTotalTokens]);

  // Load prompt from URL if prompt ID is provided
  useEffect(() => {
    const promptId = searchParams.get('promptId');
    const directPrompt = searchParams.get('prompt');
    
    // Load prompt data
    const loadPrompt = async (promptId: string) => {
      try {
        console.log('[Playground] loadPrompt called with promptId:', promptId);
        
        // Check if we have processed content from template variables
        const processedContent = localStorage.getItem('playground-processed-content');
        const storedPromptId = localStorage.getItem('playground-prompt-id');
        
        if (processedContent && storedPromptId && String(storedPromptId) === String(promptId)) {
          console.log('[Playground] Using processed content from localStorage');
          
          // Clean up HTML markup for plain text input
          const cleanContent = processedContent
            .replace(/<mark class="filled-variable">/g, '')
            .replace(/<\/mark>/g, '')
            .replace(/<[^>]*>/g, '') // Remove any other HTML tags
            .replace(/\|\|\|HIGHLIGHT\|\|\|/g, '') // Remove highlight markers
            .trim();
          
          setState(prev => ({
            ...prev,
            userPrompt: cleanContent,
            systemPrompt: '',
          }));
          
          // Clear the localStorage items AFTER setting the content
          localStorage.removeItem('playground-processed-content');
          localStorage.removeItem('playground-prompt-id');
          
          toast({
            title: "Prompt Loaded",
            description: "Loaded prompt with filled variables",
          });
          return;
        }
        
        // Fallback to API if no processed content
        const response = await fetch(`/api/playground/prompt/${promptId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to load prompt');
        }
        
        const data = await response.json();
        
        if (!data || !data.success || !data.prompt) {
          throw new Error('Invalid response structure - missing prompt data');
        }
        
        const prompt = data.prompt;
        
        setState(prev => ({
          ...prev,
          userPrompt: prompt.content,
          systemPrompt: '',
          model: prompt.model || prev.model,
        }));
        
        toast({
          title: "Prompt Loaded",
          description: `Loaded "${prompt.title}"`,
        });
      } catch (error) {
        console.error('[Playground] Error loading prompt:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load prompt",
          variant: "destructive",
        });
      }
    };
    
    // Handle direct prompt content
    if (directPrompt && !promptLoadedRef.current) {
      promptLoadedRef.current = 'direct-prompt';
      const cleanedPrompt = directPrompt
        .replace(/\|\|\|HIGHLIGHT\|\|\|/g, '')
        .trim();
      setState(prev => ({ ...prev, userPrompt: cleanedPrompt }));
      toast({
        title: "Prompt Loaded",
        description: "Prompt loaded successfully",
      });
    } else if (promptId && promptLoadedRef.current !== promptId) {
      promptLoadedRef.current = promptId;
      loadPrompt(promptId);
    }
  }, [searchParams, toast]);

  // Handle conditional logic after all hooks
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-muted-foreground mb-6">
              Please sign in to access the playground and test prompts with AI models.
            </p>
            <SignIn />
          </div>
        </div>
      </div>
    );
  }

  // Run prompt function
  const handleRun = async () => {
    if (!state.userPrompt.trim() || state.isRunning) return;

    console.log("Running prompt with:", {
      model: state.model,
      systemPrompt: state.systemPrompt,
      userPrompt: state.userPrompt,
      temperature: state.temperature,
      maxTokens: state.maxTokens,
    });

    setState(prev => ({ ...prev, isRunning: true, response: "" }));
    setError('');

    try {
      const response = await fetch('/api/playground/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: state.userPrompt,
          model: state.model,
          systemPrompt: state.systemPrompt.trim() || undefined,
          parameters: {
            temperature: state.temperature,
            maxTokens: state.maxTokens,
            topP: state.topP,
            frequencyPenalty: state.frequencyPenalty,
            presencePenalty: state.presencePenalty,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setState(prev => ({
        ...prev,
        response: data.output,
        lastSaved: new Date().toLocaleString(),
      }));

    } catch (error) {
      console.error('Error running prompt:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      
      // Show enhanced toast for quota errors
      if (errorMessage.includes('quota exceeded')) {
        toast({
          title: "OpenAI Quota Exceeded",
          description: "Your OpenAI API key has exceeded its usage quota. Try switching to Claude or Gemini models in the dropdown above.",
          variant: "destructive",
          duration: 10000, // Show for longer
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setState(prev => ({ ...prev, isRunning: false }));
    }
  };

  // Handle model settings change
  const handleModelSettingsChange = (newSettings: Partial<PlaygroundState>) => {
    setState(prev => ({ ...prev, ...newSettings }));
  };

  // Copy response content
  const copyResponse = () => {
    navigator.clipboard.writeText(state.response);
    toast({
      title: "Copied",
      description: "Response copied to clipboard",
    });
  };

  // Clear everything
  const clearAll = () => {
    setState(prev => ({
      ...prev,
      userPrompt: '',
      systemPrompt: '',
      response: '',
      messages: [],
    }));
    setError('');
  };

  // Get code functionality
  const handleGetCode = () => {
    const codeSnippet = `// AI Playground Configuration
const prompt = ${JSON.stringify(state.userPrompt, null, 2)};
const systemPrompt = ${JSON.stringify(state.systemPrompt, null, 2)};
const model = "${state.model}";
const parameters = {
  temperature: ${state.temperature},
  maxTokens: ${state.maxTokens},
  topP: ${state.topP},
  frequencyPenalty: ${state.frequencyPenalty},
  presencePenalty: ${state.presencePenalty},
};`;

    navigator.clipboard.writeText(codeSnippet);
    toast({
      title: "Code Copied",
      description: "Playground configuration copied as code",
    });
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navigation />
      {/* Top Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <Select 
            value={state.model} 
            onValueChange={(value) => {
              setState(prev => ({ ...prev, model: value }));
              setModelSearchQuery(''); // Clear search on selection
            }}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <div className="sticky top-0 p-2 bg-background border-b">
                <Input
                  placeholder="Search models..."
                  value={modelSearchQuery}
                  onChange={(e) => setModelSearchQuery(e.target.value)}
                  className="h-8"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {filteredModels.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground text-center">
                    No models found matching "{modelSearchQuery}"
                  </div>
                ) : (
                  <>
                    {filteredModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        <div className="flex items-center gap-2">
                          <span>{model.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {model.provider}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                    {modelSearchQuery.trim() === '' && availableModels.length > 50 && (
                      <div className="p-2 text-xs text-muted-foreground text-center">
                        Showing 50 of {availableModels.length} models. Use search to find more.
                      </div>
                    )}
                  </>
                )}
              </div>
            </SelectContent>
          </Select>
          
          {/* Admin-only Model Visibility Button */}
          {isAdmin && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsModelVisibilityOpen(true)}
              title="Manage Model Visibility"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleGetCode}>
            <Code className="mr-2 h-4 w-4" />
            Get Code
          </Button>
          <Button 
            onClick={handleRun} 
            disabled={state.isRunning || !state.userPrompt.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            <Play className="mr-2 h-4 w-4" />
            {state.isRunning ? "Running..." : "Run"}
          </Button>
        </div>
      </div>



      {/* Model Info Bar */}
      <div className="px-4 py-2 bg-muted/50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="font-mono text-xs"
              onClick={() => setIsModelSettingsOpen(true)}
            >
              <Settings className="h-3 w-3 mr-2" />
              {state.model}
            </Button>
            <div className="flex items-center gap-2 text-sm">
              <Cpu className="h-4 w-4" />
              <span>Estimated Tokens: {state.estimatedTokens.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Prompt Configuration */}
        <div className="w-1/2 flex flex-col border-r">
          <div className="flex-1 flex flex-col p-4 space-y-4">
            {/* System Prompt Section */}
            <Collapsible open={isSystemPromptOpen} onOpenChange={setIsSystemPromptOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-3 h-auto border rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">System Prompt</span>
                    <span className="text-sm text-muted-foreground">Define a role, tone or context (optional)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    {isSystemPromptOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </div>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <Textarea
                  placeholder="You are a helpful assistant..."
                  value={state.systemPrompt}
                  onChange={(e) => setState(prev => ({ ...prev, systemPrompt: e.target.value }))}
                  className="min-h-[100px] resize-none"
                />
              </CollapsibleContent>
            </Collapsible>

            {/* User Prompt Section */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">User</label>
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 flex flex-col relative">
                {/* Hidden textarea for input handling */}
                <textarea
                  ref={userPromptRef}
                  value={state.userPrompt}
                  onChange={(e) => setState(prev => ({ ...prev, userPrompt: e.target.value }))}
                  onScroll={(e) => {
                    // Sync scroll position to the visible div
                    const visibleDiv = e.currentTarget.nextElementSibling as HTMLDivElement;
                    if (visibleDiv) {
                      visibleDiv.scrollTop = e.currentTarget.scrollTop;
                      visibleDiv.scrollLeft = e.currentTarget.scrollLeft;
                    }
                  }}
                  className="absolute inset-0 w-full h-full p-3 text-base font-mono bg-transparent text-transparent caret-black resize-none border-0 outline-none z-10 overflow-auto"
                  style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
                  }}
                />
                
                {/* Visible syntax-highlighted content */}
                <div 
                  className="absolute inset-0 p-3 text-base font-mono border rounded-md bg-background pointer-events-none whitespace-pre-wrap break-words overflow-hidden"
                  style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                    lineHeight: '1.5'
                  }}
                >
                  {state.userPrompt ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: state.userPrompt
                          .replace(/&/g, '&amp;')
                          .replace(/</g, '&lt;')
                          .replace(/>/g, '&gt;')
                          .replace(/\{\{([^}]+)\}\}/g, '<span style="color: #dc2626; background-color: rgba(220, 38, 38, 0.1); padding: 2px 4px; border-radius: 3px; font-weight: 600; border: 1px solid rgba(220, 38, 38, 0.2);">{{$1}}</span>')
                      }}
                    />
                  ) : (
                    <span className="text-muted-foreground">Enter your prompt here...</span>
                  )}
                </div>
              </div>
            </div>


          </div>
        </div>

        {/* Right Panel - Response */}
        <div className="w-1/2 flex flex-col">
          <div className="flex-1 p-4">
            {state.isRunning ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Running prompt...</p>
                </div>
              </div>
            ) : state.response ? (
              <Card className="h-full">
                <CardContent className="p-0 h-full overflow-hidden flex flex-col">
                  {/* Response Header */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <span className="font-medium">Response</span>
                    <Button variant="ghost" size="sm" onClick={copyResponse}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Response Content */}
                  <div className="flex-1 overflow-auto p-4">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <PromptContentRenderer content={state.response} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col h-full">
                {/* Welcome content */}
                <div className="flex-1 p-6">
                  <Card className="h-full bg-muted/50">
                    <CardContent className="p-6 h-full">
                      <div className="space-y-6">
                        <h2 className="text-2xl font-semibold">
                          Welcome to SambaTV AI Playground
                        </h2>

                        <div className="space-y-4 text-muted-foreground">
                          <div className="flex items-start space-x-3">
                            <span className="text-muted-foreground mt-1">→</span>
                            <p>
                              Write a prompt in the left column, and click <Play className="inline h-4 w-4 mx-1" />{" "}
                              <strong>Run</strong> to see SambaTV AI's response
                            </p>
                          </div>

                          <div className="flex items-start space-x-3">
                            <span className="text-muted-foreground mt-1">→</span>
                            <p>
                              Editing the prompt, or changing{" "}
                              <span className="inline-flex items-center mx-1">
                                <Settings className="h-4 w-4" />
                              </span>{" "}
                              model parameters creates a new version
                            </p>
                          </div>

                          <div className="flex items-start space-x-3">
                            <span className="text-muted-foreground mt-1">→</span>
                            <p>
                              Write variables like this:{" "}
                              <code className="bg-background px-2 py-1 rounded text-primary font-mono text-sm">
                                {"{{VARIABLE_NAME}}"}
                              </code>
                            </p>
                          </div>

                          <div className="flex items-start space-x-3">
                            <span className="text-muted-foreground mt-1">→</span>
                            <p>
                              High quality examples greatly improve performance. After drafting a prompt, click{" "}
                              <strong>EXAMPLES</strong> to add some
                            </p>
                          </div>
                        </div>

                        <div className="pt-4">
                          <Button 
                            variant="outline" 
                            className="flex items-center space-x-2"
                            onClick={() => window.open('https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview', '_blank')}
                          >
                            <Info className="h-4 w-4" />
                            <span>Learn about prompt design</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Model Settings Modal */}
      <Sheet open={isModelSettingsOpen} onOpenChange={setIsModelSettingsOpen}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Model</SheetTitle>
          </SheetHeader>
          
          <div className="space-y-6 mt-6">
                {/* Model Selection */}
                <div className="space-y-2">
              <Select 
                value={state.model} 
                onValueChange={(value) => setState(prev => ({ ...prev, model: value }))}
              >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex items-center gap-2">
                            <span>{model.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {model.provider}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Temperature */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                    <Label>Temperature</Label>
                <span className="text-sm font-mono">{state.temperature}</span>
                  </div>
                  <Slider
                value={[state.temperature]}
                onValueChange={(value) => setState(prev => ({ ...prev, temperature: value[0] }))}
                    max={2}
                    min={0}
                    step={0.1}
                className="w-full"
                  />
                </div>

                {/* Max Tokens */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Max tokens</Label>
                <span className="text-sm font-mono">{state.maxTokens}</span>
                  </div>
                  <Slider
                value={[state.maxTokens]}
                onValueChange={(value) => setState(prev => ({ ...prev, maxTokens: value[0] }))}
                max={20000}
                    min={1}
                    step={1}
                className="w-full"
                  />
                </div>



            {/* Run Button */}
            <div className="pt-4">
                  <Button
                onClick={() => {
                  handleRun();
                  setIsModelSettingsOpen(false);
                }}
                disabled={state.isRunning || !state.userPrompt.trim()}
                className="w-full bg-primary hover:bg-primary/90"
              >
                <Play className="mr-2 h-4 w-4" />
                {state.isRunning ? "Running..." : "Run"}
                  </Button>
                </div>
          </div>
        </SheetContent>
      </Sheet>

                {/* Error Display */}
                {error && (
                  <div className="p-4 border-t">
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {error}
                        {error.includes('quota exceeded') && (
                          <div className="mt-2 text-sm">
                            <p className="font-semibold">Suggestions:</p>
                            <ul className="list-disc ml-4 mt-1 space-y-1">
                              <li>Check your OpenAI billing at: <a href="https://platform.openai.com/account/billing" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com/account/billing</a></li>
                              <li>Switch to Claude models (Anthropic) in the dropdown above</li>
                              <li>Try Gemini models (Google) as an alternative</li>
                            </ul>
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
                
      {/* Model Visibility Manager - Admin Only */}
      {isAdmin && (
        <ModelVisibilityManager
          open={isModelVisibilityOpen}
          onOpenChange={(open) => {
            setIsModelVisibilityOpen(open);
            // If closing the modal, refresh the available models
            if (!open) {
              const filtered = getFilteredModels();
              // setAvailableModels(filtered); // This line is removed as availableModels is now a memoized value
            }
          }}
        />
      )}
    </div>
  );
}

export default function PlaygroundPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex h-[calc(100vh-64px)]">
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-lg text-muted-foreground">Loading playground...</span>
            </div>
          </div>
        </div>
      </div>
    }>
      <PlaygroundContent />
    </Suspense>
  );
}