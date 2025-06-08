'use client';

import { ThemeProvider } from '@/hooks/use-theme';
import { ReactNode } from 'react';

interface ThemeProviderWrapperProps {
  children: ReactNode;
}

export default function ThemeProviderWrapper({ children }: ThemeProviderWrapperProps) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="sambatv-theme">
      {children}
    </ThemeProvider>
  );
}