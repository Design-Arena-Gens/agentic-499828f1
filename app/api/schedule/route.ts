import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for scheduled tasks (in production, use a database)
const scheduledTasks: Array<{
  niche: string;
  uploadsPerDay: number;
  nextRun: Date;
}> = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { niche, uploadsPerDay } = body;

    if (!niche || !uploadsPerDay) {
      return NextResponse.json(
        { success: false, error: 'Niche and uploadsPerDay are required' },
        { status: 400 }
      );
    }

    // Schedule the automation
    const nextRun = new Date();
    nextRun.setHours(9, 0, 0, 0); // Schedule for 9 AM daily

    if (nextRun <= new Date()) {
      nextRun.setDate(nextRun.getDate() + 1);
    }

    scheduledTasks.push({
      niche,
      uploadsPerDay,
      nextRun,
    });

    console.log(`Scheduled automation: ${uploadsPerDay} uploads/day for "${niche}" starting ${nextRun}`);

    return NextResponse.json({
      success: true,
      message: `Automation scheduled for ${uploadsPerDay} uploads per day`,
      nextRun: nextRun.toISOString(),
    });
  } catch (error) {
    console.error('Schedule API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    scheduledTasks: scheduledTasks.map(task => ({
      niche: task.niche,
      uploadsPerDay: task.uploadsPerDay,
      nextRun: task.nextRun.toISOString(),
    })),
  });
}
