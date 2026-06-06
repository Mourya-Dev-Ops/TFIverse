import { NextResponse } from 'next/server';
import { db } from '@/db';
import { realtimeSessions, hourlyTrendingLogs } from '@/lib/schema/tracking';
import { movies } from '@/lib/schema/content';
import { eq, sql, and, desc } from 'drizzle-orm';

export const revalidate = 60; // Cache this route for 60 seconds

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const movieIdParam = searchParams.get('movieId');
        const sourceParam = searchParams.get('source'); // 'BMS' | 'PAYTM' | 'ALL'
        const chainParam = searchParams.get('chain'); // 'PVR' | 'INOX' | 'Cinepolis'

        // 1. Fetch active movies if no movieId is provided
        let targetMovieId = movieIdParam ? parseInt(movieIdParam) : null;
        
        if (!targetMovieId) {
            // Default: Fetch the first movie that has sessions (trending)
            const topMovie = await db
                .select({ movieId: realtimeSessions.movieId })
                .from(realtimeSessions)
                .groupBy(realtimeSessions.movieId)
                .orderBy(desc(sql`SUM(${realtimeSessions.grossRevenue})`))
                .limit(1);
            
            if (topMovie.length > 0) {
                targetMovieId = topMovie[0].movieId;
            } else {
                return NextResponse.json({ success: true, data: null, message: "No live data available." });
            }
        }

        // 2. Build conditions
        const conditions = [eq(realtimeSessions.movieId, targetMovieId)];
        if (sourceParam && sourceParam !== 'ALL') {
            conditions.push(eq(realtimeSessions.source, sourceParam));
        }
        if (chainParam) {
            conditions.push(eq(realtimeSessions.chainName, chainParam));
        }

        // 3. Aggregate Data (The 14 Pills logic)
        // We aggregate the total gross, total tickets, and occupancy across all sessions for this movie
        const aggregatedStats = await db
            .select({
                totalGross: sql`SUM(${realtimeSessions.grossRevenue})`.mapWith(Number),
                totalSeats: sql`SUM(${realtimeSessions.totalSeats})`.mapWith(Number),
                soldSeats: sql`SUM(${realtimeSessions.soldSeats})`.mapWith(Number),
                totalShows: sql`COUNT(${realtimeSessions.id})`.mapWith(Number),
                housefullShows: sql`COUNT(CASE WHEN ${realtimeSessions.availableSeats} = 0 THEN 1 END)`.mapWith(Number),
                fastFillingShows: sql`COUNT(CASE WHEN ${realtimeSessions.availableSeats} > 0 AND (${realtimeSessions.availableSeats}::float / ${realtimeSessions.totalSeats}::float) <= 0.1 THEN 1 END)`.mapWith(Number),
            })
            .from(realtimeSessions)
            .where(and(...conditions));

        const stats = aggregatedStats[0];
        
        // 4. Group by State -> City (For the Expandable UI Rows)
        const stateCityStats = await db
            .select({
                state: realtimeSessions.state,
                city: realtimeSessions.city,
                gross: sql`SUM(${realtimeSessions.grossRevenue})`.mapWith(Number),
                shows: sql`COUNT(${realtimeSessions.id})`.mapWith(Number),
                sold: sql`SUM(${realtimeSessions.soldSeats})`.mapWith(Number),
                hf: sql`COUNT(CASE WHEN ${realtimeSessions.availableSeats} = 0 THEN 1 END)`.mapWith(Number),
                ff: sql`COUNT(CASE WHEN ${realtimeSessions.availableSeats} > 0 AND (${realtimeSessions.availableSeats}::float / ${realtimeSessions.totalSeats}::float) <= 0.1 THEN 1 END)`.mapWith(Number),
            })
            .from(realtimeSessions)
            .where(and(...conditions))
            .groupBy(realtimeSessions.state, realtimeSessions.city)
            .orderBy(desc(sql`SUM(${realtimeSessions.grossRevenue})`));

        // Format data into a tree structure: State -> Cities
        const statesMap: Record<string, any> = {};
        
        for (const row of stateCityStats) {
            const stateName = row.state || "Unknown State";
            if (!statesMap[stateName]) {
                statesMap[stateName] = {
                    state: stateName,
                    totalGross: 0,
                    totalShows: 0,
                    cities: []
                };
            }
            statesMap[stateName].totalGross += row.gross;
            statesMap[stateName].totalShows += row.shows;
            statesMap[stateName].cities.push(row);
        }

        const formattedStates = Object.values(statesMap).sort((a: any, b: any) => b.totalGross - a.totalGross);

        // 5. Fetch Hourly Trending Logs for the ApexCharts graph
        const trendingLogs = await db
            .select()
            .from(hourlyTrendingLogs)
            .where(eq(hourlyTrendingLogs.movieId, targetMovieId))
            .orderBy(hourlyTrendingLogs.timestamp);

        return NextResponse.json({
            success: true,
            data: {
                movieId: targetMovieId,
                overview: {
                    gross: stats.totalGross || 0,
                    totalSeats: stats.totalSeats || 0,
                    soldSeats: stats.soldSeats || 0,
                    occupancy: stats.totalSeats > 0 ? ((stats.soldSeats / stats.totalSeats) * 100).toFixed(2) : 0,
                    shows: stats.totalShows || 0,
                    housefull: stats.housefullShows || 0,
                    fastFilling: stats.fastFillingShows || 0,
                    atp: stats.soldSeats > 0 ? (stats.totalGross / stats.soldSeats).toFixed(2) : 0
                },
                states: formattedStates,
                hourlyTrending: trendingLogs
            }
        });

    } catch (error) {
        console.error('[API:BoxOffice] Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch live box office data' }, { status: 500 });
    }
}
