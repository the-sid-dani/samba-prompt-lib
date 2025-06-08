import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getCategories } from "@/app/actions/prompts";
import { OptimizedNavigation } from "@/components/navigation/OptimizedNavigation";
import { StaticHeroSection } from "@/components/static-hero-section";
import { DynamicPrompts } from "@/components/prompt-explorer/DynamicPrompts";

// Static categories loader (can be cached/prerendered)
async function StaticContent() {
  const categories = await getCategories();
  
  return { categories };
}

// Dynamic user content loader
async function DynamicUserContent() {
  const session = await auth();
  return { user: session?.user };
}

// Fallback for dynamic content
function DynamicContentFallback() {
  return (
    <div className="min-h-screen bg-background transition-[background-color] duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-muted rounded-lg w-48"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg p-6 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Combined dynamic content
async function CombinedDynamicContent() {
  const [{ user }, { categories }] = await Promise.all([
    DynamicUserContent(),
    StaticContent()
  ]);

  return <DynamicPrompts user={user} categories={categories} />;
}

export default function OptimizedHome() {
  return (
    <div className="min-h-screen bg-background transition-[background-color] duration-300">
      {/* Static Navigation - Prerendered */}
      <OptimizedNavigation />

      {/* Static Hero Section - Prerendered */}
      <StaticHeroSection />

      {/* Dynamic Content with Suspense - Rendered at request time */}
      <Suspense fallback={<DynamicContentFallback />}>
        <CombinedDynamicContent />
      </Suspense>
    </div>
  );
} 