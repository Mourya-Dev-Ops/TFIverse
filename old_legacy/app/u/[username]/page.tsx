import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { userProfiles, users, userFollows, reviews, watchedMovies, watchlist, tierLists, memes } from '@/lib/schema';
import { eq, and, count } from 'drizzle-orm';
import ProfileClient from './page-client';
import { auth } from '@/lib/auth';

export default async function UserProfilePage({ params }: { params: { username: string } }) {
  const session = await auth();
  const currentUserId = session?.user?.id;

  // Fetch user profile by username
  const [profile] = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.username, params.username))
    .limit(1);

  if (!profile) {
    notFound();
  }

  // Get user data from users table
  const [userData] = await db
    .select()
    .from(users)
    .where(eq(users.id, profile.userId))
    .limit(1);

  // Check if current user is following this profile
  let isFollowing = false;
  if (currentUserId) {
    const [followCheck] = await db
      .select()
      .from(userFollows)
      .where(
        and(
          eq(userFollows.followerId, currentUserId),
          eq(userFollows.followingId, profile.userId)
        )
      )
      .limit(1);
    
    isFollowing = !!followCheck;
  }

  // Get followers count
  const [followersData] = await db
    .select({ count: count() })
    .from(userFollows)
    .where(eq(userFollows.followingId, profile.userId));

  // Get following count
  const [followingData] = await db
    .select({ count: count() })
    .from(userFollows)
    .where(eq(userFollows.followerId, profile.userId));

  // Get content counts
  const [reviewsCount] = await db
    .select({ count: count() })
    .from(reviews)
    .where(eq(reviews.userId, profile.userId));

  const [watchedCount] = await db
    .select({ count: count() })
    .from(watchedMovies)
    .where(eq(watchedMovies.userId, profile.userId));

  const [watchlistCount] = await db
    .select({ count: count() })
    .from(watchlist)
    .where(eq(watchlist.userId, profile.userId));

  const [tierListsCount] = await db
    .select({ count: count() })
    .from(tierLists)
    .where(eq(tierLists.userId, profile.userId));

  const [memesCount] = await db
    .select({ count: count() })
    .from(memes)
    .where(and(
      eq(memes.userId, profile.userId),
      eq(memes.status, 'approved')
    ));

  // Prepare data for client component
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
    favorite_badges: profile.favoriteBadges as string[],
    badges: profile.badges as string[],
    created_at: profile.createdAt?.toISOString(),
  };

  const privacySettings = {
    show_followers: profile.showFollowers ?? true,
    show_following: profile.showFollowing ?? true,
    show_watchlist: profile.showWatchlist ?? true,
    show_watched: profile.showWatched ?? true,
    show_reviews: profile.showReviews ?? true,
    show_tier_lists: profile.showTierLists ?? true,
    show_memes: profile.showMemes ?? true,
  };

  const counts = {
    followers: followersData?.count ?? 0,
    following: followingData?.count ?? 0,
    reviews: reviewsCount?.count ?? 0,
    watched: watchedCount?.count ?? 0,
    watchlist: watchlistCount?.count ?? 0,
    tierLists: tierListsCount?.count ?? 0,
    memes: memesCount?.count ?? 0,
  };

  const isOnline = profile.isOnline ?? false;
  const lastSeen = profile.lastSeen?.toISOString();
  const isOwnProfile = currentUserId === profile.userId;

  return (
    <ProfileClient
      profile={profileData}
      privacySettings={privacySettings}
      counts={counts}
      isFollowing={isFollowing}
      isOnline={isOnline}
      lastSeen={lastSeen}
      isOwnProfile={isOwnProfile}
      currentUserId={currentUserId}
    />
  );
}
