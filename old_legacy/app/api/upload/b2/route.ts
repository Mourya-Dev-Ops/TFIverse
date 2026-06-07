// app/api/upload/b2/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { uploadToB2, type B2Folder } from '@/lib/b2-storage';

const ALLOWED_FOLDERS: B2Folder[] = [
  'memes',
  'fan-gallery',
  'hero-gallery',
  'hero-avatars',
  'hero-banners',
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(request: NextRequest) {
  try {
    // Check authentication (optional - remove if you want public uploads)
    // const session = await auth();
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string;

    // Validate inputs
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!folder || !ALLOWED_FOLDERS.includes(folder as B2Folder)) {
      return NextResponse.json(
        { error: `Invalid folder. Allowed: ${ALLOWED_FOLDERS.join(', ')}` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Max 50MB' },
        { status: 413 }
      );
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files allowed' },
        { status: 400 }
      );
    }

    // Upload to B2
    const result = await uploadToB2(file, folder as B2Folder);

    return NextResponse.json({
      success: true,
      url: result.url,
      key: result.key,
      size: result.size,
    });
  } catch (error) {
    console.error('❌ Upload API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
