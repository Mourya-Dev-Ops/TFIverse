// app/api/content/me/watchlist/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { watchlist } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userWatchlist = await db
      .select()
      .from(watchlist)
      .where(eq(watchlist.userId, session.user.id))  // ✅ CORRECT FIELD NAME
      .orderBy(desc(watchlist.addedAt));

    return NextResponse.json({ watchlist: userWatchlist });
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch watchlist',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
