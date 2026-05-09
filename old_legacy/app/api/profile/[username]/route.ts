import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  userProfiles, userFollows, profileViews,
  watchlist, watchedMovies, reviews, userBadges,
  badges, tierLists, pinnedItems, memes, heroes, users
} from '@/lib/schema';
import { eq, and, desc, count, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';


export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const session = await auth();
    const username = params.username.toLowerCase();

    // ✅ Fetch profile with user data in one query
    const profileResult = await db
      .select({
        profile: userProfiles,
        user: users,
      })
      .from(userProfiles)
      .leftJoin(users, eq(userProfiles.userId, users.id))
      .where(sql`LOWER(${userProfiles.username}) = ${username}`)
      .limit(1);

    if (!profileResult[0]) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const profile = profileResult[0].profile;
    const userData = profileResult[0].user;

    // ✅ Fetch favorite hero & movie
    let favoriteHero = null;
    let favoriteMovie = null;

    if (profile.favoriteHeroSlug) {
      const heroResult = await db
        .select()
        .from(heroes)
        .where(eq(heroes.slug, profile.favoriteHeroSlug))
        .limit(1);
      favoriteHero = heroResult[0] || null;
    }

    // TODO: If you have a movies table, add:
    // if (profile.favoriteMovieSlug) {
    //   const movieResult = await db
    //     .select()
    //     .from(movies)
    //     .where(eq(movies.slug, profile.favoriteMovieSlug))
    //     .limit(1);
    //   favoriteMovie = movieResult[0] || null;
    // }

    // ✅ Fetch all data in parallel
    const [
      followersResult,
      followingResult,
      watchlistResult,
      watchedResult,
      reviewsResult,
      badgesResult,
      tierListsResult,
      pinnedResult,
      memesResult,
    ] = await Promise.all([
      // Followers count
      db
        .select({ count: count() })
        .from(userFollows)
        .where(eq(userFollows.followingId, profile.userId)),
      
      // Following count
      db
        .select({ count: count() })
        .from(userFollows)
        .where(eq(userFollows.followerId, profile.userId)),
      
      // Watchlist
      db
        .select()
        .from(watchlist)
        .where(eq(watchlist.userId, profile.userId))
        .orderBy(desc(watchlist.addedAt)),
      
      // Watched movies
      db
        .select()
        .from(watchedMovies)
        .where(eq(watchedMovies.userId, profile.userId))
        .orderBy(desc(watchedMovies.watchedAt)),
      
      // Reviews
      db
        .select()
        .from(reviews)
        .where(eq(reviews.userId, profile.userId))
        .orderBy(desc(reviews.createdAt)),
      
      // ✅ FIXED: Badges with proper structure
      db
        .select({
          id: userBadges.id,
          userId: userBadges.userId,
          earnedAt: userBadges.earnedAt,
          badge_id: badges.key,
          name: badges.name,
          description: badges.description,
          rarity: badges.rarity,
          icon: badges.icon,
        })
        .from(userBadges)
        .leftJoin(badges, eq(userBadges.badgeId, badges.id))
        .where(eq(userBadges.userId, profile.userId)),
      
      // Tier lists
      db
        .select()
        .from(tierLists)
        .where(and(eq(tierLists.userId, profile.userId), eq(tierLists.isPublic, true))),
      
      // Pinned tier list
      db
        .select()
        .from(pinnedItems)
        .where(and(eq(pinnedItems.userId, profile.userId), eq(pinnedItems.itemType, 'tier_list')))
        .limit(1),
      
      // Memes
      db
        .select()
        .from(memes)
        .where(and(eq(memes.userId, profile.userId), eq(memes.status, 'approved')))
        .limit(20),
    ]);

    // ✅ Check if following
    let isFollowing = false;
    if (session?.user?.id && session.user.id !== profile.userId) {
      const followResult = await db
        .select()
        .from(userFollows)
        .where(
          and(
            eq(userFollows.followerId, session.user.id),
            eq(userFollows.followingId, profile.userId)
          )
        )
        .limit(1);
      isFollowing = followResult.length > 0;
    }

    // ✅ Get pinned tier list details
    let pinnedTierList = null;
    if (pinnedResult[0]?.itemId) {
      const pinnedTL = await db
        .select()
        .from(tierLists)
        .where(
          and(
            eq(tierLists.id, pinnedResult[0].itemId),
            eq(tierLists.isPublic, true)
          )
        )
        .limit(1);
      pinnedTierList = pinnedTL[0] || null;
    }

    // ✅ Profile data for client
    const profileData = {
      id: profile.id,
      user_id: profile.userId,
      username: profile.username,
      bio: profile.bio,
      avatar_url: profile.avatarUrl || userData?.image,
      banner_url: profile.bannerUrl,
      location: profile.location,
      pronouns: profile.pronouns,
      website: profile.website,
      status_message: profile.statusMessage,
      twitter_url: profile.twitterUrl,
      instagram_url: profile.instagramUrl,
      youtube_url: profile.youtubeUrl,
      tiktok_url: profile.tiktokUrl,
      imdb_url: profile.imdbUrl,
      letterboxd_url: profile.letterboxdUrl,
      favorite_hero: favoriteHero ? {
        slug: favoriteHero.slug,
        name: favoriteHero.name,
      } : null,
      favorite_movie: favoriteMovie ? {
        slug: favoriteMovie.slug,
        title: favoriteMovie.title,
      } : null,
      created_at: profile.createdAt?.toISOString(),
      is_online: profile.isOnline ?? false,
      last_seen: profile.lastSeen?.toISOString() || null,
    };

    // ✅ Privacy settings
    const privacySettings = {
      show_followers: profile.showFollowers ?? true,
      show_following: profile.showFollowing ?? true,
      show_watchlist: profile.showWatchlist ?? true,
      show_watched: profile.showWatched ?? true,
      show_reviews: profile.showReviews ?? true,
      show_tier_lists: profile.showTierLists ?? true,
      show_memes: profile.showMemes ?? true,
    };

    return NextResponse.json({
      profile: profileData,
      followers: followersResult[0]?.count || 0,
      following: followingResult[0]?.count || 0,
      isFollowing,
      privacySettings,
      watchlistData: watchlistResult,
      watchedData: watchedResult,
      reviewsData: reviewsResult,
      badgesData: badgesResult,
      tierListsData: tierListsResult,
      pinnedTierList,
      userMemes: memesResult,
    });

  } catch (error) {
    console.error('❌ Profile API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
