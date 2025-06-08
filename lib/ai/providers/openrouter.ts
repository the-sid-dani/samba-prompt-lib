import OpenAI from 'openai';
import { AIProvider, GenerationParams, GenerationResponse } from '../types';
import { SUPPORTED_MODELS } from '../generated-models';

export class OpenRouterAIProvider implements AIProvider {
  private client: OpenAI;
  public name = 'OpenRouter';
  public models: string[] = []; // Will be populated dynamically

  constructor() {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY environment variable is required');
    }
    
    this.client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey,
      defaultHeaders: {
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
        'X-Title': 'SambaTV Prompt Library',
      },
    });
    
    // Populate models from SUPPORTED_MODELS
    this.models = SUPPORTED_MODELS
      .filter(model => model.provider === 'openrouter')
      .map(model => model.id);
  }

  async generateResponse(params: GenerationParams): Promise<GenerationResponse> {
    try {
      console.log('[OpenRouter] Generating response for model:', params.model);
      console.log('[OpenRouter] Temperature:', params.temperature);
      console.log('[OpenRouter] Max tokens:', params.maxTokens);

      // Prepare messages array
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
      
      // Add system message if provided
      if (params.systemPrompt) {
        messages.push({
          role: 'system',
          content: params.systemPrompt,
        });
      }
      
      // Add user message
      messages.push({
        role: 'user',
        content: params.prompt,
      });

      // Create the request parameters
      const requestParams: OpenAI.Chat.ChatCompletionCreateParams = {
        model: this.mapModelName(params.model),
        messages,
        max_tokens: params.maxTokens ?? 1024,
        temperature: params.temperature ?? 0.7,
      };

      // Add optional parameters if provided
      if (params.topP !== undefined) {
        requestParams.top_p = params.topP;
      }
      
      if (params.frequencyPenalty !== undefined) {
        requestParams.frequency_penalty = params.frequencyPenalty;
      }
      
      if (params.presencePenalty !== undefined) {
        requestParams.presence_penalty = params.presencePenalty;
      }

      const response = await this.client.chat.completions.create(requestParams);

      const choice = response.choices[0];
      const content = choice.message.content || '';

      // Extract usage information
      const usage = response.usage ? {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens,
      } : undefined;

      return {
        content,
        model: params.model,
        usage,
        finishReason: choice.finish_reason || 'completed',
      };

    } catch (error: any) {
      console.error('[OpenRouter] Generation failed:', error);
      
      // Handle specific OpenRouter/OpenAI errors
      let errorMessage = 'Failed to generate response with OpenRouter';
      
      if (error.status === 401) {
        errorMessage = 'Invalid OpenRouter API key';
      } else if (error.status === 429) {
        errorMessage = 'OpenRouter rate limit exceeded';
      } else if (error.status === 400 && error.message?.includes('context_length')) {
        errorMessage = 'Prompt exceeds model context length limit';
      } else if (error.status === 400 && error.message?.includes('content_policy')) {
        errorMessage = 'Content blocked by content policy';
      } else if (error.status === 402) {
        errorMessage = 'OpenRouter credit limit exceeded';
      } else if (error.message) {
        errorMessage = `OpenRouter error: ${error.message}`;
      }

      return {
        content: '',
        model: params.model,
        error: errorMessage,
      };
    }
  }

  /**
   * Map our simplified model names to OpenRouter model identifiers
   */
  private mapModelName(model: string): string {
    const modelMap: Record<string, string> = {
      'gpt-4o': 'openai/gpt-4o',
      'gpt-4o-mini': 'openai/gpt-4o-mini',
      'gpt-4-turbo': 'openai/gpt-4-turbo',
      'gpt-3.5-turbo': 'openai/gpt-3.5-turbo',
      'claude-3-opus': 'anthropic/claude-3-opus',
      'claude-3-sonnet': 'anthropic/claude-3-sonnet',
      'gemini-pro': 'google/gemini-pro',
    };

    return modelMap[model] || model;
  }
} 