'use server';

import { db } from '@/lib/db';
import { movies, dailyCollections, districtCollections } from '@/lib/schema';
import { desc, gt, and, isNotNull, eq, sql } from 'drizzle-orm';
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

  let query = db.select({
    id: movies.id,
    title: movies.title,
    slug: movies.slug,
    year: movies.year,
    budget: movies.budget,
    revenue: movies.revenue,
    posterUrl: movies.posterUrl,
    backdropUrl: movies.backdropUrl,
    voteAverage: movies.voteAverage,
    popularity: movies.popularity,
  })
  .from(movies)
  .where(
    and(
      gt(movies.revenue, 0),
      isNotNull(movies.revenue),
      year && year !== 'all' ? eq(movies.year, parseInt(year)) : undefined,
    )
  )
  .orderBy(
    sortBy === 'budget' ? desc(movies.budget) :
    sortBy === 'revenue' ? desc(movies.revenue) :
    desc(movies.revenue)
  )
  .limit(limit);

  const rawMovies = await query;

  let results: BoxOfficeMovie[] = rawMovies.map(m => {
    const { verdict, color, multiplier } = calculateVerdict(m.budget || 0, m.revenue || 0);
    const profitUSD = (m.revenue || 0) - (m.budget || 0);
    const roiPercent = m.budget && m.budget > 0 ? (((m.revenue || 0) - m.budget) / m.budget * 100).toFixed(0) : '-';

    return {
      ...m,
      verdict,
      verdictColor: color,
      multiplier,
      budgetCr: formatToCrores(m.budget),
      revenueCr: formatToCrores(m.revenue),
      profitCr: formatToCrores(profitUSD > 0 ? profitUSD : null),
      roi: roiPercent !== '-' ? `${roiPercent}%` : '-',
    };
  });

  // Sort by ROI if requested
  if (sortBy === 'roi') {
    results.sort((a, b) => {
      const roiA = a.budget && a.revenue ? (a.revenue - a.budget) / a.budget : -999;
      const roiB = b.budget && b.revenue ? (b.revenue - b.budget) / b.budget : -999;
      return roiB - roiA;
    });
  }

  // Sort by verdict tier if requested
  if (sortBy === 'verdict') {
    const verdictOrder: Record<Verdict, number> = {
      'All-Time Blockbuster': 0, 'Blockbuster': 1, 'Super Hit': 2, 'Hit': 3,
      'Above Average': 4, 'Average': 5, 'Below Average': 6, 'Flop': 7, 'Disaster': 8, 'Verdict Pending': 9,
    };
    results.sort((a, b) => verdictOrder[a.verdict] - verdictOrder[b.verdict]);
  }

  return results;
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
    .from(dailyCollections)
    .where(eq(dailyCollections.movieId, movieId))
    .orderBy(dailyCollections.date);
}

// Get district collections for a specific movie
export async function getMovieDistrictCollections(movieId: number) {
  return await db.select()
    .from(districtCollections)
    .where(eq(districtCollections.movieId, movieId))
    .orderBy(desc(districtCollections.totalGross));
}
