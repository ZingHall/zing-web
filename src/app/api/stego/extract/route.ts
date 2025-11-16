import { NextRequest, NextResponse } from 'next/server';
import { extractMessage, isValidPNG } from '@/lib/stego';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'Missing image' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // Validate PNG
    if (!isValidPNG(imageBuffer)) {
      return NextResponse.json(
        { error: 'Invalid PNG image' },
        { status: 400 }
      );
    }

    // Extract message
    const message = extractMessage(imageBuffer);

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error('Extract error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to extract message',
        success: false 
      },
      { status: 500 }
    );
  }
}
