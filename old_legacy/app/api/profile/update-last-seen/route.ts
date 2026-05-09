import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { userProfiles } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await db
      .update(userProfiles)
      .set({
        lastSeen: new Date(),
        isOnline: true,
      })
      .where(eq(userProfiles.userId, session.user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update last seen error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
