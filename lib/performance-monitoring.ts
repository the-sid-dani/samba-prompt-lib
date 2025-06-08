'use client';

import { onCLS, onINP, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';

// Performance metrics collection
export interface PerformanceMetrics {
  // Core Web Vitals
  cls?: number;
  fid?: number;
  fcp?: number;
  lcp?: number;
  ttfb?: number;
  
  // Custom metrics
  pageLoadTime?: number;
  domContentLoaded?: number;
  firstPaint?: number;
  totalBlockingTime?: number;
  
  // User context
  url: string;
  userAgent: string;
  timestamp: number;
  
  // Network information
  connectionType?: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

// Performance thresholds based on Core Web Vitals guidelines
export const PERFORMANCE_THRESHOLDS = {
  // Core Web Vitals (good/needs improvement/poor)
  LCP: { good: 2500, poor: 4000 }, // ms
  FID: { good: 100, poor: 300 }, // ms
  CLS: { good: 0.1, poor: 0.25 }, // ratio
  FCP: { good: 1800, poor: 3000 }, // ms
  TTFB: { good: 800, poor: 1800 }, // ms
  
  // Custom metrics
  PAGE_LOAD: { good: 3000, poor: 6000 }, // ms
  DOM_CONTENT: { good: 1500, poor: 3000 }, // ms
} as const;

// Performance score calculation
export function calculatePerformanceScore(metrics: PerformanceMetrics): {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  breakdown: Record<string, { score: number; threshold: string }>;
} {
  const breakdown: Record<string, { score: number; threshold: string }> = {};
  let totalScore = 0;
  let metricCount = 0;

  // Core Web Vitals scoring
  if (metrics.lcp) {
    const lcpScore = metrics.lcp <= PERFORMANCE_THRESHOLDS.LCP.good ? 100 : 
                    metrics.lcp <= PERFORMANCE_THRESHOLDS.LCP.poor ? 75 : 25;
    breakdown.LCP = { 
      score: lcpScore, 
      threshold: metrics.lcp <= PERFORMANCE_THRESHOLDS.LCP.good ? 'good' : 
                metrics.lcp <= PERFORMANCE_THRESHOLDS.LCP.poor ? 'needs improvement' : 'poor'
    };
    totalScore += lcpScore;
    metricCount++;
  }

  if (metrics.fid) {
    const fidScore = metrics.fid <= PERFORMANCE_THRESHOLDS.FID.good ? 100 : 
                    metrics.fid <= PERFORMANCE_THRESHOLDS.FID.poor ? 75 : 25;
    breakdown.FID = { 
      score: fidScore, 
      threshold: metrics.fid <= PERFORMANCE_THRESHOLDS.FID.good ? 'good' : 
                metrics.fid <= PERFORMANCE_THRESHOLDS.FID.poor ? 'needs improvement' : 'poor'
    };
    totalScore += fidScore;
    metricCount++;
  }

  if (metrics.cls !== undefined) {
    const clsScore = metrics.cls <= PERFORMANCE_THRESHOLDS.CLS.good ? 100 : 
                    metrics.cls <= PERFORMANCE_THRESHOLDS.CLS.poor ? 75 : 25;
    breakdown.CLS = { 
      score: clsScore, 
      threshold: metrics.cls <= PERFORMANCE_THRESHOLDS.CLS.good ? 'good' : 
                metrics.cls <= PERFORMANCE_THRESHOLDS.CLS.poor ? 'needs improvement' : 'poor'
    };
    totalScore += clsScore;
    metricCount++;
  }

  const averageScore = metricCount > 0 ? totalScore / metricCount : 0;
  
  const grade = averageScore >= 90 ? 'A' : 
               averageScore >= 80 ? 'B' : 
               averageScore >= 70 ? 'C' : 
               averageScore >= 60 ? 'D' : 'F';

  return { score: Math.round(averageScore), grade, breakdown };
}

// Web Vitals collection class
export class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private callbacks: Array<(metrics: PerformanceMetrics) => void> = [];
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeWebVitals();
      this.collectCustomMetrics();
    }
  }

  private initializeWebVitals() {
    // Collect Core Web Vitals
    onCLS((metric: Metric) => {
      this.updateMetric('cls', metric.value);
    });

    onINP((metric: Metric) => {
      this.updateMetric('fid', metric.value);
    });

    onFCP((metric: Metric) => {
      this.updateMetric('fcp', metric.value);
    });

    onLCP((metric: Metric) => {
      this.updateMetric('lcp', metric.value);
    });

    onTTFB((metric: Metric) => {
      this.updateMetric('ttfb', metric.value);
    });
  }

  private collectCustomMetrics() {
    // Navigation timing API
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
      this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
    }

    // Paint timing API
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    if (firstPaint) {
      this.metrics.firstPaint = firstPaint.startTime;
    }

    // Network information (experimental)
    const connection = (navigator as any)?.connection;
    if (connection) {
      this.metrics = {
        ...this.metrics,
        connectionType: connection.type,
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
      };
    }

    // Context information
    this.metrics.url = window.location.href;
    this.metrics.userAgent = navigator.userAgent;
    this.metrics.timestamp = Date.now();
  }

  private updateMetric(key: keyof PerformanceMetrics, value: number) {
    (this.metrics as any)[key] = value;
    
    // Trigger callbacks when we have enough data
    if (this.hasMinimumMetrics()) {
      this.notifyCallbacks();
    }
  }

  private hasMinimumMetrics(): boolean {
    return !!(this.metrics.lcp && this.metrics.fcp);
  }

  private notifyCallbacks() {
    const completeMetrics = this.getCompleteMetrics();
    this.callbacks.forEach(callback => callback(completeMetrics));
  }

  private getCompleteMetrics(): PerformanceMetrics {
    return {
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      ...this.metrics,
    } as PerformanceMetrics;
  }

  // Public API
  public onMetricsReady(callback: (metrics: PerformanceMetrics) => void) {
    this.callbacks.push(callback);
    
    // If we already have metrics, call immediately
    if (this.hasMinimumMetrics()) {
      callback(this.getCompleteMetrics());
    }
  }

  public getMetrics(): PerformanceMetrics {
    return this.getCompleteMetrics();
  }

  public sendMetrics(endpoint: string = '/api/analytics/performance') {
    if (!this.hasMinimumMetrics()) return;

    const metrics = this.getCompleteMetrics();
    
    // Use beacon API for reliable delivery
    if ('sendBeacon' in navigator) {
      navigator.sendBeacon(endpoint, JSON.stringify(metrics));
    } else {
      // Fallback to fetch
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metrics),
        keepalive: true,
      }).catch(console.error);
    }
  }
}

// Performance optimization recommendations
export function getPerformanceRecommendations(metrics: PerformanceMetrics): string[] {
  const recommendations: string[] = [];

  if (metrics.lcp && metrics.lcp > PERFORMANCE_THRESHOLDS.LCP.poor) {
    recommendations.push('🖼️ Optimize images and largest contentful paint elements');
    recommendations.push('⚡ Enable image preloading for above-the-fold content');
  }

  if (metrics.fid && metrics.fid > PERFORMANCE_THRESHOLDS.FID.poor) {
    recommendations.push('📦 Reduce JavaScript bundle size with code splitting');
    recommendations.push('🔄 Optimize third-party scripts and defer non-critical JS');
  }

  if (metrics.cls && metrics.cls > PERFORMANCE_THRESHOLDS.CLS.poor) {
    recommendations.push('📏 Set explicit dimensions for images and videos');
    recommendations.push('🎨 Avoid inserting content above existing content');
  }

  if (metrics.ttfb && metrics.ttfb > PERFORMANCE_THRESHOLDS.TTFB.poor) {
    recommendations.push('🏃 Optimize server response times');
    recommendations.push('📊 Implement better caching strategies');
  }

  if (metrics.pageLoadTime && metrics.pageLoadTime > PERFORMANCE_THRESHOLDS.PAGE_LOAD.poor) {
    recommendations.push('🚀 Consider implementing service workers for caching');
    recommendations.push('📡 Optimize API calls and reduce payload sizes');
  }

  return recommendations;
}

// Utility to track custom events
export function trackCustomEvent(name: string, value: number, additionalData?: Record<string, any>) {
  // Mark the custom event
  performance.mark(`custom-${name}-${Date.now()}`);
  
  // Send to analytics
  const eventData = {
    name,
    value,
    timestamp: Date.now(),
    url: window.location.href,
    ...additionalData,
  };

  // Use the same endpoint as performance metrics
  if ('sendBeacon' in navigator) {
    navigator.sendBeacon('/api/analytics/events', JSON.stringify(eventData));
  }
}

// Global performance monitor instance
let globalMonitor: PerformanceMonitor | null = null;

export function getPerformanceMonitor(): PerformanceMonitor {
  if (typeof window === 'undefined') {
    // Return a mock for server-side
    return {
      onMetricsReady: () => {},
      getMetrics: () => ({} as PerformanceMetrics),
      sendMetrics: () => {},
    } as unknown as PerformanceMonitor;
  }

  if (!globalMonitor) {
    globalMonitor = new PerformanceMonitor();
  }

  return globalMonitor;
} 