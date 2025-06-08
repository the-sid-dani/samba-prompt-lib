import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createSupabaseAdminClient } from '@/utils/supabase/server';
import { z } from 'zod';

// Validation schema for session data
const sessionSchema = z.object({
  prompt: z.string(),
  systemPrompt: z.string().optional(),
  model: z.string(),
  parameters: z.object({
    temperature: z.number(),
    maxTokens: z.number(),
    topP: z.number(),
    frequencyPenalty: z.number(),
    presencePenalty: z.number(),
  }),
  output: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = sessionSchema.parse(body);

    console.log('[API] Saving playground session for user:', session.user.email);

    // Save to database
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('playground_sessions')
      .insert({
        user_id: session.user.id,
        prompt: validatedData.prompt,
        system_prompt: validatedData.systemPrompt,
        model: validatedData.model,
        parameters: validatedData.parameters,
        output: validatedData.output,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('[API] Error saving session:', error);
      throw error;
    }

    console.log('[API] Session saved successfully:', data.id);

    return NextResponse.json({
      id: data.id,
      message: 'Session saved successfully',
    });
  } catch (error) {
    console.error('[API] Session save error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid session data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to save session' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    console.log('[API] Fetching playground sessions for user:', session.user.email);

    // Fetch user's sessions
    const supabase = createSupabaseAdminClient();
    const { data, error, count } = await supabase
      .from('playground_sessions')
      .select('*', { count: 'exact' })
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('[API] Error fetching sessions:', error);
      throw error;
    }

    return NextResponse.json({
      sessions: data || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('[API] Session fetch error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}