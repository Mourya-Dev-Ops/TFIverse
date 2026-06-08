import { db } from '@/lib/db';
import { dailyBoxOffice, regionalBoxOffice, chainBoxOffice, realtimeSessions } from '@/lib/schema/tracking';
import { getLiveSessions, ScrapedShowData } from './redis';
import { eq, and } from 'drizzle-orm';

// Note: In real life, these mappings would be in the DB. This is a simplified lookup map.
const PIC_CHAINS = ['PVR', 'INOX', 'CINEPOLIS', 'JUSTICKETS']; // Common national multiplex chains

export async function aggregateLiveBoxOffice(movieId: number, dateStr: string) {
    try {
        console.log(`[Aggregator] Starting aggregation for Movie ${movieId} on ${dateStr}`);
        
        // 1. Fetch all raw session data from Redis for this movie
        const sessions = await getLiveSessions(movieId);
        
        if (!sessions || sessions.length === 0) {
            console.log(`[Aggregator] No live sessions found in Redis for Movie ${movieId}. Skipping.`);
            return false;
        }

        // Filter sessions to only those matching the target date
        // Note: some sessions might run past midnight, but we map by the 'showDate'
        const todaySessions = sessions.filter(s => s.showDate === dateStr);

        if (todaySessions.length === 0) {
            console.log(`[Aggregator] No sessions found for date ${dateStr}.`);
            return false;
        }

        console.log(`[Aggregator] Processing ${todaySessions.length} sessions for ${dateStr}...`);

        // 2. Initialize Accumulators
        const regionalMap = new Map<string, any>(); // key: 'State|City'
        const chainMap = new Map<string, any>();    // key: 'Chain'
        let totalGross = 0;
        let totalSold = 0;
        let totalShows = todaySessions.length;
        let totalSeats = 0;
        let globalFF = 0;
        let globalHF = 0;
        let picGross = 0;
        let picTickets = 0;

        const uniqueVenues = new Set<string>();
        const uniqueCities = new Set<string>();
        const uniqueStates = new Set<string>();

        // 3. Process Each Session
        for (const session of todaySessions) {
            const { state, city, chainName, grossRevenue, soldSeats, totalSeats: capacity, availableSeats } = session;
            
            // Basic globals
            totalGross += grossRevenue;
            totalSold += soldSeats;
            totalSeats += capacity;
            uniqueVenues.add(session.venueName);
            uniqueCities.add(city);
            if (state) uniqueStates.add(state);

            // Determine FF / HF status
            // HF = 0 available seats
            // FF = < 10% available seats AND > 0
            const isHF = availableSeats === 0 && capacity > 0;
            const isFF = availableSeats > 0 && availableSeats / capacity <= 0.10;
            
            if (isHF) globalHF++;
            if (isFF) globalFF++;

            // -- Regional Aggregation --
            const safeState = state || 'Unknown';
            const regKey = `${safeState}|${city}`;
            if (!regionalMap.has(regKey)) {
                regionalMap.set(regKey, { state: safeState, city, gross: 0, sold: 0, shows: 0, ffCount: 0, hfCount: 0 });
            }
            const regData = regionalMap.get(regKey);
            regData.gross += grossRevenue;
            regData.sold += soldSeats;
            regData.shows += 1;
            if (isHF) regData.hfCount++;
            if (isFF) regData.ffCount++;

            // -- Chain Aggregation --
            const normalizedChain = (chainName || 'INDEPENDENT').toUpperCase();
            if (!chainMap.has(normalizedChain)) {
                chainMap.set(normalizedChain, { chain: normalizedChain, gross: 0, sold: 0, shows: 0, ffCount: 0, hfCount: 0 });
            }
            const cData = chainMap.get(normalizedChain);
            cData.gross += grossRevenue;
            cData.sold += soldSeats;
            cData.shows += 1;
            if (isHF) cData.hfCount++;
            if (isFF) cData.ffCount++;

            // Check if PIC
            if (PIC_CHAINS.some(pic => normalizedChain.includes(pic))) {
                picGross += grossRevenue;
                picTickets += soldSeats;
            }
        }

        const globalOccupancy = totalSeats > 0 ? (totalSold / totalSeats) * 100 : 0;
        const globalAtp = totalSold > 0 ? totalGross / totalSold : 0;
        const targetDate = new Date(dateStr);

        // 4. Upsert Daily Box Office
        // Using insert...onConflictDoUpdate syntax from Drizzle
        await db.insert(dailyBoxOffice).values({
            movieId,
            date: targetDate,
            gross: totalGross,
            nett: totalGross * 0.82, // Approximation
            ticketsSold: totalSold,
            shows: totalShows,
            occupancy: globalOccupancy,
            ffCount: globalFF,
            hfCount: globalHF,
            venues: uniqueVenues.size,
            screens: uniqueVenues.size, // Approximation if audi not unique
            cities: uniqueCities.size,
            states: uniqueStates.size,
            atp: globalAtp,
            picGross,
            picTickets,
            updatedAt: new Date()
        }).onConflictDoUpdate({
            target: [dailyBoxOffice.movieId, dailyBoxOffice.date],
            set: {
                gross: totalGross, nett: totalGross * 0.82, ticketsSold: totalSold,
                shows: totalShows, occupancy: globalOccupancy, ffCount: globalFF,
                hfCount: globalHF, venues: uniqueVenues.size, screens: uniqueVenues.size,
                cities: uniqueCities.size, states: uniqueStates.size, atp: globalAtp,
                picGross, picTickets, updatedAt: new Date()
            }
        });

        // 5. Upsert Regional Data
        for (const [_, reg] of regionalMap) {
            const regOcc = (reg.sold / (reg.shows * 250)) * 100; // Fake capacity approx for regions since we didn't track totalSeats per region in map
            const regAtp = reg.sold > 0 ? reg.gross / reg.sold : 0;

            await db.insert(regionalBoxOffice).values({
                movieId, date: targetDate, state: reg.state, city: reg.city,
                shows: reg.shows, ffCount: reg.ffCount, hfCount: reg.hfCount,
                sold: reg.sold, gross: reg.gross, occupancy: Math.min(100, regOcc),
                atp: regAtp, updatedAt: new Date()
            }).onConflictDoUpdate({
                target: [regionalBoxOffice.movieId, regionalBoxOffice.date, regionalBoxOffice.state, regionalBoxOffice.city],
                set: {
                    shows: reg.shows, ffCount: reg.ffCount, hfCount: reg.hfCount,
                    sold: reg.sold, gross: reg.gross, occupancy: Math.min(100, regOcc),
                    atp: regAtp, updatedAt: new Date()
                }
            });
        }

        // 6. Upsert Chain Data
        for (const [_, chain] of chainMap) {
            const chainOcc = (chain.sold / (chain.shows * 200)) * 100; 
            const chainAtp = chain.sold > 0 ? chain.gross / chain.sold : 0;

            await db.insert(chainBoxOffice).values({
                movieId, date: targetDate, chain: chain.chain,
                shows: chain.shows, ffCount: chain.ffCount, hfCount: chain.hfCount,
                sold: chain.sold, gross: chain.gross, occupancy: Math.min(100, chainOcc),
                atp: chainAtp, updatedAt: new Date()
            }).onConflictDoUpdate({
                target: [chainBoxOffice.movieId, chainBoxOffice.date, chainBoxOffice.chain],
                set: {
                    shows: chain.shows, ffCount: chain.ffCount, hfCount: chain.hfCount,
                    sold: chain.sold, gross: chain.gross, occupancy: Math.min(100, chainOcc),
                    atp: chainAtp, updatedAt: new Date()
                }
            });
        }

        console.log(`[Aggregator] Successfully aggregated data for Movie ${movieId}`);
        return true;
    } catch (error) {
        console.error(`[Aggregator] Failed to aggregate for movie ${movieId}:`, error);
        return false;
    }
}
