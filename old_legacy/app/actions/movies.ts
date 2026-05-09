'use server';

import { db } from '@/lib/db';
import { movies, heroMovies, heroes } from '@/lib/schema';
import { eq, ilike } from 'drizzle-orm';

interface FilterOptions {
  search?: string;
  year?: number;
  sortBy?: 'year-desc' | 'year-asc' | 'rating-desc' | 'rating-asc' | 'title-asc';
  movieType?: string;
  heroSlug?: string;
  limit?: number;
  offset?: number;
}

export async function getHeroesList() {
  try {
    const allHeroes = await db
      .select({ id: heroes.id, name: heroes.name, slug: heroes.slug })
      .from(heroes)
      .orderBy(heroes.name);

    return { success: true, data: allHeroes };
  } catch (error) {
    console.error('❌ Error fetching heroes:', error);
    return { success: false, data: [] };
  }
}

export async function getMoviesFromDB(filters: FilterOptions = {}) {
  try {
    const {
      search = '',
      year,
      sortBy = 'year-desc',
      movieType = 'upcoming',
      heroSlug,
      limit = 50,
    } = filters;

    let query = db.select().from(movies);

    // ✅ If heroSlug provided → show ALL his movies
    if (heroSlug && heroSlug !== 'all') {
      const hero = await db
        .select()
        .from(heroes)
        .where(eq(heroes.slug, heroSlug))
        .limit(1);

      if (hero.length > 0) {
        query = query
          .innerJoin(heroMovies, eq(movies.id, heroMovies.movieId))
          .where(eq(heroMovies.heroId, hero[0].id))
          .select({
            id: movies.id,
            tmdbId: movies.tmdbId,
            title: movies.title,
            slug: movies.slug,
            year: movies.year,
            director: movies.director,
            genre: movies.genre,
            budget: movies.budget,
            posterPath: movies.posterPath,
            poster: movies.poster,
            imdbRating: movies.imdbRating,
            movieType: movies.movieType,
            role: heroMovies.role,
          });
      }
    } else {
      // ✅ If no hero → filter by movieType
      query = query.where(eq(movies.movieType, movieType));
      query = query.select({
        id: movies.id,
        tmdbId: movies.tmdbId,
        title: movies.title,
        slug: movies.slug,
        year: movies.year,
        director: movies.director,
        genre: movies.genre,
        budget: movies.budget,
        posterPath: movies.posterPath,
        poster: movies.poster,
        imdbRating: movies.imdbRating,
        movieType: movies.movieType,
        role: null,
      });
    }

    // Search
    if (search) {
      query = query.where(ilike(movies.title, `%${search}%`));
    }

    // Filter by year
    if (year) {
      query = query.where(eq(movies.year, year));
    }

    // Sort
    if (sortBy === 'year-desc') {
      query = query.orderBy(movies.year);
    } else if (sortBy === 'year-asc') {
      query = query.orderBy(movies.year);
    } else if (sortBy === 'rating-desc') {
      query = query.orderBy(movies.imdbRating);
    } else if (sortBy === 'rating-asc') {
      query = query.orderBy(movies.imdbRating);
    } else if (sortBy === 'title-asc') {
      query = query.orderBy(movies.title);
    }

    const result = await query.limit(limit);

    return {
      success: true,
      data: result.map((r: any) => ({
        id: r.id || r.movies?.id,
        tmdbId: r.tmdbId || r.movies?.tmdbId,
        title: r.title || r.movies?.title,
        slug: r.slug || r.movies?.slug,
        year: r.year || r.movies?.year,
        director: r.director || r.movies?.director,
        genre: r.genre || r.movies?.genre,
        budget: r.budget || r.movies?.budget,
        posterPath: r.posterPath || r.movies?.posterPath,
        poster: r.poster || r.movies?.poster,
        imdbRating: r.imdbRating || r.movies?.imdbRating,
        movieType: r.movieType || r.movies?.movieType,
        role: r.role,
      })),
    };
  } catch (error) {
    console.error('❌ Error fetching movies:', error);
    return { success: false, error: 'Failed', data: [] };
  }
}

export async function getMovieStats() {
  try {
    const allMovies = await db.select().from(movies);

    const released = allMovies.filter((m) => m.movieType === 'released').length;
    const upcoming = allMovies.filter((m) => m.movieType === 'upcoming').length;

    const genres = new Set<string>();
    allMovies.forEach((m) => {
      if (Array.isArray(m.genre)) {
        m.genre.forEach((g) => genres.add(g));
      }
    });

    return {
      success: true,
      data: {
        totalMovies: allMovies.length,
        releasedMovies: released,
        upcomingMovies: upcoming,
        genres: Array.from(genres).sort(),
      },
    };
  } catch (error) {
    console.error('❌ Error:', error);
    return { success: false, data: { totalMovies: 0, releasedMovies: 0, upcomingMovies: 0, genres: [] } };
  }
}

export async function getUniqueYears() {
  try {
    const allMovies = await db.select({ year: movies.year }).from(movies);
    const years = Array.from(new Set(allMovies.map((m) => m.year).filter(Boolean)))
      .sort((a, b) => (b || 0) - (a || 0));
    return { success: true, data: years };
  } catch (error) {
    return { success: false, data: [] };
  }
}
