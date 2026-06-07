#!/usr/bin/env node
/**
 * scripts/generate-tmdb-snapshot.js
 *
 * Usage:
 *   NEXT_PUBLIC_TMDB_API_KEY=your_key node scripts/generate-tmdb-snapshot.js <tmdb_person_id> <slug>
 *
 * Example:
 *   NEXT_PUBLIC_TMDB_API_KEY=abc123 node scripts/generate-tmdb-snapshot.js 237045 prabhas
 *
 * Output:
 *   ./public/data/snapshots/<slug>-tmdb-snapshot.json
 *
 * Node: v18+ (uses built-in fetch). If you use older Node, install node-fetch and adapt fetch usage.
 *
 * What it does:
 * - Fetch person details, images, external IDs, movie credits from TMDb
 * - For each movie credit, fetch TMDb movie details + movie external IDs (imdb id)
 * - Respect small concurrency and retry logic to avoid transient TMDb errors
 * - Save consolidated snapshot (raw tmdb info + per-movie details) to disk
 *
 * Notes:
 * - This script only uses TMDb (the snapshot). Use your separate wiki prefetch/merge step for Wikipedia/IMDb enrichment.
 * - Keep your TMDb API key private.
 */

import fs from 'fs';
import path from 'path';
import process from 'process';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
if (!TMDB_API_KEY) {
  console.error('ERROR: NEXT_PUBLIC_TMDB_API_KEY environment variable is required.');
  process.exit(1);
}

const TMDB_BASE = 'https://api.themoviedb.org/3';
const OUT_DIR = path.join(process.cwd(), 'public', 'data', 'snapshots');
const CONCURRENCY = 6;            // how many movie detail requests concurrently
const RETRY_LIMIT = 3;
const RETRY_DELAY_MS = 800;       // exponential backoff base

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function fetchWithRetry(url, opts = {}, retries = RETRY_LIMIT) {
  let attempt = 0;
  while (true) {
    try {
      const res = await fetch(url, opts);
      if (!res.ok) {
        const text = await res.text().catch(()=>'');
        throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
      }
      const json = await res.json();
      return json;
    } catch (err) {
      attempt++;
      if (attempt > retries) throw err;
      const delay = RETRY_DELAY_MS * Math.pow(2, attempt-1);
      console.warn(`Fetch failed (attempt ${attempt}/${retries}) for ${url} — retrying in ${delay}ms — ${err.message}`);
      await sleep(delay);
    }
  }
}

async function getPersonDetails(personId) {
  const url = `${TMDB_BASE}/person/${personId}?api_key=${TMDB_API_KEY}&language=en-US`;
  return fetchWithRetry(url);
}

async function getPersonImages(personId) {
  const url = `${TMDB_BASE}/person/${personId}/images?api_key=${TMDB_API_KEY}`;
  return fetchWithRetry(url);
}

async function getPersonExternalIds(personId) {
  const url = `${TMDB_BASE}/person/${personId}/external_ids?api_key=${TMDB_API_KEY}`;
  return fetchWithRetry(url);
}

async function getPersonMovieCredits(personId) {
  const url = `${TMDB_BASE}/person/${personId}/movie_credits?api_key=${TMDB_API_KEY}&language=en-US`;
  return fetchWithRetry(url);
}

async function getMovieDetails(movieId) {
  const url = `${TMDB_BASE}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`;
  return fetchWithRetry(url);
}

async function getMovieExternalIds(movieId) {
  const url = `${TMDB_BASE}/movie/${movieId}/external_ids?api_key=${TMDB_API_KEY}`;
  return fetchWithRetry(url);
}

function ensureOutDir() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
}

function compactMovieForSnapshot(movieCredit, movieDetails, movieExternalIds) {
  // Keep only useful fields for snapshot to reduce size but include everything necessary
  return {
    tmdbId: movieDetails.id ?? movieCredit.id,
    title: movieDetails.title ?? movieCredit.title,
    originalTitle: movieDetails.original_title ?? movieCredit.original_title,
    slug: (movieDetails.title || movieCredit.title || '').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''),
    releaseDate: movieDetails.release_date ?? movieCredit.release_date ?? '',
    year: movieDetails.release_date ? parseInt(movieDetails.release_date.split('-')[0]) : (movieCredit.release_date ? parseInt(movieCredit.release_date.split('-')[0]) : 0),
    posterPath: movieDetails.poster_path ?? movieCredit.poster_path ?? '',
    backdropPath: movieDetails.backdrop_path ?? movieCredit.backdrop_path ?? '',
    overview: movieDetails.overview ?? movieCredit.overview ?? '',
    popularity: movieDetails.popularity ?? movieCredit.popularity ?? 0,
    voteAverage: movieDetails.vote_average ?? movieCredit.vote_average ?? 0,
    voteCount: movieDetails.vote_count ?? movieCredit.vote_count ?? 0,
    character: movieCredit.character ?? movieCredit.job ?? '',
    creditOrder: movieCredit.order ?? null,
    mediaType: movieCredit.media_type ?? 'movie',
    originalLanguage: movieDetails.original_language ?? movieCredit.original_language ?? '',
    genres: (movieDetails.genres || []).map(g => g.name),
    runtime: movieDetails.runtime ?? null,
    status: movieDetails.status ?? '',
    tagline: movieDetails.tagline ?? '',
    homepage: movieDetails.homepage ?? '',
    imdbId: movieExternalIds?.imdb_id ?? '',
    externalIds: movieExternalIds ?? {}
  };
}

async function workerPool(items, workerFn, concurrency = CONCURRENCY) {
  const results = [];
  const executing = new Set();

  for (const item of items) {
    const p = (async () => {
      try {
        return await workerFn(item);
      } catch (err) {
        console.error(`Worker error for item ${JSON.stringify(item).slice(0,100)}: ${err.message}`);
        return { error: err.message, item };
      }
    })();

    results.push(p);
    executing.add(p);

    p.finally(() => executing.delete(p));

    if (executing.size >= concurrency) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}

async function buildSnapshot(personId, slug, options = {}) {
  console.log(`Generating TMDb snapshot for personId=${personId} slug=${slug}`);

  const person = await getPersonDetails(personId);
  await sleep(200);
  const images = await getPersonImages(personId);
  await sleep(200);
  const externalIds = await getPersonExternalIds(personId);
  await sleep(200);
  const movieCredits = await getPersonMovieCredits(personId);

  // Deduplicate movie credit ids (use cast + crew arrays)
  const credits = [];
  const seen = new Set();
  (movieCredits.cast || []).forEach(c => {
    if (!seen.has(c.id)) { credits.push({ ...c, creditType: 'cast' }); seen.add(c.id); }
  });
  (movieCredits.crew || []).forEach(c => {
    if (!seen.has(c.id)) { credits.push({ ...c, creditType: 'crew' }); seen.add(c.id); }
  });

  console.log(`Found ${credits.length} unique movie credits from TMDb.`);

  // Fetch detailed movie info for each credit (concurrent)
  const movieDetailsResults = await workerPool(credits, async (credit) => {
    // small delay to avoid bursts for very large lists
    await sleep(50);
    try {
      const details = await getMovieDetails(credit.id);
      await sleep(120);
      const ext = await getMovieExternalIds(credit.id);
      await sleep(100);
      return { credit, details, externalIds: ext };
    } catch (err) {
      // return partial: the credit as-is with error flag
      return { credit, details: null, externalIds: null, fetchError: err.message };
    }
  }, CONCURRENCY);

  // Build compact movies array
  const movies = movieDetailsResults.map(res => {
    if (res.fetchError || !res.details) {
      // fallback to credit-level minimal info
      const c = res.credit;
      return {
        tmdbId: c.id,
        title: c.title || c.original_title || '',
        slug: (c.title || c.original_title || '').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''),
        releaseDate: c.release_date || '',
        year: c.release_date ? parseInt(c.release_date.split('-')[0]) : 0,
        posterPath: c.poster_path || '',
        backdropPath: c.backdrop_path || '',
        overview: c.overview || '',
        character: c.character || c.job || '',
        voteAverage: c.vote_average || 0,
        voteCount: c.vote_count || 0,
        fetchError: res.fetchError || null,
      };
    } else {
      return compactMovieForSnapshot(res.credit, res.details, res.externalIds);
    }
  });

  // Sort movies by year descending
  movies.sort((a,b) => (b.year || 0) - (a.year || 0));

  // Build snapshot object
  const snapshot = {
    generatedAt: new Date().toISOString(),
    source: 'tmdb',
    person: {
      tmdbPersonId: Number(personId),
      name: person.name,
      alsoKnownAs: person.also_known_as || [],
      biography: person.biography || '',
      birthday: person.birthday || '',
      deathday: person.deathday || null,
      place_of_birth: person.place_of_birth || '',
      homepage: person.homepage || '',
      profilePath: person.profile_path || '',
      popularity: person.popularity || 0,
      gender: person.gender || null,
      rawPerson: person
    },
    images: images || {},
    externalIds: externalIds || {},
    tmdbMovieCreditsSummary: {
      totalCredits: credits.length,
      rawCreditsResponse: movieCredits
    },
    movies: movies,
    notes: {
      fetchedMovieDetails: movies.length,
      personFetched: !!person,
      moviesNeedingManualCheck: movies.filter(m => m.posteRPath === '' || !m.releaseDate || !m.tmdbId).length
    }
  };

  return snapshot;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: node scripts/generate-tmdb-snapshot.js <tmdb_person_id> <slug>');
    process.exit(1);
  }
  const [personIdRaw, slug] = args;
  const personId = Number(personIdRaw);
  if (Number.isNaN(personId)) {
    console.error('Invalid tmdb_person_id');
    process.exit(1);
  }

  ensureOutDir();
  try {
    const snapshot = await buildSnapshot(personId, slug);

    const outPath = path.join(OUT_DIR, `${slug}-tmdb-snapshot.json`);
    fs.writeFileSync(outPath, JSON.stringify(snapshot, null, 2), 'utf8');
    console.log(`Snapshot written to: ${outPath}`);
  } catch (err) {
    console.error('Failed to build snapshot:', err);
    process.exit(1);
  }
}

main();
