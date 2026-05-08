'use server';

import { db } from '@/lib/db';
import { movies } from '@/lib/schema';
import { desc, eq, ilike, and, gte, lte } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

export const getMovies = unstable_cache(
    async (params: { 
        page?: number; 
        limit?: number; 
        search?: string;
        year?: number;
        genre?: string;
        sortBy?: 'popularity' | 'releaseDate' | 'voteAverage';
    } = {}) => {
        const { 
            page = 1, 
            limit = 20, 
            search, 
            year,
            sortBy = 'popularity' 
        } = params;
        
        const offset = (page - 1) * limit;

        const where = [];
        if (search) where.push(ilike(movies.title, `%${search}%`));
        if (year) where.push(eq(movies.year, year));

        const results = await db.select()
            .from(movies)
            .where(where.length > 0 ? and(...where) : undefined)
            .orderBy(desc(movies[sortBy]))
            .limit(limit)
            .offset(offset);

        return results;
    },
    ['movies-list-v1'],
    { revalidate: 3600, tags: ['movies'] }
);

export async function getMovieDetails(slug: string) {
    const [movie] = await db.select()
        .from(movies)
        .where(eq(movies.slug, slug))
        .limit(1);
    
    return movie;
}
