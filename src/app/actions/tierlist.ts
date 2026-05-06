'use server';

import { db } from '@/lib/db';
import { tierLists, tierListLikes, tierListComments, userProfiles, users } from '@/lib/schema';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { eq, and, desc, count, sql } from 'drizzle-orm';
import { sanitizeInput } from '@/lib/sanitize';

// ============================================================================
// CREATE TIER LIST
// ============================================================================

export async function createTierList(data: {
  title: string;
  description: string;
  tiers: Record<string, string[]>;
  isPublic: boolean;
  tierConfigs?: { id: string; label: string; emoji: string }[];
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be signed in to save a tier list');
  }

  if (!data.title || data.title.trim().length === 0) throw new Error('Title is required');
  if (data.title.length > 100) throw new Error('Title must be under 100 characters');
  if (data.description && data.description.length > 500) throw new Error('Description must be under 500 characters');

  const [newTierList] = await db
    .insert(tierLists)
    .values({
      userId: session.user.id,
      title: sanitizeInput(data.title.trim()),
      description: data.description ? sanitizeInput(data.description.trim()) : null,
      tiers: data.tiers as any,
      isPublic: data.isPublic,
    })
    .returning();

  revalidatePath('/tier-list');

  return newTierList;
}

// ============================================================================
// GET ALL PUBLIC TIER LISTS (Community Hub)
// ============================================================================

export async function getTierLists(options: { userId?: string } = {}) {
  const { userId } = options;

  let query = db
    .select({
      id: tierLists.id,
      title: tierLists.title,
      description: tierLists.description,
      userId: tierLists.userId,
      tiers: tierLists.tiers,
      isPublic: tierLists.isPublic,
      createdAt: tierLists.createdAt,
      username: userProfiles.username,
      avatar: userProfiles.avatarUrl,
    })
    .from(tierLists)
    .leftJoin(userProfiles, eq(tierLists.userId, userProfiles.userId));

  if (userId) {
    query = query.where(eq(tierLists.userId, userId)) as any;
  } else {
    query = query.where(eq(tierLists.isPublic, true)) as any;
  }

  const lists = await query
    .orderBy(desc(tierLists.createdAt))
    .limit(50);

  // Get like counts
  const listsWithLikes = await Promise.all(
    lists.map(async (list) => {
      const [result] = await db
        .select({ count: count() })
        .from(tierListLikes)
        .where(eq(tierListLikes.tierListId, list.id));
      return { ...list, likeCount: result?.count || 0 };
    })
  );

  return listsWithLikes;
}

// ============================================================================
// GET SINGLE TIER LIST
// ============================================================================

export async function getTierList(id: string) {
  const [list] = await db
    .select({
      id: tierLists.id,
      title: tierLists.title,
      description: tierLists.description,
      userId: tierLists.userId,
      tiers: tierLists.tiers,
      isPublic: tierLists.isPublic,
      createdAt: tierLists.createdAt,
      username: userProfiles.username,
      avatar: userProfiles.avatarUrl,
    })
    .from(tierLists)
    .leftJoin(userProfiles, eq(tierLists.userId, userProfiles.userId))
    .where(eq(tierLists.id, id));

  if (!list) return null;

  // Get like count
  const [likeResult] = await db
    .select({ count: count() })
    .from(tierListLikes)
    .where(eq(tierListLikes.tierListId, id));

  // Check if current user liked it
  const session = await auth();
  let liked = false;
  if (session?.user?.id) {
    const [userLike] = await db
      .select()
      .from(tierListLikes)
      .where(and(
        eq(tierListLikes.tierListId, id),
        eq(tierListLikes.userId, session.user.id)
      ));
    liked = !!userLike;
  }

  return {
    ...list,
    likeCount: likeResult?.count || 0,
    liked,
  };
}

// ============================================================================
// GET USER'S OWN TIER LISTS
// ============================================================================

export async function getUserTierLists() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const lists = await db
    .select()
    .from(tierLists)
    .where(eq(tierLists.userId, session.user.id))
    .orderBy(desc(tierLists.createdAt));

  const listsWithLikes = await Promise.all(
    lists.map(async (list) => {
      const [result] = await db
        .select({ count: count() })
        .from(tierListLikes)
        .where(eq(tierListLikes.tierListId, list.id));
      return { ...list, likeCount: result?.count || 0 };
    })
  );

  return listsWithLikes;
}

// ============================================================================
// TOGGLE LIKE
// ============================================================================

export async function toggleTierListLike(tierListId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Must be signed in to like');

  const [existing] = await db
    .select()
    .from(tierListLikes)
    .where(and(
      eq(tierListLikes.tierListId, tierListId),
      eq(tierListLikes.userId, session.user.id)
    ));

  if (existing) {
    await db.delete(tierListLikes).where(eq(tierListLikes.id, existing.id));
    revalidatePath(`/tier-list/${tierListId}`);
    return { liked: false };
  } else {
    await db.insert(tierListLikes).values({
      userId: session.user.id,
      tierListId,
    });
    revalidatePath(`/tier-list/${tierListId}`);
    return { liked: true };
  }
}

// ============================================================================
// DELETE TIER LIST
// ============================================================================

export async function deleteTierList(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const [list] = await db.select().from(tierLists).where(eq(tierLists.id, id));
  if (!list) throw new Error('Tier list not found');
  if (list.userId !== session.user.id) throw new Error('You can only delete your own tier lists');

  await db.delete(tierLists).where(eq(tierLists.id, id));
  revalidatePath('/tier-list');
  return { success: true };
}

// ============================================================================
// ADD COMMENT
// ============================================================================

export async function addTierListComment(tierListId: string, content: string, parentId?: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Must be signed in to comment');
  if (!content.trim()) throw new Error('Comment cannot be empty');
  if (content.trim().length > 500) throw new Error('Comment must be 500 characters or less');

  const [comment] = await db.insert(tierListComments).values({
    tierListId,
    userId: session.user.id,
    parentId: parentId || null,
    content: sanitizeInput(content.trim()),
  }).returning();

  revalidatePath(`/tier-list/${tierListId}`);
  return comment;
}

// ============================================================================
// GET COMMENTS
// ============================================================================

export async function getTierListComments(tierListId: string) {
  const comments = await db
    .select({
      id: tierListComments.id,
      content: tierListComments.content,
      parentId: tierListComments.parentId,
      userId: tierListComments.userId,
      createdAt: tierListComments.createdAt,
      username: userProfiles.username,
      avatar: userProfiles.avatarUrl,
      userName: users.name,
    })
    .from(tierListComments)
    .leftJoin(userProfiles, eq(tierListComments.userId, userProfiles.userId))
    .leftJoin(users, eq(tierListComments.userId, users.id))
    .where(eq(tierListComments.tierListId, tierListId))
    .orderBy(desc(tierListComments.createdAt));

  return comments;
}

// ============================================================================
// DELETE COMMENT
// ============================================================================

export async function deleteTierListComment(commentId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const [comment] = await db.select().from(tierListComments).where(eq(tierListComments.id, commentId));
  if (!comment) throw new Error('Comment not found');
  if (comment.userId !== session.user.id) throw new Error('You can only delete your own comments');

  await db.delete(tierListComments).where(eq(tierListComments.id, commentId));
  revalidatePath(`/tier-list/${comment.tierListId}`);
  return { success: true };
}
