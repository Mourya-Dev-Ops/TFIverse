import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userProfiles, watchlist } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;

    const [user] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.username, username))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userWatchlist = await db
      .select()
      .from(watchlist)
      .where(eq(watchlist.userId, user.userId));

    return NextResponse.json({ watchlist: userWatchlist });
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch watchlist' },
      { status: 500 }
    );
  }
}
