import fs from 'node:fs/promises';

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

const sources = [
  {
    provider: 'anthropic',
    url: 'https://api.anthropic.com/v1/models',
    headers: { 
      'x-api-key': process.env.ANTHROPIC_API_KEY!, 
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    },
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
    provider: 'google',
    url: `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`,
    headers: {},
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
    url: 'https://openrouter.ai/api/v1/models',
    headers: { 
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY!}`,
      'Content-Type': 'application/json'
    },
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
  
  const allModels: ModelInfo[] = [];
  
  for (const source of sources) {
    try {
      console.log(`📡 Fetching ${source.provider} models...`);
      const response = await fetchWithRetry(source.url, { headers: source.headers });
      const data = response.data || response.models || [];
      const models = data.map(source.map);
      
      console.log(`✅ Found ${models.length} ${source.provider} models`);
      allModels.push(...models);
    } catch (error) {
      console.error(`❌ Failed to fetch ${source.provider} models:`, error);
      process.exit(1);
    }
  }

  // Sort models by provider, then by category, then by name
  allModels.sort((a, b) => {
    if (a.provider !== b.provider) {
      const providerOrder = ['anthropic', 'google', 'openrouter'];
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