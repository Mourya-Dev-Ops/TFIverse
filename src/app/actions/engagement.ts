'use server';

import { db } from '@/lib/db';
import { watchlist, watchedMovies, reviews } from '@/lib/schema/engagement';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/auth';
import { revalidateTag } from 'next/cache';

export async function toggleWatchlist(movieSlug: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: 'Unauthorized', requiresAuth: true };
    }

    try {
        const existing = await db.select()
            .from(watchlist)
            .where(
                and(
                    eq(watchlist.userId, session.user.id),
                    eq(watchlist.movieSlug, movieSlug)
                )
            )
            .limit(1);

        if (existing.length > 0) {
            await db.delete(watchlist).where(eq(watchlist.id, existing[0].id));
            revalidateTag(`engagement-${movieSlug}`);
            return { success: true, added: false };
        } else {
            await db.insert(watchlist).values({
                userId: session.user.id,
                movieSlug: movieSlug
            });
            revalidateTag(`engagement-${movieSlug}`);
            return { success: true, added: true };
        }
    } catch (error) {
        console.error('Error toggling watchlist:', error);
        return { success: false, error: 'Internal server error' };
    }
}

export async function toggleSeen(movieSlug: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: 'Unauthorized', requiresAuth: true };
    }

    try {
        const existing = await db.select()
            .from(watchedMovies)
            .where(
                and(
                    eq(watchedMovies.userId, session.user.id),
                    eq(watchedMovies.movieSlug, movieSlug)
                )
            )
            .limit(1);

        if (existing.length > 0) {
            await db.delete(watchedMovies).where(eq(watchedMovies.id, existing[0].id));
            revalidateTag(`engagement-${movieSlug}`);
            return { success: true, added: false };
        } else {
            await db.insert(watchedMovies).values({
                userId: session.user.id,
                movieSlug: movieSlug
            });
            revalidateTag(`engagement-${movieSlug}`);
            return { success: true, added: true };
        }
    } catch (error) {
        console.error('Error toggling seen:', error);
        return { success: false, error: 'Internal server error' };
    }
}

export async function submitReview(movieSlug: string, rating: number, text?: string, spoilers: boolean = false) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: 'Unauthorized', requiresAuth: true };
    }

    if (rating < 1 || rating > 10) {
        return { success: false, error: 'Invalid rating. Must be between 1 and 10.' };
    }

    try {
        const existing = await db.select()
            .from(reviews)
            .where(
                and(
                    eq(reviews.userId, session.user.id),
                    eq(reviews.movieSlug, movieSlug)
                )
            )
            .limit(1);

        if (existing.length > 0) {
             await db.update(reviews)
                .set({
                    rating,
                    reviewText: text,
                    spoilers,
                    updatedAt: new Date()
                })
                .where(eq(reviews.id, existing[0].id));
        } else {
            await db.insert(reviews).values({
                userId: session.user.id,
                movieSlug,
                rating,
                reviewText: text,
                spoilers
            });
        }
        
        revalidateTag(`engagement-${movieSlug}`);
        return { success: true };
    } catch (error) {
        console.error('Error submitting review:', error);
        return { success: false, error: 'Internal server error' };
    }
}

export async function getEngagementData(movieSlug: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { inWatchlist: false, isSeen: false, userReview: null };
    }

    try {
        const [watchlistData, seenData, reviewData] = await Promise.all([
            db.select({ id: watchlist.id })
              .from(watchlist)
              .where(and(eq(watchlist.userId, session.user.id), eq(watchlist.movieSlug, movieSlug)))
              .limit(1),
            db.select({ id: watchedMovies.id })
              .from(watchedMovies)
              .where(and(eq(watchedMovies.userId, session.user.id), eq(watchedMovies.movieSlug, movieSlug)))
              .limit(1),
            db.select({ rating: reviews.rating, reviewText: reviews.reviewText, spoilers: reviews.spoilers })
              .from(reviews)
              .where(and(eq(reviews.userId, session.user.id), eq(reviews.movieSlug, movieSlug)))
              .limit(1)
        ]);

        return {
            inWatchlist: watchlistData.length > 0,
            isSeen: seenData.length > 0,
            userReview: reviewData.length > 0 ? reviewData[0] : null
        };
    } catch (error) {
        console.error('Error getting engagement data:', error);
        return { inWatchlist: false, isSeen: false, userReview: null };
    }
}
