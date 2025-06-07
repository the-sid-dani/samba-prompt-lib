"use client";

import * as React from "react";
import { useLazyLoad } from "@/lib/mobile-performance";
import { cn } from "@/lib/utils";

interface LazyLoadProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  placeholder?: React.ReactNode;
  rootMargin?: string;
}

export function LazyLoad({
  children,
  className,
  threshold = 0.1,
  placeholder,
  rootMargin = "50px",
}: LazyLoadProps) {
  const { ref, isIntersecting } = useLazyLoad(threshold);

  return (
    <div
      ref={ref as any}
      className={cn("min-h-[1px]", className)}
      style={{ minHeight: placeholder ? undefined : "inherit" }}
    >
      {isIntersecting ? (
        children
      ) : (
        placeholder || (
          <div className="animate-pulse bg-muted rounded-md w-full h-full min-h-[100px]" />
        )
      )}
    </div>
  );
}

// Lazy load wrapper for heavy components
export function LazyLoadSection({
  children,
  className,
  fallback,
}: {
  children: React.ReactNode;
  className?: string;
  fallback?: React.ReactNode;
}) {
  const [Component, setComponent] = React.useState<React.ReactNode>(null);
  const { ref, isIntersecting } = useLazyLoad(0.01);

  React.useEffect(() => {
    if (isIntersecting && !Component) {
      setComponent(children);
    }
  }, [isIntersecting, children, Component]);

  return (
    <section ref={ref as any} className={className}>
      {Component || fallback || (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}
    </section>
  );
} 