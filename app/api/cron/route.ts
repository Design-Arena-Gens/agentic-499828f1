import { NextRequest, NextResponse } from 'next/server';
import { runDailyAutomation } from '@/lib/automation';

// This endpoint can be triggered by Vercel Cron or external services like cron-job.org
export async function GET(request: NextRequest) {
  try {
    // Verify the request is authorized (in production, use a secret token)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key';

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get niche from query params or environment variable
    const searchParams = request.nextUrl.searchParams;
    const niche = searchParams.get('niche') || process.env.DESIGN_NICHE || 'motivational quotes';
    const uploadsPerDay = parseInt(searchParams.get('uploads') || '3');

    console.log(`Running cron job: ${uploadsPerDay} uploads for "${niche}"`);

    const results = await runDailyAutomation(niche, uploadsPerDay);

    return NextResponse.json({
      success: true,
      message: 'Daily automation completed',
      results,
    });
  } catch (error) {
    console.error('Cron job error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggering
export async function POST(request: NextRequest) {
  return GET(request);
}
