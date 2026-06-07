import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { memes, memeLikes, memeBookmarks } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get uploaded memes
    const uploadedMemes = await db
      .select()
      .from(memes)
      .where(eq(memes.userId, session.user.id))
      .orderBy(desc(memes.createdAt));

    // Get liked memes
    const likedMemesData = await db
      .select({
        meme: memes,
      })
      .from(memeLikes)
      .innerJoin(memes, eq(memeLikes.memeId, memes.id))
      .where(eq(memeLikes.userId, session.user.id))
      .orderBy(desc(memeLikes.createdAt));

    // Get bookmarked memes
    const bookmarkedMemesData = await db
      .select({
        meme: memes,
      })
      .from(memeBookmarks)
      .innerJoin(memes, eq(memeBookmarks.memeId, memes.id))
      .where(eq(memeBookmarks.userId, session.user.id))
      .orderBy(desc(memeBookmarks.createdAt));

    return NextResponse.json({
      uploaded: uploadedMemes,
      liked: likedMemesData.map(l => l.meme),
      bookmarked: bookmarkedMemesData.map(b => b.meme),
    });
  } catch (error) {
    console.error('Error fetching memes:', error);
    return NextResponse.json({ error: 'Failed to fetch memes' }, { status: 500 });
  }
}
