import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'placeholder' | 'blurDataURL'> {
  priority?: boolean;
  className?: string;
  fallbackSrc?: string;
  /**
   * Optimize for different use cases:
   * - 'hero': Large hero images, above the fold
   * - 'logo': Brand logos and navigation
   * - 'avatar': User profile images
   * - 'content': Content images within posts/cards
   */
  optimizationType?: 'hero' | 'logo' | 'avatar' | 'content';
}

// Default blur placeholder (lightweight base64 image)
const DEFAULT_BLUR_DATA_URL = 
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';

export function OptimizedImage({ 
  optimizationType = 'content',
  priority = false,
  className,
  fallbackSrc,
  ...props 
}: OptimizedImageProps) {
  // Set priority and sizes based on optimization type
  const getOptimizedProps = () => {
    switch (optimizationType) {
      case 'hero':
        return {
          priority: true,
          sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px',
          quality: 90,
        };
      case 'logo':
        return {
          priority: true,
          sizes: '(max-width: 768px) 120px, 160px',
          quality: 95,
        };
      case 'avatar':
        return {
          priority: false,
          sizes: '(max-width: 768px) 40px, 60px',
          quality: 85,
        };
      case 'content':
      default:
        return {
          priority: false,
          sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px',
          quality: 85,
        };
    }
  };

  const optimizedProps = getOptimizedProps();

  return (
    <Image
      {...props}
      {...optimizedProps}
      priority={priority || optimizedProps.priority}
      placeholder="blur"
      blurDataURL={DEFAULT_BLUR_DATA_URL}
      alt={props.alt || ''}
      className={cn(
        'transition-opacity duration-300',
        className
      )}
      onError={(e) => {
        if (fallbackSrc) {
          const target = e.target as HTMLImageElement;
          target.src = fallbackSrc;
        }
      }}
    />
  );
} 