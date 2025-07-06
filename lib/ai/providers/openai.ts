import { AIProvider, GenerationParams, GenerationResponse } from '../types';
import { SUPPORTED_MODELS } from '../generated-models';

export class OpenAIProvider implements AIProvider {
  public name = 'OpenAI';
  public models: string[] = [];
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    
    this.apiKey = apiKey;
    
    // Populate models from SUPPORTED_MODELS
    this.models = SUPPORTED_MODELS
      .filter(model => model.provider === 'openai')
      .map(model => model.id);
  }

  async generateResponse(params: GenerationParams): Promise<GenerationResponse> {
    try {
      console.log('[OpenAI] Generating response for model:', params.model);
      console.log('[OpenAI] Temperature:', params.temperature);
      console.log('[OpenAI] Max tokens:', params.maxTokens);

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: params.model,
          messages: [
            ...(params.systemPrompt ? [{ role: 'system', content: params.systemPrompt }] : []),
            { role: 'user', content: params.prompt },
          ],
          temperature: params.temperature ?? 0.7,
          max_tokens: params.maxTokens ?? 1000,
          top_p: params.topP ?? 1,
          frequency_penalty: params.frequencyPenalty ?? 0,
          presence_penalty: params.presencePenalty ?? 0,
        }),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: { message: await response.text() } };
        }

        console.error('[OpenAI] API Error Response:', errorData);
        
        // Extract error message from OpenAI response format
        const errorMessage = errorData.error?.message || errorData.message || JSON.stringify(errorData);
        
        // Check for specific error types
        if (response.status === 401) {
          throw new Error('Invalid OpenAI API key');
        } else if (response.status === 429 || errorMessage.includes('rate_limit')) {
          throw new Error('OpenAI rate limit exceeded. Please wait a moment and try again.');
        } else if (errorMessage.includes('quota') || errorMessage.includes('insufficient_quota')) {
          throw new Error('OpenAI quota exceeded. Please check your API key billing at https://platform.openai.com/account/billing');
        } else if (errorMessage.includes('model_not_found')) {
          throw new Error(`Model ${params.model} not found or not accessible with your API key`);
        } else {
          throw new Error(errorMessage);
        }
      }

      const data = await response.json();
      
      return {
        content: data.choices[0]?.message?.content || '',
        model: params.model,
        usage: data.usage ? {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        } : undefined,
        finishReason: data.choices[0]?.finish_reason || 'completed',
      };
    } catch (error: any) {
      console.error('[OpenAI] Generation failed:', error);
      
      // Return the error message as-is since we've already formatted it nicely above
      return {
        content: '',
        model: params.model,
        error: error.message || 'Failed to generate response with OpenAI',
      };
    }
  }
}

export default OpenAIProvider; 