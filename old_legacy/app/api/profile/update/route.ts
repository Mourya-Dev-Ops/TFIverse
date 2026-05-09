import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { userProfiles } from '@/lib/schema';
import { eq, and, not } from 'drizzle-orm';
import { updateStatsAndCheckBadges, removeBadgeIfNotQualified } from '@/lib/badge-system';

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    
    const {
      username, bio, location, pronouns, statusMessage, statusEmoji, website,
      twitterUrl, instagramUrl, youtubeUrl, tiktokUrl, imdbUrl, letterboxdUrl,
      favoriteBadges, showFollowers, showFollowing, showWatchlist,
      showWatched, showReviews, showTierLists, showMemes,
      themeColor, favoriteHeroSlug, favoriteMovieSlug, privacySettings,
    } = body;

    // Get current profile
    const [currentProfile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    if (!currentProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // ✅ FIXED: Check if username is taken BY ANOTHER USER
    if (username && username !== currentProfile.username) {
      // Validate username format
      if (username.length < 3) {
        return NextResponse.json({ error: 'Username must be at least 3 characters' }, { status: 400 });
      }
      
      if (username.length > 20) {
        return NextResponse.json({ error: 'Username must be less than 20 characters' }, { status: 400 });
      }
      
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return NextResponse.json({ error: 'Username can only contain letters, numbers, and underscores' }, { status: 400 });
      }

      // ✅ CHECK IF USERNAME EXISTS (EXCLUDING CURRENT USER!)
      const [existingUser] = await db
        .select()
        .from(userProfiles)
        .where(
          and(
            eq(userProfiles.username, username),
            not(eq(userProfiles.userId, userId))  // ✅ KEY FIX!
          )
        )
        .limit(1);

      if (existingUser) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
      }
    }

    // Update profile
    const [updatedProfile] = await db
      .update(userProfiles)
      .set({
        ...(username && { username }),
        ...(bio !== undefined && { bio }),
        ...(location !== undefined && { location }),
        ...(pronouns !== undefined && { pronouns }),
        ...(statusMessage !== undefined && { statusMessage }),
        ...(statusEmoji !== undefined && { statusEmoji }),
        ...(website !== undefined && { website }),
        ...(twitterUrl !== undefined && { twitterUrl }),
        ...(instagramUrl !== undefined && { instagramUrl }),
        ...(youtubeUrl !== undefined && { youtubeUrl }),
        ...(tiktokUrl !== undefined && { tiktokUrl }),
        ...(imdbUrl !== undefined && { imdbUrl }),
        ...(letterboxdUrl !== undefined && { letterboxdUrl }),
        ...(favoriteBadges && { favoriteBadges }),
        ...(showFollowers !== undefined && { showFollowers }),
        ...(showFollowing !== undefined && { showFollowing }),
        ...(showWatchlist !== undefined && { showWatchlist }),
        ...(showWatched !== undefined && { showWatched }),
        ...(showReviews !== undefined && { showReviews }),
        ...(showTierLists !== undefined && { showTierLists }),
        ...(showMemes !== undefined && { showMemes }),
        ...(themeColor !== undefined && { themeColor }),
        ...(favoriteHeroSlug !== undefined && { favoriteHeroSlug }),
        ...(favoriteMovieSlug !== undefined && { favoriteMovieSlug }),
        ...(privacySettings !== undefined && { privacySettings }),
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.userId, userId))
      .returning();

    // Update badges
    await updateStatsAndCheckBadges(userId, 'profile_updated');
    await removeBadgeIfNotQualified(userId, 'profile-complete');

    return NextResponse.json({ 
      success: true,
      profile: updatedProfile 
    });
    
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
