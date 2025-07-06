import fs from 'node:fs/promises';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

interface ModelInfo {
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

// Helper function to check if API key is valid
function isValidApiKey(key: string | undefined): boolean {
  return Boolean(key && key.trim() && key !== '***' && key !== 'undefined');
}

interface ApiSource {
  provider: string;
  apiKey: string | undefined;
  getUrl: () => string;
  getHeaders: () => Record<string, string>;
  map: (m: any) => ModelInfo;
}

const sources: ApiSource[] = [
  {
    provider: 'anthropic',
    apiKey: process.env.ANTHROPIC_API_KEY,
    getUrl: () => 'https://api.anthropic.com/v1/models',
    getHeaders: () => ({
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    }),
    map: (m: any): ModelInfo => ({
      id: m.id,
      name: m.display_name || m.id,
      provider: 'anthropic',
      maxTokens: m.max_tokens || 8192,
      supportsStreaming: true,
      category: m.id.includes('claude-3-5') || m.id.includes('claude-4') ? 'Latest' : 'Legacy',
      isLatest: m.id.includes('claude-3-5') || m.id.includes('claude-4'),
      description: `Claude model - ${m.id}`,
    }),
  },
  {
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
    getUrl: () => 'https://api.openai.com/v1/models',
    getHeaders: () => ({
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY!}`,
      'Content-Type': 'application/json'
    }),
    map: (m: any): ModelInfo => {
      const id = m.id;
      const isGPT4 = id.includes('gpt-4');
      const isO1 = id.includes('o1');
      const isO3 = id.includes('o3');
      const isLatest = id.includes('gpt-4.1') || id.includes('gpt-4o') || id.includes('gpt-4.5') || isO1 || isO3;
      const isExperimental = id.includes('preview') || isO1 || isO3;
      
      return {
        id,
        name: id.replace(/-/g, ' ').replace(/gpt/gi, 'GPT').replace(/\b(\w)/g, (l) => l.toUpperCase()),
        provider: 'openai',
        maxTokens: isGPT4 ? 128000 : 16384,
        supportsStreaming: !isO1 && !isO3, // o1 and o3 models don't support streaming
        category: isExperimental ? 'Experimental' : isLatest ? 'Latest' : 'Production',
        isLatest,
        isExperimental,
        description: `OpenAI ${id}`,
      };
    },
  },
  {
    provider: 'google',
    apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY,
    getUrl: () => `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY}`,
    getHeaders: () => ({}),
    map: (m: any): ModelInfo => {
      const id = m.name.replace('models/', '');
      const isExperimental = id.includes('exp') || id.includes('preview') || id.includes('thinking');
      const isLatest = id.includes('2.5') || id.includes('2.0');
      
      return {
        id,
        name: m.displayName || id,
        provider: 'google',
        maxTokens: m.outputTokenLimit || 8192,
        supportsStreaming: m.supportedGenerationMethods?.includes('generateContentStream') || true,
        category: isExperimental ? 'Experimental' : isLatest ? 'Latest' : 'Production',
        isLatest,
        isExperimental,
        description: m.description || `Google Gemini model - ${id}`,
      };
    },
  },
  {
    provider: 'openrouter',
    apiKey: process.env.OPENROUTER_API_KEY,
    getUrl: () => 'https://openrouter.ai/api/v1/models',
    getHeaders: () => ({
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY!}`,
      'Content-Type': 'application/json'
    }),
    map: (m: any): ModelInfo => {
      const isOpenAI = m.id.includes('gpt') || m.id.includes('o1');
      const isLatest = m.id.includes('o1') || m.id.includes('gpt-4o');
      
      return {
        id: m.id,
        name: m.name || m.id,
        provider: 'openrouter',
        maxTokens: m.context_length || 128000,
        supportsStreaming: true,
        category: isOpenAI ? (isLatest ? 'Latest' : 'Production') : 'Open Source',
        isLatest,
        description: m.description || `${m.name || m.id} via OpenRouter`,
      };
    },
  },
];

async function fetchWithRetry(url: string, options: any, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed for ${url}:`, error);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
    }
  }
}

(async () => {
  console.log('🔄 Refreshing AI model list...');
  
  // Check which API keys are available
  const availableProviders = sources.filter(source => {
    const hasKey = isValidApiKey(source.apiKey);
    if (!hasKey) {
      console.warn(`⚠️  Skipping ${source.provider} - API key not available or invalid`);
    }
    return hasKey;
  });

  if (availableProviders.length === 0) {
    console.error('❌ No valid API keys found! Please set environment variables:');
    console.error('   - ANTHROPIC_API_KEY');
    console.error('   - OPENAI_API_KEY');
    console.error('   - GEMINI_API_KEY (or GOOGLE_AI_API_KEY)');
    console.error('   - OPENROUTER_API_KEY');
    process.exit(1);
  }

  console.log(`📡 Found ${availableProviders.length}/${sources.length} valid API keys`);
  
  const allModels: ModelInfo[] = [];
  
  for (const source of availableProviders) {
    try {
      console.log(`📡 Fetching ${source.provider} models...`);
      const url = source.getUrl();
      const headers = source.getHeaders();
      const response = await fetchWithRetry(url, { headers });
      const data = response.data || response.models || [];
      const models = data.map(source.map);
      
      console.log(`✅ Found ${models.length} ${source.provider} models`);
      allModels.push(...models);
    } catch (error) {
      console.error(`❌ Failed to fetch ${source.provider} models:`, error);
      // Don't exit on individual provider failure - continue with others
      console.warn(`⚠️  Continuing without ${source.provider} models...`);
    }
  }

  if (allModels.length === 0) {
    console.error('❌ No models fetched from any provider!');
    process.exit(1);
  }

  // Sort models by provider, then by category, then by name
  allModels.sort((a, b) => {
    if (a.provider !== b.provider) {
      const providerOrder = ['anthropic', 'openai', 'google', 'openrouter'];
      return providerOrder.indexOf(a.provider) - providerOrder.indexOf(b.provider);
    }
    if (a.category !== b.category) {
      const categoryOrder = ['Latest', 'Experimental', 'Production', 'Stable', 'Legacy', 'Open Source'];
      return categoryOrder.indexOf(a.category || 'Other') - categoryOrder.indexOf(b.category || 'Other');
    }
    return a.name.localeCompare(b.name);
  });

  const banner = `// ⚠️  AUTO-GENERATED — DO NOT EDIT.
// Last refresh: ${new Date().toISOString()}
// Total models: ${allModels.length}
// Sources: ${availableProviders.map(p => p.provider).join(', ')} APIs

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

`;

  const body = `export const SUPPORTED_MODELS: ModelInfo[] = ${JSON.stringify(allModels, null, 2)};

export default SUPPORTED_MODELS;
`;

  await fs.writeFile('lib/ai/generated-models.ts', banner + body, 'utf8');
  
  console.log(`✅ Generated lib/ai/generated-models.ts with ${allModels.length} models`);
  console.log('📊 Model breakdown:');
  
  const breakdown = allModels.reduce((acc, model) => {
    const key = `${model.provider} (${model.category || 'Other'})`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  Object.entries(breakdown).forEach(([key, count]) => {
    console.log(`   ${key}: ${count} models`);
  });
})(); 