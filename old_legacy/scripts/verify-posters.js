// scripts/verify-posters.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process');

// ============================================
// CONFIGURATION
// ============================================

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const OMDB_API_KEY = process.env.OMDB_API_KEY;

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
      console.log('⚠️  Could not auto-open browser');
    }
  });
}

async function validatePosterUrl(url) {
  if (!url || url.includes('placehold') || url.includes('example.com') || url === '') {
    return { valid: false, reason: 'Invalid URL format' };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    const isImage = contentType && contentType.includes('image');
    
    if (!response.ok) {
      return { valid: false, reason: `HTTP ${response.status}` };
    }
    
    if (!isImage) {
      return { valid: false, reason: 'Not an image' };
    }

    return { valid: true, reason: 'OK' };
  } catch (error) {
    return { valid: false, reason: error.message.includes('aborted') ? 'Timeout' : 'Network error' };
  }
}

function detectPosterQuality(url) {
  if (!url) return { quality: 'missing', emoji: '❌', label: 'Missing' };
  if (url.includes('placehold')) return { quality: 'placeholder', emoji: '⚠️', label: 'Placeholder' };
  if (url.includes('original') || url.includes('w780') || url.includes('large')) {
    return { quality: 'high', emoji: '🟢', label: 'High Quality' };
  }
  if (url.includes('w500') || url.includes('medium')) {
    return { quality: 'medium', emoji: '🟡', label: 'Medium Quality' };
  }
  return { quality: 'low', emoji: '🟠', label: 'Low/Unknown' };
}

function getPosterStatus(movie) {
  const quality = detectPosterQuality(movie.poster);
  return `${quality.emoji} ${quality.label}`;
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

function parseSelection(input, maxIndex) {
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
// POSTER SOURCE FUNCTIONS
// ============================================

async function getTMDbPoster(tmdbId) {
  try {
    await delay(250); // Rate limiting
    const url = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    if (!data.poster_path) return null;
    
    return {
      standard: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
      hd: `https://image.tmdb.org/t/p/original${data.poster_path}`,
      title: data.title,
      year: new Date(data.release_date).getFullYear(),
      rating: data.vote_average
    };
  } catch (error) {
    return null;
  }
}

async function getTMDbImages(tmdbId) {
  try {
    await delay(250);
    const url = `https://api.themoviedb.org/3/movie/${tmdbId}/images?api_key=${TMDB_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    
    return data.posters?.slice(0, 5).map(p => ({
      url: `https://image.tmdb.org/t/p/w500${p.file_path}`,
      urlHD: `https://image.tmdb.org/t/p/original${p.file_path}`,
      language: p.iso_639_1,
      voteAverage: p.vote_average,
      width: p.width,
      height: p.height
    })) || [];
  } catch (error) {
    return [];
  }
}

async function getOMDbPoster(title, year) {
  if (!OMDB_API_KEY) return null;
  
  try {
    await delay(250);
    const url = `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&y=${year}&apikey=${OMDB_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.Response === 'False') return null;
    if (!data.Poster || data.Poster === 'N/A') return null;
    
    return {
      url: data.Poster,
      imdbRating: data.imdbRating,
      title: data.Title
    };
  } catch (error) {
    return null;
  }
}

function getGoogleImageUrl(title, year) {
  const query = `${title} ${year} telugu movie poster high quality`;
  return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
}

// ============================================
// SCAN FUNCTION
// ============================================

async function scanPosters(movies, validateUrls = false) {
  console.log('\n🔍 Scanning posters...\n');
  
  const report = {
    total: movies.length,
    highQuality: 0,
    mediumQuality: 0,
    lowQuality: 0,
    placeholder: 0,
    missing: 0,
    broken: []
  };
  
  for (let i = 0; i < movies.length; i++) {
    process.stdout.write(`\rScanning... ${i + 1}/${movies.length} (${Math.round((i + 1) / movies.length * 100)}%)`);
    
    const movie = movies[i];
    const quality = detectPosterQuality(movie.poster);
    
    if (quality.quality === 'missing') {
      report.missing++;
    } else if (quality.quality === 'placeholder') {
      report.placeholder++;
    } else if (quality.quality === 'high') {
      report.highQuality++;
    } else if (quality.quality === 'medium') {
      report.mediumQuality++;
    } else {
      report.lowQuality++;
    }
    
    // Validate URLs (sample - every 5th poster)
    if (validateUrls && movie.poster && i % 5 === 0) {
      const validation = await validatePosterUrl(movie.poster);
      if (!validation.valid) {
        report.broken.push({
          index: i,
          title: movie.title,
          reason: validation.reason
        });
      }
    }
  }
  
  console.log('\r' + ' '.repeat(70) + '\r');
  return report;
}

// ============================================
// DISPLAY FUNCTIONS
// ============================================

function showMovieList(movies) {
  console.log(`\n${'═'.repeat(70)}`);
  console.log(`📋 MOVIE LIST`);
  console.log(`${'═'.repeat(70)}\n`);
  
  movies.forEach((movie, idx) => {
    const status = getPosterStatus(movie);
    const tmdbStatus = movie.tmdbId ? '✓' : '✗';
    console.log(`${(idx + 1).toString().padStart(3)}. ${movie.title} (${movie.year}) - ${status} [TMDb: ${tmdbStatus}]`);
  });
  
  console.log(`\n${'═'.repeat(70)}\n`);
}

function displayReport(report, heroName) {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log(`║  📊 POSTER REPORT - ${heroName.toUpperCase().padEnd(37)}║`);
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  console.log(`  🎬 Total Movies: ${report.total}\n`);
  
  console.log(`  QUALITY BREAKDOWN:`);
  console.log(`    🟢 High Quality: ${report.highQuality}`);
  console.log(`    🟡 Medium Quality: ${report.mediumQuality}`);
  console.log(`    🟠 Low Quality: ${report.lowQuality}`);
  console.log(`    ⚠️  Placeholders: ${report.placeholder}`);
  console.log(`    ❌ Missing: ${report.missing}\n`);
  
  if (report.broken.length > 0) {
    console.log(`  🔴 BROKEN/INVALID URLS: ${report.broken.length}`);
    report.broken.forEach(b => {
      console.log(`     - ${b.title} (${b.reason})`);
    });
    console.log('');
  }
  
  const needsAttention = report.placeholder + report.missing + report.broken.length + report.lowQuality;
  console.log(`  🎯 Needs Attention: ${needsAttention}\n`);
  
  console.log('─'.repeat(60) + '\n');
}

// ============================================
// FIX SINGLE MOVIE FUNCTION
// ============================================

async function fixSingleMovie(movie, movieIndex, heroData, heroPath) {
  console.log(`\n${'═'.repeat(70)}`);
  console.log(`🎬 [${movieIndex + 1}] ${movie.title} (${movie.year})`);
  console.log(`${'═'.repeat(70)}`);
  console.log(`Status: ${getPosterStatus(movie)}`);
  console.log(`TMDb ID: ${movie.tmdbId || 'MISSING'}`);
  
  if (movie.poster && !movie.poster.includes('placehold')) {
    console.log(`Current: ${movie.poster.substring(0, 60)}...`);
    
    // Validate current poster
    console.log(`\n🔍 Validating current poster...`);
    const validation = await validatePosterUrl(movie.poster);
    console.log(`   ${validation.valid ? '✅ Valid' : '❌ Invalid'} - ${validation.reason}`);
    
    if (validation.valid) {
      const keep = await ask(`\nKeep current poster? (y/n): `);
      if (keep.toLowerCase() === 'y') {
        console.log(`✓ Keeping current poster\n`);
        return false;
      }
    }
  }
  
  console.log(`${'═'.repeat(70)}\n`);
  
  const changes = [];
  
  // If no TMDb ID, skip to Google
  if (!movie.tmdbId) {
    console.log(`⚠️  No TMDb ID - Skipping to Google Images...`);
  } else {
    // Try TMDb primary poster
    console.log(`🔍 [1/4] Checking TMDb primary poster...`);
    const tmdbPoster = await getTMDbPoster(movie.tmdbId);
    
    if (tmdbPoster) {
      console.log(`\n✅ Found on TMDb:`);
      console.log(`   Title: ${tmdbPoster.title}`);
      console.log(`   Year: ${tmdbPoster.year}`);
      console.log(`   Rating: ${tmdbPoster.rating}/10`);
      console.log(`   Standard: ${tmdbPoster.standard}`);
      console.log(`   HD: ${tmdbPoster.hd}\n`);
      
      const choice = await ask(`Use TMDb poster? (y=standard, h=HD, n=no, s=skip): `);
      
      if (choice.toLowerCase() === 'y') {
        heroData.movies[movieIndex].poster = tmdbPoster.standard;
        fs.writeFileSync(heroPath, JSON.stringify(heroData, null, 2));
        console.log(`✅ Saved TMDb standard poster!\n`);
        return { source: 'TMDb (Standard)', url: tmdbPoster.standard };
      } else if (choice.toLowerCase() === 'h') {
        heroData.movies[movieIndex].poster = tmdbPoster.hd;
        fs.writeFileSync(heroPath, JSON.stringify(heroData, null, 2));
        console.log(`✅ Saved TMDb HD poster!\n`);
        return { source: 'TMDb (HD)', url: tmdbPoster.hd };
      } else if (choice.toLowerCase() === 's') {
        console.log(`⏭️  Skipped\n`);
        return false;
      }
    }
    
    // Try TMDb alternative posters
    console.log(`\n🔍 [2/4] Checking TMDb alternative posters...`);
    const tmdbImages = await getTMDbImages(movie.tmdbId);
    
    if (tmdbImages.length > 0) {
      console.log(`\n✅ Found ${tmdbImages.length} alternatives:\n`);
      
      tmdbImages.forEach((img, idx) => {
        console.log(`${idx + 1}. ${img.width}x${img.height} | Lang: ${img.language || 'N/A'} | Rating: ${img.voteAverage}/10`);
        console.log(`   Standard: ${img.url}`);
        console.log(`   HD: ${img.urlHD}\n`);
      });
      
      const choice = await ask(`Select (1-${tmdbImages.length}, h=HD version, or Enter to skip): `);
      const choiceNum = parseInt(choice);
      
      if (choiceNum >= 1 && choiceNum <= tmdbImages.length) {
        const selected = tmdbImages[choiceNum - 1];
        const isHD = choice.toLowerCase().includes('h');
        const posterUrl = isHD ? selected.urlHD : selected.url;
        
        heroData.movies[movieIndex].poster = posterUrl;
        fs.writeFileSync(heroPath, JSON.stringify(heroData, null, 2));
        console.log(`✅ Saved TMDb alternative ${isHD ? 'HD' : 'standard'} poster!\n`);
        return { source: `TMDb (Alt ${isHD ? 'HD' : 'Std'})`, url: posterUrl };
      }
    }
    
    // Try OMDb
    if (OMDB_API_KEY) {
      console.log(`\n🔍 [3/4] Checking OMDb/IMDb...`);
      const omdbPoster = await getOMDbPoster(movie.title, movie.year);
      
      if (omdbPoster) {
        console.log(`\n✅ Found on OMDb:`);
        console.log(`   Title: ${omdbPoster.title}`);
        console.log(`   IMDb Rating: ${omdbPoster.imdbRating}/10`);
        console.log(`   URL: ${omdbPoster.url}`);
        console.log(`   ⚠️  Note: Amazon CDN links may expire!\n`);
        
        const choice = await ask(`Use OMDb poster? (y/n/s=skip): `);
        
        if (choice.toLowerCase() === 'y') {
          heroData.movies[movieIndex].poster = omdbPoster.url;
          fs.writeFileSync(heroPath, JSON.stringify(heroData, null, 2));
          console.log(`✅ Saved OMDb poster!\n`);
          return { source: 'OMDb/IMDb', url: omdbPoster.url };
        } else if (choice.toLowerCase() === 's') {
          console.log(`⏭️  Skipped\n`);
          return false;
        }
      }
    }
  }
  
  // Google Images
  console.log(`\n🔍 [4/4] Opening Google Images...`);
  const googleUrl = getGoogleImageUrl(movie.title, movie.year);
  console.log(`\n🌐 URL: ${googleUrl}`);
  console.log(`🔄 Opening browser...\n`);
  
  openBrowser(googleUrl);
  await delay(1000);
  
  const posterUrl = await ask(`Paste poster URL (or Enter to skip): `);
  
  if (posterUrl.trim()) {
    console.log(`\n🔍 Validating URL...`);
    const validation = await validatePosterUrl(posterUrl.trim());
    
    if (validation.valid || (await ask(`Validation failed (${validation.reason}). Use anyway? (y/n): `)).toLowerCase() === 'y') {
      heroData.movies[movieIndex].poster = posterUrl.trim();
      fs.writeFileSync(heroPath, JSON.stringify(heroData, null, 2));
      console.log(`✅ Saved Google poster!\n`);
      return { source: 'Google Images', url: posterUrl.trim() };
    }
  }
  
  console.log(`⏭️  Skipped\n`);
  return false;
}

// ============================================
// MAIN FUNCTION
// ============================================

async function verifyPosters(heroSlug) {
  const heroPath = path.join(process.cwd(), 'public', 'data', 'heroes', `${heroSlug}.json`);
  
  if (!fs.existsSync(heroPath)) {
    console.error(`\n❌ File not found: ${heroPath}\n`);
    rl.close();
    return;
  }
  
  const heroData = JSON.parse(fs.readFileSync(heroPath, 'utf8'));
  
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log(`║  🖼️  POSTER VERIFIER - ${heroData.name.toUpperCase().padEnd(37)}║`);
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  // Create backup
  const backupPath = createBackup(heroPath);
  console.log(`\n💾 Backup created: ${path.basename(backupPath)}`);
  
  // Scan posters
  const report = await scanPosters(heroData.movies, true);
  displayReport(report, heroData.name);
  
  let totalFixed = 0;
  const changeLog = [];
  
  while (true) {
    showMovieList(heroData.movies);
    
    console.log(`OPTIONS:`);
    console.log(`  • Numbers: 1,3,5 or ranges: 1-5`);
    console.log(`  • 'all' = fix all movies`);
    console.log(`  • 'missing' = only missing/placeholder posters`);
    console.log(`  • 'broken' = only broken URLs`);
    console.log(`  • 'low' = only low quality posters`);
    console.log(`  • 'q' = quit\n`);
    
    const selection = await ask(`Select: `);
    
    if (selection.toLowerCase() === 'q') {
      break;
    }
    
    let indicesToFix = [];
    
    if (selection.toLowerCase() === 'all') {
      indicesToFix = heroData.movies.map((_, idx) => idx);
    } else if (selection.toLowerCase() === 'missing') {
      indicesToFix = heroData.movies
        .map((m, idx) => ({ movie: m, idx }))
        .filter(({ movie }) => {
          const status = getPosterStatus(movie);
          return status.includes('❌') || status.includes('⚠️');
        })
        .map(({ idx }) => idx);
    } else if (selection.toLowerCase() === 'broken') {
      indicesToFix = report.broken.map(b => b.index);
    } else if (selection.toLowerCase() === 'low') {
      indicesToFix = heroData.movies
        .map((m, idx) => ({ movie: m, idx }))
        .filter(({ movie }) => detectPosterQuality(movie.poster).quality === 'low')
        .map(({ idx }) => idx);
    } else {
      indicesToFix = parseSelection(selection, heroData.movies.length);
    }
    
    if (indicesToFix.length === 0) {
      console.log(`\n⚠️  No valid selection or no movies match criteria.\n`);
      continue;
    }
    
    console.log(`\n✅ Selected ${indicesToFix.length} movie(s)\n`);
    
    let batchFixed = 0;
    for (let i = 0; i < indicesToFix.length; i++) {
      const idx = indicesToFix[i];
      const movie = heroData.movies[idx];
      
      console.log(`\n[${i + 1}/${indicesToFix.length}] Progress: ${Math.round((i + 1) / indicesToFix.length * 100)}%`);
      
      const result = await fixSingleMovie(movie, idx, heroData, heroPath);
      
      if (result) {
        batchFixed++;
        changeLog.push({
          movie: movie.title,
          year: movie.year,
          source: result.source,
          url: result.url
        });
      }
      
      if (i < indicesToFix.length - 1) {
        const continueChoice = await ask(`Continue? (Enter=yes, q=menu): `);
        if (continueChoice.toLowerCase() === 'q') break;
      }
    }
    
    totalFixed += batchFixed;
    console.log(`\n✅ Fixed ${batchFixed} poster(s) in this batch`);
    console.log(`📊 Total fixed this session: ${totalFixed}\n`);
    
    await ask(`Press Enter to continue...`);
    console.clear();
  }
  
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
  }
  
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`🎉 SESSION COMPLETE!`);
  console.log(`${'═'.repeat(60)}`);
  console.log(`✅ Total posters fixed: ${totalFixed}`);
  console.log(`💾 Saved to: ${heroPath}`);
  console.log(`📦 Backup: ${backupPath}`);
  if (changeLog.length > 0) {
    console.log(`📝 Change log: logs/poster-updates.json`);
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
  console.log('  node scripts/verify-posters.js <hero-slug>\n');
  console.log('EXAMPLE:');
  console.log('  node scripts/verify-posters.js prabhas');
  console.log('  node scripts/verify-posters.js mahesh-babu\n');
  process.exit(0);
}

verifyPosters(heroSlug);
