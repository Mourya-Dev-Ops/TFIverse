import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userProfiles, reviews } from '@/lib/schema';
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

    const userReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.userId, user.id))
      .orderBy(desc(reviews.createdAt));

    return NextResponse.json({ reviews: userReviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
