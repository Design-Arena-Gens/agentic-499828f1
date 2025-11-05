import { NextRequest, NextResponse } from 'next/server';
import { generateAndUploadDesign } from '@/lib/automation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { niche } = body;

    if (!niche) {
      return NextResponse.json(
        { success: false, error: 'Niche is required' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.',
        },
        { status: 500 }
      );
    }

    const result = await generateAndUploadDesign(niche);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error('API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
