import { ReactNode, createElement } from 'react';

// Screen reader only text component
interface ScreenReaderOnlyProps {
  children: ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
}

export function ScreenReaderOnly({ children, as: Component = 'span' }: ScreenReaderOnlyProps) {
  return createElement(Component, { className: 'sr-only' }, children);
}

// Live region for dynamic announcements
interface LiveRegionProps {
  children: ReactNode;
  politeness?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  relevant?: 'additions' | 'removals' | 'text' | 'all';
}

export function LiveRegion({ 
  children, 
  politeness = 'polite', 
  atomic = false,
  relevant = 'additions'
}: LiveRegionProps) {
  return (
    <div
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className="sr-only"
    >
      {children}
    </div>
  );
}

// Status announcement component
interface StatusAnnouncementProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}

export function StatusAnnouncement({ message, type = 'info' }: StatusAnnouncementProps) {
  const politeness = type === 'error' ? 'assertive' : 'polite';
  
  return (
    <LiveRegion politeness={politeness}>
      <span role="status" aria-label={`${type}: ${message}`}>
        {message}
      </span>
    </LiveRegion>
  );
}

// Skip to content helper
export function SkipToContent({ targetId, children }: { targetId: string; children: ReactNode }) {
  return (
    <a
      href={`#${targetId}`}
      className="skip-link"
      onFocus={(e) => {
        // Announce to screen readers
        const announcement = `Skipping to ${children}`;
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.textContent = announcement;
        document.body.appendChild(liveRegion);
        
        setTimeout(() => {
          document.body.removeChild(liveRegion);
        }, 1000);
      }}
    >
      {children}
    </a>
  );
}

// Descriptive text for complex UI elements
interface DescriptionProps {
  id: string;
  children: ReactNode;
}

export function Description({ id, children }: DescriptionProps) {
  return (
    <div id={id} className="sr-only">
      {children}
    </div>
  );
}

// Loading announcement
interface LoadingAnnouncementProps {
  isLoading: boolean;
  loadingText?: string;
  completedText?: string;
}

export function LoadingAnnouncement({ 
  isLoading, 
  loadingText = 'Loading content',
  completedText = 'Content loaded'
}: LoadingAnnouncementProps) {
  return (
    <LiveRegion politeness="polite">
      {isLoading ? loadingText : completedText}
    </LiveRegion>
  );
} 