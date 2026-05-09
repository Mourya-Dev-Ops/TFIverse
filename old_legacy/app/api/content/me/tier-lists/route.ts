import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { tierLists } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userTierLists = await db
      .select()
      .from(tierLists)
      .where(eq(tierLists.userId, session.user.id))
      .orderBy(desc(tierLists.createdAt));

    return NextResponse.json({ tierLists: userTierLists });
  } catch (error) {
    console.error('Error fetching tier lists:', error);
    return NextResponse.json({ error: 'Failed to fetch tier lists' }, { status: 500 });
  }
}
