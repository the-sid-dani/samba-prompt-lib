"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, Zap, Eye } from "lucide-react";
import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from "web-vitals";

interface PerformanceMetrics {
  cls?: number;
  inp?: number;
  fcp?: number;
  lcp?: number;
  ttfb?: number;
}

interface PerformanceState {
  metrics: PerformanceMetrics;
  isLoading: boolean;
}

export function PerformanceMonitor() {
  const [state, setState] = useState<PerformanceState>({
    metrics: {},
    isLoading: true,
  });

  useEffect(() => {
    let mounted = true;

    const updateMetric = (metric: Metric) => {
      if (!mounted) return;
      
      setState((prev) => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          [metric.name.toLowerCase()]: metric.value,
        },
        isLoading: false,
      }));
    };

    // Subscribe to web vitals
    onCLS(updateMetric);
    onINP(updateMetric);
    onFCP(updateMetric);
    onLCP(updateMetric);
    onTTFB(updateMetric);

    // Set loading to false after a timeout
    const timer = setTimeout(() => {
      if (mounted) {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    }, 3000);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  const getScoreColor = (score: number, thresholds: [number, number]): string => {
    const [good, needs] = thresholds;
    if (score <= good) return "text-green-600";
    if (score <= needs) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number, thresholds: [number, number]): string => {
    const [good, needs] = thresholds;
    if (score <= good) return "Good";
    if (score <= needs) return "Needs Improvement";
    return "Poor";
  };

  const metricConfig = [
    {
      key: "lcp" as keyof PerformanceMetrics,
      label: "LCP",
      name: "Largest Contentful Paint",
      icon: Eye,
      unit: "ms",
      thresholds: [2500, 4000] as [number, number],
      description: "Time until the largest content element is rendered",
    },
    {
      key: "inp" as keyof PerformanceMetrics,
      label: "INP",
      name: "Interaction to Next Paint",
      icon: Zap,
      unit: "ms",
      thresholds: [200, 500] as [number, number],
      description: "Time from user interaction to visual response",
    },
    {
      key: "cls" as keyof PerformanceMetrics,
      label: "CLS",
      name: "Cumulative Layout Shift",
      icon: Activity,
      unit: "",
      thresholds: [0.1, 0.25] as [number, number],
      description: "Visual stability of the page",
    },
    {
      key: "fcp" as keyof PerformanceMetrics,
      label: "FCP",
      name: "First Contentful Paint",
      icon: Clock,
      unit: "ms",
      thresholds: [1800, 3000] as [number, number],
      description: "Time until first content is painted",
    },
    {
      key: "ttfb" as keyof PerformanceMetrics,
      label: "TTFB",
      name: "Time to First Byte",
      icon: Clock,
      unit: "ms",
      thresholds: [800, 1800] as [number, number],
      description: "Time until first byte is received",
    },
  ];

  if (state.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metricConfig.map((config) => (
              <div key={config.key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <config.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{config.label}</span>
                </div>
                <div className="h-6 bg-muted rounded animate-pulse w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metricConfig.map((config) => {
            const value = state.metrics[config.key];
            const Icon = config.icon;

            return (
              <div key={config.key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-sm font-medium">{config.label}</span>
                    <p className="text-xs text-muted-foreground">
                      {config.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {value !== undefined ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono">
                        {config.key === "cls"
                          ? value.toFixed(3)
                          : Math.round(value)}{config.unit}
                      </span>
                      <Badge
                        variant="outline"
                        className={getScoreColor(value, config.thresholds)}
                      >
                        {getScoreLabel(value, config.thresholds)}
                      </Badge>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Measuring...
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

 