import { NextRequest, NextResponse } from 'next/server';
import { embedMessage, isValidPNG, getCapacity } from '@/lib/stego';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const message = formData.get('message') as string;

    if (!imageFile || !message) {
      return NextResponse.json(
        { error: 'Missing image or message' },
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

    // Check capacity
    const capacity = getCapacity(imageBuffer);
    if (message.length > capacity) {
      return NextResponse.json(
        { 
          error: `Message too long. Maximum capacity: ${capacity} bytes, message: ${message.length} bytes` 
        },
        { status: 400 }
      );
    }

    // Embed message
    const embeddedImageBuffer = embedMessage(imageBuffer, message);

    // Return as PNG - convert Buffer to Uint8Array for NextResponse
    return new NextResponse(new Uint8Array(embeddedImageBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="embedded-${imageFile.name}"`,
      },
    });
  } catch (error) {
    console.error('Embed error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to embed message' },
      { status: 500 }
    );
  }
}
