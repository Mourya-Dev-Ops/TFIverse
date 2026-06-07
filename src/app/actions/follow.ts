"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { userFollows, userProfiles } from "@/lib/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function followUser(targetUserId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const currentUserId = session.user.id;

  if (currentUserId === targetUserId) {
    throw new Error("You cannot follow yourself");
  }

  // Check if already following
  const [existing] = await db
    .select()
    .from(userFollows)
    .where(
      and(
        eq(userFollows.followerId, currentUserId),
        eq(userFollows.followingId, targetUserId)
      )
    );

  if (existing) {
    throw new Error("Already following this user");
  }

  await db.insert(userFollows).values({
    followerId: currentUserId,
    followingId: targetUserId,
  });

  revalidatePath("/profile");
  revalidatePath(`/u/[username]`);
}

export async function unfollowUser(targetUserId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const currentUserId = session.user.id;

  await db.delete(userFollows).where(
    and(
      eq(userFollows.followerId, currentUserId),
      eq(userFollows.followingId, targetUserId)
    )
  );

  revalidatePath("/profile");
  revalidatePath(`/u/[username]`);
}
