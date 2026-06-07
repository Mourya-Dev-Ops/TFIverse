// scripts/extract-tmdb-hero-data.ts
// No dependencies! Uses built-in Node.js fetch

import * as fs from 'fs';

const TMDB_API_KEY = process.env.TMDB_API_KEY || '';
const BASE_URL = 'https://api.themoviedb.org/3';

if (!TMDB_API_KEY) {
  console.error('❌ ERROR: TMDB_API_KEY environment variable not set');
  console.error('Usage: TMDB_API_KEY=your_key npx tsx scripts/extract-tmdb-hero-data.ts [personId] [heroName]');
  process.exit(1);
}

interface MovieData {
  tmdbId: number;
  title: string;
  releaseDate: string;
  posterPath: string;
  backdropPath: string;
  runtime: number;
  director: string;
  producer: string;
  musicDirector: string;
  genre: string[];
  synopsis: string;
  imdbId: string;
  imdbRating: number;
  tmdbRating: number;
}

// Get person details
async function getPersonDetails(personId: number): Promise<any> {
  const url = `${BASE_URL}/person/${personId}?api_key=${TMDB_API_KEY}&append_to_response=external_ids`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch person details: ${res.statusText}`);
  return res.json();
}

// Get person filmography (all movies)
async function getPersonFilmography(personId: number): Promise<any> {
  const url = `${BASE_URL}/person/${personId}/movie_credits?api_key=${TMDB_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch filmography: ${res.statusText}`);
  return res.json();
}

// Get TV shows
async function getPersonTVShows(personId: number): Promise<any> {
  const url = `${BASE_URL}/person/${personId}/tv_credits?api_key=${TMDB_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch TV shows: ${res.statusText}`);
  return res.json();
}

// Get detailed movie info
async function getMovieDetails(movieId: number): Promise<any> {
  const url = `${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,external_ids`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch movie details for ${movieId}`);
  return res.json();
}

// Extract crew info
function extractCrew(credits: any) {
  const crew = {
    director: '',
    producer: '',
    musicDirector: '',
    writer: ''
  };

  if (!credits || !credits.crew) return crew;

  credits.crew.forEach((person: any) => {
    if (person.job === 'Director' && !crew.director) crew.director = person.name;
    if (person.job === 'Producer' && !crew.producer) crew.producer = person.name;
    if (person.job === 'Original Music Composer' && !crew.musicDirector) crew.musicDirector = person.name;
    if (person.job === 'Writer' && !crew.writer) crew.writer = person.name;
  });

  return crew;
}

// Extract cast
function extractCast(credits: any) {
  if (!credits || !credits.cast) return [];
  return credits.cast.slice(0, 5).map((c: any) => c.name);
}

// Main extraction
async function extractHeroData(tmdbPersonId: number, heroName: string) {
  console.log(`🎬 Extracting data for ${heroName} (TMDb ID: ${tmdbPersonId})...`);
  
  try {
    // Get person
    const person = await getPersonDetails(tmdbPersonId);
    console.log(`✅ Got person details`);

    // Get movies
    const movieCredits = await getPersonFilmography(tmdbPersonId);
    console.log(`✅ Got ${movieCredits.cast?.length || 0} movies`);

    // Get TV
    const tvCredits = await getPersonTVShows(tmdbPersonId);
    console.log(`✅ Got ${tvCredits.cast?.length || 0} TV shows`);

    // Process movies
    const movies: MovieData[] = [];
    const leadMovies: MovieData[] = [];
    const cameos: MovieData[] = [];

    if (movieCredits.cast) {
      for (let i = 0; i < movieCredits.cast.length; i++) {
        const movie = movieCredits.cast[i];
        
        if (!movie.id || !movie.release_date) continue;

        try {
          const movieDetails = await getMovieDetails(movie.id);
          const crew = extractCrew(movieDetails.credits);

          const movieData: MovieData = {
            tmdbId: movie.id,
            title: movie.title,
            releaseDate: movie.release_date,
            posterPath: movie.poster_path || '',
            backdropPath: movieDetails.backdrop_path || '',
            runtime: movieDetails.runtime || 0,
            director: crew.director,
            producer: crew.producer,
            musicDirector: crew.musicDirector,
            genre: movieDetails.genres?.map((g: any) => g.name) || [],
            synopsis: movieDetails.overview || '',
            imdbId: movieDetails.external_ids?.imdb_id || '',
            imdbRating: 0,
            tmdbRating: movieDetails.vote_average || 0
          };

          // Categorize
          if (movie.character?.toLowerCase().includes('cameo') || movie.order > 10) {
            cameos.push(movieData);
          } else {
            leadMovies.push(movieData);
          }

          movies.push(movieData);
          
          // Progress
          if ((i + 1) % 10 === 0) {
            console.log(`  📽️  Processed ${i + 1}/${movieCredits.cast.length} movies...`);
          }
        } catch (err) {
          console.log(`  ⚠️  Skipped: ${movie.title} (error fetching details)`);
        }
      }
    }

    // Compile result
    const result = {
      hero: {
        name: person.name,
        tmdbPersonId: person.id,
        imdbId: person.external_ids?.imdb_id || '',
        profilePath: person.profile_path || '',
        birthDate: person.birthday || '',
        birthPlace: person.place_of_birth || '',
        knownForDepartment: person.known_for_department || ''
      },
      filmography: {
        total: movies.length,
        leadMovies: leadMovies.length,
        cameos: cameos.length,
        tvShows: tvCredits.cast?.length || 0
      },
      movies,
      leadMovies,
      cameos,
      tvShows: tvCredits.cast || []
    };

    // Save to file
    const fileName = `${heroName.toLowerCase().replace(/\s+/g, '-')}-tmdb-export.json`;
    fs.writeFileSync(fileName, JSON.stringify(result, null, 2));

    // Print summary
    console.log(`\n✅ EXTRACTION COMPLETE!`);
    console.log(`📊 Summary:`);
    console.log(`   - Total movies: ${movies.length}`);
    console.log(`   - Lead movies: ${leadMovies.length}`);
    console.log(`   - Cameos: ${cameos.length}`);
    console.log(`   - TV shows: ${tvCredits.cast?.length || 0}`);
    console.log(`💾 Saved to: ${fileName}`);

    return result;

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Parse args
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: TMDB_API_KEY=your_key npx tsx scripts/extract-tmdb-hero-data.ts [personId] [heroName]');
  console.error('Example: TMDB_API_KEY=ba5dc... npx tsx scripts/extract-tmdb-hero-data.ts 237045 "prabhas"');
  process.exit(1);
}

extractHeroData(parseInt(args[0]), args[1]).catch(console.error);
