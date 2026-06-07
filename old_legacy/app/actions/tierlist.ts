'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { tierLists, tierListLikes, users } from '@/lib/schema';
import { eq, desc, sql } from 'drizzle-orm';


export async function createTierList(data: {
  title: string;
  description?: string;
  tiers: any;
  isPublic: boolean;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const [newList] = await db
    .insert(tierLists)
    .values({
      userId: session.user.id,
      title: data.title,
      description: data.description,
      tiers: data.tiers,
      isPublic: data.isPublic,
    })
    .returning();

  return newList;
}

export async function getTierLists() {
  const lists = await db
    .select({
      id: tierLists.id,
      title: tierLists.title,
      description: tierLists.description,
      userId: tierLists.userId,
      createdAt: tierLists.createdAt,
      username: users.name,
      avatar: users.image,
      likeCount: sql<number>`count(${tierListLikes.id})`.as('likeCount'),
    })
    .from(tierLists)
    .leftJoin(users, eq(tierLists.userId, users.id))
    .leftJoin(tierListLikes, eq(tierLists.id, tierListLikes.tierListId))
    .where(eq(tierLists.isPublic, true))
    .groupBy(tierLists.id, users.id)
    .orderBy(desc(tierLists.createdAt))
    .limit(50);

  return lists;
}

export async function getTierList(id: string) {
  const [list] = await db
    .select()
    .from(tierLists)
    .where(eq(tierLists.id, id))
    .limit(1);

  return list;
}

export async function toggleTierListLike(tierListId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const [existing] = await db
    .select()
    .from(tierListLikes)
    .where(
      sql`${tierListLikes.userId} = ${session.user.id} AND ${tierListLikes.tierListId} = ${tierListId}`
    )
    .limit(1);

  if (existing) {
    await db.delete(tierListLikes).where(eq(tierListLikes.id, existing.id));
    return { liked: false };
  } else {
    await db.insert(tierListLikes).values({
      userId: session.user.id,
      tierListId,
    });
    return { liked: true };
  }
}
export async function updateTierList(id: string, data: {
  title: string;
  description?: string;
  tiers: any;
  isPublic: boolean;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  // Check ownership
  const [existing] = await db
    .select()
    .from(tierLists)
    .where(eq(tierLists.id, id))
    .limit(1);

  if (!existing || existing.userId !== session.user.id) {
    throw new Error('Not authorized to update this tier list');
  }

  const [updated] = await db
    .update(tierLists)
    .set({
      title: data.title,
      description: data.description,
      tiers: data.tiers,
      isPublic: data.isPublic,
      updatedAt: new Date(),
    })
    .where(eq(tierLists.id, id))
    .returning();

  return updated;
}

export async function deleteTierList(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  // Check ownership
  const [existing] = await db
    .select()
    .from(tierLists)
    .where(eq(tierLists.id, id))
    .limit(1);

  if (!existing || existing.userId !== session.user.id) {
    throw new Error('Not authorized to delete this tier list');
  }

  await db.delete(tierLists).where(eq(tierLists.id, id));
  return { success: true };
}

export async function getUserTierLists() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const lists = await db
    .select()
    .from(tierLists)
    .where(eq(tierLists.userId, session.user.id))
    .orderBy(desc(tierLists.createdAt));

  // Get like counts
  const listsWithLikes = await Promise.all(
    lists.map(async (list) => {
      const likes = await db
        .select({ count: sql<number>`count(*)` })
        .from(tierListLikes)
        .where(eq(tierListLikes.tierListId, list.id));

      return {
        ...list,
        likeCount: Number(likes[0]?.count || 0),
      };
    })
  );

  return listsWithLikes;
}
