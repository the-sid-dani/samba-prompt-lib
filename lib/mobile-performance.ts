import { useEffect, useState, useRef } from 'react';

// Check if user prefers reduced motion
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

// Check if device is mobile
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
}

// Lazy load component with intersection observer
export function useLazyLoad(threshold = 0.1) {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return { ref: setRef, isIntersecting };
}

// Network connection quality detection
export function useNetworkQuality() {
  const [connectionType, setConnectionType] = useState<string>('unknown');
  const [effectiveType, setEffectiveType] = useState<string>('unknown');
  const [saveData, setSaveData] = useState(false);

  useEffect(() => {
    if ('connection' in navigator) {
      const nav = navigator as any;
      const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
      
      if (connection) {
        setConnectionType(connection.type || 'unknown');
        setEffectiveType(connection.effectiveType || 'unknown');
        setSaveData(connection.saveData || false);

        const updateConnectionInfo = () => {
          setConnectionType(connection.type || 'unknown');
          setEffectiveType(connection.effectiveType || 'unknown');
          setSaveData(connection.saveData || false);
        };

        connection.addEventListener('change', updateConnectionInfo);
        return () => connection.removeEventListener('change', updateConnectionInfo);
      }
    }
  }, []);

  return {
    connectionType,
    effectiveType,
    saveData,
    isSlowConnection: effectiveType === 'slow-2g' || effectiveType === '2g' || saveData,
  };
}

// Debounce function for performance
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Throttle function for scroll events
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

// Optimize animations for mobile
export function getMobileAnimationClass(
  defaultClass: string,
  mobileClass: string,
  prefersReducedMotion: boolean
): string {
  if (prefersReducedMotion) {
    return ''; // No animation if user prefers reduced motion
  }
  
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return mobileClass; // Simplified animation for mobile
  }
  
  return defaultClass; // Full animation for desktop
}

// Preload critical resources
export function preloadResource(href: string, as: string) {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  
  if (as === 'font') {
    link.crossOrigin = 'anonymous';
  }
  
  document.head.appendChild(link);
}

// Check if device has low memory
export function hasLowMemory(): boolean {
  if (typeof window === 'undefined') return false;
  
  const nav = navigator as any;
  if ('deviceMemory' in nav) {
    return nav.deviceMemory < 4; // Less than 4GB is considered low
  }
  
  return false;
}

// Mobile-optimized image loading strategy
export function getOptimizedImageSizes(isMobile: boolean, isSlowConnection: boolean) {
  if (isSlowConnection) {
    return {
      sizes: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
      quality: 60,
    };
  }
  
  if (isMobile) {
    return {
      sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
      quality: 75,
    };
  }
  
  return {
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    quality: 90,
  };
} 