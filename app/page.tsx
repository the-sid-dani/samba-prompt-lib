import PromptExplorer from "@/components/prompt-explorer/PromptExplorer";
import { auth } from "@/lib/auth";
import { getCategories } from "@/app/actions/prompts";

export default async function Home() {
  const session = await auth();
  const user = session?.user;

  // Only fetch categories server-side since they're static
  // Let PromptExplorer handle prompt fetching for better cache control
  const categories = await getCategories();

  return (
    <PromptExplorer 
      user={user} 
      categories={categories}
    />
  );
}
