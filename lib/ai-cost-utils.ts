import { 
  AI_MODEL_PRICING, 
  DEFAULT_PRICING, 
  getModelPricing, 
  hasModelPricing,
  getTotalModelCount,
  getPricingStats,
  type ModelPricing 
} from '@/config/ai-pricing'

export interface CostBreakdown {
  inputTokens: number
  outputTokens: number
  inputCost: number
  outputCost: number
  totalCost: number
  provider: string
  model: string
  modelFamily: string
  costPer1000Input: number
  costPer1000Output: number
}

export interface CostEstimate {
  estimatedInputTokens: number
  estimatedOutputTokens: number
  estimatedCost: number
  provider: string
  model: string
}

/**
 * Calculate the cost of an AI model request
 */
export function calculateModelCost(
  provider: string,
  model: string,
  inputTokens: number,
  outputTokens: number
): CostBreakdown {
  const pricing = getModelPricing(provider, model)
  
  const inputCost = (inputTokens / 1000) * pricing.inputCostPer1000
  const outputCost = (outputTokens / 1000) * pricing.outputCostPer1000
  const totalCost = inputCost + outputCost

  return {
    inputTokens,
    outputTokens,
    inputCost,
    outputCost,
    totalCost,
    provider: pricing.provider,
    model,
    modelFamily: pricing.modelFamily,
    costPer1000Input: pricing.inputCostPer1000,
    costPer1000Output: pricing.outputCostPer1000
  }
}

/**
 * Estimate cost for a given input before making the request
 */
export function estimateRequestCost(
  provider: string,
  model: string,
  inputText: string,
  estimatedOutputTokens: number = 500
): CostEstimate {
  const pricing = getModelPricing(provider, model)
  
  // Rough estimation: ~4 characters per token for English text
  const estimatedInputTokens = Math.ceil(inputText.length / 4)
  
  const inputCost = (estimatedInputTokens / 1000) * pricing.inputCostPer1000
  const outputCost = (estimatedOutputTokens / 1000) * pricing.outputCostPer1000
  const estimatedCost = inputCost + outputCost

  return {
    estimatedInputTokens,
    estimatedOutputTokens,
    estimatedCost,
    provider: pricing.provider,
    model
  }
}

/**
 * Format cost as currency string
 */
export function formatCost(cost: number): string {
  if (cost < 0.001) {
    return `$${(cost * 1000).toFixed(4)}‰` // Per mille for very small costs
  }
  if (cost < 0.01) {
    return `$${cost.toFixed(4)}`
  }
  if (cost < 1) {
    return `$${cost.toFixed(3)}`
  }
  return `$${cost.toFixed(2)}`
}

/**
 * Format cost breakdown for display
 */
export function formatCostBreakdown(breakdown: CostBreakdown): string {
  const { inputTokens, outputTokens, inputCost, outputCost, totalCost, provider, model } = breakdown
  
  return [
    `Model: ${provider}/${model}`,
    `Input: ${inputTokens.toLocaleString()} tokens (${formatCost(inputCost)})`,
    `Output: ${outputTokens.toLocaleString()} tokens (${formatCost(outputCost)})`,
    `Total: ${formatCost(totalCost)}`
  ].join('\n')
}

/**
 * Compare costs between different models
 */
export function compareModelCosts(
  models: Array<{ provider: string; model: string }>,
  inputTokens: number,
  outputTokens: number
): Array<CostBreakdown & { rank: number }> {
  const costs = models.map(({ provider, model }) => 
    calculateModelCost(provider, model, inputTokens, outputTokens)
  )
  
  // Sort by total cost (ascending)
  costs.sort((a, b) => a.totalCost - b.totalCost)
  
  // Add ranking
  return costs.map((cost, index) => ({
    ...cost,
    rank: index + 1
  }))
}

/**
 * Get cost efficiency score (lower is better)
 */
export function getCostEfficiencyScore(
  provider: string,
  model: string,
  inputTokens: number = 1000,
  outputTokens: number = 1000
): number {
  const breakdown = calculateModelCost(provider, model, inputTokens, outputTokens)
  return breakdown.totalCost
}

/**
 * Find the most cost-effective model for a given provider
 */
export function findCheapestModelForProvider(
  provider: string,
  inputTokens: number = 1000,
  outputTokens: number = 1000
): { model: string; cost: number } | null {
  const providerPricing = AI_MODEL_PRICING[provider.toLowerCase()]
  if (!providerPricing) return null
  
  const models = Object.keys(providerPricing)
  if (models.length === 0) return null
  
  let cheapestModel = models[0]
  let lowestCost = calculateModelCost(provider, cheapestModel, inputTokens, outputTokens).totalCost
  
  for (const model of models.slice(1)) {
    const cost = calculateModelCost(provider, model, inputTokens, outputTokens).totalCost
    if (cost < lowestCost) {
      lowestCost = cost
      cheapestModel = model
    }
  }
  
  return { model: cheapestModel, cost: lowestCost }
}

/**
 * Get pricing statistics for the entire system
 */
export function getSystemPricingStats() {
  const stats = getPricingStats()
  const totalModels = getTotalModelCount()
  
  // Calculate average costs across all models
  let totalInputCost = 0
  let totalOutputCost = 0
  let modelCount = 0
  
  Object.values(AI_MODEL_PRICING).forEach(provider => {
    Object.values(provider).forEach(pricing => {
      totalInputCost += pricing.inputCostPer1000
      totalOutputCost += pricing.outputCostPer1000
      modelCount++
    })
  })
  
  const avgInputCost = totalInputCost / modelCount
  const avgOutputCost = totalOutputCost / modelCount
  
  return {
    ...stats,
    totalModels,
    averageInputCostPer1000: avgInputCost,
    averageOutputCostPer1000: avgOutputCost,
    averageTotalCostPer1000: avgInputCost + avgOutputCost
  }
}

/**
 * Check if a model has pricing data available
 */
export function isModelPricingAvailable(provider: string, model: string): boolean {
  return hasModelPricing(provider, model)
}

/**
 * Get all available providers with model counts
 */
export function getAvailableProvidersWithCounts(): Array<{ provider: string; modelCount: number }> {
  return Object.entries(AI_MODEL_PRICING).map(([provider, models]) => ({
    provider,
    modelCount: Object.keys(models).length
  })).sort((a, b) => b.modelCount - a.modelCount)
}

/**
 * Estimate tokens from text (rough approximation)
 */
export function estimateTokensFromText(text: string): number {
  // Rough estimation: ~4 characters per token for English text
  // This is a simplified approach - real tokenization varies by model
  return Math.ceil(text.length / 4)
}

/**
 * Calculate cost per character for comparison
 */
export function calculateCostPerCharacter(
  provider: string,
  model: string,
  isOutput: boolean = false
): number {
  const pricing = getModelPricing(provider, model)
  const costPer1000 = isOutput ? pricing.outputCostPer1000 : pricing.inputCostPer1000
  
  // Assuming ~4 characters per token
  const tokensPerCharacter = 1 / 4
  const costPerCharacter = (costPer1000 / 1000) * tokensPerCharacter
  
  return costPerCharacter
}

/**
 * Get model family statistics
 */
export function getModelFamilyStats(): Record<string, { count: number; avgInputCost: number; avgOutputCost: number }> {
  const familyStats: Record<string, { costs: number[]; inputCosts: number[]; outputCosts: number[] }> = {}
  
  Object.values(AI_MODEL_PRICING).forEach(provider => {
    Object.values(provider).forEach(pricing => {
      const family = pricing.modelFamily
      if (!familyStats[family]) {
        familyStats[family] = { costs: [], inputCosts: [], outputCosts: [] }
      }
      familyStats[family].inputCosts.push(pricing.inputCostPer1000)
      familyStats[family].outputCosts.push(pricing.outputCostPer1000)
      familyStats[family].costs.push(pricing.inputCostPer1000 + pricing.outputCostPer1000)
    })
  })
  
  const result: Record<string, { count: number; avgInputCost: number; avgOutputCost: number }> = {}
  
  Object.entries(familyStats).forEach(([family, data]) => {
    const count = data.inputCosts.length
    const avgInputCost = data.inputCosts.reduce((sum, cost) => sum + cost, 0) / count
    const avgOutputCost = data.outputCosts.reduce((sum, cost) => sum + cost, 0) / count
    
    result[family] = { count, avgInputCost, avgOutputCost }
  })
  
  return result
} 