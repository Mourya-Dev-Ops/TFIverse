'use server';

import { db } from '@/lib/db';
import { movies, realtimeSessions, hourlyTrendingLogs } from '@/lib/schema';
import { eq, desc, sum, sql } from 'drizzle-orm';

export async function getLiveBoxOfficeSummary() {
    try {
        // Fetch the most recently tracked movie
        const latestSession = await db.query.realtimeSessions.findFirst({
            orderBy: [desc(realtimeSessions.lastUpdated)],
        });

        if (!latestSession) return null;

        const movie = await db.query.movies.findFirst({
            where: eq(movies.id, latestSession.movieId),
        });

        if (!movie) return null;

        // Get aggregate totals
        const aggregate = await db.select({
            totalGross: sum(realtimeSessions.grossRevenue),
            totalSold: sum(realtimeSessions.soldSeats),
            totalSeats: sum(realtimeSessions.totalSeats),
            showsCount: sql`count(*)`,
        })
        .from(realtimeSessions)
        .where(eq(realtimeSessions.movieId, movie.id));

        const stats = aggregate[0];
        
        // Fetch hourly trends
        const trends = await db.query.hourlyTrendingLogs.findMany({
            where: eq(hourlyTrendingLogs.movieId, movie.id),
            orderBy: [desc(hourlyTrendingLogs.timestamp)],
            limit: 12,
        });

        // City-wise split
        const citySplit = await db.select({
            city: realtimeSessions.city,
            gross: sum(realtimeSessions.grossRevenue),
            occupancy: sql`avg(cast(${realtimeSessions.soldSeats} as float) / cast(${realtimeSessions.totalSeats} as float) * 100)`,
        })
        .from(realtimeSessions)
        .where(eq(realtimeSessions.movieId, movie.id))
        .groupBy(realtimeSessions.city)
        .orderBy(desc(sum(realtimeSessions.grossRevenue)));

        return {
            movie,
            stats: {
                totalGross: stats.totalGross ? Number(stats.totalGross) : 0,
                totalSold: stats.totalSold ? Number(stats.totalSold) : 0,
                totalSeats: stats.totalSeats ? Number(stats.totalSeats) : 0,
                showsCount: stats.showsCount ? Number(stats.showsCount) : 0,
            },
            trends: trends.reverse(), // chronologically for charts
            citySplit,
            lastUpdated: latestSession.lastUpdated,
        };

    } catch (error) {
        console.error('Failed to fetch Box Office data:', error);
        return null;
    }
}
