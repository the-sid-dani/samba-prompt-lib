// ⚠️  AUTO-GENERATED — DO NOT EDIT.
// Last refresh: 2025-08-26T08:37:49.559Z
// Total models: 59
// Sources: anthropic, google, openrouter APIs

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
  {
    "id": "claude-3-5-haiku-20241022",
    "name": "Claude Haiku 3.5",
    "provider": "anthropic",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Latest",
    "isLatest": true,
    "description": "Claude model - claude-3-5-haiku-20241022"
  },
  {
    "id": "claude-3-5-sonnet-20241022",
    "name": "Claude Sonnet 3.5 (New)",
    "provider": "anthropic",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Latest",
    "isLatest": true,
    "description": "Claude model - claude-3-5-sonnet-20241022"
  },
  {
    "id": "claude-3-5-sonnet-20240620",
    "name": "Claude Sonnet 3.5 (Old)",
    "provider": "anthropic",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Latest",
    "isLatest": true,
    "description": "Claude model - claude-3-5-sonnet-20240620"
  },
  {
    "id": "claude-3-haiku-20240307",
    "name": "Claude Haiku 3",
    "provider": "anthropic",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Legacy",
    "isLatest": false,
    "description": "Claude model - claude-3-haiku-20240307"
  },
  {
    "id": "claude-3-opus-20240229",
    "name": "Claude Opus 3",
    "provider": "anthropic",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Legacy",
    "isLatest": false,
    "description": "Claude model - claude-3-opus-20240229"
  },
  {
    "id": "claude-opus-4-20250514",
    "name": "Claude Opus 4",
    "provider": "anthropic",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Legacy",
    "isLatest": false,
    "description": "Claude model - claude-opus-4-20250514"
  },
  {
    "id": "claude-opus-4-1-20250805",
    "name": "Claude Opus 4.1",
    "provider": "anthropic",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Legacy",
    "isLatest": false,
    "description": "Claude model - claude-opus-4-1-20250805"
  },
  {
    "id": "claude-3-7-sonnet-20250219",
    "name": "Claude Sonnet 3.7",
    "provider": "anthropic",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Legacy",
    "isLatest": false,
    "description": "Claude model - claude-3-7-sonnet-20250219"
  },
  {
    "id": "claude-sonnet-4-20250514",
    "name": "Claude Sonnet 4",
    "provider": "anthropic",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Legacy",
    "isLatest": false,
    "description": "Claude model - claude-sonnet-4-20250514"
  },
  {
    "id": "gemini-2.0-flash",
    "name": "Gemini 2.0 Flash",
    "provider": "google",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Latest",
    "isLatest": true,
    "isExperimental": false,
    "description": "Gemini 2.0 Flash"
  },
  {
    "id": "gemini-2.0-flash-001",
    "name": "Gemini 2.0 Flash 001",
    "provider": "google",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Latest",
    "isLatest": true,
    "isExperimental": false,
    "description": "Stable version of Gemini 2.0 Flash, our fast and versatile multimodal model for scaling across diverse tasks, released in January of 2025."
  },
  {
    "id": "gemini-2.0-flash-lite",
    "name": "Gemini 2.0 Flash-Lite",
    "provider": "google",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Latest",
    "isLatest": true,
    "isExperimental": false,
    "description": "Gemini 2.0 Flash-Lite"
  },
  {
    "id": "gemini-2.0-flash-lite-001",
    "name": "Gemini 2.0 Flash-Lite 001",
    "provider": "google",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Latest",
    "isLatest": true,
    "isExperimental": false,
    "description": "Stable version of Gemini 2.0 Flash-Lite"
  },
  {
    "id": "gemini-2.5-flash",
    "name": "Gemini 2.5 Flash",
    "provider": "google",
    "maxTokens": 65536,
    "supportsStreaming": true,
    "category": "Latest",
    "isLatest": true,
    "isExperimental": false,
    "description": "Stable version of Gemini 2.5 Flash, our mid-size multimodal model that supports up to 1 million tokens, released in June of 2025."
  },
  {
    "id": "gemini-2.5-flash-lite",
    "name": "Gemini 2.5 Flash-Lite",
    "provider": "google",
    "maxTokens": 65536,
    "supportsStreaming": true,
    "category": "Latest",
    "isLatest": true,
    "isExperimental": false,
    "description": "Stable version of Gemini 2.5 Flash-Lite, released in July of 2025"
  },
  {
    "id": "gemini-2.5-pro",
    "name": "Gemini 2.5 Pro",
    "provider": "google",
    "maxTokens": 65536,
    "supportsStreaming": true,
    "category": "Latest",
    "isLatest": true,
    "isExperimental": false,
    "description": "Stable release (June 17th, 2025) of Gemini 2.5 Pro"
  },
  {
    "id": "gemini-2.0-flash-exp-image-generation",
    "name": "Gemini 2.0 Flash (Image Generation) Experimental",
    "provider": "google",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Experimental",
    "isLatest": true,
    "isExperimental": true,
    "description": "Gemini 2.0 Flash (Image Generation) Experimental"
  },
  {
    "id": "gemini-2.0-flash-exp",
    "name": "Gemini 2.0 Flash Experimental",
    "provider": "google",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Experimental",
    "isLatest": true,
    "isExperimental": true,
    "description": "Gemini 2.0 Flash Experimental"
  },
  {
    "id": "gemini-2.0-flash-preview-image-generation",
    "name": "Gemini 2.0 Flash Preview Image Generation",
    "provider": "google",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Experimental",
    "isLatest": true,
    "isExperimental": true,
    "description": "Gemini 2.0 Flash Preview Image Generation"
  },
  {
    "id": "gemini-2.0-flash-lite-preview",
    "name": "Gemini 2.0 Flash-Lite Preview",
    "provider": "google",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Experimental",
    "isLatest": true,
    "isExperimental": true,
    "description": "Preview release (February 5th, 2025) of Gemini 2.0 Flash-Lite"
  },
  {
    "id": "gemini-2.0-flash-lite-preview-02-05",
    "name": "Gemini 2.0 Flash-Lite Preview 02-05",
    "provider": "google",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Experimental",
    "isLatest": true,
    "isExperimental": true,
    "description": "Preview release (February 5th, 2025) of Gemini 2.0 Flash-Lite"
  },
  {
    "id": "gemini-2.0-pro-exp",
    "name": "Gemini 2.0 Pro Experimental",
    "provider": "google",
    "maxTokens": 65536,
    "supportsStreaming": true,
    "category": "Experimental",
    "isLatest": true,
    "isExperimental": true,
    "description": "Experimental release (March 25th, 2025) of Gemini 2.5 Pro"
  },
  {
    "id": "gemini-2.0-pro-exp-02-05",
    "name": "Gemini 2.0 Pro Experimental 02-05",
    "provider": "google",
    "maxTokens": 65536,
    "supportsStreaming": true,
    "category": "Experimental",
    "isLatest": true,
    "isExperimental": true,
    "description": "Experimental release (March 25th, 2025) of Gemini 2.5 Pro"
  },
  {
    "id": "gemini-2.5-flash-preview-05-20",
    "name": "Gemini 2.5 Flash Preview 05-20",
    "provider": "google",
    "maxTokens": 65536,
    "supportsStreaming": true,
    "category": "Experimental",
    "isLatest": true,
    "isExperimental": true,
    "description": "Preview release (April 17th, 2025) of Gemini 2.5 Flash"
  },
  {
    "id": "gemini-2.0-flash-thinking-exp-01-21",
    "name": "Gemini 2.5 Flash Preview 05-20",
    "provider": "google",
    "maxTokens": 65536,
    "supportsStreaming": true,
    "category": "Experimental",
    "isLatest": true,
    "isExperimental": true,
    "description": "Preview release (April 17th, 2025) of Gemini 2.5 Flash"
  },
  {
    "id": "gemini-2.0-flash-thinking-exp",
    "name": "Gemini 2.5 Flash Preview 05-20",
    "provider": "google",
    "maxTokens": 65536,
    "supportsStreaming": true,
    "category": "Experimental",
    "isLatest": true,
    "isExperimental": true,
    "description": "Preview release (April 17th, 2025) of Gemini 2.5 Flash"
  },
  {
    "id": "gemini-2.0-flash-thinking-exp-1219",
    "name": "Gemini 2.5 Flash Preview 05-20",
    "provider": "google",
    "maxTokens": 65536,
    "supportsStreaming": true,
    "category": "Experimental",
    "isLatest": true,
    "isExperimental": true,
    "description": "Preview release (April 17th, 2025) of Gemini 2.5 Flash"
  },
  {
    "id": "gemini-2.5-flash-preview-tts",
    "name": "Gemini 2.5 Flash Preview TTS",
    "provider": "google",
    "maxTokens": 16384,
    "supportsStreaming": true,
    "category": "Experimental",
    "isLatest": true,
    "isExperimental": true,
    "description": "Gemini 2.5 Flash Preview TTS"
  },
  {
    "id": "gemini-2.5-flash-lite-preview-06-17",
    "name": "Gemini 2.5 Flash-Lite Preview 06-17",
    "provider": "google",
    "maxTokens": 65536,
    "supportsStreaming": true,
    "category": "Experimental",
    "isLatest": true,
    "isExperimental": true,
    "description": "Preview release (June 11th, 2025) of Gemini 2.5 Flash-Lite"
  },
  {
    "id": "gemini-2.5-pro-preview-06-05",
    "name": "Gemini 2.5 Pro Preview",
    "provider": "google",
    "maxTokens": 65536,
    "supportsStreaming": true,
    "category": "Experimental",
    "isLatest": true,
    "isExperimental": true,
    "description": "Preview release (June 5th, 2025) of Gemini 2.5 Pro"
  },
  {
    "id": "gemini-2.5-pro-preview-03-25",
    "name": "Gemini 2.5 Pro Preview 03-25",
    "provider": "google",
    "maxTokens": 65536,
    "supportsStreaming": true,
    "category": "Experimental",
    "isLatest": true,
    "isExperimental": true,
    "description": "Gemini 2.5 Pro Preview 03-25"
  },
  {
    "id": "gemini-2.5-pro-preview-05-06",
    "name": "Gemini 2.5 Pro Preview 05-06",
    "provider": "google",
    "maxTokens": 65536,
    "supportsStreaming": true,
    "category": "Experimental",
    "isLatest": true,
    "isExperimental": true,
    "description": "Preview release (May 6th, 2025) of Gemini 2.5 Pro"
  },
  {
    "id": "gemini-2.5-pro-preview-tts",
    "name": "Gemini 2.5 Pro Preview TTS",
    "provider": "google",
    "maxTokens": 16384,
    "supportsStreaming": true,
    "category": "Experimental",
    "isLatest": true,
    "isExperimental": true,
    "description": "Gemini 2.5 Pro Preview TTS"
  },
  {
    "id": "gemini-embedding-exp",
    "name": "Gemini Embedding Experimental",
    "provider": "google",
    "maxTokens": 1,
    "supportsStreaming": true,
    "category": "Experimental",
    "isLatest": false,
    "isExperimental": true,
    "description": "Obtain a distributed representation of a text."
  },
  {
    "id": "gemini-embedding-exp-03-07",
    "name": "Gemini Embedding Experimental 03-07",
    "provider": "google",
    "maxTokens": 1,
    "supportsStreaming": true,
    "category": "Experimental",
    "isLatest": false,
    "isExperimental": true,
    "description": "Obtain a distributed representation of a text."
  },
  {
    "id": "gemini-exp-1206",
    "name": "Gemini Experimental 1206",
    "provider": "google",
    "maxTokens": 65536,
    "supportsStreaming": true,
    "category": "Experimental",
    "isLatest": false,
    "isExperimental": true,
    "description": "Experimental release (March 25th, 2025) of Gemini 2.5 Pro"
  },
  {
    "id": "imagen-4.0-generate-preview-06-06",
    "name": "Imagen 4 (Preview)",
    "provider": "google",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Experimental",
    "isLatest": false,
    "isExperimental": true,
    "description": "Vertex served Imagen 4.0 model"
  },
  {
    "id": "learnlm-2.0-flash-experimental",
    "name": "LearnLM 2.0 Flash Experimental",
    "provider": "google",
    "maxTokens": 32768,
    "supportsStreaming": true,
    "category": "Experimental",
    "isLatest": true,
    "isExperimental": true,
    "description": "LearnLM 2.0 Flash Experimental"
  },
  {
    "id": "embedding-001",
    "name": "Embedding 001",
    "provider": "google",
    "maxTokens": 1,
    "supportsStreaming": true,
    "category": "Production",
    "isLatest": false,
    "isExperimental": false,
    "description": "Obtain a distributed representation of a text."
  },
  {
    "id": "embedding-gecko-001",
    "name": "Embedding Gecko",
    "provider": "google",
    "maxTokens": 1,
    "supportsStreaming": true,
    "category": "Production",
    "isLatest": false,
    "isExperimental": false,
    "description": "Obtain a distributed representation of a text."
  },
  {
    "id": "gemini-1.5-flash",
    "name": "Gemini 1.5 Flash",
    "provider": "google",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Production",
    "isLatest": false,
    "isExperimental": false,
    "description": "Alias that points to the most recent stable version of Gemini 1.5 Flash, our fast and versatile multimodal model for scaling across diverse tasks."
  },
  {
    "id": "gemini-1.5-flash-002",
    "name": "Gemini 1.5 Flash 002",
    "provider": "google",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Production",
    "isLatest": false,
    "isExperimental": false,
    "description": "Stable version of Gemini 1.5 Flash, our fast and versatile multimodal model for scaling across diverse tasks, released in September of 2024."
  },
  {
    "id": "gemini-1.5-flash-latest",
    "name": "Gemini 1.5 Flash Latest",
    "provider": "google",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Production",
    "isLatest": false,
    "isExperimental": false,
    "description": "Alias that points to the most recent production (non-experimental) release of Gemini 1.5 Flash, our fast and versatile multimodal model for scaling across diverse tasks."
  },
  {
    "id": "gemini-1.5-flash-8b",
    "name": "Gemini 1.5 Flash-8B",
    "provider": "google",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Production",
    "isLatest": false,
    "isExperimental": false,
    "description": "Stable version of Gemini 1.5 Flash-8B, our smallest and most cost effective Flash model, released in October of 2024."
  },
  {
    "id": "gemini-1.5-flash-8b-001",
    "name": "Gemini 1.5 Flash-8B 001",
    "provider": "google",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Production",
    "isLatest": false,
    "isExperimental": false,
    "description": "Stable version of Gemini 1.5 Flash-8B, our smallest and most cost effective Flash model, released in October of 2024."
  },
  {
    "id": "gemini-1.5-flash-8b-latest",
    "name": "Gemini 1.5 Flash-8B Latest",
    "provider": "google",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Production",
    "isLatest": false,
    "isExperimental": false,
    "description": "Alias that points to the most recent production (non-experimental) release of Gemini 1.5 Flash-8B, our smallest and most cost effective Flash model, released in October of 2024."
  },
  {
    "id": "gemini-1.5-pro",
    "name": "Gemini 1.5 Pro",
    "provider": "google",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Production",
    "isLatest": false,
    "isExperimental": false,
    "description": "Stable version of Gemini 1.5 Pro, our mid-size multimodal model that supports up to 2 million tokens, released in May of 2024."
  },
  {
    "id": "gemini-1.5-pro-002",
    "name": "Gemini 1.5 Pro 002",
    "provider": "google",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Production",
    "isLatest": false,
    "isExperimental": false,
    "description": "Stable version of Gemini 1.5 Pro, our mid-size multimodal model that supports up to 2 million tokens, released in September of 2024."
  },
  {
    "id": "gemini-1.5-pro-latest",
    "name": "Gemini 1.5 Pro Latest",
    "provider": "google",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Production",
    "isLatest": false,
    "isExperimental": false,
    "description": "Alias that points to the most recent production (non-experimental) release of Gemini 1.5 Pro, our mid-size multimodal model that supports up to 2 million tokens."
  },
  {
    "id": "gemini-embedding-001",
    "name": "Gemini Embedding 001",
    "provider": "google",
    "maxTokens": 1,
    "supportsStreaming": true,
    "category": "Production",
    "isLatest": false,
    "isExperimental": false,
    "description": "Obtain a distributed representation of a text."
  },
  {
    "id": "gemma-3-12b-it",
    "name": "Gemma 3 12B",
    "provider": "google",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Production",
    "isLatest": false,
    "isExperimental": false,
    "description": "Google Gemini model - gemma-3-12b-it"
  },
  {
    "id": "gemma-3-1b-it",
    "name": "Gemma 3 1B",
    "provider": "google",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Production",
    "isLatest": false,
    "isExperimental": false,
    "description": "Google Gemini model - gemma-3-1b-it"
  },
  {
    "id": "gemma-3-27b-it",
    "name": "Gemma 3 27B",
    "provider": "google",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Production",
    "isLatest": false,
    "isExperimental": false,
    "description": "Google Gemini model - gemma-3-27b-it"
  },
  {
    "id": "gemma-3-4b-it",
    "name": "Gemma 3 4B",
    "provider": "google",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Production",
    "isLatest": false,
    "isExperimental": false,
    "description": "Google Gemini model - gemma-3-4b-it"
  },
  {
    "id": "gemma-3n-e2b-it",
    "name": "Gemma 3n E2B",
    "provider": "google",
    "maxTokens": 2048,
    "supportsStreaming": true,
    "category": "Production",
    "isLatest": false,
    "isExperimental": false,
    "description": "Google Gemini model - gemma-3n-e2b-it"
  },
  {
    "id": "gemma-3n-e4b-it",
    "name": "Gemma 3n E4B",
    "provider": "google",
    "maxTokens": 2048,
    "supportsStreaming": true,
    "category": "Production",
    "isLatest": false,
    "isExperimental": false,
    "description": "Google Gemini model - gemma-3n-e4b-it"
  },
  {
    "id": "imagen-3.0-generate-002",
    "name": "Imagen 3.0",
    "provider": "google",
    "maxTokens": 8192,
    "supportsStreaming": true,
    "category": "Production",
    "isLatest": false,
    "isExperimental": false,
    "description": "Vertex served Imagen 3.0 002 model"
  },
  {
    "id": "aqa",
    "name": "Model that performs Attributed Question Answering.",
    "provider": "google",
    "maxTokens": 1024,
    "supportsStreaming": true,
    "category": "Production",
    "isLatest": false,
    "isExperimental": false,
    "description": "Model trained to return answers to questions that are grounded in provided sources, along with estimating answerable probability."
  },
  {
    "id": "text-embedding-004",
    "name": "Text Embedding 004",
    "provider": "google",
    "maxTokens": 1,
    "supportsStreaming": true,
    "category": "Production",
    "isLatest": false,
    "isExperimental": false,
    "description": "Obtain a distributed representation of a text."
  }
];

export default SUPPORTED_MODELS;
