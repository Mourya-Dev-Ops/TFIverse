import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { userProfiles } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { uploadToVPS, deleteFromVPS } from '@/lib/vps-storage';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('banner') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // ✅ ALLOW GIF FILES!
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Allowed: JPG, PNG, GIF, WEBP' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
    }

    // Get current profile
    const [currentProfile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, session.user.id))
      .limit(1);

    // ✅ Upload new banner WITHOUT compression for GIFs
    const result = await uploadToVPS(file, 'banners', {
      preserveAnimation: file.type === 'image/gif', // ✅ KEY FIX!
    });

    // Update database
    await db
      .update(userProfiles)
      .set({
        bannerUrl: result.url,
        coverImage: result.url,
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.userId, session.user.id));

    // Delete old banner
    if (currentProfile?.bannerUrl?.startsWith('/uploads/banners/')) {
      const oldFilename = currentProfile.bannerUrl.split('/').pop();
      if (oldFilename) {
        await deleteFromVPS('banners', oldFilename);
      }
    }

    return NextResponse.json({
      success: true,
      bannerUrl: result.url,
      message: 'Banner uploaded successfully!'
    });

  } catch (error) {
    console.error('Banner upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
