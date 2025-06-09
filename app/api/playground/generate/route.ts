import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { z } from 'zod';
import { aiClient } from '@/lib/ai';
import { Analytics } from '@/lib/analytics';
import { calculateModelCost, formatCost } from '@/lib/ai-cost-utils';
import { trackPlaygroundExecution, isLangfuseEnabled } from '@/lib/langfuse/client';

// Validation schema for generation request
const generateRequestSchema = z.object({
  prompt: z.string().min(1).max(10000),
  systemPrompt: z.string().optional(),
  model: z.string(),
  parameters: z.object({
    temperature: z.number().min(0).max(2),
    maxTokens: z.number().min(1).max(4000),
    topP: z.number().min(0).max(1),
    frequencyPenalty: z.number().min(-2).max(2),
    presencePenalty: z.number().min(-2).max(2),
  }),
});

// Real AI generation function using our AI client
async function generateWithModel(
  model: string,
  prompt: string,
  systemPrompt: string | undefined,
  parameters: any
): Promise<{ output: string; usage?: any; error?: string }> {
  console.log('[API] Generating with AI client, model:', model);
  console.log('[API] Parameters:', parameters);

  try {
    // Validate parameters using the AI client
    const validation = aiClient.validateParams({
      model,
      prompt,
      systemPrompt,
      temperature: parameters.temperature,
      maxTokens: parameters.maxTokens,
      topP: parameters.topP,
      frequencyPenalty: parameters.frequencyPenalty,
      presencePenalty: parameters.presencePenalty,
    });

    if (!validation.valid) {
      return {
        output: '',
        error: validation.error,
      };
    }

    // Generate response using the AI client
    const response = await aiClient.generateResponse({
      model,
      prompt,
      systemPrompt,
      temperature: parameters.temperature,
      maxTokens: parameters.maxTokens,
      topP: parameters.topP,
      frequencyPenalty: parameters.frequencyPenalty,
      presencePenalty: parameters.presencePenalty,
    });

    if (response.error) {
      return {
        output: '',
        error: response.error,
      };
    }

    return {
      output: response.content,
      usage: response.usage,
    };

  } catch (error: any) {
    console.error('[API] AI generation failed:', error);
    
    return {
      output: '',
      error: 'Failed to generate response. Please try again.',
    };
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = generateRequestSchema.parse(body);

    console.log('[API] Generate request from user:', session.user?.email);
    console.log('[API] Model:', validatedData.model);

    // TODO: Add rate limiting here
    // TODO: Check user quotas/limits

    // Generate response
    const result = await generateWithModel(
      validatedData.model,
      validatedData.prompt,
      validatedData.systemPrompt,
      validatedData.parameters
    );

    const requestDuration = Date.now() - startTime;

    // Handle errors from AI generation
    if (result.error) {
      // Log failed API usage
      if (result.usage) {
        const apiUsageLog = Analytics.createApiUsageLog(
          aiClient.getProviderForModel(validatedData.model),
          validatedData.model,
          result.usage.promptTokens || 0,
          result.usage.completionTokens || 0,
          {
            userId: session.user?.id,
            requestDurationMs: requestDuration,
            status: 'error',
            errorMessage: result.error
          }
        );
        await Analytics.logApiUsage(apiUsageLog);
      }

      // Track error in Langfuse
      if (isLangfuseEnabled()) {
        const provider = aiClient.getProviderForModel(validatedData.model);
        
        trackPlaygroundExecution({
          promptContent: validatedData.prompt,
          model: validatedData.model,
          provider: provider,
          userId: session.user?.id,
          error: result.error,
          latencyMs: requestDuration,
          tokenUsage: result.usage ? {
            promptTokens: result.usage.promptTokens || 0,
            completionTokens: result.usage.completionTokens || 0,
            totalTokens: (result.usage.promptTokens || 0) + (result.usage.completionTokens || 0)
          } : undefined
        }).catch(error => {
          console.error('[Langfuse] Failed to track error:', error);
        });
      }

      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // Calculate cost and log successful API usage
    let costInfo = null;
    if (result.usage) {
      const provider = aiClient.getProviderForModel(validatedData.model);
      const costCalculation = calculateModelCost(
        provider,
        validatedData.model,
        result.usage.promptTokens || 0,
        result.usage.completionTokens || 0
      );

      costInfo = {
        totalCost: costCalculation.totalCost,
        inputCost: costCalculation.inputCost,
        outputCost: costCalculation.outputCost,
        formattedCost: formatCost(costCalculation.totalCost),
        provider: provider
      };

      // Log API usage with cost
      const apiUsageLog = Analytics.createApiUsageLog(
        provider,
        validatedData.model,
        result.usage.promptTokens || 0,
        result.usage.completionTokens || 0,
        {
          userId: session.user?.id,
          requestDurationMs: requestDuration,
          status: 'success'
        }
      );
      await Analytics.logApiUsage(apiUsageLog);

      // Track playground usage event
      await Analytics.trackEvent({
        userId: session.user?.id,
        eventType: 'playground_generate',
        eventData: {
          model: validatedData.model,
          provider: provider,
          inputTokens: result.usage.promptTokens || 0,
          outputTokens: result.usage.completionTokens || 0,
          cost: costCalculation.totalCost,
          duration: requestDuration
        }
      });
    }

    // Track in Langfuse if enabled
    if (isLangfuseEnabled() && result.output) {
      const provider = aiClient.getProviderForModel(validatedData.model);
      
      trackPlaygroundExecution({
        promptContent: validatedData.prompt,
        model: validatedData.model,
        provider: provider,
        userId: session.user?.id,
        response: result.output,
        latencyMs: requestDuration,
        tokenUsage: result.usage ? {
          promptTokens: result.usage.promptTokens || 0,
          completionTokens: result.usage.completionTokens || 0,
          totalTokens: (result.usage.promptTokens || 0) + (result.usage.completionTokens || 0)
        } : undefined,
        cost: costInfo?.totalCost
      }).catch(error => {
        console.error('[Langfuse] Failed to track execution:', error);
      });
    }

    // TODO: Save to playground_sessions table for history

    return NextResponse.json({
      output: result.output,
      model: validatedData.model,
      usage: result.usage,
      cost: costInfo,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[API] Generation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}