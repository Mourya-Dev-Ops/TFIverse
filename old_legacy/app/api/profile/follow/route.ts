import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { userFollows, userProfiles } from '@/lib/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { targetUserId } = await request.json();

    if (!targetUserId) {
      return NextResponse.json({ error: 'Target user ID required' }, { status: 400 });
    }

    if (targetUserId === session.user.id) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
    }

    const [existingFollow] = await db
      .select()
      .from(userFollows)
      .where(
        and(
          eq(userFollows.followerId, session.user.id),
          eq(userFollows.followingId, targetUserId)
        )
      )
      .limit(1);

    if (existingFollow) {
      await db
        .delete(userFollows)
        .where(
          and(
            eq(userFollows.followerId, session.user.id),
            eq(userFollows.followingId, targetUserId)
          )
        );

      await db
        .update(userProfiles)
        .set({
          totalFollowers: sql`GREATEST(${userProfiles.totalFollowers} - 1, 0)`,
        })
        .where(eq(userProfiles.userId, targetUserId));

      await db
        .update(userProfiles)
        .set({
          totalFollowing: sql`GREATEST(${userProfiles.totalFollowing} - 1, 0)`,
        })
        .where(eq(userProfiles.userId, session.user.id));

      return NextResponse.json({ action: 'unfollowed', isFollowing: false });
    } else {
      await db.insert(userFollows).values({
        followerId: session.user.id,
        followingId: targetUserId,
      });

      await db
        .update(userProfiles)
        .set({
          totalFollowers: sql`${userProfiles.totalFollowers} + 1`,
        })
        .where(eq(userProfiles.userId, targetUserId));

      await db
        .update(userProfiles)
        .set({
          totalFollowing: sql`${userProfiles.totalFollowing} + 1`,
        })
        .where(eq(userProfiles.userId, session.user.id));

      return NextResponse.json({ action: 'followed', isFollowing: true });
    }
  } catch (error) {
    console.error('Error following/unfollowing:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
