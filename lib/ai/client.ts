import { GoogleAIProvider } from './providers/google';
import { AnthropicAIProvider } from './providers/anthropic';
import { OpenRouterAIProvider } from './providers/openrouter';
import { OpenAIProvider } from './providers/openai';
import { AIProvider, GenerationParams, GenerationResponse } from './types';
import { SUPPORTED_MODELS, ModelInfo } from './generated-models';

export class AIClient {
  private providers: Map<string, string> = new Map();
  private providerInstances: Map<string, AIProvider> = new Map();

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // Map models to their providers
    SUPPORTED_MODELS.forEach(model => {
      this.providers.set(model.id, model.provider);
    });

    console.log('[AI Client] Initialized with models:', Array.from(this.providers.keys()));
  }

  private getProvider(providerName: string): AIProvider {
    // Return cached instance if it exists
    if (this.providerInstances.has(providerName)) {
      return this.providerInstances.get(providerName)!;
    }

    // Create new provider instance
    let provider: AIProvider;
    
    switch (providerName) {
      case 'google':
        provider = new GoogleAIProvider();
        break;
      case 'anthropic':
        provider = new AnthropicAIProvider();
        break;
      case 'openai':
        provider = new OpenAIProvider();
        break;
      case 'openrouter':
        provider = new OpenRouterAIProvider();
        break;
      default:
        throw new Error(`Unknown provider: ${providerName}`);
    }

    // Cache the instance
    this.providerInstances.set(providerName, provider);
    return provider;
  }

  async generateResponse(params: GenerationParams): Promise<GenerationResponse> {
    const providerName = this.providers.get(params.model);
    
    if (!providerName) {
      return {
        content: '',
        model: params.model,
        error: `Model ${params.model} is not supported`,
      };
    }

    try {
      const provider = this.getProvider(providerName);
      
      console.log(`[AI Client] Routing model ${params.model} to provider ${providerName}`);
      
      const response = await provider.generateResponse(params);
      
      // Log usage for monitoring
      if (response.usage) {
        console.log(`[AI Client] Usage for ${params.model}:`, response.usage);
      }
      
      return response;
      
    } catch (error: any) {
      console.error(`[AI Client] Provider ${providerName} failed:`, error);
      
      // Handle provider initialization errors
      if (error.message?.includes('environment variable')) {
        return {
          content: '',
          model: params.model,
          error: `${providerName} API key not configured`,
        };
      }
      
      return {
        content: '',
        model: params.model,
        error: `Provider ${providerName} is temporarily unavailable`,
      };
    }
  }

  /**
   * Get all supported models with their metadata
   */
  getSupportedModels(): ModelInfo[] {
    return SUPPORTED_MODELS;
  }

  /**
   * Get models for a specific provider
   */
  getModelsByProvider(providerName: string): ModelInfo[] {
    return SUPPORTED_MODELS.filter(model => model.provider === providerName);
  }

  /**
   * Check if a model is supported
   */
  isModelSupported(modelId: string): boolean {
    return this.providers.has(modelId);
  }

  /**
   * Get model information
   */
  getModelInfo(modelId: string): ModelInfo | undefined {
    return SUPPORTED_MODELS.find(model => model.id === modelId);
  }

  /**
   * Get the provider name for a given model
   */
  getProviderForModel(modelId: string): string {
    return this.providers.get(modelId) || 'unknown';
  }

  /**
   * Validate generation parameters
   */
  validateParams(params: GenerationParams): { valid: boolean; error?: string } {
    if (!params.model) {
      return { valid: false, error: 'Model is required' };
    }

    if (!this.isModelSupported(params.model)) {
      return { valid: false, error: `Model ${params.model} is not supported` };
    }

    if (!params.prompt || params.prompt.trim().length === 0) {
      return { valid: false, error: 'Prompt is required' };
    }

    if (params.prompt.length > 50000) {
      return { valid: false, error: 'Prompt is too long (max 50,000 characters)' };
    }

    const modelInfo = this.getModelInfo(params.model);
    if (modelInfo && params.maxTokens && modelInfo.maxTokens && params.maxTokens > modelInfo.maxTokens) {
      return { 
        valid: false, 
        error: `Max tokens (${params.maxTokens}) exceeds model limit (${modelInfo.maxTokens})` 
      };
    }

    if (params.temperature !== undefined && (params.temperature < 0 || params.temperature > 2)) {
      return { valid: false, error: 'Temperature must be between 0 and 2' };
    }

    if (params.topP !== undefined && (params.topP < 0 || params.topP > 1)) {
      return { valid: false, error: 'Top-p must be between 0 and 1' };
    }

    return { valid: true };
  }
}

// Export a singleton instance
export const aiClient = new AIClient(); 