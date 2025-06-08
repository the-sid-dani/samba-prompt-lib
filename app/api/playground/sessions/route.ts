import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
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

// Temporarily disabled - will be re-enabled after deployment is stable
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Playground sessions temporarily disabled during deployment' },
    { status: 503 }
  );
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Playground sessions temporarily disabled during deployment' },
    { status: 503 }
  );
}