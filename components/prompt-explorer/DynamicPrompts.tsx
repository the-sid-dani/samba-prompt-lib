import { Suspense } from "react";
import { fetchPrompts } from "@/app/actions/prompts";
import PromptExplorer from "./PromptExplorer";

interface DynamicPromptsProps {
  user: any;
  categories: any[];
}

async function PromptsContent({ user, categories }: DynamicPromptsProps) {
  // Fetch personalized prompts based on user
  const { prompts } = await fetchPrompts({ 
    page: 1, 
    limit: 20, 
    user_id: user?.id 
  });

  return (
    <PromptExplorer 
      user={user} 
      prompts={prompts} 
      categories={categories}
    />
  );
}

function PromptsFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      {/* Loading skeleton */}
      <div className="animate-pulse space-y-6">
        {/* Filter skeleton */}
        <div className="h-10 bg-muted rounded-lg w-48"></div>
        
        {/* Prompts grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card rounded-lg p-6 space-y-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
              <div className="flex gap-2 mt-4">
                <div className="h-8 bg-muted rounded w-16"></div>
                <div className="h-8 bg-muted rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DynamicPrompts({ user, categories }: DynamicPromptsProps) {
  return (
    <Suspense fallback={<PromptsFallback />}>
      <PromptsContent user={user} categories={categories} />
    </Suspense>
  );
} 