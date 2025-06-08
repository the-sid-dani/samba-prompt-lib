"use client";

import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeroSectionProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function HeroSection({ searchValue, onSearchChange }: HeroSectionProps) {
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
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative px-4 sm:px-0">
          <Search className="absolute left-[40px] sm:left-[28px] md:left-[28px] top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none z-10" />
          <Input
            type="text"
            placeholder="Search by title, description, category or prompt text..."
            className="pl-[70px] sm:pl-[62px] md:pl-[62px] pr-4 py-3 sm:py-4 md:py-6 text-[11px] sm:text-xs md:text-sm rounded-full border-2 border-border focus:border-primary bg-background text-foreground"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
} 