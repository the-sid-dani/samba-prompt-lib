import Anthropic from '@anthropic-ai/sdk';
import { AIProvider, GenerationParams, GenerationResponse } from '../types';
import { SUPPORTED_MODELS } from '../generated-models';

export class AnthropicAIProvider implements AIProvider {
  private client: Anthropic;
  public name = 'Anthropic Claude';
  public models: string[] = []; // Will be populated dynamically

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is required');
    }
    
    this.client = new Anthropic({
      apiKey,
    });
    
    // Populate models from SUPPORTED_MODELS
    this.models = SUPPORTED_MODELS
      .filter(model => model.provider === 'anthropic')
      .map(model => model.id);
  }

  async generateResponse(params: GenerationParams): Promise<GenerationResponse> {
    try {
      console.log('[Anthropic] Generating response for model:', params.model);
      console.log('[Anthropic] Temperature:', params.temperature);
      console.log('[Anthropic] Max tokens:', params.maxTokens);

      // Prepare messages array
      const messages: Anthropic.Messages.MessageParam[] = [
        {
          role: 'user',
          content: params.prompt,
        }
      ];

      // Create the request parameters
      const requestParams: Anthropic.Messages.MessageCreateParams = {
        model: params.model,
        max_tokens: params.maxTokens ?? 1024,
        temperature: params.temperature ?? 0.7,
        messages,
      };

      // Add system prompt if provided
      if (params.systemPrompt) {
        requestParams.system = params.systemPrompt;
      }

      // Add top_p if provided (Claude supports this)
      if (params.topP !== undefined) {
        requestParams.top_p = params.topP;
      }

      const response = await this.client.messages.create(requestParams);

      // Extract the text content from the response
      const content = response.content
        .filter((block) => block.type === 'text')
        .map((block) => (block as any).text)
        .join('');

      // Extract usage information
      const usage = {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      };

      return {
        content,
        model: params.model,
        usage,
        finishReason: response.stop_reason || 'completed',
      };

    } catch (error: any) {
      console.error('[Anthropic] Generation failed:', error);
      
      // Handle specific Anthropic errors
      let errorMessage = 'Failed to generate response with Claude';
      
      if (error.status === 401) {
        errorMessage = 'Invalid Anthropic API key';
      } else if (error.status === 429) {
        errorMessage = 'Anthropic rate limit exceeded';
      } else if (error.status === 400 && error.message?.includes('safety')) {
        errorMessage = 'Content blocked by Claude safety filters';
      } else if (error.status === 400 && error.message?.includes('context_length')) {
        errorMessage = 'Prompt exceeds Claude context length limit';
      } else if (error.message) {
        errorMessage = `Claude error: ${error.message}`;
      }

      return {
        content: '',
        model: params.model,
        error: errorMessage,
      };
    }
  }
} 