'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  Copy, 
  Send, 
  AlertCircle, 
  Loader2, 
  MessageSquare,
  Settings,
  Sliders,
  Download,
  Save,
  RotateCcw,
  Bot,
  X,
  Search,
  Cpu,
  Info,
  SlidersHorizontal
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PromptContentRenderer } from '@/components/prompt-content-renderer';
import Navigation from '@/components/navigation/Navigation';
import { SUPPORTED_MODELS } from '@/lib/ai';
import { useModelPreferences } from '@/hooks/useModelPreferences';
import { ModelInfo } from '@/lib/ai/generated-models';
import { ModelPreferences } from '@/components/playground/ModelPreferences';
import { estimateTokensFallback } from '@/lib/tokenization';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Wand2, History } from "lucide-react";
import SignIn from '@/components/sign-in';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Update the form schema
const playgroundSchema = z.object({
  model: z.string().min(1, "Model is required"),
  prompt: z.string().min(1, "Prompt is required"),
  temperature: z.number().min(0).max(2),
  maxTokens: z.number().min(1).max(4000),
  topP: z.number().min(0).max(1),
  frequencyPenalty: z.number().min(-2).max(2),
  presencePenalty: z.number().min(-2).max(2),
});

type PlaygroundFormData = z.infer<typeof playgroundSchema>;

function PlaygroundContent() {
  console.log('[Playground] Rendering playground page');
  
  // ALL HOOKS MUST BE AT THE TOP - BEFORE ANY CONDITIONAL LOGIC
  // Session and authentication
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const promptLoadedRef = useRef<string | null>(null);

  // State management
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful assistant.');
  const [systemPromptDisplay, setSystemPromptDisplay] = useState(''); // For display with markup
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [availableModels, setAvailableModels] = useState<typeof SUPPORTED_MODELS>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [estimatedTokens, setEstimatedTokens] = useState(0);
  
  // Model parameters
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [topP, setTopP] = useState(1);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0);
  const [presencePenalty, setPresencePenalty] = useState(0);
  
  // Template variables state
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [variablesFilled, setVariablesFilled] = useState(false);

  // Save prompt modal state
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savePromptTitle, setSavePromptTitle] = useState('');
  const [savePromptDescription, setSavePromptDescription] = useState('');
  const [savePromptContent, setSavePromptContent] = useState('');
  const [savePromptCategory, setSavePromptCategory] = useState('General');
  const [savePromptTags, setSavePromptTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Model preferences
  const { preferences, loading: modelPrefsLoading } = useModelPreferences();

  // Get filtered models based on preferences 
  const getFilteredModels = useCallback(() => {
    return SUPPORTED_MODELS.filter(model => {
      // Only include models that are explicitly enabled in preferences
      return preferences.enabledModels?.has(model.id) ?? false;
    });
  }, [preferences]);

  // Accurate token counting using tiktoken
  // Estimate tokens with lightweight fallback for immediate UI feedback
  const estimateTokens = useCallback((text: string): number => {
    return estimateTokensFallback(text);
  }, []);

  // Calculate total tokens for conversation
  const calculateTotalTokens = useCallback(() => {
    let total = 0;
    
    // Add system prompt tokens
    if (systemPrompt.trim()) {
      total += estimateTokens(systemPrompt);
    }
    
    // Add all message tokens
    messages.forEach(message => {
      total += estimateTokens(message.content);
    });
    
    return total;
  }, [systemPrompt, messages, estimateTokens]);

  // Handle template variable changes
  const handleVariableChange = useCallback((varName: string, value: string) => {
    console.log('[Playground] Variable changed:', varName, value);
    setVariables(prev => ({ ...prev, [varName]: value }));
    
    // Update display version with filled variables
    setSystemPromptDisplay(prev => {
      let updated = systemPrompt; // Start with clean text
      if (value.trim()) {
        // Replace standard variable format {{KEY}}
        const regex = new RegExp(`\\{\\{\\s*${varName}\\s*\\}\\}`, 'g');
        updated = updated.replace(regex, `<mark class="filled-variable">${value}</mark>`);
        
        // Replace markdown list format: - `KEY`: Description (e.g., "example") or (default: "example")
        const mdListRegex = new RegExp(`-\\s*\`${varName}\`:\\s*[^\\n]*\\((e\\.g\\.,|default:)\\s*["'][^"']*["']\\)`, 'g');
        updated = updated.replace(mdListRegex, `<mark class="filled-variable">${value}</mark>`);
      }
      
      // Apply all other variables too
      Object.entries(variables).forEach(([key, val]) => {
        if (key !== varName && val.trim()) {
          const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
          updated = updated.replace(regex, `<mark class="filled-variable">${val}</mark>`);
          
          const mdListRegex = new RegExp(`-\\s*\`${key}\`:\\s*[^\\n]*\\((e\\.g\\.,|default:)\\s*["'][^"']*["']\\)`, 'g');
          updated = updated.replace(mdListRegex, `<mark class="filled-variable">${val}</mark>`);
        }
      });
      
      return updated;
    });
  }, [systemPrompt, variables]);

  // Form hook
  const form = useForm<PlaygroundFormData>({
    resolver: zodResolver(playgroundSchema),
    defaultValues: {
      model: "gpt-3.5-turbo",
      prompt: "",
      temperature: 0.7,
      maxTokens: 1000,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0,
    },
  });

  // Update available models when preferences change
  useEffect(() => {
    if (!modelPrefsLoading) {
      const filtered = getFilteredModels();
      setAvailableModels(filtered);
    }
  }, [getFilteredModels, modelPrefsLoading, preferences.enabledModels]);
  
  // Handle selected model becoming unavailable
  useEffect(() => {
    if (!modelPrefsLoading && availableModels.length > 0) {
      const isSelectedModelAvailable = availableModels.find(m => m.id === selectedModel);
      if (!isSelectedModelAvailable) {
        setSelectedModel(availableModels[0].id);
      }
    }
  }, [availableModels, selectedModel, modelPrefsLoading]);

  // Update token count when conversation changes
  useEffect(() => {
    const totalTokens = calculateTotalTokens();
    // Add current input text tokens
    const inputTokens = inputText.trim() ? estimateTokens(inputText) : 0;
    setEstimatedTokens(totalTokens + inputTokens);
  }, [calculateTotalTokens, inputText, estimateTokens]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messages.length > 0) {
      const scrollToBottom = () => {
        setTimeout(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }
        }, 100);
      };
      scrollToBottom();
    }
  }, [messages, loading]);

  // Load prompt from URL if prompt ID is provided
  useEffect(() => {
    const promptId = searchParams.get('promptId');
    const directPrompt = searchParams.get('prompt');
    
    // Load prompt data
    const loadPrompt = async (promptId: string) => {
      try {
        console.log('[Playground] loadPrompt called with promptId:', promptId)
        
        // Check if we have processed content from template variables
        const processedContent = localStorage.getItem('playground-processed-content')
        const storedPromptId = localStorage.getItem('playground-prompt-id')
        
        console.log('[Playground] localStorage check:')
        console.log('- processedContent exists:', !!processedContent)
        console.log('- processedContent length:', processedContent?.length || 0)
        console.log('- storedPromptId:', storedPromptId)
        console.log('- promptId:', promptId)
        console.log('- IDs match:', String(storedPromptId) === String(promptId))
        
        if (processedContent) {
          console.log('- processedContent includes {{PROJECT_KEY}}:', processedContent.includes('{{PROJECT_KEY}}'))
          console.log('- processedContent includes SAMBA-123:', processedContent.includes('SAMBA-123'))
        }
        
        // Ensure both IDs are strings and match
        if (processedContent && storedPromptId && String(storedPromptId) === String(promptId)) {
          console.log('[Playground] Using processed content from localStorage')
          
          // Clean up HTML markup for plain text input
          const cleanContent = processedContent
            .replace(/<mark class="filled-variable">/g, '')
            .replace(/<\/mark>/g, '')
            .replace(/<[^>]*>/g, '') // Remove any other HTML tags
            .trim();
          
          // Put processed content in user input field, clear system prompt
          setInputText(cleanContent)
          setSystemPrompt('') // Clear system prompt
          setSystemPromptDisplay('') // Clear display markup
          setVariables({})
          setVariablesFilled(true)
          
          // Clear the localStorage items AFTER setting the content
          localStorage.removeItem('playground-processed-content')
          localStorage.removeItem('playground-prompt-id')
          
          toast({
            title: "Prompt Loaded",
            description: "Loaded prompt with filled variables in message input",
          })
          return
        }
        
        console.log('[Playground] Falling back to API')
        
        // Fallback to API if no processed content
        const response = await fetch(`/api/playground/prompt/${promptId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('[Playground] API Error Response:', errorData);
          
          if (errorData.available) {
            throw new Error(`Prompt ${promptId} not found. Available IDs: ${errorData.available.join(', ')}`);
          }
          
          throw new Error(`Failed to load prompt (${response.status}): ${errorData.error || 'Unknown error'}`);
        }
        
        const data = await response.json();
        console.log('[Playground] Loaded prompt data:', data);
        
        // Check if the response has the expected structure
        if (!data || !data.success || !data.prompt) {
          console.error('[Playground] Invalid response structure:', data);
          throw new Error('Invalid response structure - missing prompt data');
        }
        
        // The new API returns { success: true, prompt: { ... } }
        const prompt = data.prompt;
        
        // Put content in user input field, clear system prompt
        setInputText(prompt.content); // Put content in user input
        setSystemPrompt(''); // Clear system prompt
        setSystemPromptDisplay(''); // Clear display markup
        if (prompt.model) setSelectedModel(prompt.model);
        
        // Don't extract template variables when loading from playground
        // Clear any existing variables
        setVariables({});
        setVariablesFilled(false)
        
        toast({
          title: "Prompt Loaded",
          description: `Loaded "${prompt.title}" in message input`,
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
    
    // Handle direct prompt content (from Test in Playground button)
    if (directPrompt && !promptLoadedRef.current) {
      promptLoadedRef.current = 'direct-prompt';
      // Clean up highlight markers if present
      const cleanedPrompt = directPrompt
        .replace(/\|\|\|HIGHLIGHT\|\|\|/g, '')
        .trim();
      setInputText(cleanedPrompt);
      toast({
        title: "Prompt Loaded",
        description: "Prompt loaded in message input",
      });
    } else if (promptId && promptLoadedRef.current !== promptId) {
      promptLoadedRef.current = promptId;
      loadPrompt(promptId);
    }
  }, [searchParams, toast]);

  // NOW HANDLE CONDITIONAL LOGIC AFTER ALL HOOKS
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
            <MessageSquare className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
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

  // Send message function
  const sendMessage = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);
    setError('');

    try {
      // Build the conversation context for the prompt
      const conversationHistory = [...messages, userMessage]
        .map(msg => `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`)
        .join('\n\n');
      
      // Create the full prompt with conversation context
      const fullPrompt = messages.length === 0 ? userMessage.content : conversationHistory;

      const response = await fetch('/api/playground/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: fullPrompt,
          model: selectedModel,
          systemPrompt: systemPrompt.trim() || undefined,
          parameters: {
            temperature,
            maxTokens,
            topP,
            frequencyPenalty,
            presencePenalty,
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

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.output, // API returns 'output', not 'content'
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to send message',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Clear conversation
  const clearConversation = () => {
    setMessages([]);
    setError('');
  };

  // Copy message content
  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Message copied to clipboard",
    });
  };

  // Main playground UI - full functionality restored
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-120px)]">
          {/* Settings Panel */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Model Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Model Selection */}
                <div className="space-y-2">
                  <Label>Model</Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
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
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Temperature</Label>
                    <span className="text-sm text-muted-foreground">{temperature}</span>
                  </div>
                  <Slider
                    value={[temperature]}
                    onValueChange={(value) => setTemperature(value[0])}
                    max={2}
                    min={0}
                    step={0.1}
                  />
                </div>

                {/* Max Tokens */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Max Tokens</Label>
                    <span className="text-sm text-muted-foreground">{maxTokens}</span>
                  </div>
                  <Slider
                    value={[maxTokens]}
                    onValueChange={(value) => setMaxTokens(value[0])}
                    max={4000}
                    min={1}
                    step={1}
                  />
                </div>

                {/* System Prompt */}
                <div className="space-y-2">
                  <Label>System Prompt</Label>
                  <Textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    placeholder="You are a helpful assistant..."
                    className="min-h-[100px] text-sm"
                  />
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    onClick={clearConversation}
                    variant="outline"
                    size="sm"
                    className="w-full"
                    disabled={messages.length === 0}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear Chat
                  </Button>
                </div>

                {/* Token Counter */}
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Cpu className="h-4 w-4" />
                    <span className="font-medium">Estimated Tokens</span>
                  </div>
                  <div className="text-lg font-mono mt-1">{estimatedTokens.toLocaleString()}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 flex flex-col">
            <Card className="flex-1 flex flex-col">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  AI Playground
                </CardTitle>
                <CardDescription>
                  Test and experiment with AI models. Messages are not saved.
                </CardDescription>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea
                  ref={chatContainerRef}
                  className="flex-1 p-4"
                >
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg mb-2">Start a conversation</p>
                        <p className="text-sm">Send a message to begin testing the AI model</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <PromptContentRenderer content={message.content} />
                              </div>
                              <Button
                                onClick={() => copyMessage(message.content)}
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {loading && (
                        <div className="flex gap-3 justify-start">
                          <div className="bg-muted rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="text-sm text-muted-foreground">
                                AI is thinking...
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </ScrollArea>

                {/* Error Display */}
                {error && (
                  <div className="p-4 border-t">
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </div>
                )}

                {/* Input Area */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Type your message here..."
                      className="flex-1 min-h-[60px] max-h-[200px] resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!inputText.trim() || loading}
                      size="default"
                      className="self-end"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                    <span>Press Enter to send, Shift+Enter for new line</span>
                    <span>{inputText.length} characters</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
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
              <Loader2 className="h-6 w-6 animate-spin text-red-600" />
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