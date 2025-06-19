import { auth } from "@/lib/auth";
import { fetchPrompts, getCategories } from "@/app/actions/prompts";
import PromptExplorer from '@/components/prompt-explorer/PromptExplorer';

export default async function Home() {
  console.log('🏠 [Homepage] Server-side rendering started');
  
  // Fetch initial data server-side
  const session = await auth();
  const user = session?.user;
  
  try {
    // Fetch initial prompts and categories in parallel
    const [initialPromptsResult, categories] = await Promise.all([
      fetchPrompts({ 
        page: 1, 
        limit: 50, 
        sort_by: 'uses', 
        sort_order: 'desc' 
      }),
      getCategories()
    ]);

    console.log('🏠 [Homepage] Server-side data fetched:', {
      prompts: initialPromptsResult.prompts.length,
      categories: categories.length
    });

    return (
      <PromptExplorer 
        user={user}
        prompts={initialPromptsResult.prompts}
        categories={categories}
        initiallyLoaded={true}
      />
    );
  } catch (error) {
    console.error('🏠 [Homepage] Server-side fetch error:', error);
    
    // Fallback to client-side loading if server-side fails
    return (
      <PromptExplorer 
        user={user}
        prompts={[]}
        categories={[]}
        initiallyLoaded={false}
      />
    );
  }
}
