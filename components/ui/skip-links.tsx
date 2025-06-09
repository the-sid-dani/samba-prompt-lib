interface SkipLinksProps {
  links: Array<{
    href: string;
    label: string;
  }>;
}

export function SkipLinks({ links }: SkipLinksProps) {
  return (
    <div className="skip-links">
      {links.map((link, index) => (
        <a 
          key={link.href}
          href={link.href} 
          className="skip-link"
          style={{ zIndex: 9999 - index }}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

// Common skip link configurations for different page types
export const commonSkipLinks = {
  default: [
    { href: "#main-content", label: "Skip to main content" },
    { href: "#navigation", label: "Skip to navigation" },
    { href: "#footer", label: "Skip to footer" },
  ],
  
  promptDetail: [
    { href: "#main-content", label: "Skip to main content" },
    { href: "#prompt-content", label: "Skip to prompt content" },
    { href: "#prompt-actions", label: "Skip to prompt actions" },
    { href: "#comments", label: "Skip to comments" },
    { href: "#navigation", label: "Skip to navigation" },
  ],
  
  explorer: [
    { href: "#main-content", label: "Skip to main content" },
    { href: "#search-filters", label: "Skip to search and filters" },
    { href: "#prompt-grid", label: "Skip to prompt grid" },
    { href: "#navigation", label: "Skip to navigation" },
  ],
  
  admin: [
    { href: "#main-content", label: "Skip to main content" },
    { href: "#admin-tabs", label: "Skip to admin tabs" },
    { href: "#admin-content", label: "Skip to admin content" },
    { href: "#navigation", label: "Skip to navigation" },
  ],
}; 