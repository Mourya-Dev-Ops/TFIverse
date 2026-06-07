"use server";

import { db } from "@/lib/db";
import { people } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

/**
 * Returns a flat array of { slug, title, year, poster, hero } objects
 * for all heroes' movie lists stored in the people.metadata JSONB.
 * This replaces the static heroes.json import in tier list pages.
 */
export const getHeroMoviesForTierList = unstable_cache(
  async () => {
    const heroes = await db.query.people.findMany({
      where: eq(people.category, "hero"),
    });

    const movies: { slug: string; title: string; year?: number; poster?: string; hero: string }[] = [];

    for (const hero of heroes) {
      const meta = hero.metadata as any;
      const heroMovies = meta?.movies || [];
      for (const movie of heroMovies) {
        if (!movies.find(m => m.slug === movie.slug)) {
          movies.push({
            slug: movie.slug,
            title: movie.title,
            year: movie.year,
            poster: movie.poster || `/images/movies/${movie.slug}.jpg`,
            hero: hero.name,
          });
        }
      }
    }

    return movies;
  },
  ['hero-movies-for-tierlist'],
  { revalidate: 3600, tags: ['heroes', 'tierlist-movies'] }
);

/**
 * Returns hero list for profile search (favorite hero picker).
 * Replaces the heroesData import in edit-profile-modal.tsx.
 */
export const getHeroesForSearch = unstable_cache(
  async () => {
    const heroes = await db.query.people.findMany({
      where: eq(people.category, "hero"),
    });

    return heroes.map(h => {
      const meta = h.metadata as any;
      return {
        id: h.id,
        slug: h.slug,
        name: h.name,
        title: meta?.title || '',
        portraitUrl: meta?.portraitUrl || '/images/no-poster.png',
      };
    });
  },
  ['heroes-for-search'],
  { revalidate: 3600, tags: ['heroes'] }
);
