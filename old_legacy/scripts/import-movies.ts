// scripts/import-movies.ts
// Imports movies from JSON files and creates/links cast & crew

import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });

// Set DATABASE_URL explicitly if needed
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://tfiverse:newpassword123@localhost:5432/tfiverse';

import { db } from '@/lib/db';
import { movies, movieCredits, people } from '@/lib/schema';
import { eq, or, sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

// TMDB Image Base URLs
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/original';
const YOUTUBE_BASE = 'https://www.youtube.com/watch?v=';

// Folder containing your downloaded JSON files
const MOVIES_FOLDER = './test-movies'; // Change this to your folder path

interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  vote_count: number;
  popularity: number;
  poster_path: string | null;
  backdrop_path: string | null;
  genres: Array<{ id: number; name: string }>;
  production_companies: Array<{ id: number; name: string }>;
  spoken_languages: Array<{ iso_639_1: string; name: string }>;
  tagline: string;
  budget: number;
  revenue: number;
  status: string;
  imdb_id: string;
  homepage: string;
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      order: number;
      profile_path: string | null;
    }>;
    crew: Array<{
      id: number;
      name: string;
      job: string;
      department: string;
      profile_path: string | null;
    }>;
  };
  videos?: {
    results: Array<{
      key: string;
      type: string;
      site: string;
    }>;
  };
  [key: string]: any;
}

let successCount = 0;
let skipCount = 0;
let errorCount = 0;

async function importMovie(filePath: string, fileName: string) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const movieData: TMDBMovie = JSON.parse(fileContent);

    const tmdbId = movieData.id;
    const title = movieData.title || movieData.original_title;
    const year = movieData.release_date ? new Date(movieData.release_date).getFullYear() : null;

    console.log(`\n🎬 Processing: ${title} (${tmdbId})`);

    // Check if movie already exists
    const existingMovie = await db.select().from(movies).where(eq(movies.tmdbId, tmdbId)).limit(1);

    if (existingMovie.length > 0) {
      console.log(`   ⏭️  Already exists, skipping...`);
      skipCount++;
      return;
    }

    // Generate movie slug
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    // Build full URLs
    const posterUrl = movieData.poster_path ? `${TMDB_IMAGE_BASE}${movieData.poster_path}` : null;
    const backdropUrl = movieData.backdrop_path ? `${TMDB_IMAGE_BASE}${movieData.backdrop_path}` : null;
    
    // Extract trailer URL
    let trailerUrl = null;
    if (movieData.videos?.results) {
      const trailer = movieData.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
      if (trailer) {
        trailerUrl = `${YOUTUBE_BASE}${trailer.key}`;
      }
    }

    // Insert movie
    const [movie] = await db.insert(movies).values({
      tmdbId,
      title,
      originalTitle: movieData.original_title,
      slug,
      year,
      overview: movieData.overview || null,
      releaseDate: movieData.release_date || null,
      runtime: movieData.runtime || null,
      tagline: movieData.tagline || null,
      status: movieData.status || null,
      budget: movieData.budget || null,
      revenue: movieData.revenue || null,
      voteAverage: movieData.vote_average || null,
      voteCount: movieData.vote_count || null,
      popularity: movieData.popularity || null,
      posterUrl,
      backdropUrl,
      trailerUrl,
      metadata: movieData,
    }).returning();

    console.log(`   ✅ Movie imported (ID: ${movie.id})`);
    console.log(`   📸 Poster: ${posterUrl ? '✓' : '✗'}`);
    console.log(`   🎞️  Backdrop: ${backdropUrl ? '✓' : '✗'}`);
    console.log(`   🎥 Trailer: ${trailerUrl ? '✓' : '✗'}`);

    // Import cast (top 20)
    if (movieData.credits?.cast) {
      let castCount = 0;
      for (const castMember of movieData.credits.cast.slice(0, 20)) {
        try {
          // 🔍 SMART LOOKUP: Find by tmdb_person_id OR name
          const existingPerson = await db
            .select()
            .from(people)
            .where(
              or(
                eq(people.tmdbPersonId, castMember.id),
                sql`LOWER(${people.name}) = LOWER(${castMember.name})`
              )
            )
            .limit(1);

          let personId: string;

          if (existingPerson.length > 0) {
            // ✅ Person exists - reuse their ID
            personId = existingPerson.id;
          } else {
            // ❌ Person doesn't exist - create stub
            const personSlug = castMember.name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '');
            
            personId = personSlug;

            // Check if slug already exists
            const slugExists = await db.select().from(people).where(eq(people.id, personSlug)).limit(1);

            if (slugExists.length > 0) {
              // Slug taken - add tmdb_id suffix
              personId = `${personSlug}-${castMember.id}`;
            }

            await db.insert(people).values({
              id: personId,
              name: castMember.name,
              slug: personSlug,
              tmdbPersonId: castMember.id,
              category: 'actor',
              metadata: {
                name: castMember.name,
                tmdb_person_id: castMember.id,
                profile_path: castMember.profile_path,
              },
            }).onConflictDoNothing();
          }

          // Insert credit link
          await db.insert(movieCredits).values({
            movieId: movie.id,
            personId,
            tmdbPersonId: castMember.id,
            roleType: 'cast',
            character: castMember.character,
            orderIndex: castMember.order,
          }).onConflictDoNothing();

          castCount++;
        } catch (err: any) {
          console.log(`   ⚠️  Cast error: ${castMember.name}`);
        }
      }
      console.log(`   👥 Cast imported: ${castCount}`);
    }

    // Import crew (directors only for now)
    if (movieData.credits?.crew) {
      let crewCount = 0;
      const directors = movieData.credits.crew.filter(c => c.job === 'Director');
      
      for (const crewMember of directors) {
        try {
          // 🔍 SMART LOOKUP: Find by tmdb_person_id OR name
          const existingPerson = await db
            .select()
            .from(people)
            .where(
              or(
                eq(people.tmdbPersonId, crewMember.id),
                sql`LOWER(${people.name}) = LOWER(${crewMember.name})`
              )
            )
            .limit(1);

          let personId: string;

          if (existingPerson.length > 0) {
            personId = existingPerson.id;
          } else {
            const personSlug = crewMember.name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '');
            
            personId = personSlug;

            const slugExists = await db.select().from(people).where(eq(people.id, personSlug)).limit(1);
            if (slugExists.length > 0) {
              personId = `${personSlug}-${crewMember.id}`;
            }

            await db.insert(people).values({
              id: personId,
              name: crewMember.name,
              slug: personSlug,
              tmdbPersonId: crewMember.id,
              category: 'director',
              metadata: {
                name: crewMember.name,
                tmdb_person_id: crewMember.id,
                profile_path: crewMember.profile_path,
              },
            }).onConflictDoNothing();
          }

          await db.insert(movieCredits).values({
            movieId: movie.id,
            personId,
            tmdbPersonId: crewMember.id,
            roleType: 'crew',
            job: crewMember.job,
            department: crewMember.department,
          }).onConflictDoNothing();

          crewCount++;
        } catch (err: any) {
          console.log(`   ⚠️  Crew error: ${crewMember.name}`);
        }
      }
      console.log(`   🎬 Crew imported: ${crewCount}`);
    }

    successCount++;
  } catch (error: any) {
    console.log(`   ❌ Error importing ${fileName}: ${error.message}`);
    errorCount++;
  }
}

async function main() {
  console.log('✅ Database client initialized');
  console.log('🚀 Starting movie import...\n');
  console.log(`📁 Reading from: ${MOVIES_FOLDER}\n`);

  const files = fs.readdirSync(MOVIES_FOLDER).filter(f => f.endsWith('.json'));
  console.log(`📊 Found ${files.length} movies to import\n`);

  for (const file of files) {
    const filePath = path.join(MOVIES_FOLDER, file);
    await importMovie(filePath, file);
  }

  console.log('\n==================================================');
  console.log('📊 IMPORT SUMMARY');
  console.log('==================================================');
  console.log(`✅ Successfully imported: ${successCount}`);
  console.log(`⏭️  Skipped (duplicates): ${skipCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log('==================================================\n');
  console.log('✨ Import complete!');

  process.exit(0);
}

main().catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
