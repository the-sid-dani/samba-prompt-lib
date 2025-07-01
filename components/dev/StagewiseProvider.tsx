'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';

// Dynamically import the stagewise toolbar with error handling
const StagewiseToolbarWrapper = dynamic(
  async () => {
    try {
      const [toolbarMod, pluginMod] = await Promise.all([
        import('@stagewise/toolbar-next'),
        import('@stagewise-plugins/react')
      ]);
      
      const { StagewiseToolbar } = toolbarMod;
      const { ReactPlugin } = pluginMod;
      
      return {
        default: () => (
          <StagewiseToolbar 
            config={{
              plugins: [ReactPlugin]
            }} 
          />
        )
      };
    } catch (error) {
      console.warn('Stagewise toolbar failed to load:', error);
      // Return empty component if loading fails
      return {
        default: () => null
      };
    }
  },
  { 
    ssr: false,
    loading: () => null,
  }
);

export default function StagewiseProvider() {
  const [isDevelopment, setIsDevelopment] = useState(false);

  useEffect(() => {
    // Safely check environment variable on client side
    setIsDevelopment(process.env.NODE_ENV === 'development');
  }, []);

  // Only render in development mode
  if (!isDevelopment) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <StagewiseToolbarWrapper />
    </Suspense>
  );
} 