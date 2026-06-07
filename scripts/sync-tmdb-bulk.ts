import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Throttler utility
const sleep = (ms: number) => new Promise((resolve) => resolve(setTimeout(resolve, ms)));

async function syncBulk() {
    dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
    
    const { db } = await import('../src/lib/db');
    const { movies, people, movieCredits } = await import('../src/lib/schema');
    const { eq } = await import('drizzle-orm');

    const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY?.split(',')[0];
    const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
    const JSON_BACKUP_DIR = path.resolve(__dirname, '../data/movies-json');

    // Ensure backup directory exists
    fs.mkdirSync(JSON_BACKUP_DIR, { recursive: true });

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

    function slugify(text: string) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }

    // ═══════════════════════════════════════════════════
    // CONFIGURATION
    // ═══════════════════════════════════════════════════
    const SAVE_JSON_FILES = true;       // Save raw JSON backups
    const MAX_PAGES = 500;              // TMDB max pages for discover
    const CREDITS_TOP_CAST = 15;        // Top cast to link in credits table
    const THROTTLE_MS = 300;            // Delay between detail fetches (ms)
    const PAGE_THROTTLE_MS = 1000;      // Delay between pages (ms)

    console.log('');
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║  🎬 TFIverse BULK TMDB Movie Sync (Telugu)              ║');
    console.log('║  Mode: PRODUCTION (Full Sync)                           ║');
    console.log('║  JSON Backup: ' + (SAVE_JSON_FILES ? 'ON ✅' : 'OFF') + '                                        ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('');

    const startTime = Date.now();
    let totalSynced = 0;
    let totalSkipped = 0;
    let totalErrors = 0;

    for (let page = 1; page <= MAX_PAGES; page++) {
        console.log(`\n📄 Page ${page} | Synced: ${totalSynced} | Skipped: ${totalSkipped} | Errors: ${totalErrors}`);
        try {
            const data = await tmdbFetch('/discover/movie', {
                with_original_language: 'te',
                sort_by: 'popularity.desc',
                page: String(page)
            });

            if (!data.results || data.results.length === 0) {
                console.log('🏁 No more movies. End of catalog.');
                break;
            }

            console.log(`   Found ${data.results.length} movies on this page (Total pages: ${data.total_pages})`);

            // Stop if we've gone past all available pages
            if (page > data.total_pages) {
                console.log('🏁 Reached last page.');
                break;
            }

            for (const m of data.results) {
                try {
                    // Check if movie already exists with full metadata
                    const [existing] = await db.select().from(movies).where(eq(movies.tmdbId, m.id)).limit(1);
                    
                    // Skip if already synced with full data and status is Released
                    if (existing && existing.status === 'Released' && existing.metadata) {
                        totalSkipped++;
                        continue;
                    }

                    // Fetch full details with ALL append_to_response fields
                    const detail = await tmdbFetch(`/movie/${m.id}`, { 
                        append_to_response: 'credits,videos,external_ids,keywords,release_dates,images,alternative_titles' 
                    });
                    await sleep(THROTTLE_MS);

                    // ── Save JSON backup ──
                    if (SAVE_JSON_FILES) {
                        const jsonFilename = `${slugify(detail.title || 'unknown')}-${detail.id}.json`;
                        const jsonPath = path.join(JSON_BACKUP_DIR, jsonFilename);
                        fs.writeFileSync(jsonPath, JSON.stringify(detail, null, 2));
                    }

                    const slug = `${slugify(detail.title)}-${detail.id}`;
                    const imdbId = detail.imdb_id || detail.external_ids?.imdb_id;
                    
                    // Extract best trailer
                    const trailer = detail.videos?.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube') ||
                                   detail.videos?.results?.find((v: any) => v.type === 'Teaser' && v.site === 'YouTube');
                    const trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;

                    // ── Upsert Movie ──
                    await db.insert(movies).values({
                        tmdbId: detail.id,
                        imdbId: imdbId,
                        title: detail.title,
                        originalTitle: detail.original_title,
                        slug: slug,
                        tagline: detail.tagline,
                        overview: detail.overview,
                        releaseDate: detail.release_date ? new Date(detail.release_date) : null,
                        year: detail.release_date ? new Date(detail.release_date).getFullYear() : null,
                        runtime: detail.runtime,
                        status: detail.status || 'Released',
                        budget: detail.budget,
                        revenue: detail.revenue,
                        voteAverage: detail.vote_average,
                        voteCount: detail.vote_count,
                        popularity: detail.popularity,
                        posterUrl: detail.poster_path,
                        backdropUrl: detail.backdrop_path,
                        trailerUrl: trailerUrl,
                        metadata: detail
                    }).onConflictDoUpdate({
                        target: movies.tmdbId,
                        set: {
                            title: detail.title,
                            originalTitle: detail.original_title,
                            tagline: detail.tagline,
                            overview: detail.overview,
                            runtime: detail.runtime,
                            popularity: detail.popularity,
                            voteAverage: detail.vote_average,
                            voteCount: detail.vote_count,
                            status: detail.status || 'Released',
                            budget: detail.budget,
                            revenue: detail.revenue,
                            posterUrl: detail.poster_path,
                            backdropUrl: detail.backdrop_path,
                            trailerUrl: trailerUrl,
                            metadata: detail,
                            updatedAt: new Date()
                        }
                    });

                    // ── Sync Credits ──
                    if (detail.credits) {
                        const [movieRecord] = await db.select().from(movies).where(eq(movies.tmdbId, detail.id)).limit(1);
                        
                        const cast = detail.credits.cast?.slice(0, CREDITS_TOP_CAST) || [];
                        const crew = detail.credits.crew?.filter((c: any) => 
                            ['Director', 'Producer', 'Screenplay', 'Writer', 'Original Music Composer', 'Director of Photography', 'Editor'].includes(c.job)
                        ) || [];
                        
                        const combined = [
                            ...cast.map((c: any) => ({ ...c, role_type: 'cast' })),
                            ...crew.map((c: any) => ({ ...c, role_type: 'crew' }))
                        ];

                        for (const person of combined) {
                            let [personRecord] = await db.select().from(people).where(eq(people.tmdbPersonId, person.id)).limit(1);
                            let personId = personRecord?.id;

                            if (!personRecord) {
                                personId = `stub-${person.id}`;
                                const stubSlug = `${slugify(person.name)}-${person.id}`;
                                await db.insert(people).values({
                                    id: personId,
                                    name: person.name,
                                    slug: stubSlug,
                                    tmdbPersonId: person.id,
                                    category: 'crew',
                                    metadata: { profile_path: person.profile_path }
                                }).onConflictDoNothing();
                            }

                            await db.insert(movieCredits).values({
                                movieId: movieRecord.id,
                                personId: personId!,
                                tmdbPersonId: person.id,
                                roleType: person.role_type,
                                character: person.character || null,
                                job: person.job || null,
                                department: person.department || null,
                                orderIndex: person.order ?? null
                            }).onConflictDoNothing();
                        }
                    }

                    totalSynced++;
                    
                    // Progress logging
                    if (totalSynced % 50 === 0) {
                        const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
                        console.log(`   ✅ ${totalSynced} movies synced (${elapsed} min elapsed)`);
                    }

                } catch (err: any) {
                    totalErrors++;
                    console.error(`   ❌ Error [${m.id}] ${m.title}: ${err.message}`);
                }
            }

            // Sleep between pages
            await sleep(PAGE_THROTTLE_MS);
        } catch (err: any) {
            console.error(`❌ Page ${page} failed: ${err.message}`);
            await sleep(5000);
        }
    }

    // ── Final Summary ──
    const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log(`║  🏁 SYNC COMPLETE                                        ║`);
    console.log(`║  ✅ Synced:  ${String(totalSynced).padEnd(6)} movies                            ║`);
    console.log(`║  ⏭️  Skipped: ${String(totalSkipped).padEnd(6)} (already up-to-date)              ║`);
    console.log(`║  ❌ Errors:  ${String(totalErrors).padEnd(6)}                                    ║`);
    console.log(`║  ⏱️  Time:    ${totalTime} minutes                              ║`);
    console.log(`║  📁 JSON:    data/movies-json/                            ║`);
    console.log('╚══════════════════════════════════════════════════════════╝');

    process.exit(0);
}

syncBulk().catch(err => {
    console.error('💀 Fatal error:', err);
    process.exit(1);
});
