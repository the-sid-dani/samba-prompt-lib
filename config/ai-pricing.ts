// AI Model Pricing Configuration
// Prices are in USD per 1000 tokens

export interface ModelPricing {
  inputCostPer1000: number
  outputCostPer1000: number
  provider: string
  modelFamily: string
}

export interface ProviderPricing {
  [modelName: string]: ModelPricing
}

// Pricing data as of January 2025
// Note: These prices should be updated regularly as providers change their pricing
export const AI_MODEL_PRICING: Record<string, ProviderPricing> = {
  anthropic: {
    'claude-3-5-sonnet-20241022': {
      inputCostPer1000: 3.0,
      outputCostPer1000: 15.0,
      provider: 'anthropic',
      modelFamily: 'claude-3.5'
    },
    'claude-3-5-haiku-20241022': {
      inputCostPer1000: 1.0,
      outputCostPer1000: 5.0,
      provider: 'anthropic',
      modelFamily: 'claude-3.5'
    },
    'claude-3-opus-20240229': {
      inputCostPer1000: 15.0,
      outputCostPer1000: 75.0,
      provider: 'anthropic',
      modelFamily: 'claude-3'
    },
    'claude-3-sonnet-20240229': {
      inputCostPer1000: 3.0,
      outputCostPer1000: 15.0,
      provider: 'anthropic',
      modelFamily: 'claude-3'
    },
    'claude-3-haiku-20240307': {
      inputCostPer1000: 0.25,
      outputCostPer1000: 1.25,
      provider: 'anthropic',
      modelFamily: 'claude-3'
    }
  },
  
  google: {
    'gemini-1.5-pro': {
      inputCostPer1000: 1.25,
      outputCostPer1000: 5.0,
      provider: 'google',
      modelFamily: 'gemini-1.5'
    },
    'gemini-1.5-flash': {
      inputCostPer1000: 0.075,
      outputCostPer1000: 0.3,
      provider: 'google',
      modelFamily: 'gemini-1.5'
    },
    'gemini-1.0-pro': {
      inputCostPer1000: 0.5,
      outputCostPer1000: 1.5,
      provider: 'google',
      modelFamily: 'gemini-1.0'
    }
  },

  openai: {
    'gpt-4o': {
      inputCostPer1000: 2.5,
      outputCostPer1000: 10.0,
      provider: 'openai',
      modelFamily: 'gpt-4'
    },
    'gpt-4o-mini': {
      inputCostPer1000: 0.15,
      outputCostPer1000: 0.6,
      provider: 'openai',
      modelFamily: 'gpt-4'
    },
    'gpt-4-turbo': {
      inputCostPer1000: 10.0,
      outputCostPer1000: 30.0,
      provider: 'openai',
      modelFamily: 'gpt-4'
    },
    'gpt-3.5-turbo': {
      inputCostPer1000: 0.5,
      outputCostPer1000: 1.5,
      provider: 'openai',
      modelFamily: 'gpt-3.5'
    }
  },

  // OpenRouter models (sample pricing - these vary frequently)
  openrouter: {
    'meta-llama/llama-3.1-405b-instruct': {
      inputCostPer1000: 5.0,
      outputCostPer1000: 5.0,
      provider: 'openrouter',
      modelFamily: 'llama-3.1'
    },
    'meta-llama/llama-3.1-70b-instruct': {
      inputCostPer1000: 0.9,
      outputCostPer1000: 0.9,
      provider: 'openrouter',
      modelFamily: 'llama-3.1'
    },
    'meta-llama/llama-3.1-8b-instruct': {
      inputCostPer1000: 0.18,
      outputCostPer1000: 0.18,
      provider: 'openrouter',
      modelFamily: 'llama-3.1'
    },
    'anthropic/claude-3.5-sonnet': {
      inputCostPer1000: 3.0,
      outputCostPer1000: 15.0,
      provider: 'openrouter',
      modelFamily: 'claude-3.5'
    },
    'google/gemini-pro-1.5': {
      inputCostPer1000: 1.25,
      outputCostPer1000: 5.0,
      provider: 'openrouter',
      modelFamily: 'gemini-1.5'
    },
    'openai/gpt-4o': {
      inputCostPer1000: 2.5,
      outputCostPer1000: 10.0,
      provider: 'openrouter',
      modelFamily: 'gpt-4'
    }
  }
}

// Default pricing for unknown models
export const DEFAULT_PRICING: ModelPricing = {
  inputCostPer1000: 1.0,
  outputCostPer1000: 3.0,
  provider: 'unknown',
  modelFamily: 'unknown'
}

/**
 * Get pricing information for a specific model
 */
export function getModelPricing(provider: string, model: string): ModelPricing {
  const providerPricing = AI_MODEL_PRICING[provider.toLowerCase()]
  if (!providerPricing) {
    console.warn(`No pricing data found for provider: ${provider}`)
    return DEFAULT_PRICING
  }

  const modelPricing = providerPricing[model]
  if (!modelPricing) {
    console.warn(`No pricing data found for model: ${model} from provider: ${provider}`)
    return DEFAULT_PRICING
  }

  return modelPricing
}

/**
 * Get all available providers
 */
export function getAvailableProviders(): string[] {
  return Object.keys(AI_MODEL_PRICING)
}

/**
 * Get all models for a specific provider
 */
export function getProviderModels(provider: string): string[] {
  const providerPricing = AI_MODEL_PRICING[provider.toLowerCase()]
  return providerPricing ? Object.keys(providerPricing) : []
}

/**
 * Check if a model has pricing data
 */
export function hasModelPricing(provider: string, model: string): boolean {
  const providerPricing = AI_MODEL_PRICING[provider.toLowerCase()]
  return !!(providerPricing && providerPricing[model])
} 