// lib/tmdb.ts - TMDb API Helper with Multi-Key Rotation & Caching

const TMDB_KEYS = (process.env.NEXT_PUBLIC_TMDB_API_KEY || 'ba5dc12f58f09088d036049c565c2fe9')
  .split(',')
  .map(k => k.trim())
  .filter(Boolean);

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// ============================================================================
// MULTI-KEY ROTATION SYSTEM
// ============================================================================
// TMDB allows ~40 requests per 10 seconds per API key.
// If you add multiple keys comma-separated in your .env, we'll auto-rotate.
// Example: NEXT_PUBLIC_TMDB_API_KEY=key1,key2,key3

let currentKeyIndex = 0;
const keyStats = new Map<string, { failures: number; lastFail: number; cooldownUntil: number }>();

function getNextKey(): string {
  const now = Date.now();
  
  // Try each key starting from current index
  for (let i = 0; i < TMDB_KEYS.length; i++) {
    const idx = (currentKeyIndex + i) % TMDB_KEYS.length;
    const key = TMDB_KEYS[idx];
    const stats = keyStats.get(key);
    
    // If key is in cooldown, skip it
    if (stats && stats.cooldownUntil > now) continue;
    
    currentKeyIndex = (idx + 1) % TMDB_KEYS.length;
    return key;
  }
  
  // All keys are in cooldown — use whatever is available (oldest cooldown)
  currentKeyIndex = (currentKeyIndex + 1) % TMDB_KEYS.length;
  return TMDB_KEYS[currentKeyIndex];
}

function markKeyFailed(key: string) {
  const stats = keyStats.get(key) || { failures: 0, lastFail: 0, cooldownUntil: 0 };
  stats.failures++;
  stats.lastFail = Date.now();
  // Exponential backoff: 10s, 30s, 60s, 120s max
  const cooldownMs = Math.min(10000 * Math.pow(2, stats.failures - 1), 120000);
  stats.cooldownUntil = Date.now() + cooldownMs;
  keyStats.set(key, stats);
}

function markKeySuccess(key: string) {
  keyStats.delete(key); // Reset failure count on success
}

// ============================================================================
// IN-MEMORY RESPONSE CACHE
// ============================================================================

const responseCache = new Map<string, { data: any; cachedAt: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 6; // 6 hours for API responses
const MAX_CACHE_ENTRIES = 2000;

function getCached(key: string): any | null {
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.cachedAt > CACHE_TTL) {
    responseCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: any) {
  if (responseCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = responseCache.keys().next().value;
    if (oldestKey) responseCache.delete(oldestKey);
  }
  responseCache.set(key, { data, cachedAt: Date.now() });
}

// ============================================================================
// CORE FETCH WITH ROTATION
// ============================================================================

async function tmdbFetch(endpoint: string, params: Record<string, string> = {}): Promise<any> {
  const cacheKey = `${endpoint}?${JSON.stringify(params)}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  let lastError: Error | null = null;
  
  // Try up to the number of available keys
  for (let attempt = 0; attempt < TMDB_KEYS.length; attempt++) {
    const apiKey = getNextKey();
    const searchParams = new URLSearchParams({ api_key: apiKey, ...params });
    const url = `${TMDB_BASE_URL}${endpoint}?${searchParams}`;

    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'TFiverse/2.0' },
        next: { revalidate: 3600 }, // Next.js fetch cache: 1 hour
      });

      if (response.status === 429) {
        // Rate limited — mark this key and try next
        markKeyFailed(apiKey);
        console.warn(`[TMDB] Rate limited on key ...${apiKey.slice(-4)}, rotating...`);
        continue;
      }

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      markKeySuccess(apiKey);
      setCache(cacheKey, data);
      return data;
    } catch (error) {
      lastError = error as Error;
      markKeyFailed(apiKey);
    }
  }

  throw lastError || new Error('All TMDB API keys exhausted');
}

// ============================================================================
// PUBLIC API FUNCTIONS
// ============================================================================

export async function searchMovies(query: string, page = 1) {
  return tmdbFetch('/search/movie', { query, page: String(page), language: 'en-US' });
}

export async function searchPeople(query: string, page = 1) {
  return tmdbFetch('/search/person', { query, page: String(page), language: 'en-US' });
}

export async function getMovieDetails(movieId: number) {
  return tmdbFetch(`/movie/${movieId}`, { language: 'en-US', append_to_response: 'credits,videos,images' });
}

export async function getPersonDetails(personId: number) {
  return tmdbFetch(`/person/${personId}`, { language: 'en-US', append_to_response: 'movie_credits,images' });
}

export async function getTrendingMovies(timeWindow: 'day' | 'week' = 'week') {
  return tmdbFetch(`/trending/movie/${timeWindow}`, { language: 'en-US' });
}

export async function getPopularMovies(page = 1) {
  return tmdbFetch('/movie/popular', { page: String(page), language: 'en-US' });
}

export async function getMoviesByGenre(genreId: number, page = 1) {
  return tmdbFetch('/discover/movie', { 
    with_genres: String(genreId), page: String(page), language: 'en-US',
    sort_by: 'popularity.desc'
  });
}

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
    cacheSize: responseCache.size,
  };
}
