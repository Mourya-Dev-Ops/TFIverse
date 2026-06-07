import * as dotenv from 'dotenv';
import path from 'path';

const sleep = (ms: number) => new Promise((resolve) => resolve(setTimeout(resolve, ms)));

async function syncOtt() {
    dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
    
    const { db } = await import('../src/lib/db');
    const { movies, movieOttLinks } = await import('../src/lib/schema');
    const { eq, isNull, sql } = await import('drizzle-orm');

    const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY?.split(',')[0];
    const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

    let rateLimitHits = 0;

    async function tmdbFetch(endpoint: string, params: Record<string, string> = {}): Promise<any> {
        const searchParams = new URLSearchParams({ api_key: TMDB_API_KEY!, ...params });
        const url = `${TMDB_BASE_URL}${endpoint}?${searchParams}`;
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 429) {
                rateLimitHits++;
                const retryAfter = parseInt(response.headers.get('retry-after') || '5');
                console.log(`⚠️ Rate limited (#${rateLimitHits}). Sleeping ${retryAfter}s...`);
                await sleep(retryAfter * 1000);
                return tmdbFetch(endpoint, params);
            }
            throw new Error(`TMDB ${response.status}: ${response.statusText}`);
        }
        return response.json();
    }

    // ═══════════════════════════════════════════════════
    // PLATFORM LOGO MAP (for UI display)
    // ═══════════════════════════════════════════════════
    const PLATFORM_MAP: Record<number, { name: string; slug: string }> = {
        8:   { name: 'Netflix',             slug: 'netflix' },
        9:   { name: 'Amazon Prime Video',  slug: 'amazon-prime-video' },
        119: { name: 'Amazon Prime Video',  slug: 'amazon-prime-video' },
        122: { name: 'Disney+ Hotstar',     slug: 'disney-plus-hotstar' },
        237: { name: 'Disney+ Hotstar',     slug: 'disney-plus-hotstar' },
        232: { name: 'Zee5',                slug: 'zee5' },
        192: { name: 'YouTube',             slug: 'youtube' },
        3:   { name: 'Google Play Movies',  slug: 'google-play' },
        2:   { name: 'Apple TV',            slug: 'apple-tv' },
        350: { name: 'Apple TV Plus',       slug: 'apple-tv-plus' },
        175: { name: 'Netflix Kids',        slug: 'netflix' },
        220: { name: 'JioCinema',           slug: 'jiocinema' },
        218: { name: 'Aha',                 slug: 'aha' },
        309: { name: 'Sun NXT',             slug: 'sun-nxt' },
        237: { name: 'Sony Liv',            slug: 'sonyliv' },
        73:  { name: 'Tubi',                slug: 'tubi' },
        531: { name: 'Paramount Plus',      slug: 'paramount-plus' },
        283: { name: 'Crunchyroll',         slug: 'crunchyroll' },
        257: { name: 'fuboTV',              slug: 'fubotv' },
        614: { name: 'VI movies and tv',    slug: 'vi-movies' },
        121: { name: 'Voot',                slug: 'voot' },
        315: { name: 'Hoichoi',             slug: 'hoichoi' },
        431: { name: 'Discovery+',          slug: 'discovery-plus' },
    };

    console.log('');
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║  📺 TFIverse OTT Links Sync (TMDB Watch Providers)      ║');
    console.log('║  Region: India (IN)                                     ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('');

    const startTime = Date.now();
    let totalProcessed = 0;
    let moviesWithOtt = 0;
    let totalLinksAdded = 0;
    let noOttData = 0;
    let errors = 0;

    // Get all movies from DB
    const allMovies = await db.select({
        id: movies.id,
        tmdbId: movies.tmdbId,
        title: movies.title,
        year: movies.year,
    }).from(movies).orderBy(movies.popularity);

    console.log(`📊 Total movies to process: ${allMovies.length}\n`);

    for (const movie of allMovies) {
        try {
            const data = await tmdbFetch(`/movie/${movie.tmdbId}/watch/providers`);
            await sleep(250); // Throttle

            const india = data.results?.IN;
            
            if (!india) {
                noOttData++;
                totalProcessed++;
                continue;
            }

            // Collect all offers (flatrate, rent, buy, ads, free)
            const allOffers: Array<{ provider: any; type: string }> = [];
            
            if (india.flatrate) {
                india.flatrate.forEach((p: any) => allOffers.push({ provider: p, type: 'subscription' }));
            }
            if (india.rent) {
                india.rent.forEach((p: any) => allOffers.push({ provider: p, type: 'rent' }));
            }
            if (india.buy) {
                india.buy.forEach((p: any) => allOffers.push({ provider: p, type: 'buy' }));
            }
            if (india.ads) {
                india.ads.forEach((p: any) => allOffers.push({ provider: p, type: 'free' }));
            }
            if (india.free) {
                india.free.forEach((p: any) => allOffers.push({ provider: p, type: 'free' }));
            }

            if (allOffers.length === 0) {
                noOttData++;
                totalProcessed++;
                continue;
            }

            // Deduplicate by platform+type
            const seen = new Set<string>();
            
            for (const offer of allOffers) {
                const platformInfo = PLATFORM_MAP[offer.provider.provider_id] || {
                    name: offer.provider.provider_name,
                    slug: offer.provider.provider_name?.toLowerCase().replace(/\s+/g, '-') || 'unknown'
                };

                const key = `${platformInfo.name}-${offer.type}`;
                if (seen.has(key)) continue;
                seen.add(key);

                // Construct the TMDB link (this is the redirect link TMDB provides)
                const tmdbLink = india.link || `https://www.themoviedb.org/movie/${movie.tmdbId}/watch?locale=IN`;

                await db.insert(movieOttLinks).values({
                    movieId: movie.id,
                    platform: platformInfo.name,
                    url: tmdbLink,
                    type: offer.type,
                    region: 'IN',
                    isAvailable: true,
                    quality: null,
                }).onConflictDoNothing();

                totalLinksAdded++;
            }

            moviesWithOtt++;
            totalProcessed++;

            if (totalProcessed % 100 === 0) {
                const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
                console.log(`   ✅ ${totalProcessed}/${allMovies.length} processed | ${moviesWithOtt} with OTT | ${totalLinksAdded} links | ${elapsed} min`);
            }

        } catch (err: any) {
            errors++;
            totalProcessed++;
            if (errors <= 5) {
                console.error(`   ❌ Error [${movie.tmdbId}] ${movie.title}: ${err.message}`);
            }
        }
    }

    // ── Final Summary ──
    const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log(`║  🏁 OTT SYNC COMPLETE                                    ║`);
    console.log(`║  📊 Processed:   ${String(totalProcessed).padEnd(6)} movies                        ║`);
    console.log(`║  📺 With OTT:    ${String(moviesWithOtt).padEnd(6)} movies have streaming data    ║`);
    console.log(`║  🔗 Links Added: ${String(totalLinksAdded).padEnd(6)}                              ║`);
    console.log(`║  🚫 No OTT:      ${String(noOttData).padEnd(6)}                              ║`);
    console.log(`║  ❌ Errors:       ${String(errors).padEnd(6)}                              ║`);
    console.log(`║  ⏱️  Time:         ${totalTime} minutes                          ║`);
    console.log('╚══════════════════════════════════════════════════════════╝');

    process.exit(0);
}

syncOtt().catch(err => {
    console.error('💀 Fatal error:', err);
    process.exit(1);
});
