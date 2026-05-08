// lib/tmdb.ts - TMDb API Helper with Edge Caching & Key Rotation
import { unstable_cache } from 'next/cache';

const TMDB_KEYS = (process.env.NEXT_PUBLIC_TMDB_API_KEY || '')
  .split(',')
  .map(k => k.trim())
  .filter(Boolean);

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// ============================================================================
// MULTI-KEY ROTATION SYSTEM
// ============================================================================
// Note: In serverless environments, this state resets on cold starts.
// This is acceptable as the primary caching layer (unstable_cache) prevents 
// concurrent lambdas from spamming TMDB simultaneously.

let currentKeyIndex = 0;
const keyStats = new Map<string, { failures: number; lastFail: number; cooldownUntil: number }>();

function getNextKey(): string {
  const now = Date.now();
  for (let i = 0; i < TMDB_KEYS.length; i++) {
    const idx = (currentKeyIndex + i) % TMDB_KEYS.length;
    const key = TMDB_KEYS[idx];
    const stats = keyStats.get(key);
    if (stats && stats.cooldownUntil > now) continue;
    currentKeyIndex = (idx + 1) % TMDB_KEYS.length;
    return key;
  }
  currentKeyIndex = (currentKeyIndex + 1) % TMDB_KEYS.length;
  return TMDB_KEYS[currentKeyIndex];
}

function markKeyFailed(key: string) {
  const stats = keyStats.get(key) || { failures: 0, lastFail: 0, cooldownUntil: 0 };
  stats.failures++;
  stats.lastFail = Date.now();
  const cooldownMs = Math.min(10000 * Math.pow(2, stats.failures - 1), 120000);
  stats.cooldownUntil = Date.now() + cooldownMs;
  keyStats.set(key, stats);
}

function markKeySuccess(key: string) {
  keyStats.delete(key);
}

// ============================================================================
// CORE FETCH WITH TIMEOUT & ROTATION
// ============================================================================

async function tmdbFetch(endpoint: string, params: Record<string, string> = {}): Promise<any> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < Math.max(1, TMDB_KEYS.length); attempt++) {
    const apiKey = getNextKey();
    if (!apiKey) throw new Error('No TMDB API keys configured');
    
    const searchParams = new URLSearchParams({ api_key: apiKey, ...params });
    const url = `${TMDB_BASE_URL}${endpoint}?${searchParams}`;

    try {
      // 8-second abort controller prevents serverless functions hanging on TMDB lag
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const response = await fetch(url, {
        headers: { 'User-Agent': 'TFiverse/2.0' },
        signal: controller.signal,
        // Native fetch deduplication & cache layer
        next: { revalidate: 3600 }, 
      });
      clearTimeout(timeoutId);

      if (response.status === 429) {
        markKeyFailed(apiKey);
        console.warn(`[TMDB] Rate limited on key ...${apiKey.slice(-4)}, rotating...`);
        continue; // Try next key
      }

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      markKeySuccess(apiKey);
      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
         console.warn(`[TMDB] Request timeout on key ...${apiKey.slice(-4)}`);
      }
      lastError = error as Error;
      markKeyFailed(apiKey);
    }
  }

  throw lastError || new Error('All TMDB API keys exhausted');
}

// ============================================================================
// PUBLIC API FUNCTIONS WITH NEXT.JS UNSTABLE_CACHE
// ============================================================================
// Explicit caching strategy prevents identical requests across multiple lambdas.
// Using explicit string keys and tags allows for easy bulk invalidation later.

export const searchMovies = async (query: string, page = 1) => {
  return unstable_cache(
    async () => tmdbFetch('/search/movie', { query, page: String(page), language: 'en-US' }),
    [`tmdb-search-movies-${query}-${page}`],
    { revalidate: 3600, tags: ['tmdb-search'] }
  )();
};

export const searchPeople = async (query: string, page = 1) => {
  return unstable_cache(
    async () => tmdbFetch('/search/person', { query, page: String(page), language: 'en-US' }),
    [`tmdb-search-people-${query}-${page}`],
    { revalidate: 3600, tags: ['tmdb-search'] }
  )();
};

export const getMovieDetails = async (movieId: number) => {
  return unstable_cache(
    async () => tmdbFetch(`/movie/${movieId}`, { language: 'en-US', append_to_response: 'credits,videos,images' }),
    [`tmdb-movie-details-${movieId}`],
    // Cache movie profiles for 24 hours (rarely change drastically)
    { revalidate: 86400, tags: ['tmdb', 'tmdb-movie', `movie-${movieId}`] }
  )();
};

export const getPersonDetails = async (personId: number) => {
  return unstable_cache(
    async () => tmdbFetch(`/person/${personId}`, { language: 'en-US', append_to_response: 'movie_credits,images' }),
    [`tmdb-person-details-${personId}`],
    // Cache celebrity profiles for 24 hours
    { revalidate: 86400, tags: ['tmdb', 'tmdb-person', `person-${personId}`] }
  )();
};

export const getTrendingMovies = async (timeWindow: 'day' | 'week' = 'week') => {
  return unstable_cache(
    async () => tmdbFetch(`/trending/movie/${timeWindow}`, { language: 'en-US' }),
    [`tmdb-trending-movies-${timeWindow}`],
    // Refresh trending every hour
    { revalidate: 3600, tags: ['tmdb-trending'] }
  )();
};

export const getPopularMovies = async (page = 1) => {
  return unstable_cache(
    async () => tmdbFetch('/movie/popular', { page: String(page), language: 'en-US' }),
    [`tmdb-popular-movies-${page}`],
    { revalidate: 3600, tags: ['tmdb-popular'] }
  )();
};

export const getMoviesByGenre = async (genreId: number, page = 1) => {
  return unstable_cache(
    async () => tmdbFetch('/discover/movie', { 
      with_genres: String(genreId), page: String(page), language: 'en-US',
      sort_by: 'popularity.desc'
    }),
    [`tmdb-movies-by-genre-${genreId}-${page}`],
    { revalidate: 86400, tags: ['tmdb-genre', `genre-${genreId}`] }
  )();
};

// ============================================================================
// IMAGE URL HELPERS
// ============================================================================

export function getPosterUrl(posterPath: string | null, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w342') {
  if (!posterPath) return '/images/no-poster.png';
  return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`;
}

export function getBackdropUrl(backdropPath: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280') {
  if (!backdropPath) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${backdropPath}`;
}

export function getProfileUrl(profilePath: string | null, size: 'w45' | 'w185' | 'h632' | 'original' = 'w185') {
  if (!profilePath) return '/images/no-poster.png';
  return `${TMDB_IMAGE_BASE_URL}/${size}${profilePath}`;
}

// ============================================================================
// KEY STATUS (for admin dashboard later)
// ============================================================================

export function getTmdbKeyStatus() {
  return {
    totalKeys: TMDB_KEYS.length,
    currentIndex: currentKeyIndex,
    keys: TMDB_KEYS.map((key, i) => {
      const stats = keyStats.get(key);
      return {
        index: i,
        lastChars: `...${key.slice(-4)}`,
        healthy: !stats || stats.cooldownUntil < Date.now(),
        failures: stats?.failures || 0,
        cooldownUntil: stats?.cooldownUntil || 0,
      };
    }),
    cacheStatus: 'Delegated to Next.js Edge Cache',
  };
}
