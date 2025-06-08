import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProvider, GenerationParams, GenerationResponse } from '../types';
import { SUPPORTED_MODELS } from '../generated-models';

export class GoogleAIProvider implements AIProvider {
  private client: GoogleGenerativeAI;
  public name = 'Google Gemini';
  public models: string[] = []; // Will be populated dynamically

  constructor() {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY environment variable is required');
    }
    this.client = new GoogleGenerativeAI(apiKey);
    
    // Populate models from SUPPORTED_MODELS
    this.models = SUPPORTED_MODELS
      .filter(model => model.provider === 'google')
      .map(model => model.id);
  }

  async generateResponse(params: GenerationParams): Promise<GenerationResponse> {
    try {
      // Map our model names to Google's API model names
      const modelMapping: Record<string, string> = {
        'gemini-1.5-flash-latest': 'gemini-1.5-flash',
        'gemini-1.5-pro-latest': 'gemini-1.5-pro',
        'gemini-pro-latest': 'gemini-pro',
      };
      
      const actualModelName = modelMapping[params.model] || params.model;
      const model = this.client.getGenerativeModel({ 
        model: actualModelName
      });

      // Prepare the generation config
      const generationConfig = {
        temperature: params.temperature ?? 0.7,
        topP: params.topP ?? 0.8,
        maxOutputTokens: params.maxTokens ?? 1024,
      };

      // Build the prompt parts
      const parts = [];
      
      if (params.systemPrompt) {
        parts.push(`System: ${params.systemPrompt}\n\n`);
      }
      
      parts.push(`Human: ${params.prompt}`);
      
      const prompt = parts.join('');

      console.log('[Google AI] Generating response for model:', params.model);
      console.log('[Google AI] Config:', generationConfig);

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
      });

      const response = await result.response;
      const text = response.text();

      // Extract usage information if available
      const usage = response.usageMetadata ? {
        promptTokens: response.usageMetadata.promptTokenCount,
        completionTokens: response.usageMetadata.candidatesTokenCount,
        totalTokens: response.usageMetadata.totalTokenCount,
      } : undefined;

      return {
        content: text,
        model: params.model,
        usage,
        finishReason: response.candidates?.[0]?.finishReason || 'completed',
      };

    } catch (error: any) {
      console.error('[Google AI] Generation failed:', error);
      
      // Handle specific Google AI errors
      let errorMessage = 'Failed to generate response with Google AI';
      
      if (error.message?.includes('API_KEY')) {
        errorMessage = 'Invalid Google AI API key';
      } else if (error.message?.includes('QUOTA')) {
        errorMessage = 'Google AI quota exceeded';
      } else if (error.message?.includes('SAFETY')) {
        errorMessage = 'Content blocked by Google AI safety filters';
      } else if (error.message) {
        errorMessage = `Google AI error: ${error.message}`;
      }

      return {
        content: '',
        model: params.model,
        error: errorMessage,
      };
    }
  }
} 