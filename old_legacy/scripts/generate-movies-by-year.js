// scripts/generate-movies-by-year.js
const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURATION
// ============================================

const PEOPLE_DIR = path.join(process.cwd(), 'public', 'data', 'people');
const MOVIES_DIR = path.join(process.cwd(), 'public', 'data', 'movies');

// ============================================
// MAIN FUNCTION
// ============================================

async function generateMoviesByYear() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  🎬 MOVIES BY YEAR GENERATOR v1.0                         ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  if (!fs.existsSync(PEOPLE_DIR)) {
    console.error(`❌ Error: People directory not found: ${PEOPLE_DIR}`);
    process.exit(1);
  }

  // Create movies directory if doesn't exist
  if (!fs.existsSync(MOVIES_DIR)) {
    fs.mkdirSync(MOVIES_DIR, { recursive: true });
  }

  console.log('🔍 Scanning people files for movies...\n');

  const files = fs.readdirSync(PEOPLE_DIR).filter(f => f.endsWith('.json'));
  const moviesByYear = new Map(); // year => Map(movieId => movie)

  for (const file of files) {
    try {
      const filePath = path.join(PEOPLE_DIR, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      if (data.movies && Array.isArray(data.movies)) {
        for (const movie of data.movies) {
          const year = movie.year;
          
          if (!moviesByYear.has(year)) {
            moviesByYear.set(year, new Map());
          }

          const yearMovies = moviesByYear.get(year);

          if (!yearMovies.has(movie.id)) {
            // First time seeing this movie
            yearMovies.set(movie.id, {
              ...movie,
              cast: movie.cast || [],
              crew: movie.crew || []
            });
          } else {
            // Movie exists, merge cast/crew
            const existingMovie = yearMovies.get(movie.id);
            
            // Add person to cast/crew if not already there
            const personInCast = movie.cast?.some(c => c.slug === data.slug);
            const personInCrew = movie.crew?.some(c => c.slug === data.slug);

            if (data.type === 'actor' || data.type === 'actress') {
              if (!personInCast) {
                existingMovie.cast.push({
                  name: data.name,
                  slug: data.slug,
                  character: movie.role
                });
              }
            } else {
              if (!personInCrew) {
                existingMovie.crew.push({
                  name: data.name,
                  slug: data.slug,
                  role: data.type
                });
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }

  // Save each year to separate file
  console.log('\n💾 Saving year files...\n');

  const yearsSorted = Array.from(moviesByYear.keys()).sort((a, b) => b - a);

  for (const year of yearsSorted) {
    const movies = Array.from(moviesByYear.get(year).values());
    
    const output = {
      year: year,
      totalMovies: movies.length,
      lastUpdated: new Date().toISOString(),
      movies: movies
    };

    const yearFile = path.join(MOVIES_DIR, `${year}.json`);
    fs.writeFileSync(yearFile, JSON.stringify(output, null, 2));
    
    console.log(`✓ ${year}.json (${movies.length} movies)`);
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('✅ MOVIES BY YEAR GENERATED!');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`📊 Total Years: ${yearsSorted.length}`);
  console.log(`📅 Range: ${yearsSorted[yearsSorted.length - 1]} - ${yearsSorted[0]}`);
  console.log(`💾 Saved to: ${MOVIES_DIR}/\n`);
}

// Run
generateMoviesByYear().catch(error => {
  console.error('\n❌ FATAL ERROR:', error.message);
  process.exit(1);
});
