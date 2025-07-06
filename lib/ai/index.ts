export { aiClient, AIClient } from './client';
export type { 
  AIProvider, 
  GenerationParams, 
  GenerationResponse 
} from './types';
import { SUPPORTED_MODELS } from './generated-models';
export { SUPPORTED_MODELS } from './generated-models';
export type { ModelInfo } from './generated-models';

// Popular models that should be loaded first for better performance
export const POPULAR_MODELS = [
  'claude-3-5-sonnet-20241022',
  'claude-3-5-haiku-20241022', 
  'claude-opus-4-20250514',
  'claude-sonnet-4-20250514',
  'gpt-4o',
  'gpt-4o-mini',
  'gpt-4-turbo',
  'o1-preview',
  'o1-mini',
  'gemini-2.0-flash',
  'gemini-2.5-pro',
  'gemini-1.5-pro-002',
  'deepseek-v3-base:free',
  'llama-3.1-70b-instruct',
];

// Get popular models from the full list
export function getPopularModels() {
  return SUPPORTED_MODELS.filter(model => POPULAR_MODELS.includes(model.id));
} 