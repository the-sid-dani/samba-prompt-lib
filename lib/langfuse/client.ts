import { Langfuse } from 'langfuse';
import { Session } from 'next-auth';

let langfuseInstance: Langfuse | null = null;

/**
 * Get or create Langfuse client instance
 */
export function getLangfuse(): Langfuse {
  if (!langfuseInstance) {
    langfuseInstance = new Langfuse({
      publicKey: process.env.LANGFUSE_PUBLIC_KEY!,
      secretKey: process.env.LANGFUSE_SECRET_KEY!,
      baseUrl: process.env.LANGFUSE_BASE_URL || 'https://cloud.langfuse.com',
      enabled: process.env.NEXT_PUBLIC_LANGFUSE_ENABLED === 'true',
      release: process.env.VERCEL_GIT_COMMIT_SHA || 'development',
    });
  }
  return langfuseInstance;
}

/**
 * Flush all pending Langfuse events
 * Important for serverless environments
 */
export async function flushLangfuse() {
  if (langfuseInstance) {
    await langfuseInstance.flush();
  }
}

/**
 * Shutdown Langfuse client
 */
export async function shutdownLangfuse() {
  if (langfuseInstance) {
    await langfuseInstance.shutdown();
    langfuseInstance = null;
  }
}

/**
 * Helper to create a trace with user context
 */
export function createTrace(name: string, session?: Session | null, metadata?: Record<string, any>) {
  const langfuse = getLangfuse();
  
  return langfuse.trace({
    name,
    userId: session?.user?.id,
    sessionId: session?.sessionId,
    metadata: {
      userEmail: session?.user?.email,
      ...metadata
    },
    tags: []
  });
}

/**
 * Track prompt execution in playground
 */
export async function trackPlaygroundExecution({
  promptId,
  promptContent,
  model,
  provider,
  userId,
  response,
  error,
  latencyMs,
  tokenUsage,
  cost
}: {
  promptId?: string | number;
  promptContent: string;
  model: string;
  provider: string;
  userId?: string;
  response?: string;
  error?: string;
  latencyMs?: number;
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  cost?: number;
}) {
  const langfuse = getLangfuse();
  
  const trace = langfuse.trace({
    name: 'playground-execution',
    userId,
    metadata: {
      promptId,
      provider,
      model
    },
    tags: ['playground', provider]
  });

  const generation = trace.generation({
    name: 'llm-generation',
    model,
    modelParameters: {
      provider
    },
    input: promptContent,
    output: response,
    usage: tokenUsage,
    totalCost: cost,
    completionStartTime: new Date(Date.now() - (latencyMs || 0)),
    metadata: {
      error: error || undefined,
      latencyMs
    }
  });

  // Score based on success/failure
  if (!error && response) {
    trace.score({
      name: 'execution-status',
      value: 1,
      comment: 'Successful execution'
    });
  } else {
    trace.score({
      name: 'execution-status',
      value: 0,
      comment: error || 'Failed execution'
    });
  }

  await flushLangfuse();
}

/**
 * Track prompt view
 */
export async function trackPromptView(promptId: string | number, userId?: string) {
  const langfuse = getLangfuse();
  
  langfuse.event({
    name: 'prompt-viewed',
    userId,
    metadata: {
      promptId
    }
  });

  await flushLangfuse();
}

/**
 * Track prompt copy
 */
export async function trackPromptCopy(promptId: string | number, userId?: string) {
  const langfuse = getLangfuse();
  
  langfuse.event({
    name: 'prompt-copied',
    userId,
    metadata: {
      promptId
    }
  });

  await flushLangfuse();
}

/**
 * Track user feedback on prompt execution
 */
export async function trackUserFeedback(
  traceId: string,
  feedback: 'positive' | 'negative',
  comment?: string
) {
  const langfuse = getLangfuse();
  
  langfuse.score({
    traceId,
    name: 'user-feedback',
    value: feedback === 'positive' ? 1 : 0,
    comment
  });

  await flushLangfuse();
}

/**
 * Sync prompt to Langfuse for management
 */
export async function syncPromptToLangfuse(prompt: {
  id: string | number;
  title: string;
  content: string;
  description?: string;
  tags?: string[];
  model?: string;
  temperature?: number;
}) {
  const langfuse = getLangfuse();
  
  try {
    await langfuse.createPrompt({
      name: `prompt-${prompt.id}`,
      prompt: prompt.content,
      config: {
        model: prompt.model,
        temperature: prompt.temperature,
        description: prompt.description
      },
      labels: prompt.tags || [],
      tags: ['sambatv-library']
    });
  } catch (error) {
    console.error('Failed to sync prompt to Langfuse:', error);
  }
}

/**
 * Get Langfuse public URL for viewing traces
 */
export function getLangfusePublicUrl(): string {
  return process.env.LANGFUSE_BASE_URL || 'https://cloud.langfuse.com';
}

/**
 * Check if Langfuse is enabled
 */
export function isLangfuseEnabled(): boolean {
  return process.env.NEXT_PUBLIC_LANGFUSE_ENABLED === 'true';
}