import * as dotenv from 'dotenv';
import path from 'path';

// Load env before other imports
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY?.split(',')[0];
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function tmdbFetch(endpoint: string, params: Record<string, string> = {}) {
    const searchParams = new URLSearchParams({ api_key: TMDB_API_KEY!, ...params });
    const url = `${TMDB_BASE_URL}${endpoint}?${searchParams}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`TMDB error: ${response.statusText}`);
    return response.json();
}

function slugify(text: string) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

async function syncMovies() {
    // Dynamic imports to ensure env is loaded first
    const { db } = await import('../src/lib/db');
    const { movies, people, movieCredits } = await import('../src/lib/schema');
    const { eq } = await import('drizzle-orm');

    console.log('🚀 Starting TMDB Movie Sync...');
    
    let totalSynced = 0;
    
    // Page loop
    for (let page = 1; page <= 1; page++) { // Testing with first page
        console.log(`\n📄 Fetching page ${page}...`);
        const data = await tmdbFetch('/discover/movie', {
            with_original_language: 'te',
            sort_by: 'release_date.desc',
            page: String(page)
        });

        for (const m of data.results) {
            try {
                // Fetch full details for credits
                const detail = await tmdbFetch(`/movie/${m.id}`, { append_to_response: 'credits' });
                
                const slug = `${slugify(detail.title)}-${detail.id}`;
                
                // Upsert Movie
                await db.insert(movies).values({
                    tmdbId: detail.id,
                    imdbId: detail.imdb_id,
                    title: detail.title,
                    originalTitle: detail.original_title,
                    slug: slug,
                    tagline: detail.tagline,
                    overview: detail.overview,
                    releaseDate: detail.release_date ? new Date(detail.release_date) : null,
                    year: detail.release_date ? new Date(detail.release_date).getFullYear() : null,
                    runtime: detail.runtime,
                    status: detail.status,
                    budget: detail.budget,
                    revenue: detail.revenue,
                    voteAverage: detail.vote_average,
                    voteCount: detail.vote_count,
                    popularity: detail.popularity,
                    posterUrl: detail.poster_path,
                    backdropUrl: detail.backdrop_path,
                    metadata: {
                        genres: detail.genres?.map((g: any) => g.name) || [],
                        original_language: detail.original_language,
                        production_companies: detail.production_companies?.map((c: any) => c.name) || []
                    }
                }).onConflictDoUpdate({
                    target: movies.tmdbId,
                    set: {
                        popularity: detail.popularity,
                        voteAverage: detail.vote_average,
                        voteCount: detail.vote_count,
                        updatedAt: new Date()
                    }
                });

                const [movieRecord] = await db.select().from(movies).where(eq(movies.tmdbId, detail.id)).limit(1);

                // Sync Credits (Top 10 cast + Director)
                const cast = detail.credits?.cast?.slice(0, 10) || [];
                const crew = detail.credits?.crew?.filter((c: any) => c.job === 'Director') || [];
                const combined = [...cast.map((c: any) => ({ ...c, type: 'cast' })), ...crew.map((c: any) => ({ ...c, type: 'crew' }))];

                for (const person of combined) {
                    // Check if person exists
                    let [personRecord] = await db.select().from(people).where(eq(people.tmdbPersonId, person.id)).limit(1);
                    
                    let personId = personRecord?.id;

                    if (!personRecord) {
                        // Create stub person
                        const stubId = `p-${person.id}`;
                        const stubSlug = `${slugify(person.name)}-${person.id}`;
                        await db.insert(people).values({
                            id: stubId,
                            name: person.name,
                            slug: stubSlug,
                            tmdbPersonId: person.id,
                            category: 'crew', // Default category
                            metadata: { profile_path: person.profile_path }
                        }).onConflictDoNothing();
                        personId = stubId;
                    }

                    // Upsert Credit
                    await db.insert(movieCredits).values({
                        movieId: movieRecord.id,
                        personId: personId!,
                        tmdbPersonId: person.id,
                        roleType: person.type,
                        character: person.character || null,
                        job: person.job || null,
                        department: person.department || null,
                        orderIndex: person.order
                    }).onConflictDoNothing();
                }

                totalSynced++;
                console.log(`✅ Synced: ${detail.title} (${detail.id})`);
            } catch (err: any) {
                console.error(`❌ Failed syncing movie ${m.id}:`, err.message);
            }
        }
    }

    console.log(`\n🏁 Sync complete! Total synced: ${totalSynced}`);
    process.exit(0);
}

syncMovies().catch(err => {
    console.error(err);
    process.exit(1);
});
