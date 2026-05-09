'use server';

import { db } from '@/lib/db';
import { movies, movieOttLinks, movieCredits, people } from '@/lib/schema';
import { desc, eq, ilike, and, sql, exists, asc, inArray, gte } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

export const getMovies = unstable_cache(
    async (params: { 
        page?: number; 
        limit?: number; 
        search?: string;
        year?: number | string;
        genre?: string;
        platform?: string;
        status?: string;
        hasOttLinks?: boolean;
        inTheaters?: boolean;
        recentlyReleased?: boolean;
        sortBy?: 'popularity' | 'releaseDate' | 'voteAverage' | 'newest';
    } = {}) => {
        const { 
            page = 1, 
            limit = 20, 
            search, 
            year,
            platform,
            status,
            hasOttLinks,
            inTheaters,
            recentlyReleased,
            sortBy = 'popularity' 
        } = params;
        
        const offset = (page - 1) * limit;

        const where = [];
        if (search) where.push(ilike(movies.title, `%${search}%`));
        if (status) {
            const statusList = status.split(',').map(s => s.trim());
            where.push(inArray(movies.status, statusList));
        }
        
        if (year && year !== 'all') {
            if (typeof year === 'string' && year.includes('-')) {
                const [start, end] = year.split('-').map(Number);
                where.push(sql`${movies.year} >= ${start} AND ${movies.year} <= ${end}`);
            } else {
                where.push(eq(movies.year, Number(year)));
            }
        }

        if (recentlyReleased) {
            const date45DaysAgo = new Date();
            date45DaysAgo.setDate(date45DaysAgo.getDate() - 45);
            where.push(gte(movies.releaseDate, date45DaysAgo));
        }

        const THEATRICAL_PLATFORMS = ['BookMyShow', 'District by Zomato', 'Cinépolis India', 'PVR Cinemas', 'Paytm Entertainment', 'TicketNew'];

        if (params.hasOttLinks) {
            where.push(
                exists(
                    db.select()
                        .from(movieOttLinks)
                        .where(
                            and(
                                eq(movieOttLinks.movieId, movies.id),
                                sql`${movieOttLinks.platform} NOT IN ${THEATRICAL_PLATFORMS}`
                            )
                        )
                )
            );
        }

        if (params.inTheaters) {
            where.push(
                exists(
                    db.select()
                        .from(movieOttLinks)
                        .where(
                            and(
                                eq(movieOttLinks.movieId, movies.id),
                                sql`${movieOttLinks.platform} IN ${THEATRICAL_PLATFORMS}`
                            )
                        )
                )
            );
        }

        if (platform && platform !== 'all') {
            where.push(
                exists(
                    db.select()
                        .from(movieOttLinks)
                        .where(
                            and(
                                eq(movieOttLinks.movieId, movies.id),
                                ilike(movieOttLinks.platform, `%${platform}%`)
                            )
                        )
                )
            );
        }

        let order = desc(movies.popularity);
        if (sortBy === 'newest') order = desc(movies.releaseDate);
        else if (sortBy === 'releaseDate') order = desc(movies.releaseDate);
        else if (sortBy === 'voteAverage') order = desc(movies.voteAverage);

        const results = await db.select()
            .from(movies)
            .where(where.length > 0 ? and(...where) : undefined)
            .orderBy(order)
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
    
    if (!movie) return null;

    const ottLinks = await db.select()
        .from(movieOttLinks)
        .where(eq(movieOttLinks.movieId, movie.id));

    const credits = await db.select({
            roleType: movieCredits.roleType,
            character: movieCredits.character,
            job: movieCredits.job,
            department: movieCredits.department,
            orderIndex: movieCredits.orderIndex,
            person: {
                id: people.id,
                name: people.name,
                slug: people.slug,
                metadata: people.metadata
            }
        })
        .from(movieCredits)
        .innerJoin(people, eq(movieCredits.personId, people.id))
        .where(eq(movieCredits.movieId, movie.id))
        .orderBy(asc(movieCredits.orderIndex));

    return {
        ...movie,
        ottLinks,
        credits
    };
}
