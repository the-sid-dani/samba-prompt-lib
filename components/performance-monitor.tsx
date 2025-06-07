"use client";

import { useEffect } from 'react';

// Web Vitals types
interface Metric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

// Only run in development or with explicit flag
const ENABLE_MONITORING = process.env.NODE_ENV === 'development' && 
  process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === 'true';

export function PerformanceMonitor() {
  useEffect(() => {
    if (!ENABLE_MONITORING) return;

    // Dynamic import to avoid loading in production
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
      const logMetric = (metric: Metric) => {
        // Log to console in development
        console.log(`[Web Vitals] ${metric.name}:`, {
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
        });

        // You could also send to analytics here
        // Example: sendToAnalytics(metric);
      };

      // Core Web Vitals
      onCLS(logMetric); // Cumulative Layout Shift
      onLCP(logMetric); // Largest Contentful Paint
      onINP(logMetric); // Interaction to Next Paint

      // Other metrics
      onFCP(logMetric); // First Contentful Paint
      onTTFB(logMetric); // Time to First Byte
    });
  }, []);

  return null;
}

// Helper to measure component render time
export function measureRenderTime(componentName: string) {
  if (!ENABLE_MONITORING) return;

  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    console.log(`[Render Time] ${componentName}: ${renderTime.toFixed(2)}ms`);
  };
}

// Helper to track long tasks
export function trackLongTasks() {
  if (!ENABLE_MONITORING || !('PerformanceObserver' in window)) return;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.duration > 50) { // Tasks longer than 50ms
        console.warn('[Long Task Detected]', {
          duration: entry.duration,
          startTime: entry.startTime,
          name: entry.name,
        });
      }
    }
  });

  observer.observe({ entryTypes: ['longtask'] });
  
  return () => observer.disconnect();
} 