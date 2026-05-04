import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { users, userProfiles, userFollows } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import PublicProfileView from "./public-profile-view";
import { auth } from "@/auth";
import { getMemes } from "@/app/actions/memes";
import { getTierLists } from "@/app/actions/tierlist";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return {
    title: `${username} | TFIverse`,
    description: `Check out ${username}'s profile on TFIverse.`,
  };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const session = await auth();
  
  // Find profile by username
  const [profileRecord] = await db
    .select({
      profile: userProfiles,
      user: {
        id: users.id,
        createdAt: users.createdAt,
      }
    })
    .from(userProfiles)
    .innerJoin(users, eq(userProfiles.userId, users.id))
    .where(eq(sql`lower(${userProfiles.username})`, username.toLowerCase()));

  if (!profileRecord) {
    notFound();
  }

  // Get follower/following counts
  const [{ count: followersCount }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(userFollows)
    .where(eq(userFollows.followingId, profileRecord.user.id));

  const [{ count: followingCount }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(userFollows)
    .where(eq(userFollows.followerId, profileRecord.user.id));

  // Check if current user is following
  let isFollowing = false;
  if (session?.user?.id) {
    const [followRecord] = await db
      .select()
      .from(userFollows)
      .where(sql`${userFollows.followerId} = ${session.user.id} AND ${userFollows.followingId} = ${profileRecord.user.id}`);
    isFollowing = !!followRecord;
  }

  // Fetch memes and tier lists
  const [memes, tierLists] = await Promise.all([
    getMemes({ userId: profileRecord.user.id }),
    getTierLists({ userId: profileRecord.user.id }),
  ]);

  return (
    <PublicProfileView 
      profile={profileRecord.profile} 
      user={profileRecord.user}
      followersCount={Number(followersCount)} 
      followingCount={Number(followingCount)}
      initialIsFollowing={isFollowing}
      currentUserId={session?.user?.id}
      memes={memes}
      tierLists={tierLists}
    />
  );
}
