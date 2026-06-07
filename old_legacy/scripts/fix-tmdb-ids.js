// scripts/fix-tmdb-ids.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ============================================
// CONFIGURATION
// ============================================

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

if (!TMDB_API_KEY) {
  console.error('❌ Error: NEXT_PUBLIC_TMDB_API_KEY not found in .env!');
  console.error('Please add your TMDb API key to .env');
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ============================================
// HELPER FUNCTIONS
// ============================================

function ask(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function calculateMatchConfidence(movie, tmdbResult) {
  let score = 0;
  
  // Title match (0-50 points)
  const movieTitle = movie.title.toLowerCase().trim();
  const tmdbTitle = tmdbResult.title.toLowerCase().trim();
  const tmdbOriginalTitle = (tmdbResult.original_title || '').toLowerCase().trim();
  
  if (movieTitle === tmdbTitle || movieTitle === tmdbOriginalTitle) {
    score += 50;
  } else if (tmdbTitle.includes(movieTitle) || movieTitle.includes(tmdbTitle)) {
    score += 30;
  } else if (tmdbOriginalTitle.includes(movieTitle) || movieTitle.includes(tmdbOriginalTitle)) {
    score += 25;
  }
  
  // Year match (0-30 points)
  if (tmdbResult.release_date) {
    const tmdbYear = new Date(tmdbResult.release_date).getFullYear();
    const yearDiff = Math.abs(movie.year - tmdbYear);
    if (yearDiff === 0) {
      score += 30;
    } else if (yearDiff === 1) {
      score += 20;
    } else if (yearDiff === 2) {
      score += 10;
    }
  }
  
  // Language bonus (0-20 points)
  if (tmdbResult.original_language === 'te') {
    score += 20;
  } else if (tmdbResult.original_language === 'hi') {
    score += 10;
  }
  
  return Math.min(100, score);
}

function createBackup(heroPath) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const heroName = path.basename(heroPath, '.json');
  const backupDir = path.join(process.cwd(), 'backups', 'tmdb-fixes');
  
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
    const key = `${movie.title}-${movie.year}`;
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

// ============================================
// NEW: Collect all movies from all arrays
// ============================================

function collectAllMovies(heroData) {
  const allMovies = [];
  
  // Main movies array
  if (heroData.movies && Array.isArray(heroData.movies)) {
    heroData.movies.forEach((movie, idx) => {
      allMovies.push({
        movie,
        source: 'movies',
        index: idx,
        label: `[LEAD] ${movie.title} (${movie.year})`
      });
    });
  }
  
  // Cameo appearances
  if (heroData.cameoAppearances && Array.isArray(heroData.cameoAppearances)) {
    heroData.cameoAppearances.forEach((movie, idx) => {
      allMovies.push({
        movie,
        source: 'cameoAppearances',
        index: idx,
        label: `[CAMEO] ${movie.title} (${movie.year})`
      });
    });
  }
  
  // Voice-over appearances
  if (heroData.voiceOverAppearances && Array.isArray(heroData.voiceOverAppearances)) {
    heroData.voiceOverAppearances.forEach((movie, idx) => {
      allMovies.push({
        movie,
        source: 'voiceOverAppearances',
        index: idx,
        label: `[VOICE] ${movie.title} (${movie.year})`
      });
    });
  }
  
  // Upcoming movies
  if (heroData.upcoming && Array.isArray(heroData.upcoming)) {
    heroData.upcoming.forEach((movie, idx) => {
      allMovies.push({
        movie,
        source: 'upcoming',
        index: idx,
        label: `[UPCOMING] ${movie.title} (${movie.year || 'TBA'})`
      });
    });
  }
  
  return allMovies;
}

// ============================================
// TMDB API FUNCTIONS (UPDATED - DETECT TV)
// ============================================

async function getTMDbDetails(tmdbId) {
  try {
    await delay(250); // Rate limiting
    const url = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    
    return {
      id: data.id,
      title: data.title,
      originalTitle: data.original_title,
      year: new Date(data.release_date).getFullYear(),
      language: data.original_language,
      genres: data.genres?.map(g => g.name).join(', ') || 'N/A',
      rating: data.vote_average,
      overview: data.overview?.substring(0, 150) + '...',
      posterPath: data.poster_path,
      mediaType: 'movie'
    };
  } catch (error) {
    return null;
  }
}

async function searchTMDb(title, year) {
  try {
    await delay(250); // Rate limiting
    // Search BOTH movies AND TV series
    const movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&year=${year || ''}&language=te-IN`;
    const tvUrl = `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&first_air_date_year=${year || ''}&language=te-IN`;
    
    const [movieRes, tvRes] = await Promise.all([
      fetch(movieUrl),
      fetch(tvUrl)
    ]);
    
    const movieData = await movieRes.json();
    const tvData = await tvRes.json();
    
    // Combine results with media_type
    const movies = (movieData.results || []).map(r => ({ ...r, media_type: 'movie' }));
    const tvShows = (tvData.results || []).map(r => ({ ...r, media_type: 'tv', title: r.name, release_date: r.first_air_date }));
    
    // Sort by popularity
    const combined = [...movies, ...tvShows].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    
    return combined.slice(0, 10); // Top 10 results
  } catch (error) {
    console.error('⚠️  Search failed:', error.message);
    return [];
  }
}

// ============================================
// NEW: LIST ALL MOVIES MODE
// ============================================

async function listAllMoviesMode(heroData, allMovies, heroPath) {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                   📋 ALL MOVIES LIST                      ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  // Group by source
  const grouped = {
    movies: allMovies.filter(m => m.source === 'movies'),
    cameoAppearances: allMovies.filter(m => m.source === 'cameoAppearances'),
    voiceOverAppearances: allMovies.filter(m => m.source === 'voiceOverAppearances'),
    upcoming: allMovies.filter(m => m.source === 'upcoming')
  };
  
  const displayMovies = [];
  let displayIndex = 1;
  
  Object.entries(grouped).forEach(([source, movies]) => {
    if (movies.length > 0) {
      console.log(`\n🎬 ${source.toUpperCase().replace('APPEARANCES', '')}:\n`);
      movies.forEach(({ movie, label }, idx) => {
        const warning = !movie.tmdbId || movie.tmdbId === 0 ? ' ⚠️  NO ID' : '';
        console.log(`  ${displayIndex}. ${movie.title} (${movie.year}) - ID: ${movie.tmdbId || 'MISSING'}${warning}`);
        displayMovies.push({ ...movies[idx], displayIndex });
        displayIndex++;
      });
    }
  });
  
  console.log(`\n${'─'.repeat(60)}\n`);
  console.log(`Total: ${displayMovies.length} movies\n`);
  
  const choice = await ask('Enter movie number to edit (or Enter to exit): ');
  const choiceNum = parseInt(choice);
  
  if (!choiceNum || choiceNum < 1 || choiceNum > displayMovies.length) {
    console.log('👋 Exiting list mode...\n');
    return;
  }
  
  const selected = displayMovies.find(m => m.displayIndex === choiceNum);
  if (!selected) return;
  
  const { movie, source, index: sourceIndex, label } = selected;
  
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`EDITING: ${label}`);
  console.log(`${'═'.repeat(60)}`);
  console.log(`Current TMDb ID: ${movie.tmdbId || 'MISSING'}`);
  console.log(`Source: ${source}\n`);
  
  // Get current details if ID exists
  if (movie.tmdbId && movie.tmdbId > 0) {
    const details = await getTMDbDetails(movie.tmdbId);
    if (details) {
      console.log(`✅ Current TMDB Match:`);
      console.log(`   Title: ${details.title}`);
      console.log(`   Year: ${details.year}`);
      console.log(`   Language: ${details.language.toUpperCase()}`);
      console.log(`   Rating: ${details.rating}/10`);
      console.log(`   Type: ${details.mediaType.toUpperCase()}\n`);
    } else {
      console.log(`❌ Current ID ${movie.tmdbId} is INVALID\n`);
    }
  }
  
  // Search for alternatives
  console.log(`Searching TMDB for "${movie.title}" (${movie.year})...\n`);
  const results = await searchTMDb(movie.title, movie.year);
  
  if (results.length === 0) {
    console.log(`❌ No results found`);
    const manualId = await ask(`Enter TMDb ID manually (or Enter to skip): `);
    if (manualId.trim()) {
      movie.tmdbId = parseInt(manualId);
      heroData[source][sourceIndex] = movie;
      fs.writeFileSync(heroPath, JSON.stringify(heroData, null, 2));
      console.log(`✅ Updated to ID: ${movie.tmdbId}\n`);
    }
    return;
  }
  
  // Show results with confidence
  const resultsWithConfidence = results.map(r => ({
    ...r,
    confidence: calculateMatchConfidence(movie, r)
  })).sort((a, b) => b.confidence - a.confidence);
  
  console.log(`📋 Found ${resultsWithConfidence.length} results:\n`);
  
  resultsWithConfidence.forEach((r, idx) => {
    const year = r.release_date ? new Date(r.release_date).getFullYear() : 'N/A';
    const langEmoji = { 'te': '🎭', 'hi': '🇮🇳', 'ta': '🎥', 'en': '🇺🇸' }[r.original_language] || '🌍';
    const confidenceColor = r.confidence >= 80 ? '🟢' : r.confidence >= 60 ? '🟡' : '🔴';
    const typeIcon = r.media_type === 'tv' ? '📺' : '🎬';
    const isCurrent = r.id === movie.tmdbId ? ' ✅ CURRENT' : '';
    
    console.log(`${idx + 1}. ${confidenceColor} ${typeIcon} ${r.title} (${year}) ${langEmoji}${isCurrent}`);
    console.log(`   ├─ Confidence: ${r.confidence}%`);
    console.log(`   ├─ Language: ${r.original_language.toUpperCase()}`);
    console.log(`   ├─ Type: ${r.media_type.toUpperCase()}`);
    console.log(`   ├─ Rating: ${r.vote_average || 'N/A'}/10`);
    console.log(`   └─ TMDb ID: ${r.id}\n`);
  });
  
  const newChoice = await ask(`\nSelect number (1-${resultsWithConfidence.length}), Enter to skip, or custom ID: `);
  const newChoiceNum = parseInt(newChoice);
  
  const originalId = movie.tmdbId;
  
  if (newChoiceNum >= 1 && newChoiceNum <= resultsWithConfidence.length) {
    movie.tmdbId = resultsWithConfidence[newChoiceNum - 1].id;
    console.log(`✅ TMDb ID updated: ${originalId} → ${movie.tmdbId}`);
  } else if (newChoice.trim() && !isNaN(newChoice)) {
    movie.tmdbId = parseInt(newChoice);
    console.log(`✅ TMDb ID updated: ${originalId} → ${movie.tmdbId}`);
  } else {
    console.log(`⏭️  No changes made`);
    return;
  }
  
  // Save changes
  heroData[source][sourceIndex] = movie;
  fs.writeFileSync(heroPath, JSON.stringify(heroData, null, 2));
  console.log(`💾 Saved to ${heroPath}\n`);
  
  // Ask to edit another
  const continueEdit = await ask('Edit another movie? (y/N): ');
  if (continueEdit.toLowerCase() === 'y') {
    await listAllMoviesMode(heroData, collectAllMovies(heroData), heroPath);
  }
}

// ============================================
// PRE-SCAN FUNCTION
// ============================================

async function preScanMovies(allMovies) {
  console.log('\n🔍 Scanning all movies (Lead, Cameo, Voice-Over, Upcoming)...\n');
  
  const issues = {
    missing: [],
    invalid: [],
    lowConfidence: [],
    duplicates: [],
    tvSeries: []
  };
  
  // Check for duplicates
  const movieList = allMovies.map(m => m.movie);
  issues.duplicates = detectDuplicates(movieList);
  
  for (let i = 0; i < allMovies.length; i++) {
    const { movie, label } = allMovies[i];
    process.stdout.write(`\rScanning... ${i + 1}/${allMovies.length} (${Math.round((i + 1) / allMovies.length * 100)}%)`);
    
    if (!movie.tmdbId || movie.tmdbId === 0) {
      issues.missing.push(i);
    } else {
      const details = await getTMDbDetails(movie.tmdbId);
      if (!details) {
        // Try TV series
        try {
          await delay(250);
          const tvUrl = `https://api.themoviedb.org/3/tv/${movie.tmdbId}?api_key=${TMDB_API_KEY}`;
          const tvRes = await fetch(tvUrl);
          if (tvRes.ok) {
            issues.tvSeries.push(i);
            continue;
          }
        } catch (e) {}
        
        issues.invalid.push(i);
      } else {
        const confidence = calculateMatchConfidence(movie, {
          title: details.title,
          original_title: details.originalTitle,
          release_date: `${details.year}-01-01`,
          original_language: details.language
        });
        
        if (confidence < 70) {
          issues.lowConfidence.push({ index: i, confidence });
        }
      }
    }
  }
  
  console.log('\r' + ' '.repeat(50) + '\r'); // Clear line
  
  return issues;
}

function displaySummary(heroData, allMovies, issues) {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log(`║  📊 SUMMARY FOR: ${heroData.name.toUpperCase().padEnd(40)}║`);
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  const leadCount = allMovies.filter(m => m.source === 'movies').length;
  const cameoCount = allMovies.filter(m => m.source === 'cameoAppearances').length;
  const voiceCount = allMovies.filter(m => m.source === 'voiceOverAppearances').length;
  const upcomingCount = allMovies.filter(m => m.source === 'upcoming').length;
  
  console.log(`  🎬 Total Movies: ${allMovies.length}`);
  console.log(`     ├─ Lead Movies: ${leadCount}`);
  console.log(`     ├─ Cameo Appearances: ${cameoCount}`);
  console.log(`     ├─ Voice-Over: ${voiceCount}`);
  console.log(`     └─ Upcoming: ${upcomingCount}`);
  console.log(`\n  ❌ Missing TMDb IDs: ${issues.missing.length}`);
  console.log(`  ⚠️  Invalid TMDb IDs: ${issues.invalid.length}`);
  console.log(`  📺 TV Series (should be movie): ${issues.tvSeries.length}`);
  console.log(`  🔸 Low Confidence Matches: ${issues.lowConfidence.length}`);
  console.log(`  📝 Duplicate Movies: ${issues.duplicates.length}`);
  
  const totalIssues = issues.missing.length + issues.invalid.length + issues.lowConfidence.length + issues.tvSeries.length;
  console.log(`\n  🎯 Total Issues to Fix: ${totalIssues}\n`);
  
  if (issues.tvSeries.length > 0) {
    console.log('  ⚠️  TV SERIES DETECTED (should use movie ID):');
    issues.tvSeries.forEach(idx => {
      console.log(`     - ${allMovies[idx].label} (ID: ${allMovies[idx].movie.tmdbId})`);
    });
    console.log('');
  }
  
  if (issues.duplicates.length > 0) {
    console.log('  ⚠️  DUPLICATES DETECTED:');
    issues.duplicates.forEach(dup => {
      console.log(`     - "${dup.title}" (${dup.year}) appears multiple times`);
    });
    console.log('');
  }
  
  console.log('─'.repeat(60) + '\n');
}

// ============================================
// MAIN FUNCTION (UPDATED WITH LIST MODE)
// ============================================

async function fixTMDbIds(heroSlug) {
  const heroPath = path.join(process.cwd(), 'public', 'data', 'heroes', `${heroSlug}.json`);
  
  if (!fs.existsSync(heroPath)) {
    console.error(`❌ Error: Hero file not found: ${heroPath}`);
    console.error(`Available heroes: prabhas, mahesh-babu, jr-ntr, etc.`);
    rl.close();
    return;
  }
  
  const heroData = JSON.parse(fs.readFileSync(heroPath, 'utf8'));
  
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log(`║  🔧 TMDb ID FIXER - ${heroData.name.toUpperCase().padEnd(43)}║`);
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  // Create backup
  const backupPath = createBackup(heroPath);
  console.log(`\n💾 Backup created: ${path.basename(backupPath)}`);
  
  // Collect all movies from all arrays
  const allMovies = collectAllMovies(heroData);
  console.log(`\n📦 Found ${allMovies.length} total movies across all categories`);
  
  // Pre-scan for issues
  const issues = await preScanMovies(allMovies);
  displaySummary(heroData, allMovies, issues);
  
  // Ask mode
  console.log('🎯 MODES:');
  console.log('  1) Fix all issues (auto-select best matches)');
  console.log('  2) Interactive mode (review each issue)');
  console.log('  3) Only fix missing IDs');
  console.log('  4) Only fix invalid IDs');
  console.log('  5) List all movies (browse and edit any movie)');
  console.log('  6) Exit\n');
  
  const mode = await ask('Select mode (1-6): ');
  
  if (mode === '6') {
    console.log('👋 Exiting...\n');
    rl.close();
    return;
  }
  
  if (mode === '5') {
    await listAllMoviesMode(heroData, allMovies, heroPath);
    rl.close();
    return;
  }
  
  let moviesToFix = [];
  
  if (mode === '3') {
    moviesToFix = issues.missing;
  } else if (mode === '4') {
    moviesToFix = [...issues.invalid, ...issues.tvSeries];
  } else {
    moviesToFix = [...issues.missing, ...issues.invalid, ...issues.tvSeries, ...issues.lowConfidence.map(i => i.index)];
  }
  
  if (moviesToFix.length === 0) {
    console.log('✅ No issues to fix! All movies have valid TMDb IDs.\n');
    rl.close();
    return;
  }
  
  const autoMode = mode === '1';
  
  let fixed = 0;
  let skipped = 0;
  const changeLog = [];
  
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`🚀 Starting fixes... (${moviesToFix.length} movies to process)`);
  console.log(`${'═'.repeat(60)}\n`);
  
  for (let i = 0; i < moviesToFix.length; i++) {
    const movieIndex = moviesToFix[i];
    const { movie, source, index: sourceIndex, label } = allMovies[movieIndex];
    const originalTmdbId = movie.tmdbId;
    
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`[${i + 1}/${moviesToFix.length}] ${label}`);
    console.log(`Source: ${source}`);
    console.log(`Progress: ${Math.round((i + 1) / moviesToFix.length * 100)}%`);
    console.log(`Current TMDb ID: ${movie.tmdbId || 'MISSING'}`);
    console.log(`${'─'.repeat(60)}\n`);
    
    // Search for alternatives
    const results = await searchTMDb(movie.title, movie.year);
    
    if (results.length === 0) {
      console.log(`❌ No results found on TMDb`);
      if (!autoMode) {
        const manualId = await ask(`Enter TMDb ID manually (or Enter to skip): `);
        if (manualId.trim()) {
          movie.tmdbId = parseInt(manualId);
          changeLog.push({ movie: label, from: originalTmdbId, to: movie.tmdbId, method: 'manual' });
          fixed++;
        } else {
          skipped++;
        }
      } else {
        skipped++;
      }
      continue;
    }
    
    // Calculate confidence for each result
    const resultsWithConfidence = results.map(r => ({
      ...r,
      confidence: calculateMatchConfidence(movie, r)
    })).sort((a, b) => b.confidence - a.confidence);
    
    // Filter movies only (no TV series) for auto mode
    const movieResults = autoMode ? resultsWithConfidence.filter(r => r.media_type === 'movie') : resultsWithConfidence;
    
    console.log(`📋 Found ${movieResults.length} results:\n`);
    
    movieResults.forEach((r, idx) => {
      const year = r.release_date ? new Date(r.release_date).getFullYear() : 'N/A';
      const langEmoji = { 'te': '🎭', 'hi': '🇮🇳', 'ta': '🎥', 'en': '🇺🇸' }[r.original_language] || '🌍';
      const confidenceColor = r.confidence >= 80 ? '🟢' : r.confidence >= 60 ? '🟡' : '🔴';
      const typeIcon = r.media_type === 'tv' ? '📺 TV' : '🎬 MOVIE';
      
      console.log(`${idx + 1}. ${confidenceColor} ${typeIcon} ${r.title} (${year}) ${langEmoji}`);
      console.log(`   ├─ Confidence: ${r.confidence}%`);
      console.log(`   ├─ Language: ${r.original_language.toUpperCase()}`);
      console.log(`   ├─ Rating: ${r.vote_average || 'N/A'}/10`);
      console.log(`   └─ TMDb ID: ${r.id}\n`);
    });
    
    if (autoMode) {
      // Auto-select best MOVIE match if confidence >= 80%
      const bestMatch = movieResults[0];
      if (bestMatch && bestMatch.confidence >= 80 && bestMatch.media_type === 'movie') {
        movie.tmdbId = bestMatch.id;
        console.log(`✅ Auto-selected: ${bestMatch.title} (${bestMatch.confidence}% match)`);
        changeLog.push({ movie: label, from: originalTmdbId, to: movie.tmdbId, confidence: bestMatch.confidence, method: 'auto' });
        fixed++;
      } else {
        console.log(`⏭️  Skipped - Low confidence or no movie found`);
        skipped++;
      }
    } else {
      // Interactive mode
      const choice = await ask(`\nSelect number (1-${movieResults.length}), Enter to skip, or custom ID: `);
      const choiceNum = parseInt(choice);
      
      if (choiceNum >= 1 && choiceNum <= movieResults.length) {
        movie.tmdbId = movieResults[choiceNum - 1].id;
        console.log(`✅ TMDb ID set to: ${movie.tmdbId}`);
        changeLog.push({ movie: label, from: originalTmdbId, to: movie.tmdbId, method: 'manual' });
        fixed++;
      } else if (choice.trim() && !isNaN(choice)) {
        movie.tmdbId = parseInt(choice);
        console.log(`✅ TMDb ID set to: ${movie.tmdbId}`);
        changeLog.push({ movie: label, from: originalTmdbId, to: movie.tmdbId, method: 'manual' });
        fixed++;
      } else {
        console.log(`⏭️  Skipped`);
        skipped++;
      }
    }
    
    // Update the movie in the correct array
    heroData[source][sourceIndex] = movie;
    
    // Save after each movie
    fs.writeFileSync(heroPath, JSON.stringify(heroData, null, 2));
  }
  
  // Final summary
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`🎉 COMPLETE!`);
  console.log(`${'═'.repeat(60)}`);
  console.log(`✅ Fixed/Updated: ${fixed}`);
  console.log(`⏭️  Skipped (unchanged): ${skipped}`);
  console.log(`💾 Saved to: ${heroPath}`);
  console.log(`📦 Backup: ${backupPath}\n`);
  
  // Save change log
  if (changeLog.length > 0) {
    const logPath = path.join(process.cwd(), 'logs', 'tmdb-fixes.json');
    const logDir = path.dirname(logPath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    const existingLog = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath, 'utf8')) : [];
    existingLog.push({
      hero: heroData.name,
      timestamp: new Date().toISOString(),
      changes: changeLog
    });
    
    fs.writeFileSync(logPath, JSON.stringify(existingLog, null, 2));
    console.log(`📝 Change log saved: ${logPath}\n`);
  }
  
  rl.close();
}

// ============================================
// COMMAND LINE INTERFACE
// ============================================

const heroSlug = process.argv[2];

if (!heroSlug) {
  console.log('\n📖 USAGE:');
  console.log('  node scripts/fix-tmdb-ids.js <hero-slug>\n');
  console.log('EXAMPLE:');
  console.log('  node scripts/fix-tmdb-ids.js prabhas');
  console.log('  node scripts/fix-tmdb-ids.js mahesh-babu\n');
  process.exit(0);
}

fixTMDbIds(heroSlug);
