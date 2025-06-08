#!/usr/bin/env node

/**
 * Script to automatically fetch and update AI models from provider APIs
 * Usage: node scripts/update-models.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment variables (load from .env.local if exists)
const loadEnv = () => {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
          process.env[key.trim()] = value.trim();
        }
      });
    }
  } catch (error) {
    console.log('No .env.local file found, using environment variables');
  }
};

loadEnv();

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

/**
 * Fetch Anthropic Claude models
 */
async function fetchAnthropicModels() {
  console.log('🟣 Fetching Anthropic Claude models...');
  
  if (!ANTHROPIC_API_KEY) {
    console.log('⚠️  ANTHROPIC_API_KEY not found, using fallback list');
    return [
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet (Latest)', maxTokens: 8192 },
      { id: 'claude-3-5-sonnet-20240620', name: 'Claude 3.5 Sonnet', maxTokens: 8192 },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', maxTokens: 8192 },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', maxTokens: 4096 },
      { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', maxTokens: 4096 },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', maxTokens: 4096 }
    ];
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/models', {
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.data
      .filter(model => model.id.startsWith('claude-3'))
      .map(model => ({
        id: model.id,
        name: model.display_name || formatModelName(model.id),
        maxTokens: getClaudeMaxTokens(model.id)
      }))
      .sort((a, b) => b.id.localeCompare(a.id)); // Sort newest first

  } catch (error) {
    console.error('❌ Error fetching Anthropic models:', error.message);
    console.log('📋 Using fallback Claude models');
    return [
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet (Latest)', maxTokens: 8192 },
      { id: 'claude-3-5-sonnet-20240620', name: 'Claude 3.5 Sonnet', maxTokens: 8192 },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', maxTokens: 8192 },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', maxTokens: 4096 },
      { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', maxTokens: 4096 },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', maxTokens: 4096 }
    ];
  }
}

/**
 * Fetch Google Gemini models
 */
async function fetchGeminiModels() {
  console.log('🔵 Fetching Google Gemini models...');
  
  if (!GOOGLE_AI_API_KEY) {
    console.log('⚠️  GOOGLE_AI_API_KEY not found, using fallback list');
    return [
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', maxTokens: 1048576 },
      { id: 'gemini-1.5-flash-latest', name: 'Gemini 1.5 Flash (Latest)', maxTokens: 1048576 },
      { id: 'gemini-1.5-flash-002', name: 'Gemini 1.5 Flash-002', maxTokens: 1048576 },
      { id: 'gemini-1.5-flash-8b', name: 'Gemini 1.5 Flash-8B', maxTokens: 1048576 },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', maxTokens: 2097152 },
      { id: 'gemini-1.5-pro-latest', name: 'Gemini 1.5 Pro (Latest)', maxTokens: 2097152 },
      { id: 'gemini-1.5-pro-002', name: 'Gemini 1.5 Pro-002', maxTokens: 2097152 },
      { id: 'gemini-pro', name: 'Gemini Pro (Legacy)', maxTokens: 30720 },
      { id: 'gemini-pro-latest', name: 'Gemini Pro (Legacy Latest)', maxTokens: 30720 }
    ];
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GOOGLE_AI_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.models
      .filter(model => 
        model.name.includes('gemini') && 
        model.supportedGenerationMethods?.includes('generateContent')
      )
      .map(model => {
        const id = model.name.replace('models/', '');
        return {
          id,
          name: formatGeminiName(id),
          maxTokens: getGeminiMaxTokens(id)
        };
      })
      .sort((a, b) => {
        // Sort by version, then by type (pro > flash > regular)
        const aVersion = parseFloat(a.id.match(/(\d+\.?\d*)/)?.[1] || '0');
        const bVersion = parseFloat(b.id.match(/(\d+\.?\d*)/)?.[1] || '0');
        
        if (aVersion !== bVersion) return bVersion - aVersion;
        
        if (a.id.includes('flash') && !b.id.includes('flash')) return -1;
        if (!a.id.includes('flash') && b.id.includes('flash')) return 1;
        
        return a.id.localeCompare(b.id);
      });

  } catch (error) {
    console.error('❌ Error fetching Gemini models:', error.message);
    console.log('📋 Using fallback Gemini models');
    return [
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', maxTokens: 1048576 },
      { id: 'gemini-1.5-flash-latest', name: 'Gemini 1.5 Flash (Latest)', maxTokens: 1048576 },
      { id: 'gemini-1.5-flash-002', name: 'Gemini 1.5 Flash-002', maxTokens: 1048576 },
      { id: 'gemini-1.5-flash-8b', name: 'Gemini 1.5 Flash-8B', maxTokens: 1048576 },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', maxTokens: 2097152 },
      { id: 'gemini-1.5-pro-latest', name: 'Gemini 1.5 Pro (Latest)', maxTokens: 2097152 },
      { id: 'gemini-1.5-pro-002', name: 'Gemini 1.5 Pro-002', maxTokens: 2097152 },
      { id: 'gemini-pro', name: 'Gemini Pro (Legacy)', maxTokens: 30720 },
      { id: 'gemini-pro-latest', name: 'Gemini Pro (Legacy Latest)', maxTokens: 30720 }
    ];
  }
}

/**
 * Fetch OpenRouter models
 */
async function fetchOpenRouterModels() {
  console.log('🟠 Fetching OpenRouter models...');
  
  if (!OPENROUTER_API_KEY) {
    console.log('⚠️  OPENROUTER_API_KEY not found, using fallback list');
    return [
      { id: 'gpt-4o', name: 'gpt-4o', maxTokens: 128000 },
      { id: 'gpt-4o-mini', name: 'gpt-4o-mini', maxTokens: 128000 },
      { id: 'deepseek-v3', name: 'deepseek-v3', maxTokens: 64000 },
      { id: 'gemma-2-27b-it', name: 'gemma-2-27b-it', maxTokens: 8192 },
      { id: 'llama-3.1-405b-instruct', name: 'llama-3.1-405b-instruct', maxTokens: 128000 }
    ];
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Priority models to include (wider selection including open-source)
    const priorityModels = [
      // OpenAI models
      'gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'o1-preview', 'o1-mini',
      // DeepSeek models  
      'deepseek-v3', 'deepseek-v2.5', 'deepseek-r1',
      // Meta Llama models
      'llama-3.1-405b-instruct', 'llama-3.1-70b-instruct', 'llama-3.2-90b-text-preview',
      // Google Gemma models
      'gemma-2-27b-it', 'gemma-2-9b-it',
      // Qwen models
      'qwen-2.5-72b-instruct', 'qwq-32b-preview',
      // Mistral models
      'mistral-large', 'mixtral-8x7b-instruct',
      // Other popular open-source
      'phi-3.5-mini-instruct', 'hermes-3-llama-3.1-405b'
    ];
    
    const foundModels = [];
    const seenIds = new Set(); // Track unique model IDs
    
    // Find priority models first
    for (const targetId of priorityModels) {
      const model = data.data.find(m => {
        const modelId = m.id.split('/').pop();
        return modelId === targetId || m.id.includes(targetId);
      });
      
      if (model) {
        const modelId = model.id.split('/').pop();
        // Only add if we haven't seen this ID before
        if (!seenIds.has(modelId)) {
          seenIds.add(modelId);
          foundModels.push({
            id: modelId,
            name: modelId, // Use actual model name instead of display name
            maxTokens: model.context_length || 4096
          });
        }
      }
    }
    
    // If we don't have many models, add some additional popular ones
    if (foundModels.length < 10) {
      const additionalModels = data.data
        .filter(model => {
          const modelId = model.id.split('/').pop();
          return !seenIds.has(modelId) && 
                 (model.id.includes('llama') || model.id.includes('mistral') || 
                  model.id.includes('deepseek') || model.id.includes('qwen'));
        })
        .slice(0, 5)
        .map(model => {
          const modelId = model.id.split('/').pop();
          seenIds.add(modelId); // Mark as seen
          return {
            id: modelId,
            name: modelId,
            maxTokens: model.context_length || 4096
          };
        });
      
      foundModels.push(...additionalModels);
    }
    
    return foundModels.slice(0, 20); // Limit to 20 models

  } catch (error) {
    console.error('❌ Error fetching OpenRouter models:', error.message);
    console.log('📋 Using fallback OpenRouter models');
    return [
      { id: 'gpt-4o', name: 'gpt-4o', maxTokens: 128000 },
      { id: 'gpt-4o-mini', name: 'gpt-4o-mini', maxTokens: 128000 },
      { id: 'deepseek-v3', name: 'deepseek-v3', maxTokens: 64000 },
      { id: 'gemma-2-27b-it', name: 'gemma-2-27b-it', maxTokens: 8192 },
      { id: 'llama-3.1-405b-instruct', name: 'llama-3.1-405b-instruct', maxTokens: 128000 }
    ];
  }
}

/**
 * Filter Gemini models to only include latest series
 */
function filterLatestGeminiModels(models) {
  // Keep only the most relevant/latest models from each series
  const latestModels = [
    // Gemini 2.0 series (latest)
    'gemini-exp-1206',
    'gemini-2.0-flash',
    'gemini-2.0-flash-thinking-exp',
    'gemini-2.0-pro-exp',
    // Gemini 1.5 series (stable)
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash-002', 
    'gemini-1.5-flash-8b-latest',
    'gemini-1.5-pro-latest',
    'gemini-1.5-pro-002'
  ];
  
  return models.filter(model => latestModels.includes(model.id));
}

/**
 * Helper functions
 */
function formatModelName(id) {
  return id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatGeminiName(id) {
  const name = id
    .replace('gemini-', 'Gemini ')
    .replace('1.5', '1.5')
    .replace('-flash', ' Flash')
    .replace('-pro', ' Pro')
    .replace('-latest', ' (Latest)')
    .replace('-002', '-002')
    .replace('-8b', '-8B');
    
  if (id === 'gemini-pro' || id === 'gemini-pro-latest') {
    return name + ' (Legacy)';
  }
  
  return name;
}

function getClaudeMaxTokens(id) {
  if (id.includes('3-5') || id.includes('3.5')) return 8192;
  return 4096;
}

function getGeminiMaxTokens(id) {
  if (id.includes('1.5-pro')) return 2097152; // 2M tokens
  if (id.includes('1.5-flash')) return 1048576; // 1M tokens
  return 30720; // Legacy models
}

/**
 * Generate TypeScript model definitions
 */
function generateModelTypes(geminiModels, claudeModels, openrouterModels) {
  // Filter Gemini models to only latest series
  const filteredGeminiModels = filterLatestGeminiModels(geminiModels);
  
  const lines = [
    'export interface AIProvider {',
    '  name: string;',
    '  models: string[];',
    '  generateResponse(params: GenerationParams): Promise<GenerationResponse>;',
    '}',
    '',
    'export interface GenerationParams {',
    '  model: string;',
    '  prompt: string;',
    '  systemPrompt?: string;',
    '  temperature?: number;',
    '  maxTokens?: number;',
    '  topP?: number;',
    '  frequencyPenalty?: number;',
    '  presencePenalty?: number;',
    '  stream?: boolean;',
    '}',
    '',
    'export interface GenerationResponse {',
    '  content: string;',
    '  model: string;',
    '  usage?: {',
    '    promptTokens?: number;',
    '    completionTokens?: number;',
    '    totalTokens?: number;',
    '  };',
    '  finishReason?: string;',
    '  error?: string;',
    '}',
    '',
    'export interface ModelInfo {',
    '  id: string;',
    '  name: string;',
    '  provider: string;',
    '  maxTokens: number;',
    '  supportsStreaming: boolean;',
    '}',
    '',
    'export const SUPPORTED_MODELS: ModelInfo[] = [',
    '  // Anthropic Claude Models - Auto-updated from API (Priority)',
    ...claudeModels.map(model => 
      `  {\n    id: '${model.id}',\n    name: '${model.id}',\n    provider: 'anthropic',\n    maxTokens: ${model.maxTokens},\n    supportsStreaming: true,\n  },`
    ),
    '',
    '  // Google Gemini Models - Latest Series Only',
    ...filteredGeminiModels.map(model => 
      `  {\n    id: '${model.id}',\n    name: '${model.id}',\n    provider: 'google',\n    maxTokens: ${model.maxTokens},\n    supportsStreaming: true,\n  },`
    ),
    '',
    '  // OpenRouter Models - Diverse Selection Including Open Source',
    ...openrouterModels.map(model => 
      `  {\n    id: '${model.id}',\n    name: '${model.id}',\n    provider: 'openrouter',\n    maxTokens: ${model.maxTokens},\n    supportsStreaming: true,\n  },`
    ),
    '];'
  ];
  
  return lines.join('\n');
}

/**
 * Main function
 */
async function updateModels() {
  console.log('🚀 Starting AI model update...\n');
  
  // Fetch models from all providers
  const [geminiModels, claudeModels, openrouterModels] = await Promise.all([
    fetchGeminiModels(),
    fetchAnthropicModels(), 
    fetchOpenRouterModels()
  ]);

  // Filter Gemini models for display info
  const filteredGeminiModels = filterLatestGeminiModels(geminiModels);
  
  console.log(`\n📊 Found models:`);
  console.log(`  🟣 Claude: ${claudeModels.length} models (priority)`);
  console.log(`  🔵 Gemini: ${filteredGeminiModels.length} models (filtered from ${geminiModels.length} total)`);
  console.log(`  🟠 OpenRouter: ${openrouterModels.length} models (diverse selection)`);
  console.log(`  📈 Total: ${claudeModels.length + filteredGeminiModels.length + openrouterModels.length} models\n`);

  // Generate new types file
  const typesContent = generateModelTypes(geminiModels, claudeModels, openrouterModels);
  
  // Write to file
  const typesPath = path.join(__dirname, '..', 'lib', 'ai', 'types.ts');
  fs.writeFileSync(typesPath, typesContent, 'utf8');
  
  console.log('✅ Successfully updated lib/ai/types.ts');
  console.log('🎉 AI models are now up to date!');
  
  // Display latest models
  console.log('\n🔥 Latest models available:');
  console.log(`  🔵 ${geminiModels[0]?.name || 'No Gemini models'}`);
  console.log(`  🟣 ${claudeModels[0]?.name || 'No Claude models'}`);
  console.log(`  🟠 ${openrouterModels[0]?.name || 'No OpenRouter models'}`);
}

// Run the script
updateModels().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
}); 