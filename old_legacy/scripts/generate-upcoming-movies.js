// scripts/generate-upcoming-movies.js
const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURATION
// ============================================

const PEOPLE_DIR = path.join(process.cwd(), 'public', 'data', 'people');
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'data', 'upcoming-movies.json');

// ============================================
// MAIN FUNCTION
// ============================================

async function generateUpcomingMovies() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  🎬 UPCOMING MOVIES GENERATOR v1.0                        ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  if (!fs.existsSync(PEOPLE_DIR)) {
    console.error(`❌ Error: People directory not found: ${PEOPLE_DIR}`);
    process.exit(1);
  }

  console.log('🔍 Scanning people files for upcoming movies...\n');

  const files = fs.readdirSync(PEOPLE_DIR).filter(f => f.endsWith('.json'));
  const moviesMap = new Map(); // Use Map to avoid duplicates

  for (const file of files) {
    try {
      const filePath = path.join(PEOPLE_DIR, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      if (data.upcoming && Array.isArray(data.upcoming)) {
        for (const movie of data.upcoming) {
          if (!moviesMap.has(movie.id)) {
            // First time seeing this movie
            moviesMap.set(movie.id, {
              id: movie.id,
              title: movie.title,
              slug: movie.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
              year: movie.year,
              releaseDate: movie.releaseDate || null,
              director: movie.director || null,
              genre: movie.genre || [],
              status: movie.status || 'pre-production',
              expectedBudget: movie.expectedBudget || null,
              poster: movie.poster || null,
              cast: [
                {
                  name: data.name,
                  slug: data.slug,
                  role: data.type === 'director' ? 'Director' : 'Actor'
                }
              ]
            });
          } else {
            // Movie already exists, add this person to cast
            const existingMovie = moviesMap.get(movie.id);
            existingMovie.cast.push({
              name: data.name,
              slug: data.slug,
              role: data.type === 'director' ? 'Director' : data.type === 'music-director' ? 'Music Director' : 'Actor'
            });
          }
        }
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }

  // Convert Map to array and sort
  const movies = Array.from(moviesMap.values()).sort((a, b) => {
    // Sort by release date (earliest first)
    if (a.releaseDate && b.releaseDate) {
      return new Date(a.releaseDate) - new Date(b.releaseDate);
    }
    // If no release date, sort by year
    return (a.year || 9999) - (b.year || 9999);
  });

  // Group by status
  const grouped = {
    'pre-production': movies.filter(m => m.status === 'pre-production'),
    'filming': movies.filter(m => m.status === 'filming'),
    'post-production': movies.filter(m => m.status === 'post-production'),
    'completed': movies.filter(m => m.status === 'completed')
  };

  const output = {
    total: movies.length,
    lastUpdated: new Date().toISOString(),
    byStatus: {
      preProduction: grouped['pre-production'].length,
      filming: grouped.filming.length,
      postProduction: grouped['post-production'].length,
      completed: grouped.completed.length
    },
    movies: movies
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));

  console.log('═══════════════════════════════════════════════════════════');
  console.log('✅ UPCOMING MOVIES GENERATED!');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`📊 Total Movies: ${output.total}`);
  console.log(`📋 By Status:`);
  console.log(`   ├─ Pre-Production: ${output.byStatus.preProduction}`);
  console.log(`   ├─ Filming: ${output.byStatus.filming}`);
  console.log(`   ├─ Post-Production: ${output.byStatus.postProduction}`);
  console.log(`   └─ Completed: ${output.byStatus.completed}`);
  console.log(`💾 Saved to: ${OUTPUT_FILE}\n`);
}

// Run
generateUpcomingMovies().catch(error => {
  console.error('\n❌ FATAL ERROR:', error.message);
  process.exit(1);
});
