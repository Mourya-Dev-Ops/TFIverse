import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { watchedMovies } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const watched = await db
      .select()
      .from(watchedMovies)
      .where(eq(watchedMovies.userId, session.user.id))
      .orderBy(desc(watchedMovies.watchedAt));

    return NextResponse.json({ watched });
  } catch (error) {
    console.error('Error fetching watched:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
