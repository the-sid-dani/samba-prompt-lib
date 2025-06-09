import { getModelPricing, DEFAULT_PRICING, type ModelPricing } from '@/config/ai-pricing'

export interface CostCalculation {
  inputCost: number
  outputCost: number
  totalCost: number
  inputTokens: number
  outputTokens: number
  totalTokens: number
  model: string
  provider: string
  pricing: ModelPricing
}

export interface TokenUsage {
  inputTokens: number
  outputTokens: number
  totalTokens: number
}

/**
 * Calculate the cost of AI model usage
 */
export function calculateModelCost(
  provider: string,
  model: string,
  inputTokens: number,
  outputTokens: number
): CostCalculation {
  const pricing = getModelPricing(provider, model)
  
  // Calculate costs (pricing is per 1000 tokens)
  const inputCost = (inputTokens / 1000) * pricing.inputCostPer1000
  const outputCost = (outputTokens / 1000) * pricing.outputCostPer1000
  const totalCost = inputCost + outputCost
  
  return {
    inputCost: Math.round(inputCost * 1000000) / 1000000, // Round to 6 decimal places
    outputCost: Math.round(outputCost * 1000000) / 1000000,
    totalCost: Math.round(totalCost * 1000000) / 1000000,
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    model,
    provider,
    pricing
  }
}

/**
 * Format cost as currency string
 */
export function formatCost(cost: number): string {
  if (cost < 0.01) {
    return `$${cost.toFixed(6)}`
  } else if (cost < 1) {
    return `$${cost.toFixed(4)}`
  } else {
    return `$${cost.toFixed(2)}`
  }
}

/**
 * Format cost breakdown for display
 */
export function formatCostBreakdown(calculation: CostCalculation): string {
  const inputCostStr = formatCost(calculation.inputCost)
  const outputCostStr = formatCost(calculation.outputCost)
  const totalCostStr = formatCost(calculation.totalCost)
  
  return `${totalCostStr} (Input: ${inputCostStr}, Output: ${outputCostStr})`
}

/**
 * Estimate token count for text (rough approximation)
 * This is a fallback when actual token counts aren't available
 */
export function estimateTokenCount(text: string): number {
  // Rough approximation: 1 token ≈ 4 characters for English text
  // This varies significantly by model and language
  return Math.ceil(text.length / 4)
}

/**
 * Calculate estimated cost for text input/output
 */
export function estimateTextCost(
  provider: string,
  model: string,
  inputText: string,
  outputText: string
): CostCalculation {
  const inputTokens = estimateTokenCount(inputText)
  const outputTokens = estimateTokenCount(outputText)
  
  return calculateModelCost(provider, model, inputTokens, outputTokens)
}

/**
 * Get cost per token for a model
 */
export function getCostPerToken(provider: string, model: string): {
  inputCostPerToken: number
  outputCostPerToken: number
} {
  const pricing = getModelPricing(provider, model)
  
  return {
    inputCostPerToken: pricing.inputCostPer1000 / 1000,
    outputCostPerToken: pricing.outputCostPer1000 / 1000
  }
}

/**
 * Compare costs between different models
 */
export function compareModelCosts(
  models: Array<{ provider: string; model: string }>,
  inputTokens: number,
  outputTokens: number
): Array<CostCalculation & { rank: number }> {
  const calculations = models.map(({ provider, model }) =>
    calculateModelCost(provider, model, inputTokens, outputTokens)
  )
  
  // Sort by total cost (ascending)
  calculations.sort((a, b) => a.totalCost - b.totalCost)
  
  // Add rank
  return calculations.map((calc, index) => ({
    ...calc,
    rank: index + 1
  }))
}

/**
 * Calculate cost savings between two models
 */
export function calculateSavings(
  expensiveModel: CostCalculation,
  cheaperModel: CostCalculation
): {
  absoluteSavings: number
  percentageSavings: number
  formattedSavings: string
} {
  const absoluteSavings = expensiveModel.totalCost - cheaperModel.totalCost
  const percentageSavings = expensiveModel.totalCost > 0 
    ? (absoluteSavings / expensiveModel.totalCost) * 100 
    : 0
  
  return {
    absoluteSavings: Math.round(absoluteSavings * 1000000) / 1000000,
    percentageSavings: Math.round(percentageSavings * 100) / 100,
    formattedSavings: formatCost(absoluteSavings)
  }
}

/**
 * Calculate monthly cost projection based on usage
 */
export function projectMonthlyCost(
  dailyUsage: CostCalculation[],
  daysInMonth: number = 30
): {
  totalMonthlyCost: number
  averageDailyCost: number
  formattedMonthlyCost: string
  formattedDailyCost: string
} {
  const totalDailyCost = dailyUsage.reduce((sum, usage) => sum + usage.totalCost, 0)
  const averageDailyCost = totalDailyCost / dailyUsage.length
  const totalMonthlyCost = averageDailyCost * daysInMonth
  
  return {
    totalMonthlyCost: Math.round(totalMonthlyCost * 100) / 100,
    averageDailyCost: Math.round(averageDailyCost * 1000000) / 1000000,
    formattedMonthlyCost: formatCost(totalMonthlyCost),
    formattedDailyCost: formatCost(averageDailyCost)
  }
}

/**
 * Get cost efficiency metrics
 */
export function getCostEfficiencyMetrics(calculations: CostCalculation[]): {
  averageCostPerToken: number
  averageCostPerRequest: number
  totalTokens: number
  totalCost: number
  mostExpensiveRequest: CostCalculation
  cheapestRequest: CostCalculation
} {
  if (calculations.length === 0) {
    const emptyCalc = calculateModelCost('unknown', 'unknown', 0, 0)
    return {
      averageCostPerToken: 0,
      averageCostPerRequest: 0,
      totalTokens: 0,
      totalCost: 0,
      mostExpensiveRequest: emptyCalc,
      cheapestRequest: emptyCalc
    }
  }
  
  const totalCost = calculations.reduce((sum, calc) => sum + calc.totalCost, 0)
  const totalTokens = calculations.reduce((sum, calc) => sum + calc.totalTokens, 0)
  
  const sortedByCost = [...calculations].sort((a, b) => a.totalCost - b.totalCost)
  
  return {
    averageCostPerToken: totalTokens > 0 ? totalCost / totalTokens : 0,
    averageCostPerRequest: totalCost / calculations.length,
    totalTokens,
    totalCost,
    mostExpensiveRequest: sortedByCost[sortedByCost.length - 1],
    cheapestRequest: sortedByCost[0]
  }
} 