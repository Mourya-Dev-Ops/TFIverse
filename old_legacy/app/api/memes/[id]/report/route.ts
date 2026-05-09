import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { memeReports } from '@/lib/schema'; // ✅ Add this import
import { auth } from '@/lib/auth';

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
    const { reason } = await req.json();

    // ✅ Fix: .values() takes an object, not array
    await db.insert(memeReports).values({
      memeId: id,
      reportedBy: session.user.id, // Changed from userId to reportedBy
      reason,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
