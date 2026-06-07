import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userProfiles, watchedMovies } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;

    // ✅ FIXED: Use userProfiles (what you imported)
    const [user] = await db
      .select()
      .from(userProfiles)  // ← CHANGED from profileUserProfiles
      .where(eq(userProfiles.username, username))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userWatchedMovies = await db
      .select()
      .from(watchedMovies)
      .where(eq(watchedMovies.userId, user.userId));

    return NextResponse.json({ watched: userWatchedMovies });
  } catch (error) {
    console.error('Error fetching watched movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch watched movies' },
      { status: 500 }
    );
  }
}
