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
    const file = formData.get('avatar') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // ✅ ALLOW GIF FILES!
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Allowed: JPG, PNG, GIF, WEBP' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }

    // Get current profile to delete old avatar
    const [currentProfile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, session.user.id))
      .limit(1);

    // ✅ Upload new avatar WITHOUT compression for GIFs
    const result = await uploadToVPS(file, 'avatars', {
      preserveAnimation: file.type === 'image/gif', // ✅ KEY FIX!
    });

    // Update database
    await db
      .update(userProfiles)
      .set({
        avatarUrl: result.url,
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.userId, session.user.id));

    // Delete old avatar if exists
    if (currentProfile?.avatarUrl?.startsWith('/uploads/avatars/')) {
      const oldFilename = currentProfile.avatarUrl.split('/').pop();
      if (oldFilename) {
        await deleteFromVPS('avatars', oldFilename);
      }
    }

    return NextResponse.json({
      success: true,
      avatarUrl: result.url,
      message: 'Avatar uploaded successfully!'
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
