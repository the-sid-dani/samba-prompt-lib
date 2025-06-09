'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, Zap, Clock } from 'lucide-react'

interface CostInfo {
  totalCost: number
  inputCost: number
  outputCost: number
  formattedCost: string
  provider: string
}

interface Usage {
  promptTokens?: number
  completionTokens?: number
  totalTokens?: number
}

interface CostDisplayProps {
  cost?: CostInfo | null
  usage?: Usage | null
  model?: string
  duration?: number
  className?: string
}

export function CostDisplay({ cost, usage, model, duration, className }: CostDisplayProps) {
  if (!cost && !usage) {
    return null
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Usage & Cost
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Cost Information */}
        {cost && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Cost</span>
              <Badge variant="secondary" className="font-mono">
                {cost.formattedCost}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Input:</span>
                <span className="font-mono">${cost.inputCost.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Output:</span>
                <span className="font-mono">${cost.outputCost.toFixed(6)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t">
              <span className="text-sm text-muted-foreground">Provider</span>
              <Badge variant="outline" className="text-xs">
                {cost.provider}
              </Badge>
            </div>
          </div>
        )}

        {/* Token Usage */}
        {usage && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm font-medium">Token Usage</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="font-mono font-medium">{usage.promptTokens || 0}</div>
                <div className="text-muted-foreground">Input</div>
              </div>
              <div className="text-center">
                <div className="font-mono font-medium">{usage.completionTokens || 0}</div>
                <div className="text-muted-foreground">Output</div>
              </div>
              <div className="text-center">
                <div className="font-mono font-medium">{usage.totalTokens || 0}</div>
                <div className="text-muted-foreground">Total</div>
              </div>
            </div>
          </div>
        )}

        {/* Model and Duration */}
        <div className="flex items-center justify-between pt-2 border-t text-xs">
          {model && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Model:</span>
              <code className="text-xs bg-muted px-1 py-0.5 rounded">{model}</code>
            </div>
          )}
          
          {duration && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">{duration}ms</span>
            </div>
          )}
        </div>

        {/* Cost Efficiency Indicator */}
        {cost && usage && usage.totalTokens && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Cost per 1K tokens</span>
              <span className="font-mono">
                ${((cost.totalCost / usage.totalTokens) * 1000).toFixed(4)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default CostDisplay 