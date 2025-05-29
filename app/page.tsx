import PromptExplorer from "@/components/prompt-explorer/PromptExplorer";
import { auth } from "@/lib/auth";
import { fetchPrompts, getCategories } from "@/app/actions/prompts";

export default async function Home() {
  const session = await auth();
  const user = session?.user;

  // Fetch prompts and categories
  const [{ prompts }, categories] = await Promise.all([
    fetchPrompts({ page: 1, limit: 20 }),
    getCategories()
  ]);

  return (
    <PromptExplorer 
      user={user} 
      prompts={prompts} 
      categories={categories}
    />
  );
}
