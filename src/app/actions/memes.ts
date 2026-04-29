"use server";

import { db } from "@/lib/db";
import { memes, memeLikes, memeViews, memeShares, memeDownloads, memeComments, userProfiles } from "@/lib/schema";
import { eq, and, desc, sql, asc, inArray, ilike, or } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getMemes(options: {
  sort?: "new" | "trending" | "top" | "featured";
  hero?: string;
  movie?: string;
  search?: string;
  limit?: number;
  offset?: number;
} = {}) {
  const { sort = "new", hero, movie, search, limit = 20, offset = 0 } = options;

  let whereClause = eq(memes.status, "approved");

  if (hero) {
    whereClause = and(whereClause, sql`${memes.heroTags} ? ${hero}`) as any;
  }

  if (movie) {
    whereClause = and(whereClause, sql`${memes.movieTags} ? ${movie}`) as any;
  }

  if (search) {
    whereClause = and(whereClause, or(
      ilike(memes.title, `%${search}%`),
      ilike(memes.description, `%${search}%`)
    )) as any;
  }

  let orderBy;
  switch (sort) {
    case "trending":
      orderBy = [desc(memes.views), desc(memes.likes)];
      break;
    case "top":
      orderBy = [desc(memes.likes)];
      break;
    case "featured":
      whereClause = and(whereClause, eq(memes.isFeatured, true)) as any;
      orderBy = [desc(memes.featuredAt)];
      break;
    default:
      orderBy = [desc(memes.createdAt)];
  }

  const items = await db.query.memes.findMany({
    where: whereClause,
    orderBy,
    limit,
    offset,
    with: {
      // We'll add relations if needed
    }
  });

  return items;
}

export async function createMeme(data: {
  title: string;
  description?: string;
  imageUrl: string;
  heroTags?: string[];
  movieTags?: string[];
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [newMeme] = await db.insert(memes).values({
    userId: session.user.id,
    title: data.title,
    description: data.description,
    imageUrl: data.imageUrl,
    heroTags: data.heroTags || [],
    movieTags: data.movieTags || [],
    status: "approved", // Auto-approve for now as per user request for "production ready all this memes page features no fluffy"
  }).returning();

  // Increment user meme count
  await db.update(userProfiles)
    .set({ totalMemes: sql`${userProfiles.totalMemes} + 1` })
    .where(eq(userProfiles.userId, session.user.id));

  revalidatePath("/memes");
  return newMeme;
}

export async function toggleLikeMeme(memeId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await db.query.memeLikes.findFirst({
    where: and(
      eq(memeLikes.memeId, memeId),
      eq(memeLikes.userId, session.user.id)
    ),
  });

  if (existing) {
    await db.delete(memeLikes).where(eq(memeLikes.id, existing.id));
    await db.update(memes)
      .set({ likes: sql`${memes.likes} - 1` })
      .where(eq(memes.id, memeId));
    return { liked: false };
  } else {
    await db.insert(memeLikes).values({
      memeId,
      userId: session.user.id,
    });
    await db.update(memes)
      .set({ likes: sql`${memes.likes} + 1` })
      .where(eq(memes.id, memeId));
    return { liked: true };
  }
}

export async function trackMemeView(memeId: string) {
  const session = await auth();
  // We can track guest views by IP if we wanted, but let's keep it simple
  await db.insert(memeViews).values({
    memeId,
    userId: session?.user?.id,
  });
  
  await db.update(memes)
    .set({ views: sql`${memes.views} + 1` })
    .where(eq(memes.id, memeId));
}

export async function getMemeOfTheWeek() {
  return await db.query.memes.findFirst({
    where: and(eq(memes.status, "approved"), eq(memes.isFeatured, true)),
    orderBy: [desc(memes.featuredAt)],
  });
}

export async function getUploadUrl(fileName: string, fileType: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const { getPresignedUploadUrl, getPublicUrl } = await import("@/lib/s3");
  const signedUrl = await getPresignedUploadUrl(fileName, fileType);
  const publicUrl = getPublicUrl(fileName);
  
  return { signedUrl, publicUrl };
}
