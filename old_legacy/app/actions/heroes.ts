// app/actions/heroes.ts - Updated for people table

'use server';

import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL || '');

/**
 * ✅ Toggle follow/unfollow a person (hero)
 * Uses slug to look up person.id from people table
 */
export async function toggleHeroFollow(heroSlug: string, heroName: string) {
  try {
    // For now, use a mock user ID (you can add real auth later)
    const userId = 'user-demo-001'; // TODO: Replace with real session.user.id

    // ✅ Get person ID from people table
    const [person] = await sql`
      SELECT id FROM people
      WHERE slug = ${heroSlug}
      LIMIT 1
    `;

    if (!person) {
      console.error('❌ Person not found:', heroSlug);
      return { following: false };
    }

    const personId = person.id;

    // Check if already following
    const [existing] = await sql`
      SELECT id, following FROM hero_follows
      WHERE user_id = ${userId}
      AND hero_slug = ${heroSlug}
      LIMIT 1
    `;

    let following = false;

    if (existing) {
      // Toggle existing follow
      following = !existing.following;
      await sql`
        UPDATE hero_follows
        SET following = ${following}, updated_at = NOW()
        WHERE id = ${existing.id}
      `;

      // Update count
      if (following) {
        await sql`
          UPDATE hero_follow_counts
          SET count = count + 1, updated_at = NOW()
          WHERE hero_slug = ${heroSlug}
        `;
      } else {
        await sql`
          UPDATE hero_follow_counts
          SET count = GREATEST(0, count - 1), updated_at = NOW()
          WHERE hero_slug = ${heroSlug}
        `;
      }
    } else {
      // Create new follow record
      following = true;
      await sql`
        INSERT INTO hero_follows (user_id, hero_slug, hero_name, following)
        VALUES (${userId}, ${heroSlug}, ${heroName}, true)
      `;

      // Increase count
      await sql`
        INSERT INTO hero_follow_counts (hero_slug, count)
        VALUES (${heroSlug}, 1)
        ON CONFLICT (hero_slug) DO UPDATE
        SET count = hero_follow_counts.count + 1, updated_at = NOW()
      `;
    }

    return { following };
  } catch (error) {
    console.error('❌ Toggle hero follow error:', error);
    return { following: false };
  }
}

/**
 * ✅ Get single hero follow status
 */
export async function getHeroFollowStatus(heroSlug: string): Promise<boolean> {
  try {
    const userId = 'user-demo-001';

    const [follow] = await sql`
      SELECT id FROM hero_follows
      WHERE user_id = ${userId}
      AND hero_slug = ${heroSlug}
      AND following = true
      LIMIT 1
    `;

    return !!follow;
  } catch (error) {
    console.error('❌ Error getting hero follow status:', error);
    return false;
  }
}

/**
 * ✅ Get single hero follower count
 */
export async function getHeroFollowerCount(heroSlug: string): Promise<number> {
  try {
    const [count] = await sql`
      SELECT count FROM hero_follow_counts
      WHERE hero_slug = ${heroSlug}
      LIMIT 1
    `;

    return count?.count || 0;
  } catch (error) {
    console.error('❌ Error getting hero follower count:', error);
    return 0;
  }
}

/**
 * ✅ Get user's followed heroes
 * Now joins with people table to get latest data
 */
export async function getUserFollowedHeroes() {
  try {
    const userId = 'user-demo-001';

    const follows = await sql`
      SELECT 
        hf.id,
        hf.user_id,
        hf.hero_slug,
        hf.hero_name,
        hf.following,
        hf.created_at,
        hf.updated_at,
        p.name as current_name,
        p.metadata->>'images' as images
      FROM hero_follows hf
      LEFT JOIN people p ON p.slug = hf.hero_slug
      WHERE hf.user_id = ${userId}
      AND hf.following = true
      ORDER BY hf.created_at DESC
    `;

    return follows;
  } catch (error) {
    console.error('❌ Error getting user followed heroes:', error);
    return [];
  }
}

/**
 * ✅ Get multiple heroes follow status at once (for browse page)
 */
export async function getMultipleHeroFollows(heroSlugs: string[]) {
  try {
    const userId = 'user-demo-001';

    if (heroSlugs.length === 0) return {};

    const follows = await sql`
      SELECT hero_slug, following FROM hero_follows
      WHERE user_id = ${userId}
      AND hero_slug = ANY(${heroSlugs}::text[])
    `;

    const result: Record<string, boolean> = {};
    heroSlugs.forEach(slug => {
      const follow = follows.find((f: any) => f.hero_slug === slug);
      result[slug] = follow?.following || false;
    });

    return result;
  } catch (error) {
    console.error('❌ Error getting multiple hero follows:', error);
    const fallback: Record<string, boolean> = {};
    heroSlugs.forEach(slug => {
      fallback[slug] = false;
    });
    return fallback;
  }
}

/**
 * ✅ Get multiple heroes follower counts at once
 */
export async function getMultipleHeroFollowerCounts(heroSlugs: string[]) {
  try {
    if (heroSlugs.length === 0) return {};

    const counts = await sql`
      SELECT hero_slug, count FROM hero_follow_counts
      WHERE hero_slug = ANY(${heroSlugs}::text[])
    `;

    const result: Record<string, number> = {};
    heroSlugs.forEach(slug => {
      const count = counts.find((c: any) => c.hero_slug === slug);
      result[slug] = count?.count || 0;
    });

    return result;
  } catch (error) {
    console.error('❌ Error getting multiple hero follower counts:', error);
    const fallback: Record<string, number> = {};
    heroSlugs.forEach(slug => {
      fallback[slug] = 0;
    });
    return fallback;
  }
}
