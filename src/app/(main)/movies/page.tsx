import { getMovies } from '@/app/actions/movies';
import { Film, Star, PlayCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { MovieFilters } from './components/MovieFilters';

export const metadata = {
    title: 'Movies | TFIverse',
    description: 'Explore the complete database of Telugu Cinema. From classics to latest blockbusters.',
};

import { MovieRow, MovieCard } from './components/MovieRow';

export default async function MoviesPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; q?: string; year?: string; platform?: string; sort?: string }>;
}) {
    const params = await searchParams;
    const page = parseInt(params.page || '1');
    const query = params.q || '';
    const year = params.year || 'all';
    const platform = params.platform || 'all';
    const sortBy = (params.sort as any) || 'popularity';

    const isFiltering = query || year !== 'all' || platform !== 'all' || sortBy !== 'popularity';

    // If user is actively searching/filtering, show grid
    let gridMovies: any[] = [];
    if (isFiltering) {
        gridMovies = await getMovies({ 
            page, 
            search: query,
            year,
            platform,
            sortBy
        });
    }

    // Otherwise fetch the curated rows
    const streamingNow = !isFiltering ? await getMovies({ status: 'Released', hasOttLinks: true, sortBy: 'newest', limit: 15 }) : [];
    const inTheatersNow = !isFiltering ? await getMovies({ status: 'Released', inTheaters: true, recentlyReleased: true, sortBy: 'popularity', limit: 15 }) : [];
    const topRated = !isFiltering ? await getMovies({ status: 'Released', year: '2024-2026', sortBy: 'voteAverage', limit: 15 }) : [];
    const postProduction = !isFiltering ? await getMovies({ status: 'Post Production', sortBy: 'popularity', limit: 15 }) : [];
    const inProduction = !isFiltering ? await getMovies({ status: 'In Production', sortBy: 'popularity', limit: 15 }) : [];
    const planned = !isFiltering ? await getMovies({ status: 'Planned', sortBy: 'popularity', limit: 15 }) : [];
    const rumored = !isFiltering ? await getMovies({ status: 'Rumored', sortBy: 'popularity', limit: 15 }) : [];
    const canceled = !isFiltering ? await getMovies({ status: 'Canceled', sortBy: 'popularity', limit: 15 }) : [];

    // Feature Hero Movie (first from streaming, inTheaters or top rated that has a backdrop)
    const heroMovie = inTheatersNow.find(m => m.backdropUrl) || streamingNow.find(m => m.backdropUrl) || topRated.find(m => m.backdropUrl) || gridMovies.find(m => m.backdropUrl) || inTheatersNow[0] || streamingNow[0];

    const buildQueryStr = (p: number) => {
        const usp = new URLSearchParams();
        if (p > 1) usp.set('page', p.toString());
        if (query) usp.set('q', query);
        if (year !== 'all') usp.set('year', year);
        if (platform !== 'all') usp.set('platform', platform);
        if (sortBy !== 'popularity') usp.set('sort', sortBy);
        const str = usp.toString();
        return str ? `?${str}` : '';
    };

    return (
        <div className="min-h-screen bg-black text-white pb-12">
            
            {/* Spotlight Hero Section */}
            {heroMovie && !isFiltering && (
                <div className="relative w-full h-[70vh] md:h-[80vh] mb-12">
                    {heroMovie.backdropUrl ? (
                        <Image 
                            src={`https://image.tmdb.org/t/p/original${heroMovie.backdropUrl}`}
                            alt={heroMovie.title}
                            fill
                            className="object-cover object-top opacity-70"
                            priority
                        />
                    ) : (
                        <div className="absolute inset-0 bg-zinc-900" />
                    )}
                    {/* Double Gradient for cinematic look: dark at bottom, dark on left for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent md:via-transparent" />
                    
                    <div className="absolute bottom-0 left-0 w-full px-6 md:px-16 pb-16 z-20">
                        <div className="max-w-3xl">
                            <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-4 leading-none text-white drop-shadow-2xl">
                                {heroMovie.title}
                            </h1>
                            
                            <div className="flex items-center gap-4 text-xs md:text-sm font-bold text-zinc-300 uppercase tracking-widest mb-6 drop-shadow-md">
                                <span>{heroMovie.year}</span>
                                {heroMovie.runtime > 0 && (
                                    <>
                                        <span className="text-zinc-600">•</span>
                                        <span>{Math.floor(heroMovie.runtime / 60)}h {heroMovie.runtime % 60}m</span>
                                    </>
                                )}
                                {heroMovie.voteAverage !== null && heroMovie.voteAverage > 0 && (
                                    <>
                                        <span className="text-zinc-600">•</span>
                                        <span className="flex items-center gap-1 text-white">
                                            <Star className="w-3 h-3 md:w-4 md:h-4 fill-white" /> 
                                            {heroMovie.voteAverage.toFixed(1)}
                                        </span>
                                    </>
                                )}
                            </div>

                            <p className="text-zinc-400 text-lg md:text-xl line-clamp-2 md:line-clamp-3 max-w-2xl mb-8 leading-relaxed drop-shadow-md">
                                {heroMovie.overview}
                            </p>
                            <Link 
                                href={`/movies/${heroMovie.slug}`}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest text-sm transition-all hover:scale-105 hover:bg-zinc-200"
                            >
                                <PlayCircle className="w-5 h-5" />
                                View Details
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* If filtering, we don't need huge hero, just some spacing */}
            {isFiltering && <div className="pt-32" />}

            {/* Command Center / Filters */}
            <div className="px-6 md:px-16 mb-12 relative z-30 -mt-8">
                <MovieFilters />
            </div>

            {/* Content Layouts */}
            {isFiltering ? (
                // GRID VIEW (Active Search/Filters)
                <div className="px-6 md:px-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black uppercase tracking-widest">
                            Results
                        </h2>
                    </div>

                    {gridMovies.length === 0 ? (
                        <div className="text-center py-20 bg-zinc-900/20 rounded-3xl border border-zinc-900">
                            <p className="text-zinc-500 font-bold uppercase tracking-widest">No movies found matching your criteria.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                                {gridMovies.map((movie) => (
                                    <MovieCard key={movie.id} movie={movie} />
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="mt-20 flex items-center justify-center gap-4">
                                <Link 
                                    href={`/movies${buildQueryStr(Math.max(1, page - 1))}`}
                                    className={`px-6 py-3 rounded-xl border border-zinc-900 font-bold text-sm uppercase tracking-widest transition-all hover:bg-white hover:text-black ${page === 1 ? 'opacity-30 pointer-events-none' : ''}`}
                                >
                                    Previous
                                </Link>
                                <div className="text-zinc-500 font-black text-sm uppercase tracking-widest">
                                    Page {page}
                                </div>
                                <Link 
                                    href={`/movies${buildQueryStr(page + 1)}`}
                                    className={`px-6 py-3 rounded-xl border border-zinc-900 font-bold text-sm uppercase tracking-widest transition-all hover:bg-white hover:text-black ${gridMovies.length < 20 ? 'opacity-30 pointer-events-none' : ''}`}
                                >
                                    Next
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                // NETFLIX-STYLE ROWS VIEW (Default Exploration)
                <div className="pb-12">
                    <MovieRow 
                        title="In Theaters" 
                        description="Catch these latest releases on the big screen near you."
                        movies={inTheatersNow.filter(m => m.id !== heroMovie?.id)} 
                    />
                    <MovieRow 
                        title="Now Streaming" 
                        description="Currently available on your favorite streaming platforms."
                        movies={streamingNow.filter(m => m.id !== heroMovie?.id && !inTheatersNow.find(t => t.id === m.id))} 
                    />
                    <MovieRow 
                        title="Highest Rated" 
                        description="The most critically acclaimed masterpieces of 2024-2026."
                        movies={topRated} 
                    />
                    <MovieRow 
                        title="Post-Production" 
                        description="Editing & Polishing: VFX, sound mixing, color grading, final cut."
                        movies={postProduction} 
                    />
                    <MovieRow 
                        title="In Production" 
                        description="Active Filming: Principal photography, shooting scenes, onset coordination."
                        movies={inProduction} 
                    />
                    <MovieRow 
                        title="Planned" 
                        description="Officially announced; script or financing is being finalized."
                        movies={planned} 
                    />
                    <MovieRow 
                        title="Rumored" 
                        description="Unofficial reports or speculation about a project's existence."
                        movies={rumored} 
                    />
                    <MovieRow 
                        title="Canceled" 
                        description="The project has been officially scrapped by the studio."
                        movies={canceled} 
                    />
                    
                    {/* Genres Pills */}
                    <section className="px-6 md:px-16 mt-20">
                        <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest mb-6 flex items-center gap-3">
                            Explore by Genre <div className="flex-1 h-[1px] bg-zinc-900" />
                        </h2>
                        <div className="flex flex-wrap gap-4">
                            {['Action', 'Romance', 'Comedy', 'Drama', 'Thriller', 'Horror', 'Sci-Fi', 'Family'].map(genre => (
                                <Link 
                                    key={genre}
                                    href={`/movies?q=${genre}`}
                                    className="px-6 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold uppercase tracking-widest hover:text-white hover:border-zinc-600 transition-all"
                                >
                                    {genre}
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}
