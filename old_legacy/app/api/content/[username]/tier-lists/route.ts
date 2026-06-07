import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userProfiles, tierLists } from '@/lib/schema';
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

    const userTierLists = await db
      .select()
      .from(tierLists)
      .where(eq(tierLists.userId, user.id))
      .orderBy(desc(tierLists.createdAt));

    return NextResponse.json({ tierLists: userTierLists });
  } catch (error) {
    console.error('Error fetching tier lists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tier lists' },
      { status: 500 }
    );
  }
}
