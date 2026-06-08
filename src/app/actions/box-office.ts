'use server';

import { db } from '@/lib/db';
import { movies, dailyBoxOffice, regionalBoxOffice, realtimeSessions } from '@/lib/schema';
import { desc, gt, and, isNotNull, eq, sql, sum, inArray } from 'drizzle-orm';
import { calculateVerdict, formatToCrores, type Verdict, type VerdictColor } from '@/lib/verdict-engine';

// ============================================================================
// DATA FETCHERS
// ============================================================================

export interface BoxOfficeMovie {
  id: number;
  title: string;
  slug: string;
  year: number | null;
  budget: number | null;
  revenue: number | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  voteAverage: number | null;
  popularity: number | null;
  verdict: Verdict;
  verdictColor: VerdictColor;
  multiplier: string;
  budgetCr: string;
  revenueCr: string;
  profitCr: string;
  roi: string;
}



export async function getBoxOfficeData(options?: {
  year?: string;
  sortBy?: 'revenue' | 'budget' | 'roi' | 'verdict';
  limit?: number;
}): Promise<BoxOfficeMovie[]> {
  const { year, sortBy = 'revenue', limit = 50 } = options || {};

  // 1. Get tracked grosses from daily_box_office
  const dailyGrosses = await db.select({
      movieId: dailyBoxOffice.movieId,
      gross: sum(dailyBoxOffice.gross).mapWith(Number)
  }).from(dailyBoxOffice).groupBy(dailyBoxOffice.movieId);

  // 2. Get tracked grosses from realtime_sessions
  const realtimeGrosses = await db.select({
      movieId: realtimeSessions.movieId,
      gross: sum(realtimeSessions.grossRevenue).mapWith(Number)
  }).from(realtimeSessions).groupBy(realtimeSessions.movieId);

  // Combine them into a Map
  const trackedGrossMap = new Map<number, number>();
  for (const dg of dailyGrosses) {
      trackedGrossMap.set(dg.movieId, dg.gross);
  }
  for (const rg of realtimeGrosses) {
      const existing = trackedGrossMap.get(rg.movieId) || 0;
      trackedGrossMap.set(rg.movieId, existing + rg.gross);
  }

  const trackedMovieIds = Array.from(trackedGrossMap.keys());
  if (trackedMovieIds.length === 0) return [];

  // 3. Fetch the actual movies
  let query = db.select({
    id: movies.id,
    title: movies.title,
    slug: movies.slug,
    year: movies.year,
    budget: movies.budget,
    revenue: movies.revenue, // We will overwrite this
    posterUrl: movies.posterUrl,
    backdropUrl: movies.backdropUrl,
    voteAverage: movies.voteAverage,
    popularity: movies.popularity,
  })
  .from(movies)
  .where(
    and(
      inArray(movies.id, trackedMovieIds),
      year && year !== 'all' ? eq(movies.year, parseInt(year)) : undefined,
    )
  );

  const rawMovies = await query;

  // 4. Map and apply actual tracked revenues
  let results: BoxOfficeMovie[] = rawMovies.map(m => {
    // CRITICAL: Overwrite the TMDB revenue with our tracked revenue!
    // (If TMDB revenue exists and is somehow higher, we could use Math.max, but user explicitly wants our tracked data)
    const trackedRevenueUSD = (trackedGrossMap.get(m.id) || 0) / 84; // Convert INR to approximate USD for calculation if budget is in USD
    // Wait, the verdict engine uses raw numbers. The user's system stores gross in INR, but the TMDB budget is in USD.
    // The previous verdict engine logic was comparing m.budget (USD) to m.revenue (USD).
    // Let's assume the calculateVerdict takes budget and revenue in the same currency.
    // TMDB budget is in USD. Our tracked gross is in INR.
    // Let's convert our INR tracked gross to USD for verdict calculation, or convert budget to INR.
    // For now, calculateVerdict does (revenue/budget). It doesn't matter as long as they are same currency.
    // Let's convert tracked INR to USD (divide by 84) to compare with TMDB budget in USD.
    const actualRevenueUSD = (trackedGrossMap.get(m.id) || 0) / 84;
    const finalRevenue = actualRevenueUSD > 0 ? actualRevenueUSD : (m.revenue || 0);

    const { verdict, color, multiplier } = calculateVerdict(m.budget || 0, finalRevenue);
    const profitUSD = finalRevenue - (m.budget || 0);
    const roiPercent = m.budget && m.budget > 0 ? ((finalRevenue - m.budget) / m.budget * 100).toFixed(0) : '-';

    return {
      ...m,
      revenue: finalRevenue,
      verdict,
      verdictColor: color,
      multiplier,
      budgetCr: formatToCrores(m.budget),
      revenueCr: formatToCrores(finalRevenue),
      profitCr: formatToCrores(profitUSD > 0 ? profitUSD : null),
      roi: roiPercent !== '-' ? `${roiPercent}%` : '-',
    };
  });

  // 5. Sort in Javascript
  if (sortBy === 'revenue') {
    results.sort((a, b) => (b.revenue || 0) - (a.revenue || 0));
  } else if (sortBy === 'budget') {
    results.sort((a, b) => (b.budget || 0) - (a.budget || 0));
  } else if (sortBy === 'roi') {
    results.sort((a, b) => {
      const roiA = a.budget && a.revenue ? (a.revenue - a.budget) / a.budget : -999;
      const roiB = b.budget && b.revenue ? (b.revenue - b.budget) / b.budget : -999;
      return roiB - roiA;
    });
  } else if (sortBy === 'verdict') {
    const verdictOrder: Record<Verdict, number> = {
      'All-Time Blockbuster': 0, 'Blockbuster': 1, 'Super Hit': 2, 'Hit': 3,
      'Above Average': 4, 'Average': 5, 'Below Average': 6, 'Flop': 7, 'Disaster': 8, 'Verdict Pending': 9,
    };
    results.sort((a, b) => verdictOrder[a.verdict] - verdictOrder[b.verdict]);
  }

  // 6. Limit
  return results.slice(0, limit);
}

// Get available years for the filter
export async function getAvailableYears(): Promise<number[]> {
  const result = await db.selectDistinct({ year: movies.year })
    .from(movies)
    .where(and(gt(movies.revenue, 0), isNotNull(movies.year)))
    .orderBy(desc(movies.year));

  return result.map(r => r.year!).filter(Boolean);
}

// Get aggregate stats
export async function getBoxOfficeStats() {
  const result = await db.select({
    totalMovies: sql<number>`count(*)`,
    totalRevenue: sql<number>`sum(${movies.revenue})`,
    avgRating: sql<number>`avg(${movies.voteAverage})`,
    topYear: sql<number>`(SELECT year FROM movies WHERE revenue > 0 GROUP BY year ORDER BY sum(revenue) DESC LIMIT 1)`,
  })
  .from(movies)
  .where(and(gt(movies.revenue, 0), isNotNull(movies.revenue)));

  const stats = result[0];
  return {
    totalMovies: Number(stats.totalMovies) || 0,
    totalRevenue: formatToCrores(Number(stats.totalRevenue) || 0),
    avgRating: Number(stats.avgRating)?.toFixed(1) || '-',
    topYear: Number(stats.topYear) || new Date().getFullYear(),
  };
}

// Get daily collections for a specific movie
export async function getMovieDailyCollections(movieId: number) {
  return await db.select()
    .from(dailyBoxOffice)
    .where(eq(dailyBoxOffice.movieId, movieId))
    .orderBy(dailyBoxOffice.date);
}

// Get district collections for a specific movie
export async function getMovieDistrictCollections(movieId: number) {
  return await db.select()
    .from(regionalBoxOffice)
    .where(eq(regionalBoxOffice.movieId, movieId))
    .orderBy(desc(regionalBoxOffice.gross));
}
