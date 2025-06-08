// ⚠️  AUTO-GENERATED — DO NOT EDIT.
// Last refresh: 2025-01-09T02:45:00.000Z (Updated with latest Claude 4.x and Gemini 2.5 models)
// Total models: 34
// Sources: Anthropic API, Google Gemini API, OpenRouter API

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  maxTokens?: number;
  supportsStreaming?: boolean;
  category?: string;
  isLatest?: boolean;
  isExperimental?: boolean;
  description?: string;
}

export const SUPPORTED_MODELS: ModelInfo[] = [
  // Anthropic Claude Models - Latest 4.x Series
  {
    id: 'claude-opus-4-20250514',
    name: 'claude-opus-4-20250514',
    provider: 'anthropic',
    maxTokens: 200000,
    supportsStreaming: true,
    category: 'Latest',
    isLatest: true,
    description: 'Claude 4 Opus - Highest reasoning and tool-use power (Flagship)'
  },
  {
    id: 'claude-sonnet-4-20250514',
    name: 'claude-sonnet-4-20250514',
    provider: 'anthropic',
    maxTokens: 200000,
    supportsStreaming: true,
    category: 'Latest',
    isLatest: true,
    description: 'Claude 4 Sonnet - Nearly Opus-level IQ, lower latency (High-performance)'
  },
  {
    id: 'claude-3-7-sonnet-20250219',
    name: 'claude-3-7-sonnet-20250219',
    provider: 'anthropic',
    maxTokens: 200000,
    supportsStreaming: true,
    category: 'Latest',
    isLatest: true,
    description: 'Claude 3.7 Sonnet - Bridge model when migrating to 4.x (Advanced)'
  },

  // Anthropic Claude Models - 3.5 Series (Production)
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'claude-3-5-sonnet-20241022',
    provider: 'anthropic',
    maxTokens: 200000,
    supportsStreaming: true,
    category: 'Production',
    description: 'Claude 3.5 Sonnet - Best cost-to-quality in 3.x line (Mainstream)'
  },
  {
    id: 'claude-3-5-haiku-20241022',
    name: 'claude-3-5-haiku-20241022',
    provider: 'anthropic',
    maxTokens: 200000,
    supportsStreaming: true,
    category: 'Production',
    description: 'Claude 3.5 Haiku - Ultra-low latency workloads (Fastest 3.x)'
  },

  // Anthropic Claude Models - Legacy 3.x Series
  {
    id: 'claude-3-opus-20240229',
    name: 'claude-3-opus-20240229',
    provider: 'anthropic',
    maxTokens: 200000,
    supportsStreaming: true,
    category: 'Legacy',
    description: 'Claude 3 Opus - Still strong on writing tasks (Legacy premium)'
  },
  {
    id: 'claude-3-sonnet-20240229',
    name: 'claude-3-sonnet-20240229',
    provider: 'anthropic',
    maxTokens: 200000,
    supportsStreaming: true,
    category: 'Legacy',
    description: 'Claude 3 Sonnet - Good default if 3.5/4 series unavailable (Legacy balanced)'
  },
  {
    id: 'claude-3-haiku-20240307',
    name: 'claude-3-haiku-20240307',
    provider: 'anthropic',
    maxTokens: 200000,
    supportsStreaming: true,
    category: 'Legacy',
    description: 'Claude 3 Haiku - Cheapest Claude for lightweight tasks (Legacy speed)'
  },

  // Google Gemini Models - 2.5 Series (Experimental Preview)
  {
    id: 'gemini-2.5-pro-preview-06-05',
    name: 'gemini-2.5-pro-preview-06-05',
    provider: 'google',
    maxTokens: 2097152,
    supportsStreaming: true,
    category: 'Experimental',
    isExperimental: true,
    isLatest: true,
    description: 'Gemini 2.5 Pro - Top reasoning, thinking budget control (Flagship preview)'
  },
  {
    id: 'gemini-2.5-flash-preview-05-20',
    name: 'gemini-2.5-flash-preview-05-20',
    provider: 'google',
    maxTokens: 1048576,
    supportsStreaming: true,
    category: 'Experimental',
    isExperimental: true,
    isLatest: true,
    description: 'Gemini 2.5 Flash - Same tokenizer as 2.5 Pro, tuned for speed (Fast preview)'
  },

  // Google Gemini Models - 2.0 Series (Latest GA)
  {
    id: 'gemini-2.0-flash',
    name: 'gemini-2.0-flash',
    provider: 'google',
    maxTokens: 1048576,
    supportsStreaming: true,
    category: 'Latest',
    isLatest: true,
    description: 'Gemini 2.0 Flash - Real-time streaming, long-context vision (Next-gen balanced)'
  },
  {
    id: 'gemini-2.0-flash-lite',
    name: 'gemini-2.0-flash-lite',
    provider: 'google',
    maxTokens: 1048576,
    supportsStreaming: true,
    category: 'Latest',
    isLatest: true,
    description: 'Gemini 2.0 Flash Lite - Sub-second responses, lowest cost (Next-gen ultra-cheap)'
  },

  // Google Gemini Models - 1.5 Series (Production Stable)
  {
    id: 'gemini-1.5-pro-002',
    name: 'gemini-1.5-pro-002',
    provider: 'google',
    maxTokens: 2097152,
    supportsStreaming: true,
    category: 'Production',
    description: 'Gemini 1.5 Pro - 2M token context, full multimodal (Stable flagship)'
  },
  {
    id: 'gemini-1.5-flash-002',
    name: 'gemini-1.5-flash-002',
    provider: 'google',
    maxTokens: 1048576,
    supportsStreaming: true,
    category: 'Production',
    description: 'Gemini 1.5 Flash - Best price-performance prior to 2.x (Stable fast)'
  },
  {
    id: 'gemini-1.5-flash-8b-001',
    name: 'gemini-1.5-flash-8b-001',
    provider: 'google',
    maxTokens: 1048576,
    supportsStreaming: true,
    category: 'Production',
    description: 'Gemini 1.5 Flash 8B - 8-billion-param variant for massive scale (Tiny fast)'
  },

  // Google Gemini Models - Legacy 1.0 Series
  {
    id: 'gemini-pro-latest',
    name: 'gemini-pro-latest',
    provider: 'google',
    maxTokens: 30720,
    supportsStreaming: true,
    category: 'Legacy',
    description: 'Gemini Pro - Original 1.0 model, back-compat (Legacy pro)'
  },

  // OpenAI & OpenRouter Models
  {
    id: 'o1-preview',
    name: 'o1-preview',
    provider: 'openrouter',
    maxTokens: 128000,
    supportsStreaming: true,
    category: 'Latest',
    isLatest: true,
    description: 'OpenAI o1 - Advanced reasoning model'
  },
  {
    id: 'o1-mini',
    name: 'o1-mini',
    provider: 'openrouter',
    maxTokens: 128000,
    supportsStreaming: true,
    category: 'Latest',
    isLatest: true,
    description: 'OpenAI o1 mini - Faster reasoning model'
  },
  {
    id: 'gpt-4o-mini-search-preview',
    name: 'gpt-4o-mini-search-preview',
    provider: 'openrouter',
    maxTokens: 128000,
    supportsStreaming: true,
    category: 'Production',
    description: 'GPT-4o mini with search capabilities'
  },
  {
    id: 'gpt-4-turbo',
    name: 'gpt-4-turbo',
    provider: 'openrouter',
    maxTokens: 128000,
    supportsStreaming: true,
    category: 'Production',
    description: 'GPT-4 Turbo - Fast and capable'
  },

  // DeepSeek Models
  {
    id: 'deepseek-v3-base:free',
    name: 'deepseek-v3-base:free',
    provider: 'openrouter',
    maxTokens: 163840,
    supportsStreaming: true,
    category: 'Open Source',
    isLatest: true,
    description: 'DeepSeek V3 - Free high-performance model'
  },
  {
    id: 'deepseek-r1-distill-qwen-7b',
    name: 'deepseek-r1-distill-qwen-7b',
    provider: 'openrouter',
    maxTokens: 131072,
    supportsStreaming: true,
    category: 'Open Source',
    description: 'DeepSeek R1 - Reasoning-focused model'
  },

  // Meta Llama Models
  {
    id: 'llama-3.1-405b-instruct',
    name: 'llama-3.1-405b-instruct',
    provider: 'openrouter',
    maxTokens: 32768,
    supportsStreaming: true,
    category: 'Open Source',
    description: 'Meta Llama 3.1 405B - Largest open model'
  },
  {
    id: 'llama-3.1-70b-instruct',
    name: 'llama-3.1-70b-instruct',
    provider: 'openrouter',
    maxTokens: 131072,
    supportsStreaming: true,
    category: 'Open Source',
    description: 'Meta Llama 3.1 70B - Balanced open model'
  },

  // Google Open Source Models
  {
    id: 'gemma-2-27b-it',
    name: 'gemma-2-27b-it',
    provider: 'openrouter',
    maxTokens: 8192,
    supportsStreaming: true,
    category: 'Open Source',
    description: 'Google Gemma 2 27B - Open instruction-tuned'
  },
  {
    id: 'gemma-2-9b-it:free',
    name: 'gemma-2-9b-it:free',
    provider: 'openrouter',
    maxTokens: 8192,
    supportsStreaming: true,
    category: 'Open Source',
    description: 'Google Gemma 2 9B - Free lightweight model'
  },

  // Alibaba Models
  {
    id: 'qwen-2.5-72b-instruct:free',
    name: 'qwen-2.5-72b-instruct:free',
    provider: 'openrouter',
    maxTokens: 32768,
    supportsStreaming: true,
    category: 'Open Source',
    description: 'Alibaba Qwen 2.5 72B - Free multilingual model'
  },
  {
    id: 'qwq-32b-preview',
    name: 'qwq-32b-preview',
    provider: 'openrouter',
    maxTokens: 32768,
    supportsStreaming: true,
    category: 'Open Source',
    description: 'Alibaba QwQ - Reasoning specialist'
  },

  // Mistral Models
  {
    id: 'mistral-large-2411',
    name: 'mistral-large-2411',
    provider: 'openrouter',
    maxTokens: 131072,
    supportsStreaming: true,
    category: 'Production',
    description: 'Mistral Large - European flagship model'
  },
  {
    id: 'mixtral-8x7b-instruct',
    name: 'mixtral-8x7b-instruct',
    provider: 'openrouter',
    maxTokens: 32768,
    supportsStreaming: true,
    category: 'Open Source',
    description: 'Mistral Mixtral 8x7B - Mixture of experts'
  },

  // Other Models
  {
    id: 'hermes-3-llama-3.1-405b',
    name: 'hermes-3-llama-3.1-405b',
    provider: 'openrouter',
    maxTokens: 131072,
    supportsStreaming: true,
    category: 'Open Source',
    description: 'Hermes 3 - Fine-tuned Llama for dialogue'
  }
];

export default SUPPORTED_MODELS; 