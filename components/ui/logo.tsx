'use client';

import Image from 'next/image';
import { useTheme } from '@/hooks/use-theme';
import { useEffect, useState } from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function Logo({ 
  width = 150, 
  height = 32, 
  className = "h-8 w-auto",
  priority = false 
}: LogoProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show default logo during SSR and initial hydration
  if (!mounted) {
    return (
      <Image
        src="/sambatv-logo.png"
        alt="SambaTV"
        width={width}
        height={height}
        className={className}
        priority={priority}
      />
    );
  }

  // Use white logo for dark theme, black logo for light theme
  const logoSrc = resolvedTheme === 'dark' ? '/sambatv-logo-white.png' : '/sambatv-logo.png';

  return (
    <Image
      src={logoSrc}
      alt="SambaTV"
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
} 