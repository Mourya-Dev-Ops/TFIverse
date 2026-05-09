import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { memes } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'pending';

    const allMemes = await db
      .select()
      .from(memes)
      .where(eq(memes.status, status as any))
      .orderBy(desc(memes.createdAt));

    return NextResponse.json({ memes: allMemes });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
