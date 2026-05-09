import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { pinnedItems, tierLists } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pinnedItem = await db
      .select({
        pinnedItem: pinnedItems,
        tierList: tierLists,
      })
      .from(pinnedItems)
      .innerJoin(tierLists, eq(pinnedItems.itemId, tierLists.id))
      .where(
        and(
          eq(pinnedItems.userId, session.user.id),
          eq(pinnedItems.itemType, 'tier_list')
        )
      )
      .limit(1);

    return NextResponse.json({ 
      pinnedTierList: pinnedItem[0]?.tierList || null 
    });
  } catch (error) {
    console.error('Error fetching pinned tier list:', error);
    return NextResponse.json({ error: 'Failed to fetch pinned tier list' }, { status: 500 });
  }
}
