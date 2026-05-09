// lib/tmdb.ts - TMDb API Helper Functions

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '4e532670adbc327a53938993187e8fba';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Image size options
type ImageSize = 'small' | 'medium' | 'large' | 'original';

const IMAGE_SIZES = {
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

// Get TMDb poster URL
export function getTMDbPosterUrl(posterPath: string, size: ImageSize = 'medium'): string {
  if (!posterPath) return '/images/no-poster.png';
  
  const sizeParam = IMAGE_SIZES.poster[size];
  return `${TMDB_IMAGE_BASE_URL}/${sizeParam}${posterPath}`;
}

// Get TMDb backdrop URL
export function getTMDbBackdropUrl(backdropPath: string, size: ImageSize = 'large'): string {
  if (!backdropPath) return '/images/no-poster.png';
  
  const sizeParam = IMAGE_SIZES.backdrop[size];
  return `${TMDB_IMAGE_BASE_URL}/${sizeParam}${backdropPath}`;
}

// Get TMDb profile image URL
export function getTMDbProfileUrl(profilePath: string, size: ImageSize = 'medium'): string {
  if (!profilePath) return '/images/default-avatar.png';
  
  const sizeParam = IMAGE_SIZES.profile[size];
  return `${TMDB_IMAGE_BASE_URL}/${sizeParam}${profilePath}`;
}

// Fetch movie details from TMDb
export async function getMovieDetails(tmdbId: string | number) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    );

    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}

// Search movies on TMDb
export async function searchMovies(query: string, page: number = 1) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching movies:', error);
    return null;
  }
}

// Get movie credits (cast & crew)
export async function getMovieCredits(tmdbId: string | number) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${tmdbId}/credits?api_key=${TMDB_API_KEY}&language=en-US`,
      { next: { revalidate: 86400 } }
    );

    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching movie credits:', error);
    return null;
  }
}

// Get similar movies
export async function getSimilarMovies(tmdbId: string | number) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${tmdbId}/similar?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
      { next: { revalidate: 86400 } }
    );

    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching similar movies:', error);
    return null;
  }
}

// Get movie videos (trailers, teasers, etc.)
export async function getMovieVideos(tmdbId: string | number) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${tmdbId}/videos?api_key=${TMDB_API_KEY}&language=en-US`,
      { next: { revalidate: 86400 } }
    );

    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching movie videos:', error);
    return null;
  }
}

// Get trending movies
export async function getTrendingMovies(timeWindow: 'day' | 'week' = 'week') {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/movie/${timeWindow}?api_key=${TMDB_API_KEY}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return null;
  }
}

// Get popular movies
export async function getPopularMovies(page: number = 1) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return null;
  }
}

// Get now playing movies
export async function getNowPlayingMovies(page: number = 1) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching now playing movies:', error);
    return null;
  }
}

// Helper: Get YouTube trailer URL
export function getYouTubeTrailerUrl(videoKey: string): string {
  return `https://www.youtube.com/watch?v=${videoKey}`;
}

// Helper: Get YouTube embed URL
export function getYouTubeEmbedUrl(videoKey: string): string {
  return `https://www.youtube.com/embed/${videoKey}`;
}
