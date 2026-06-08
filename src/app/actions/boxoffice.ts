'use server';

import { db } from '@/lib/db';
import { movies } from '@/lib/schema/content';
import { realtimeSessions, hourlyTrendingLogs } from '@/lib/schema/tracking';
import { eq, desc, sum, sql, and, count, gt } from 'drizzle-orm';

export async function getLiveBoxOfficeSummary(source?: 'BMS' | 'PAYTM' | 'ALL') {
    try {
        const filterSource = source && source !== 'ALL' ? source : undefined;

        // Get all movies currently being tracked (last 24 hours)
        const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Find the top movie by gross (most active)
        const topMovieQuery = db.select({
            movieId: realtimeSessions.movieId,
            totalGross: sum(realtimeSessions.grossRevenue).mapWith(Number),
        })
        .from(realtimeSessions)
        .$dynamic();

        const conditions = [gt(realtimeSessions.lastUpdated, cutoff)];
        if (filterSource) conditions.push(eq(realtimeSessions.source, filterSource));

        const topMovies = await topMovieQuery
            .where(and(...conditions))
            .groupBy(realtimeSessions.movieId)
            .orderBy(desc(sum(realtimeSessions.grossRevenue)))
            .limit(10);

        if (topMovies.length === 0) {
            // Fallback: get the most recently tracked movie regardless of time
            const latestSession = await db.query.realtimeSessions.findFirst({
                orderBy: [desc(realtimeSessions.lastUpdated)],
            });
            if (!latestSession) return null;
            topMovies.push({ movieId: latestSession.movieId, totalGross: 0 });
        }

        const primaryMovieId = topMovies[0].movieId;

        const movie = await db.query.movies.findFirst({
            where: eq(movies.id, primaryMovieId),
        });

        if (!movie) return null;

        // Build session filter
        const sessionConditions = [eq(realtimeSessions.movieId, primaryMovieId)];
        if (filterSource) sessionConditions.push(eq(realtimeSessions.source, filterSource));

        // Get aggregate totals
        const aggregate = await db.select({
            totalGross: sum(realtimeSessions.grossRevenue).mapWith(Number),
            totalSold: sum(realtimeSessions.soldSeats).mapWith(Number),
            totalSeats: sum(realtimeSessions.totalSeats).mapWith(Number),
            showsCount: count(),
        })
        .from(realtimeSessions)
        .where(and(...sessionConditions));

        const stats = aggregate[0];

        // Calculate FF / HF / AV counts
        // HF = House Full: availableSeats === 0
        // FF = Fast Filling: availableSeats > 0 && availableSeats/totalSeats < 0.10
        // AV = Available: everything else
        const statusCounts = await db.select({
            hfCount: sql<number>`count(*) filter (where ${realtimeSessions.availableSeats} = 0)`.mapWith(Number),
            ffCount: sql<number>`count(*) filter (where ${realtimeSessions.availableSeats} > 0 and cast(${realtimeSessions.availableSeats} as float) / nullif(cast(${realtimeSessions.totalSeats} as float), 0) < 0.10)`.mapWith(Number),
            avCount: sql<number>`count(*) filter (where cast(${realtimeSessions.availableSeats} as float) / nullif(cast(${realtimeSessions.totalSeats} as float), 0) >= 0.10)`.mapWith(Number),
        })
        .from(realtimeSessions)
        .where(and(...sessionConditions));

        // Fetch hourly trends
        const trends = await db.query.hourlyTrendingLogs.findMany({
            where: eq(hourlyTrendingLogs.movieId, primaryMovieId),
            orderBy: [desc(hourlyTrendingLogs.timestamp)],
            limit: 24,
        });

        // City-wise split
        const citySplit = await db.select({
            city: realtimeSessions.city,
            gross: sum(realtimeSessions.grossRevenue).mapWith(Number),
            sold: sum(realtimeSessions.soldSeats).mapWith(Number),
            totalSeats: sum(realtimeSessions.totalSeats).mapWith(Number),
            shows: count(),
        })
        .from(realtimeSessions)
        .where(and(...sessionConditions))
        .groupBy(realtimeSessions.city)
        .orderBy(desc(sum(realtimeSessions.grossRevenue)));

        // State → City → Chain tree breakdown
        const stateBreakdown = await db.select({
            state: realtimeSessions.state,
            city: realtimeSessions.city,
            chain: realtimeSessions.chainName,
            gross: sum(realtimeSessions.grossRevenue).mapWith(Number),
            sold: sum(realtimeSessions.soldSeats).mapWith(Number),
            totalSeats: sum(realtimeSessions.totalSeats).mapWith(Number),
            shows: count(),
            hfCount: sql<number>`count(*) filter (where ${realtimeSessions.availableSeats} = 0)`.mapWith(Number),
            ffCount: sql<number>`count(*) filter (where ${realtimeSessions.availableSeats} > 0 and cast(${realtimeSessions.availableSeats} as float) / nullif(cast(${realtimeSessions.totalSeats} as float), 0) < 0.10)`.mapWith(Number),
        })
        .from(realtimeSessions)
        .where(and(...sessionConditions))
        .groupBy(realtimeSessions.state, realtimeSessions.city, realtimeSessions.chainName)
        .orderBy(desc(sum(realtimeSessions.grossRevenue)));

        // Source breakdown (BMS vs PAYTM counts)
        const sourceSplit = await db.select({
            source: realtimeSessions.source,
            showCount: count(),
            gross: sum(realtimeSessions.grossRevenue).mapWith(Number),
        })
        .from(realtimeSessions)
        .where(eq(realtimeSessions.movieId, primaryMovieId))
        .groupBy(realtimeSessions.source);

        // Top tracked movies list (for movie selector)
        const trackedMoviesList = [];
        for (const tm of topMovies.slice(0, 10)) {
            const m = await db.query.movies.findFirst({ where: eq(movies.id, tm.movieId) });
            if (m) {
                trackedMoviesList.push({
                    id: m.id,
                    title: m.title,
                    posterPath: m.posterUrl,
                    gross: tm.totalGross,
                });
            }
        }

        return {
            movie,
            stats: {
                totalGross: stats.totalGross || 0,
                totalSold: stats.totalSold || 0,
                totalSeats: stats.totalSeats || 0,
                showsCount: stats.showsCount || 0,
            },
            statusCounts: statusCounts[0] || { hfCount: 0, ffCount: 0, avCount: 0 },
            trends: trends.reverse(),
            citySplit,
            stateBreakdown,
            sourceSplit,
            trackedMovies: trackedMoviesList,
            lastUpdated: new Date(),
        };

    } catch (error) {
        console.error('Failed to fetch Box Office data:', error);
        return null;
    }
}

// ============================================================================
// HUB LANDING PAGE DATA
// ============================================================================
export async function getBoxOfficeHubData() {
    try {
        // 1. Top movies by gross revenue
        const topMoviesRaw = await db.select({
            movieId: realtimeSessions.movieId,
            totalGross: sum(realtimeSessions.grossRevenue).mapWith(Number),
            totalSold: sum(realtimeSessions.soldSeats).mapWith(Number),
            totalSeats: sum(realtimeSessions.totalSeats).mapWith(Number),
            showsCount: count(),
            uniqueVenues: sql<number>`count(distinct ${realtimeSessions.venueName})`.mapWith(Number),
            uniqueCities: sql<number>`count(distinct ${realtimeSessions.city})`.mapWith(Number),
            uniqueStates: sql<number>`count(distinct ${realtimeSessions.state})`.mapWith(Number),
        })
        .from(realtimeSessions)
        .groupBy(realtimeSessions.movieId)
        .orderBy(desc(sum(realtimeSessions.grossRevenue)))
        .limit(20);

        // Enrich with movie details
        const topMovies = [];
        for (const tm of topMoviesRaw) {
            const movie = await db.query.movies.findFirst({
                where: eq(movies.id, tm.movieId),
            });
            if (movie) {
                const occupancy = tm.totalSeats > 0 ? (tm.totalSold / tm.totalSeats) * 100 : 0;
                topMovies.push({
                    id: movie.id,
                    title: movie.title,
                    slug: movie.slug,
                    posterUrl: movie.posterUrl,
                    backdropUrl: movie.backdropUrl,
                    totalGross: tm.totalGross,
                    totalSold: tm.totalSold,
                    showsCount: tm.showsCount,
                    venues: tm.uniqueVenues,
                    cities: tm.uniqueCities,
                    states: tm.uniqueStates,
                    occupancy: Number(occupancy.toFixed(1)),
                });
            }
        }

        // 2. Trending theaters (highest occupancy right now)
        const trendingTheaters = await db.select({
            venueName: realtimeSessions.venueName,
            city: realtimeSessions.city,
            state: realtimeSessions.state,
            chainName: realtimeSessions.chainName,
            totalSeats: sum(realtimeSessions.totalSeats).mapWith(Number),
            soldSeats: sum(realtimeSessions.soldSeats).mapWith(Number),
            shows: count(),
        })
        .from(realtimeSessions)
        .groupBy(realtimeSessions.venueName, realtimeSessions.city, realtimeSessions.state, realtimeSessions.chainName)
        .having(sql`sum(${realtimeSessions.totalSeats}) > 0`)
        .orderBy(desc(sql`cast(sum(${realtimeSessions.soldSeats}) as float) / nullif(cast(sum(${realtimeSessions.totalSeats}) as float), 0)`))
        .limit(10);

        // 3. Overall system stats
        const systemStats = await db.select({
            totalMovies: sql<number>`count(distinct ${realtimeSessions.movieId})`.mapWith(Number),
            totalVenues: sql<number>`count(distinct ${realtimeSessions.venueName})`.mapWith(Number),
            totalSessions: count(),
            totalCities: sql<number>`count(distinct ${realtimeSessions.city})`.mapWith(Number),
            totalStates: sql<number>`count(distinct ${realtimeSessions.state})`.mapWith(Number),
            totalGross: sum(realtimeSessions.grossRevenue).mapWith(Number),
            totalSold: sum(realtimeSessions.soldSeats).mapWith(Number),
        })
        .from(realtimeSessions);

        // 4. Last updated time
        const lastUpdate = await db.select({
            latest: sql<Date>`max(${realtimeSessions.lastUpdated})`,
        })
        .from(realtimeSessions);

        return {
            topMovies,
            trendingTheaters: trendingTheaters.map(t => ({
                ...t,
                occupancy: t.totalSeats > 0 ? Number(((t.soldSeats / t.totalSeats) * 100).toFixed(1)) : 0,
            })),
            systemStats: systemStats[0] || {
                totalMovies: 0, totalVenues: 0, totalSessions: 0,
                totalCities: 0, totalStates: 0, totalGross: 0, totalSold: 0,
            },
            lastUpdated: lastUpdate[0]?.latest || new Date(),
        };
    } catch (error) {
        console.error('Failed to fetch Hub data:', error);
        return null;
    }
}

export async function getMovieBoxOfficeDetails(movieId: number, source?: 'BMS' | 'PAYTM' | 'ALL') {
    try {
        const filterSource = source && source !== 'ALL' ? source : undefined;

        const movie = await db.query.movies.findFirst({
            where: eq(movies.id, movieId),
        });

        if (!movie) return null;

        // Build session filter
        const sessionConditions = [eq(realtimeSessions.movieId, movieId)];
        if (filterSource) sessionConditions.push(eq(realtimeSessions.source, filterSource));

        // Get aggregate totals
        const aggregate = await db.select({
            totalGross: sum(realtimeSessions.grossRevenue).mapWith(Number),
            totalSold: sum(realtimeSessions.soldSeats).mapWith(Number),
            totalSeats: sum(realtimeSessions.totalSeats).mapWith(Number),
            showsCount: count(),
        })
        .from(realtimeSessions)
        .where(and(...sessionConditions));

        const stats = aggregate[0];

        // Calculate FF / HF / AV counts
        const statusCounts = await db.select({
            hfCount: sql<number>`count(*) filter (where ${realtimeSessions.availableSeats} = 0)`.mapWith(Number),
            ffCount: sql<number>`count(*) filter (where ${realtimeSessions.availableSeats} > 0 and cast(${realtimeSessions.availableSeats} as float) / nullif(cast(${realtimeSessions.totalSeats} as float), 0) < 0.10)`.mapWith(Number),
            avCount: sql<number>`count(*) filter (where cast(${realtimeSessions.availableSeats} as float) / nullif(cast(${realtimeSessions.totalSeats} as float), 0) >= 0.10)`.mapWith(Number),
        })
        .from(realtimeSessions)
        .where(and(...sessionConditions));

        // Fetch hourly trends
        const trends = await db.query.hourlyTrendingLogs.findMany({
            where: eq(hourlyTrendingLogs.movieId, movieId),
            orderBy: [desc(hourlyTrendingLogs.timestamp)],
            limit: 24,
        });

        // City-wise split
        const citySplit = await db.select({
            city: realtimeSessions.city,
            gross: sum(realtimeSessions.grossRevenue).mapWith(Number),
            sold: sum(realtimeSessions.soldSeats).mapWith(Number),
            totalSeats: sum(realtimeSessions.totalSeats).mapWith(Number),
            shows: count(),
        })
        .from(realtimeSessions)
        .where(and(...sessionConditions))
        .groupBy(realtimeSessions.city)
        .orderBy(desc(sum(realtimeSessions.grossRevenue)));

        // State → City → Chain tree breakdown
        const stateBreakdown = await db.select({
            state: realtimeSessions.state,
            city: realtimeSessions.city,
            chain: realtimeSessions.chainName,
            gross: sum(realtimeSessions.grossRevenue).mapWith(Number),
            sold: sum(realtimeSessions.soldSeats).mapWith(Number),
            totalSeats: sum(realtimeSessions.totalSeats).mapWith(Number),
            shows: count(),
            hfCount: sql<number>`count(*) filter (where ${realtimeSessions.availableSeats} = 0)`.mapWith(Number),
            ffCount: sql<number>`count(*) filter (where ${realtimeSessions.availableSeats} > 0 and cast(${realtimeSessions.availableSeats} as float) / nullif(cast(${realtimeSessions.totalSeats} as float), 0) < 0.10)`.mapWith(Number),
        })
        .from(realtimeSessions)
        .where(and(...sessionConditions))
        .groupBy(realtimeSessions.state, realtimeSessions.city, realtimeSessions.chainName)
        .orderBy(desc(sum(realtimeSessions.grossRevenue)));

        // Source breakdown (BMS vs PAYTM counts)
        const sourceSplit = await db.select({
            source: realtimeSessions.source,
            showCount: count(),
            gross: sum(realtimeSessions.grossRevenue).mapWith(Number),
        })
        .from(realtimeSessions)
        .where(eq(realtimeSessions.movieId, movieId))
        .groupBy(realtimeSessions.source);

        // Live Venues (Top 100 by gross)
        const liveVenues = await db.select({
            venueName: realtimeSessions.venueName,
            city: realtimeSessions.city,
            state: realtimeSessions.state,
            chainName: realtimeSessions.chainName,
            totalSeats: sum(realtimeSessions.totalSeats).mapWith(Number),
            soldSeats: sum(realtimeSessions.soldSeats).mapWith(Number),
            gross: sum(realtimeSessions.grossRevenue).mapWith(Number),
            shows: count(),
        })
        .from(realtimeSessions)
        .where(and(...sessionConditions))
        .groupBy(realtimeSessions.venueName, realtimeSessions.city, realtimeSessions.state, realtimeSessions.chainName)
        .orderBy(desc(sum(realtimeSessions.grossRevenue)))
        .limit(100);

        return {
            movie,
            stats: {
                totalGross: stats.totalGross || 0,
                totalSold: stats.totalSold || 0,
                totalSeats: stats.totalSeats || 0,
                showsCount: stats.showsCount || 0,
            },
            statusCounts: statusCounts[0] || { hfCount: 0, ffCount: 0, avCount: 0 },
            trends: trends.reverse(),
            citySplit,
            stateBreakdown,
            sourceSplit,
            liveVenues,
            lastUpdated: new Date(),
        };

    } catch (error) {
        console.error(`Failed to fetch Box Office data for movie ${movieId}:`, error);
        return null;
    }
}

