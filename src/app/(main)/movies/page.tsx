import { getMovies } from '@/app/actions/movies';
import { Film, Filter, Search, Star, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
    title: 'Movies | TFIverse',
    description: 'Explore the complete database of Telugu Cinema. From classics to latest blockbusters.',
};

export default async function MoviesPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; q?: string }>;
}) {
    const params = await searchParams;
    const page = parseInt(params.page || '1');
    const query = params.q || '';

    const movies = await getMovies({ page, search: query });

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12 px-6 md:px-16">
            {/* Cinematic Header */}
            <div className="relative mb-16">
                <div className="absolute -top-24 left-0 w-full h-[50vh] bg-gradient-to-b from-amber-500/10 via-transparent to-transparent pointer-events-none" />
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                            Database
                        </span>
                        <div className="w-12 h-[1px] bg-zinc-800" />
                        <TrendingUp className="w-4 h-4 text-zinc-500" />
                    </div>
                    
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-6 leading-none">
                        Telugu <span className="text-zinc-600">Cinema</span><br />
                        <span className="text-amber-500">Universe</span>
                    </h1>
                    
                    <p className="max-w-2xl text-zinc-400 text-lg leading-relaxed mb-8">
                        The ultimate destination for Telugu movie data. Tracking over 6,000+ films, 
                        real-time box office, and industry milestones.
                    </p>

                    {/* Search Bar */}
                    <form className="relative max-w-xl group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-amber-500 transition-colors" />
                        <input 
                            name="q"
                            defaultValue={query}
                            placeholder="Search for movies, actors, or directors..."
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-zinc-900 transition-all backdrop-blur-xl"
                        />
                    </form>
                </div>
            </div>

            {/* Movies Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {movies.map((movie) => (
                    <Link 
                        key={movie.id}
                        href={`/movies/${movie.slug}`}
                        className="group relative flex flex-col gap-3"
                    >
                        {/* Poster Frame */}
                        <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl transition-all duration-500 group-hover:scale-[1.02] group-hover:border-amber-500/50">
                            {movie.posterUrl ? (
                                <Image 
                                    src={`https://image.tmdb.org/t/p/w500${movie.posterUrl}`}
                                    alt={movie.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 768px) 50vw, 20vw"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full opacity-20">
                                    <Film className="w-12 h-12" />
                                </div>
                            )}
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                            
                            {/* Vote Average Badge */}
                            {movie.voteAverage > 0 && (
                                <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1">
                                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                    <span className="text-[10px] font-bold">{movie.voteAverage.toFixed(1)}</span>
                                </div>
                            )}

                            {/* Year Badge */}
                            {movie.year && (
                                <div className="absolute bottom-3 left-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10">
                                    <span className="text-[10px] font-bold text-zinc-300">{movie.year}</span>
                                </div>
                            )}
                        </div>

                        {/* Title Info */}
                        <div className="px-1">
                            <h3 className="font-bold text-sm line-clamp-1 group-hover:text-amber-500 transition-colors uppercase tracking-tight">
                                {movie.title}
                            </h3>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                                {movie.metadata?.genres?.[0] || 'Movie'}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Pagination */}
            <div className="mt-20 flex items-center justify-center gap-4">
                <Link 
                    href={`/movies?page=${Math.max(1, page - 1)}${query ? `&q=${query}` : ''}`}
                    className={`px-6 py-3 rounded-xl border border-zinc-800 font-bold text-sm uppercase tracking-widest transition-all hover:bg-white hover:text-black ${page === 1 ? 'opacity-30 pointer-events-none' : ''}`}
                >
                    Previous
                </Link>
                <div className="text-zinc-500 font-black text-sm uppercase tracking-widest">
                    Page {page}
                </div>
                <Link 
                    href={`/movies?page=${page + 1}${query ? `&q=${query}` : ''}`}
                    className="px-6 py-3 rounded-xl border border-zinc-800 font-bold text-sm uppercase tracking-widest transition-all hover:bg-white hover:text-black"
                >
                    Next
                </Link>
            </div>
        </div>
    );
}
