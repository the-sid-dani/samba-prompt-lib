export interface AIProvider {
  name: string;
  models: string[];
  generateResponse(params: GenerationParams): Promise<GenerationResponse>;
}

export interface GenerationParams {
  model: string;
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stream?: boolean;
}

export interface GenerationResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  finishReason?: string;
  error?: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  maxTokens: number;
  supportsStreaming: boolean;
  category?: string;
  isLatest?: boolean;
  isExperimental?: boolean;
  description?: string;
}

export interface ModelPreferences {
  enabledModels: Set<string>;
  showExperimental: boolean;
  showDeprecated: boolean;
  groupByProvider: boolean;
}

export const DEFAULT_MODEL_PREFERENCES: ModelPreferences = {
  enabledModels: new Set([
    // Latest Anthropic models (Claude 4.x series)
    'claude-opus-4-20250514',
    'claude-sonnet-4-20250514',
    'claude-3-7-sonnet-20250219',
    // Production Anthropic models
    'claude-3-5-sonnet-20241022',
    'claude-3-5-haiku-20241022',
    // Latest Google models (2.5 experimental + 2.0 GA)
    'gemini-2.5-pro-preview-06-05',
    'gemini-2.5-flash-preview-05-20',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    // Production Google models
    'gemini-1.5-pro-002',
    'gemini-1.5-flash-002',
    // Latest OpenAI models
    'gpt-4.1',
    'gpt-4.1-2025-04-14',
    'gpt-4.1-mini',
    'gpt-4.1-mini-2025-04-14',
    'gpt-4.5-preview',
    'gpt-4.5-preview-2025-02-27',
    'gpt-4o',
    'gpt-4o-mini',
    'gpt-4-turbo',
    'o1-preview',
    'o1-mini',
    'o3-mini',
    'gpt-4o-mini-search-preview',
    // Popular open source models
    'deepseek-v3-base:free',
    'llama-3.1-70b-instruct',
    'qwen-2.5-72b-instruct:free'
  ]),
  showExperimental: true,
  showDeprecated: false,
  groupByProvider: true,
};

// SUPPORTED_MODELS is now exported from ./generated-models.ts
// This file now only contains interfaces and types