import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

import { db } from '../src/lib/db';
import { movies } from '../src/lib/schema/content';
import { 
    realtimeSessions, 
    dailyBoxOffice, 
    regionalBoxOffice, 
    chainBoxOffice 
} from '../src/lib/schema/tracking';
import { mapCityToTerritory } from '../src/lib/api/box-office/utils';
import { eq, sql, and, lt } from 'drizzle-orm';

/**
 * TFIverse Nightly Aggregation Script
 * ====================================
 * 
 * Purpose: Crushes raw realtime_sessions into permanent aggregate tables.
 * Schedule: Runs at 12:05 AM daily (after midnight squash archives chunks in B2).
 * 
 * What it does:
 * 1. For YESTERDAY's data in realtime_sessions:
 *    - Aggregate into daily_box_office (1 row per movie per day)
 *    - Aggregate into regional_box_office (1 row per movie per day per state)
 *    - Aggregate into chain_box_office (1 row per movie per day per chain)
 * 2. These aggregate tables are PERMANENT (never deleted).
 * 3. Raw sessions are kept for 60 days (configurable).
 */

const PIC_CHAINS = ['PVR', 'INOX', 'CINEPOLIS'];

async function nightlyAggregate() {
    console.log('🌙 Starting Nightly Aggregation...');
    
    // Calculate yesterday's date (IST)
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    
    const dateStr = yesterday.toISOString().split('T')[0];
    console.log(`📅 Aggregating data for: ${dateStr}`);

    // Get all movies that had sessions yesterday
    const movieSessions = await db
        .select({
            movieId: realtimeSessions.movieId,
        })
        .from(realtimeSessions)
        .where(
            and(
                sql`${realtimeSessions.showDate} >= ${yesterday}`,
                sql`${realtimeSessions.showDate} < ${todayStart}`
            )
        )
        .groupBy(realtimeSessions.movieId);

    if (movieSessions.length === 0) {
        console.log('⚠️ No sessions found for yesterday. Nothing to aggregate.');
        process.exit(0);
    }

    console.log(`🎬 Found ${movieSessions.length} movies with sessions yesterday.`);

    for (const { movieId } of movieSessions) {
        if (!movieId) continue;

        // Get movie title for logging
        const movieRow = await db.select({ title: movies.title }).from(movies).where(eq(movies.id, movieId));
        const movieTitle = movieRow[0]?.title || `ID:${movieId}`;
        
        // ════════════════════════════════════════════
        // 1. DAILY BOX OFFICE (1 row per movie)
        // ════════════════════════════════════════════
        const dailyStats = await db
            .select({
                gross: sql`SUM(${realtimeSessions.grossRevenue})`.mapWith(Number),
                sold: sql`SUM(${realtimeSessions.soldSeats})`.mapWith(Number),
                shows: sql`COUNT(${realtimeSessions.id})`.mapWith(Number),
                totalSeats: sql`SUM(${realtimeSessions.totalSeats})`.mapWith(Number),
                venues: sql`COUNT(DISTINCT ${realtimeSessions.venueName})`.mapWith(Number),
                cities: sql`COUNT(DISTINCT ${realtimeSessions.city})`.mapWith(Number),
                states: sql`COUNT(DISTINCT ${realtimeSessions.state})`.mapWith(Number),
                ffCount: sql`SUM(CASE WHEN ${realtimeSessions.totalSeats} > 0 AND CAST(${realtimeSessions.soldSeats} AS FLOAT) / ${realtimeSessions.totalSeats} >= 0.8 AND ${realtimeSessions.availableSeats} > 0 THEN 1 ELSE 0 END)`.mapWith(Number),
                hfCount: sql`SUM(CASE WHEN ${realtimeSessions.availableSeats} = 0 AND ${realtimeSessions.totalSeats} > 0 THEN 1 ELSE 0 END)`.mapWith(Number),
            })
            .from(realtimeSessions)
            .where(
                and(
                    eq(realtimeSessions.movieId, movieId),
                    sql`${realtimeSessions.showDate} >= ${yesterday}`,
                    sql`${realtimeSessions.showDate} < ${todayStart}`
                )
            );

        if (dailyStats[0] && dailyStats[0].shows > 0) {
            const s = dailyStats[0];
            const occupancy = s.totalSeats > 0 ? (s.sold / s.totalSeats) * 100 : 0;
            const atp = s.sold > 0 ? s.gross / s.sold : 0;

            // PIC stats (PVR + INOX + CINEPOLIS)
            const picStats = await db
                .select({
                    gross: sql`SUM(${realtimeSessions.grossRevenue})`.mapWith(Number),
                    sold: sql`SUM(${realtimeSessions.soldSeats})`.mapWith(Number),
                })
                .from(realtimeSessions)
                .where(
                    and(
                        eq(realtimeSessions.movieId, movieId),
                        sql`${realtimeSessions.showDate} >= ${yesterday}`,
                        sql`${realtimeSessions.showDate} < ${todayStart}`,
                        sql`UPPER(${realtimeSessions.chainName}) IN ('PVR', 'INOX', 'CINEPOLIS')`
                    )
                );

            try {
                await db.insert(dailyBoxOffice).values({
                    movieId,
                    date: yesterday,
                    gross: s.gross,
                    nett: s.gross * 0.85, // Approximate nett (after entertainment tax)
                    ticketsSold: s.sold,
                    shows: s.shows,
                    occupancy: Number(occupancy.toFixed(2)),
                    ffCount: s.ffCount,
                    hfCount: s.hfCount,
                    venues: s.venues,
                    screens: s.shows, // Approximate: 1 show = 1 screen slot
                    cities: s.cities,
                    states: s.states,
                    atp: Number(atp.toFixed(2)),
                    picGross: picStats[0]?.gross || 0,
                    picTickets: picStats[0]?.sold || 0,
                    dataState: 'LIVE',
                    dataSource: 'TFI_SCRAPE',
                }).onConflictDoUpdate({
                    target: [dailyBoxOffice.movieId, dailyBoxOffice.date],
                    set: {
                        gross: s.gross,
                        nett: s.gross * 0.85,
                        ticketsSold: s.sold,
                        shows: s.shows,
                        occupancy: Number(occupancy.toFixed(2)),
                        ffCount: s.ffCount,
                        hfCount: s.hfCount,
                        venues: s.venues,
                        screens: s.shows,
                        cities: s.cities,
                        states: s.states,
                        atp: Number(atp.toFixed(2)),
                        picGross: picStats[0]?.gross || 0,
                        picTickets: picStats[0]?.sold || 0,
                        updatedAt: new Date(),
                    }
                });
                console.log(`   ✅ ${movieTitle}: ₹${(s.gross / 10000000).toFixed(2)} Cr | ${s.sold} tickets | ${s.shows} shows | ${occupancy.toFixed(1)}% occ`);
            } catch (err) {
                console.error(`   ❌ Failed to aggregate daily for ${movieTitle}:`, err);
            }
        }

        // ════════════════════════════════════════════
        // 2. REGIONAL BOX OFFICE (1 row per state)
        // ════════════════════════════════════════════
        const stateStats = await db
            .select({
                state: realtimeSessions.state,
                gross: sql`SUM(${realtimeSessions.grossRevenue})`.mapWith(Number),
                sold: sql`SUM(${realtimeSessions.soldSeats})`.mapWith(Number),
                shows: sql`COUNT(${realtimeSessions.id})`.mapWith(Number),
                totalSeats: sql`SUM(${realtimeSessions.totalSeats})`.mapWith(Number),
                ffCount: sql`SUM(CASE WHEN ${realtimeSessions.totalSeats} > 0 AND CAST(${realtimeSessions.soldSeats} AS FLOAT) / ${realtimeSessions.totalSeats} >= 0.8 AND ${realtimeSessions.availableSeats} > 0 THEN 1 ELSE 0 END)`.mapWith(Number),
                hfCount: sql`SUM(CASE WHEN ${realtimeSessions.availableSeats} = 0 AND ${realtimeSessions.totalSeats} > 0 THEN 1 ELSE 0 END)`.mapWith(Number),
            })
            .from(realtimeSessions)
            .where(
                and(
                    eq(realtimeSessions.movieId, movieId),
                    sql`${realtimeSessions.showDate} >= ${yesterday}`,
                    sql`${realtimeSessions.showDate} < ${todayStart}`
                )
            )
            .groupBy(realtimeSessions.state);

        let stateCount = 0;
        for (const row of stateStats) {
            if (!row.state || row.shows === 0) continue;
            const occupancy = row.totalSeats > 0 ? (row.sold / row.totalSeats) * 100 : 0;
            const atp = row.sold > 0 ? row.gross / row.sold : 0;
            const territory = mapCityToTerritory(row.state, row.state);

            try {
                await db.insert(regionalBoxOffice).values({
                    movieId,
                    date: yesterday,
                    state: row.state,
                    city: 'ALL', // State-level summary row
                    shows: row.shows,
                    ffCount: row.ffCount,
                    hfCount: row.hfCount,
                    sold: row.sold,
                    gross: row.gross,
                    occupancy: Number(occupancy.toFixed(2)),
                    atp: Number(atp.toFixed(2)),
                    territory,
                    dataState: 'LIVE',
                    dataSource: 'TFI_SCRAPE',
                }).onConflictDoUpdate({
                    target: [regionalBoxOffice.movieId, regionalBoxOffice.date, regionalBoxOffice.state, regionalBoxOffice.city],
                    set: {
                        shows: row.shows,
                        ffCount: row.ffCount,
                        hfCount: row.hfCount,
                        sold: row.sold,
                        gross: row.gross,
                        occupancy: Number(occupancy.toFixed(2)),
                        atp: Number(atp.toFixed(2)),
                        updatedAt: new Date(),
                    }
                });
                stateCount++;
            } catch (err) {
                console.error(`   ❌ Regional aggregate failed for ${row.state}:`, err);
            }
        }
        console.log(`   📍 ${movieTitle}: ${stateCount} states aggregated`);

        // ════════════════════════════════════════════
        // 3. CHAIN BOX OFFICE (1 row per chain)
        // ════════════════════════════════════════════
        const chainStats = await db
            .select({
                chain: realtimeSessions.chainName,
                gross: sql`SUM(${realtimeSessions.grossRevenue})`.mapWith(Number),
                sold: sql`SUM(${realtimeSessions.soldSeats})`.mapWith(Number),
                shows: sql`COUNT(${realtimeSessions.id})`.mapWith(Number),
                totalSeats: sql`SUM(${realtimeSessions.totalSeats})`.mapWith(Number),
                ffCount: sql`SUM(CASE WHEN ${realtimeSessions.totalSeats} > 0 AND CAST(${realtimeSessions.soldSeats} AS FLOAT) / ${realtimeSessions.totalSeats} >= 0.8 AND ${realtimeSessions.availableSeats} > 0 THEN 1 ELSE 0 END)`.mapWith(Number),
                hfCount: sql`SUM(CASE WHEN ${realtimeSessions.availableSeats} = 0 AND ${realtimeSessions.totalSeats} > 0 THEN 1 ELSE 0 END)`.mapWith(Number),
            })
            .from(realtimeSessions)
            .where(
                and(
                    eq(realtimeSessions.movieId, movieId),
                    sql`${realtimeSessions.showDate} >= ${yesterday}`,
                    sql`${realtimeSessions.showDate} < ${todayStart}`
                )
            )
            .groupBy(realtimeSessions.chainName);

        let chainCount = 0;
        let picGross = 0, picSold = 0, picShows = 0, picTotal = 0, picFF = 0, picHF = 0;

        for (const row of chainStats) {
            const chainName = row.chain || 'INDEPENDENT';
            if (row.shows === 0) continue;
            const occupancy = row.totalSeats > 0 ? (row.sold / row.totalSeats) * 100 : 0;
            const atp = row.sold > 0 ? row.gross / row.sold : 0;

            // Track PIC totals
            if (PIC_CHAINS.includes(chainName.toUpperCase())) {
                picGross += row.gross;
                picSold += row.sold;
                picShows += row.shows;
                picTotal += row.totalSeats;
                picFF += row.ffCount;
                picHF += row.hfCount;
            }

            try {
                await db.insert(chainBoxOffice).values({
                    movieId,
                    date: yesterday,
                    chain: chainName,
                    shows: row.shows,
                    ffCount: row.ffCount,
                    hfCount: row.hfCount,
                    sold: row.sold,
                    gross: row.gross,
                    occupancy: Number(occupancy.toFixed(2)),
                    atp: Number(atp.toFixed(2)),
                    dataState: 'LIVE',
                    dataSource: 'TFI_SCRAPE',
                }).onConflictDoUpdate({
                    target: [chainBoxOffice.movieId, chainBoxOffice.date, chainBoxOffice.chain],
                    set: {
                        shows: row.shows,
                        ffCount: row.ffCount,
                        hfCount: row.hfCount,
                        sold: row.sold,
                        gross: row.gross,
                        occupancy: Number(occupancy.toFixed(2)),
                        atp: Number(atp.toFixed(2)),
                        updatedAt: new Date(),
                    }
                });
                chainCount++;
            } catch (err) {
                console.error(`   ❌ Chain aggregate failed for ${chainName}:`, err);
            }
        }

        // Insert PIC TOTAL row
        if (picShows > 0) {
            const picOcc = picTotal > 0 ? (picSold / picTotal) * 100 : 0;
            const picAtp = picSold > 0 ? picGross / picSold : 0;
            try {
                await db.insert(chainBoxOffice).values({
                    movieId,
                    date: yesterday,
                    chain: 'PIC TOTAL',
                    shows: picShows,
                    ffCount: picFF,
                    hfCount: picHF,
                    sold: picSold,
                    gross: picGross,
                    occupancy: Number(picOcc.toFixed(2)),
                    atp: Number(picAtp.toFixed(2)),
                    dataState: 'LIVE',
                    dataSource: 'TFI_SCRAPE',
                }).onConflictDoUpdate({
                    target: [chainBoxOffice.movieId, chainBoxOffice.date, chainBoxOffice.chain],
                    set: {
                        shows: picShows,
                        ffCount: picFF,
                        hfCount: picHF,
                        sold: picSold,
                        gross: picGross,
                        occupancy: Number(picOcc.toFixed(2)),
                        atp: Number(picAtp.toFixed(2)),
                        updatedAt: new Date(),
                    }
                });
                chainCount++;
            } catch (err) {
                console.error(`   ❌ PIC TOTAL insert failed:`, err);
            }
        }
        console.log(`   🏢 ${movieTitle}: ${chainCount} chains aggregated (PIC: ₹${(picGross / 100000).toFixed(2)}L)`);
    }

    console.log('\n✅ Nightly aggregation complete!');
    console.log(`📊 Aggregated ${movieSessions.length} movies into daily_box_office, regional_box_office, and chain_box_office.`);
    
    process.exit(0);
}

nightlyAggregate().catch(console.error);
