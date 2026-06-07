/**
 * scripts/auto-generate-hero.enriched.js
 *
 * Enhanced TFIVERSE AUTO HERO GENERATOR
 * - Fetches detailed movie objects for each TMDb movie (credits, images, videos, external_ids, release_dates)
 * - Saves raw TMDb movie JSON to public/data/heroes/<slug>/raw/movies/<tmdbId>.json
 * - Exponential backoff on 429; concurrency-limited fetches
 * - Builds poster/banner URLs (TMDb fallback)
 *
 * Usage:
 * 1. Create .env with NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_key
 * 2. node scripts/auto-generate-hero.enriched.js <tmdb_person_id> <slug> ["Optional Title"]
 *
 * Node v18+ recommended (fetch built-in). If using older Node, install node-fetch and uncomment import.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
// If using node <18, uncomment next line and the require in fetch call
// const fetch = require('node-fetch');

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
if (!TMDB_API_KEY) {
  console.error('❌ Missing TMDB API key. Put NEXT_PUBLIC_TMDB_API_KEY in .env');
  process.exit(1);
}

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'data', 'heroes');

// Simple sleep
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Basic p-limit implementation (lightweight)
function pLimit(concurrency) {
  let active = 0;
  const queue = [];
  const next = () => {
    if (queue.length === 0) return;
    if (active >= concurrency) return;
    active++;
    const { fn, resolve, reject } = queue.shift();
    fn().then(v => { active--; resolve(v); next(); }).catch(err => { active--; reject(err); next(); });
  };
  return (fn) => new Promise((resolve, reject) => {
    queue.push({ fn, resolve, reject });
    next();
  });
}

function createSlug(text = '') {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function tmdbImageUrl(pathFragment, size = 'w500') {
  if (!pathFragment) return '';
  const p = pathFragment.startsWith('/') ? pathFragment : `/${pathFragment}`;
  return `https://image.tmdb.org/t/p/${size}${p}`;
}

function normalizePersonId(p) {
  return typeof p === 'string' ? Number(p) : p;
}

function log(emoji, msg) { console.log(`${emoji} ${msg}`); }

// -------------------------- TMDb API helpers --------------------------
async function tmdbFetch(url, maxRetries = 4) {
  // global fetch available in Node 18+. If not, uncomment require('node-fetch') at top.
  const fetchFn = global.fetch || require('node-fetch');
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      const res = await fetchFn(url);
      if (res.status === 429) {
        // try Retry-After
        const retryAfter = res.headers.get && res.headers.get('retry-after');
        const wait = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, attempt) * 1000;
        log('⏳', `Rate limited, waiting ${wait}ms (attempt ${attempt + 1})`);
        await sleep(wait);
        attempt++;
        continue;
      }
      if (!res.ok) {
        const text = await res.text().catch(()=>'');
        throw new Error(`TMDB fetch failed ${res.status} - ${text}`);
      }
      const json = await res.json();
      return json;
    } catch (err) {
      attempt++;
      if (attempt > maxRetries) {
        console.warn(`❗ tmdbFetch failed after ${attempt} attempts: ${err.message}`);
        throw err;
      }
      const backoff = Math.pow(2, attempt) * 500;
      await sleep(backoff);
    }
  }
  throw new Error('tmdbFetch exhausted retries');
}

async function fetchPersonDetails(personId) {
  const url = `${TMDB_BASE_URL}/person/${personId}?api_key=${TMDB_API_KEY}`;
  return tmdbFetch(url);
}

async function fetchPersonMovieCredits(personId) {
  const url = `${TMDB_BASE_URL}/person/${personId}/movie_credits?api_key=${TMDB_API_KEY}`;
  return tmdbFetch(url);
}

async function fetchPersonTVCredits(personId) {
  const url = `${TMDB_BASE_URL}/person/${personId}/tv_credits?api_key=${TMDB_API_KEY}`;
  return tmdbFetch(url);
}

async function fetchPersonImages(personId) {
  const url = `${TMDB_BASE_URL}/person/${personId}/images?api_key=${TMDB_API_KEY}`;
  return tmdbFetch(url);
}

async function fetchPersonExternalIds(personId) {
  const url = `${TMDB_BASE_URL}/person/${personId}/external_ids?api_key=${TMDB_API_KEY}`;
  return tmdbFetch(url);
}

// fetch movie details with append_to_response for credits,images,videos,external_ids,release_dates
async function fetchMovieDetails(movieId) {
  if (!movieId) return null;
  const url = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,images,videos,external_ids,release_dates`;
  return tmdbFetch(url);
}

// -------------------------- Categorization (same logic, minor tweaks) --------------------------
function smartCategorizeMovie(movie, actorName) {
  const character = (movie.character || '').toLowerCase().trim();
  const title = (movie.title || '').toLowerCase().trim();
  const nameParts = actorName.toLowerCase().split(' ');
  const firstName = nameParts[0];

  if (title.includes('documentary') || title.includes('making of') || ['self','himself','herself'].includes(character)) return 'documentary';
  if (character.includes('voice') || character.includes('narrator')) return 'voiceOver';
  if (character.includes('cameo') || character.includes('uncredited')) return 'cameo';
  if (character.includes('special appearance') || character.includes('guest') || character.includes('friendly appearance')) return 'special';
  if (movie.order <= 5 || movie.vote_count > 30 || character.includes(firstName) || movie.popularity > 5) return 'lead';
  if (movie.order >= 6 && movie.order <= 15) return 'supporting';
  return 'lead';
}

function categorizeMovies(cast, actorName) {
  const lead = [], cameo = [], voiceOver = [], special = [], supporting = [], documentary = [], upcoming = [], unknownMovies = [];
  const today = new Date();
  const seen = new Set();
  cast.forEach(movie => {
    if (!movie.title) { log('⚠️', `Skipping movie with no title (TMDB ID: ${movie.id})`); return; }
    if (seen.has(movie.id)) return;
    seen.add(movie.id);
    const releaseDate = movie.release_date ? new Date(movie.release_date) : null;
    if (releaseDate && releaseDate > today) { upcoming.push(movie); return; }
    if (!releaseDate) { unknownMovies.push(movie); /* continue to categorize */ }
    const category = smartCategorizeMovie(movie, actorName);
    switch(category) {
      case 'lead': lead.push(movie); break;
      case 'cameo': cameo.push(movie); break;
      case 'voiceOver': voiceOver.push(movie); break;
      case 'special': special.push(movie); break;
      case 'documentary': documentary.push(movie); break;
      case 'supporting': supporting.push(movie); break;
      default: lead.push(movie);
    }
  });
  return { lead, cameo, voiceOver, special, supporting, documentary, upcoming, unknownMovies };
}

// -------------------------- Detailed movie processing with concurrency --------------------------
async function processMoviesDetailed(cast, actorName, slug) {
  const limit = pLimit(6);
  const results = await Promise.all(
    cast
      .sort((a, b) => (new Date(b.release_date || '1900-01-01')) - (new Date(a.release_date || '1900-01-01')))
      .map(movie => limit(async () => {
        const basic = movie || {};
        const tmdbId = basic.id || null;
        let detail = null;
        try {
          detail = tmdbId ? await fetchMovieDetails(tmdbId) : null;
        } catch (err) {
          log('⚠️', `Failed to fetch details for movie ${tmdbId || basic.title}: ${err.message}`);
        }

        // save raw detail if available
        if (detail) {
          const rawDir = path.join(OUTPUT_DIR, slug, 'raw', 'movies');
          if (!fs.existsSync(rawDir)) fs.mkdirSync(rawDir, { recursive: true });
          try {
            fs.writeFileSync(path.join(rawDir, `${tmdbId}.json`), JSON.stringify(detail, null, 2));
          } catch (e) {
            /* ignore write errors */
          }
        }

        const posterPath = detail?.poster_path || basic.poster_path || '';
        const backdropPath = detail?.backdrop_path || '';
        const runtime = detail?.runtime || 0;
        const genres = (detail?.genres || []).map(g => g.name);
        const director = (detail?.credits?.crew || []).find(c => c.job === 'Director')?.name || '';
        const producers = (detail?.credits?.crew || []).filter(c => c.job && /producer/i.test(c.job)).map(p => p.name);
        const imdbId = detail?.external_ids?.imdb_id || '';

        // trailer: prefer YouTube trailer
        const vids = detail?.videos?.results || [];
        const trailerObj = vids.find(v => (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube');

        const releaseDate = detail?.release_date || basic.release_date || '';
        const year = releaseDate ? parseInt(releaseDate.split('-')[0]) : (basic.release_date ? parseInt(basic.release_date.split('-')[0]) : 0);

        const movieObj = {
          id: createSlug(basic.title || detail?.title || 'untitled') + '-' + (year || 'unknown'),
          title: basic.title || detail?.title || '',
          slug: createSlug(basic.title || detail?.title || ''),
          tmdbId: tmdbId || null,
          imdbId: imdbId || '',
          year: year,
          releaseDate: releaseDate || '',
          language: detail?.original_language || basic.original_language || '',
          dubbedIn: [],
          duration: runtime || 0,
          director: director,
          producers: producers,
          productionHouse: (detail?.production_companies || []).map(p => p.name).join(', '),
          musicDirector: '',
          cinematographer: '',
          editor: '',
          lyricist: '',
          screenwriter: '',
          dialogueWriter: '',
          actionDirector: '',
          genre: genres || [],
          ageRating: '',
          certificate: '',
          cast: {
            lead: '', heroine: [], supporting: [], villain: [], other: []
          },
          synopsis: detail?.overview || basic.overview || '',
          songs: [],
          poster: {
            sources: posterPath ? ['tmdb'] : [],
            sourcePrimary: posterPath ? 'tmdb' : '',
            tmdbId: tmdbId || null,
            posterPath: posterPath || '',
            url: posterPath ? tmdbImageUrl(posterPath, 'w500') : '',
            fallback: posterPath ? tmdbImageUrl(posterPath, 'w500') : '',
            local: [],
            imageRights: '',
            credit: ''
          },
          banner: {
            sources: backdropPath ? ['tmdb'] : [],
            sourcePrimary: backdropPath ? 'tmdb' : '',
            tmdbId: tmdbId || null,
            backdropPath: backdropPath || '',
            url: backdropPath ? tmdbImageUrl(backdropPath, 'original') : '',
            fallback: backdropPath ? tmdbImageUrl(backdropPath, 'original') : '',
            local: [],
            imageRights: '',
            credit: ''
          },
          stills: (detail?.images?.backdrops || []).slice(0, 6).map(s => ({
            source: 'tmdb',
            tmdbId: tmdbId || null,
            backdropPath: s.file_path,
            url: tmdbImageUrl(s.file_path, 'original'),
            description: ''
          })),
          trailerDetails: {
            officialTrailer: trailerObj ? `https://youtube.com/watch?v=${trailerObj.key}` : '',
            teaser: '',
            release: trailerObj?.published_at || ''
          },
          budget: detail?.budget ? `${detail.budget}` : '',
          ratings: {
            tmdb: Number((basic.vote_average || 0).toFixed(1)),
            voteCount: basic.vote_count || 0
          },
          crew: (detail?.credits?.crew || []).map(c => ({ name: c.name, role: c.job, credited: true, source: [`https://www.themoviedb.org/movie/${tmdbId}/cast`] })),
          awards: [],
          criticalAcclaim: [],
          streaming: { ott: [] },
          trivia: [],
          behindTheScenes: [],
          productionTimeline: {
            announcement: '',
            shootStart: '',
            shootEnd: '',
            release: detail?.release_date || ''
          },
          culturalImpact: {},
          role: {},
          heroPerformance: {},
          source: detail ? [`https://www.themoviedb.org/movie/${tmdbId}`] : [],
          missingData: !(posterPath && releaseDate),
          lastUpdated: new Date().toISOString()
        };

        return movieObj;
      }))
  );

  return results;
}

// -------------------------- Known upcoming movies manual list (carryover) --------------------------
const KNOWN_UPCOMING_MOVIES = {
  '237045': [ // prabhas example - keep for manual supplementation
    { title: 'Spirit', director: 'Sandeep Reddy Vanga', year: 2026, status: 'announced' },
    { title: 'Fauji', director: 'Hanu Raghavapudi', year: 2026, status: 'filming' },
    { title: 'Salaar 2', director: 'Prashanth Neel', year: 2026, status: 'announced' },
    { title: 'Kalki 2898 AD Part 2', director: 'Nag Ashwin', year: 2027, status: 'pre-production' }
  ]
};

function addKnownUpcomingMovies(upcomingMovies, personId) {
  const known = KNOWN_UPCOMING_MOVIES[String(personId)] || [];
  if (known.length === 0) return upcomingMovies;
  const existing = new Set(upcomingMovies.map(m => (m.title || '').toLowerCase()));
  const combined = [...upcomingMovies];
  known.forEach(k => {
    if (!existing.has(k.title.toLowerCase())) {
      combined.push({
        id: createSlug(k.title) + '-' + (k.year || 'unknown'),
        title: k.title,
        slug: createSlug(k.title),
        year: k.year || 0,
        releaseDate: k.year ? `${k.year}-01-01` : '',
        tmdbId: null,
        poster: '',
        status: k.status,
        director: k.director || '',
        genre: [],
        source: 'manual',
        missingData: true
      });
    }
  });
  return combined.sort((a,b) => (a.year||0) - (b.year||0));
}

// -------------------------- Main generate function --------------------------
async function generateHero(personIdRaw, slug, heroTitle = '') {
  const personId = normalizePersonId(personIdRaw);
  if (!personId) {
    console.error('❌ Invalid TMDB person id');
    process.exit(1);
  }

  log('🔥', 'TFIVERSE AUTO HERO GENERATOR - ENRICHED');
  log('📝', `TMDB Person ID: ${personId}`);
  log('🎯', `Slug: ${slug}`);
  if (heroTitle) log('👑', `Title: ${heroTitle}`);
  console.log('');

  try {
    const personDetails = await fetchPersonDetails(personId);
    await sleep(250);

    const movieCredits = await fetchPersonMovieCredits(personId);
    await sleep(250);

    const tvCredits = await fetchPersonTVCredits(personId);
    await sleep(250);

    const images = await fetchPersonImages(personId);
    await sleep(250);

    const externalIds = await fetchPersonExternalIds(personId);
    await sleep(250);

    log('✅', 'TMDb person data fetched');

    // Categorize raw cast to split lead/cameo etc (this uses the TMDb movie_credits.cast items)
    const categorized = categorizeMovies(movieCredits.cast || [], personDetails.name || '');
    const { lead, cameo, voiceOver, special, supporting, documentary, upcoming, unknownMovies } = categorized;

    // Fetch detailed movie objects for each category (we'll focus on lead + supporting + others to include all)
    const allCast = [...new Set([...(lead||[]), ...(supporting||[]), ...(cameo||[]), ...(voiceOver||[]), ...(special||[]), ...(documentary||[]), ...(upcoming||[])].map(m => m.id))]
      // but we need the movie objects from movieCredits.cast; create a map by id
    const idToMovie = {};
    (movieCredits.cast || []).forEach(m => { idToMovie[m.id] = m; });

    const castArray = Object.keys(idToMovie).map(k => idToMovie[k]);

    log('⏳', `Fetching detailed info for ${castArray.length} movies (concurrency 6)...`);
    const detailedMovies = await processMoviesDetailed(castArray, personDetails.name || '', slug);

    // Split back into categories using tmdbId mapping
    const leadMovies = detailedMovies.filter(m => (lead || []).some(l => l.id === m.tmdbId));
    const cameoMovies = detailedMovies.filter(m => (cameo || []).some(c => c.id === m.tmdbId));
    const voiceOverMovies = detailedMovies.filter(m => (voiceOver || []).some(v => v.id === m.tmdbId));
    const specialAppearances = detailedMovies.filter(m => (special || []).some(s => s.id === m.tmdbId));
    const supportingRoles = detailedMovies.filter(m => (supporting || []).some(s => s.id === m.tmdbId));
    const documentaries = detailedMovies.filter(m => (documentary || []).some(d => d.id === m.tmdbId));
    let upcomingMovies = (upcoming || []).map(u => ({
      id: createSlug(u.title) + '-' + (u.release_date ? u.release_date.split('-')[0] : (u.year || 'unknown')),
      title: u.title,
      slug: createSlug(u.title),
      tmdbId: u.id || null,
      year: u.release_date ? parseInt(u.release_date.split('-')[0]) : (u.year || 0),
      releaseDate: u.release_date || (u.year ? `${u.year}-01-01` : ''),
      poster: u.poster_path || '',
      character: u.character || '',
      missingData: !u.release_date
    }));

    // add KNOWN_UPCOMING_MOVIES
    upcomingMovies = addKnownUpcomingMovies(upcomingMovies, personId);

    // tv shows mapping
    const tvShows = (tvCredits.cast || [])
      .filter(s => s.name)
      .slice(0, 25)
      .map(show => ({
        id: createSlug(show.name),
        title: show.name,
        tmdbId: show.id,
        year: parseInt(show.first_air_date?.split('-')[0] || '0'),
        poster: show.poster_path || '',
        character: show.character || 'Unknown'
      }));

    // Build hero object (v12-ish snapshot)
    const heroData = {
      id: `${slug}-${personId}`,
      name: personDetails.name || '',
      slug,
      alternateNames: personDetails.also_known_as || [],
      title: heroTitle || '',
      type: 'actor',
      category: 'superstar',
      tmdbPersonId: personId,
      heroAura: { screenPresence: '', boxOfficeAppeal: '', signature: '', fanbase: '', trademarkStyle: '' },
      bio: personDetails.biography || '',
      images: {
        portrait: {
          source: personDetails.profile_path ? 'tmdb' : 'local',
          sources: personDetails.profile_path ? [`https://image.tmdb.org/t/p/w500${personDetails.profile_path}`] : [],
          sourcePrimary: personDetails.profile_path ? 'tmdb' : 'local',
          tmdbId: personDetails.profile_path ? personId : null,
          profilePath: personDetails.profile_path || '',
          url: personDetails.profile_path ? tmdbImageUrl(personDetails.profile_path, 'w500') : `/images/heroes/${slug}/portrait.jpg`,
          fallback: personDetails.profile_path ? tmdbImageUrl(personDetails.profile_path, 'w500') : '',
          local: [],
          imageRights: '',
          credit: ''
        },
        banner: {
          sources: ['/images/heroes/'+slug+'/banner.jpg'],
          sourcePrimary: 'local',
          tmdbId: null,
          backdropPath: '',
          url: `/images/heroes/${slug}/banner.jpg`,
          fallback: '',
          local: [],
          imageRights: '',
          credit: ''
        },
        featured: {
          sources: ['/images/heroes/'+slug+'/featured.jpg'],
          sourcePrimary: 'local',
          tmdbId: null,
          backdropPath: '',
          url: `/images/heroes/${slug}/featured.jpg`,
          fallback: '',
          local: [],
          imageRights: '',
          credit: ''
        },
        gallery: (images.profiles || []).slice(0, 12).map(img => ({
          sources: [`https://image.tmdb.org/t/p/original${img.file_path}`],
          sourcePrimary: 'tmdb',
          tmdbId: personId,
          backdropPath: img.file_path,
          url: tmdbImageUrl(img.file_path, 'original'),
          fallback: tmdbImageUrl(img.file_path, 'w500'),
          description: img.iso_639_1 || '',
          local: []
        }))
      },
      personalInfo: {
        fullName: personDetails.name || '',
        birthDate: personDetails.birthday || '',
        birthPlace: personDetails.place_of_birth || '',
        currentResidence: '',
        nationality: personDetails.place_of_birth ? (personDetails.place_of_birth.split(',').pop().trim() || '') : '',
        height: '',
        zodiacSign: '',
        bloodGroup: '',
        maritalStatus: '',
        spouse: '',
        children: [],
        education: '',
        family: {},
        debutYear: 0,
        debutMovie: '',
        yearsActive: 0
      },
      socialMedia: {
        instagram: externalIds.instagram_id ? { handle: `@${externalIds.instagram_id}`, url: `https://instagram.com/${externalIds.instagram_id}`, followers: 0, verified: true, active: true, lastUpdated: '' } : null,
        twitter: externalIds.twitter_id ? { handle: `@${externalIds.twitter_id}`, url: `https://twitter.com/${externalIds.twitter_id}`, followers: 0, verified: true, active: true, lastUpdated: '' } : null,
        facebook: externalIds.facebook_id ? { handle: externalIds.facebook_id, url: `https://facebook.com/${externalIds.facebook_id}`, followers: 0, verified: true, active: true, lastUpdated: '' } : null,
        youtube: null,
        other: []
      },
      physicalStats: {},
      physicalTransformations: [],
      voiceProfile: {},
      lifestyle: {},
      netWorth: {},
      financials: {},
      hobbiesAndInterests: [],
      favorites: {},
      genreStrength: {},
      collaborations: { frequentDirectors: [], musicDirectorSynergy: [], frequentHeroines: [] },
      philanthropy: {},
      tvAppearances: [],
      brandEndorsements: [],
      controversies: [],
      movies: detailedMovies, // full detailed movies enriched via TMDb
      totalMovies: movieCredits.cast?.length || detailedMovies.length,
      cameoAppearances: cameoMovies,
      voiceOverAppearances: voiceOverMovies,
      childArtistMovies: [],
      specialAppearances: specialAppearances,
      supportingRoles: supportingRoles,
      multiStarrerFilms: [],
      productionMovies: [],
      presentedFilms: [],
      documentaries: documentaries,
      musicVideos: [],
      webSeries: [],
      uncreditedRoles: [],
      tvShows,
      upcomingProjects: upcomingMovies,
      moviesNeedingResearch: (unknownMovies || []).map(m => ({ title: m.title, tmdbId: m.id || null, character: m.character || '', note: 'Missing release date or poster - research Wikipedia/IMDb' })),
      awards: [],
      recentNews: [],
      trivia: [],
      meta: {
        lastUpdated: new Date().toISOString(),
        dataVersion: '12.0-enriched',
        completeness: 0, // will compute below
        verifiedBy: 'Auto-Generated Enriched Script (TMDb)',
        sources: ['TMDb API'],
        notes: [
          `Total movies in TMDB: ${movieCredits.cast?.length || 0}`,
          `Movies needing research: ${(unknownMovies || []).length}`
        ]
      }
    };

    // Quick completeness estimate (very naive): percent of movies having poster+releaseDate
    const movieCount = heroData.movies.length;
    const moviesWithGoodData = heroData.movies.filter(m => m.poster && m.poster.posterPath && m.releaseDate).length;
    const completeness = Math.round(((Object.keys(heroData).length ? 1 : 0) + (movieCount ? movieCount : 0) + moviesWithGoodData) / (1 + movieCount + movieCount) * 100);
    heroData.meta.completeness = completeness;
    heroData.meta.dataQuality = {
      bioWordCount: heroData.bio ? heroData.bio.split(/\s+/).filter(Boolean).length : 0,
      allTMDbIdsPresent: heroData.movies.every(m => m.tmdbId !== null),
      allPostersHaveFallback: heroData.movies.every(m => m.poster && m.poster.fallback && m.poster.fallback.length > 0),
      moviesVerifiedWithWikipedia: false,
      socialMediaVerified: false
    };

    // ensure output dir exists
    const heroDir = path.join(OUTPUT_DIR, slug);
    if (!fs.existsSync(heroDir)) fs.mkdirSync(heroDir, { recursive: true });

    const outputPath = path.join(heroDir, `${slug}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(heroData, null, 2));
    log('📁', `Saved enriched snapshot to ${outputPath}`);

    // quick summary
    console.log('\n🎉 Generation complete (enriched snapshot) 🎉');
    log('📊', `Total TMDB Movies: ${movieCredits.cast?.length || 0}`);
    log('🎬', `Detailed movies fetched: ${heroData.movies.length}`);
    log('❓', `Movies needing research (unknown release date): ${(unknownMovies || []).length}`);
    log('📥', `Raw movie files saved to ${path.join(heroDir, 'raw', 'movies')}`);
    console.log('');

    return heroData;

  } catch (err) {
    console.error('❌ ERROR:', err.message);
    process.exit(1);
  }
}

// -------------------------- CLI Execution --------------------------
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('\n❌ Missing arguments!\n');
    console.log('Usage: node scripts/auto-generate-hero.enriched.js <tmdb_id> <slug> [title]\n');
    console.log('Example: node scripts/auto-generate-hero.enriched.js 237045 prabhas "Rebel Star"\n');
    process.exit(1);
  }
  const [personId, slug, heroTitle] = args;
  generateHero(personId, slug, heroTitle);
}

module.exports = { generateHero };
