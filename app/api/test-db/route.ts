import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Test database connectivity endpoint
 * Visit: /api/test-db to check if database connection is working
 */
export async function GET() {
  const startTime = Date.now();
  
  try {
    // Check if environment variables are set
    const envCheck = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      DIRECT_URL: !!process.env.DIRECT_URL,
      POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
      NODE_ENV: process.env.NODE_ENV,
    };

    console.log('[DB Test] Environment variables check:', envCheck);

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ 
        success: false,
        error: 'DATABASE_URL environment variable is not set',
        hint: 'Please set DATABASE_URL in your Vercel environment variables',
        documentation: 'See VERCEL_TROUBLESHOOTING.md for detailed instructions',
        env: envCheck
      }, { status: 500 });
    }

    // Try to connect and run a simple query
    console.log('[DB Test] Attempting database connection...');
    const result = await prisma.$queryRaw`SELECT NOW() as current_time, version() as postgres_version`;
    console.log('[DB Test] Query successful:', result);

    // Try to count a table to verify schema is loaded
    const goldAssetCount = await prisma.goldSilverAsset.count();
    console.log('[DB Test] Gold assets count:', goldAssetCount);

    const responseTime = Date.now() - startTime;

    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful ✅',
      details: {
        connected: true,
        responseTime: `${responseTime}ms`,
        goldAssets: goldAssetCount,
        serverTime: new Date().toISOString(),
      },
      env: envCheck,
      queryResult: result
    });

  } catch (error: any) {
    console.error('[DB Test] Database connection failed:', error);
    
    const errorDetails = {
      message: error.message || 'Unknown error',
      code: error.code,
      meta: error.meta,
      type: error.constructor.name,
    };

    // Provide helpful error messages based on error type
    let hint = 'Check your DATABASE_URL configuration';
    
    if (error.message?.includes('P1001')) {
      hint = 'Cannot reach database server. Check if your Supabase project is active and connection string is correct.';
    } else if (error.message?.includes('P1017')) {
      hint = 'Database server closed the connection. Try using connection pooling (pgbouncer=true).';
    } else if (error.message?.includes('Environment variable not found')) {
      hint = 'DATABASE_URL environment variable is missing. Add it in Vercel Settings → Environment Variables.';
    } else if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
      hint = 'Database tables do not exist. Run: npx prisma db push';
    }

    return NextResponse.json({ 
      success: false, 
      error: errorDetails.message,
      hint,
      errorDetails,
      env: {
        DATABASE_URL: !!process.env.DATABASE_URL,
        DIRECT_URL: !!process.env.DIRECT_URL,
        POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
      },
      documentation: 'See VERCEL_TROUBLESHOOTING.md for solutions',
    }, { status: 500 });
  }
}
