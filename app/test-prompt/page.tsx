import { fetchPrompts } from "@/app/actions/prompts";

export default async function TestPromptPage() {
  try {
    const { prompts } = await fetchPrompts({ limit: 5 });
    
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Test Prompt Fetching</h1>
        <div className="space-y-4">
          {prompts.map((prompt) => (
            <div key={prompt.id} className="border p-4 rounded">
              <h2 className="font-semibold">{prompt.title}</h2>
              <p className="text-sm text-gray-600">ID: {prompt.id}</p>
              <a href={`/prompt/${prompt.id}`} className="text-blue-500 hover:underline">
                View Prompt →
              </a>
            </div>
          ))}
        </div>
        <pre className="mt-8 p-4 bg-gray-100 rounded overflow-auto text-xs">
          {JSON.stringify(prompts, null, 2)}
        </pre>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
        <pre className="p-4 bg-red-100 rounded">
          {error instanceof Error ? error.message : 'Unknown error'}
        </pre>
      </div>
    );
  }
}