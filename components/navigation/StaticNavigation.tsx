import Link from "next/link";
import Image from "next/image";
import { Sparkles, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import config from "@/config";

export function StaticNavigation() {
  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50 transition-[background-color,border-color] duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <div className="relative w-6 h-6 sm:w-8 sm:h-8">
                <Image
                  src="/samba_logo_heart_Wordmark_Black_2018-01.png"
                  alt="SambaTV"
                  fill
                  className="object-contain dark:invert"
                  priority
                />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm sm:text-base font-bold text-foreground">
                  {config.appName}
                </span>
                <span className="text-xs text-muted-foreground hidden lg:block">
                  AI Prompt Library
                </span>
              </div>
            </Link>
          </div>

          {/* Static Navigation Items */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
            <Link href="/categories" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                Categories
              </Button>
            </Link>
            <Link href="/leaderboard" className="hidden md:block">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                Leaderboard
              </Button>
            </Link>
            <Link href="/submit">
              <Button size="sm" className="text-xs sm:text-sm">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Submit</span>
                <span className="sm:hidden">+</span>
              </Button>
            </Link>
            
            {/* Placeholder for dynamic user menu - will be replaced by Suspense */}
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    </nav>
  );
} 