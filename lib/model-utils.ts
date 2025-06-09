/**
 * Model name utilities
 */

/**
 * Convert model IDs to human-readable names
 */
export function getHumanReadableModelName(modelId: string): string {
  const modelNameMap: Record<string, string> = {
    // Anthropic models
    'claude-3-opus-20240229': 'Claude 3 Opus',
    'claude-3-5-sonnet-20241022': 'Claude 3.5 Sonnet',
    'claude-3-5-sonnet-20240620': 'Claude 3.5 Sonnet (June)',
    'claude-3-7-sonnet-20250219': 'Claude 3.7 Sonnet',
    'claude-3-sonnet-20240229': 'Claude 3 Sonnet',
    'claude-3-haiku-20240307': 'Claude 3 Haiku',
    'claude-3-5-haiku-20241022': 'Claude 3.5 Haiku',
    'claude-2': 'Claude 2',
    'claude-2.0': 'Claude 2.0',
    'claude-2.1': 'Claude 2.1',
    'claude-instant-1': 'Claude Instant 1',
    'claude-instant-1.2': 'Claude Instant 1.2',
    
    // OpenAI models
    'gpt-4-turbo': 'GPT-4 Turbo',
    'gpt-4-turbo-2024-04-09': 'GPT-4 Turbo (April)',
    'gpt-4-turbo-preview': 'GPT-4 Turbo Preview',
    'gpt-4': 'GPT-4',
    'gpt-4-0125-preview': 'GPT-4 Preview',
    'gpt-4-1106-preview': 'GPT-4 Preview (Nov)',
    'gpt-4-32k': 'GPT-4 32K',
    'gpt-4o': 'GPT-4o',
    'gpt-4o-2024-05-13': 'GPT-4o (May)',
    'gpt-4o-2024-08-06': 'GPT-4o (August)',
    'gpt-4o-mini': 'GPT-4o Mini',
    'gpt-4o-mini-2024-07-18': 'GPT-4o Mini (July)',
    'gpt-3.5-turbo': 'GPT-3.5 Turbo',
    'gpt-3.5-turbo-0125': 'GPT-3.5 Turbo 0125',
    'gpt-3.5-turbo-1106': 'GPT-3.5 Turbo 1106',
    'gpt-3.5-turbo-16k': 'GPT-3.5 Turbo 16K',
    
    // Google models
    'gemini-1.5-pro': 'Gemini 1.5 Pro',
    'gemini-1.5-pro-latest': 'Gemini 1.5 Pro Latest',
    'gemini-1.5-pro-exp-0801': 'Gemini 1.5 Pro Exp',
    'gemini-1.5-flash': 'Gemini 1.5 Flash',
    'gemini-1.5-flash-latest': 'Gemini 1.5 Flash Latest',
    'gemini-1.5-flash-002': 'Gemini 1.5 Flash 002',
    'gemini-1.5-flash-8b': 'Gemini 1.5 Flash 8B',
    'gemini-pro': 'Gemini Pro',
    'gemini-pro-vision': 'Gemini Pro Vision',
    'gemini-ultra': 'Gemini Ultra',
    'gemini-2.0-flash-exp': 'Gemini 2.0 Flash Experimental',
    
    // Mistral models
    'mistral-tiny': 'Mistral Tiny',
    'mistral-small': 'Mistral Small',
    'mistral-medium': 'Mistral Medium',
    'mistral-large-latest': 'Mistral Large Latest',
    'mistral-large-2407': 'Mistral Large (July)',
    'open-mistral-7b': 'Mistral 7B',
    'open-mixtral-8x7b': 'Mixtral 8x7B',
    'open-mixtral-8x22b': 'Mixtral 8x22B',
    'codestral-latest': 'Codestral Latest',
    'mistral-embed': 'Mistral Embed',
    
    // xAI models
    'grok-beta': 'Grok Beta',
    'grok-2-1212': 'Grok 2 (Dec 2024)',
    'grok-2-vision-1212': 'Grok 2 Vision (Dec 2024)',
    
    // Add more models as needed
  }
  
  // Return mapped name or format the ID if not found
  return modelNameMap[modelId] || formatModelId(modelId)
}

/**
 * Format model ID to be more readable if no mapping exists
 */
function formatModelId(modelId: string): string {
  return modelId
    .split('-')
    .map(part => {
      // Keep version numbers as is
      if (/^\d/.test(part)) return part
      // Capitalize first letter of words
      return part.charAt(0).toUpperCase() + part.slice(1)
    })
    .join(' ')
}

/**
 * Get provider name from various formats
 */
export function getProviderDisplayName(provider: string): string {
  const providerMap: Record<string, string> = {
    'anthropic': 'Anthropic',
    'openai': 'OpenAI',
    'google': 'Google',
    'mistral': 'Mistral AI',
    'xai': 'xAI',
    'azure': 'Azure OpenAI',
    'openrouter': 'OpenRouter',
    'ollama': 'Ollama',
    'together': 'Together AI',
    'deepseek': 'DeepSeek',
    'perplexity': 'Perplexity',
    'groq': 'Groq',
    'replicate': 'Replicate',
    'cohere': 'Cohere',
    'ai21': 'AI21 Labs',
    'huggingface': 'Hugging Face',
    'cloudflare': 'Cloudflare',
    'baseten': 'Baseten',
    'fireworks': 'Fireworks AI',
    'anyscale': 'Anyscale',
    'deepinfra': 'DeepInfra',
    'voyage': 'Voyage AI',
    'databricks': 'Databricks',
    'together-ai': 'Together AI',
    'aleph-alpha': 'Aleph Alpha',
    'nlp-cloud': 'NLP Cloud',
  }
  
  return providerMap[provider.toLowerCase()] || provider.charAt(0).toUpperCase() + provider.slice(1)
}

/**
 * Format model and provider for display
 */
export function formatModelDisplay(provider: string, modelId: string): string {
  const providerName = getProviderDisplayName(provider)
  const modelName = getHumanReadableModelName(modelId)
  return `${providerName} - ${modelName}`
} 