import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { memeComments } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// GET comments
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const comments = await db.query.memeComments.findMany({
      where: eq(memeComments.memeId, id),
      orderBy: [desc(memeComments.createdAt)],
      with: {
        user: true,
      },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

// POST new comment
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { comment } = await req.json();

    await db.insert(memeComments).values({
      memeId: id,
      userId: session.user.id,
      comment,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
