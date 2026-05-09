// scripts/update-tmdb-ids.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ============================================
// CONFIGURATION
// ============================================

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

if (!TMDB_API_KEY) {
  console.error('\n❌ ERROR: TMDb API key not found!');
  console.error('Please add NEXT_PUBLIC_TMDB_API_KEY to your .env file\n');
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Hero database with TMDb Person IDs
const HEROES_DB = {
  'prabhas': { tmdbId: 237045, name: 'Prabhas' },
  'mahesh-babu': { tmdbId: 58110, name: 'Mahesh Babu' },
  'jr-ntr': { tmdbId: 69597, name: 'Jr NTR' },
  'allu-arjun': { tmdbId: 77651, name: 'Allu Arjun' },
  'ram-charan': { tmdbId: 1121060, name: 'Ram Charan' },
  'pawan-kalyan': { tmdbId: 59857, name: 'Pawan Kalyan' },
  'chiranjeevi': { tmdbId: 69718, name: 'Chiranjeevi' }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function ask(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function normalizeTitle(title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function calculateMatchConfidence(existingMovie, tmdbMovie) {
  let score = 0;
  
  // Title match (0-50 points)
  const existingTitle = normalizeTitle(existingMovie.title);
  const tmdbTitle = normalizeTitle(tmdbMovie.title || '');
  const tmdbOriginalTitle = normalizeTitle(tmdbMovie.original_title || '');
  
  if (existingTitle === tmdbTitle || existingTitle === tmdbOriginalTitle) {
    score += 50;
  } else if (tmdbTitle.includes(existingTitle) || existingTitle.includes(tmdbTitle)) {
    score += 30;
  } else if (tmdbOriginalTitle.includes(existingTitle) || existingTitle.includes(tmdbOriginalTitle)) {
    score += 25;
  }
  
  // Year match (0-30 points)
  const tmdbYear = tmdbMovie.release_date ? new Date(tmdbMovie.release_date).getFullYear() : null;
  if (tmdbYear) {
    const yearDiff = Math.abs(existingMovie.year - tmdbYear);
    if (yearDiff === 0) {
      score += 30;
    } else if (yearDiff === 1) {
      score += 20;
    } else if (yearDiff === 2) {
      score += 10;
    }
  }
  
  // Language bonus (0-20 points)
  if (tmdbMovie.original_language === 'te') {
    score += 20;
  } else if (tmdbMovie.original_language === 'hi') {
    score += 10;
  }
  
  return Math.min(100, score);
}

function findMatchingMovie(existingMovie, tmdbMovies) {
  let bestMatch = null;
  let bestConfidence = 0;
  
  for (const tmdbMovie of tmdbMovies) {
    const confidence = calculateMatchConfidence(existingMovie, tmdbMovie);
    
    if (confidence > bestConfidence) {
      bestConfidence = confidence;
      bestMatch = { ...tmdbMovie, confidence };
    }
  }
  
  // Only return matches with confidence >= 70%
  return bestConfidence >= 70 ? bestMatch : null;
}

function createBackup(heroPath) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const heroName = path.basename(heroPath, '.json');
  const backupDir = path.join(process.cwd(), 'backups', 'tmdb-updates');
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  const backupPath = path.join(backupDir, `${heroName}-backup-${timestamp}.json`);
  fs.copyFileSync(heroPath, backupPath);
  
  return backupPath;
}

function detectDuplicates(movies) {
  const seen = new Map();
  const duplicates = [];

  movies.forEach((movie, idx) => {
    const key = `${normalizeTitle(movie.title)}-${movie.year}`;
    if (seen.has(key)) {
      duplicates.push({
        indices: [seen.get(key).index, idx],
        title: movie.title,
        year: movie.year,
        tmdbIds: [seen.get(key).tmdbId, movie.tmdbId]
      });
    } else {
      seen.set(key, { index: idx, tmdbId: movie.tmdbId });
    }
  });

  return duplicates;
}

function parseSelection(input, maxIndex) {
  if (input.toLowerCase() === 'all') {
    return Array.from({ length: maxIndex }, (_, i) => i);
  }
  
  if (input.toLowerCase() === 'missing') {
    return 'missing';
  }
  
  const selections = [];
  const parts = input.split(',').map(p => p.trim());
  
  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(n => parseInt(n.trim()));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end && i <= maxIndex; i++) {
          if (i >= 1) selections.push(i - 1);
        }
      }
    } else {
      const num = parseInt(part);
      if (!isNaN(num) && num >= 1 && num <= maxIndex) {
        selections.push(num - 1);
      }
    }
  }
  
  return [...new Set(selections)].sort((a, b) => a - b);
}

// ============================================
// TMDB API FUNCTIONS
// ============================================

async function fetchActorMovies(tmdbPersonId) {
  await delay(250); // Rate limiting
  const url = `https://api.themoviedb.org/3/person/${tmdbPersonId}/movie_credits?api_key=${TMDB_API_KEY}&language=en-US`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  return await response.json();
}

async function searchTMDbByTitle(title, year) {
  await delay(250);
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&year=${year}&language=te-IN`;
  const response = await fetch(url);
  
  if (!response.ok) return [];
  
  const data = await response.json();
  return data.results?.slice(0, 8) || [];
}

// ============================================
// DISPLAY FUNCTIONS
// ============================================

function showMovieList(movies, title = 'MOVIE LIST') {
  console.log(`\n${'═'.repeat(70)}`);
  console.log(`📋 ${title}`);
  console.log(`${'═'.repeat(70)}\n`);
  
  const missingCount = movies.filter(m => !m.tmdbId).length;
  
  console.log(`Total: ${movies.length} | Missing TMDb IDs: ${missingCount}\n`);
  
  movies.forEach((movie, idx) => {
    const tmdbStatus = movie.tmdbId 
      ? `✅ ${movie.tmdbId}` 
      : '❌ Missing';
    
    console.log(`${(idx + 1).toString().padStart(3)}. ${movie.title} (${movie.year}) - [${tmdbStatus}]`);
  });
  
  console.log(`\n${'═'.repeat(70)}\n`);
}

function displaySummary(heroData, tmdbData, matches) {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log(`║  📊 SUMMARY FOR: ${heroData.name.toUpperCase().padEnd(40)}║`);
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  const missing = heroData.movies.filter(m => !m.tmdbId).length;
  const hasId = heroData.movies.length - missing;
  const highConfidence = matches.filter(m => m.confidence >= 90).length;
  const mediumConfidence = matches.filter(m => m.confidence >= 70 && m.confidence < 90).length;
  
  console.log(`  🎬 Total Movies: ${heroData.movies.length}`);
  console.log(`  ✅ Has TMDb ID: ${hasId}`);
  console.log(`  ❌ Missing TMDb ID: ${missing}`);
  console.log(`  🔍 TMDb Has: ${tmdbData.cast.length} movies\n`);
  
  console.log(`  📊 MATCH QUALITY:`);
  console.log(`     🟢 High (90%+): ${highConfidence}`);
  console.log(`     🟡 Medium (70-89%): ${mediumConfidence}`);
  console.log(`     🔴 Low (<70%): ${heroData.movies.length - matches.length}\n`);
  
  const duplicates = detectDuplicates(heroData.movies);
  if (duplicates.length > 0) {
    console.log(`  ⚠️  DUPLICATES DETECTED: ${duplicates.length}`);
    duplicates.forEach(dup => {
      console.log(`     - "${dup.title}" (${dup.year}) at indices: ${dup.indices.map(i => i + 1).join(', ')}`);
    });
    console.log('');
  }
  
  console.log('─'.repeat(60) + '\n');
}

// ============================================
// PROCESSING FUNCTIONS
// ============================================

async function processAutoMode(heroData, tmdbMovies, dryRun = false) {
  console.log('\n🤖 AUTO MODE - Processing all movies...\n');
  
  const stats = { added: 0, updated: 0, unchanged: 0, notFound: 0 };
  const changes = [];
  
  for (let i = 0; i < heroData.movies.length; i++) {
    const movie = heroData.movies[i];
    const match = findMatchingMovie(movie, tmdbMovies);
    
    process.stdout.write(`\rProcessing... ${i + 1}/${heroData.movies.length} (${Math.round((i + 1) / heroData.movies.length * 100)}%)`);
    
    if (match) {
      const confidenceEmoji = match.confidence >= 90 ? '🟢' : match.confidence >= 80 ? '🟡' : '🟠';
      
      if (!movie.tmdbId) {
        if (!dryRun) {
          heroData.movies[i].tmdbId = match.id;
        }
        changes.push({
          movie: movie.title,
          year: movie.year,
          action: 'added',
          tmdbId: match.id,
          confidence: match.confidence
        });
        console.log(`\n${confidenceEmoji} ${movie.title} (${movie.year}) - Added: ${match.id} [${match.confidence}%]`);
        stats.added++;
      } else if (movie.tmdbId !== match.id) {
        changes.push({
          movie: movie.title,
          year: movie.year,
          action: 'updated',
          oldId: movie.tmdbId,
          newId: match.id,
          confidence: match.confidence
        });
        if (!dryRun) {
          heroData.movies[i].tmdbId = match.id;
        }
        console.log(`\n${confidenceEmoji} ${movie.title} (${movie.year}) - Updated: ${movie.tmdbId} → ${match.id} [${match.confidence}%]`);
        stats.updated++;
      } else {
        stats.unchanged++;
      }
    } else {
      stats.notFound++;
    }
  }
  
  console.log('\r' + ' '.repeat(70) + '\r');
  
  return { stats, changes };
}

async function processInteractiveMode(heroData, tmdbMovies, indicesToFix) {
  const stats = { updated: 0, unchanged: 0, skipped: 0 };
  const changes = [];
  
  for (let i = 0; i < indicesToFix.length; i++) {
    const movieIndex = indicesToFix[i];
    const movie = heroData.movies[movieIndex];
    
    console.log(`\n${'─'.repeat(70)}`);
    console.log(`[${i + 1}/${indicesToFix.length}] ${movie.title} (${movie.year})`);
    console.log(`Progress: ${Math.round((i + 1) / indicesToFix.length * 100)}%`);
    console.log(`Current TMDb ID: ${movie.tmdbId || 'MISSING'}`);
    console.log(`${'─'.repeat(70)}\n`);
    
    const match = findMatchingMovie(movie, tmdbMovies);
    
    if (match) {
      const confidenceColor = match.confidence >= 90 ? '🟢' : match.confidence >= 80 ? '🟡' : '🟠';
      
      console.log(`${confidenceColor} Auto-match found (${match.confidence}% confidence):`);
      console.log(`   Title: ${match.title}`);
      console.log(`   Original: ${match.original_title || 'N/A'}`);
      console.log(`   Year: ${new Date(match.release_date).getFullYear()}`);
      console.log(`   Language: ${match.original_language}`);
      console.log(`   TMDb ID: ${match.id}`);
      console.log(`   Rating: ${match.vote_average}/10\n`);
      
      if (movie.tmdbId === match.id) {
        console.log(`✅ Already correct - no change needed\n`);
        stats.unchanged++;
        continue;
      }
      
      const confirm = await ask(`Use this ID? (y=yes, n=search alternatives, s=skip): `);
      
      if (confirm.toLowerCase() === 'y') {
        heroData.movies[movieIndex].tmdbId = match.id;
        changes.push({
          movie: movie.title,
          year: movie.year,
          action: movie.tmdbId ? 'updated' : 'added',
          oldId: movie.tmdbId,
          newId: match.id,
          confidence: match.confidence
        });
        console.log(`✅ Updated to: ${match.id}\n`);
        stats.updated++;
        continue;
      } else if (confirm.toLowerCase() === 's') {
        console.log(`⏭️  Skipped\n`);
        stats.skipped++;
        continue;
      }
    }
    
    // Manual search
    console.log(`🔍 Searching TMDb alternatives...`);
    const results = await searchTMDbByTitle(movie.title, movie.year);
    
    if (results.length > 0) {
      console.log(`\n📋 Found ${results.length} results:\n`);
      
      if (movie.tmdbId) {
        console.log(`0. [KEEP CURRENT] ${movie.tmdbId}\n`);
      }
      
      results.forEach((r, idx) => {
        const year = r.release_date ? new Date(r.release_date).getFullYear() : 'N/A';
        const langEmoji = { 'te': '🎭', 'hi': '🇮🇳', 'ta': '🎥', 'en': '🇺🇸' }[r.original_language] || '🌍';
        const confidence = calculateMatchConfidence(movie, r);
        const confidenceColor = confidence >= 90 ? '🟢' : confidence >= 70 ? '🟡' : '🔴';
        
        console.log(`${idx + 1}. ${confidenceColor} ${r.title} (${year}) ${langEmoji}`);
        console.log(`   ├─ Match: ${confidence}%`);
        console.log(`   ├─ Language: ${r.original_language.toUpperCase()}`);
        console.log(`   ├─ Rating: ${r.vote_average}/10`);
        console.log(`   └─ TMDb ID: ${r.id}\n`);
      });
      
      const choice = await ask(`Select (0-${results.length}, custom ID, or Enter to skip): `);
      
      if (choice === '0' && movie.tmdbId) {
        console.log(`✓ Keeping existing ID: ${movie.tmdbId}\n`);
        stats.unchanged++;
        continue;
      }
      
      const choiceNum = parseInt(choice);
      if (choiceNum >= 1 && choiceNum <= results.length) {
        const selectedId = results[choiceNum - 1].id;
        heroData.movies[movieIndex].tmdbId = selectedId;
        changes.push({
          movie: movie.title,
          year: movie.year,
          action: 'manual',
          newId: selectedId
        });
        console.log(`✅ Updated to: ${selectedId}\n`);
        stats.updated++;
        continue;
      } else if (choice.trim() && !isNaN(choice)) {
        const customId = parseInt(choice);
        heroData.movies[movieIndex].tmdbId = customId;
        changes.push({
          movie: movie.title,
          year: movie.year,
          action: 'manual',
          newId: customId
        });
        console.log(`✅ Updated to: ${customId}\n`);
        stats.updated++;
        continue;
      }
    }
    
    console.log(`⏭️  Skipped\n`);
    stats.skipped++;
  }
  
  return { stats, changes };
}

// ============================================
// MAIN FUNCTION
// ============================================

async function updateTMDbIds(heroSlug) {
  const heroInfo = HEROES_DB[heroSlug];
  
  if (!heroInfo) {
    console.error(`\n❌ Error: Unknown hero '${heroSlug}'`);
    console.error(`\nAvailable heroes:`);
    Object.keys(HEROES_DB).forEach(slug => {
      console.error(`  - ${slug} (${HEROES_DB[slug].name})`);
    });
    console.error('');
    rl.close();
    return;
  }
  
  const heroPath = path.join(process.cwd(), 'public', 'data', 'heroes', `${heroSlug}.json`);
  
  if (!fs.existsSync(heroPath)) {
    console.error(`\n❌ Error: Hero file not found: ${heroPath}\n`);
    rl.close();
    return;
  }
  
  const heroData = JSON.parse(fs.readFileSync(heroPath, 'utf8'));
  
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log(`║  🚀 TMDb ID UPDATER - ${heroInfo.name.toUpperCase().padEnd(37)}║`);
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  // Fetch TMDb data
  console.log(`\n🔍 Fetching movies from TMDb (Person ID: ${heroInfo.tmdbId})...`);
  const tmdbData = await fetchActorMovies(heroInfo.tmdbId);
  
  if (!tmdbData.cast || !Array.isArray(tmdbData.cast)) {
    console.error(`\n❌ No TMDb data found\n`);
    rl.close();
    return;
  }
  
  console.log(`✅ Fetched ${tmdbData.cast.length} movies from TMDb`);
  
  // Find matches
  console.log(`\n🔍 Analyzing matches...`);
  const matches = heroData.movies
    .map(m => findMatchingMovie(m, tmdbData.cast))
    .filter(m => m !== null);
  
  displaySummary(heroData, tmdbData, matches);
  
  // Select mode
  console.log('🎯 MODES:');
  console.log('  1) Auto - Update all with confidence >= 70%');
  console.log('  2) Interactive - Review each movie');
  console.log('  3) Missing only - Only add missing IDs');
  console.log('  4) Dry run - Preview changes without saving');
  console.log('  5) Exit\n');
  
  const mode = await ask('Select mode (1-5): ');
  
  if (mode === '5') {
    console.log('👋 Exiting...\n');
    rl.close();
    return;
  }
  
  // Create backup
  const backupPath = createBackup(heroPath);
  console.log(`\n💾 Backup created: ${path.basename(backupPath)}`);
  
  let result;
  const dryRun = mode === '4';
  
  if (mode === '1' || mode === '4') {
    result = await processAutoMode(heroData, tmdbData.cast, dryRun);
  } else if (mode === '2' || mode === '3') {
    let indicesToFix;
    
    if (mode === '3') {
      indicesToFix = heroData.movies
        .map((m, idx) => ({ movie: m, idx }))
        .filter(({ movie }) => !movie.tmdbId)
        .map(({ idx }) => idx);
    } else {
      showMovieList(heroData.movies, `${heroInfo.name.toUpperCase()} - SELECT MOVIES`);
      console.log(`Options:`);
      console.log(`  • Numbers: 1,3,5 or ranges: 1-5`);
      console.log(`  • 'all' = all movies`);
      console.log(`  • 'missing' = missing IDs only\n`);
      
      const selection = await ask(`Select: `);
      
      if (selection.toLowerCase() === 'missing') {
        indicesToFix = heroData.movies
          .map((m, idx) => ({ movie: m, idx }))
          .filter(({ movie }) => !movie.tmdbId)
          .map(({ idx }) => idx);
      } else {
        indicesToFix = parseSelection(selection, heroData.movies.length);
      }
    }
    
    if (indicesToFix.length === 0) {
      console.log('\n✅ No movies to process!\n');
      rl.close();
      return;
    }
    
    console.log(`\n✅ Selected ${indicesToFix.length} movie(s)\n`);
    result = await processInteractiveMode(heroData, tmdbData.cast, indicesToFix);
  }
  
  // Save changes
  if (!dryRun && result) {
    fs.writeFileSync(heroPath, JSON.stringify(heroData, null, 2));
    
    // Save change log
    if (result.changes && result.changes.length > 0) {
      const logPath = path.join(process.cwd(), 'logs', 'tmdb-updates.json');
      const logDir = path.dirname(logPath);
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      
      const existingLog = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath, 'utf8')) : [];
      existingLog.push({
        hero: heroInfo.name,
        timestamp: new Date().toISOString(),
        changes: result.changes
      });
      
      fs.writeFileSync(logPath, JSON.stringify(existingLog, null, 2));
    }
  }
  
  // Final summary
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`${dryRun ? '📋 DRY RUN COMPLETE' : '🎉 UPDATE COMPLETE'}`);
  console.log(`${'═'.repeat(60)}`);
  
  const stats = result.stats;
  if (stats.added !== undefined) {
    console.log(`✨ Added: ${stats.added || 0}`);
    console.log(`🔄 Updated: ${stats.updated || 0}`);
    console.log(`✓ Unchanged: ${stats.unchanged || 0}`);
    console.log(`⚠️  Not found: ${stats.notFound || 0}`);
  } else {
    console.log(`✨ Updated: ${stats.updated || 0}`);
    console.log(`✓ Unchanged: ${stats.unchanged || 0}`);
    console.log(`⏭️  Skipped: ${stats.skipped || 0}`);
  }
  
  if (!dryRun) {
    console.log(`💾 Saved to: ${heroPath}`);
    console.log(`📦 Backup: ${backupPath}`);
    if (result.changes && result.changes.length > 0) {
      console.log(`📝 Change log: logs/tmdb-updates.json`);
    }
  } else {
    console.log(`\n💡 This was a dry run. No changes were saved.`);
    console.log(`Run without mode 4 to apply changes.`);
  }
  
  console.log('');
  rl.close();
}

// ============================================
// COMMAND LINE INTERFACE
// ============================================

const heroSlug = process.argv[2];

if (!heroSlug) {
  console.log('\n📖 USAGE:');
  console.log('  node scripts/update-tmdb-ids.js <hero-slug>\n');
  console.log('AVAILABLE HEROES:');
  Object.entries(HEROES_DB).forEach(([slug, info]) => {
    console.log(`  • ${slug.padEnd(15)} (${info.name})`);
  });
  console.log('\nEXAMPLE:');
  console.log('  node scripts/update-tmdb-ids.js prabhas\n');
  process.exit(0);
}

updateTMDbIds(heroSlug);
