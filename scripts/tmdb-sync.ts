import 'dotenv/config';
import { db } from '../src/lib/db';
import { people, movies, movieCredits } from '../src/lib/schema';
import { eq, and, isNotNull } from 'drizzle-orm';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateSlug(title: string, year: number | null) {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return year ? `${base}-${year}` : base;
}

async function syncPersonMovies(person: any) {
  console.log(`\n🎬 Syncing movies for ${person.name} (TMDB ID: ${person.tmdbPersonId})...`);
  
  const response = await fetch(`${TMDB_BASE_URL}/person/${person.tmdbPersonId}/movie_credits?api_key=${TMDB_API_KEY}&language=en-US`);
  if (!response.ok) {
    console.error(`❌ Failed to fetch TMDB data for ${person.name}: ${response.statusText}`);
    return;
  }
  
  const data = await response.json();
  const allCredits = [...(data.cast || []), ...(data.crew || [])];
  
  // Sort by popularity to prioritize important movies
  allCredits.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  
  let addedCount = 0;
  
  for (const credit of allCredits) {
    // Only fetch movies that actually have release dates to filter out unreleased clutter
    if (!credit.release_date) continue;
    
    // Filter out extreme obscure things
    if (credit.popularity < 1 && credit.vote_count < 2) continue;

    const releaseDate = new Date(credit.release_date);
    const year = releaseDate.getFullYear();
    let slug = generateSlug(credit.title, year);
    
    try {
      // 1. Find or Create Movie
      let [movie] = await db.select().from(movies).where(eq(movies.tmdbId, credit.id));
      
      if (!movie) {
        // Try to insert movie
        try {
          const [newMovie] = await db.insert(movies).values({
            tmdbId: credit.id,
            title: credit.title,
            originalTitle: credit.original_title,
            slug: slug,
            overview: credit.overview,
            releaseDate: releaseDate,
            year: year,
            posterUrl: credit.poster_path ? `https://image.tmdb.org/t/p/w500${credit.poster_path}` : null,
            backdropUrl: credit.backdrop_path ? `https://image.tmdb.org/t/p/original${credit.backdrop_path}` : null,
            voteAverage: credit.vote_average,
            voteCount: credit.vote_count,
            popularity: credit.popularity,
            metadata: credit
          }).returning();
          movie = newMovie;
        } catch (insertErr: any) {
          // If slug collision, append random string
          if (insertErr.code === '23505') {
            slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
            const [retryMovie] = await db.insert(movies).values({
              tmdbId: credit.id,
              title: credit.title,
              originalTitle: credit.original_title,
              slug: slug,
              overview: credit.overview,
              releaseDate: releaseDate,
              year: year,
              posterUrl: credit.poster_path ? `https://image.tmdb.org/t/p/w500${credit.poster_path}` : null,
              backdropUrl: credit.backdrop_path ? `https://image.tmdb.org/t/p/original${credit.backdrop_path}` : null,
              voteAverage: credit.vote_average,
              voteCount: credit.vote_count,
              popularity: credit.popularity,
              metadata: credit
            }).returning();
            movie = retryMovie;
          } else {
            throw insertErr;
          }
        }
      }

      // 2. Upsert Credit
      const roleType = credit.character ? 'cast' : 'crew';
      
      // Avoid inserting identical credits for the same person on the same movie
      const existingCredits = await db.select().from(movieCredits)
        .where(and(
           eq(movieCredits.movieId, movie.id),
           eq(movieCredits.personId, person.id),
           eq(movieCredits.roleType, roleType)
        ));
        
      const isDuplicate = existingCredits.some(c => 
        (roleType === 'cast' && c.character === credit.character) ||
        (roleType === 'crew' && c.job === credit.job)
      );
        
      if (!isDuplicate) {
        await db.insert(movieCredits).values({
          movieId: movie.id,
          personId: person.id,
          tmdbPersonId: person.tmdbPersonId,
          roleType: roleType,
          character: credit.character || null,
          job: credit.job || null,
          department: credit.department || null,
          orderIndex: credit.order || null,
        });
        addedCount++;
      }
    } catch (err: any) {
      console.error(`Error adding movie ${credit.title}:`, err.message);
    }
  }
  
  console.log(`✅ Added ${addedCount} new movie credits for ${person.name}`);
}

async function main() {
  console.log('🚀 Starting TMDB Filmography Sync Engine...');
  
  if (!TMDB_API_KEY) {
    console.error('❌ TMDB_API_KEY is missing in .env');
    console.error('Please add TMDB_API_KEY=your_key_here to .env file');
    process.exit(1);
  }

  // Get all people with TMDB IDs
  const allPeople = await db.select().from(people).where(isNotNull(people.tmdbPersonId));
  console.log(`Found ${allPeople.length} profiles connected to TMDB.`);
  
  for (const person of allPeople) {
    await syncPersonMovies(person);
    // Be nice to TMDB API (Max 40 reqs per 10s)
    await delay(300); 
  }
  
  console.log('\n🎉 Filmography Sync Complete!');
  process.exit(0);
}

main().catch(console.error);
