// lib/tmdb.ts - TMDb API Helper Functions

const TMDB_API_KEY = process.env.TMDB_API_KEY || '4e532670adbc327a53938993187e8fba';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export type ImageSize = 'small' | 'medium' | 'large' | 'original';

export const IMAGE_SIZES = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    original: 'original',
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original',
  },
  profile: {
    small: 'w45',
    medium: 'w185',
    large: 'h632',
    original: 'original',
  },
};

// ============================================================================
// IMAGE URL HELPERS
// ============================================================================

export function getTMDbPosterUrl(posterPath: string | null, size: ImageSize = 'medium'): string {
  if (!posterPath) return '/images/no-poster.png';
  const sizeParam = IMAGE_SIZES.poster[size];
  return `${TMDB_IMAGE_BASE_URL}/${sizeParam}${posterPath}`;
}

export function getTMDbBackdropUrl(backdropPath: string | null, size: ImageSize = 'large'): string {
  if (!backdropPath) return '/images/no-poster.png';
  const sizeParam = IMAGE_SIZES.backdrop[size];
  return `${TMDB_IMAGE_BASE_URL}/${sizeParam}${backdropPath}`;
}

export function getTMDbProfileUrl(profilePath: string | null, size: ImageSize = 'medium'): string {
  if (!profilePath) return '/images/default-avatar.png';
  const sizeParam = IMAGE_SIZES.profile[size];
  return `${TMDB_IMAGE_BASE_URL}/${sizeParam}${profilePath}`;
}

// ============================================================================
// CORE API FETCHERS
// ============================================================================

export async function getMovieDetails(tmdbId: string | number) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`,
      { next: { revalidate: 86400 } }
    );
    if (!response.ok) throw new Error(`TMDb API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}

export async function searchMovies(query: string, page: number = 1) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}`,
      { next: { revalidate: 3600 } }
    );
    if (!response.ok) throw new Error(`TMDb API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error searching movies:', error);
    return null;
  }
}

export async function getMovieCredits(tmdbId: string | number) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${tmdbId}/credits?api_key=${TMDB_API_KEY}&language=en-US`,
      { next: { revalidate: 86400 } }
    );
    if (!response.ok) throw new Error(`TMDb API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching movie credits:', error);
    return null;
  }
}

export async function getPersonDetails(personId: string | number) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/person/${personId}?api_key=${TMDB_API_KEY}&language=en-US`,
      { next: { revalidate: 86400 } }
    );
    if (!response.ok) throw new Error(`TMDb API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching person details:', error);
    return null;
  }
}

export async function getPersonMovieCredits(personId: string | number) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/person/${personId}/movie_credits?api_key=${TMDB_API_KEY}&language=en-US`,
      { next: { revalidate: 86400 } }
    );
    if (!response.ok) throw new Error(`TMDb API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching person movie credits:', error);
    return null;
  }
}

export async function searchPerson(query: string, page: number = 1) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/person?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}`,
      { next: { revalidate: 3600 } }
    );
    if (!response.ok) throw new Error(`TMDb API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error searching person:', error);
    return null;
  }
}
