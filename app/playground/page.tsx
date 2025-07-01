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

  // Main playground UI - simplified version for now
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">AI Playground</h1>
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">Playground is currently being rebuilt...</p>
            <p className="text-sm text-muted-foreground mt-2">Please check back soon.</p>
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