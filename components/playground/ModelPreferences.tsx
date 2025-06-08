'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Settings,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  Eye,
  Zap,
  Star,
  Beaker
} from 'lucide-react';
import { useModelPreferences } from '@/hooks/useModelPreferences';
import { ModelInfo } from '@/lib/ai/generated-models';

interface ModelPreferencesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ModelPreferences({ open, onOpenChange }: ModelPreferencesProps) {
  const {
    preferences,
    loading,
    toggleModel,
    enableCategory,
    disableCategory,
    enableProvider,
    disableProvider,
    resetToDefaults,
    updatePreferences,
    allModels
  } = useModelPreferences();

  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set(['Latest', 'Production']));
  const [openProviders, setOpenProviders] = useState<Set<string>>(new Set(['anthropic', 'google']));

  // Group models by category
  const modelsByCategory = allModels.reduce((acc, model) => {
    const category = model.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(model);
    return acc;
  }, {} as Record<string, ModelInfo[]>);

  // Group models by provider
  const modelsByProvider = allModels.reduce((acc, model) => {
    if (!acc[model.provider]) acc[model.provider] = [];
    acc[model.provider].push(model);
    return acc;
  }, {} as Record<string, ModelInfo[]>);

  const toggleCategory = (category: string) => {
    const newOpen = new Set(openCategories);
    if (newOpen.has(category)) {
      newOpen.delete(category);
    } else {
      newOpen.add(category);
    }
    setOpenCategories(newOpen);
  };

  const toggleProvider = (provider: string) => {
    const newOpen = new Set(openProviders);
    if (newOpen.has(provider)) {
      newOpen.delete(provider);
    } else {
      newOpen.add(provider);
    }
    setOpenProviders(newOpen);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Latest': return <Star className="h-4 w-4" />;
      case 'Experimental': return <Beaker className="h-4 w-4" />;
      case 'Production': return <Zap className="h-4 w-4" />;
      default: return null;
    }
  };

  const getProviderDisplayName = (provider: string) => {
    switch (provider) {
      case 'anthropic': return 'Anthropic';
      case 'google': return 'Google';
      case 'openrouter': return 'OpenRouter';
      default: return provider.charAt(0).toUpperCase() + provider.slice(1);
    }
  };

  const isCategoryEnabled = (category: string) => {
    const categoryModels = modelsByCategory[category] || [];
    return categoryModels.some(model => preferences.enabledModels.has(model.id));
  };

  const isProviderEnabled = (provider: string) => {
    const providerModels = modelsByProvider[provider] || [];
    return providerModels.some(model => preferences.enabledModels.has(model.id));
  };

  const getEnabledCount = () => preferences.enabledModels.size;
  const getTotalCount = () => allModels.length;

  if (loading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Model Preferences
          </DialogTitle>
          <p className="text-sm text-slate-500">
            Choose which AI models appear in your playground dropdown. 
            {getEnabledCount()}/{getTotalCount()} models enabled.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick Actions</Label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={resetToDefaults}
                className="h-8 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm px-3 rounded-md flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                Reset Defaults
              </button>
              {Object.keys(modelsByProvider).map(provider => (
                <button
                  key={provider}
                  onClick={() => enableProvider(provider)}
                  className="h-8 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs px-3 rounded-md flex items-center gap-1"
                >
                  <Eye className="h-3 w-3" />
                  All {getProviderDisplayName(provider)}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Model Selection */}
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {/* By Category */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">By Category</Label>
                {Object.entries(modelsByCategory).map(([category, models]) => (
                  <Collapsible 
                    key={category} 
                    open={openCategories.has(category)}
                    onOpenChange={() => toggleCategory(category)}
                  >
                    <CollapsibleTrigger className="w-full">
                      <div className="w-full cursor-pointer hover:bg-gray-50 rounded-md p-2">
                        <div className="flex items-center gap-2">
                          {openCategories.has(category) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          {getCategoryIcon(category)}
                          <span className="font-medium">{category}</span>
                          <Badge className="text-xs bg-gray-100 text-gray-600">
                            {models.length}
                          </Badge>
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 ml-4 mt-2">
                      {models.map(model => (
                        <div key={model.id} className="flex items-start justify-between p-2 rounded border">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm truncate">{model.id}</span>
                              {model.isLatest && (
                                <Badge className="text-xs bg-green-100 text-green-700">
                                  Latest
                                </Badge>
                              )}
                              {model.isExperimental && (
                                <Badge className="text-xs bg-orange-100 text-orange-700">
                                  Experimental
                                </Badge>
                              )}
                            </div>
                            {model.description && (
                              <p className="text-xs text-slate-500 mt-1">{model.description}</p>
                            )}
                            <p className="text-xs text-slate-400 mt-1">
                              {getProviderDisplayName(model.provider)} • {(model.maxTokens || 8192).toLocaleString()} tokens
                            </p>
                          </div>
                          <Switch
                            checked={preferences.enabledModels.has(model.id)}
                            onCheckedChange={() => toggleModel(model.id)}
                            className="ml-3"
                          />
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-slate-500">
              {getEnabledCount()} of {getTotalCount()} models enabled
            </p>
            <Button onClick={() => onOpenChange(false)}>
              Done
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 