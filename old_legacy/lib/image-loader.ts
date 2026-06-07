// lib/image-loader.ts - Smart image loading with local/TMDb fallback

import { getTMDbPosterUrl, getMovieDetails } from './tmdb';

/**
 * Checks if a local image exists
 */
async function checkImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Smart poster loader - tries local first, then TMDb
 */
export async function loadMoviePoster(
  posterPath: string | undefined,
  tmdbId: string | number | undefined,
  movieTitle: string
): Promise<string> {
  // 1. Try local poster first
  if (posterPath && !posterPath.includes('placehold') && !posterPath.includes('unsplash')) {
    // Check if local file exists
    const localExists = await checkImageExists(posterPath);
    if (localExists) {
      return posterPath;
    }
  }

  // 2. Try TMDb if tmdbId exists
  if (tmdbId) {
    try {
      const tmdbData = await getMovieDetails(tmdbId);
      if (tmdbData?.poster_path) {
        return getTMDbPosterUrl(tmdbData.poster_path, 'large');
      }
    } catch (error) {
      console.error(`TMDb error for ${movieTitle}:`, error);
    }
  }

  // 3. Fallback to placeholder
  return `https://placehold.co/400x600/1a1a1a/e50914?text=${encodeURIComponent(movieTitle)}`;
}

/**
 * Load hero/heroine portrait - local only (no TMDb fallback)
 */
export function loadHeroPortrait(portraitUrl: string | undefined, heroName: string): string {
  if (portraitUrl && portraitUrl.startsWith('http')) {
    return portraitUrl;
  }
  return '/images/default-hero.png'; // Your default hero placeholder
}

/**
 * Load upcoming movie poster - local only
 */
export function loadUpcomingPoster(posterPath: string | undefined, title: string): string {
  if (posterPath && !posterPath.includes('placehold')) {
    return posterPath;
  }
  return `https://placehold.co/400x600/1a1a1a/e50914?text=${encodeURIComponent(title + ' (Coming Soon)')}`;
}
