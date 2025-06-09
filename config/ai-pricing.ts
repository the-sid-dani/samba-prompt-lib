// AI Model Pricing Configuration
// Auto-generated from LiteLLM on 2025-06-09T06:01:17.821Z
// Source: https://raw.githubusercontent.com/BerriAI/litellm/main/model_prices_and_context_window.json
// Prices are in USD per 1000 tokens

export interface ModelPricing {
  inputCostPer1000: number
  outputCostPer1000: number
  provider: string
  modelFamily: string
  maxTokens?: number | null
  maxInputTokens?: number | null
  maxOutputTokens?: number | null
  mode?: string
}

export interface ProviderPricing {
  [modelName: string]: ModelPricing
}

// Live pricing data from LiteLLM (2025-06-09T06:01:17.821Z)
export const AI_MODEL_PRICING: Record<string, ProviderPricing> = {
  "openai": {
    "gpt-4": {
      "inputCostPer1000": 0.03,
      "outputCostPer1000": 0.06,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 8192,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "gpt-4.1": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.008,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 32768,
      "maxInputTokens": 1047576,
      "maxOutputTokens": 32768,
      "mode": "chat"
    },
    "gpt-4.1-2025-04-14": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.008,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 32768,
      "maxInputTokens": 1047576,
      "maxOutputTokens": 32768,
      "mode": "chat"
    },
    "gpt-4.1-mini": {
      "inputCostPer1000": 0.0004,
      "outputCostPer1000": 0.0016,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 32768,
      "maxInputTokens": 1047576,
      "maxOutputTokens": 32768,
      "mode": "chat"
    },
    "gpt-4.1-mini-2025-04-14": {
      "inputCostPer1000": 0.0004,
      "outputCostPer1000": 0.0016,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 32768,
      "maxInputTokens": 1047576,
      "maxOutputTokens": 32768,
      "mode": "chat"
    },
    "gpt-4.1-nano": {
      "inputCostPer1000": 0.0001,
      "outputCostPer1000": 0.0004,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 32768,
      "maxInputTokens": 1047576,
      "maxOutputTokens": 32768,
      "mode": "chat"
    },
    "gpt-4.1-nano-2025-04-14": {
      "inputCostPer1000": 0.0001,
      "outputCostPer1000": 0.0004,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 32768,
      "maxInputTokens": 1047576,
      "maxOutputTokens": 32768,
      "mode": "chat"
    },
    "gpt-4o": {
      "inputCostPer1000": 0.0025,
      "outputCostPer1000": 0.01,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "gpt-4o-search-preview-2025-03-11": {
      "inputCostPer1000": 0.0025,
      "outputCostPer1000": 0.01,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "gpt-4o-search-preview": {
      "inputCostPer1000": 0.0025,
      "outputCostPer1000": 0.01,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "gpt-4.5-preview": {
      "inputCostPer1000": 0.075,
      "outputCostPer1000": 0.15,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "gpt-4.5-preview-2025-02-27": {
      "inputCostPer1000": 0.075,
      "outputCostPer1000": 0.15,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "gpt-4o-audio-preview": {
      "inputCostPer1000": 0.0025,
      "outputCostPer1000": 0.01,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "gpt-4o-audio-preview-2024-12-17": {
      "inputCostPer1000": 0.0025,
      "outputCostPer1000": 0.01,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "gpt-4o-audio-preview-2024-10-01": {
      "inputCostPer1000": 0.0025,
      "outputCostPer1000": 0.01,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "gpt-4o-mini-audio-preview": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.0006,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "gpt-4o-mini-audio-preview-2024-12-17": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.0006,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "gpt-4o-mini": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.0006,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "gpt-4o-mini-search-preview-2025-03-11": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.0006,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "gpt-4o-mini-search-preview": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.0006,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "gpt-4o-mini-2024-07-18": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.0006,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "codex-mini-latest": {
      "inputCostPer1000": 0.0015,
      "outputCostPer1000": 0.006,
      "provider": "openai",
      "modelFamily": "unknown",
      "maxTokens": 100000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 100000,
      "mode": "responses"
    },
    "o1-pro": {
      "inputCostPer1000": 0.15,
      "outputCostPer1000": 0.6,
      "provider": "openai",
      "modelFamily": "unknown",
      "maxTokens": 100000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 100000,
      "mode": "responses"
    },
    "o1-pro-2025-03-19": {
      "inputCostPer1000": 0.15,
      "outputCostPer1000": 0.6,
      "provider": "openai",
      "modelFamily": "unknown",
      "maxTokens": 100000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 100000,
      "mode": "responses"
    },
    "o1": {
      "inputCostPer1000": 0.015,
      "outputCostPer1000": 0.06,
      "provider": "openai",
      "modelFamily": "unknown",
      "maxTokens": 100000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 100000,
      "mode": "chat"
    },
    "o1-mini": {
      "inputCostPer1000": 0.0011,
      "outputCostPer1000": 0.0044,
      "provider": "openai",
      "modelFamily": "unknown",
      "maxTokens": 65536,
      "maxInputTokens": 128000,
      "maxOutputTokens": 65536,
      "mode": "chat"
    },
    "o3": {
      "inputCostPer1000": 0.01,
      "outputCostPer1000": 0.04,
      "provider": "openai",
      "modelFamily": "unknown",
      "maxTokens": 100000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 100000,
      "mode": "chat"
    },
    "o3-2025-04-16": {
      "inputCostPer1000": 0.01,
      "outputCostPer1000": 0.04,
      "provider": "openai",
      "modelFamily": "unknown",
      "maxTokens": 100000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 100000,
      "mode": "chat"
    },
    "o3-mini": {
      "inputCostPer1000": 0.0011,
      "outputCostPer1000": 0.0044,
      "provider": "openai",
      "modelFamily": "unknown",
      "maxTokens": 100000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 100000,
      "mode": "chat"
    },
    "o3-mini-2025-01-31": {
      "inputCostPer1000": 0.0011,
      "outputCostPer1000": 0.0044,
      "provider": "openai",
      "modelFamily": "unknown",
      "maxTokens": 100000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 100000,
      "mode": "chat"
    },
    "o4-mini": {
      "inputCostPer1000": 0.0011,
      "outputCostPer1000": 0.0044,
      "provider": "openai",
      "modelFamily": "unknown",
      "maxTokens": 100000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 100000,
      "mode": "chat"
    },
    "o4-mini-2025-04-16": {
      "inputCostPer1000": 0.0011,
      "outputCostPer1000": 0.0044,
      "provider": "openai",
      "modelFamily": "unknown",
      "maxTokens": 100000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 100000,
      "mode": "chat"
    },
    "o1-mini-2024-09-12": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.012,
      "provider": "openai",
      "modelFamily": "unknown",
      "maxTokens": 65536,
      "maxInputTokens": 128000,
      "maxOutputTokens": 65536,
      "mode": "chat"
    },
    "o1-preview": {
      "inputCostPer1000": 0.015,
      "outputCostPer1000": 0.06,
      "provider": "openai",
      "modelFamily": "unknown",
      "maxTokens": 32768,
      "maxInputTokens": 128000,
      "maxOutputTokens": 32768,
      "mode": "chat"
    },
    "o1-preview-2024-09-12": {
      "inputCostPer1000": 0.015,
      "outputCostPer1000": 0.06,
      "provider": "openai",
      "modelFamily": "unknown",
      "maxTokens": 32768,
      "maxInputTokens": 128000,
      "maxOutputTokens": 32768,
      "mode": "chat"
    },
    "o1-2024-12-17": {
      "inputCostPer1000": 0.015,
      "outputCostPer1000": 0.06,
      "provider": "openai",
      "modelFamily": "unknown",
      "maxTokens": 100000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 100000,
      "mode": "chat"
    },
    "chatgpt-4o-latest": {
      "inputCostPer1000": 0.005,
      "outputCostPer1000": 0.015,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "gpt-4o-2024-05-13": {
      "inputCostPer1000": 0.005,
      "outputCostPer1000": 0.015,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "gpt-4o-2024-08-06": {
      "inputCostPer1000": 0.0025,
      "outputCostPer1000": 0.01,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "gpt-4o-2024-11-20": {
      "inputCostPer1000": 0.0025,
      "outputCostPer1000": 0.01,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "gpt-4o-realtime-preview-2024-10-01": {
      "inputCostPer1000": 0.005,
      "outputCostPer1000": 0.02,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "gpt-4o-realtime-preview": {
      "inputCostPer1000": 0.005,
      "outputCostPer1000": 0.02,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "gpt-4o-realtime-preview-2024-12-17": {
      "inputCostPer1000": 0.005,
      "outputCostPer1000": 0.02,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "gpt-4o-mini-realtime-preview": {
      "inputCostPer1000": 0.0006,
      "outputCostPer1000": 0.0024,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "gpt-4o-mini-realtime-preview-2024-12-17": {
      "inputCostPer1000": 0.0006,
      "outputCostPer1000": 0.0024,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "gpt-4-turbo-preview": {
      "inputCostPer1000": 0.01,
      "outputCostPer1000": 0.03,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "gpt-4-0314": {
      "inputCostPer1000": 0.03,
      "outputCostPer1000": 0.06,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 8192,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "gpt-4-0613": {
      "inputCostPer1000": 0.03,
      "outputCostPer1000": 0.06,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 8192,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "gpt-4-32k": {
      "inputCostPer1000": 0.06,
      "outputCostPer1000": 0.12,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 32768,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "gpt-4-32k-0314": {
      "inputCostPer1000": 0.06,
      "outputCostPer1000": 0.12,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 32768,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "gpt-4-32k-0613": {
      "inputCostPer1000": 0.06,
      "outputCostPer1000": 0.12,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 32768,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "gpt-4-turbo": {
      "inputCostPer1000": 0.01,
      "outputCostPer1000": 0.03,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "gpt-4-turbo-2024-04-09": {
      "inputCostPer1000": 0.01,
      "outputCostPer1000": 0.03,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "gpt-4-1106-preview": {
      "inputCostPer1000": 0.01,
      "outputCostPer1000": 0.03,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "gpt-4-0125-preview": {
      "inputCostPer1000": 0.01,
      "outputCostPer1000": 0.03,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "gpt-4-vision-preview": {
      "inputCostPer1000": 0.01,
      "outputCostPer1000": 0.03,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "gpt-4-1106-vision-preview": {
      "inputCostPer1000": 0.01,
      "outputCostPer1000": 0.03,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "gpt-3.5-turbo": {
      "inputCostPer1000": 0.0015,
      "outputCostPer1000": 0.002,
      "provider": "openai",
      "modelFamily": "gpt-3.5",
      "maxTokens": 4097,
      "maxInputTokens": 16385,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "gpt-3.5-turbo-0301": {
      "inputCostPer1000": 0.0015,
      "outputCostPer1000": 0.002,
      "provider": "openai",
      "modelFamily": "gpt-3.5",
      "maxTokens": 4097,
      "maxInputTokens": 4097,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "gpt-3.5-turbo-0613": {
      "inputCostPer1000": 0.0015,
      "outputCostPer1000": 0.002,
      "provider": "openai",
      "modelFamily": "gpt-3.5",
      "maxTokens": 4097,
      "maxInputTokens": 4097,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "gpt-3.5-turbo-1106": {
      "inputCostPer1000": 0.001,
      "outputCostPer1000": 0.002,
      "provider": "openai",
      "modelFamily": "gpt-3.5",
      "maxTokens": 16385,
      "maxInputTokens": 16385,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "gpt-3.5-turbo-0125": {
      "inputCostPer1000": 0.0005,
      "outputCostPer1000": 0.0015,
      "provider": "openai",
      "modelFamily": "gpt-3.5",
      "maxTokens": 16385,
      "maxInputTokens": 16385,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "gpt-3.5-turbo-16k": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.004,
      "provider": "openai",
      "modelFamily": "gpt-3.5",
      "maxTokens": 16385,
      "maxInputTokens": 16385,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "gpt-3.5-turbo-16k-0613": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.004,
      "provider": "openai",
      "modelFamily": "gpt-3.5",
      "maxTokens": 16385,
      "maxInputTokens": 16385,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "ft:gpt-3.5-turbo": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.006,
      "provider": "openai",
      "modelFamily": "gpt-3.5",
      "maxTokens": 4096,
      "maxInputTokens": 16385,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "ft:gpt-3.5-turbo-0125": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.006,
      "provider": "openai",
      "modelFamily": "gpt-3.5",
      "maxTokens": 4096,
      "maxInputTokens": 16385,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "ft:gpt-3.5-turbo-1106": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.006,
      "provider": "openai",
      "modelFamily": "gpt-3.5",
      "maxTokens": 4096,
      "maxInputTokens": 16385,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "ft:gpt-3.5-turbo-0613": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.006,
      "provider": "openai",
      "modelFamily": "gpt-3.5",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "ft:gpt-4-0613": {
      "inputCostPer1000": 0.03,
      "outputCostPer1000": 0.06,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 8192,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "ft:gpt-4o-2024-08-06": {
      "inputCostPer1000": 0.00375,
      "outputCostPer1000": 0.015,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "ft:gpt-4o-2024-11-20": {
      "inputCostPer1000": 0.00375,
      "outputCostPer1000": 0.015,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "ft:gpt-4o-mini-2024-07-18": {
      "inputCostPer1000": 0.0003,
      "outputCostPer1000": 0.0012,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "gpt-4o-transcribe": {
      "inputCostPer1000": 0.0025,
      "outputCostPer1000": 0.01,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": null,
      "maxInputTokens": 16000,
      "maxOutputTokens": 2000,
      "mode": "audio_transcription"
    },
    "gpt-4o-mini-transcribe": {
      "inputCostPer1000": 0.00125,
      "outputCostPer1000": 0.005,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": null,
      "maxInputTokens": 16000,
      "maxOutputTokens": 2000,
      "mode": "audio_transcription"
    },
    "gpt-4o-mini-tts": {
      "inputCostPer1000": 0.0025,
      "outputCostPer1000": 0.01,
      "provider": "openai",
      "modelFamily": "gpt-4",
      "maxTokens": null,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "audio_speech"
    }
  },
  "watsonx": {
    "watsonx/ibm/granite-3-8b-instruct": {
      "inputCostPer1000": 0.2,
      "outputCostPer1000": 0.2,
      "provider": "watsonx",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 1024,
      "mode": "chat"
    }
  },
  "azure": {
    "computer-use-preview": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.012,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 1024,
      "maxInputTokens": 8192,
      "maxOutputTokens": 1024,
      "mode": "chat"
    },
    "azure/gpt-4o-mini-tts": {
      "inputCostPer1000": 0.0025,
      "outputCostPer1000": 0.01,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": null,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "audio_speech"
    },
    "azure/computer-use-preview": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.012,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 1024,
      "maxInputTokens": 8192,
      "maxOutputTokens": 1024,
      "mode": "chat"
    },
    "azure/gpt-4o-audio-preview-2024-12-17": {
      "inputCostPer1000": 0.0025,
      "outputCostPer1000": 0.01,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "azure/gpt-4o-mini-audio-preview-2024-12-17": {
      "inputCostPer1000": 0.0025,
      "outputCostPer1000": 0.01,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "azure/gpt-4.1": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.008,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 32768,
      "maxInputTokens": 1047576,
      "maxOutputTokens": 32768,
      "mode": "chat"
    },
    "azure/gpt-4.1-2025-04-14": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.008,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 32768,
      "maxInputTokens": 1047576,
      "maxOutputTokens": 32768,
      "mode": "chat"
    },
    "azure/gpt-4.1-mini": {
      "inputCostPer1000": 0.0004,
      "outputCostPer1000": 0.0016,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 32768,
      "maxInputTokens": 1047576,
      "maxOutputTokens": 32768,
      "mode": "chat"
    },
    "azure/gpt-4.1-mini-2025-04-14": {
      "inputCostPer1000": 0.0004,
      "outputCostPer1000": 0.0016,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 32768,
      "maxInputTokens": 1047576,
      "maxOutputTokens": 32768,
      "mode": "chat"
    },
    "azure/gpt-4.1-nano": {
      "inputCostPer1000": 0.0001,
      "outputCostPer1000": 0.0004,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 32768,
      "maxInputTokens": 1047576,
      "maxOutputTokens": 32768,
      "mode": "chat"
    },
    "azure/gpt-4.1-nano-2025-04-14": {
      "inputCostPer1000": 0.0001,
      "outputCostPer1000": 0.0004,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 32768,
      "maxInputTokens": 1047576,
      "maxOutputTokens": 32768,
      "mode": "chat"
    },
    "azure/o3": {
      "inputCostPer1000": 0.01,
      "outputCostPer1000": 0.04,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 100000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 100000,
      "mode": "chat"
    },
    "azure/o3-2025-04-16": {
      "inputCostPer1000": 0.01,
      "outputCostPer1000": 0.04,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 100000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 100000,
      "mode": "chat"
    },
    "azure/o4-mini": {
      "inputCostPer1000": 0.0011,
      "outputCostPer1000": 0.0044,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 100000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 100000,
      "mode": "chat"
    },
    "azure/gpt-4o-mini-realtime-preview-2024-12-17": {
      "inputCostPer1000": 0.0006,
      "outputCostPer1000": 0.0024,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure/eu/gpt-4o-mini-realtime-preview-2024-12-17": {
      "inputCostPer1000": 0.00066,
      "outputCostPer1000": 0.00264,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure/us/gpt-4o-mini-realtime-preview-2024-12-17": {
      "inputCostPer1000": 0.00066,
      "outputCostPer1000": 0.00264,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure/gpt-4o-realtime-preview-2024-12-17": {
      "inputCostPer1000": 0.005,
      "outputCostPer1000": 0.02,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure/us/gpt-4o-realtime-preview-2024-12-17": {
      "inputCostPer1000": 0.0055,
      "outputCostPer1000": 0.022,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure/eu/gpt-4o-realtime-preview-2024-12-17": {
      "inputCostPer1000": 0.0055,
      "outputCostPer1000": 0.022,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure/gpt-4o-realtime-preview-2024-10-01": {
      "inputCostPer1000": 0.005,
      "outputCostPer1000": 0.02,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure/us/gpt-4o-realtime-preview-2024-10-01": {
      "inputCostPer1000": 0.0055,
      "outputCostPer1000": 0.022,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure/eu/gpt-4o-realtime-preview-2024-10-01": {
      "inputCostPer1000": 0.0055,
      "outputCostPer1000": 0.022,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure/o4-mini-2025-04-16": {
      "inputCostPer1000": 0.0011,
      "outputCostPer1000": 0.0044,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 100000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 100000,
      "mode": "chat"
    },
    "azure/o3-mini-2025-01-31": {
      "inputCostPer1000": 0.0011,
      "outputCostPer1000": 0.0044,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 100000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 100000,
      "mode": "chat"
    },
    "azure/us/o3-mini-2025-01-31": {
      "inputCostPer1000": 0.00121,
      "outputCostPer1000": 0.00484,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 100000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 100000,
      "mode": "chat"
    },
    "azure/eu/o3-mini-2025-01-31": {
      "inputCostPer1000": 0.00121,
      "outputCostPer1000": 0.00484,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 100000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 100000,
      "mode": "chat"
    },
    "azure/o3-mini": {
      "inputCostPer1000": 0.0011,
      "outputCostPer1000": 0.0044,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 100000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 100000,
      "mode": "chat"
    },
    "azure/o1-mini": {
      "inputCostPer1000": 0.00121,
      "outputCostPer1000": 0.00484,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 65536,
      "maxInputTokens": 128000,
      "maxOutputTokens": 65536,
      "mode": "chat"
    },
    "azure/o1-mini-2024-09-12": {
      "inputCostPer1000": 0.0011,
      "outputCostPer1000": 0.0044,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 65536,
      "maxInputTokens": 128000,
      "maxOutputTokens": 65536,
      "mode": "chat"
    },
    "azure/us/o1-mini-2024-09-12": {
      "inputCostPer1000": 0.00121,
      "outputCostPer1000": 0.00484,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 65536,
      "maxInputTokens": 128000,
      "maxOutputTokens": 65536,
      "mode": "chat"
    },
    "azure/eu/o1-mini-2024-09-12": {
      "inputCostPer1000": 0.00121,
      "outputCostPer1000": 0.00484,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 65536,
      "maxInputTokens": 128000,
      "maxOutputTokens": 65536,
      "mode": "chat"
    },
    "azure/o1": {
      "inputCostPer1000": 0.015,
      "outputCostPer1000": 0.06,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 100000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 100000,
      "mode": "chat"
    },
    "azure/o1-2024-12-17": {
      "inputCostPer1000": 0.015,
      "outputCostPer1000": 0.06,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 100000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 100000,
      "mode": "chat"
    },
    "azure/us/o1-2024-12-17": {
      "inputCostPer1000": 0.0165,
      "outputCostPer1000": 0.066,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 100000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 100000,
      "mode": "chat"
    },
    "azure/eu/o1-2024-12-17": {
      "inputCostPer1000": 0.0165,
      "outputCostPer1000": 0.066,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 100000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 100000,
      "mode": "chat"
    },
    "azure/codex-mini-latest": {
      "inputCostPer1000": 0.0015,
      "outputCostPer1000": 0.006,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 100000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 100000,
      "mode": "responses"
    },
    "azure/o1-preview": {
      "inputCostPer1000": 0.015,
      "outputCostPer1000": 0.06,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 32768,
      "maxInputTokens": 128000,
      "maxOutputTokens": 32768,
      "mode": "chat"
    },
    "azure/o1-preview-2024-09-12": {
      "inputCostPer1000": 0.015,
      "outputCostPer1000": 0.06,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 32768,
      "maxInputTokens": 128000,
      "maxOutputTokens": 32768,
      "mode": "chat"
    },
    "azure/us/o1-preview-2024-09-12": {
      "inputCostPer1000": 0.0165,
      "outputCostPer1000": 0.066,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 32768,
      "maxInputTokens": 128000,
      "maxOutputTokens": 32768,
      "mode": "chat"
    },
    "azure/eu/o1-preview-2024-09-12": {
      "inputCostPer1000": 0.0165,
      "outputCostPer1000": 0.066,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 32768,
      "maxInputTokens": 128000,
      "maxOutputTokens": 32768,
      "mode": "chat"
    },
    "azure/gpt-4.5-preview": {
      "inputCostPer1000": 0.075,
      "outputCostPer1000": 0.15,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "azure/gpt-4o": {
      "inputCostPer1000": 0.0025,
      "outputCostPer1000": 0.01,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "azure/global/gpt-4o-2024-11-20": {
      "inputCostPer1000": 0.0025,
      "outputCostPer1000": 0.01,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "azure/gpt-4o-2024-08-06": {
      "inputCostPer1000": 0.0025,
      "outputCostPer1000": 0.01,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "azure/global/gpt-4o-2024-08-06": {
      "inputCostPer1000": 0.0025,
      "outputCostPer1000": 0.01,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "azure/gpt-4o-2024-11-20": {
      "inputCostPer1000": 0.00275,
      "outputCostPer1000": 0.011,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "azure/us/gpt-4o-2024-11-20": {
      "inputCostPer1000": 0.00275,
      "outputCostPer1000": 0.011,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "azure/eu/gpt-4o-2024-11-20": {
      "inputCostPer1000": 0.00275,
      "outputCostPer1000": 0.011,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "azure/gpt-4o-2024-05-13": {
      "inputCostPer1000": 0.005,
      "outputCostPer1000": 0.015,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure/global-standard/gpt-4o-2024-08-06": {
      "inputCostPer1000": 0.0025,
      "outputCostPer1000": 0.01,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "azure/us/gpt-4o-2024-08-06": {
      "inputCostPer1000": 0.00275,
      "outputCostPer1000": 0.011,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "azure/eu/gpt-4o-2024-08-06": {
      "inputCostPer1000": 0.00275,
      "outputCostPer1000": 0.011,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "azure/global-standard/gpt-4o-2024-11-20": {
      "inputCostPer1000": 0.0025,
      "outputCostPer1000": 0.01,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "azure/global-standard/gpt-4o-mini": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.0006,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "azure/gpt-4o-mini": {
      "inputCostPer1000": 0.000165,
      "outputCostPer1000": 0.00066,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "azure/gpt-4o-mini-2024-07-18": {
      "inputCostPer1000": 0.000165,
      "outputCostPer1000": 0.00066,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "azure/us/gpt-4o-mini-2024-07-18": {
      "inputCostPer1000": 0.000165,
      "outputCostPer1000": 0.00066,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "azure/eu/gpt-4o-mini-2024-07-18": {
      "inputCostPer1000": 0.000165,
      "outputCostPer1000": 0.00066,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "azure/gpt-4-turbo-2024-04-09": {
      "inputCostPer1000": 0.01,
      "outputCostPer1000": 0.03,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure/gpt-4-0125-preview": {
      "inputCostPer1000": 0.01,
      "outputCostPer1000": 0.03,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure/gpt-4-1106-preview": {
      "inputCostPer1000": 0.01,
      "outputCostPer1000": 0.03,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure/gpt-4-0613": {
      "inputCostPer1000": 0.03,
      "outputCostPer1000": 0.06,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 8192,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure/gpt-4-32k-0613": {
      "inputCostPer1000": 0.06,
      "outputCostPer1000": 0.12,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 32768,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure/gpt-4-32k": {
      "inputCostPer1000": 0.06,
      "outputCostPer1000": 0.12,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 32768,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure/gpt-4": {
      "inputCostPer1000": 0.03,
      "outputCostPer1000": 0.06,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 8192,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure/gpt-4-turbo": {
      "inputCostPer1000": 0.01,
      "outputCostPer1000": 0.03,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure/gpt-4-turbo-vision-preview": {
      "inputCostPer1000": 0.01,
      "outputCostPer1000": 0.03,
      "provider": "azure",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure/gpt-35-turbo-16k-0613": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.004,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 16385,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure/gpt-35-turbo-1106": {
      "inputCostPer1000": 0.001,
      "outputCostPer1000": 0.002,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 16384,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure/gpt-35-turbo-0613": {
      "inputCostPer1000": 0.0015,
      "outputCostPer1000": 0.002,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 4097,
      "maxInputTokens": 4097,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure/gpt-35-turbo-0301": {
      "inputCostPer1000": 0.0002,
      "outputCostPer1000": 0.002,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 4097,
      "maxInputTokens": 4097,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure/gpt-35-turbo-0125": {
      "inputCostPer1000": 0.0005,
      "outputCostPer1000": 0.0015,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 16384,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure/gpt-3.5-turbo-0125": {
      "inputCostPer1000": 0.0005,
      "outputCostPer1000": 0.0015,
      "provider": "azure",
      "modelFamily": "gpt-3.5",
      "maxTokens": 4096,
      "maxInputTokens": 16384,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure/gpt-35-turbo-16k": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.004,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 16385,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure/gpt-35-turbo": {
      "inputCostPer1000": 0.0005,
      "outputCostPer1000": 0.0015,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4097,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure/gpt-3.5-turbo": {
      "inputCostPer1000": 0.0005,
      "outputCostPer1000": 0.0015,
      "provider": "azure",
      "modelFamily": "gpt-3.5",
      "maxTokens": 4096,
      "maxInputTokens": 4097,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure/mistral-large-latest": {
      "inputCostPer1000": 0.008,
      "outputCostPer1000": 0.024,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 32000,
      "maxInputTokens": 32000,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "azure/mistral-large-2402": {
      "inputCostPer1000": 0.008,
      "outputCostPer1000": 0.024,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 32000,
      "maxInputTokens": 32000,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "azure/command-r-plus": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "azure",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    }
  },
  "text-completion-openai": {
    "ft:davinci-002": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.002,
      "provider": "text-completion-openai",
      "modelFamily": "unknown",
      "maxTokens": 16384,
      "maxInputTokens": 16384,
      "maxOutputTokens": 4096,
      "mode": "completion"
    },
    "ft:babbage-002": {
      "inputCostPer1000": 0.0004,
      "outputCostPer1000": 0.0004,
      "provider": "text-completion-openai",
      "modelFamily": "unknown",
      "maxTokens": 16384,
      "maxInputTokens": 16384,
      "maxOutputTokens": 4096,
      "mode": "completion"
    },
    "babbage-002": {
      "inputCostPer1000": 0.0004,
      "outputCostPer1000": 0.0004,
      "provider": "text-completion-openai",
      "modelFamily": "unknown",
      "maxTokens": 16384,
      "maxInputTokens": 16384,
      "maxOutputTokens": 4096,
      "mode": "completion"
    },
    "davinci-002": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.002,
      "provider": "text-completion-openai",
      "modelFamily": "unknown",
      "maxTokens": 16384,
      "maxInputTokens": 16384,
      "maxOutputTokens": 4096,
      "mode": "completion"
    },
    "gpt-3.5-turbo-instruct": {
      "inputCostPer1000": 0.0015,
      "outputCostPer1000": 0.002,
      "provider": "text-completion-openai",
      "modelFamily": "gpt-3.5",
      "maxTokens": 4096,
      "maxInputTokens": 8192,
      "maxOutputTokens": 4096,
      "mode": "completion"
    },
    "gpt-3.5-turbo-instruct-0914": {
      "inputCostPer1000": 0.0015,
      "outputCostPer1000": 0.002,
      "provider": "text-completion-openai",
      "modelFamily": "gpt-3.5",
      "maxTokens": 4097,
      "maxInputTokens": 8192,
      "maxOutputTokens": 4097,
      "mode": "completion"
    }
  },
  "azure_text": {
    "azure/gpt-3.5-turbo-instruct-0914": {
      "inputCostPer1000": 0.0015,
      "outputCostPer1000": 0.002,
      "provider": "azure_text",
      "modelFamily": "gpt-3.5",
      "maxTokens": 4097,
      "maxInputTokens": 4097,
      "maxOutputTokens": null,
      "mode": "completion"
    },
    "azure/gpt-35-turbo-instruct": {
      "inputCostPer1000": 0.0015,
      "outputCostPer1000": 0.002,
      "provider": "azure_text",
      "modelFamily": "unknown",
      "maxTokens": 4097,
      "maxInputTokens": 4097,
      "maxOutputTokens": null,
      "mode": "completion"
    },
    "azure/gpt-35-turbo-instruct-0914": {
      "inputCostPer1000": 0.0015,
      "outputCostPer1000": 0.002,
      "provider": "azure_text",
      "modelFamily": "unknown",
      "maxTokens": 4097,
      "maxInputTokens": 4097,
      "maxOutputTokens": null,
      "mode": "completion"
    }
  },
  "azure_ai": {
    "azure_ai/deepseek-r1": {
      "inputCostPer1000": 0.00135,
      "outputCostPer1000": 0.0054,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 128000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "azure_ai/deepseek-v3": {
      "inputCostPer1000": 0.00114,
      "outputCostPer1000": 0.00456,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 128000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "azure_ai/deepseek-v3-0324": {
      "inputCostPer1000": 0.00114,
      "outputCostPer1000": 0.00456,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 128000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "azure_ai/jamba-instruct": {
      "inputCostPer1000": 0.0005,
      "outputCostPer1000": 0.0007,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 70000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure_ai/mistral-nemo": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.00015,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 131072,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure_ai/mistral-medium-2505": {
      "inputCostPer1000": 0.0004,
      "outputCostPer1000": 0.002,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 131072,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "azure_ai/mistral-large": {
      "inputCostPer1000": 0.004,
      "outputCostPer1000": 0.012,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 32000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "azure_ai/mistral-small": {
      "inputCostPer1000": 0.001,
      "outputCostPer1000": 0.003,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 32000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "azure_ai/mistral-small-2503": {
      "inputCostPer1000": 0.001,
      "outputCostPer1000": 0.003,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 128000,
      "mode": "chat"
    },
    "azure_ai/mistral-large-2407": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.006,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure_ai/mistral-large-latest": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.006,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure_ai/ministral-3b": {
      "inputCostPer1000": 0.00004,
      "outputCostPer1000": 0.00004,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure_ai/Llama-3.2-11B-Vision-Instruct": {
      "inputCostPer1000": 0.00037,
      "outputCostPer1000": 0.00037,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 2048,
      "maxInputTokens": 128000,
      "maxOutputTokens": 2048,
      "mode": "chat"
    },
    "azure_ai/Llama-3.3-70B-Instruct": {
      "inputCostPer1000": 0.00071,
      "outputCostPer1000": 0.00071,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 2048,
      "maxInputTokens": 128000,
      "maxOutputTokens": 2048,
      "mode": "chat"
    },
    "azure_ai/Llama-4-Scout-17B-16E-Instruct": {
      "inputCostPer1000": 0.0002,
      "outputCostPer1000": 0.00078,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 16384,
      "maxInputTokens": 10000000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "azure_ai/Llama-4-Maverick-17B-128E-Instruct-FP8": {
      "inputCostPer1000": 0.00141,
      "outputCostPer1000": 0.00035,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 16384,
      "maxInputTokens": 1000000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "azure_ai/Llama-3.2-90B-Vision-Instruct": {
      "inputCostPer1000": 0.00204,
      "outputCostPer1000": 0.00204,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 2048,
      "maxInputTokens": 128000,
      "maxOutputTokens": 2048,
      "mode": "chat"
    },
    "azure_ai/Meta-Llama-3-70B-Instruct": {
      "inputCostPer1000": 0.0011,
      "outputCostPer1000": 0.00037,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 2048,
      "maxInputTokens": 8192,
      "maxOutputTokens": 2048,
      "mode": "chat"
    },
    "azure_ai/Meta-Llama-3.1-8B-Instruct": {
      "inputCostPer1000": 0.0003,
      "outputCostPer1000": 0.00061,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 2048,
      "maxInputTokens": 128000,
      "maxOutputTokens": 2048,
      "mode": "chat"
    },
    "azure_ai/Meta-Llama-3.1-70B-Instruct": {
      "inputCostPer1000": 0.00268,
      "outputCostPer1000": 0.00354,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 2048,
      "maxInputTokens": 128000,
      "maxOutputTokens": 2048,
      "mode": "chat"
    },
    "azure_ai/Meta-Llama-3.1-405B-Instruct": {
      "inputCostPer1000": 0.00533,
      "outputCostPer1000": 0.016,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 2048,
      "maxInputTokens": 128000,
      "maxOutputTokens": 2048,
      "mode": "chat"
    },
    "azure_ai/Phi-4-mini-instruct": {
      "inputCostPer1000": 0.000075,
      "outputCostPer1000": 0.0003,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 131072,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure_ai/Phi-4-multimodal-instruct": {
      "inputCostPer1000": 0.00008,
      "outputCostPer1000": 0.00032,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 131072,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure_ai/Phi-4": {
      "inputCostPer1000": 0.000125,
      "outputCostPer1000": 0.0005,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 16384,
      "maxInputTokens": 16384,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "azure_ai/Phi-3.5-mini-instruct": {
      "inputCostPer1000": 0.00013,
      "outputCostPer1000": 0.00052,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure_ai/Phi-3.5-vision-instruct": {
      "inputCostPer1000": 0.00013,
      "outputCostPer1000": 0.00052,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure_ai/Phi-3.5-MoE-instruct": {
      "inputCostPer1000": 0.00016,
      "outputCostPer1000": 0.00064,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure_ai/Phi-3-mini-4k-instruct": {
      "inputCostPer1000": 0.00013,
      "outputCostPer1000": 0.00052,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure_ai/Phi-3-mini-128k-instruct": {
      "inputCostPer1000": 0.00013,
      "outputCostPer1000": 0.00052,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure_ai/Phi-3-small-8k-instruct": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.0006,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 8192,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure_ai/Phi-3-small-128k-instruct": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.0006,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure_ai/Phi-3-medium-4k-instruct": {
      "inputCostPer1000": 0.00017,
      "outputCostPer1000": 0.00068,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "azure_ai/Phi-3-medium-128k-instruct": {
      "inputCostPer1000": 0.00017,
      "outputCostPer1000": 0.00068,
      "provider": "azure_ai",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    }
  },
  "anthropic": {
    "claude-instant-1": {
      "inputCostPer1000": 0.00163,
      "outputCostPer1000": 0.00551,
      "provider": "anthropic",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 100000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "claude-instant-1.2": {
      "inputCostPer1000": 0.000163,
      "outputCostPer1000": 0.000551,
      "provider": "anthropic",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 100000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "claude-2": {
      "inputCostPer1000": 0.008,
      "outputCostPer1000": 0.024,
      "provider": "anthropic",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 100000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "claude-2.1": {
      "inputCostPer1000": 0.008,
      "outputCostPer1000": 0.024,
      "provider": "anthropic",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 200000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "claude-3-haiku-20240307": {
      "inputCostPer1000": 0.00025,
      "outputCostPer1000": 0.00125,
      "provider": "anthropic",
      "modelFamily": "claude-3",
      "maxTokens": 4096,
      "maxInputTokens": 200000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "claude-3-5-haiku-20241022": {
      "inputCostPer1000": 0.0008,
      "outputCostPer1000": 0.004,
      "provider": "anthropic",
      "modelFamily": "claude-3",
      "maxTokens": 8192,
      "maxInputTokens": 200000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "claude-3-5-haiku-latest": {
      "inputCostPer1000": 0.001,
      "outputCostPer1000": 0.005,
      "provider": "anthropic",
      "modelFamily": "claude-3",
      "maxTokens": 8192,
      "maxInputTokens": 200000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "claude-3-opus-latest": {
      "inputCostPer1000": 0.015,
      "outputCostPer1000": 0.075,
      "provider": "anthropic",
      "modelFamily": "claude-3",
      "maxTokens": 4096,
      "maxInputTokens": 200000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "claude-3-opus-20240229": {
      "inputCostPer1000": 0.015,
      "outputCostPer1000": 0.075,
      "provider": "anthropic",
      "modelFamily": "claude-3",
      "maxTokens": 4096,
      "maxInputTokens": 200000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "claude-3-sonnet-20240229": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "anthropic",
      "modelFamily": "claude-3",
      "maxTokens": 4096,
      "maxInputTokens": 200000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "claude-3-5-sonnet-latest": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "anthropic",
      "modelFamily": "claude-3",
      "maxTokens": 8192,
      "maxInputTokens": 200000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "claude-3-5-sonnet-20240620": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "anthropic",
      "modelFamily": "claude-3",
      "maxTokens": 8192,
      "maxInputTokens": 200000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "claude-opus-4-20250514": {
      "inputCostPer1000": 0.015,
      "outputCostPer1000": 0.075,
      "provider": "anthropic",
      "modelFamily": "unknown",
      "maxTokens": 32000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 32000,
      "mode": "chat"
    },
    "claude-sonnet-4-20250514": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "anthropic",
      "modelFamily": "unknown",
      "maxTokens": 64000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 64000,
      "mode": "chat"
    },
    "claude-4-opus-20250514": {
      "inputCostPer1000": 0.015,
      "outputCostPer1000": 0.075,
      "provider": "anthropic",
      "modelFamily": "unknown",
      "maxTokens": 32000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 32000,
      "mode": "chat"
    },
    "claude-4-sonnet-20250514": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "anthropic",
      "modelFamily": "unknown",
      "maxTokens": 64000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 64000,
      "mode": "chat"
    },
    "claude-3-7-sonnet-latest": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "anthropic",
      "modelFamily": "claude-3",
      "maxTokens": 128000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 128000,
      "mode": "chat"
    },
    "claude-3-7-sonnet-20250219": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "anthropic",
      "modelFamily": "claude-3",
      "maxTokens": 128000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 128000,
      "mode": "chat"
    },
    "claude-3-5-sonnet-20241022": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "anthropic",
      "modelFamily": "claude-3",
      "maxTokens": 8192,
      "maxInputTokens": 200000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    }
  },
  "mistral": {
    "mistral/mistral-tiny": {
      "inputCostPer1000": 0.00025,
      "outputCostPer1000": 0.00025,
      "provider": "mistral",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 32000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "mistral/mistral-small": {
      "inputCostPer1000": 0.0001,
      "outputCostPer1000": 0.0003,
      "provider": "mistral",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 32000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "mistral/mistral-small-latest": {
      "inputCostPer1000": 0.0001,
      "outputCostPer1000": 0.0003,
      "provider": "mistral",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 32000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "mistral/mistral-medium": {
      "inputCostPer1000": 0.0027,
      "outputCostPer1000": 0.0081,
      "provider": "mistral",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 32000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "mistral/mistral-medium-latest": {
      "inputCostPer1000": 0.0004,
      "outputCostPer1000": 0.002,
      "provider": "mistral",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 131072,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "mistral/mistral-medium-2505": {
      "inputCostPer1000": 0.0004,
      "outputCostPer1000": 0.002,
      "provider": "mistral",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 131072,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "mistral/mistral-medium-2312": {
      "inputCostPer1000": 0.0027,
      "outputCostPer1000": 0.0081,
      "provider": "mistral",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 32000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "mistral/mistral-large-latest": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.006,
      "provider": "mistral",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 128000,
      "mode": "chat"
    },
    "mistral/mistral-large-2411": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.006,
      "provider": "mistral",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 128000,
      "mode": "chat"
    },
    "mistral/mistral-large-2402": {
      "inputCostPer1000": 0.004,
      "outputCostPer1000": 0.012,
      "provider": "mistral",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 32000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "mistral/mistral-large-2407": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.009,
      "provider": "mistral",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 128000,
      "mode": "chat"
    },
    "mistral/pixtral-large-latest": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.006,
      "provider": "mistral",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 128000,
      "mode": "chat"
    },
    "mistral/pixtral-large-2411": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.006,
      "provider": "mistral",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 128000,
      "mode": "chat"
    },
    "mistral/pixtral-12b-2409": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.00015,
      "provider": "mistral",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 128000,
      "mode": "chat"
    },
    "mistral/open-mistral-7b": {
      "inputCostPer1000": 0.00025,
      "outputCostPer1000": 0.00025,
      "provider": "mistral",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 32000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "mistral/open-mixtral-8x7b": {
      "inputCostPer1000": 0.0007,
      "outputCostPer1000": 0.0007,
      "provider": "mistral",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 32000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "mistral/open-mixtral-8x22b": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.006,
      "provider": "mistral",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 65336,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "mistral/codestral-latest": {
      "inputCostPer1000": 0.001,
      "outputCostPer1000": 0.003,
      "provider": "mistral",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 32000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "mistral/codestral-2405": {
      "inputCostPer1000": 0.001,
      "outputCostPer1000": 0.003,
      "provider": "mistral",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 32000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "mistral/open-mistral-nemo": {
      "inputCostPer1000": 0.0003,
      "outputCostPer1000": 0.0003,
      "provider": "mistral",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 128000,
      "mode": "chat"
    },
    "mistral/open-mistral-nemo-2407": {
      "inputCostPer1000": 0.0003,
      "outputCostPer1000": 0.0003,
      "provider": "mistral",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 128000,
      "mode": "chat"
    },
    "mistral/open-codestral-mamba": {
      "inputCostPer1000": 0.00025,
      "outputCostPer1000": 0.00025,
      "provider": "mistral",
      "modelFamily": "unknown",
      "maxTokens": 256000,
      "maxInputTokens": 256000,
      "maxOutputTokens": 256000,
      "mode": "chat"
    },
    "mistral/codestral-mamba-latest": {
      "inputCostPer1000": 0.00025,
      "outputCostPer1000": 0.00025,
      "provider": "mistral",
      "modelFamily": "unknown",
      "maxTokens": 256000,
      "maxInputTokens": 256000,
      "maxOutputTokens": 256000,
      "mode": "chat"
    },
    "mistral/devstral-small-2505": {
      "inputCostPer1000": 0.0001,
      "outputCostPer1000": 0.0003,
      "provider": "mistral",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 128000,
      "mode": "chat"
    }
  },
  "deepseek": {
    "deepseek/deepseek-reasoner": {
      "inputCostPer1000": 0.00055,
      "outputCostPer1000": 0.00219,
      "provider": "deepseek",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 65536,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "deepseek/deepseek-chat": {
      "inputCostPer1000": 0.00027,
      "outputCostPer1000": 0.0011,
      "provider": "deepseek",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 65536,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "deepseek/deepseek-coder": {
      "inputCostPer1000": 0.00014,
      "outputCostPer1000": 0.00028,
      "provider": "deepseek",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    }
  },
  "xai": {
    "xai/grok-beta": {
      "inputCostPer1000": 0.005,
      "outputCostPer1000": 0.015,
      "provider": "xai",
      "modelFamily": "unknown",
      "maxTokens": 131072,
      "maxInputTokens": 131072,
      "maxOutputTokens": 131072,
      "mode": "chat"
    },
    "xai/grok-2-vision-1212": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.01,
      "provider": "xai",
      "modelFamily": "unknown",
      "maxTokens": 32768,
      "maxInputTokens": 32768,
      "maxOutputTokens": 32768,
      "mode": "chat"
    },
    "xai/grok-2-vision-latest": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.01,
      "provider": "xai",
      "modelFamily": "unknown",
      "maxTokens": 32768,
      "maxInputTokens": 32768,
      "maxOutputTokens": 32768,
      "mode": "chat"
    },
    "xai/grok-2-vision": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.01,
      "provider": "xai",
      "modelFamily": "unknown",
      "maxTokens": 32768,
      "maxInputTokens": 32768,
      "maxOutputTokens": 32768,
      "mode": "chat"
    },
    "xai/grok-3": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "xai",
      "modelFamily": "unknown",
      "maxTokens": 131072,
      "maxInputTokens": 131072,
      "maxOutputTokens": 131072,
      "mode": "chat"
    },
    "xai/grok-3-beta": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "xai",
      "modelFamily": "unknown",
      "maxTokens": 131072,
      "maxInputTokens": 131072,
      "maxOutputTokens": 131072,
      "mode": "chat"
    },
    "xai/grok-3-fast-beta": {
      "inputCostPer1000": 0.005,
      "outputCostPer1000": 0.025,
      "provider": "xai",
      "modelFamily": "unknown",
      "maxTokens": 131072,
      "maxInputTokens": 131072,
      "maxOutputTokens": 131072,
      "mode": "chat"
    },
    "xai/grok-3-fast-latest": {
      "inputCostPer1000": 0.005,
      "outputCostPer1000": 0.025,
      "provider": "xai",
      "modelFamily": "unknown",
      "maxTokens": 131072,
      "maxInputTokens": 131072,
      "maxOutputTokens": 131072,
      "mode": "chat"
    },
    "xai/grok-3-mini-beta": {
      "inputCostPer1000": 0.0003,
      "outputCostPer1000": 0.0005,
      "provider": "xai",
      "modelFamily": "unknown",
      "maxTokens": 131072,
      "maxInputTokens": 131072,
      "maxOutputTokens": 131072,
      "mode": "chat"
    },
    "xai/grok-3-mini-fast-beta": {
      "inputCostPer1000": 0.0006,
      "outputCostPer1000": 0.004,
      "provider": "xai",
      "modelFamily": "unknown",
      "maxTokens": 131072,
      "maxInputTokens": 131072,
      "maxOutputTokens": 131072,
      "mode": "chat"
    },
    "xai/grok-3-mini-fast-latest": {
      "inputCostPer1000": 0.0006,
      "outputCostPer1000": 0.004,
      "provider": "xai",
      "modelFamily": "unknown",
      "maxTokens": 131072,
      "maxInputTokens": 131072,
      "maxOutputTokens": 131072,
      "mode": "chat"
    },
    "xai/grok-vision-beta": {
      "inputCostPer1000": 0.005,
      "outputCostPer1000": 0.015,
      "provider": "xai",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "xai/grok-2-1212": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.01,
      "provider": "xai",
      "modelFamily": "unknown",
      "maxTokens": 131072,
      "maxInputTokens": 131072,
      "maxOutputTokens": 131072,
      "mode": "chat"
    },
    "xai/grok-2": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.01,
      "provider": "xai",
      "modelFamily": "unknown",
      "maxTokens": 131072,
      "maxInputTokens": 131072,
      "maxOutputTokens": 131072,
      "mode": "chat"
    },
    "xai/grok-2-latest": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.01,
      "provider": "xai",
      "modelFamily": "unknown",
      "maxTokens": 131072,
      "maxInputTokens": 131072,
      "maxOutputTokens": 131072,
      "mode": "chat"
    }
  },
  "groq": {
    "groq/deepseek-r1-distill-llama-70b": {
      "inputCostPer1000": 0.00075,
      "outputCostPer1000": 0.00099,
      "provider": "groq",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 128000,
      "mode": "chat"
    },
    "groq/llama-3.3-70b-versatile": {
      "inputCostPer1000": 0.00059,
      "outputCostPer1000": 0.00079,
      "provider": "groq",
      "modelFamily": "llama-3",
      "maxTokens": 32768,
      "maxInputTokens": 128000,
      "maxOutputTokens": 32768,
      "mode": "chat"
    },
    "groq/llama-3.3-70b-specdec": {
      "inputCostPer1000": 0.00059,
      "outputCostPer1000": 0.00099,
      "provider": "groq",
      "modelFamily": "llama-3",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "groq/llama-guard-3-8b": {
      "inputCostPer1000": 0.0002,
      "outputCostPer1000": 0.0002,
      "provider": "groq",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "groq/llama2-70b-4096": {
      "inputCostPer1000": 0.0007,
      "outputCostPer1000": 0.0008,
      "provider": "groq",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "groq/llama3-8b-8192": {
      "inputCostPer1000": 0.00005,
      "outputCostPer1000": 0.00008,
      "provider": "groq",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "groq/llama-3.2-1b-preview": {
      "inputCostPer1000": 0.00004,
      "outputCostPer1000": 0.00004,
      "provider": "groq",
      "modelFamily": "llama-3",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "groq/llama-3.2-3b-preview": {
      "inputCostPer1000": 0.00006,
      "outputCostPer1000": 0.00006,
      "provider": "groq",
      "modelFamily": "llama-3",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "groq/llama-3.2-11b-text-preview": {
      "inputCostPer1000": 0.00018,
      "outputCostPer1000": 0.00018,
      "provider": "groq",
      "modelFamily": "llama-3",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "groq/llama-3.2-11b-vision-preview": {
      "inputCostPer1000": 0.00018,
      "outputCostPer1000": 0.00018,
      "provider": "groq",
      "modelFamily": "llama-3",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "groq/llama-3.2-90b-text-preview": {
      "inputCostPer1000": 0.0009,
      "outputCostPer1000": 0.0009,
      "provider": "groq",
      "modelFamily": "llama-3",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "groq/llama-3.2-90b-vision-preview": {
      "inputCostPer1000": 0.0009,
      "outputCostPer1000": 0.0009,
      "provider": "groq",
      "modelFamily": "llama-3",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "groq/llama3-70b-8192": {
      "inputCostPer1000": 0.00059,
      "outputCostPer1000": 0.00079,
      "provider": "groq",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "groq/llama-3.1-8b-instant": {
      "inputCostPer1000": 0.00005,
      "outputCostPer1000": 0.00008,
      "provider": "groq",
      "modelFamily": "llama-3.1",
      "maxTokens": 8192,
      "maxInputTokens": 128000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "groq/llama-3.1-70b-versatile": {
      "inputCostPer1000": 0.00059,
      "outputCostPer1000": 0.00079,
      "provider": "groq",
      "modelFamily": "llama-3.1",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "groq/llama-3.1-405b-reasoning": {
      "inputCostPer1000": 0.00059,
      "outputCostPer1000": 0.00079,
      "provider": "groq",
      "modelFamily": "llama-3.1",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "groq/meta-llama/llama-4-scout-17b-16e-instruct": {
      "inputCostPer1000": 0.00011,
      "outputCostPer1000": 0.00034,
      "provider": "groq",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 131072,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "groq/meta-llama/llama-4-maverick-17b-128e-instruct": {
      "inputCostPer1000": 0.0002,
      "outputCostPer1000": 0.0006,
      "provider": "groq",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 131072,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "groq/mistral-saba-24b": {
      "inputCostPer1000": 0.00079,
      "outputCostPer1000": 0.00079,
      "provider": "groq",
      "modelFamily": "unknown",
      "maxTokens": 32000,
      "maxInputTokens": 32000,
      "maxOutputTokens": 32000,
      "mode": "chat"
    },
    "groq/mixtral-8x7b-32768": {
      "inputCostPer1000": 0.00024,
      "outputCostPer1000": 0.00024,
      "provider": "groq",
      "modelFamily": "unknown",
      "maxTokens": 32768,
      "maxInputTokens": 32768,
      "maxOutputTokens": 32768,
      "mode": "chat"
    },
    "groq/gemma-7b-it": {
      "inputCostPer1000": 0.00007,
      "outputCostPer1000": 0.00007,
      "provider": "groq",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "groq/gemma2-9b-it": {
      "inputCostPer1000": 0.0002,
      "outputCostPer1000": 0.0002,
      "provider": "groq",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "groq/llama3-groq-70b-8192-tool-use-preview": {
      "inputCostPer1000": 0.00089,
      "outputCostPer1000": 0.00089,
      "provider": "groq",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "groq/llama3-groq-8b-8192-tool-use-preview": {
      "inputCostPer1000": 0.00019,
      "outputCostPer1000": 0.00019,
      "provider": "groq",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "groq/qwen-qwq-32b": {
      "inputCostPer1000": 0.00029,
      "outputCostPer1000": 0.00039,
      "provider": "groq",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 128000,
      "mode": "chat"
    }
  },
  "cerebras": {
    "cerebras/llama3.1-8b": {
      "inputCostPer1000": 0.0001,
      "outputCostPer1000": 0.0001,
      "provider": "cerebras",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 128000,
      "mode": "chat"
    },
    "cerebras/llama3.1-70b": {
      "inputCostPer1000": 0.0006,
      "outputCostPer1000": 0.0006,
      "provider": "cerebras",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 128000,
      "mode": "chat"
    },
    "cerebras/llama-3.3-70b": {
      "inputCostPer1000": 0.00085,
      "outputCostPer1000": 0.0012,
      "provider": "cerebras",
      "modelFamily": "llama-3",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 128000,
      "mode": "chat"
    },
    "cerebras/qwen-3-32b": {
      "inputCostPer1000": 0.0004,
      "outputCostPer1000": 0.0008,
      "provider": "cerebras",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 128000,
      "mode": "chat"
    }
  },
  "friendliai": {
    "friendliai/meta-llama-3.1-8b-instruct": {
      "inputCostPer1000": 0.0001,
      "outputCostPer1000": 0.0001,
      "provider": "friendliai",
      "modelFamily": "llama-3.1",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "friendliai/meta-llama-3.1-70b-instruct": {
      "inputCostPer1000": 0.0006,
      "outputCostPer1000": 0.0006,
      "provider": "friendliai",
      "modelFamily": "llama-3.1",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    }
  },
  "vertex_ai-text-models": {
    "text-bison32k": {
      "inputCostPer1000": 0.000125,
      "outputCostPer1000": 0.000125,
      "provider": "vertex_ai-text-models",
      "modelFamily": "unknown",
      "maxTokens": 1024,
      "maxInputTokens": 8192,
      "maxOutputTokens": 1024,
      "mode": "completion"
    },
    "text-bison32k@002": {
      "inputCostPer1000": 0.000125,
      "outputCostPer1000": 0.000125,
      "provider": "vertex_ai-text-models",
      "modelFamily": "unknown",
      "maxTokens": 1024,
      "maxInputTokens": 8192,
      "maxOutputTokens": 1024,
      "mode": "completion"
    },
    "text-unicorn": {
      "inputCostPer1000": 0.01,
      "outputCostPer1000": 0.028,
      "provider": "vertex_ai-text-models",
      "modelFamily": "unknown",
      "maxTokens": 1024,
      "maxInputTokens": 8192,
      "maxOutputTokens": 1024,
      "mode": "completion"
    },
    "text-unicorn@001": {
      "inputCostPer1000": 0.01,
      "outputCostPer1000": 0.028,
      "provider": "vertex_ai-text-models",
      "modelFamily": "unknown",
      "maxTokens": 1024,
      "maxInputTokens": 8192,
      "maxOutputTokens": 1024,
      "mode": "completion"
    }
  },
  "vertex_ai-chat-models": {
    "chat-bison": {
      "inputCostPer1000": 0.000125,
      "outputCostPer1000": 0.000125,
      "provider": "vertex_ai-chat-models",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 8192,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "chat-bison@001": {
      "inputCostPer1000": 0.000125,
      "outputCostPer1000": 0.000125,
      "provider": "vertex_ai-chat-models",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 8192,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "chat-bison@002": {
      "inputCostPer1000": 0.000125,
      "outputCostPer1000": 0.000125,
      "provider": "vertex_ai-chat-models",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 8192,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "chat-bison-32k": {
      "inputCostPer1000": 0.000125,
      "outputCostPer1000": 0.000125,
      "provider": "vertex_ai-chat-models",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 32000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "chat-bison-32k@002": {
      "inputCostPer1000": 0.000125,
      "outputCostPer1000": 0.000125,
      "provider": "vertex_ai-chat-models",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 32000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    }
  },
  "vertex_ai-code-text-models": {
    "code-bison": {
      "inputCostPer1000": 0.000125,
      "outputCostPer1000": 0.000125,
      "provider": "vertex_ai-code-text-models",
      "modelFamily": "unknown",
      "maxTokens": 1024,
      "maxInputTokens": 6144,
      "maxOutputTokens": 1024,
      "mode": "chat"
    },
    "code-bison@001": {
      "inputCostPer1000": 0.000125,
      "outputCostPer1000": 0.000125,
      "provider": "vertex_ai-code-text-models",
      "modelFamily": "unknown",
      "maxTokens": 1024,
      "maxInputTokens": 6144,
      "maxOutputTokens": 1024,
      "mode": "completion"
    },
    "code-bison@002": {
      "inputCostPer1000": 0.000125,
      "outputCostPer1000": 0.000125,
      "provider": "vertex_ai-code-text-models",
      "modelFamily": "unknown",
      "maxTokens": 1024,
      "maxInputTokens": 6144,
      "maxOutputTokens": 1024,
      "mode": "completion"
    },
    "code-bison32k": {
      "inputCostPer1000": 0.000125,
      "outputCostPer1000": 0.000125,
      "provider": "vertex_ai-code-text-models",
      "modelFamily": "unknown",
      "maxTokens": 1024,
      "maxInputTokens": 6144,
      "maxOutputTokens": 1024,
      "mode": "completion"
    },
    "code-bison-32k@002": {
      "inputCostPer1000": 0.000125,
      "outputCostPer1000": 0.000125,
      "provider": "vertex_ai-code-text-models",
      "modelFamily": "unknown",
      "maxTokens": 1024,
      "maxInputTokens": 6144,
      "maxOutputTokens": 1024,
      "mode": "completion"
    },
    "code-gecko@001": {
      "inputCostPer1000": 0.000125,
      "outputCostPer1000": 0.000125,
      "provider": "vertex_ai-code-text-models",
      "modelFamily": "unknown",
      "maxTokens": 64,
      "maxInputTokens": 2048,
      "maxOutputTokens": 64,
      "mode": "completion"
    },
    "code-gecko@002": {
      "inputCostPer1000": 0.000125,
      "outputCostPer1000": 0.000125,
      "provider": "vertex_ai-code-text-models",
      "modelFamily": "unknown",
      "maxTokens": 64,
      "maxInputTokens": 2048,
      "maxOutputTokens": 64,
      "mode": "completion"
    },
    "code-gecko": {
      "inputCostPer1000": 0.000125,
      "outputCostPer1000": 0.000125,
      "provider": "vertex_ai-code-text-models",
      "modelFamily": "unknown",
      "maxTokens": 64,
      "maxInputTokens": 2048,
      "maxOutputTokens": 64,
      "mode": "completion"
    },
    "code-gecko-latest": {
      "inputCostPer1000": 0.000125,
      "outputCostPer1000": 0.000125,
      "provider": "vertex_ai-code-text-models",
      "modelFamily": "unknown",
      "maxTokens": 64,
      "maxInputTokens": 2048,
      "maxOutputTokens": 64,
      "mode": "completion"
    }
  },
  "vertex_ai-code-chat-models": {
    "codechat-bison@latest": {
      "inputCostPer1000": 0.000125,
      "outputCostPer1000": 0.000125,
      "provider": "vertex_ai-code-chat-models",
      "modelFamily": "unknown",
      "maxTokens": 1024,
      "maxInputTokens": 6144,
      "maxOutputTokens": 1024,
      "mode": "chat"
    },
    "codechat-bison": {
      "inputCostPer1000": 0.000125,
      "outputCostPer1000": 0.000125,
      "provider": "vertex_ai-code-chat-models",
      "modelFamily": "unknown",
      "maxTokens": 1024,
      "maxInputTokens": 6144,
      "maxOutputTokens": 1024,
      "mode": "chat"
    },
    "codechat-bison@001": {
      "inputCostPer1000": 0.000125,
      "outputCostPer1000": 0.000125,
      "provider": "vertex_ai-code-chat-models",
      "modelFamily": "unknown",
      "maxTokens": 1024,
      "maxInputTokens": 6144,
      "maxOutputTokens": 1024,
      "mode": "chat"
    },
    "codechat-bison@002": {
      "inputCostPer1000": 0.000125,
      "outputCostPer1000": 0.000125,
      "provider": "vertex_ai-code-chat-models",
      "modelFamily": "unknown",
      "maxTokens": 1024,
      "maxInputTokens": 6144,
      "maxOutputTokens": 1024,
      "mode": "chat"
    },
    "codechat-bison-32k": {
      "inputCostPer1000": 0.000125,
      "outputCostPer1000": 0.000125,
      "provider": "vertex_ai-code-chat-models",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 32000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "codechat-bison-32k@002": {
      "inputCostPer1000": 0.000125,
      "outputCostPer1000": 0.000125,
      "provider": "vertex_ai-code-chat-models",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 32000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    }
  },
  "vertex_ai-language-models": {
    "gemini-pro": {
      "inputCostPer1000": 0.0005,
      "outputCostPer1000": 0.0015,
      "provider": "vertex_ai-language-models",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 32760,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini-1.0-pro": {
      "inputCostPer1000": 0.0005,
      "outputCostPer1000": 0.0015,
      "provider": "vertex_ai-language-models",
      "modelFamily": "gemini-1.0",
      "maxTokens": 8192,
      "maxInputTokens": 32760,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini-1.0-pro-001": {
      "inputCostPer1000": 0.0005,
      "outputCostPer1000": 0.0015,
      "provider": "vertex_ai-language-models",
      "modelFamily": "gemini-1.0",
      "maxTokens": 8192,
      "maxInputTokens": 32760,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini-1.0-ultra": {
      "inputCostPer1000": 0.0005,
      "outputCostPer1000": 0.0015,
      "provider": "vertex_ai-language-models",
      "modelFamily": "gemini-1.0",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 2048,
      "mode": "chat"
    },
    "gemini-1.0-ultra-001": {
      "inputCostPer1000": 0.0005,
      "outputCostPer1000": 0.0015,
      "provider": "vertex_ai-language-models",
      "modelFamily": "gemini-1.0",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 2048,
      "mode": "chat"
    },
    "gemini-1.0-pro-002": {
      "inputCostPer1000": 0.0005,
      "outputCostPer1000": 0.0015,
      "provider": "vertex_ai-language-models",
      "modelFamily": "gemini-1.0",
      "maxTokens": 8192,
      "maxInputTokens": 32760,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini-1.5-pro": {
      "inputCostPer1000": 0.00125,
      "outputCostPer1000": 0.005,
      "provider": "vertex_ai-language-models",
      "modelFamily": "gemini-1.5",
      "maxTokens": 8192,
      "maxInputTokens": 2097152,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini-1.5-pro-002": {
      "inputCostPer1000": 0.00125,
      "outputCostPer1000": 0.005,
      "provider": "vertex_ai-language-models",
      "modelFamily": "gemini-1.5",
      "maxTokens": 8192,
      "maxInputTokens": 2097152,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini-1.5-pro-001": {
      "inputCostPer1000": 0.00125,
      "outputCostPer1000": 0.005,
      "provider": "vertex_ai-language-models",
      "modelFamily": "gemini-1.5",
      "maxTokens": 8192,
      "maxInputTokens": 1000000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini-1.5-pro-preview-0514": {
      "inputCostPer1000": 0.000078,
      "outputCostPer1000": 0.000313,
      "provider": "vertex_ai-language-models",
      "modelFamily": "gemini-1.5",
      "maxTokens": 8192,
      "maxInputTokens": 1000000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini-1.5-pro-preview-0215": {
      "inputCostPer1000": 0.000078,
      "outputCostPer1000": 0.000313,
      "provider": "vertex_ai-language-models",
      "modelFamily": "gemini-1.5",
      "maxTokens": 8192,
      "maxInputTokens": 1000000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini-1.5-pro-preview-0409": {
      "inputCostPer1000": 0.000078,
      "outputCostPer1000": 0.000313,
      "provider": "vertex_ai-language-models",
      "modelFamily": "gemini-1.5",
      "maxTokens": 8192,
      "maxInputTokens": 1000000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini-1.5-flash": {
      "inputCostPer1000": 0.000075,
      "outputCostPer1000": 0.0003,
      "provider": "vertex_ai-language-models",
      "modelFamily": "gemini-1.5",
      "maxTokens": 8192,
      "maxInputTokens": 1000000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini-1.5-flash-exp-0827": {
      "inputCostPer1000": 0.000005,
      "outputCostPer1000": 0.000005,
      "provider": "vertex_ai-language-models",
      "modelFamily": "gemini-1.5",
      "maxTokens": 8192,
      "maxInputTokens": 1000000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini-1.5-flash-002": {
      "inputCostPer1000": 0.000075,
      "outputCostPer1000": 0.0003,
      "provider": "vertex_ai-language-models",
      "modelFamily": "gemini-1.5",
      "maxTokens": 8192,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini-1.5-flash-001": {
      "inputCostPer1000": 0.000075,
      "outputCostPer1000": 0.0003,
      "provider": "vertex_ai-language-models",
      "modelFamily": "gemini-1.5",
      "maxTokens": 8192,
      "maxInputTokens": 1000000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini-1.5-flash-preview-0514": {
      "inputCostPer1000": 0.000075,
      "outputCostPer1000": 0.000005,
      "provider": "vertex_ai-language-models",
      "modelFamily": "gemini-1.5",
      "maxTokens": 8192,
      "maxInputTokens": 1000000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini-2.5-pro-exp-03-25": {
      "inputCostPer1000": 0.00125,
      "outputCostPer1000": 0.01,
      "provider": "vertex_ai-language-models",
      "modelFamily": "unknown",
      "maxTokens": 65535,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 65535,
      "mode": "chat"
    },
    "gemini-2.0-pro-exp-02-05": {
      "inputCostPer1000": 0.00125,
      "outputCostPer1000": 0.01,
      "provider": "vertex_ai-language-models",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 2097152,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini-2.0-flash-exp": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.0006,
      "provider": "vertex_ai-language-models",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini-2.0-flash-001": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.0006,
      "provider": "vertex_ai-language-models",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini-2.5-flash-preview-05-20": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.0006,
      "provider": "vertex_ai-language-models",
      "modelFamily": "unknown",
      "maxTokens": 65535,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 65535,
      "mode": "chat"
    },
    "gemini-2.5-flash-preview-04-17": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.0006,
      "provider": "vertex_ai-language-models",
      "modelFamily": "unknown",
      "maxTokens": 65535,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 65535,
      "mode": "chat"
    },
    "gemini-2.0-flash": {
      "inputCostPer1000": 0.0001,
      "outputCostPer1000": 0.0004,
      "provider": "vertex_ai-language-models",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini-2.0-flash-lite": {
      "inputCostPer1000": 0.000075,
      "outputCostPer1000": 0.0003,
      "provider": "vertex_ai-language-models",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini-2.0-flash-lite-001": {
      "inputCostPer1000": 0.000075,
      "outputCostPer1000": 0.0003,
      "provider": "vertex_ai-language-models",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini-2.5-pro-preview-06-05": {
      "inputCostPer1000": 0.00125,
      "outputCostPer1000": 0.01,
      "provider": "vertex_ai-language-models",
      "modelFamily": "unknown",
      "maxTokens": 65535,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 65535,
      "mode": "chat"
    },
    "gemini-2.5-pro-preview-05-06": {
      "inputCostPer1000": 0.00125,
      "outputCostPer1000": 0.01,
      "provider": "vertex_ai-language-models",
      "modelFamily": "unknown",
      "maxTokens": 65535,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 65535,
      "mode": "chat"
    },
    "gemini-2.5-pro-preview-03-25": {
      "inputCostPer1000": 0.00125,
      "outputCostPer1000": 0.01,
      "provider": "vertex_ai-language-models",
      "modelFamily": "unknown",
      "maxTokens": 65535,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 65535,
      "mode": "chat"
    },
    "gemini-2.0-flash-preview-image-generation": {
      "inputCostPer1000": 0.0001,
      "outputCostPer1000": 0.0004,
      "provider": "vertex_ai-language-models",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini-2.5-pro-preview-tts": {
      "inputCostPer1000": 0.00125,
      "outputCostPer1000": 0.01,
      "provider": "vertex_ai-language-models",
      "modelFamily": "unknown",
      "maxTokens": 65535,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 65535,
      "mode": "chat"
    }
  },
  "vertex_ai-vision-models": {
    "gemini-pro-vision": {
      "inputCostPer1000": 0.0005,
      "outputCostPer1000": 0.0015,
      "provider": "vertex_ai-vision-models",
      "modelFamily": "unknown",
      "maxTokens": 2048,
      "maxInputTokens": 16384,
      "maxOutputTokens": 2048,
      "mode": "chat"
    },
    "gemini-1.0-pro-vision": {
      "inputCostPer1000": 0.0005,
      "outputCostPer1000": 0.0015,
      "provider": "vertex_ai-vision-models",
      "modelFamily": "gemini-1.0",
      "maxTokens": 2048,
      "maxInputTokens": 16384,
      "maxOutputTokens": 2048,
      "mode": "chat"
    },
    "gemini-1.0-pro-vision-001": {
      "inputCostPer1000": 0.0005,
      "outputCostPer1000": 0.0015,
      "provider": "vertex_ai-vision-models",
      "modelFamily": "gemini-1.0",
      "maxTokens": 2048,
      "maxInputTokens": 16384,
      "maxOutputTokens": 2048,
      "mode": "chat"
    }
  },
  "google": {
    "gemini/gemini-2.5-flash-preview-tts": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.0006,
      "provider": "google",
      "modelFamily": "unknown",
      "maxTokens": 65535,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 65535,
      "mode": "chat"
    },
    "gemini/gemini-2.5-flash-preview-05-20": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.0006,
      "provider": "google",
      "modelFamily": "unknown",
      "maxTokens": 65535,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 65535,
      "mode": "chat"
    },
    "gemini/gemini-2.5-flash-preview-04-17": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.0006,
      "provider": "google",
      "modelFamily": "unknown",
      "maxTokens": 65535,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 65535,
      "mode": "chat"
    },
    "gemini/gemini-2.0-flash-preview-image-generation": {
      "inputCostPer1000": 0.0001,
      "outputCostPer1000": 0.0004,
      "provider": "google",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini/gemini-2.0-flash": {
      "inputCostPer1000": 0.0001,
      "outputCostPer1000": 0.0004,
      "provider": "google",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini/gemini-2.0-flash-lite": {
      "inputCostPer1000": 0.000075,
      "outputCostPer1000": 0.0003,
      "provider": "google",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini/gemini-2.0-flash-001": {
      "inputCostPer1000": 0.0001,
      "outputCostPer1000": 0.0004,
      "provider": "google",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini/gemini-2.5-pro-preview-tts": {
      "inputCostPer1000": 0.00125,
      "outputCostPer1000": 0.01,
      "provider": "google",
      "modelFamily": "unknown",
      "maxTokens": 65535,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 65535,
      "mode": "chat"
    },
    "gemini/gemini-2.5-pro-preview-06-05": {
      "inputCostPer1000": 0.00125,
      "outputCostPer1000": 0.01,
      "provider": "google",
      "modelFamily": "unknown",
      "maxTokens": 65535,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 65535,
      "mode": "chat"
    },
    "gemini/gemini-2.5-pro-preview-05-06": {
      "inputCostPer1000": 0.00125,
      "outputCostPer1000": 0.01,
      "provider": "google",
      "modelFamily": "unknown",
      "maxTokens": 65535,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 65535,
      "mode": "chat"
    },
    "gemini/gemini-2.5-pro-preview-03-25": {
      "inputCostPer1000": 0.00125,
      "outputCostPer1000": 0.01,
      "provider": "google",
      "modelFamily": "unknown",
      "maxTokens": 65535,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 65535,
      "mode": "chat"
    },
    "gemini/gemini-2.0-flash-lite-preview-02-05": {
      "inputCostPer1000": 0.000075,
      "outputCostPer1000": 0.0003,
      "provider": "google",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "palm/chat-bison": {
      "inputCostPer1000": 0.000125,
      "outputCostPer1000": 0.000125,
      "provider": "google",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 8192,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "palm/chat-bison-001": {
      "inputCostPer1000": 0.000125,
      "outputCostPer1000": 0.000125,
      "provider": "google",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 8192,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "palm/text-bison": {
      "inputCostPer1000": 0.000125,
      "outputCostPer1000": 0.000125,
      "provider": "google",
      "modelFamily": "unknown",
      "maxTokens": 1024,
      "maxInputTokens": 8192,
      "maxOutputTokens": 1024,
      "mode": "completion"
    },
    "palm/text-bison-001": {
      "inputCostPer1000": 0.000125,
      "outputCostPer1000": 0.000125,
      "provider": "google",
      "modelFamily": "unknown",
      "maxTokens": 1024,
      "maxInputTokens": 8192,
      "maxOutputTokens": 1024,
      "mode": "completion"
    },
    "palm/text-bison-safety-off": {
      "inputCostPer1000": 0.000125,
      "outputCostPer1000": 0.000125,
      "provider": "google",
      "modelFamily": "unknown",
      "maxTokens": 1024,
      "maxInputTokens": 8192,
      "maxOutputTokens": 1024,
      "mode": "completion"
    },
    "palm/text-bison-safety-recitation-off": {
      "inputCostPer1000": 0.000125,
      "outputCostPer1000": 0.000125,
      "provider": "google",
      "modelFamily": "unknown",
      "maxTokens": 1024,
      "maxInputTokens": 8192,
      "maxOutputTokens": 1024,
      "mode": "completion"
    },
    "gemini/gemini-1.5-flash-002": {
      "inputCostPer1000": 0.000075,
      "outputCostPer1000": 0.0003,
      "provider": "google",
      "modelFamily": "gemini-1.5",
      "maxTokens": 8192,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini/gemini-1.5-flash-001": {
      "inputCostPer1000": 0.000075,
      "outputCostPer1000": 0.0003,
      "provider": "google",
      "modelFamily": "gemini-1.5",
      "maxTokens": 8192,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini/gemini-1.5-flash": {
      "inputCostPer1000": 0.000075,
      "outputCostPer1000": 0.0003,
      "provider": "google",
      "modelFamily": "gemini-1.5",
      "maxTokens": 8192,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini/gemini-1.5-flash-latest": {
      "inputCostPer1000": 0.000075,
      "outputCostPer1000": 0.0003,
      "provider": "google",
      "modelFamily": "gemini-1.5",
      "maxTokens": 8192,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini/gemini-pro": {
      "inputCostPer1000": 0.00035,
      "outputCostPer1000": 0.00105,
      "provider": "google",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 32760,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini/gemini-1.5-pro": {
      "inputCostPer1000": 0.0035,
      "outputCostPer1000": 0.0105,
      "provider": "google",
      "modelFamily": "gemini-1.5",
      "maxTokens": 8192,
      "maxInputTokens": 2097152,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini/gemini-1.5-pro-002": {
      "inputCostPer1000": 0.0035,
      "outputCostPer1000": 0.0105,
      "provider": "google",
      "modelFamily": "gemini-1.5",
      "maxTokens": 8192,
      "maxInputTokens": 2097152,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini/gemini-1.5-pro-001": {
      "inputCostPer1000": 0.0035,
      "outputCostPer1000": 0.0105,
      "provider": "google",
      "modelFamily": "gemini-1.5",
      "maxTokens": 8192,
      "maxInputTokens": 2097152,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini/gemini-1.5-pro-exp-0801": {
      "inputCostPer1000": 0.0035,
      "outputCostPer1000": 0.0105,
      "provider": "google",
      "modelFamily": "gemini-1.5",
      "maxTokens": 8192,
      "maxInputTokens": 2097152,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini/gemini-1.5-pro-latest": {
      "inputCostPer1000": 0.0035,
      "outputCostPer1000": 0.00105,
      "provider": "google",
      "modelFamily": "gemini-1.5",
      "maxTokens": 8192,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini/gemini-pro-vision": {
      "inputCostPer1000": 0.00035,
      "outputCostPer1000": 0.00105,
      "provider": "google",
      "modelFamily": "unknown",
      "maxTokens": 2048,
      "maxInputTokens": 30720,
      "maxOutputTokens": 2048,
      "mode": "chat"
    },
    "gemini/gemini-gemma-2-27b-it": {
      "inputCostPer1000": 0.00035,
      "outputCostPer1000": 0.00105,
      "provider": "google",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": null,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "gemini/gemini-gemma-2-9b-it": {
      "inputCostPer1000": 0.00035,
      "outputCostPer1000": 0.00105,
      "provider": "google",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": null,
      "maxOutputTokens": 8192,
      "mode": "chat"
    }
  },
  "vertex_ai-anthropic_models": {
    "vertex_ai/claude-3-sonnet": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "vertex_ai-anthropic_models",
      "modelFamily": "claude-3",
      "maxTokens": 4096,
      "maxInputTokens": 200000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "vertex_ai/claude-3-sonnet@20240229": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "vertex_ai-anthropic_models",
      "modelFamily": "claude-3",
      "maxTokens": 4096,
      "maxInputTokens": 200000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "vertex_ai/claude-3-5-sonnet": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "vertex_ai-anthropic_models",
      "modelFamily": "claude-3",
      "maxTokens": 8192,
      "maxInputTokens": 200000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "vertex_ai/claude-3-5-sonnet@20240620": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "vertex_ai-anthropic_models",
      "modelFamily": "claude-3",
      "maxTokens": 8192,
      "maxInputTokens": 200000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "vertex_ai/claude-3-5-sonnet-v2": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "vertex_ai-anthropic_models",
      "modelFamily": "claude-3",
      "maxTokens": 8192,
      "maxInputTokens": 200000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "vertex_ai/claude-3-5-sonnet-v2@20241022": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "vertex_ai-anthropic_models",
      "modelFamily": "claude-3",
      "maxTokens": 8192,
      "maxInputTokens": 200000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "vertex_ai/claude-3-7-sonnet@20250219": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "vertex_ai-anthropic_models",
      "modelFamily": "claude-3",
      "maxTokens": 8192,
      "maxInputTokens": 200000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "vertex_ai/claude-opus-4@20250514": {
      "inputCostPer1000": 0.015,
      "outputCostPer1000": 0.075,
      "provider": "vertex_ai-anthropic_models",
      "modelFamily": "unknown",
      "maxTokens": 32000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 32000,
      "mode": "chat"
    },
    "vertex_ai/claude-sonnet-4@20250514": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "vertex_ai-anthropic_models",
      "modelFamily": "unknown",
      "maxTokens": 64000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 64000,
      "mode": "chat"
    },
    "vertex_ai/claude-3-haiku": {
      "inputCostPer1000": 0.00025,
      "outputCostPer1000": 0.00125,
      "provider": "vertex_ai-anthropic_models",
      "modelFamily": "claude-3",
      "maxTokens": 4096,
      "maxInputTokens": 200000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "vertex_ai/claude-3-haiku@20240307": {
      "inputCostPer1000": 0.00025,
      "outputCostPer1000": 0.00125,
      "provider": "vertex_ai-anthropic_models",
      "modelFamily": "claude-3",
      "maxTokens": 4096,
      "maxInputTokens": 200000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "vertex_ai/claude-3-5-haiku": {
      "inputCostPer1000": 0.001,
      "outputCostPer1000": 0.005,
      "provider": "vertex_ai-anthropic_models",
      "modelFamily": "claude-3",
      "maxTokens": 8192,
      "maxInputTokens": 200000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "vertex_ai/claude-3-5-haiku@20241022": {
      "inputCostPer1000": 0.001,
      "outputCostPer1000": 0.005,
      "provider": "vertex_ai-anthropic_models",
      "modelFamily": "claude-3",
      "maxTokens": 8192,
      "maxInputTokens": 200000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "vertex_ai/claude-3-opus": {
      "inputCostPer1000": 0.015,
      "outputCostPer1000": 0.075,
      "provider": "vertex_ai-anthropic_models",
      "modelFamily": "claude-3",
      "maxTokens": 4096,
      "maxInputTokens": 200000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "vertex_ai/claude-3-opus@20240229": {
      "inputCostPer1000": 0.015,
      "outputCostPer1000": 0.075,
      "provider": "vertex_ai-anthropic_models",
      "modelFamily": "claude-3",
      "maxTokens": 4096,
      "maxInputTokens": 200000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    }
  },
  "vertex_ai-llama_models": {
    "vertex_ai/meta/llama-4-scout-17b-16e-instruct-maas": {
      "inputCostPer1000": 0.00025,
      "outputCostPer1000": 0.0007,
      "provider": "vertex_ai-llama_models",
      "modelFamily": "unknown",
      "maxTokens": 10000000,
      "maxInputTokens": 10000000,
      "maxOutputTokens": 10000000,
      "mode": "chat"
    },
    "vertex_ai/meta/llama-4-scout-17b-128e-instruct-maas": {
      "inputCostPer1000": 0.00025,
      "outputCostPer1000": 0.0007,
      "provider": "vertex_ai-llama_models",
      "modelFamily": "unknown",
      "maxTokens": 10000000,
      "maxInputTokens": 10000000,
      "maxOutputTokens": 10000000,
      "mode": "chat"
    },
    "vertex_ai/meta/llama-4-maverick-17b-128e-instruct-maas": {
      "inputCostPer1000": 0.00035,
      "outputCostPer1000": 0.00115,
      "provider": "vertex_ai-llama_models",
      "modelFamily": "unknown",
      "maxTokens": 1000000,
      "maxInputTokens": 1000000,
      "maxOutputTokens": 1000000,
      "mode": "chat"
    },
    "vertex_ai/meta/llama-4-maverick-17b-16e-instruct-maas": {
      "inputCostPer1000": 0.00035,
      "outputCostPer1000": 0.00115,
      "provider": "vertex_ai-llama_models",
      "modelFamily": "unknown",
      "maxTokens": 1000000,
      "maxInputTokens": 1000000,
      "maxOutputTokens": 1000000,
      "mode": "chat"
    }
  },
  "vertex_ai-mistral_models": {
    "vertex_ai/mistral-large@latest": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.006,
      "provider": "vertex_ai-mistral_models",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 128000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "vertex_ai/mistral-large@2411-001": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.006,
      "provider": "vertex_ai-mistral_models",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 128000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "vertex_ai/mistral-large-2411": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.006,
      "provider": "vertex_ai-mistral_models",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 128000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "vertex_ai/mistral-large@2407": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.006,
      "provider": "vertex_ai-mistral_models",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 128000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "vertex_ai/mistral-nemo@latest": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.00015,
      "provider": "vertex_ai-mistral_models",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 128000,
      "mode": "chat"
    },
    "vertex_ai/mistral-small-2503@001": {
      "inputCostPer1000": 0.001,
      "outputCostPer1000": 0.003,
      "provider": "vertex_ai-mistral_models",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 32000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "vertex_ai/mistral-small-2503": {
      "inputCostPer1000": 0.001,
      "outputCostPer1000": 0.003,
      "provider": "vertex_ai-mistral_models",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 128000,
      "mode": "chat"
    },
    "vertex_ai/mistral-nemo@2407": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.003,
      "provider": "vertex_ai-mistral_models",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 128000,
      "mode": "chat"
    },
    "vertex_ai/codestral@latest": {
      "inputCostPer1000": 0.0002,
      "outputCostPer1000": 0.0006,
      "provider": "vertex_ai-mistral_models",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 128000,
      "mode": "chat"
    },
    "vertex_ai/codestral@2405": {
      "inputCostPer1000": 0.0002,
      "outputCostPer1000": 0.0006,
      "provider": "vertex_ai-mistral_models",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 128000,
      "mode": "chat"
    },
    "vertex_ai/codestral-2501": {
      "inputCostPer1000": 0.0002,
      "outputCostPer1000": 0.0006,
      "provider": "vertex_ai-mistral_models",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 128000,
      "mode": "chat"
    }
  },
  "vertex_ai-ai21_models": {
    "vertex_ai/jamba-1.5-mini@001": {
      "inputCostPer1000": 0.0002,
      "outputCostPer1000": 0.0004,
      "provider": "vertex_ai-ai21_models",
      "modelFamily": "unknown",
      "maxTokens": 256000,
      "maxInputTokens": 256000,
      "maxOutputTokens": 256000,
      "mode": "chat"
    },
    "vertex_ai/jamba-1.5-large@001": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.008,
      "provider": "vertex_ai-ai21_models",
      "modelFamily": "unknown",
      "maxTokens": 256000,
      "maxInputTokens": 256000,
      "maxOutputTokens": 256000,
      "mode": "chat"
    },
    "vertex_ai/jamba-1.5": {
      "inputCostPer1000": 0.0002,
      "outputCostPer1000": 0.0004,
      "provider": "vertex_ai-ai21_models",
      "modelFamily": "unknown",
      "maxTokens": 256000,
      "maxInputTokens": 256000,
      "maxOutputTokens": 256000,
      "mode": "chat"
    },
    "vertex_ai/jamba-1.5-mini": {
      "inputCostPer1000": 0.0002,
      "outputCostPer1000": 0.0004,
      "provider": "vertex_ai-ai21_models",
      "modelFamily": "unknown",
      "maxTokens": 256000,
      "maxInputTokens": 256000,
      "maxOutputTokens": 256000,
      "mode": "chat"
    },
    "vertex_ai/jamba-1.5-large": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.008,
      "provider": "vertex_ai-ai21_models",
      "modelFamily": "unknown",
      "maxTokens": 256000,
      "maxInputTokens": 256000,
      "maxOutputTokens": 256000,
      "mode": "chat"
    }
  },
  "cohere_chat": {
    "command-a-03-2025": {
      "inputCostPer1000": 0.0025,
      "outputCostPer1000": 0.01,
      "provider": "cohere_chat",
      "modelFamily": "unknown",
      "maxTokens": 8000,
      "maxInputTokens": 256000,
      "maxOutputTokens": 8000,
      "mode": "chat"
    },
    "command-r": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.0006,
      "provider": "cohere_chat",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "command-r-08-2024": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.0006,
      "provider": "cohere_chat",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "command-r7b-12-2024": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.000038,
      "provider": "cohere_chat",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "command-light": {
      "inputCostPer1000": 0.0003,
      "outputCostPer1000": 0.0006,
      "provider": "cohere_chat",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "command-r-plus": {
      "inputCostPer1000": 0.0025,
      "outputCostPer1000": 0.01,
      "provider": "cohere_chat",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "command-r-plus-08-2024": {
      "inputCostPer1000": 0.0025,
      "outputCostPer1000": 0.01,
      "provider": "cohere_chat",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    }
  },
  "cohere": {
    "command-nightly": {
      "inputCostPer1000": 0.001,
      "outputCostPer1000": 0.002,
      "provider": "cohere",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "completion"
    },
    "command": {
      "inputCostPer1000": 0.001,
      "outputCostPer1000": 0.002,
      "provider": "cohere",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "completion"
    }
  },
  "replicate": {
    "replicate/meta/llama-2-13b": {
      "inputCostPer1000": 0.0001,
      "outputCostPer1000": 0.0005,
      "provider": "replicate",
      "modelFamily": "llama-2",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "replicate/meta/llama-2-13b-chat": {
      "inputCostPer1000": 0.0001,
      "outputCostPer1000": 0.0005,
      "provider": "replicate",
      "modelFamily": "llama-2",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "replicate/meta/llama-2-70b": {
      "inputCostPer1000": 0.00065,
      "outputCostPer1000": 0.00275,
      "provider": "replicate",
      "modelFamily": "llama-2",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "replicate/meta/llama-2-70b-chat": {
      "inputCostPer1000": 0.00065,
      "outputCostPer1000": 0.00275,
      "provider": "replicate",
      "modelFamily": "llama-2",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "replicate/meta/llama-2-7b": {
      "inputCostPer1000": 0.00005,
      "outputCostPer1000": 0.00025,
      "provider": "replicate",
      "modelFamily": "llama-2",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "replicate/meta/llama-2-7b-chat": {
      "inputCostPer1000": 0.00005,
      "outputCostPer1000": 0.00025,
      "provider": "replicate",
      "modelFamily": "llama-2",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "replicate/meta/llama-3-70b": {
      "inputCostPer1000": 0.00065,
      "outputCostPer1000": 0.00275,
      "provider": "replicate",
      "modelFamily": "llama-3",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "replicate/meta/llama-3-70b-instruct": {
      "inputCostPer1000": 0.00065,
      "outputCostPer1000": 0.00275,
      "provider": "replicate",
      "modelFamily": "llama-3",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "replicate/meta/llama-3-8b": {
      "inputCostPer1000": 0.00005,
      "outputCostPer1000": 0.00025,
      "provider": "replicate",
      "modelFamily": "llama-3",
      "maxTokens": 8086,
      "maxInputTokens": 8086,
      "maxOutputTokens": 8086,
      "mode": "chat"
    },
    "replicate/meta/llama-3-8b-instruct": {
      "inputCostPer1000": 0.00005,
      "outputCostPer1000": 0.00025,
      "provider": "replicate",
      "modelFamily": "llama-3",
      "maxTokens": 8086,
      "maxInputTokens": 8086,
      "maxOutputTokens": 8086,
      "mode": "chat"
    },
    "replicate/mistralai/mistral-7b-v0.1": {
      "inputCostPer1000": 0.00005,
      "outputCostPer1000": 0.00025,
      "provider": "replicate",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "replicate/mistralai/mistral-7b-instruct-v0.2": {
      "inputCostPer1000": 0.00005,
      "outputCostPer1000": 0.00025,
      "provider": "replicate",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "replicate/mistralai/mixtral-8x7b-instruct-v0.1": {
      "inputCostPer1000": 0.0003,
      "outputCostPer1000": 0.001,
      "provider": "replicate",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    }
  },
  "openrouter": {
    "openrouter/deepseek/deepseek-r1": {
      "inputCostPer1000": 0.00055,
      "outputCostPer1000": 0.00219,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 65336,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "openrouter/deepseek/deepseek-chat": {
      "inputCostPer1000": 0.00014,
      "outputCostPer1000": 0.00028,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 65536,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "openrouter/deepseek/deepseek-coder": {
      "inputCostPer1000": 0.00014,
      "outputCostPer1000": 0.00028,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 66000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "openrouter/microsoft/wizardlm-2-8x22b:nitro": {
      "inputCostPer1000": 0.001,
      "outputCostPer1000": 0.001,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 65536,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "openrouter/google/gemini-pro-1.5": {
      "inputCostPer1000": 0.0025,
      "outputCostPer1000": 0.0075,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 1000000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "openrouter/google/gemini-2.0-flash-001": {
      "inputCostPer1000": 0.0001,
      "outputCostPer1000": 0.0004,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 1048576,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "openrouter/mistralai/mixtral-8x22b-instruct": {
      "inputCostPer1000": 0.00065,
      "outputCostPer1000": 0.00065,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 65536,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "openrouter/cohere/command-r-plus": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "openrouter/databricks/dbrx-instruct": {
      "inputCostPer1000": 0.0006,
      "outputCostPer1000": 0.0006,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 32768,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "openrouter/anthropic/claude-3-haiku": {
      "inputCostPer1000": 0.00025,
      "outputCostPer1000": 0.00125,
      "provider": "openrouter",
      "modelFamily": "claude-3",
      "maxTokens": 200000,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "openrouter/anthropic/claude-3-5-haiku": {
      "inputCostPer1000": 0.001,
      "outputCostPer1000": 0.005,
      "provider": "openrouter",
      "modelFamily": "claude-3",
      "maxTokens": 200000,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "openrouter/anthropic/claude-3-haiku-20240307": {
      "inputCostPer1000": 0.00025,
      "outputCostPer1000": 0.00125,
      "provider": "openrouter",
      "modelFamily": "claude-3",
      "maxTokens": 4096,
      "maxInputTokens": 200000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "openrouter/anthropic/claude-3-5-haiku-20241022": {
      "inputCostPer1000": 0.001,
      "outputCostPer1000": 0.005,
      "provider": "openrouter",
      "modelFamily": "claude-3",
      "maxTokens": 8192,
      "maxInputTokens": 200000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "openrouter/anthropic/claude-3.5-sonnet": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "openrouter",
      "modelFamily": "claude-3.5",
      "maxTokens": 8192,
      "maxInputTokens": 200000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "openrouter/anthropic/claude-3.5-sonnet:beta": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "openrouter",
      "modelFamily": "claude-3.5",
      "maxTokens": 8192,
      "maxInputTokens": 200000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "openrouter/anthropic/claude-3.7-sonnet": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "openrouter",
      "modelFamily": "claude-3",
      "maxTokens": 8192,
      "maxInputTokens": 200000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "openrouter/anthropic/claude-3.7-sonnet:beta": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "openrouter",
      "modelFamily": "claude-3",
      "maxTokens": 8192,
      "maxInputTokens": 200000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "openrouter/anthropic/claude-3-sonnet": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "openrouter",
      "modelFamily": "claude-3",
      "maxTokens": 200000,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "openrouter/mistralai/mistral-large": {
      "inputCostPer1000": 0.008,
      "outputCostPer1000": 0.024,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 32000,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "mistralai/mistral-small-3.1-24b-instruct": {
      "inputCostPer1000": 0.0001,
      "outputCostPer1000": 0.0003,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 32000,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "openrouter/cognitivecomputations/dolphin-mixtral-8x7b": {
      "inputCostPer1000": 0.0005,
      "outputCostPer1000": 0.0005,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 32769,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "openrouter/google/gemini-pro-vision": {
      "inputCostPer1000": 0.000125,
      "outputCostPer1000": 0.000375,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 45875,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "openrouter/fireworks/firellava-13b": {
      "inputCostPer1000": 0.0002,
      "outputCostPer1000": 0.0002,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "openrouter/meta-llama/llama-3-8b-instruct:extended": {
      "inputCostPer1000": 0.000225,
      "outputCostPer1000": 0.00225,
      "provider": "openrouter",
      "modelFamily": "llama-3",
      "maxTokens": 16384,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "openrouter/meta-llama/llama-3-70b-instruct:nitro": {
      "inputCostPer1000": 0.0009,
      "outputCostPer1000": 0.0009,
      "provider": "openrouter",
      "modelFamily": "llama-3",
      "maxTokens": 8192,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "openrouter/meta-llama/llama-3-70b-instruct": {
      "inputCostPer1000": 0.00059,
      "outputCostPer1000": 0.00079,
      "provider": "openrouter",
      "modelFamily": "llama-3",
      "maxTokens": 8192,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "openrouter/openai/o1": {
      "inputCostPer1000": 0.015,
      "outputCostPer1000": 0.06,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 100000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 100000,
      "mode": "chat"
    },
    "openrouter/openai/o1-mini": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.012,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 65536,
      "maxInputTokens": 128000,
      "maxOutputTokens": 65536,
      "mode": "chat"
    },
    "openrouter/openai/o1-mini-2024-09-12": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.012,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 65536,
      "maxInputTokens": 128000,
      "maxOutputTokens": 65536,
      "mode": "chat"
    },
    "openrouter/openai/o1-preview": {
      "inputCostPer1000": 0.015,
      "outputCostPer1000": 0.06,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 32768,
      "maxInputTokens": 128000,
      "maxOutputTokens": 32768,
      "mode": "chat"
    },
    "openrouter/openai/o1-preview-2024-09-12": {
      "inputCostPer1000": 0.015,
      "outputCostPer1000": 0.06,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 32768,
      "maxInputTokens": 128000,
      "maxOutputTokens": 32768,
      "mode": "chat"
    },
    "openrouter/openai/o3-mini": {
      "inputCostPer1000": 0.0011,
      "outputCostPer1000": 0.0044,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 65536,
      "maxInputTokens": 128000,
      "maxOutputTokens": 65536,
      "mode": "chat"
    },
    "openrouter/openai/o3-mini-high": {
      "inputCostPer1000": 0.0011,
      "outputCostPer1000": 0.0044,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 65536,
      "maxInputTokens": 128000,
      "maxOutputTokens": 65536,
      "mode": "chat"
    },
    "openrouter/openai/gpt-4o": {
      "inputCostPer1000": 0.0025,
      "outputCostPer1000": 0.01,
      "provider": "openrouter",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "openrouter/openai/gpt-4o-2024-05-13": {
      "inputCostPer1000": 0.005,
      "outputCostPer1000": 0.015,
      "provider": "openrouter",
      "modelFamily": "gpt-4",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "openrouter/openai/gpt-4-vision-preview": {
      "inputCostPer1000": 0.01,
      "outputCostPer1000": 0.03,
      "provider": "openrouter",
      "modelFamily": "gpt-4",
      "maxTokens": 130000,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "openrouter/openai/gpt-3.5-turbo": {
      "inputCostPer1000": 0.0015,
      "outputCostPer1000": 0.002,
      "provider": "openrouter",
      "modelFamily": "gpt-3.5",
      "maxTokens": 4095,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "openrouter/openai/gpt-3.5-turbo-16k": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.004,
      "provider": "openrouter",
      "modelFamily": "gpt-3.5",
      "maxTokens": 16383,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "openrouter/openai/gpt-4": {
      "inputCostPer1000": 0.03,
      "outputCostPer1000": 0.06,
      "provider": "openrouter",
      "modelFamily": "gpt-4",
      "maxTokens": 8192,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "openrouter/anthropic/claude-instant-v1": {
      "inputCostPer1000": 0.00163,
      "outputCostPer1000": 0.00551,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 100000,
      "maxInputTokens": null,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "openrouter/anthropic/claude-2": {
      "inputCostPer1000": 0.01102,
      "outputCostPer1000": 0.03268,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 100000,
      "maxInputTokens": null,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "openrouter/anthropic/claude-3-opus": {
      "inputCostPer1000": 0.015,
      "outputCostPer1000": 0.075,
      "provider": "openrouter",
      "modelFamily": "claude-3",
      "maxTokens": 4096,
      "maxInputTokens": 200000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "openrouter/google/palm-2-chat-bison": {
      "inputCostPer1000": 0.0005,
      "outputCostPer1000": 0.0005,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 25804,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "openrouter/google/palm-2-codechat-bison": {
      "inputCostPer1000": 0.0005,
      "outputCostPer1000": 0.0005,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 20070,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "openrouter/meta-llama/llama-2-13b-chat": {
      "inputCostPer1000": 0.0002,
      "outputCostPer1000": 0.0002,
      "provider": "openrouter",
      "modelFamily": "llama-2",
      "maxTokens": 4096,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "openrouter/meta-llama/llama-2-70b-chat": {
      "inputCostPer1000": 0.0015,
      "outputCostPer1000": 0.0015,
      "provider": "openrouter",
      "modelFamily": "llama-2",
      "maxTokens": 4096,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "openrouter/meta-llama/codellama-34b-instruct": {
      "inputCostPer1000": 0.0005,
      "outputCostPer1000": 0.0005,
      "provider": "openrouter",
      "modelFamily": "llama-3",
      "maxTokens": 8192,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "openrouter/nousresearch/nous-hermes-llama2-13b": {
      "inputCostPer1000": 0.0002,
      "outputCostPer1000": 0.0002,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "openrouter/mancer/weaver": {
      "inputCostPer1000": 0.005625,
      "outputCostPer1000": 0.005625,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 8000,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "openrouter/gryphe/mythomax-l2-13b": {
      "inputCostPer1000": 0.001875,
      "outputCostPer1000": 0.001875,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "openrouter/jondurbin/airoboros-l2-70b-2.1": {
      "inputCostPer1000": 0.013875,
      "outputCostPer1000": 0.013875,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "openrouter/undi95/remm-slerp-l2-13b": {
      "inputCostPer1000": 0.001875,
      "outputCostPer1000": 0.001875,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 6144,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "openrouter/pygmalionai/mythalion-13b": {
      "inputCostPer1000": 0.001875,
      "outputCostPer1000": 0.001875,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "openrouter/mistralai/mistral-7b-instruct": {
      "inputCostPer1000": 0.00013,
      "outputCostPer1000": 0.00013,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "openrouter/qwen/qwen-2.5-coder-32b-instruct": {
      "inputCostPer1000": 0.00018,
      "outputCostPer1000": 0.00018,
      "provider": "openrouter",
      "modelFamily": "unknown",
      "maxTokens": 33792,
      "maxInputTokens": 33792,
      "maxOutputTokens": 33792,
      "mode": "chat"
    }
  },
  "ai21": {
    "j2-ultra": {
      "inputCostPer1000": 0.015,
      "outputCostPer1000": 0.015,
      "provider": "ai21",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "completion"
    },
    "jamba-1.5-mini@001": {
      "inputCostPer1000": 0.0002,
      "outputCostPer1000": 0.0004,
      "provider": "ai21",
      "modelFamily": "unknown",
      "maxTokens": 256000,
      "maxInputTokens": 256000,
      "maxOutputTokens": 256000,
      "mode": "chat"
    },
    "jamba-1.5-large@001": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.008,
      "provider": "ai21",
      "modelFamily": "unknown",
      "maxTokens": 256000,
      "maxInputTokens": 256000,
      "maxOutputTokens": 256000,
      "mode": "chat"
    },
    "jamba-1.5": {
      "inputCostPer1000": 0.0002,
      "outputCostPer1000": 0.0004,
      "provider": "ai21",
      "modelFamily": "unknown",
      "maxTokens": 256000,
      "maxInputTokens": 256000,
      "maxOutputTokens": 256000,
      "mode": "chat"
    },
    "jamba-1.5-mini": {
      "inputCostPer1000": 0.0002,
      "outputCostPer1000": 0.0004,
      "provider": "ai21",
      "modelFamily": "unknown",
      "maxTokens": 256000,
      "maxInputTokens": 256000,
      "maxOutputTokens": 256000,
      "mode": "chat"
    },
    "jamba-1.5-large": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.008,
      "provider": "ai21",
      "modelFamily": "unknown",
      "maxTokens": 256000,
      "maxInputTokens": 256000,
      "maxOutputTokens": 256000,
      "mode": "chat"
    },
    "jamba-large-1.6": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.008,
      "provider": "ai21",
      "modelFamily": "unknown",
      "maxTokens": 256000,
      "maxInputTokens": 256000,
      "maxOutputTokens": 256000,
      "mode": "chat"
    },
    "jamba-mini-1.6": {
      "inputCostPer1000": 0.0002,
      "outputCostPer1000": 0.0004,
      "provider": "ai21",
      "modelFamily": "unknown",
      "maxTokens": 256000,
      "maxInputTokens": 256000,
      "maxOutputTokens": 256000,
      "mode": "chat"
    },
    "j2-mid": {
      "inputCostPer1000": 0.01,
      "outputCostPer1000": 0.01,
      "provider": "ai21",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "completion"
    },
    "j2-light": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.003,
      "provider": "ai21",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "completion"
    }
  },
  "nlp_cloud": {
    "dolphin": {
      "inputCostPer1000": 0.0005,
      "outputCostPer1000": 0.0005,
      "provider": "nlp_cloud",
      "modelFamily": "unknown",
      "maxTokens": 16384,
      "maxInputTokens": 16384,
      "maxOutputTokens": 16384,
      "mode": "completion"
    },
    "chatdolphin": {
      "inputCostPer1000": 0.0005,
      "outputCostPer1000": 0.0005,
      "provider": "nlp_cloud",
      "modelFamily": "unknown",
      "maxTokens": 16384,
      "maxInputTokens": 16384,
      "maxOutputTokens": 16384,
      "mode": "chat"
    }
  },
  "aleph_alpha": {
    "luminous-base": {
      "inputCostPer1000": 0.03,
      "outputCostPer1000": 0.033,
      "provider": "aleph_alpha",
      "modelFamily": "unknown",
      "maxTokens": 2048,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "completion"
    },
    "luminous-base-control": {
      "inputCostPer1000": 0.0375,
      "outputCostPer1000": 0.04125,
      "provider": "aleph_alpha",
      "modelFamily": "unknown",
      "maxTokens": 2048,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "luminous-extended": {
      "inputCostPer1000": 0.045,
      "outputCostPer1000": 0.0495,
      "provider": "aleph_alpha",
      "modelFamily": "unknown",
      "maxTokens": 2048,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "completion"
    },
    "luminous-extended-control": {
      "inputCostPer1000": 0.05625,
      "outputCostPer1000": 0.061875,
      "provider": "aleph_alpha",
      "modelFamily": "unknown",
      "maxTokens": 2048,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "luminous-supreme": {
      "inputCostPer1000": 0.175,
      "outputCostPer1000": 0.1925,
      "provider": "aleph_alpha",
      "modelFamily": "unknown",
      "maxTokens": 2048,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "completion"
    },
    "luminous-supreme-control": {
      "inputCostPer1000": 0.21875,
      "outputCostPer1000": 0.240625,
      "provider": "aleph_alpha",
      "modelFamily": "unknown",
      "maxTokens": 2048,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    }
  },
  "bedrock": {
    "ai21.j2-mid-v1": {
      "inputCostPer1000": 0.0125,
      "outputCostPer1000": 0.0125,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 8191,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "ai21.j2-ultra-v1": {
      "inputCostPer1000": 0.0188,
      "outputCostPer1000": 0.0188,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 8191,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "ai21.jamba-instruct-v1:0": {
      "inputCostPer1000": 0.0005,
      "outputCostPer1000": 0.0007,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 70000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "ai21.jamba-1-5-large-v1:0": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.008,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 256000,
      "maxInputTokens": 256000,
      "maxOutputTokens": 256000,
      "mode": "chat"
    },
    "ai21.jamba-1-5-mini-v1:0": {
      "inputCostPer1000": 0.0002,
      "outputCostPer1000": 0.0004,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 256000,
      "maxInputTokens": 256000,
      "maxOutputTokens": 256000,
      "mode": "chat"
    },
    "amazon.titan-text-lite-v1": {
      "inputCostPer1000": 0.0003,
      "outputCostPer1000": 0.0004,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 4000,
      "maxInputTokens": 42000,
      "maxOutputTokens": 4000,
      "mode": "chat"
    },
    "amazon.titan-text-express-v1": {
      "inputCostPer1000": 0.0013,
      "outputCostPer1000": 0.0017,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8000,
      "maxInputTokens": 42000,
      "maxOutputTokens": 8000,
      "mode": "chat"
    },
    "amazon.titan-text-premier-v1:0": {
      "inputCostPer1000": 0.0005,
      "outputCostPer1000": 0.0015,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 32000,
      "maxInputTokens": 42000,
      "maxOutputTokens": 32000,
      "mode": "chat"
    },
    "mistral.mistral-7b-instruct-v0:2": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.0002,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 32000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "mistral.mixtral-8x7b-instruct-v0:1": {
      "inputCostPer1000": 0.00045,
      "outputCostPer1000": 0.0007,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 32000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "mistral.mistral-large-2402-v1:0": {
      "inputCostPer1000": 0.008,
      "outputCostPer1000": 0.024,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 32000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "mistral.mistral-large-2407-v1:0": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.009,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 128000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "mistral.mistral-small-2402-v1:0": {
      "inputCostPer1000": 0.001,
      "outputCostPer1000": 0.003,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 32000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "bedrock/us-west-2/mistral.mixtral-8x7b-instruct-v0:1": {
      "inputCostPer1000": 0.00045,
      "outputCostPer1000": 0.0007,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 32000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "bedrock/us-east-1/mistral.mixtral-8x7b-instruct-v0:1": {
      "inputCostPer1000": 0.00045,
      "outputCostPer1000": 0.0007,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 32000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "bedrock/eu-west-3/mistral.mixtral-8x7b-instruct-v0:1": {
      "inputCostPer1000": 0.00059,
      "outputCostPer1000": 0.00091,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 32000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "bedrock/us-west-2/mistral.mistral-7b-instruct-v0:2": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.0002,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 32000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "bedrock/us-east-1/mistral.mistral-7b-instruct-v0:2": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.0002,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 32000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "bedrock/eu-west-3/mistral.mistral-7b-instruct-v0:2": {
      "inputCostPer1000": 0.0002,
      "outputCostPer1000": 0.00026,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 32000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "bedrock/us-east-1/mistral.mistral-large-2402-v1:0": {
      "inputCostPer1000": 0.008,
      "outputCostPer1000": 0.024,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 32000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "bedrock/us-west-2/mistral.mistral-large-2402-v1:0": {
      "inputCostPer1000": 0.008,
      "outputCostPer1000": 0.024,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 32000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "bedrock/eu-west-3/mistral.mistral-large-2402-v1:0": {
      "inputCostPer1000": 0.0104,
      "outputCostPer1000": 0.0312,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 32000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "anthropic.claude-3-sonnet-20240229-v1:0": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "bedrock",
      "modelFamily": "claude-3",
      "maxTokens": 4096,
      "maxInputTokens": 200000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "bedrock/invoke/anthropic.claude-3-5-sonnet-20240620-v1:0": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "bedrock",
      "modelFamily": "claude-3",
      "maxTokens": 4096,
      "maxInputTokens": 200000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "anthropic.claude-3-5-sonnet-20240620-v1:0": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "bedrock",
      "modelFamily": "claude-3",
      "maxTokens": 4096,
      "maxInputTokens": 200000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "anthropic.claude-3-5-sonnet-20241022-v2:0": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "bedrock",
      "modelFamily": "claude-3",
      "maxTokens": 8192,
      "maxInputTokens": 200000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "anthropic.claude-3-haiku-20240307-v1:0": {
      "inputCostPer1000": 0.00025,
      "outputCostPer1000": 0.00125,
      "provider": "bedrock",
      "modelFamily": "claude-3",
      "maxTokens": 4096,
      "maxInputTokens": 200000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "anthropic.claude-3-5-haiku-20241022-v1:0": {
      "inputCostPer1000": 0.0008,
      "outputCostPer1000": 0.004,
      "provider": "bedrock",
      "modelFamily": "claude-3",
      "maxTokens": 8192,
      "maxInputTokens": 200000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "anthropic.claude-3-opus-20240229-v1:0": {
      "inputCostPer1000": 0.015,
      "outputCostPer1000": 0.075,
      "provider": "bedrock",
      "modelFamily": "claude-3",
      "maxTokens": 4096,
      "maxInputTokens": 200000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "us.anthropic.claude-3-sonnet-20240229-v1:0": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "bedrock",
      "modelFamily": "claude-3",
      "maxTokens": 4096,
      "maxInputTokens": 200000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "us.anthropic.claude-3-5-sonnet-20240620-v1:0": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "bedrock",
      "modelFamily": "claude-3",
      "maxTokens": 4096,
      "maxInputTokens": 200000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "us.anthropic.claude-3-5-sonnet-20241022-v2:0": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "bedrock",
      "modelFamily": "claude-3",
      "maxTokens": 8192,
      "maxInputTokens": 200000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "us.anthropic.claude-3-haiku-20240307-v1:0": {
      "inputCostPer1000": 0.00025,
      "outputCostPer1000": 0.00125,
      "provider": "bedrock",
      "modelFamily": "claude-3",
      "maxTokens": 4096,
      "maxInputTokens": 200000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "us.anthropic.claude-3-5-haiku-20241022-v1:0": {
      "inputCostPer1000": 0.0008,
      "outputCostPer1000": 0.004,
      "provider": "bedrock",
      "modelFamily": "claude-3",
      "maxTokens": 8192,
      "maxInputTokens": 200000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "us.anthropic.claude-3-opus-20240229-v1:0": {
      "inputCostPer1000": 0.015,
      "outputCostPer1000": 0.075,
      "provider": "bedrock",
      "modelFamily": "claude-3",
      "maxTokens": 4096,
      "maxInputTokens": 200000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "eu.anthropic.claude-3-sonnet-20240229-v1:0": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "bedrock",
      "modelFamily": "claude-3",
      "maxTokens": 4096,
      "maxInputTokens": 200000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "eu.anthropic.claude-3-5-sonnet-20240620-v1:0": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "bedrock",
      "modelFamily": "claude-3",
      "maxTokens": 4096,
      "maxInputTokens": 200000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "eu.anthropic.claude-3-5-sonnet-20241022-v2:0": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "bedrock",
      "modelFamily": "claude-3",
      "maxTokens": 8192,
      "maxInputTokens": 200000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "eu.anthropic.claude-3-7-sonnet-20250219-v1:0": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "bedrock",
      "modelFamily": "claude-3",
      "maxTokens": 8192,
      "maxInputTokens": 200000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "eu.anthropic.claude-3-haiku-20240307-v1:0": {
      "inputCostPer1000": 0.00025,
      "outputCostPer1000": 0.00125,
      "provider": "bedrock",
      "modelFamily": "claude-3",
      "maxTokens": 4096,
      "maxInputTokens": 200000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "eu.anthropic.claude-3-5-haiku-20241022-v1:0": {
      "inputCostPer1000": 0.00025,
      "outputCostPer1000": 0.00125,
      "provider": "bedrock",
      "modelFamily": "claude-3",
      "maxTokens": 8192,
      "maxInputTokens": 200000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "eu.anthropic.claude-3-opus-20240229-v1:0": {
      "inputCostPer1000": 0.015,
      "outputCostPer1000": 0.075,
      "provider": "bedrock",
      "modelFamily": "claude-3",
      "maxTokens": 4096,
      "maxInputTokens": 200000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "anthropic.claude-v1": {
      "inputCostPer1000": 0.008,
      "outputCostPer1000": 0.024,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 100000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "bedrock/us-east-1/anthropic.claude-v1": {
      "inputCostPer1000": 0.008,
      "outputCostPer1000": 0.024,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 100000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "bedrock/us-west-2/anthropic.claude-v1": {
      "inputCostPer1000": 0.008,
      "outputCostPer1000": 0.024,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 100000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "bedrock/ap-northeast-1/anthropic.claude-v1": {
      "inputCostPer1000": 0.008,
      "outputCostPer1000": 0.024,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 100000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "bedrock/eu-central-1/anthropic.claude-v1": {
      "inputCostPer1000": 0.008,
      "outputCostPer1000": 0.024,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 100000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "anthropic.claude-v2": {
      "inputCostPer1000": 0.008,
      "outputCostPer1000": 0.024,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 100000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "bedrock/us-east-1/anthropic.claude-v2": {
      "inputCostPer1000": 0.008,
      "outputCostPer1000": 0.024,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 100000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "bedrock/us-west-2/anthropic.claude-v2": {
      "inputCostPer1000": 0.008,
      "outputCostPer1000": 0.024,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 100000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "bedrock/ap-northeast-1/anthropic.claude-v2": {
      "inputCostPer1000": 0.008,
      "outputCostPer1000": 0.024,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 100000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "bedrock/eu-central-1/anthropic.claude-v2": {
      "inputCostPer1000": 0.008,
      "outputCostPer1000": 0.024,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 100000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "anthropic.claude-v2:1": {
      "inputCostPer1000": 0.008,
      "outputCostPer1000": 0.024,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 100000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "bedrock/us-east-1/anthropic.claude-v2:1": {
      "inputCostPer1000": 0.008,
      "outputCostPer1000": 0.024,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 100000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "bedrock/us-west-2/anthropic.claude-v2:1": {
      "inputCostPer1000": 0.008,
      "outputCostPer1000": 0.024,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 100000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "bedrock/ap-northeast-1/anthropic.claude-v2:1": {
      "inputCostPer1000": 0.008,
      "outputCostPer1000": 0.024,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 100000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "bedrock/eu-central-1/anthropic.claude-v2:1": {
      "inputCostPer1000": 0.008,
      "outputCostPer1000": 0.024,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 100000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "anthropic.claude-instant-v1": {
      "inputCostPer1000": 0.0008,
      "outputCostPer1000": 0.0024,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 100000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "bedrock/us-east-1/anthropic.claude-instant-v1": {
      "inputCostPer1000": 0.0008,
      "outputCostPer1000": 0.0024,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 100000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "bedrock/us-west-2/anthropic.claude-instant-v1": {
      "inputCostPer1000": 0.0008,
      "outputCostPer1000": 0.0024,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 100000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "bedrock/ap-northeast-1/anthropic.claude-instant-v1": {
      "inputCostPer1000": 0.00223,
      "outputCostPer1000": 0.00755,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 100000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "bedrock/eu-central-1/anthropic.claude-instant-v1": {
      "inputCostPer1000": 0.00248,
      "outputCostPer1000": 0.00838,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 100000,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "cohere.command-text-v14": {
      "inputCostPer1000": 0.0015,
      "outputCostPer1000": 0.002,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "cohere.command-light-text-v14": {
      "inputCostPer1000": 0.0003,
      "outputCostPer1000": 0.0006,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "cohere.command-r-plus-v1:0": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "cohere.command-r-v1:0": {
      "inputCostPer1000": 0.0005,
      "outputCostPer1000": 0.0015,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "meta.llama2-13b-chat-v1": {
      "inputCostPer1000": 0.00075,
      "outputCostPer1000": 0.001,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "meta.llama2-70b-chat-v1": {
      "inputCostPer1000": 0.00195,
      "outputCostPer1000": 0.00256,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "meta.llama3-8b-instruct-v1:0": {
      "inputCostPer1000": 0.0003,
      "outputCostPer1000": 0.0006,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "bedrock/us-east-1/meta.llama3-8b-instruct-v1:0": {
      "inputCostPer1000": 0.0003,
      "outputCostPer1000": 0.0006,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "bedrock/us-west-1/meta.llama3-8b-instruct-v1:0": {
      "inputCostPer1000": 0.0003,
      "outputCostPer1000": 0.0006,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "bedrock/ap-south-1/meta.llama3-8b-instruct-v1:0": {
      "inputCostPer1000": 0.00036,
      "outputCostPer1000": 0.00072,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "bedrock/ca-central-1/meta.llama3-8b-instruct-v1:0": {
      "inputCostPer1000": 0.00035,
      "outputCostPer1000": 0.00069,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "bedrock/eu-west-1/meta.llama3-8b-instruct-v1:0": {
      "inputCostPer1000": 0.00032,
      "outputCostPer1000": 0.00065,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "bedrock/eu-west-2/meta.llama3-8b-instruct-v1:0": {
      "inputCostPer1000": 0.00039,
      "outputCostPer1000": 0.00078,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "bedrock/sa-east-1/meta.llama3-8b-instruct-v1:0": {
      "inputCostPer1000": 0.0005,
      "outputCostPer1000": 0.00101,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "meta.llama3-70b-instruct-v1:0": {
      "inputCostPer1000": 0.00265,
      "outputCostPer1000": 0.0035,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "bedrock/us-east-1/meta.llama3-70b-instruct-v1:0": {
      "inputCostPer1000": 0.00265,
      "outputCostPer1000": 0.0035,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "bedrock/us-west-1/meta.llama3-70b-instruct-v1:0": {
      "inputCostPer1000": 0.00265,
      "outputCostPer1000": 0.0035,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "bedrock/ap-south-1/meta.llama3-70b-instruct-v1:0": {
      "inputCostPer1000": 0.00318,
      "outputCostPer1000": 0.0042,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "bedrock/ca-central-1/meta.llama3-70b-instruct-v1:0": {
      "inputCostPer1000": 0.00305,
      "outputCostPer1000": 0.00403,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "bedrock/eu-west-1/meta.llama3-70b-instruct-v1:0": {
      "inputCostPer1000": 0.00286,
      "outputCostPer1000": 0.00378,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "bedrock/eu-west-2/meta.llama3-70b-instruct-v1:0": {
      "inputCostPer1000": 0.00345,
      "outputCostPer1000": 0.00455,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "bedrock/sa-east-1/meta.llama3-70b-instruct-v1:0": {
      "inputCostPer1000": 0.00445,
      "outputCostPer1000": 0.00588,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "meta.llama3-1-8b-instruct-v1:0": {
      "inputCostPer1000": 0.00022,
      "outputCostPer1000": 0.00022,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 2048,
      "mode": "chat"
    },
    "us.meta.llama3-1-8b-instruct-v1:0": {
      "inputCostPer1000": 0.00022,
      "outputCostPer1000": 0.00022,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 2048,
      "mode": "chat"
    },
    "meta.llama3-1-70b-instruct-v1:0": {
      "inputCostPer1000": 0.00099,
      "outputCostPer1000": 0.00099,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 2048,
      "mode": "chat"
    },
    "us.meta.llama3-1-70b-instruct-v1:0": {
      "inputCostPer1000": 0.00099,
      "outputCostPer1000": 0.00099,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 2048,
      "mode": "chat"
    },
    "meta.llama3-1-405b-instruct-v1:0": {
      "inputCostPer1000": 0.00532,
      "outputCostPer1000": 0.016,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "us.meta.llama3-1-405b-instruct-v1:0": {
      "inputCostPer1000": 0.00532,
      "outputCostPer1000": 0.016,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "meta.llama3-2-1b-instruct-v1:0": {
      "inputCostPer1000": 0.0001,
      "outputCostPer1000": 0.0001,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "us.meta.llama3-2-1b-instruct-v1:0": {
      "inputCostPer1000": 0.0001,
      "outputCostPer1000": 0.0001,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "eu.meta.llama3-2-1b-instruct-v1:0": {
      "inputCostPer1000": 0.00013,
      "outputCostPer1000": 0.00013,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "meta.llama3-2-3b-instruct-v1:0": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.00015,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "us.meta.llama3-2-3b-instruct-v1:0": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.00015,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "eu.meta.llama3-2-3b-instruct-v1:0": {
      "inputCostPer1000": 0.00019,
      "outputCostPer1000": 0.00019,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "meta.llama3-2-11b-instruct-v1:0": {
      "inputCostPer1000": 0.00035,
      "outputCostPer1000": 0.00035,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "us.meta.llama3-2-11b-instruct-v1:0": {
      "inputCostPer1000": 0.00035,
      "outputCostPer1000": 0.00035,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "meta.llama3-2-90b-instruct-v1:0": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.002,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "us.meta.llama3-2-90b-instruct-v1:0": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.002,
      "provider": "bedrock",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    }
  },
  "bedrock_converse": {
    "amazon.nova-micro-v1:0": {
      "inputCostPer1000": 0.000035,
      "outputCostPer1000": 0.00014,
      "provider": "bedrock_converse",
      "modelFamily": "unknown",
      "maxTokens": 10000,
      "maxInputTokens": 300000,
      "maxOutputTokens": 10000,
      "mode": "chat"
    },
    "us.amazon.nova-micro-v1:0": {
      "inputCostPer1000": 0.000035,
      "outputCostPer1000": 0.00014,
      "provider": "bedrock_converse",
      "modelFamily": "unknown",
      "maxTokens": 10000,
      "maxInputTokens": 300000,
      "maxOutputTokens": 10000,
      "mode": "chat"
    },
    "eu.amazon.nova-micro-v1:0": {
      "inputCostPer1000": 0.000046,
      "outputCostPer1000": 0.000184,
      "provider": "bedrock_converse",
      "modelFamily": "unknown",
      "maxTokens": 10000,
      "maxInputTokens": 300000,
      "maxOutputTokens": 10000,
      "mode": "chat"
    },
    "amazon.nova-lite-v1:0": {
      "inputCostPer1000": 0.00006,
      "outputCostPer1000": 0.00024,
      "provider": "bedrock_converse",
      "modelFamily": "unknown",
      "maxTokens": 10000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 10000,
      "mode": "chat"
    },
    "us.amazon.nova-lite-v1:0": {
      "inputCostPer1000": 0.00006,
      "outputCostPer1000": 0.00024,
      "provider": "bedrock_converse",
      "modelFamily": "unknown",
      "maxTokens": 10000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 10000,
      "mode": "chat"
    },
    "eu.amazon.nova-lite-v1:0": {
      "inputCostPer1000": 0.000078,
      "outputCostPer1000": 0.000312,
      "provider": "bedrock_converse",
      "modelFamily": "unknown",
      "maxTokens": 10000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 10000,
      "mode": "chat"
    },
    "amazon.nova-pro-v1:0": {
      "inputCostPer1000": 0.0008,
      "outputCostPer1000": 0.0032,
      "provider": "bedrock_converse",
      "modelFamily": "unknown",
      "maxTokens": 10000,
      "maxInputTokens": 300000,
      "maxOutputTokens": 10000,
      "mode": "chat"
    },
    "us.amazon.nova-pro-v1:0": {
      "inputCostPer1000": 0.0008,
      "outputCostPer1000": 0.0032,
      "provider": "bedrock_converse",
      "modelFamily": "unknown",
      "maxTokens": 10000,
      "maxInputTokens": 300000,
      "maxOutputTokens": 10000,
      "mode": "chat"
    },
    "eu.amazon.nova-pro-v1:0": {
      "inputCostPer1000": 0.00105,
      "outputCostPer1000": 0.0042,
      "provider": "bedrock_converse",
      "modelFamily": "unknown",
      "maxTokens": 10000,
      "maxInputTokens": 300000,
      "maxOutputTokens": 10000,
      "mode": "chat"
    },
    "us.amazon.nova-premier-v1:0": {
      "inputCostPer1000": 0.0025,
      "outputCostPer1000": 0.0125,
      "provider": "bedrock_converse",
      "modelFamily": "unknown",
      "maxTokens": 10000,
      "maxInputTokens": 1000000,
      "maxOutputTokens": 10000,
      "mode": "chat"
    },
    "anthropic.claude-opus-4-20250514-v1:0": {
      "inputCostPer1000": 0.015,
      "outputCostPer1000": 0.075,
      "provider": "bedrock_converse",
      "modelFamily": "unknown",
      "maxTokens": 32000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 32000,
      "mode": "chat"
    },
    "anthropic.claude-sonnet-4-20250514-v1:0": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "bedrock_converse",
      "modelFamily": "unknown",
      "maxTokens": 64000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 64000,
      "mode": "chat"
    },
    "anthropic.claude-3-7-sonnet-20250219-v1:0": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "bedrock_converse",
      "modelFamily": "claude-3",
      "maxTokens": 8192,
      "maxInputTokens": 200000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "us.anthropic.claude-3-7-sonnet-20250219-v1:0": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "bedrock_converse",
      "modelFamily": "claude-3",
      "maxTokens": 8192,
      "maxInputTokens": 200000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "us.anthropic.claude-opus-4-20250514-v1:0": {
      "inputCostPer1000": 0.015,
      "outputCostPer1000": 0.075,
      "provider": "bedrock_converse",
      "modelFamily": "unknown",
      "maxTokens": 32000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 32000,
      "mode": "chat"
    },
    "us.anthropic.claude-sonnet-4-20250514-v1:0": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "bedrock_converse",
      "modelFamily": "unknown",
      "maxTokens": 64000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 64000,
      "mode": "chat"
    },
    "eu.anthropic.claude-opus-4-20250514-v1:0": {
      "inputCostPer1000": 0.015,
      "outputCostPer1000": 0.075,
      "provider": "bedrock_converse",
      "modelFamily": "unknown",
      "maxTokens": 32000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 32000,
      "mode": "chat"
    },
    "eu.anthropic.claude-sonnet-4-20250514-v1:0": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "bedrock_converse",
      "modelFamily": "unknown",
      "maxTokens": 64000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 64000,
      "mode": "chat"
    },
    "us.deepseek.r1-v1:0": {
      "inputCostPer1000": 0.00135,
      "outputCostPer1000": 0.0054,
      "provider": "bedrock_converse",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "meta.llama3-3-70b-instruct-v1:0": {
      "inputCostPer1000": 0.00072,
      "outputCostPer1000": 0.00072,
      "provider": "bedrock_converse",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "us.meta.llama3-3-70b-instruct-v1:0": {
      "inputCostPer1000": 0.00072,
      "outputCostPer1000": 0.00072,
      "provider": "bedrock_converse",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "meta.llama4-maverick-17b-instruct-v1:0": {
      "inputCostPer1000": 0.00024,
      "outputCostPer1000": 0.00097,
      "provider": "bedrock_converse",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "us.meta.llama4-maverick-17b-instruct-v1:0": {
      "inputCostPer1000": 0.00024,
      "outputCostPer1000": 0.00097,
      "provider": "bedrock_converse",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "meta.llama4-scout-17b-instruct-v1:0": {
      "inputCostPer1000": 0.00017,
      "outputCostPer1000": 0.00066,
      "provider": "bedrock_converse",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "us.meta.llama4-scout-17b-instruct-v1:0": {
      "inputCostPer1000": 0.00017,
      "outputCostPer1000": 0.00066,
      "provider": "bedrock_converse",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 128000,
      "maxOutputTokens": 4096,
      "mode": "chat"
    }
  },
  "together": {
    "together-ai-up-to-4b": {
      "inputCostPer1000": 0.0001,
      "outputCostPer1000": 0.0001,
      "provider": "together",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "together-ai-4.1b-8b": {
      "inputCostPer1000": 0.0002,
      "outputCostPer1000": 0.0002,
      "provider": "together",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "together-ai-8.1b-21b": {
      "inputCostPer1000": 0.0003,
      "outputCostPer1000": 0.0003,
      "provider": "together",
      "modelFamily": "unknown",
      "maxTokens": 1000,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "together-ai-21.1b-41b": {
      "inputCostPer1000": 0.0008,
      "outputCostPer1000": 0.0008,
      "provider": "together",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "together-ai-41.1b-80b": {
      "inputCostPer1000": 0.0009,
      "outputCostPer1000": 0.0009,
      "provider": "together",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "together-ai-81.1b-110b": {
      "inputCostPer1000": 0.0018,
      "outputCostPer1000": 0.0018,
      "provider": "together",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "together_ai/meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo": {
      "inputCostPer1000": 0.00018,
      "outputCostPer1000": 0.00018,
      "provider": "together",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "together_ai/meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo": {
      "inputCostPer1000": 0.00088,
      "outputCostPer1000": 0.00088,
      "provider": "together",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "together_ai/meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo": {
      "inputCostPer1000": 0.0035,
      "outputCostPer1000": 0.0035,
      "provider": "together",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "together_ai/meta-llama/Llama-3.3-70B-Instruct-Turbo": {
      "inputCostPer1000": 0.00088,
      "outputCostPer1000": 0.00088,
      "provider": "together",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "together_ai/mistralai/Mixtral-8x7B-Instruct-v0.1": {
      "inputCostPer1000": 0.0006,
      "outputCostPer1000": 0.0006,
      "provider": "together",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    }
  },
  "deepinfra": {
    "deepinfra/lizpreciatior/lzlv_70b_fp16_hf": {
      "inputCostPer1000": 0.0007,
      "outputCostPer1000": 0.0009,
      "provider": "deepinfra",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "deepinfra/Gryphe/MythoMax-L2-13b": {
      "inputCostPer1000": 0.00022,
      "outputCostPer1000": 0.00022,
      "provider": "deepinfra",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "deepinfra/mistralai/Mistral-7B-Instruct-v0.1": {
      "inputCostPer1000": 0.00013,
      "outputCostPer1000": 0.00013,
      "provider": "deepinfra",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 32768,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "deepinfra/meta-llama/Llama-2-70b-chat-hf": {
      "inputCostPer1000": 0.0007,
      "outputCostPer1000": 0.0009,
      "provider": "deepinfra",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "deepinfra/cognitivecomputations/dolphin-2.6-mixtral-8x7b": {
      "inputCostPer1000": 0.00027,
      "outputCostPer1000": 0.00027,
      "provider": "deepinfra",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 32768,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "deepinfra/codellama/CodeLlama-34b-Instruct-hf": {
      "inputCostPer1000": 0.0006,
      "outputCostPer1000": 0.0006,
      "provider": "deepinfra",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "deepinfra/deepinfra/mixtral": {
      "inputCostPer1000": 0.00027,
      "outputCostPer1000": 0.00027,
      "provider": "deepinfra",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 32000,
      "maxOutputTokens": 4096,
      "mode": "completion"
    },
    "deepinfra/Phind/Phind-CodeLlama-34B-v2": {
      "inputCostPer1000": 0.0006,
      "outputCostPer1000": 0.0006,
      "provider": "deepinfra",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 16384,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "deepinfra/mistralai/Mixtral-8x7B-Instruct-v0.1": {
      "inputCostPer1000": 0.00027,
      "outputCostPer1000": 0.00027,
      "provider": "deepinfra",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 32768,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "deepinfra/deepinfra/airoboros-70b": {
      "inputCostPer1000": 0.0007,
      "outputCostPer1000": 0.0009,
      "provider": "deepinfra",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "deepinfra/01-ai/Yi-34B-Chat": {
      "inputCostPer1000": 0.0006,
      "outputCostPer1000": 0.0006,
      "provider": "deepinfra",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "deepinfra/01-ai/Yi-6B-200K": {
      "inputCostPer1000": 0.00013,
      "outputCostPer1000": 0.00013,
      "provider": "deepinfra",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 200000,
      "maxOutputTokens": 4096,
      "mode": "completion"
    },
    "deepinfra/jondurbin/airoboros-l2-70b-gpt4-1.4.1": {
      "inputCostPer1000": 0.0007,
      "outputCostPer1000": 0.0009,
      "provider": "deepinfra",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "deepinfra/meta-llama/Llama-2-13b-chat-hf": {
      "inputCostPer1000": 0.00022,
      "outputCostPer1000": 0.00022,
      "provider": "deepinfra",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "deepinfra/amazon/MistralLite": {
      "inputCostPer1000": 0.0002,
      "outputCostPer1000": 0.0002,
      "provider": "deepinfra",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 32768,
      "maxOutputTokens": 8191,
      "mode": "chat"
    },
    "deepinfra/meta-llama/Llama-2-7b-chat-hf": {
      "inputCostPer1000": 0.00013,
      "outputCostPer1000": 0.00013,
      "provider": "deepinfra",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "deepinfra/meta-llama/Meta-Llama-3-8B-Instruct": {
      "inputCostPer1000": 0.00008,
      "outputCostPer1000": 0.00008,
      "provider": "deepinfra",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 8191,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "deepinfra/meta-llama/Meta-Llama-3-70B-Instruct": {
      "inputCostPer1000": 0.00059,
      "outputCostPer1000": 0.00079,
      "provider": "deepinfra",
      "modelFamily": "unknown",
      "maxTokens": 8191,
      "maxInputTokens": 8191,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "deepinfra/meta-llama/Meta-Llama-3.1-405B-Instruct": {
      "inputCostPer1000": 0.0009,
      "outputCostPer1000": 0.0009,
      "provider": "deepinfra",
      "modelFamily": "unknown",
      "maxTokens": 32768,
      "maxInputTokens": 32768,
      "maxOutputTokens": 32768,
      "mode": "chat"
    },
    "deepinfra/01-ai/Yi-34B-200K": {
      "inputCostPer1000": 0.0006,
      "outputCostPer1000": 0.0006,
      "provider": "deepinfra",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 200000,
      "maxOutputTokens": 4096,
      "mode": "completion"
    },
    "deepinfra/openchat/openchat_3.5": {
      "inputCostPer1000": 0.00013,
      "outputCostPer1000": 0.00013,
      "provider": "deepinfra",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    }
  },
  "perplexity": {
    "perplexity/codellama-34b-instruct": {
      "inputCostPer1000": 0.00035,
      "outputCostPer1000": 0.0014,
      "provider": "perplexity",
      "modelFamily": "llama-3",
      "maxTokens": 16384,
      "maxInputTokens": 16384,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "perplexity/codellama-70b-instruct": {
      "inputCostPer1000": 0.0007,
      "outputCostPer1000": 0.0028,
      "provider": "perplexity",
      "modelFamily": "unknown",
      "maxTokens": 16384,
      "maxInputTokens": 16384,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "perplexity/llama-3.1-70b-instruct": {
      "inputCostPer1000": 0.001,
      "outputCostPer1000": 0.001,
      "provider": "perplexity",
      "modelFamily": "llama-3.1",
      "maxTokens": 131072,
      "maxInputTokens": 131072,
      "maxOutputTokens": 131072,
      "mode": "chat"
    },
    "perplexity/llama-3.1-8b-instruct": {
      "inputCostPer1000": 0.0002,
      "outputCostPer1000": 0.0002,
      "provider": "perplexity",
      "modelFamily": "llama-3.1",
      "maxTokens": 131072,
      "maxInputTokens": 131072,
      "maxOutputTokens": 131072,
      "mode": "chat"
    },
    "perplexity/llama-3.1-sonar-huge-128k-online": {
      "inputCostPer1000": 0.005,
      "outputCostPer1000": 0.005,
      "provider": "perplexity",
      "modelFamily": "llama-3.1",
      "maxTokens": 127072,
      "maxInputTokens": 127072,
      "maxOutputTokens": 127072,
      "mode": "chat"
    },
    "perplexity/llama-3.1-sonar-large-128k-online": {
      "inputCostPer1000": 0.001,
      "outputCostPer1000": 0.001,
      "provider": "perplexity",
      "modelFamily": "llama-3.1",
      "maxTokens": 127072,
      "maxInputTokens": 127072,
      "maxOutputTokens": 127072,
      "mode": "chat"
    },
    "perplexity/llama-3.1-sonar-large-128k-chat": {
      "inputCostPer1000": 0.001,
      "outputCostPer1000": 0.001,
      "provider": "perplexity",
      "modelFamily": "llama-3.1",
      "maxTokens": 131072,
      "maxInputTokens": 131072,
      "maxOutputTokens": 131072,
      "mode": "chat"
    },
    "perplexity/llama-3.1-sonar-small-128k-chat": {
      "inputCostPer1000": 0.0002,
      "outputCostPer1000": 0.0002,
      "provider": "perplexity",
      "modelFamily": "llama-3.1",
      "maxTokens": 131072,
      "maxInputTokens": 131072,
      "maxOutputTokens": 131072,
      "mode": "chat"
    },
    "perplexity/llama-3.1-sonar-small-128k-online": {
      "inputCostPer1000": 0.0002,
      "outputCostPer1000": 0.0002,
      "provider": "perplexity",
      "modelFamily": "llama-3.1",
      "maxTokens": 127072,
      "maxInputTokens": 127072,
      "maxOutputTokens": 127072,
      "mode": "chat"
    },
    "perplexity/pplx-7b-chat": {
      "inputCostPer1000": 0.00007,
      "outputCostPer1000": 0.00028,
      "provider": "perplexity",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "perplexity/pplx-70b-chat": {
      "inputCostPer1000": 0.0007,
      "outputCostPer1000": 0.0028,
      "provider": "perplexity",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "perplexity/llama-2-70b-chat": {
      "inputCostPer1000": 0.0007,
      "outputCostPer1000": 0.0028,
      "provider": "perplexity",
      "modelFamily": "llama-2",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "perplexity/mistral-7b-instruct": {
      "inputCostPer1000": 0.00007,
      "outputCostPer1000": 0.00028,
      "provider": "perplexity",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "perplexity/mixtral-8x7b-instruct": {
      "inputCostPer1000": 0.00007,
      "outputCostPer1000": 0.00028,
      "provider": "perplexity",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "perplexity/sonar-small-chat": {
      "inputCostPer1000": 0.00007,
      "outputCostPer1000": 0.00028,
      "provider": "perplexity",
      "modelFamily": "unknown",
      "maxTokens": 16384,
      "maxInputTokens": 16384,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "perplexity/sonar-medium-chat": {
      "inputCostPer1000": 0.0006,
      "outputCostPer1000": 0.0018,
      "provider": "perplexity",
      "modelFamily": "unknown",
      "maxTokens": 16384,
      "maxInputTokens": 16384,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "perplexity/sonar": {
      "inputCostPer1000": 0.001,
      "outputCostPer1000": 0.001,
      "provider": "perplexity",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "perplexity/sonar-pro": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.015,
      "provider": "perplexity",
      "modelFamily": "unknown",
      "maxTokens": 8000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 8000,
      "mode": "chat"
    },
    "perplexity/sonar-reasoning": {
      "inputCostPer1000": 0.001,
      "outputCostPer1000": 0.005,
      "provider": "perplexity",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "perplexity/sonar-reasoning-pro": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.008,
      "provider": "perplexity",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "perplexity/sonar-deep-research": {
      "inputCostPer1000": 0.002,
      "outputCostPer1000": 0.008,
      "provider": "perplexity",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": null,
      "mode": "chat"
    }
  },
  "fireworks_ai": {
    "fireworks_ai/accounts/fireworks/models/llama-v3p2-1b-instruct": {
      "inputCostPer1000": 0.0001,
      "outputCostPer1000": 0.0001,
      "provider": "fireworks_ai",
      "modelFamily": "unknown",
      "maxTokens": 16384,
      "maxInputTokens": 16384,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "fireworks_ai/accounts/fireworks/models/llama-v3p2-3b-instruct": {
      "inputCostPer1000": 0.0001,
      "outputCostPer1000": 0.0001,
      "provider": "fireworks_ai",
      "modelFamily": "unknown",
      "maxTokens": 16384,
      "maxInputTokens": 16384,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "fireworks_ai/accounts/fireworks/models/llama-v3p1-8b-instruct": {
      "inputCostPer1000": 0.0001,
      "outputCostPer1000": 0.0001,
      "provider": "fireworks_ai",
      "modelFamily": "unknown",
      "maxTokens": 16384,
      "maxInputTokens": 16384,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "fireworks_ai/accounts/fireworks/models/llama-v3p2-11b-vision-instruct": {
      "inputCostPer1000": 0.0002,
      "outputCostPer1000": 0.0002,
      "provider": "fireworks_ai",
      "modelFamily": "unknown",
      "maxTokens": 16384,
      "maxInputTokens": 16384,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "fireworks_ai/accounts/fireworks/models/llama-v3p2-90b-vision-instruct": {
      "inputCostPer1000": 0.0009,
      "outputCostPer1000": 0.0009,
      "provider": "fireworks_ai",
      "modelFamily": "unknown",
      "maxTokens": 16384,
      "maxInputTokens": 16384,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "fireworks_ai/accounts/fireworks/models/firefunction-v2": {
      "inputCostPer1000": 0.0009,
      "outputCostPer1000": 0.0009,
      "provider": "fireworks_ai",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "fireworks_ai/accounts/fireworks/models/mixtral-8x22b-instruct-hf": {
      "inputCostPer1000": 0.0012,
      "outputCostPer1000": 0.0012,
      "provider": "fireworks_ai",
      "modelFamily": "unknown",
      "maxTokens": 65536,
      "maxInputTokens": 65536,
      "maxOutputTokens": 65536,
      "mode": "chat"
    },
    "fireworks_ai/accounts/fireworks/models/qwen2-72b-instruct": {
      "inputCostPer1000": 0.0009,
      "outputCostPer1000": 0.0009,
      "provider": "fireworks_ai",
      "modelFamily": "unknown",
      "maxTokens": 32768,
      "maxInputTokens": 32768,
      "maxOutputTokens": 32768,
      "mode": "chat"
    },
    "fireworks_ai/accounts/fireworks/models/qwen2p5-coder-32b-instruct": {
      "inputCostPer1000": 0.0009,
      "outputCostPer1000": 0.0009,
      "provider": "fireworks_ai",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "fireworks_ai/accounts/fireworks/models/yi-large": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.003,
      "provider": "fireworks_ai",
      "modelFamily": "unknown",
      "maxTokens": 32768,
      "maxInputTokens": 32768,
      "maxOutputTokens": 32768,
      "mode": "chat"
    },
    "fireworks_ai/accounts/fireworks/models/deepseek-coder-v2-instruct": {
      "inputCostPer1000": 0.0012,
      "outputCostPer1000": 0.0012,
      "provider": "fireworks_ai",
      "modelFamily": "unknown",
      "maxTokens": 65536,
      "maxInputTokens": 65536,
      "maxOutputTokens": 65536,
      "mode": "chat"
    },
    "fireworks_ai/accounts/fireworks/models/deepseek-v3": {
      "inputCostPer1000": 0.0009,
      "outputCostPer1000": 0.0009,
      "provider": "fireworks_ai",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 128000,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "fireworks_ai/accounts/fireworks/models/deepseek-r1": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.008,
      "provider": "fireworks_ai",
      "modelFamily": "unknown",
      "maxTokens": 20480,
      "maxInputTokens": 128000,
      "maxOutputTokens": 20480,
      "mode": "chat"
    },
    "fireworks_ai/accounts/fireworks/models/deepseek-r1-basic": {
      "inputCostPer1000": 0.00055,
      "outputCostPer1000": 0.00219,
      "provider": "fireworks_ai",
      "modelFamily": "unknown",
      "maxTokens": 20480,
      "maxInputTokens": 128000,
      "maxOutputTokens": 20480,
      "mode": "chat"
    },
    "fireworks_ai/accounts/fireworks/models/deepseek-r1-0528": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.008,
      "provider": "fireworks_ai",
      "modelFamily": "unknown",
      "maxTokens": 160000,
      "maxInputTokens": 160000,
      "maxOutputTokens": 160000,
      "mode": "chat"
    },
    "fireworks_ai/accounts/fireworks/models/llama-v3p1-405b-instruct": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.003,
      "provider": "fireworks_ai",
      "modelFamily": "unknown",
      "maxTokens": 16384,
      "maxInputTokens": 128000,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "fireworks_ai/accounts/fireworks/models/llama4-maverick-instruct-basic": {
      "inputCostPer1000": 0.00022,
      "outputCostPer1000": 0.00088,
      "provider": "fireworks_ai",
      "modelFamily": "unknown",
      "maxTokens": 131072,
      "maxInputTokens": 131072,
      "maxOutputTokens": 131072,
      "mode": "chat"
    },
    "fireworks_ai/accounts/fireworks/models/llama4-scout-instruct-basic": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.0006,
      "provider": "fireworks_ai",
      "modelFamily": "unknown",
      "maxTokens": 131072,
      "maxInputTokens": 131072,
      "maxOutputTokens": 131072,
      "mode": "chat"
    },
    "fireworks-ai-up-to-4b": {
      "inputCostPer1000": 0.0002,
      "outputCostPer1000": 0.0002,
      "provider": "fireworks_ai",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "fireworks-ai-4.1b-to-16b": {
      "inputCostPer1000": 0.0002,
      "outputCostPer1000": 0.0002,
      "provider": "fireworks_ai",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "fireworks-ai-above-16b": {
      "inputCostPer1000": 0.0009,
      "outputCostPer1000": 0.0009,
      "provider": "fireworks_ai",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "fireworks-ai-moe-up-to-56b": {
      "inputCostPer1000": 0.0005,
      "outputCostPer1000": 0.0005,
      "provider": "fireworks_ai",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "fireworks-ai-56b-to-176b": {
      "inputCostPer1000": 0.0012,
      "outputCostPer1000": 0.0012,
      "provider": "fireworks_ai",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    }
  },
  "anyscale": {
    "anyscale/mistralai/Mistral-7B-Instruct-v0.1": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.00015,
      "provider": "anyscale",
      "modelFamily": "unknown",
      "maxTokens": 16384,
      "maxInputTokens": 16384,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "anyscale/mistralai/Mixtral-8x7B-Instruct-v0.1": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.00015,
      "provider": "anyscale",
      "modelFamily": "unknown",
      "maxTokens": 16384,
      "maxInputTokens": 16384,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "anyscale/mistralai/Mixtral-8x22B-Instruct-v0.1": {
      "inputCostPer1000": 0.0009,
      "outputCostPer1000": 0.0009,
      "provider": "anyscale",
      "modelFamily": "unknown",
      "maxTokens": 65536,
      "maxInputTokens": 65536,
      "maxOutputTokens": 65536,
      "mode": "chat"
    },
    "anyscale/HuggingFaceH4/zephyr-7b-beta": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.00015,
      "provider": "anyscale",
      "modelFamily": "unknown",
      "maxTokens": 16384,
      "maxInputTokens": 16384,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "anyscale/google/gemma-7b-it": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.00015,
      "provider": "anyscale",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "anyscale/meta-llama/Llama-2-7b-chat-hf": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.00015,
      "provider": "anyscale",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "anyscale/meta-llama/Llama-2-13b-chat-hf": {
      "inputCostPer1000": 0.00025,
      "outputCostPer1000": 0.00025,
      "provider": "anyscale",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "anyscale/meta-llama/Llama-2-70b-chat-hf": {
      "inputCostPer1000": 0.001,
      "outputCostPer1000": 0.001,
      "provider": "anyscale",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "anyscale/codellama/CodeLlama-34b-Instruct-hf": {
      "inputCostPer1000": 0.001,
      "outputCostPer1000": 0.001,
      "provider": "anyscale",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "anyscale/codellama/CodeLlama-70b-Instruct-hf": {
      "inputCostPer1000": 0.001,
      "outputCostPer1000": 0.001,
      "provider": "anyscale",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "anyscale/meta-llama/Meta-Llama-3-8B-Instruct": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.00015,
      "provider": "anyscale",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "anyscale/meta-llama/Meta-Llama-3-70B-Instruct": {
      "inputCostPer1000": 0.001,
      "outputCostPer1000": 0.001,
      "provider": "anyscale",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    }
  },
  "cloudflare": {
    "cloudflare/@cf/meta/llama-2-7b-chat-fp16": {
      "inputCostPer1000": 0.001923,
      "outputCostPer1000": 0.001923,
      "provider": "cloudflare",
      "modelFamily": "llama-2",
      "maxTokens": 3072,
      "maxInputTokens": 3072,
      "maxOutputTokens": 3072,
      "mode": "chat"
    },
    "cloudflare/@cf/meta/llama-2-7b-chat-int8": {
      "inputCostPer1000": 0.001923,
      "outputCostPer1000": 0.001923,
      "provider": "cloudflare",
      "modelFamily": "llama-2",
      "maxTokens": 2048,
      "maxInputTokens": 2048,
      "maxOutputTokens": 2048,
      "mode": "chat"
    },
    "cloudflare/@cf/mistral/mistral-7b-instruct-v0.1": {
      "inputCostPer1000": 0.001923,
      "outputCostPer1000": 0.001923,
      "provider": "cloudflare",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "cloudflare/@hf/thebloke/codellama-7b-instruct-awq": {
      "inputCostPer1000": 0.001923,
      "outputCostPer1000": 0.001923,
      "provider": "cloudflare",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    }
  },
  "databricks": {
    "databricks/databricks-claude-3-7-sonnet": {
      "inputCostPer1000": 0.0025,
      "outputCostPer1000": 0.017857,
      "provider": "databricks",
      "modelFamily": "claude-3",
      "maxTokens": 200000,
      "maxInputTokens": 200000,
      "maxOutputTokens": 128000,
      "mode": "chat"
    },
    "databricks/databricks-meta-llama-3-1-405b-instruct": {
      "inputCostPer1000": 0.005,
      "outputCostPer1000": 0.015,
      "provider": "databricks",
      "modelFamily": "llama-3",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 128000,
      "mode": "chat"
    },
    "databricks/databricks-meta-llama-3-1-70b-instruct": {
      "inputCostPer1000": 0.001,
      "outputCostPer1000": 0.003,
      "provider": "databricks",
      "modelFamily": "llama-3",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 128000,
      "mode": "chat"
    },
    "databricks/databricks-meta-llama-3-3-70b-instruct": {
      "inputCostPer1000": 0.001,
      "outputCostPer1000": 0.003,
      "provider": "databricks",
      "modelFamily": "llama-3",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 128000,
      "mode": "chat"
    },
    "databricks/databricks-llama-4-maverick": {
      "inputCostPer1000": 0.005,
      "outputCostPer1000": 0.015,
      "provider": "databricks",
      "modelFamily": "unknown",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 128000,
      "mode": "chat"
    },
    "databricks/databricks-dbrx-instruct": {
      "inputCostPer1000": 0.00075,
      "outputCostPer1000": 0.002249,
      "provider": "databricks",
      "modelFamily": "unknown",
      "maxTokens": 32768,
      "maxInputTokens": 32768,
      "maxOutputTokens": 32768,
      "mode": "chat"
    },
    "databricks/databricks-meta-llama-3-70b-instruct": {
      "inputCostPer1000": 0.001,
      "outputCostPer1000": 0.003,
      "provider": "databricks",
      "modelFamily": "llama-3",
      "maxTokens": 128000,
      "maxInputTokens": 128000,
      "maxOutputTokens": 128000,
      "mode": "chat"
    },
    "databricks/databricks-llama-2-70b-chat": {
      "inputCostPer1000": 0.0005,
      "outputCostPer1000": 0.0015,
      "provider": "databricks",
      "modelFamily": "llama-2",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "databricks/databricks-mixtral-8x7b-instruct": {
      "inputCostPer1000": 0.0005,
      "outputCostPer1000": 0.000999,
      "provider": "databricks",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "databricks/databricks-mpt-30b-instruct": {
      "inputCostPer1000": 0.000999,
      "outputCostPer1000": 0.000999,
      "provider": "databricks",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    }
  },
  "sambanova": {
    "sambanova/Meta-Llama-3.1-8B-Instruct": {
      "inputCostPer1000": 0.0001,
      "outputCostPer1000": 0.0002,
      "provider": "sambanova",
      "modelFamily": "unknown",
      "maxTokens": 16384,
      "maxInputTokens": 16384,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "sambanova/Meta-Llama-3.1-405B-Instruct": {
      "inputCostPer1000": 0.005,
      "outputCostPer1000": 0.01,
      "provider": "sambanova",
      "modelFamily": "unknown",
      "maxTokens": 16384,
      "maxInputTokens": 16384,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "sambanova/Meta-Llama-3.2-1B-Instruct": {
      "inputCostPer1000": 0.00004,
      "outputCostPer1000": 0.00008,
      "provider": "sambanova",
      "modelFamily": "unknown",
      "maxTokens": 16384,
      "maxInputTokens": 16384,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "sambanova/Meta-Llama-3.2-3B-Instruct": {
      "inputCostPer1000": 0.00008,
      "outputCostPer1000": 0.00016,
      "provider": "sambanova",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "sambanova/Llama-4-Maverick-17B-128E-Instruct": {
      "inputCostPer1000": 0.00063,
      "outputCostPer1000": 0.0018,
      "provider": "sambanova",
      "modelFamily": "unknown",
      "maxTokens": 131072,
      "maxInputTokens": 131072,
      "maxOutputTokens": 131072,
      "mode": "chat"
    },
    "sambanova/Llama-4-Scout-17B-16E-Instruct": {
      "inputCostPer1000": 0.0004,
      "outputCostPer1000": 0.0007,
      "provider": "sambanova",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "sambanova/Meta-Llama-3.3-70B-Instruct": {
      "inputCostPer1000": 0.0006,
      "outputCostPer1000": 0.0012,
      "provider": "sambanova",
      "modelFamily": "unknown",
      "maxTokens": 131072,
      "maxInputTokens": 131072,
      "maxOutputTokens": 131072,
      "mode": "chat"
    },
    "sambanova/Meta-Llama-Guard-3-8B": {
      "inputCostPer1000": 0.0003,
      "outputCostPer1000": 0.0003,
      "provider": "sambanova",
      "modelFamily": "unknown",
      "maxTokens": 16384,
      "maxInputTokens": 16384,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "sambanova/Qwen3-32B": {
      "inputCostPer1000": 0.0004,
      "outputCostPer1000": 0.0008,
      "provider": "sambanova",
      "modelFamily": "unknown",
      "maxTokens": 8192,
      "maxInputTokens": 8192,
      "maxOutputTokens": 8192,
      "mode": "chat"
    },
    "sambanova/QwQ-32B": {
      "inputCostPer1000": 0.0005,
      "outputCostPer1000": 0.001,
      "provider": "sambanova",
      "modelFamily": "unknown",
      "maxTokens": 16384,
      "maxInputTokens": 16384,
      "maxOutputTokens": 16384,
      "mode": "chat"
    },
    "sambanova/Qwen2-Audio-7B-Instruct": {
      "inputCostPer1000": 0.0005,
      "outputCostPer1000": 0.1,
      "provider": "sambanova",
      "modelFamily": "unknown",
      "maxTokens": 4096,
      "maxInputTokens": 4096,
      "maxOutputTokens": 4096,
      "mode": "chat"
    },
    "sambanova/DeepSeek-R1-Distill-Llama-70B": {
      "inputCostPer1000": 0.0007,
      "outputCostPer1000": 0.0014,
      "provider": "sambanova",
      "modelFamily": "unknown",
      "maxTokens": 131072,
      "maxInputTokens": 131072,
      "maxOutputTokens": 131072,
      "mode": "chat"
    },
    "sambanova/DeepSeek-R1": {
      "inputCostPer1000": 0.005,
      "outputCostPer1000": 0.007,
      "provider": "sambanova",
      "modelFamily": "unknown",
      "maxTokens": 32768,
      "maxInputTokens": 32768,
      "maxOutputTokens": 32768,
      "mode": "chat"
    },
    "sambanova/DeepSeek-V3-0324": {
      "inputCostPer1000": 0.003,
      "outputCostPer1000": 0.0045,
      "provider": "sambanova",
      "modelFamily": "unknown",
      "maxTokens": 32768,
      "maxInputTokens": 32768,
      "maxOutputTokens": 32768,
      "mode": "chat"
    }
  },
  "jina_ai": {
    "jina-reranker-v2-base-multilingual": {
      "inputCostPer1000": 0.000018,
      "outputCostPer1000": 0.000018,
      "provider": "jina_ai",
      "modelFamily": "unknown",
      "maxTokens": 1024,
      "maxInputTokens": 1024,
      "maxOutputTokens": 1024,
      "mode": "rerank"
    }
  },
  "nscale": {
    "nscale/meta-llama/Llama-4-Scout-17B-16E-Instruct": {
      "inputCostPer1000": 0.00009,
      "outputCostPer1000": 0.00029,
      "provider": "nscale",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "nscale/Qwen/Qwen2.5-Coder-3B-Instruct": {
      "inputCostPer1000": 0.00001,
      "outputCostPer1000": 0.00003,
      "provider": "nscale",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "nscale/Qwen/Qwen2.5-Coder-7B-Instruct": {
      "inputCostPer1000": 0.00001,
      "outputCostPer1000": 0.00003,
      "provider": "nscale",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "nscale/Qwen/Qwen2.5-Coder-32B-Instruct": {
      "inputCostPer1000": 0.00006,
      "outputCostPer1000": 0.0002,
      "provider": "nscale",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "nscale/Qwen/QwQ-32B": {
      "inputCostPer1000": 0.00018,
      "outputCostPer1000": 0.0002,
      "provider": "nscale",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "nscale/deepseek-ai/DeepSeek-R1-Distill-Llama-70B": {
      "inputCostPer1000": 0.000375,
      "outputCostPer1000": 0.000375,
      "provider": "nscale",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "nscale/deepseek-ai/DeepSeek-R1-Distill-Llama-8B": {
      "inputCostPer1000": 0.000025,
      "outputCostPer1000": 0.000025,
      "provider": "nscale",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "nscale/deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B": {
      "inputCostPer1000": 0.00009,
      "outputCostPer1000": 0.00009,
      "provider": "nscale",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "nscale/deepseek-ai/DeepSeek-R1-Distill-Qwen-7B": {
      "inputCostPer1000": 0.0002,
      "outputCostPer1000": 0.0002,
      "provider": "nscale",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "nscale/deepseek-ai/DeepSeek-R1-Distill-Qwen-14B": {
      "inputCostPer1000": 0.00007,
      "outputCostPer1000": 0.00007,
      "provider": "nscale",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "nscale/deepseek-ai/DeepSeek-R1-Distill-Qwen-32B": {
      "inputCostPer1000": 0.00015,
      "outputCostPer1000": 0.00015,
      "provider": "nscale",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "nscale/mistralai/mixtral-8x22b-instruct-v0.1": {
      "inputCostPer1000": 0.0006,
      "outputCostPer1000": 0.0006,
      "provider": "nscale",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "nscale/meta-llama/Llama-3.1-8B-Instruct": {
      "inputCostPer1000": 0.00003,
      "outputCostPer1000": 0.00003,
      "provider": "nscale",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    },
    "nscale/meta-llama/Llama-3.3-70B-Instruct": {
      "inputCostPer1000": 0.0002,
      "outputCostPer1000": 0.0002,
      "provider": "nscale",
      "modelFamily": "unknown",
      "maxTokens": null,
      "maxInputTokens": null,
      "maxOutputTokens": null,
      "mode": "chat"
    }
  }
};

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

/**
 * Get total number of models with pricing data
 */
export function getTotalModelCount(): number {
  return Object.values(AI_MODEL_PRICING).reduce((total, provider) => {
    return total + Object.keys(provider).length
  }, 0)
}

/**
 * Get pricing statistics
 */
export function getPricingStats() {
  const providers = Object.keys(AI_MODEL_PRICING)
  const totalModels = getTotalModelCount()
  
  const providerStats = providers.map(provider => ({
    provider,
    modelCount: Object.keys(AI_MODEL_PRICING[provider]).length,
    models: Object.keys(AI_MODEL_PRICING[provider])
  }))
  
  return {
    totalProviders: providers.length,
    totalModels,
    providers: providerStats,
    lastUpdated: '2025-06-09T06:01:17.821Z'
  }
}