'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SUPPORTED_MODELS, type ModelInfo } from '@/lib/ai'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useModelPreferences } from '@/hooks/useModelPreferences'

interface ModelVisibilityManagerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ModelVisibility {
  [modelId: string]: boolean
}

const MODEL_VISIBILITY_KEY = 'admin-model-visibility'

export function ModelVisibilityManager({ open, onOpenChange }: ModelVisibilityManagerProps) {
  const [modelVisibility, setModelVisibility] = useState<ModelVisibility>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [hasChanges, setHasChanges] = useState(false)
  const { toast } = useToast()
  const { preferences, savePreferences } = useModelPreferences()

  // Load saved visibility settings
  useEffect(() => {
    const savedVisibility = localStorage.getItem(MODEL_VISIBILITY_KEY)
    if (savedVisibility) {
      setModelVisibility(JSON.parse(savedVisibility))
    } else {
      // Initialize all models as visible by default
      const defaultVisibility: ModelVisibility = {}
      SUPPORTED_MODELS.forEach(model => {
        defaultVisibility[model.id] = true
      })
      setModelVisibility(defaultVisibility)
    }
  }, [])

  // Save visibility settings
  const saveVisibility = () => {
    // Save admin visibility settings
    localStorage.setItem(MODEL_VISIBILITY_KEY, JSON.stringify(modelVisibility))
    
    // Also update user preferences to include all admin-enabled models
    const enabledModelIds = Object.entries(modelVisibility)
      .filter(([_, isVisible]) => isVisible)
      .map(([modelId]) => modelId)
    
    // Create new Set with all currently enabled models plus admin-enabled ones
    const newEnabledModels = new Set([
      ...Array.from(preferences.enabledModels),
      ...enabledModelIds
    ])
    
    // Save updated user preferences
    savePreferences({
      ...preferences,
      enabledModels: newEnabledModels
    })
    
    setHasChanges(false)
    toast({
      title: "Settings Saved",
      description: "Model visibility settings have been updated for all users.",
    })
    
    // Reload the page to ensure the dropdown updates
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  // Toggle model visibility
  const toggleModel = (modelId: string) => {
    setModelVisibility(prev => ({
      ...prev,
      [modelId]: !prev[modelId]
    }))
    setHasChanges(true)
  }

  // Group models by provider
  const modelsByProvider = SUPPORTED_MODELS.reduce((acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = []
    }
    acc[model.provider].push(model)
    return acc
  }, {} as Record<string, ModelInfo[]>)

  // Filter models based on search
  const filteredModelsByProvider = Object.entries(modelsByProvider).reduce((acc, [provider, models]) => {
    const filteredModels = models.filter(model => 
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.toLowerCase().includes(searchQuery.toLowerCase())
    )
    if (filteredModels.length > 0) {
      acc[provider] = filteredModels
    }
    return acc
  }, {} as Record<string, ModelInfo[]>)

  // Count visible models
  const visibleCount = Object.values(modelVisibility).filter(v => v).length
  const totalCount = SUPPORTED_MODELS.length

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[600px] sm:w-[640px]">
        <SheetHeader>
          <SheetTitle>Manage Model Visibility</SheetTitle>
          <SheetDescription>
            Control which AI models are available to users in the playground.
            {visibleCount} of {totalCount} models are currently visible.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const allVisible: ModelVisibility = {}
                SUPPORTED_MODELS.forEach(model => {
                  allVisible[model.id] = true
                })
                setModelVisibility(allVisible)
                setHasChanges(true)
              }}
            >
              Enable All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const allHidden: ModelVisibility = {}
                SUPPORTED_MODELS.forEach(model => {
                  allHidden[model.id] = false
                })
                setModelVisibility(allHidden)
                setHasChanges(true)
              }}
            >
              Disable All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Sync currently visible models to user preferences
                const enabledModelIds = Object.entries(modelVisibility)
                  .filter(([_, isVisible]) => isVisible)
                  .map(([modelId]) => modelId)
                
                const newEnabledModels = new Set(enabledModelIds)
                
                savePreferences({
                  ...preferences,
                  enabledModels: newEnabledModels
                })
                
                toast({
                  title: "Preferences Synced",
                  description: `Your preferences now include ${enabledModelIds.length} selected models.`,
                })
                
                // Reload to update the dropdown
                setTimeout(() => {
                  window.location.reload()
                }, 500)
              }}
            >
              Sync to My Preferences
            </Button>
          </div>

          {/* Model List */}
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {Object.entries(filteredModelsByProvider).map(([provider, models]) => (
                <div key={provider} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold capitalize">{provider}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {models.filter(m => modelVisibility[m.id]).length}/{models.length} visible
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {models.map(model => (
                      <div
                        key={model.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <Label htmlFor={model.id} className="cursor-pointer">
                            <div className="font-medium">{model.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {model.id}
                              {model.category && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {model.category}
                                </Badge>
                              )}
                            </div>
                          </Label>
                        </div>
                        <Switch
                          id={model.id}
                          checked={modelVisibility[model.id] ?? true}
                          onCheckedChange={() => toggleModel(model.id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Save Button */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={saveVisibility}
              disabled={!hasChanges}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 