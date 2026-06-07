import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userProfiles, memes } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

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

    const userMemes = await db
      .select()
      .from(memes)
      .where(eq(memes.userId, user.id))
      .orderBy(desc(memes.createdAt));

    return NextResponse.json({ memes: userMemes });
  } catch (error) {
    console.error('Error fetching memes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch memes' },
      { status: 500 }
    );
  }
}
