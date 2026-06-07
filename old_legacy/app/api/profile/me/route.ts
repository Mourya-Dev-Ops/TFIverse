// app/api/profile/me/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { userProfiles, users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // ✅ Fetch user profile with user data
    const [profile] = await db
      .select({
        profile: userProfiles,
        user: users,
      })
      .from(userProfiles)
      .leftJoin(users, eq(userProfiles.userId, users.id))
      .where(eq(userProfiles.userId, session.user.id))
      .limit(1);

    if (!profile?.profile) {
      // ✅ Create profile if it doesn't exist
      const defaultUsername = session.user.name 
        ? session.user.name.toLowerCase().replace(/\s+/g, '_')
        : session.user.email?.split('@')[0] || 'user';

      const [newProfile] = await db
        .insert(userProfiles)
        .values({
          userId: session.user.id,
          username: defaultUsername,
          bio: null,
          location: null,
          website: null,
          avatarUrl: session.user.image || null,
          bannerUrl: null,
          pronouns: null,
          statusMessage: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return NextResponse.json({
        profile: newProfile,
        avatarUrl: newProfile.avatarUrl || session.user.image,
        username: newProfile.username,
        bio: newProfile.bio,
        pronouns: newProfile.pronouns,
      });
    }

    // ✅ Return existing profile with avatar
    return NextResponse.json({
      profile: profile.profile,
      avatarUrl: profile.profile.avatarUrl || profile.user?.image || null,
      username: profile.profile.username,
      bio: profile.profile.bio,
      pronouns: profile.profile.pronouns,
      statusMessage: profile.profile.statusMessage,
      location: profile.profile.location,
      website: profile.profile.website,
    });
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
