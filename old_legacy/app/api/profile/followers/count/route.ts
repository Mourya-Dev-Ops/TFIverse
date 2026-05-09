import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { userFollows } from '@/lib/schema';
import { eq, count } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [result] = await db
      .select({ count: count() })
      .from(userFollows)
      .where(eq(userFollows.followingId, session.user.id));

    return NextResponse.json({ count: result?.count || 0 });
  } catch (error) {
    console.error('Error fetching followers count:', error);
    return NextResponse.json({ error: 'Failed to fetch followers count' }, { status: 500 });
  }
}
