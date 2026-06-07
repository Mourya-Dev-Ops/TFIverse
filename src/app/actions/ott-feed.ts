'use server';

import { db } from '@/lib/db';
import { movies, movieOttLinks } from '@/lib/schema';
import { desc, eq, and, isNotNull, ilike, sql, inArray } from 'drizzle-orm';

export interface OttMovie {
  id: number;
  title: string;
  slug: string;
  year: number | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  voteAverage: number | null;
  overview: string | null;
  platforms: { platform: string; type: string; url: string | null }[];
}

// Get movies that were recently added to OTT platforms
export async function getNewOnOtt(options?: {
  platform?: string;
  limit?: number;
  page?: number;
}): Promise<OttMovie[]> {
  const { platform, limit = 30, page = 1 } = options || {};
  const offset = (page - 1) * limit;

  // Get movies that have OTT links, sorted by most recently updated
  let ottQuery = db.select({
    movieId: movieOttLinks.movieId,
    latestUpdate: sql<Date>`MAX(${movieOttLinks.updatedAt})`,
  })
  .from(movieOttLinks)
  .where(
    and(
      eq(movieOttLinks.isAvailable, true),
      eq(movieOttLinks.type, 'subscription'), // Only show subscription (free with plan) movies
      platform && platform !== 'all' ? ilike(movieOttLinks.platform, `%${platform}%`) : undefined,
    )
  )
  .groupBy(movieOttLinks.movieId)
  .orderBy(desc(sql`MAX(${movieOttLinks.updatedAt})`))
  .limit(limit)
  .offset(offset);

  const movieIds = await ottQuery;
  if (movieIds.length === 0) return [];

  const ids = movieIds.map(m => m.movieId);

  // Get movie details
  const movieDetails = await db.select()
    .from(movies)
    .where(inArray(movies.id, ids));

  // Get OTT links for these movies
  const allLinks = await db.select()
    .from(movieOttLinks)
    .where(
      and(
        inArray(movieOttLinks.movieId, ids),
        eq(movieOttLinks.isAvailable, true),
      )
    );

  // Build the response
  const movieMap = new Map(movieDetails.map(m => [m.id, m]));
  const linksMap = new Map<number, typeof allLinks>();
  allLinks.forEach(link => {
    const arr = linksMap.get(link.movieId) || [];
    arr.push(link);
    linksMap.set(link.movieId, arr);
  });

  // Maintain the sort order from the OTT query
  return movieIds.map(({ movieId }) => {
    const movie = movieMap.get(movieId);
    if (!movie) return null;
    const links = linksMap.get(movieId) || [];

    // Deduplicate platforms (keep subscription over rent/buy)
    const platformMap = new Map<string, typeof links[0]>();
    links.forEach(l => {
      if (!platformMap.has(l.platform) || l.type === 'subscription') {
        platformMap.set(l.platform, l);
      }
    });

    return {
      id: movie.id,
      title: movie.title,
      slug: movie.slug,
      year: movie.year,
      posterUrl: movie.posterUrl,
      backdropUrl: movie.backdropUrl,
      voteAverage: movie.voteAverage,
      overview: movie.overview,
      platforms: Array.from(platformMap.values()).map(l => ({
        platform: l.platform,
        type: l.type,
        url: l.url,
      })),
    };
  }).filter(Boolean) as OttMovie[];
}

// Get list of all available platforms
export async function getAvailablePlatforms(): Promise<string[]> {
  const result = await db.selectDistinct({ platform: movieOttLinks.platform })
    .from(movieOttLinks)
    .where(eq(movieOttLinks.isAvailable, true))
    .orderBy(movieOttLinks.platform);
  
  return result.map(r => r.platform);
}
