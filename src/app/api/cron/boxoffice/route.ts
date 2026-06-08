import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { movies } from '@/lib/schema/content';
import { eq } from 'drizzle-orm';
import { fetchBMSSession } from '@/lib/scraper/bms';
import { cacheLiveSessions, ScrapedShowData } from '@/lib/scraper/redis';
import { aggregateLiveBoxOffice } from '@/lib/scraper/aggregator';

// Define the edge runtime if we are deploying on Vercel
// export const runtime = 'edge'; 

export async function GET(request: Request) {
    try {
        // Validate Cron Secret to prevent unauthorized scraping triggers
        const authHeader = request.headers.get('authorization');
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        console.log('[Cron] Starting Master Scraper Cycle...');
        
        // 1. Get active movies (For this prototype, we'll just grab the most recent one)
        // In reality, this would filter by 'is_tracking = true'
        const activeMovies = await db.query.movies.findMany({
            limit: 3,
            orderBy: (movies, { desc }) => [desc(movies.id)]
        });

        if (activeMovies.length === 0) {
            return NextResponse.json({ status: 'No active movies to track' });
        }

        const dateStr = new Date().toISOString().split('T')[0];
        let totalSessionsScraped = 0;

        // 2. Loop through active movies
        for (const movie of activeMovies) {
            console.log(`[Cron] Tracking Movie: ${movie.title} (ID: ${movie.id})`);
            
            const sessionsToCache: ScrapedShowData[] = [];

            // 3. Simulate hitting worker queues for various theaters (e.g., hitting 50 shows)
            // In a real architecture, we would queue these jobs to avoid timeout
            for (let i = 0; i < 50; i++) {
                const bmsShowId = `SHOW_${Math.random().toString(36).substring(7)}`;
                const session = await fetchBMSSession(bmsShowId, movie.id, dateStr);
                if (session) {
                    sessionsToCache.push(session);
                }
            }

            // 4. Push to Redis Fast-Cache
            if (sessionsToCache.length > 0) {
                const cacheSuccess = await cacheLiveSessions(sessionsToCache);
                if (cacheSuccess) {
                    totalSessionsScraped += sessionsToCache.length;
                    console.log(`[Cron] Cached ${sessionsToCache.length} live sessions to Redis for ${movie.title}`);
                    
                    // 5. Trigger the Aggregator to flush Redis into PostgreSQL
                    // Ideally, this runs as a separate 30-min cron, but we can trigger it here for the prototype
                    await aggregateLiveBoxOffice(movie.id, dateStr);
                }
            }
        }

        return NextResponse.json({ 
            success: true, 
            message: `Scrape cycle complete. Processed ${totalSessionsScraped} sessions across ${activeMovies.length} movies.`,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('[Cron Error]:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
