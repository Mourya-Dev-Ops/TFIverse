"use server";

import { db } from "@/lib/db";
import { userProfiles, users, userFollows } from "@/lib/schema";
import { eq, and, count } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { uploadToB2 } from "@/lib/storage";
import { sanitizeInput, sanitizeUrl, validateFileUpload, UPLOAD_LIMITS } from "@/lib/sanitize";

// ─── UPDATE PROFILE ──────────────────────────────────────────────
export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const username = formData.get("username") as string;
  const bio = formData.get("bio") as string;
  const location = formData.get("location") as string;
  const pronouns = formData.get("pronouns") as string;
  const website = formData.get("website") as string;
  const statusMessage = formData.get("statusMessage") as string;
  const statusEmoji = formData.get("statusEmoji") as string;
  const twitterUrl = formData.get("twitterUrl") as string;
  const instagramUrl = formData.get("instagramUrl") as string;
  const youtubeUrl = formData.get("youtubeUrl") as string;
  const tiktokUrl = formData.get("tiktokUrl") as string;
  const letterboxdUrl = formData.get("letterboxdUrl") as string;
  const imdbUrl = formData.get("imdbUrl") as string;
  const avatarUrl = formData.get("avatarUrl") as string;
  const bannerUrl = formData.get("bannerUrl") as string;
  const dateOfBirth = formData.get("dateOfBirth") as string;
  const favoriteHeroSlug = formData.get("favoriteHeroSlug") as string;
  const favoriteMovieSlug = formData.get("favoriteMovieSlug") as string;
  const themeColor = formData.get("themeColor") as string;

  const showWatchlist = formData.get("showWatchlist") === "true";
  const showWatched = formData.get("showWatched") === "true";
  const showReviews = formData.get("showReviews") === "true";
  const showTierLists = formData.get("showTierLists") === "true";
  const showMemes = formData.get("showMemes") === "true";
  const showFollowers = formData.get("showFollowers") === "true";
  const showFollowing = formData.get("showFollowing") === "true";

  if (!username || username.length < 3) {
    return { error: "Username must be at least 3 characters" };
  }
  if (username.length > 20) {
    return { error: "Username must be less than 20 characters" };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { error: "Username can only contain letters, numbers, and underscores" };
  }
  if (bio && bio.length > 500) {
    return { error: "Bio must be less than 500 characters" };
  }

  if (dateOfBirth) {
    const dobDate = new Date(dateOfBirth);
    const today = new Date();
    if (isNaN(dobDate.getTime())) {
      return { error: "Invalid date format for Date of Birth" };
    }
    if (dobDate >= today) {
      return { error: "Date of Birth can't be in the future" };
    }
    if (today.getFullYear() - dobDate.getFullYear() < 5) {
      return { error: "You must be at least 5 years old" };
    }
  }

  // Check if username is taken by someone else
  const existing = await db.select().from(userProfiles).where(eq(userProfiles.username, username));
  if (existing.length > 0 && existing[0].userId !== session.user.id) {
    return { error: "Username is already taken" };
  }

  await db
    .update(userProfiles)
    .set({
      username: username.trim(),
      bio: bio ? sanitizeInput(bio.trim()) : null,
      location: location?.trim() || null,
      pronouns: pronouns?.trim() || null,
      website: sanitizeUrl(website),
      statusMessage: statusMessage ? sanitizeInput(statusMessage.trim()) : null,
      statusEmoji: statusEmoji || "🎬",
      twitterUrl: sanitizeUrl(twitterUrl),
      instagramUrl: sanitizeUrl(instagramUrl),
      youtubeUrl: sanitizeUrl(youtubeUrl),
      tiktokUrl: sanitizeUrl(tiktokUrl),
      letterboxdUrl: sanitizeUrl(letterboxdUrl),
      imdbUrl: sanitizeUrl(imdbUrl),
      avatarUrl: avatarUrl?.trim() || null,
      bannerUrl: bannerUrl?.trim() || null,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      favoriteHeroSlug: favoriteHeroSlug?.trim() || null,
      favoriteMovieSlug: favoriteMovieSlug?.trim() || null,
      themeColor: themeColor?.trim() || "#3b82f6",
      showWatchlist,
      showWatched,
      showReviews,
      showTierLists,
      showMemes,
      showFollowers,
      showFollowing,
      updatedAt: new Date(),
    })
    .where(eq(userProfiles.userId, session.user.id));

  revalidatePath("/profile");
  revalidatePath(`/u/${username}`);
  return { success: true };
}

// ─── CHECK USERNAME AVAILABILITY ─────────────────────────────────
export async function checkUsername(username: string, currentUserId: string) {
  if (!username || username.length < 3) return { available: false };
  const existing = await db.select().from(userProfiles).where(eq(userProfiles.username, username));
  if (existing.length > 0 && existing[0].userId !== currentUserId) {
    return { available: false };
  }
  return { available: true };
}

// ─── FOLLOW / UNFOLLOW ───────────────────────────────────────────
export async function toggleFollow(targetUserId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };
  if (session.user.id === targetUserId) return { error: "Cannot follow yourself" };

  const existing = await db
    .select()
    .from(userFollows)
    .where(
      and(
        eq(userFollows.followerId, session.user.id),
        eq(userFollows.followingId, targetUserId)
      )
    );

  if (existing.length > 0) {
    await db
      .delete(userFollows)
      .where(
        and(
          eq(userFollows.followerId, session.user.id),
          eq(userFollows.followingId, targetUserId)
        )
      );
    return { action: "unfollowed" };
  } else {
    await db.insert(userFollows).values({
      followerId: session.user.id,
      followingId: targetUserId,
    });
    return { action: "followed" };
  }
}

// ─── DELETE ACCOUNT ──────────────────────────────────────────────
export async function deleteAccount() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  // Delete profile first (cascade will handle related data)
  await db.delete(userProfiles).where(eq(userProfiles.userId, session.user.id));
  await db.delete(users).where(eq(users.id, session.user.id));

  return { success: true };
}

// ─── GET PROFILE DATA (for server component) ────────────────────
export async function getFullProfile(userId: string) {
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));

  if (!user || !profile) return null;

  const [followersData] = await db
    .select({ count: count() })
    .from(userFollows)
    .where(eq(userFollows.followingId, userId));

  const [followingData] = await db
    .select({ count: count() })
    .from(userFollows)
    .where(eq(userFollows.followerId, userId));

  return {
    user,
    profile,
    followersCount: followersData?.count ?? 0,
    followingCount: followingData?.count ?? 0,
  };
}

export async function getFullProfileByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) return null;
  return getFullProfile(user.id);
}

// ─── GET PUBLIC PROFILE (by username) ────────────────────────────
export async function getPublicProfile(username: string) {
  const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.username, username));
  if (!profile) return null;

  const [user] = await db.select().from(users).where(eq(users.id, profile.userId));
  if (!user) return null;

  const [followersData] = await db
    .select({ count: count() })
    .from(userFollows)
    .where(eq(userFollows.followingId, profile.userId));

  const [followingData] = await db
    .select({ count: count() })
    .from(userFollows)
    .where(eq(userFollows.followerId, profile.userId));

  return {
    user,
    profile,
    followersCount: followersData?.count ?? 0,
    followingCount: followingData?.count ?? 0,
  };
}

// ─── CHECK IF FOLLOWING ──────────────────────────────────────────
export async function isFollowing(currentUserId: string, targetUserId: string) {
  const [result] = await db
    .select()
    .from(userFollows)
    .where(
      and(
        eq(userFollows.followerId, currentUserId),
        eq(userFollows.followingId, targetUserId)
      )
    );
  return !!result;
}

// ─── UPLOAD IMAGE (B2) ───────────────────────────────────────────
export async function uploadProfileImage(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const file = formData.get("file") as File;
  const type = formData.get("type") as "avatar" | "banner";

  if (!file || !type) return { error: "Missing file or type" };

  // Validate file size and type
  const validation = validateFileUpload(file, UPLOAD_LIMITS.MAX_IMAGE_SIZE);
  if (!validation.valid) return { error: validation.error };

  try {
    // 1. Get the current profile to find the old image URL
    const [currentProfile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, session.user.id));
    
    // 2. Upload the new image
    const url = await uploadToB2(file, `profiles/${session.user.id}/${type}`);
    
    // 3. Delete the old image from B2 to prevent orphaned files
    const { deleteFromB2 } = await import("@/lib/storage");
    if (type === "avatar") {
      if (currentProfile?.avatarUrl) await deleteFromB2(currentProfile.avatarUrl);
      await db.update(userProfiles).set({ avatarUrl: url }).where(eq(userProfiles.userId, session.user.id));
      await db.update(users).set({ image: url }).where(eq(users.id, session.user.id));
    } else {
      if (currentProfile?.bannerUrl) await deleteFromB2(currentProfile.bannerUrl);
      await db.update(userProfiles).set({ bannerUrl: url }).where(eq(userProfiles.userId, session.user.id));
    }

    revalidatePath("/profile");
    return { url };
  } catch (error) {
    console.error("Upload error:", error);
    return { error: "Failed to upload to cloud" };
  }
}

