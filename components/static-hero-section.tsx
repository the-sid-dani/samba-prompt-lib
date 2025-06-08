import { Sparkles } from "lucide-react";

export function StaticHeroSection() {
  return (
    <div className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-8 sm:py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center mb-3 sm:mb-4">
          <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
          Craft Perfect AI Prompts
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
          Discover and share powerful prompts for AI models across SambaTV
        </p>
        
        {/* Static placeholder for search - will be replaced by dynamic version */}
        <div className="max-w-2xl mx-auto relative px-4 sm:px-0">
          <div className="h-12 sm:h-14 md:h-16 bg-background border-2 border-border rounded-full flex items-center px-4">
            <span className="text-muted-foreground text-xs sm:text-sm">
              Search by title, description, category or prompt text...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 