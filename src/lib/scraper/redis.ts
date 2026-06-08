import { Redis } from '@upstash/redis';

// Initialize Redis client
// Note: In development without UPSTASH env vars, we might want to mock this or provide a fallback
const getRedisClient = () => {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
        console.warn('⚠️ UPSTASH_REDIS_REST_URL or TOKEN is missing. Live Box Office caching will not work correctly.');
        return null;
    }
    
    return new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
};

export const redisClient = getRedisClient();

export interface ScrapedShowData {
    movieId: number;
    sessionId: string;
    venueName: string;
    chainName: string;
    city: string;
    state: string;
    showDate: string; // YYYY-MM-DD
    showTime: string;
    audi: string;
    totalSeats: number;
    availableSeats: number;
    soldSeats: number;
    grossRevenue: number;
    source: 'BMS' | 'PAYTM';
    timestamp: number;
}

const LIVE_PREFIX = 'tfiverse:live:';

export async function cacheLiveSessions(sessions: ScrapedShowData[]) {
    if (!redisClient) return false;
    if (sessions.length === 0) return true;

    try {
        const pipeline = redisClient.pipeline();
        
        for (const session of sessions) {
            const key = `${LIVE_PREFIX}${session.movieId}:${session.sessionId}`;
            // Store session data, expire after 24 hours to keep cache clean
            pipeline.set(key, JSON.stringify(session), { ex: 86400 });
        }
        
        await pipeline.exec();
        return true;
    } catch (error) {
        console.error('Redis cache error:', error);
        return false;
    }
}

export async function getLiveSessions(movieId: number): Promise<ScrapedShowData[]> {
    if (!redisClient) return [];
    
    try {
        const pattern = `${LIVE_PREFIX}${movieId}:*`;
        let cursor = 0;
        const keys: string[] = [];
        
        // Use scan to get all keys for this movie safely without blocking
        do {
            const [nextCursor, matchingKeys] = await redisClient.scan(cursor, { match: pattern, count: 100 });
            cursor = nextCursor === '0' ? 0 : Number(nextCursor);
            keys.push(...matchingKeys);
        } while (cursor !== 0);
        
        if (keys.length === 0) return [];
        
        // MGET is faster for retrieving multiple keys
        const rawSessions = await redisClient.mget<ScrapedShowData[]>(...keys);
        
        // Filter out nulls and parse (Upstash MGET usually returns parsed JSON if set as object, or string)
        return rawSessions.filter((s): s is ScrapedShowData => s !== null);
    } catch (error) {
        console.error('Redis fetch error:', error);
        return [];
    }
}

export async function clearLiveSessions(movieId: number) {
    if (!redisClient) return;
    
    try {
        const pattern = `${LIVE_PREFIX}${movieId}:*`;
        let cursor = 0;
        
        do {
            const [nextCursor, matchingKeys] = await redisClient.scan(cursor, { match: pattern, count: 100 });
            cursor = nextCursor === '0' ? 0 : Number(nextCursor);
            if (matchingKeys.length > 0) {
                await redisClient.del(...matchingKeys);
            }
        } while (cursor !== 0);
    } catch (error) {
        console.error('Redis clear error:', error);
    }
}
