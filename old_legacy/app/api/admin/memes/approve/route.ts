import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { memes } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.email !== 'peppersaltcutie@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { memeId } = await request.json();

    await db
      .update(memes)
      .set({ status: 'approved' })
      .where(eq(memes.id, memeId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to approve meme:', error);
    return NextResponse.json({ error: 'Failed to approve meme' }, { status: 500 });
  }
}
