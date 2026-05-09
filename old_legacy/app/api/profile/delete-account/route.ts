import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import {
  userProfiles,
  watchlist,
  watchedMovies,
  reviews,
  userBadges,
  userFollows,
  tierLists,
  memes,
  pinnedItems,
  memeLikes,
  memeBookmarks,
  memeComments,
  tierListLikes,
} from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({
        error: 'Unauthorized - No session found'
      }, { status: 401 });
    }

    const userId = session.user.id;
    console.log('Deleting account for user:', userId);

    // Delete all user data in parallel (order matters due to foreign keys)
    await Promise.all([
      // Delete user-generated content first
      db.delete(memeComments).where(eq(memeComments.userId, userId)),
      db.delete(memeBookmarks).where(eq(memeBookmarks.userId, userId)),
      db.delete(memeLikes).where(eq(memeLikes.userId, userId)),
      db.delete(tierListLikes).where(eq(tierListLikes.userId, userId)),
      db.delete(reviews).where(eq(reviews.userId, userId)),
      db.delete(watchlist).where(eq(watchlist.userId, userId)),
      db.delete(watchedMovies).where(eq(watchedMovies.userId, userId)),
      db.delete(userBadges).where(eq(userBadges.userId, userId)),
      db.delete(pinnedItems).where(eq(pinnedItems.userId, userId)),
      
      // Delete follows (both as follower and following)
      db.delete(userFollows).where(eq(userFollows.followerId, userId)),
      db.delete(userFollows).where(eq(userFollows.followingId, userId)),
      
      // Delete user's content
      db.delete(tierLists).where(eq(tierLists.userId, userId)),
      db.delete(memes).where(eq(memes.userId, userId)),
    ]);

    console.log('User data deleted from database');

    // Delete user profile
    await db.delete(userProfiles).where(eq(userProfiles.userId, userId));

    console.log('Account deleted successfully:', userId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete account error:', error);
    return NextResponse.json({
      error: error.message || 'Failed to delete account',
      details: error
    }, { status: 500 });
  }
}
