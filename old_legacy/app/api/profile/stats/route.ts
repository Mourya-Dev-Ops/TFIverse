import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { reviews, watchlist, watchedMovies } from '@/lib/schema';
import { eq, count, and, isNotNull } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get all stats in parallel
    const [
      reviewsCount,
      watchlistCount,
      watchedCount,
      ratingsCount,
    ] = await Promise.all([
      db.select({ count: count() }).from(reviews).where(eq(reviews.userId, userId)),
      db.select({ count: count() }).from(watchlist).where(eq(watchlist.userId, userId)),
      db.select({ count: count() }).from(watchedMovies).where(eq(watchedMovies.userId, userId)),
      db.select({ count: count() }).from(reviews).where(
        and(
          eq(reviews.userId, userId),
          isNotNull(reviews.rating)
        )
      ),
    ]);

    return NextResponse.json({
      stats: {
        reviewsCount: reviewsCount[0]?.count || 0,
        watchlistCount: watchlistCount[0]?.count || 0,
        watchedCount: watchedCount[0]?.count || 0,
        ratingsCount: ratingsCount[0]?.count || 0,
        likesCount: 0, // Not tracked yet
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
