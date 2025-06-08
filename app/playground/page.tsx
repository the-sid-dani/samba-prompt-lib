'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  Cpu
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PromptContentRenderer } from '@/components/prompt-content-renderer';
import Navigation from '@/components/navigation/Navigation';
import { SUPPORTED_MODELS } from '@/lib/ai';
import { useModelPreferences } from '@/hooks/useModelPreferences';
import { ModelInfo } from '@/lib/ai/generated-models';
import { ModelPreferences } from '@/components/playground/ModelPreferences';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function PlaygroundPage() {
  console.log('[Playground] Rendering playground page');
  
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // State management
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful assistant.');
  const [selectedModel, setSelectedModel] = useState<string>('claude-3-5-sonnet-20241022');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [estimatedTokens, setEstimatedTokens] = useState(0);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [showModelPreferences, setShowModelPreferences] = useState(false);
  const [variablesFilled, setVariablesFilled] = useState(false);

  // Model preferences
  const { getFilteredModels, loading: modelPrefsLoading, preferences } = useModelPreferences();
  
  // Get current filtered models - this will re-run when preferences change
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  
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

  // Accurate token counting using tiktoken
  const estimateTokens = useCallback((text: string): number => {
    if (!text.trim()) return 0;
    
    try {
      // Use tiktoken for accurate GPT tokenization (works for most models)
      const { encoding_for_model, get_encoding } = require('tiktoken');
      
      // Determine encoding based on selected model
      let encoding;
      if (selectedModel.includes('gpt-4') || selectedModel.includes('gpt-3.5')) {
        encoding = encoding_for_model(selectedModel as any);
      } else {
        // Use cl100k_base encoding for other models (Claude, Gemini, etc.)
        encoding = get_encoding('cl100k_base');
      }
      
      const tokens = encoding.encode(text);
      encoding.free(); // Free memory
      return tokens.length;
    } catch (error) {
      console.warn('Tiktoken error, falling back to word approximation:', error);
      // Fallback to improved word-based estimation
      const words = text.trim().split(/\s+/).length;
      return Math.ceil(words * 1.3); // More accurate multiplier
    }
  }, [selectedModel]);

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
  }, [systemPrompt, messages]);

  // Update token count when conversation changes
  useEffect(() => {
    const totalTokens = calculateTotalTokens();
    // Add current input text tokens
    const inputTokens = inputText.trim() ? estimateTokens(inputText) : 0;
    setEstimatedTokens(totalTokens + inputTokens);
  }, [calculateTotalTokens, inputText]);

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savePromptTitle, setSavePromptTitle] = useState('');
  const [savePromptDescription, setSavePromptDescription] = useState('');
  const [savePromptContent, setSavePromptContent] = useState('');
  const [savePromptCategory, setSavePromptCategory] = useState('General');
  const [savePromptTags, setSavePromptTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, loading]);

  // Track if prompt has been loaded to prevent duplicate loads
  const promptLoadedRef = useRef<string | null>(null);

  // Load prompt from URL if prompt ID is provided
  useEffect(() => {
    const promptId = searchParams.get('promptId');
    if (promptId && promptLoadedRef.current !== promptId) {
      promptLoadedRef.current = promptId;
      loadPrompt(promptId);
    }
  }, [searchParams]);

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
        
        // Put processed content in system prompt field, clear main input
        setInputText('')
        setSystemPrompt(processedContent)
        setVariables({})
        setVariablesFilled(true)
        
        // Clear the localStorage items AFTER setting the content
        localStorage.removeItem('playground-processed-content')
        localStorage.removeItem('playground-prompt-id')
        
        toast({
          title: "Prompt Loaded",
          description: "Loaded prompt with filled variables in system prompt",
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
      
      // Put content in system prompt field, clear main input
      setInputText(''); // Clear the main input field
      setSystemPrompt(prompt.content); // Put prompt content in system prompt field
      if (prompt.model) setSelectedModel(prompt.model);
      
      // Don't extract template variables when loading from playground
      // Clear any existing variables
      setVariables({});
      setVariablesFilled(false)
      
      toast({
        title: "Prompt Loaded",
        description: `Loaded "${prompt.title}" in system prompt`,
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

  // Extract template variables from prompt text
  const extractTemplateVariables = (text: string): string[] => {
    const regex = /\{\{([^}]+)\}\}/g;
    const matches = text.match(regex);
    if (!matches) return [];
    
    return [...new Set(matches.map(match => match.slice(2, -2).trim()))];
  };

  // Handle template variable changes
  const handleVariableChange = useCallback((varName: string, value: string) => {
    console.log('[Playground] Variable changed:', varName, value);
    setVariables(prev => ({ ...prev, [varName]: value }));
  }, []);

  // Process prompt with variables
  const processPromptWithVariables = (text: string): string => {
    let processed = text;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
      processed = processed.replace(regex, value);
    });
    return processed;
  };

  // Send message
  const handleSendMessage = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to test prompts",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);
    setError('');

    try {
      const processedPrompt = processPromptWithVariables(inputText);
      const processedSystemPrompt = processPromptWithVariables(systemPrompt);
      
      const response = await fetch('/api/playground/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: processedPrompt,
          systemPrompt: processedSystemPrompt,
          model: selectedModel,
          parameters: {
            temperature,
            maxTokens,
            topP: 1.0,
            frequencyPenalty: 0,
            presencePenalty: 0,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate output');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.output,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      console.log('[Playground] Generation successful');
    } catch (error) {
      console.error('[Playground] Generation error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle keyboard shortcut
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSendMessage();
    }
  };

  // Clear conversation
  const clearConversation = () => {
    setMessages([]);
    setError('');
  };

  // Copy message to clipboard
  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
      });
    } catch (error) {
      console.error('[Playground] Copy error:', error);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  // Export conversation to Markdown
  const exportConversation = () => {
    if (messages.length === 0) {
      toast({
        title: "No conversation to export",
        description: "Start a conversation first",
        variant: "destructive",
      });
      return;
    }

    const markdown = messages.map((message) => {
      const role = message.role === 'user' ? '**You**' : '**Assistant**';
      const timestamp = message.timestamp.toLocaleString();
      return `${role} (${timestamp}):\n\n${message.content}\n\n---\n`;
    }).join('\n');

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Exported!",
      description: "Conversation exported as Markdown file",
    });
  };

  // Open save prompt modal
  const openSaveModal = () => {
    setSavePromptTitle('');
    setSavePromptDescription('');
    setSavePromptContent(systemPrompt);
    setSavePromptCategory('General');
    setSavePromptTags([]);
    setTagInput('');
    setShowSaveModal(true);
  };

  // Add tag
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !savePromptTags.includes(trimmedTag) && savePromptTags.length < 5) {
      setSavePromptTags([...savePromptTags, trimmedTag]);
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setSavePromptTags(savePromptTags.filter(tag => tag !== tagToRemove));
  };

  // Handle tag input
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput);
      setTagInput('');
    }
  };

  // Save prompt
  const savePrompt = async () => {
    if (!savePromptTitle.trim() || !savePromptDescription.trim() || !savePromptContent.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: savePromptTitle,
          description: savePromptDescription,
          content: savePromptContent,
          category: savePromptCategory,
          tags: savePromptTags,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save prompt');
      }

      toast({
        title: "Success!",
        description: "Prompt saved successfully",
      });
      
      setShowSaveModal(false);
      setSavePromptTitle('');
      setSavePromptDescription('');
      setSavePromptContent('');
      setSavePromptCategory('General');
      setSavePromptTags([]);
      setTagInput('');
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "Failed to save prompt",
        variant: "destructive",
      });
    }
  };

  const templateVars = extractTemplateVariables(inputText);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Panel - Conversation */}
        <div className="w-2/3 flex flex-col bg-background p-4">
          <div className="flex-1 flex flex-col bg-card border border-border rounded-lg shadow-sm">
            {/* Header */}
            <div className="border-b border-border bg-card rounded-t-lg">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <h1 className="text-lg font-semibold text-foreground">Conversation</h1>
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      Estimated tokens: {estimatedTokens}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={exportConversation}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={openSaveModal}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Prompt
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col min-h-0">
              <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto scroll-smooth"
                style={{ maxHeight: 'calc(100vh - 300px)' }}
              >
                <div className="px-6 py-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full min-h-[400px]">
                      <div className="text-center text-muted-foreground">
                        <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted" />
                        <p className="text-lg font-medium mb-2">No messages yet</p>
                        <p>Start a conversation by typing below</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className="relative group">
                            {/* Message Bubble */}
                            <div
                              className={`max-w-[70vw] min-w-[60px] rounded-lg px-4 py-3 shadow-sm relative ${
                                message.role === 'user'
                                  ? 'bg-red-600 text-white rounded-br-none'
                                  : 'bg-muted text-foreground border border-border rounded-bl-none'
                              }`}
                              style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                            >
                              <div className="prose max-w-none text-sm leading-relaxed">
                                <PromptContentRenderer content={message.content.trim()} />
                              </div>
                              
                              {/* Copy Button - appears on hover */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyMessage(message.content)}
                                className={`absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                                  message.role === 'user' 
                                    ? 'text-red-200 hover:text-white hover:bg-white hover:bg-opacity-20' 
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {loading && (
                        <div className="flex justify-start">
                          <div className="bg-muted border border-border rounded-lg rounded-bl-none p-4 shadow-sm">
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Generating response...</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Scroll anchor */}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="border-t border-border bg-muted/30">
                  <div className="px-6 py-4">
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </div>
                </div>
              )}

              {/* Template Variables */}
              {templateVars.length > 0 && (
                <div className="border-t border-border bg-muted/30">
                  <div className="px-6 py-4">
                    <Label className="text-sm font-medium mb-3 block">Template Variables</Label>
                    <div className="space-y-3">
                      {templateVars.map((varName) => (
                        <div key={varName} className="space-y-1">
                          <Label htmlFor={varName} className="text-sm">
                            {varName}
                          </Label>
                          <Input
                            id={varName}
                            value={variables[varName] || ''}
                            onChange={(e) => handleVariableChange(varName, e.target.value)}
                            placeholder={`Enter ${varName}...`}
                            className="text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="border-t border-border bg-card rounded-b-lg">
                <div className="px-6 py-4">
                  <div className="flex gap-3 items-end">
                    <Textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your message... (Shift + Enter for new line)"
                      className="flex-1 min-h-[60px] max-h-[120px] resize-none border-border focus:border-red-500 focus:ring-red-500 bg-background text-foreground"
                    />
                    <div className="flex gap-2">
                      {messages.length > 0 && (
                        <Button
                          onClick={clearConversation}
                          variant="outline"
                          size="lg"
                          className="px-4 border-border hover:bg-muted"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                                          <Button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSendMessage();
                      }}
                      disabled={loading || !inputText.trim()}
                      size="lg"
                      className="bg-red-600 hover:bg-red-700 text-white px-4 shadow-sm"
                      type="button"
                    >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-muted-foreground">
                      Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Shift + Enter</kbd> for new line
                    </p>
                    {messages.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {messages.length} message{messages.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Settings */}
        <div className="w-1/3 bg-background overflow-y-auto">
          <div className="p-6">
            <Accordion type="multiple" defaultValue={["system-prompt", "model-settings"]} className="w-full space-y-3">
              <AccordionItem value="system-prompt" className="border border-border rounded-lg bg-card shadow-sm">
                <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50 rounded-t-lg">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-sm">System Prompt</span>
                    </div>
                    {variablesFilled && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        Variables Filled ✓
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5">
                  <div className="space-y-2">
                    {variablesFilled && (
                      <div className="mb-2 text-sm text-green-600 dark:text-green-400">
                        ✓ Template variables have been filled with your values. You can now run the prompt.
                      </div>
                    )}
                    <div className="w-full min-h-[200px] text-sm rounded-md border border-input bg-background px-3 py-2">
                      <PromptContentRenderer content={systemPrompt} />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="model-settings" className="border border-border rounded-lg bg-card shadow-sm">
                <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4" />
                    <span className="font-semibold">Model Settings</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">AI Model</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {!modelPrefsLoading ? availableModels.length : '...'} available
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowModelPreferences(true)}
                          className="h-6 w-6 p-0"
                        >
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger className="w-full border-border bg-background text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {!modelPrefsLoading && availableModels.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{model.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">{model.provider.toLowerCase()}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="web-search" className="text-sm font-medium">Web Search</Label>
                    </div>
                    <Switch
                      id="web-search"
                      checked={webSearchEnabled}
                      onCheckedChange={setWebSearchEnabled}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="generation-settings" className="border border-border rounded-lg bg-card shadow-sm">
                <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-red-600" />
                    <span className="font-medium text-sm">Generation Settings</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label className="text-sm font-medium">Temperature</Label>
                      <span className="text-sm text-muted-foreground">{temperature}</span>
                    </div>
                    <Slider
                      value={[temperature]}
                      onValueChange={([value]) => setTemperature(value)}
                      min={0}
                      max={2}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Max Tokens</Label>
                    <Input
                      type="number"
                      value={maxTokens}
                      onChange={(e) => setMaxTokens(parseInt(e.target.value) || 0)}
                      min={1}
                      max={4000}
                      className="w-full border-border bg-background text-foreground"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Save Prompt Modal */}
      <Dialog open={showSaveModal} onOpenChange={setShowSaveModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Save className="h-5 w-5" />
              Submit a New Prompt
            </DialogTitle>
            <p className="text-sm text-slate-500">All fields marked with * are required</p>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="prompt-title" className="text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="prompt-title"
                placeholder="e.g., 'SEO-Optimized Blog Post Generator'"
                value={savePromptTitle}
                onChange={(e) => setSavePromptTitle(e.target.value)}
                maxLength={100}
              />
              <p className="text-xs text-slate-500">A clear, concise title (max 100 characters)</p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="prompt-description" className="text-sm font-medium">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="prompt-description"
                placeholder="Explain what your prompt does and when someone would use it..."
                value={savePromptDescription}
                onChange={(e) => setSavePromptDescription(e.target.value)}
                className="min-h-[80px]"
                maxLength={500}
              />
              <p className="text-xs text-slate-500">Brief description of your prompt (max 500 characters). Drag the bottom-right corner to resize.</p>
            </div>

            {/* Prompt Content */}
            <div className="space-y-2">
              <Label htmlFor="prompt-content" className="text-sm font-medium">
                Prompt Content <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="prompt-content"
                placeholder="Enter your full prompt content here. You can use markdown for formatting."
                value={savePromptContent}
                onChange={(e) => setSavePromptContent(e.target.value)}
                className="min-h-[150px]"
              />
              <p className="text-xs text-slate-500">The full prompt content with markdown formatting support. Drag the bottom-right corner to resize.</p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Category <span className="text-red-500">*</span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {['Productivity', 'General', 'Development', 'Data Analysis', 'Marketing', 'Sales', 'HR', 'Finance', 'Legal', 'Customer Support', 'Research'].map((category) => (
                  <Button
                    key={category}
                    type="button"
                    variant={savePromptCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSavePromptCategory(category)}
                    className={savePromptCategory === category ? "bg-red-600 hover:bg-red-700 text-white" : ""}
                  >
                    {category}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-slate-500">Choose the most appropriate category for your prompt or create a new one</p>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Tags <span className="text-red-500">*</span>
              </Label>
                             <div className="space-y-2">
                 <Input
                   placeholder="Type to search or add tags..."
                   value={tagInput}
                   onChange={(e) => setTagInput(e.target.value)}
                   onKeyDown={handleTagInput}
                 />
                {savePromptTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {savePromptTags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="px-2 py-1 text-xs">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-slate-500">{savePromptTags.length}/5 tags. Type and press Enter to add tags.</p>
                <p className="text-xs text-slate-500">Add 1-5 tags to help others find your prompt. Start typing to see suggestions.</p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowSaveModal(false)}>
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            <Button 
              onClick={savePrompt}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={!savePromptTitle.trim() || !savePromptDescription.trim() || !savePromptContent.trim() || savePromptTags.length === 0}
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Prompt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Model Preferences Modal */}
      <ModelPreferences 
        open={showModelPreferences} 
        onOpenChange={setShowModelPreferences} 
      />
    </div>
  );
}