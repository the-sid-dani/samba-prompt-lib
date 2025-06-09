#!/usr/bin/env node

/**
 * Script to fetch real-time AI model pricing from LiteLLM
 * Based on: https://docs.litellm.ai/docs/completion/token_usage
 * Data source: https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LITELLM_PRICING_URL = 'https://raw.githubusercontent.com/BerriAI/litellm/main/model_prices_and_context_window.json';

async function fetchLiteLLMPricing() {
  try {
    console.log('Fetching pricing data from LiteLLM...');
    const response = await fetch(LITELLM_PRICING_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ Fetched pricing data for ${Object.keys(data).length} models`);
    return data;
  } catch (error) {
    console.error('❌ Failed to fetch LiteLLM pricing:', error);
    throw error;
  }
}

function mapProviderName(litellmProvider) {
  const providerMap = {
    'openai': 'openai',
    'anthropic': 'anthropic', 
    'google': 'google',
    'openrouter': 'openrouter',
    'azure': 'azure',
    'cohere': 'cohere',
    'mistral': 'mistral',
    'together_ai': 'together',
    'replicate': 'replicate',
    'huggingface': 'huggingface',
    'bedrock': 'bedrock',
    'vertex_ai': 'vertex',
    'palm': 'google',
    'gemini': 'google'
  };
  
  return providerMap[litellmProvider] || litellmProvider;
}

function convertLiteLLMToOurFormat(litellmData) {
  const ourFormat = {};
  
  Object.entries(litellmData).forEach(([modelId, modelData]) => {
    if (!modelData.input_cost_per_token || !modelData.output_cost_per_token) {
      return; // Skip models without pricing data
    }
    
    const provider = mapProviderName(modelData.litellm_provider);
    
    if (!ourFormat[provider]) {
      ourFormat[provider] = {};
    }
    
    // Convert from cost per token to cost per 1000 tokens
    const inputCostPer1000 = modelData.input_cost_per_token * 1000;
    const outputCostPer1000 = modelData.output_cost_per_token * 1000;
    
    // Determine model family
    let modelFamily = 'unknown';
    if (modelId.includes('gpt-4')) modelFamily = 'gpt-4';
    else if (modelId.includes('gpt-3.5')) modelFamily = 'gpt-3.5';
    else if (modelId.includes('claude-3.5')) modelFamily = 'claude-3.5';
    else if (modelId.includes('claude-3')) modelFamily = 'claude-3';
    else if (modelId.includes('gemini-1.5')) modelFamily = 'gemini-1.5';
    else if (modelId.includes('gemini-1.0')) modelFamily = 'gemini-1.0';
    else if (modelId.includes('llama-3.1')) modelFamily = 'llama-3.1';
    else if (modelId.includes('llama-3')) modelFamily = 'llama-3';
    else if (modelId.includes('llama-2')) modelFamily = 'llama-2';
    
    ourFormat[provider][modelId] = {
      inputCostPer1000: Math.round(inputCostPer1000 * 1000000) / 1000000, // Round to 6 decimal places
      outputCostPer1000: Math.round(outputCostPer1000 * 1000000) / 1000000,
      provider: provider,
      modelFamily: modelFamily,
      maxTokens: modelData.max_tokens || null,
      maxInputTokens: modelData.max_input_tokens || null,
      maxOutputTokens: modelData.max_output_tokens || null,
      mode: modelData.mode || 'chat'
    };
  });
  
  return ourFormat;
}

function generateTypeScriptFile(pricingData) {
  const timestamp = new Date().toISOString();
  
  return `// AI Model Pricing Configuration
// Auto-generated from LiteLLM on ${timestamp}
// Source: ${LITELLM_PRICING_URL}
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

// Live pricing data from LiteLLM (${timestamp})
export const AI_MODEL_PRICING: Record<string, ProviderPricing> = ${JSON.stringify(pricingData, null, 2)};

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
    console.warn(\`No pricing data found for provider: \${provider}\`)
    return DEFAULT_PRICING
  }

  const modelPricing = providerPricing[model]
  if (!modelPricing) {
    console.warn(\`No pricing data found for model: \${model} from provider: \${provider}\`)
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
    lastUpdated: '${timestamp}'
  }
}`;
}

async function main() {
  try {
    // Fetch pricing data from LiteLLM
    const litellmData = await fetchLiteLLMPricing();
    
    // Convert to our format
    console.log('🔄 Converting pricing data to our format...');
    const ourPricingData = convertLiteLLMToOurFormat(litellmData);
    
    // Generate TypeScript file
    console.log('📝 Generating TypeScript file...');
    const tsContent = generateTypeScriptFile(ourPricingData);
    
    // Write to file
    const outputPath = path.join(__dirname, '..', 'config', 'ai-pricing.ts');
    fs.writeFileSync(outputPath, tsContent, 'utf8');
    
    // Generate stats
    const stats = {
      totalProviders: Object.keys(ourPricingData).length,
      totalModels: Object.values(ourPricingData).reduce((total, provider) => {
        return total + Object.keys(provider).length;
      }, 0),
      providers: Object.entries(ourPricingData).map(([provider, models]) => ({
        provider,
        modelCount: Object.keys(models).length
      }))
    };
    
    console.log('✅ Successfully updated AI pricing configuration!');
    console.log(`📊 Stats: ${stats.totalModels} models across ${stats.totalProviders} providers`);
    console.log('📁 File saved to:', outputPath);
    
    // Display provider breakdown
    console.log('\n📋 Provider breakdown:');
    stats.providers
      .sort((a, b) => b.modelCount - a.modelCount)
      .forEach(({ provider, modelCount }) => {
        console.log(`  ${provider}: ${modelCount} models`);
      });
    
  } catch (error) {
    console.error('❌ Failed to update pricing:', error);
    process.exit(1);
  }
}

main(); 