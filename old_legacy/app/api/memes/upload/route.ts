// app/api/memes/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { memes } from '@/lib/schema';
import { uploadToB2 } from '@/lib/b2-storage'; // ← NEW!

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;
    const caption = formData.get('caption') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
    }

    // Upload to Backblaze B2 (instead of Cloudinary!)
    const result = await uploadToB2(file, 'memes', true);

    // Save to database
    const [meme] = await db
      .insert(memes)
      .values({
        userId: session.user.id,
        imageUrl: result.url, // B2 URL
        caption: caption || '',
        status: 'approved', // or 'pending' if you have moderation
      })
      .returning();

    return NextResponse.json({ 
      success: true,
      meme,
      message: 'Meme uploaded successfully!' 
    });
  } catch (error) {
    console.error('Meme upload error:', error);
    return NextResponse.json({ 
      error: 'Upload failed' 
    }, { status: 500 });
  }
}
