import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { userProfiles } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export default async function UIndex() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/signin?redirect=/u');
  }

  // Fetch user profile
  const [profile] = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, session.user.id))
    .limit(1);

  if (!profile?.username) {
    // No username set, redirect to profile setup
    redirect('/profile');
  }

  // Redirect to user's profile
  redirect(`/u/${encodeURIComponent(profile.username)}`);
}
