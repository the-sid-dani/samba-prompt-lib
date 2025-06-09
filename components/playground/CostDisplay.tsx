'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatCost, type CostBreakdown } from '@/lib/ai-cost-utils'
import { DollarSign, TrendingUp, TrendingDown, Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface CostDisplayProps {
  costBreakdown?: CostBreakdown
  isLoading?: boolean
  className?: string
}

export function CostDisplay({ costBreakdown, isLoading, className }: CostDisplayProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Cost Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!costBreakdown) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Cost Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No cost data available
          </p>
        </CardContent>
      </Card>
    )
  }

  const {
    inputTokens,
    outputTokens,
    inputCost,
    outputCost,
    totalCost,
    provider,
    model,
    modelFamily,
    costPer1000Input,
    costPer1000Output
  } = costBreakdown

  const totalTokens = inputTokens + outputTokens
  const costPerToken = totalTokens > 0 ? totalCost / totalTokens : 0

  // Determine cost efficiency (subjective thresholds)
  const getCostEfficiencyBadge = () => {
    if (totalCost < 0.001) return { label: 'Very Cheap', variant: 'default' as const, icon: TrendingDown }
    if (totalCost < 0.01) return { label: 'Cheap', variant: 'secondary' as const, icon: TrendingDown }
    if (totalCost < 0.1) return { label: 'Moderate', variant: 'outline' as const, icon: TrendingUp }
    return { label: 'Expensive', variant: 'destructive' as const, icon: TrendingUp }
  }

  const efficiency = getCostEfficiencyBadge()
  const EfficiencyIcon = efficiency.icon

  return (
    <TooltipProvider>
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Cost Analysis
            </div>
            <Badge variant={efficiency.variant} className="text-xs">
              <EfficiencyIcon className="h-3 w-3 mr-1" />
              {efficiency.label}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Model Information */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Model:</span>
              <div className="text-right">
                <div className="font-medium">{model}</div>
                <div className="text-xs text-muted-foreground">
                  {provider} • {modelFamily}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Token Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Input Tokens:</span>
              <span className="font-medium">{inputTokens.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Output Tokens:</span>
              <span className="font-medium">{outputTokens.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Total Tokens:</span>
              <span>{totalTokens.toLocaleString()}</span>
            </div>
          </div>

          <Separator />

          {/* Cost Breakdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Input Cost:</span>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{formatCost(costPer1000Input)} per 1K tokens</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="font-medium">{formatCost(inputCost)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Output Cost:</span>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{formatCost(costPer1000Output)} per 1K tokens</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="font-medium">{formatCost(outputCost)}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-medium border-t pt-2">
              <span>Total Cost:</span>
              <span className="text-lg">{formatCost(totalCost)}</span>
            </div>
          </div>

          <Separator />

          {/* Efficiency Metrics */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Cost per Token:</span>
              <span className="font-medium">{formatCost(costPerToken)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Cost per 1K Tokens:</span>
              <span className="font-medium">{formatCost(costPerToken * 1000)}</span>
            </div>
          </div>

          {/* Data Source Attribution */}
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Pricing data from{' '}
              <a 
                href="https://docs.litellm.ai/docs/completion/token_usage" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                LiteLLM
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

export default CostDisplay 