import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Loading fallback functions
const DynamicLoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
  </div>
);

// Modal loading fallback  
const ModalLoadingFallback = () => (
  <div className="flex items-center justify-center p-12">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
    <span className="ml-2 text-sm text-muted-foreground">Loading modal...</span>
  </div>
);

// Dynamic imports for modal components (non-critical)
export const DynamicImprovementModal = dynamic(
  () => import('@/components/improvement-modal').then(mod => mod.ImprovementModal),
  {
    loading: ModalLoadingFallback,
    ssr: false, // Don't render on server side
  }
);

export const DynamicForkModal = dynamic(
  () => import('@/components/fork-modal').then(mod => mod.ForkModal),
  {
    loading: ModalLoadingFallback,
    ssr: false,
  }
);

// Dynamic imports for complex form components
export const DynamicEditProfileModal = dynamic(
  () => import('@/components/profile/EditProfileModal').then(mod => mod.EditProfileModal),
  {
    loading: ModalLoadingFallback,
    ssr: false,
  }
);

// Dynamic imports for heavy UI components
export const DynamicMarkdownEditor = dynamic(
  () => import('@/components/markdown-editor').then(mod => mod.MarkdownEditor),
  {
    loading: DynamicLoadingFallback,
    ssr: false,
  }
);

// Dynamic imports for playground-specific components
export const DynamicModelPreferences = dynamic(
  () => import('@/components/playground/ModelPreferences').then(mod => mod.ModelPreferences),
  {
    loading: DynamicLoadingFallback,
    ssr: false,
  }
);

// Dynamic import for tag cloud (data visualization)
export const DynamicTagCloud = dynamic(
  () => import('@/components/tag-cloud'),
  {
    loading: DynamicLoadingFallback,
    ssr: false,
  }
);

// Dynamic import for template variables component
export const DynamicTemplateVariables = dynamic(
  () => import('@/components/template-variables').then(mod => mod.TemplateVariables),
  {
    loading: DynamicLoadingFallback,
    ssr: false,
  }
);

// Dynamic import for prompt content renderer (code highlighting)
export const DynamicPromptContentRenderer = dynamic(
  () => import('@/components/prompt-content-renderer').then(mod => ({ default: mod.PromptContentRenderer })),
  {
    loading: DynamicLoadingFallback,
    ssr: false,
  }
);

// Higher-order component for dynamic loading
export function withDynamicLoading<T extends object>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: {
    ssr?: boolean;
  } = {}
) {
  return dynamic(importFn, {
    loading: DynamicLoadingFallback,
    ssr: options.ssr !== false, // Default to true unless explicitly disabled
  });
}

// Utility for preloading components when user hovers over trigger
export const preloadComponent = (importFn: () => Promise<any>) => {
  return () => {
    try {
      importFn();
    } catch (error) {
      console.warn('Failed to preload component:', error);
    }
  };
};

// Preload functions for common components
export const preloadModals = {
  improvement: preloadComponent(() => import('@/components/improvement-modal')),
  fork: preloadComponent(() => import('@/components/fork-modal')),
  editProfile: preloadComponent(() => import('@/components/profile/EditProfileModal')),
};

export const preloadPlayground = {
  modelPreferences: preloadComponent(() => import('@/components/playground/ModelPreferences')),
  templateVariables: preloadComponent(() => import('@/components/template-variables')),
  promptRenderer: preloadComponent(() => import('@/components/prompt-content-renderer')),
}; 