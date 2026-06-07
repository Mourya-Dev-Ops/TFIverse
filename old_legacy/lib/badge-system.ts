import { db } from '@/lib/db';
import { userProfiles, userBadges, badges } from '@/lib/schema'; // ✅ FIXED: Added 's'
import { eq, and } from 'drizzle-orm';

export async function checkAndAwardBadges(userId: string) {
  // Get user profile
  const profile = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  if (!profile || profile.length === 0) return [];

  const userProf = profile[0];

  // Get all badges
  const allBadges = await db.select().from(badges);
  if (!allBadges || allBadges.length === 0) return [];

  const awarded: string[] = [];

  // Check each badge requirement
  for (const badge of allBadges) {
    // Check if user already has this badge
    const existingBadge = await db
      .select()
      .from(userBadges)
      .where(and(eq(userBadges.userId, userId), eq(userBadges.badgeId, badge.id)))
      .limit(1);

    if (existingBadge && existingBadge.length > 0) continue; // Already has this badge

    const requirement = badge.requirement as any;
    let shouldAward = false;

    switch (requirement?.type) {
      case 'email_verified':
        shouldAward = userProf.emailVerified === true;
        break;

      case 'verified':
        shouldAward = userProf.isVerified === true;
        break;

      // ✅ Profile Complete Badge (100% profile)
      case 'profile_complete':
        shouldAward = calculateProfileCompleteness(userProf) === 100;
        break;

      case 'movies_watched':
        shouldAward = (userProf.totalMoviesWatched || 0) >= requirement.count;
        break;

      case 'reviews_written':
        shouldAward = (userProf.totalReviewsWritten || 0) >= requirement.count;
        break;

      case 'likes_given':
        shouldAward = (userProf.totalLikesGiven || 0) >= requirement.count;
        break;

      case 'streak_days':
        shouldAward = (userProf.streakDays || 0) >= requirement.count;
        break;

      case 'account_age_days':
        const accountAge = Math.floor(
          (Date.now() - new Date(userProf.createdAt!).getTime()) / (1000 * 60 * 60 * 24)
        );
        shouldAward = accountAge >= requirement.count;
        break;
    }

    if (shouldAward) {
      // Award the badge
      await db.insert(userBadges).values({
        userId,
        badgeId: badge.id,
        earnedAt: new Date(),
      });

      awarded.push(badge.name);
      console.log(`🎖️ Awarded badge: ${badge.name} to user ${userId}`);
    }
  }

  return awarded;
}

// ✅ Calculate Profile Completeness
function calculateProfileCompleteness(profile: any): number {
  const core = {
    username: !!profile.username && profile.username.trim().length > 0,
    bio: !!profile.bio && profile.bio.trim().length > 0,
    avatar: !!profile.avatarUrl || !!profile.avatar_url,
    banner: !!profile.bannerUrl || !!profile.banner_url,
    location: !!profile.location,
  };

  const socials = {
    website: !!profile.website,
    twitterUrl: !!profile.twitterUrl || !!profile.twitter_url,
    instagramUrl: !!profile.instagramUrl || !!profile.instagram_url,
    youtubeUrl: !!profile.youtubeUrl || !!profile.youtube_url,
    tiktokUrl: !!profile.tiktokUrl || !!profile.tiktok_url,
    letterboxdUrl: !!profile.letterboxdUrl || !!profile.letterboxd_url,
    imdbUrl: !!profile.imdbUrl || !!profile.imdb_url,
  };

  const socialsFilled = Object.values(socials).filter(Boolean).length;
  const socialCredits = Math.min(5, socialsFilled);
  const coreFilled = Object.values(core).filter(Boolean).length;

  return Math.round(((coreFilled + socialCredits) / 10) * 100);
}

// Call this after user actions
export async function updateStatsAndCheckBadges(
  userId: string,
  action: 'movie_watched' | 'review_written' | 'like_given' | 'profile_updated'
) {
  const profile = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  if (!profile || profile.length === 0) return [];

  const userProf = profile[0];
  const updates: any = {};

  switch (action) {
    case 'movie_watched':
      updates.totalMoviesWatched = (userProf.totalMoviesWatched || 0) + 1;
      break;

    case 'review_written':
      updates.totalReviewsWritten = (userProf.totalReviewsWritten || 0) + 1;
      break;

    case 'like_given':
      updates.totalLikesGiven = (userProf.totalLikesGiven || 0) + 1;
      break;

    case 'profile_updated':
      // No stats update needed, just check badges
      break;
  }

  if (Object.keys(updates).length > 0) {
    // Update user profile stats
    await db.update(userProfiles).set(updates).where(eq(userProfiles.userId, userId));
  }

  // Check for new badges
  const newBadges = await checkAndAwardBadges(userId);
  return newBadges;
}

// ✅ NEW: Remove badge if requirements no longer met
export async function removeBadgeIfNotQualified(userId: string, badgeKey: string) {
  const profile = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  if (!profile || profile.length === 0) return;

  const userProf = profile[0];
  
  // Get the badge
  const badge = await db.select().from(badges).where(eq(badges.key, badgeKey)).limit(1);
  if (!badge || badge.length === 0) return;

  const requirement = badge[0].requirement as any;
  let stillQualifies = false;

  // Check if user still meets requirements
  if (requirement?.type === 'profile_complete') {
    stillQualifies = calculateProfileCompleteness(userProf) === 100;
  }

  // If no longer qualifies, remove the badge
  if (!stillQualifies) {
    await db.delete(userBadges).where(
      and(
        eq(userBadges.userId, userId),
        eq(userBadges.badgeId, badge[0].id)
      )
    );
    console.log(`🚫 Removed badge: ${badge[0].name} from user ${userId}`);
  }
}
