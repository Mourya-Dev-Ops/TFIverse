import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { memes, memeLikes, memeBookmarks, memeDownloads, memeShares } from '@/lib/schema';
import { eq, and, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// GET meme by ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();

    const meme = await db.query.memes.findFirst({
      where: eq(memes.id, id),
      with: { userProfile: true },
    });

    if (!meme) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    let userHasLiked = false;
    let userHasBookmarked = false;

    if (session?.user?.id) {
      const [like, bookmark] = await Promise.all([
        db.select().from(memeLikes).where(and(eq(memeLikes.memeId, id), eq(memeLikes.userId, session.user.id))).limit(1),
        db.select().from(memeBookmarks).where(and(eq(memeBookmarks.memeId, id), eq(memeBookmarks.userId, session.user.id))).limit(1),
      ]);
      userHasLiked = like.length > 0;
      userHasBookmarked = bookmark.length > 0;
    }

    return NextResponse.json({ ...meme, userHasLiked, userHasBookmarked });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

// POST for actions (like, bookmark, download, share)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const { id } = await params;
    const { action, platform } = await req.json();

    if (!session?.user?.id && action !== 'download') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    switch (action) {
      case 'like': {
        const existing = await db.select().from(memeLikes).where(and(eq(memeLikes.memeId, id), eq(memeLikes.userId, session!.user!.id))).limit(1);
        if (existing.length > 0) {
          await db.delete(memeLikes).where(and(eq(memeLikes.memeId, id), eq(memeLikes.userId, session!.user!.id)));
          await db.update(memes).set({ likes: sql`${memes.likes} - 1` }).where(eq(memes.id, id));
        } else {
          await db.insert(memeLikes).values({ memeId: id, userId: session!.user!.id });
          await db.update(memes).set({ likes: sql`${memes.likes} + 1` }).where(eq(memes.id, id));
        }
        const meme = await db.query.memes.findFirst({ where: eq(memes.id, id) });
        return NextResponse.json({ likes: meme?.likes || 0 });
      }

      case 'bookmark': {
        const existing = await db.select().from(memeBookmarks).where(and(eq(memeBookmarks.memeId, id), eq(memeBookmarks.userId, session!.user!.id))).limit(1);
        if (existing.length > 0) {
          await db.delete(memeBookmarks).where(and(eq(memeBookmarks.memeId, id), eq(memeBookmarks.userId, session!.user!.id)));
          return NextResponse.json({ bookmarked: false });
        } else {
          await db.insert(memeBookmarks).values({ memeId: id, userId: session!.user!.id });
          return NextResponse.json({ bookmarked: true });
        }
      }

      case 'download': {
        if (session?.user?.id) {
          await db.insert(memeDownloads).values({ memeId: id, userId: session.user.id });
        }
        await db.update(memes).set({ downloads: sql`${memes.downloads} + 1` }).where(eq(memes.id, id));
        return NextResponse.json({ success: true });
      }

      case 'share': {
        if (session?.user?.id) {
          await db.insert(memeShares).values({ memeId: id, userId: session.user.id, platform: platform || 'unknown' });
        }
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

// DELETE meme (with Cloudinary cleanup)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const meme = await db.query.memes.findFirst({ where: eq(memes.id, id) });

    if (!meme || meme.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // ✅ Delete image from Cloudinary
    try {
      const publicId = meme.imageUrl.split('/').pop()?.split('.')[0];
      if (publicId) {
        await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            public_id: publicId,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
          }),
        });
      }
    } catch (error) {
      console.error('Failed to delete image from Cloudinary:', error);
    }

    // Delete from database
    await db.delete(memes).where(eq(memes.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}


// PUT for edit
// PUT for edit
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { title, description, tags, heroTags, imageUrl, oldImageUrl } = await req.json();
    const meme = await db.query.memes.findFirst({ where: eq(memes.id, id) });

    if (!meme || meme.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // ✅ Delete old image from Cloudinary if new image uploaded
    if (imageUrl !== oldImageUrl && oldImageUrl) {
      try {
        const publicId = oldImageUrl.split('/').pop()?.split('.')[0];
        if (publicId) {
          // Delete from Cloudinary (you need to add this helper)
          await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              public_id: publicId,
              api_key: process.env.CLOUDINARY_API_KEY,
              api_secret: process.env.CLOUDINARY_API_SECRET,
            }),
          });
        }
      } catch (error) {
        console.error('Failed to delete old image:', error);
      }
    }

    await db.update(memes).set({ 
      title, 
      description, 
      tags, 
      heroTags, 
      imageUrl,
      status: 'pending', 
      updatedAt: new Date() 
    }).where(eq(memes.id, id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
