// scripts/smart-poster-finder.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process');

// ============================================
// CONFIGURATION
// ============================================

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const OMDB_API_KEY = process.env.OMDB_API_KEY; // Get free at omdbapi.com

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

function openBrowser(url) {
  const platform = process.platform;
  let command;

  if (platform === 'darwin') {
    command = `open "${url}"`;
  } else if (platform === 'win32') {
    command = `start "" "${url}"`;
  } else {
    command = `xdg-open "${url}"`;
  }

  exec(command, (error) => {
    if (error) {
      console.log('⚠️  Could not auto-open browser. Copy URL manually.');
    }
  });
}

async function validatePosterUrl(url) {
  if (!url || url.includes('placehold') || url.includes('example.com')) {
    return false;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    return response.ok && contentType && contentType.includes('image');
  } catch (error) {
    return false;
  }
}

function createBackup(heroPath) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const heroName = path.basename(heroPath, '.json');
  const backupDir = path.join(process.cwd(), 'backups', 'poster-fixes');

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const backupPath = path.join(backupDir, `${heroName}-backup-${timestamp}.json`);
  fs.copyFileSync(heroPath, backupPath);

  return backupPath;
}

// ============================================
// SOURCE 1: TMDb
// ============================================

async function getTMDbPoster(tmdbId) {
  if (!tmdbId) return null;

  try {
    await delay(250); // Rate limiting
    const url = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) return null;

    const data = await response.json();

    return {
      source: 'TMDb',
      poster: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null,
      posterHD: data.poster_path ? `https://image.tmdb.org/t/p/original${data.poster_path}` : null,
      title: data.title,
      originalTitle: data.original_title,
      year: new Date(data.release_date).getFullYear(),
      language: data.original_language,
      genres: data.genres?.map(g => g.name).join(', ') || 'N/A',
      rating: data.vote_average || 'N/A',
      overview: data.overview?.substring(0, 150) + '...' || 'N/A'
    };
  } catch (error) {
    return null;
  }
}

// ============================================
// SOURCE 2: OMDb (IMDb data)
// ============================================

async function getOMDbPoster(title, year) {
  if (!OMDB_API_KEY) return null;

  try {
    await delay(250);
    const url = `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&y=${year}&apikey=${OMDB_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === 'False') return null;

    return {
      source: 'OMDb/IMDb',
      poster: data.Poster && data.Poster !== 'N/A' ? data.Poster : null,
      title: data.Title,
      year: data.Year,
      language: data.Language,
      genres: data.Genre,
      imdbRating: data.imdbRating || 'N/A',
      plot: data.Plot?.substring(0, 150) + '...' || 'N/A'
    };
  } catch (error) {
    return null;
  }
}

// ============================================
// SOURCE 3: Google Image Search
// ============================================

function getGoogleImageSearchUrl(title, year) {
  const query = `${title} ${year} telugu movie poster`;
  return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
}

// ============================================
// SOURCE 4: Multiple TMDb Images
// ============================================

async function getTMDbImages(tmdbId) {
  if (!tmdbId) return null;

  try {
    await delay(250);
    const url = `https://api.themoviedb.org/3/movie/${tmdbId}/images?api_key=${TMDB_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) return null;

    const data = await response.json();
    
    return {
      posters: data.posters?.slice(0, 5).map(p => ({
        url: `https://image.tmdb.org/t/p/w500${p.file_path}`,
        language: p.iso_639_1,
        voteAverage: p.vote_average
      })) || [],
      backdrops: data.backdrops?.slice(0, 3).map(b => ({
        url: `https://image.tmdb.org/t/p/w780${b.file_path}`
      })) || []
    };
  } catch (error) {
    return null;
  }
}

// ============================================
// MAIN VERIFICATION FUNCTION
// ============================================

async function findAndVerifyPoster(movie, options = {}) {
  console.log(`\n${'═'.repeat(70)}`);
  console.log(`🎬 Finding poster for: ${movie.title} (${movie.year})`);
  console.log(`${'═'.repeat(70)}\n`);

  if (movie.poster && !options.replaceExisting) {
    console.log(`ℹ️  Current poster: ${movie.poster.substring(0, 60)}...`);
    
    // Validate current poster
    console.log(`🔍 Validating current poster...`);
    const isValid = await validatePosterUrl(movie.poster);
    
    if (isValid) {
      console.log(`✅ Current poster is valid and working!`);
      const keep = await ask(`Keep current poster? (y/n): `);
      if (keep.toLowerCase() === 'y') {
        return { poster: movie.poster, source: 'existing' };
      }
    } else {
      console.log(`❌ Current poster URL is broken/invalid!`);
    }
  }

  let selectedPoster = null;
  let selectedSource = null;

  // ========================================
  // TRY 1: TMDb Primary Poster
  // ========================================
  if (movie.tmdbId) {
    console.log(`\n🔍 [1/5] Searching TMDb...`);
    const tmdbData = await getTMDbPoster(movie.tmdbId);

    if (tmdbData && tmdbData.poster) {
      console.log(`\n✅ FOUND on TMDb:`);
      console.log(`   Title:    ${tmdbData.title}`);
      console.log(`   Original: ${tmdbData.originalTitle}`);
      console.log(`   Year:     ${tmdbData.year}`);
      console.log(`   Language: ${tmdbData.language}`);
      console.log(`   Genres:   ${tmdbData.genres}`);
      console.log(`   Rating:   ${tmdbData.rating}/10`);
      console.log(`   Overview: ${tmdbData.overview}`);
      console.log(`\n🖼️  Standard: ${tmdbData.poster}`);
      console.log(`🖼️  HD:       ${tmdbData.posterHD}\n`);

      const answer = await ask(`Use TMDb poster? (y=yes, h=HD version, n=no): `);

      if (answer.toLowerCase() === 'y') {
        selectedPoster = tmdbData.poster;
        selectedSource = 'TMDb (Standard)';
      } else if (answer.toLowerCase() === 'h') {
        selectedPoster = tmdbData.posterHD;
        selectedSource = 'TMDb (HD)';
      }

      if (selectedPoster) {
        console.log(`✨ ${selectedSource} poster selected!`);
        return { poster: selectedPoster, source: selectedSource };
      }

      console.log(`❌ TMDb poster rejected. Trying next source...\n`);
    } else {
      console.log(`⚠️  No poster on TMDb\n`);
    }
  } else {
    console.log(`\n⚠️  No TMDb ID available. Skipping TMDb sources.\n`);
  }

  // ========================================
  // TRY 2: TMDb Alternative Posters
  // ========================================
  if (movie.tmdbId) {
    console.log(`🔍 [2/5] Searching TMDb alternative posters...`);
    const tmdbImages = await getTMDbImages(movie.tmdbId);

    if (tmdbImages && tmdbImages.posters.length > 0) {
      console.log(`\n✅ Found ${tmdbImages.posters.length} alternative posters:\n`);
      
      tmdbImages.posters.forEach((p, idx) => {
        console.log(`${idx + 1}. ${p.url}`);
        console.log(`   Language: ${p.language || 'unknown'} | Rating: ${p.voteAverage}/10\n`);
      });

      const choice = await ask(`Select number (1-${tmdbImages.posters.length}) or Enter to skip: `);
      const choiceNum = parseInt(choice);

      if (choiceNum >= 1 && choiceNum <= tmdbImages.posters.length) {
        selectedPoster = tmdbImages.posters[choiceNum - 1].url;
        selectedSource = 'TMDb (Alternative)';
        console.log(`✨ ${selectedSource} poster selected!`);
        return { poster: selectedPoster, source: selectedSource };
      }
    } else {
      console.log(`⚠️  No alternative posters found\n`);
    }
  }

  // ========================================
  // TRY 3: OMDb/IMDb
  // ========================================
  console.log(`🔍 [3/5] Searching OMDb/IMDb...`);
  const omdbData = await getOMDbPoster(movie.title, movie.year);

  if (omdbData && omdbData.poster) {
    console.log(`\n✅ FOUND on OMDb/IMDb:`);
    console.log(`   Title:       ${omdbData.title}`);
    console.log(`   Year:        ${omdbData.year}`);
    console.log(`   Language:    ${omdbData.language}`);
    console.log(`   Genres:      ${omdbData.genres}`);
    console.log(`   IMDb Rating: ${omdbData.imdbRating}/10`);
    console.log(`   Plot:        ${omdbData.plot}`);
    console.log(`\n🖼️  Poster: ${omdbData.poster}\n`);

    const answer = await ask(`Use OMDb poster? (y/n): `);

    if (answer.toLowerCase() === 'y') {
      selectedPoster = omdbData.poster;
      selectedSource = 'OMDb/IMDb';
      console.log(`✨ ${selectedSource} poster selected!`);
      return { poster: selectedPoster, source: selectedSource };
    } else {
      console.log(`❌ OMDb poster rejected. Trying next source...\n`);
    }
  } else {
    console.log(`⚠️  No poster on OMDb\n`);
  }

  // ========================================
  // TRY 4: Google Images (Auto-open browser)
  // ========================================
  console.log(`🔍 [4/5] Opening Google Image Search...`);
  const googleUrl = getGoogleImageSearchUrl(movie.title, movie.year);
  
  console.log(`\n🌐 URL: ${googleUrl}`);
  console.log(`🔄 Opening browser automatically...\n`);
  
  openBrowser(googleUrl);
  await delay(1000);

  const tryGoogle = await ask(`Did you find a poster on Google? (y/n): `);

  if (tryGoogle.toLowerCase() === 'y') {
    const posterUrl = await ask(`Paste the image URL here: `);

    if (posterUrl.trim()) {
      console.log(`\n🔍 Validating URL...`);
      const isValid = await validatePosterUrl(posterUrl.trim());
      
      if (isValid) {
        selectedPoster = posterUrl.trim();
        selectedSource = 'Google Images';
        console.log(`✨ ${selectedSource} poster selected!`);
        return { poster: selectedPoster, source: selectedSource };
      } else {
        console.log(`❌ URL validation failed. Image may not be accessible.\n`);
        const forceUse = await ask(`Use anyway? (y/n): `);
        if (forceUse.toLowerCase() === 'y') {
          selectedPoster = posterUrl.trim();
          selectedSource = 'Google Images (unvalidated)';
          return { poster: selectedPoster, source: selectedSource };
        }
      }
    }
  }

  // ========================================
  // TRY 5: Manual Upload/Custom URL
  // ========================================
  console.log(`\n🔍 [5/5] Manual entry...`);
  console.log(`\n⚠️  No poster found automatically.`);
  console.log(`You can provide:`);
  console.log(`  • Supabase URL`);
  console.log(`  • Cloudinary URL`);
  console.log(`  • Any direct image URL\n`);
  
  const manualUrl = await ask(`Enter custom URL (or Enter to skip): `);

  if (manualUrl.trim()) {
    console.log(`\n🔍 Validating URL...`);
    const isValid = await validatePosterUrl(manualUrl.trim());
    
    if (isValid || (await ask(`Validation failed. Use anyway? (y/n): `)).toLowerCase() === 'y') {
      selectedPoster = manualUrl.trim();
      selectedSource = 'Manual Entry';
      console.log(`✨ ${selectedSource} poster added!`);
      return { poster: selectedPoster, source: selectedSource };
    }
  }

  console.log(`\n⏭️  Skipped - No poster set`);
  return null;
}

// ============================================
// PRE-SCAN FUNCTION
// ============================================

async function scanPosters(movies) {
  console.log(`\n🔍 Scanning posters...\n`);
  
  const report = {
    total: movies.length,
    hasPosters: 0,
    missingPosters: 0,
    placeholders: 0,
    broken: []
  };

  for (let i = 0; i < movies.length; i++) {
    process.stdout.write(`\rScanning... ${i + 1}/${movies.length}`);
    
    const movie = movies[i];
    
    if (!movie.poster) {
      report.missingPosters++;
    } else if (movie.poster.includes('placehold') || movie.poster.includes('example.com')) {
      report.placeholders++;
    } else {
      report.hasPosters++;
      
      // Validate existing poster (sample check - don't validate all)
      if (i % 10 === 0) { // Check every 10th poster
        const isValid = await validatePosterUrl(movie.poster);
        if (!isValid) {
          report.broken.push({ title: movie.title, index: i });
        }
      }
    }
  }

  console.log('\r' + ' '.repeat(50) + '\r');
  return report;
}

// ========================================
// PROCESS ALL MOVIES
// ========================================

async function processHeroPosters(heroSlug, options = {}) {
  const heroPath = path.join(process.cwd(), 'public', 'data', 'heroes', `${heroSlug}.json`);

  if (!fs.existsSync(heroPath)) {
    console.error(`❌ Error: Hero file not found: ${heroPath}`);
    rl.close();
    return;
  }

  const heroData = JSON.parse(fs.readFileSync(heroPath, 'utf8'));

  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log(`║  🖼️  SMART POSTER FINDER - ${heroData.name.toUpperCase().padEnd(37)}║`);
  console.log('╚════════════════════════════════════════════════════════════╝');

  // Create backup
  const backupPath = createBackup(heroPath);
  console.log(`\n💾 Backup created: ${path.basename(backupPath)}`);

  // Scan existing posters
  const report = await scanPosters(heroData.movies);

  console.log('\n📊 POSTER REPORT:');
  console.log(`  ✅ Has posters: ${report.hasPosters}`);
  console.log(`  ❌ Missing: ${report.missingPosters}`);
  console.log(`  ⚠️  Placeholders: ${report.placeholders}`);
  console.log(`  🔴 Broken (sampled): ${report.broken.length}\n`);

  if (report.broken.length > 0) {
    console.log('  Broken posters detected:');
    report.broken.forEach(b => console.log(`    - ${b.title}`));
    console.log('');
  }

  // Select mode
  console.log('🎯 MODES:');
  console.log('  1) Fix all missing/placeholder posters');
  console.log('  2) Fix only missing posters');
  console.log('  3) Replace all posters (fresh start)');
  console.log('  4) Custom selection (enter movie numbers)');
  console.log('  5) Exit\n');

  const mode = await ask('Select mode (1-5): ');

  if (mode === '5') {
    console.log('👋 Exiting...\n');
    rl.close();
    return;
  }

  let moviesToProcess = [];

  if (mode === '1') {
    moviesToProcess = heroData.movies
      .map((m, i) => ({ movie: m, index: i }))
      .filter(m => !m.movie.poster || m.movie.poster.includes('placehold'));
  } else if (mode === '2') {
    moviesToProcess = heroData.movies
      .map((m, i) => ({ movie: m, index: i }))
      .filter(m => !m.movie.poster);
  } else if (mode === '3') {
    options.replaceExisting = true;
    moviesToProcess = heroData.movies.map((m, i) => ({ movie: m, index: i }));
  } else if (mode === '4') {
    const selection = await ask('Enter movie numbers (e.g., 1,3,5 or 1-10): ');
    const indices = parseSelection(selection, heroData.movies.length);
    moviesToProcess = indices.map(i => ({ movie: heroData.movies[i], index: i }));
  }

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`🚀 Processing ${moviesToProcess.length} movies...`);
  console.log(`${'═'.repeat(60)}\n`);

  let updated = 0;
  let skipped = 0;
  const changeLog = [];

  for (let i = 0; i < moviesToProcess.length; i++) {
    const { movie, index } = moviesToProcess[i];
    
    console.log(`\n[${i + 1}/${moviesToProcess.length}] Progress: ${Math.round((i + 1) / moviesToProcess.length * 100)}%`);

    const result = await findAndVerifyPoster(movie, options);

    if (result) {
      heroData.movies[index].poster = result.poster;
      changeLog.push({ 
        movie: movie.title, 
        source: result.source,
        url: result.poster 
      });
      updated++;

      // Save after each update
      fs.writeFileSync(heroPath, JSON.stringify(heroData, null, 2));
      console.log(`💾 Saved!`);
    } else {
      skipped++;
    }
  }

  // Final summary
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`🎉 COMPLETE!`);
  console.log(`${'═'.repeat(60)}`);
  console.log(`✨ Updated: ${updated}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`💾 File: ${heroPath}`);
  console.log(`📦 Backup: ${backupPath}\n`);

  // Save change log
  if (changeLog.length > 0) {
    const logPath = path.join(process.cwd(), 'logs', 'poster-updates.json');
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

function parseSelection(selection, maxLength) {
  const indices = [];
  const parts = selection.split(',');

  parts.forEach(part => {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(n => parseInt(n.trim()));
      for (let i = start; i <= end && i <= maxLength; i++) {
        indices.push(i - 1); // Convert to 0-based
      }
    } else {
      const num = parseInt(part.trim());
      if (num >= 1 && num <= maxLength) {
        indices.push(num - 1); // Convert to 0-based
      }
    }
  });

  return [...new Set(indices)]; // Remove duplicates
}

// ============================================
// COMMAND LINE INTERFACE
// ============================================

const heroSlug = process.argv[2];

if (!heroSlug) {
  console.log('\n📖 USAGE:');
  console.log('  node scripts/smart-poster-finder.js <hero-slug>\n');
  console.log('EXAMPLE:');
  console.log('  node scripts/smart-poster-finder.js prabhas');
  console.log('  node scripts/smart-poster-finder.js mahesh-babu\n');
  process.exit(0);
}

processHeroPosters(heroSlug);
