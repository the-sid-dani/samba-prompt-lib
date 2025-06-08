import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    // Check database connectivity
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('prompt')
      .select('count')
      .limit(1);

    if (error) {
      throw new Error(`Database check failed: ${error.message}`);
    }

    // Check environment variables
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL'
    ];

    const missingEnvVars = requiredEnvVars.filter(
      envVar => !process.env[envVar]
    );

    if (missingEnvVars.length > 0) {
      throw new Error(`Missing environment variables: ${missingEnvVars.join(', ')}`);
    }

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      checks: {
        database: 'connected',
        environment: 'configured',
        api: 'operational'
      }
    });

  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      checks: {
        database: 'failed',
        environment: 'unknown',
        api: 'error'
      }
    }, { status: 503 });
  }
} 