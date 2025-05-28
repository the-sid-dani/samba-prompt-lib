import PromptExplorer from "@/components/prompt-explorer/PromptExplorer";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  const user = session?.user;

  return <PromptExplorer user={user} />;
}
