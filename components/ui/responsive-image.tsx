"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ResponsiveImageProps extends React.ComponentPropsWithoutRef<typeof Image> {
  src: string;
  alt: string;
  aspectRatio?: "square" | "video" | "portrait";
  priority?: boolean;
  skeleton?: boolean;
}

const aspectRatios = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
};

export function ResponsiveImage({
  src,
  alt,
  className,
  aspectRatio,
  priority = false,
  skeleton = true,
  ...props
}: ResponsiveImageProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted",
        aspectRatio && aspectRatios[aspectRatio],
        className
      )}
    >
      {/* Loading skeleton */}
      {skeleton && isLoading && !error && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted to-muted-foreground/10" />
      )}

      {/* Error state */}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-2 text-sm text-muted-foreground">Failed to load</p>
          </div>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onLoad={handleLoad}
          onError={handleError}
          priority={priority}
          className={cn(
            "object-cover transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          {...props}
        />
      )}
    </div>
  );
}

// Export a variant specifically for avatars
export function ResponsiveAvatar({
  src,
  alt,
  size = "default",
  className,
  fallback,
}: {
  src?: string | null;
  alt: string;
  size?: "sm" | "default" | "lg";
  className?: string;
  fallback?: React.ReactNode;
}) {
  const sizeClasses = {
    sm: "h-8 w-8",
    default: "h-10 w-10",
    lg: "h-12 w-12",
  };

  if (!src) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-full bg-muted flex items-center justify-center",
          sizeClasses[size],
          className
        )}
      >
        {fallback || (
          <span className="text-sm font-medium text-muted-foreground">
            {alt.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full",
        sizeClasses[size],
        className
      )}
    >
      <ResponsiveImage
        src={src}
        alt={alt}
        aspectRatio="square"
        skeleton={false}
        className="rounded-full"
      />
    </div>
  );
} 