// scripts/fetch-actor-movies.js
require('dotenv').config({ path: '.env' });
const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURATION
// ============================================

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

if (!TMDB_API_KEY) {
  console.error('❌ Error: NEXT_PUBLIC_TMDB_API_KEY not found in .env!');
  console.error('Please add your TMDb API key to .env');
  process.exit(1);
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function showUsage() {
  console.log('\n📖 USAGE:');
  console.log('  node scripts/fetch-actor-movies.js "Actor Name" TMDB_ID [options]\n');
  console.log('OPTIONS:');
  console.log('  --save              Save output to JSON file');
  console.log('  --telugu            Only Telugu movies');
  console.log('  --stats             Show detailed statistics');
  console.log('  --format=simple     Simple list (default: detailed)\n');
  console.log('EXAMPLES:');
  console.log('  node scripts/fetch-actor-movies.js "Prabhas" 237045');
  console.log('  node scripts/fetch-actor-movies.js "Mahesh Babu" 58110 --save --telugu');
  console.log('  node scripts/fetch-actor-movies.js "Jr NTR" 69597 --save --stats\n');
  process.exit(0);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function detectDuplicates(movies) {
  const seen = new Map();
  const duplicates = [];

  movies.forEach((movie, idx) => {
    const key = `${movie.title}-${movie.year}`;
    if (seen.has(key)) {
      duplicates.push({
        index: idx,
        title: movie.title,
        year: movie.year,
        tmdbIds: [seen.get(key), movie.tmdbId]
      });
    } else {
      seen.set(key, movie.tmdbId);
    }
  });

  return duplicates;
}

function calculateStats(movies) {
  const stats = {
    total: movies.length,
    byLanguage: {},
    byDecade: {},
    byGenre: {},
    avgRating: 0,
    highestRated: null,
    lowestRated: null
  };

  let totalRating = 0;
  let ratedCount = 0;

  movies.forEach(movie => {
    // Language breakdown
    const lang = movie.language || 'unknown';
    stats.byLanguage[lang] = (stats.byLanguage[lang] || 0) + 1;

    // Decade breakdown
    if (movie.year) {
      const decade = Math.floor(movie.year / 10) * 10;
      stats.byDecade[`${decade}s`] = (stats.byDecade[`${decade}s`] || 0) + 1;
    }

    // Rating stats
    if (movie.rating > 0) {
      totalRating += movie.rating;
      ratedCount++;

      if (!stats.highestRated || movie.rating > stats.highestRated.rating) {
        stats.highestRated = movie;
      }
      if (!stats.lowestRated || movie.rating < stats.lowestRated.rating) {
        stats.lowestRated = movie;
      }
    }
  });

  stats.avgRating = ratedCount > 0 ? (totalRating / ratedCount).toFixed(2) : 0;

  return stats;
}

function displayStats(stats, actorName) {
  console.log('\n📊 ═══════════════════════════════════════════════');
  console.log(`   STATISTICS FOR ${actorName.toUpperCase()}`);
  console.log('═══════════════════════════════════════════════\n');

  console.log(`🎬 Total Movies: ${stats.total}`);
  console.log(`⭐ Average Rating: ${stats.avgRating}/10`);

  if (stats.highestRated) {
    console.log(`🏆 Highest Rated: ${stats.highestRated.title} (${stats.highestRated.year}) - ${stats.highestRated.rating}/10`);
  }

  console.log('\n📅 BY DECADE:');
  Object.entries(stats.byDecade)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .forEach(([decade, count]) => {
      const bar = '█'.repeat(Math.ceil(count / 2));
      console.log(`  ${decade}: ${bar} ${count} movies`);
    });

  console.log('\n🌍 BY LANGUAGE:');
  Object.entries(stats.byLanguage)
    .sort((a, b) => b[1] - a[1])
    .forEach(([lang, count]) => {
      const langName = {
        'te': 'Telugu',
        'hi': 'Hindi',
        'ta': 'Tamil',
        'en': 'English',
        'ml': 'Malayalam',
        'kn': 'Kannada'
      }[lang] || lang.toUpperCase();
      const bar = '█'.repeat(Math.ceil(count / 2));
      console.log(`  ${langName}: ${bar} ${count} movies`);
    });

  console.log('\n═══════════════════════════════════════════════\n');
}

// ============================================
// MAIN FUNCTION
// ============================================

async function getActorMovies(actorName, tmdbPersonId, options = {}) {
  try {
    console.log('\n🎬 ═══════════════════════════════════════════════');
    console.log(`   FETCHING MOVIES FOR ${actorName.toUpperCase()}`);
    console.log('═══════════════════════════════════════════════\n');
    console.log(`🔍 TMDb Person ID: ${tmdbPersonId}`);
    console.log(`⏳ Please wait...\n`);

    await delay(250); // Rate limiting

    const url = `https://api.themoviedb.org/3/person/${tmdbPersonId}/movie_credits?api_key=${TMDB_API_KEY}&language=en-US`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data.cast || !Array.isArray(data.cast)) {
      console.error('❌ No cast data found for this actor!');
      return;
    }
    
    console.log(`✅ Found ${data.cast.length} movies from TMDb\n`);
    
    // Process movies
    let movies = data.cast
      .filter(movie => movie.release_date && movie.title)
      .map(movie => ({
        title: movie.title,
        tmdbId: movie.id,
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
        releaseDate: movie.release_date,
        character: movie.character || 'Unknown',
        rating: movie.vote_average || 0,
        language: movie.original_language || 'unknown',
        popularity: movie.popularity || 0
      }))
      .sort((a, b) => new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0));

    // Filter Telugu only if requested
    if (options.telugu) {
      const beforeCount = movies.length;
      movies = movies.filter(m => m.language === 'te');
      console.log(`🎯 Filtered to Telugu only: ${beforeCount} → ${movies.length} movies\n`);
    }

    // Detect duplicates
    const duplicates = detectDuplicates(movies);
    if (duplicates.length > 0) {
      console.log('⚠️  WARNING: Detected duplicate movies:');
      duplicates.forEach(dup => {
        console.log(`   - ${dup.title} (${dup.year}) [TMDb IDs: ${dup.tmdbIds.join(', ')}]`);
      });
      console.log('');
    }

    // Display movies
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🎬 ${actorName.toUpperCase()}'S FILMOGRAPHY`);
    console.log(`   Total: ${movies.length} movies`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (options.format === 'simple') {
      movies.forEach((movie, i) => {
        console.log(`${(i + 1).toString().padStart(3)}. ${movie.title} (${movie.year})`);
      });
    } else {
      movies.forEach((movie, i) => {
        const langEmoji = {
          'te': '🎭',
          'hi': '🇮🇳',
          'ta': '🎥',
          'en': '🇺🇸'
        }[movie.language] || '🌍';

        console.log(`${(i + 1).toString().padStart(3)}. ${langEmoji} ${movie.title} (${movie.year})`);
        console.log(`     ├─ Character: ${movie.character}`);
        console.log(`     ├─ Rating: ${movie.rating > 0 ? movie.rating.toFixed(1) + '/10' : 'Not rated'}`);
        console.log(`     ├─ Language: ${movie.language.toUpperCase()}`);
        console.log(`     └─ TMDb ID: ${movie.tmdbId}\n`);
      });
    }

    // Show statistics if requested
    if (options.stats) {
      const stats = calculateStats(movies);
      displayStats(stats, actorName);
    }

    // Save to file if requested
    if (options.save) {
      const filename = `${actorName.toLowerCase().replace(/\s+/g, '-')}-movies.json`;
      const filepath = path.join(process.cwd(), 'data', 'temp', filename);
      
      // Create directory if doesn't exist
      const dir = path.dirname(filepath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const output = {
        actor: actorName,
        tmdbPersonId: tmdbPersonId,
        totalMovies: movies.length,
        fetchedAt: new Date().toISOString(),
        movies: movies
      };

      fs.writeFileSync(filepath, JSON.stringify(output, null, 2));
      console.log(`✅ Saved to: ${filepath}\n`);
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✨ Done!\n');

    return movies;

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nPossible reasons:');
    console.error('  • Invalid TMDb Person ID');
    console.error('  • Network connection issue');
    console.error('  • TMDb API rate limit exceeded\n');
    process.exit(1);
  }
}

// ============================================
// COMMAND LINE INTERFACE
// ============================================

const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  showUsage();
}

const actorName = args[0];
const tmdbPersonId = args[1];

if (!actorName || !tmdbPersonId || isNaN(tmdbPersonId)) {
  console.error('❌ Error: Missing or invalid arguments\n');
  showUsage();
}

const options = {
  save: args.includes('--save'),
  telugu: args.includes('--telugu'),
  stats: args.includes('--stats'),
  format: args.find(arg => arg.startsWith('--format='))?.split('=')[1] || 'detailed'
};

// Run the script
getActorMovies(actorName, parseInt(tmdbPersonId), options);
