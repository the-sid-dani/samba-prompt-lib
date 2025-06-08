import { useState, useEffect, useCallback } from 'react';
import { ModelPreferences, DEFAULT_MODEL_PREFERENCES } from '@/lib/ai/types';
import { SUPPORTED_MODELS, ModelInfo } from '@/lib/ai/generated-models';

const STORAGE_KEY = 'playground-model-preferences';
const PREFERENCES_VERSION = '2.0'; // Updated when adding Claude 4.x models

export function useModelPreferences() {
  const [preferences, setPreferences] = useState<ModelPreferences>(DEFAULT_MODEL_PREFERENCES);
  const [loading, setLoading] = useState(true);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Check if preferences are from an older version - if so, reset to defaults
        if (!parsed.version || parsed.version !== PREFERENCES_VERSION) {
          setPreferences(DEFAULT_MODEL_PREFERENCES);
          // Save the new defaults to localStorage
          const toStore = {
            ...DEFAULT_MODEL_PREFERENCES,
            version: PREFERENCES_VERSION,
            enabledModels: Array.from(DEFAULT_MODEL_PREFERENCES.enabledModels)
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
        } else {
          // Load existing preferences
          const loadedPrefs = {
            ...DEFAULT_MODEL_PREFERENCES,
            ...parsed,
            enabledModels: new Set(parsed.enabledModels || [])
          };
          setPreferences(loadedPrefs);
        }
      } else {
        // No stored preferences, use defaults and save them
        setPreferences(DEFAULT_MODEL_PREFERENCES);
        const toStore = {
          ...DEFAULT_MODEL_PREFERENCES,
          version: PREFERENCES_VERSION,
          enabledModels: Array.from(DEFAULT_MODEL_PREFERENCES.enabledModels)
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
      }
    } catch (error) {
      console.error('Failed to load model preferences:', error);
      setPreferences(DEFAULT_MODEL_PREFERENCES);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save preferences to localStorage whenever they change
  const savePreferences = useCallback((newPreferences: ModelPreferences) => {
    try {
      const toStore = {
        ...newPreferences,
        version: PREFERENCES_VERSION,
        enabledModels: Array.from(newPreferences.enabledModels)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
      setPreferences(newPreferences);
    } catch (error) {
      console.error('Failed to save model preferences:', error);
    }
  }, []);

  // Toggle a specific model on/off
  const toggleModel = useCallback((modelId: string) => {
    const newEnabledModels = new Set(preferences.enabledModels);
    const wasEnabled = newEnabledModels.has(modelId);
    
    if (wasEnabled) {
      newEnabledModels.delete(modelId);
    } else {
      newEnabledModels.add(modelId);
    }
    

    
    const newPreferences = {
      ...preferences,
      enabledModels: newEnabledModels
    };
    savePreferences(newPreferences);
  }, [preferences, savePreferences]);

  // Enable all models in a category
  const enableCategory = useCallback((category: string) => {
    const categoryModels = SUPPORTED_MODELS
      .filter(model => model.category === category)
      .map(model => model.id);
    
    const newEnabledModels = new Set([
      ...preferences.enabledModels,
      ...categoryModels
    ]);
    
    const newPreferences = {
      ...preferences,
      enabledModels: newEnabledModels
    };
    savePreferences(newPreferences);
  }, [preferences, savePreferences]);

  // Disable all models in a category
  const disableCategory = useCallback((category: string) => {
    const categoryModels = new Set(SUPPORTED_MODELS
      .filter(model => model.category === category)
      .map(model => model.id));
    
    const newEnabledModels = new Set(
      Array.from(preferences.enabledModels).filter(id => !categoryModels.has(id))
    );
    
    const newPreferences = {
      ...preferences,
      enabledModels: newEnabledModels
    };
    savePreferences(newPreferences);
  }, [preferences, savePreferences]);

  // Enable all models from a provider
  const enableProvider = useCallback((provider: string) => {
    const providerModels = SUPPORTED_MODELS
      .filter(model => model.provider === provider)
      .map(model => model.id);
    
    const newEnabledModels = new Set([
      ...preferences.enabledModels,
      ...providerModels
    ]);
    
    const newPreferences = {
      ...preferences,
      enabledModels: newEnabledModels
    };
    savePreferences(newPreferences);
  }, [preferences, savePreferences]);

  // Disable all models from a provider
  const disableProvider = useCallback((provider: string) => {
    const providerModels = new Set(SUPPORTED_MODELS
      .filter(model => model.provider === provider)
      .map(model => model.id));
    
    const newEnabledModels = new Set(
      Array.from(preferences.enabledModels).filter(id => !providerModels.has(id))
    );
    
    const newPreferences = {
      ...preferences,
      enabledModels: newEnabledModels
    };
    savePreferences(newPreferences);
  }, [preferences, savePreferences]);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    savePreferences(DEFAULT_MODEL_PREFERENCES);
  }, [savePreferences]);

  // Update other preferences
  const updatePreferences = useCallback((updates: Partial<Omit<ModelPreferences, 'enabledModels'>>) => {
    const newPreferences = {
      ...preferences,
      ...updates
    };
    savePreferences(newPreferences);
  }, [preferences, savePreferences]);

  // Get filtered models based on current preferences
  const getFilteredModels = useCallback((): ModelInfo[] => {
    const filtered = SUPPORTED_MODELS.filter(model => {
      // Only include enabled models
      return preferences.enabledModels.has(model.id);
    });

    return filtered;
  }, [preferences]);

  return {
    preferences,
    loading,
    toggleModel,
    enableCategory,
    disableCategory,
    enableProvider,
    disableProvider,
    resetToDefaults,
    updatePreferences,
    getFilteredModels,
    allModels: SUPPORTED_MODELS
  };
} 