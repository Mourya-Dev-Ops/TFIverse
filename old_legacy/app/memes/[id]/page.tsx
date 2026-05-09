import { auth } from '@/lib/auth';
import Navbar from '@/components/layout/navbar';
import MemeDetailClient from './meme-detail-client';
import { db } from '@/lib/db';
import { memes, memeViews } from '@/lib/schema';
import { eq, and, sql } from 'drizzle-orm';
import { headers } from 'next/headers';

export default async function MemeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  
  // ✅ Track view ONCE per user/IP
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || 'unknown';
  
  // Check if this user/IP already viewed
  const existingView = await db
    .select()
    .from(memeViews)
    .where(
      and(
        eq(memeViews.memeId, id),
        session?.user?.id 
          ? eq(memeViews.userId, session.user.id)
          : eq(memeViews.ipAddress, ip)
      )
    )
    .limit(1);

  // Only increment if new view
  if (existingView.length === 0) {
    await db.insert(memeViews).values({
      memeId: id,
      userId: session?.user?.id || null,
      ipAddress: ip,
    });
    
    await db
      .update(memes)
      .set({ views: sql`${memes.views} + 1` })
      .where(eq(memes.id, id));
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar user={session?.user} />
      <MemeDetailClient memeId={id} user={session?.user} />
    </div>
  );
}
