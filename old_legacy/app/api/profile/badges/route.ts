import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { userBadges, badges } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userBadgesData = await db
      .select({
        userBadge: userBadges,
        badge: badges,
      })
      .from(userBadges)
      .innerJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(eq(userBadges.userId, session.user.id))
      .orderBy(desc(userBadges.earnedAt));

    return NextResponse.json({ 
      badges: userBadgesData.map(ub => ({
        ...ub.userBadge,
        badge: ub.badge,
      }))
    });
  } catch (error) {
    console.error('Error fetching badges:', error);
    return NextResponse.json({ error: 'Failed to fetch badges' }, { status: 500 });
  }
}
