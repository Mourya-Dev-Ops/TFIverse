import { db } from '../src/lib/db';
import { dailyBoxOffice, regionalBoxOffice, chainBoxOffice, realtimeSessions } from '../src/lib/schema/tracking';
import { sql, sum } from 'drizzle-orm';
import { count } from 'drizzle-orm';

function chunkArray<T>(array: T[], size: number): T[][] {
    const chunked_arr = [];
    for (let i = 0; i < array.length; i += size) {
        chunked_arr.push(array.slice(i, i + size));
    }
    return chunked_arr;
}

async function runAggregation() {
    console.log('🔄 Starting Box Office Aggregation...');
    const startTime = Date.now();

    try {
        // 1. Aggregating Daily Box Office
        console.log('📊 Aggregating Daily Box Office...');
        const dailyAggregates = await db.select({
            movieId: realtimeSessions.movieId,
            date: realtimeSessions.showDate,
            gross: sum(realtimeSessions.grossRevenue).mapWith(Number),
            sold: sum(realtimeSessions.soldSeats).mapWith(Number),
            totalSeats: sum(realtimeSessions.totalSeats).mapWith(Number),
            shows: count(),
            ffCount: sql<number>`count(*) filter (where ${realtimeSessions.availableSeats} > 0 and cast(${realtimeSessions.availableSeats} as float) / nullif(cast(${realtimeSessions.totalSeats} as float), 0) < 0.10)`.mapWith(Number),
            hfCount: sql<number>`count(*) filter (where ${realtimeSessions.availableSeats} = 0)`.mapWith(Number),
            venues: sql<number>`count(distinct ${realtimeSessions.venueName})`.mapWith(Number),
            cities: sql<number>`count(distinct ${realtimeSessions.city})`.mapWith(Number),
            states: sql<number>`count(distinct ${realtimeSessions.state})`.mapWith(Number),
        })
        .from(realtimeSessions)
        .groupBy(realtimeSessions.movieId, realtimeSessions.showDate);

        if (dailyAggregates.length > 0) {
            const dailyDataToUpsert = dailyAggregates.map(agg => ({
                movieId: agg.movieId,
                date: agg.date,
                gross: agg.gross,
                nett: agg.gross * 0.84, // Approx Nett
                ticketsSold: agg.sold,
                shows: agg.shows,
                occupancy: agg.totalSeats > 0 ? (agg.sold / agg.totalSeats) * 100 : 0,
                ffCount: agg.ffCount,
                hfCount: agg.hfCount,
                venues: agg.venues,
                cities: agg.cities,
                states: agg.states,
                atp: agg.sold > 0 ? agg.gross / agg.sold : 0,
            }));

            const chunks = chunkArray(dailyDataToUpsert, 500);
            for (const chunk of chunks) {
                await db.insert(dailyBoxOffice)
                    .values(chunk)
                    .onConflictDoUpdate({
                        target: [dailyBoxOffice.movieId, dailyBoxOffice.date],
                        set: {
                            gross: sql`EXCLUDED.gross`,
                            nett: sql`EXCLUDED.nett`,
                            ticketsSold: sql`EXCLUDED.tickets_sold`,
                            shows: sql`EXCLUDED.shows`,
                            occupancy: sql`EXCLUDED.occupancy`,
                            ffCount: sql`EXCLUDED.ff_count`,
                            hfCount: sql`EXCLUDED.hf_count`,
                            venues: sql`EXCLUDED.venues`,
                            cities: sql`EXCLUDED.cities`,
                            states: sql`EXCLUDED.states`,
                            atp: sql`EXCLUDED.atp`,
                            updatedAt: new Date(),
                        }
                    });
            }
            console.log(`   ✓ Upserted ${dailyDataToUpsert.length} daily box office records.`);
        }

        // 2. Aggregating Regional Box Office (State + City)
        console.log('🗺️ Aggregating Regional Box Office...');
        const regionalAggregates = await db.select({
            movieId: realtimeSessions.movieId,
            date: realtimeSessions.showDate,
            state: realtimeSessions.state,
            city: realtimeSessions.city,
            gross: sum(realtimeSessions.grossRevenue).mapWith(Number),
            sold: sum(realtimeSessions.soldSeats).mapWith(Number),
            totalSeats: sum(realtimeSessions.totalSeats).mapWith(Number),
            shows: count(),
            ffCount: sql<number>`count(*) filter (where ${realtimeSessions.availableSeats} > 0 and cast(${realtimeSessions.availableSeats} as float) / nullif(cast(${realtimeSessions.totalSeats} as float), 0) < 0.10)`.mapWith(Number),
            hfCount: sql<number>`count(*) filter (where ${realtimeSessions.availableSeats} = 0)`.mapWith(Number),
        })
        .from(realtimeSessions)
        .groupBy(realtimeSessions.movieId, realtimeSessions.showDate, realtimeSessions.state, realtimeSessions.city);

        if (regionalAggregates.length > 0) {
            const regionalDataToUpsert = regionalAggregates.map(agg => ({
                movieId: agg.movieId,
                date: agg.date,
                state: agg.state || 'Unknown',
                city: agg.city || 'Unknown',
                shows: agg.shows,
                ffCount: agg.ffCount,
                hfCount: agg.hfCount,
                sold: agg.sold,
                gross: agg.gross,
                occupancy: agg.totalSeats > 0 ? (agg.sold / agg.totalSeats) * 100 : 0,
                atp: agg.sold > 0 ? agg.gross / agg.sold : 0,
            }));

            const chunks = chunkArray(regionalDataToUpsert, 500);
            for (const chunk of chunks) {
                await db.insert(regionalBoxOffice)
                    .values(chunk)
                    .onConflictDoUpdate({
                        target: [regionalBoxOffice.movieId, regionalBoxOffice.date, regionalBoxOffice.state, regionalBoxOffice.city],
                        set: {
                            shows: sql`EXCLUDED.shows`,
                            ffCount: sql`EXCLUDED.ff_count`,
                            hfCount: sql`EXCLUDED.hf_count`,
                            sold: sql`EXCLUDED.sold`,
                            gross: sql`EXCLUDED.gross`,
                            occupancy: sql`EXCLUDED.occupancy`,
                            atp: sql`EXCLUDED.atp`,
                            updatedAt: new Date(),
                        }
                    });
            }
            console.log(`   ✓ Upserted ${regionalDataToUpsert.length} regional breakdown records.`);
        }

        // 3. Aggregating Chain Box Office
        console.log('🏢 Aggregating Chain Box Office...');
        const chainAggregates = await db.select({
            movieId: realtimeSessions.movieId,
            date: realtimeSessions.showDate,
            chain: realtimeSessions.chainName,
            gross: sum(realtimeSessions.grossRevenue).mapWith(Number),
            sold: sum(realtimeSessions.soldSeats).mapWith(Number),
            totalSeats: sum(realtimeSessions.totalSeats).mapWith(Number),
            shows: count(),
            ffCount: sql<number>`count(*) filter (where ${realtimeSessions.availableSeats} > 0 and cast(${realtimeSessions.availableSeats} as float) / nullif(cast(${realtimeSessions.totalSeats} as float), 0) < 0.10)`.mapWith(Number),
            hfCount: sql<number>`count(*) filter (where ${realtimeSessions.availableSeats} = 0)`.mapWith(Number),
        })
        .from(realtimeSessions)
        .groupBy(realtimeSessions.movieId, realtimeSessions.showDate, realtimeSessions.chainName);

        if (chainAggregates.length > 0) {
            const chainDataToUpsert = chainAggregates.map(agg => ({
                movieId: agg.movieId,
                date: agg.date,
                chain: agg.chain || 'Independent',
                shows: agg.shows,
                ffCount: agg.ffCount,
                hfCount: agg.hfCount,
                sold: agg.sold,
                gross: agg.gross,
                occupancy: agg.totalSeats > 0 ? (agg.sold / agg.totalSeats) * 100 : 0,
                atp: agg.sold > 0 ? agg.gross / agg.sold : 0,
            }));

            const chunks = chunkArray(chainDataToUpsert, 500);
            for (const chunk of chunks) {
                await db.insert(chainBoxOffice)
                    .values(chunk)
                    .onConflictDoUpdate({
                        target: [chainBoxOffice.movieId, chainBoxOffice.date, chainBoxOffice.chain],
                        set: {
                            shows: sql`EXCLUDED.shows`,
                            ffCount: sql`EXCLUDED.ff_count`,
                            hfCount: sql`EXCLUDED.hf_count`,
                            sold: sql`EXCLUDED.sold`,
                            gross: sql`EXCLUDED.gross`,
                            occupancy: sql`EXCLUDED.occupancy`,
                            atp: sql`EXCLUDED.atp`,
                            updatedAt: new Date(),
                        }
                    });
            }
            console.log(`   ✓ Upserted ${chainDataToUpsert.length} chain breakdown records.`);
        }

        const elapsed = (Date.now() - startTime) / 1000;
        console.log(`✅ Aggregation completed successfully in ${elapsed.toFixed(2)}s`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Aggregation Failed:', error);
        process.exit(1);
    }
}

runAggregation();
