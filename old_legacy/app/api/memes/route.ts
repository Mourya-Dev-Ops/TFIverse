import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { memes, memeLikes, memeBookmarks, userProfiles } from '@/lib/schema';
import { eq, desc, sql, and, or } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get('filter') || 'hot';
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const userId = searchParams.get('userId');
    
    const offset = (page - 1) * limit;

    // ✅ Build where conditions array
    const whereConditions: any[] = [eq(memes.status, 'approved')];

    // Add search filter
    if (search) {
      whereConditions.push(
        or(
          sql`LOWER(${memes.title}) LIKE LOWER(${`%${search}%`})`,
          sql`LOWER(${memes.description}) LIKE LOWER(${`%${search}%`})`,
          sql`${search} = ANY(${memes.tags})`,
          sql`${search} = ANY(${memes.heroTags})`
        )!
      );
    }

    // Add tag filter
    if (tag) {
      whereConditions.push(
        sql`${tag} = ANY(${memes.tags}) OR ${tag} = ANY(${memes.heroTags})`
      );
    }

    // ✅ Build query with combined where conditions
    let dbQuery = db
      .select({
        id: memes.id,
        title: memes.title,
        description: memes.description,
        imageUrl: memes.imageUrl,
        tags: memes.tags,
        heroTags: memes.heroTags,
        likes: memes.likes,
        views: memes.views,
        shares: memes.shares,
        downloads: memes.downloads,
        status: memes.status,
        createdAt: memes.createdAt,
        userProfile: {
          username: userProfiles.username,
          avatarUrl: userProfiles.coverImage,
        },
        userHasLiked: userId ? sql<boolean>`EXISTS(
          SELECT 1 FROM ${memeLikes} 
          WHERE ${memeLikes.memeId} = ${memes.id} 
          AND ${memeLikes.userId} = ${userId}
        )` : sql<boolean>`false`,
        userHasBookmarked: userId ? sql<boolean>`EXISTS(
          SELECT 1 FROM ${memeBookmarks} 
          WHERE ${memeBookmarks.memeId} = ${memes.id} 
          AND ${memeBookmarks.userId} = ${userId}
        )` : sql<boolean>`false`,
      })
      .from(memes)
      .leftJoin(userProfiles, eq(memes.userId, userProfiles.userId))
      .where(and(...whereConditions));

    // Apply sorting
    if (filter === 'hot') {
      dbQuery = dbQuery.orderBy(desc(memes.likes), desc(memes.createdAt));
    } else if (filter === 'new') {
      dbQuery = dbQuery.orderBy(desc(memes.createdAt));
    } else if (filter === 'top') {
      dbQuery = dbQuery.orderBy(desc(memes.likes));
    } else if (filter === 'downloaded') {
      dbQuery = dbQuery.orderBy(desc(memes.downloads));
    } else if (filter === 'shared') {
      dbQuery = dbQuery.orderBy(desc(memes.shares));
    }

    // Apply pagination
    const results = await dbQuery.limit(limit).offset(offset);

    // Check if there are more results
    const hasMore = results.length === limit;

    return NextResponse.json({
      memes: results,
      hasMore,
      page,
      limit,
    });
  } catch (error) {
    console.error('Failed to fetch memes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch memes' },
      { status: 500 }
    );
  }
}
