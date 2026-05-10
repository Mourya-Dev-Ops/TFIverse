'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Film, PlayCircle, Star } from 'lucide-react';

export const MovieCard = ({ movie }: { movie: any }) => (
    <Link 
        href={`/movies/${movie.slug}`}
        className="group relative flex flex-col gap-3 w-[160px] md:w-[200px]"
    >
        <div className="w-full relative aspect-[2/3] rounded-2xl overflow-hidden border border-zinc-900 bg-zinc-900 shadow-xl transition-all duration-500 group-hover:scale-[1.03] group-hover:border-zinc-700">
            {movie.posterUrl ? (
                <Image 
                    src={`https://image.tmdb.org/t/p/w500${movie.posterUrl}`}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 160px, 200px"
                />
            ) : (
                <div className="flex items-center justify-center h-full opacity-20">
                    <Film className="w-12 h-12" />
                </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            
            {/* Play Button Overlay on Hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 shadow-2xl scale-75 group-hover:scale-100 transition-all duration-300">
                    <PlayCircle className="w-6 h-6 text-white" />
                </div>
            </div>

            {movie.voteAverage !== null && movie.voteAverage > 0 && (
                <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 flex items-center gap-1 z-20">
                    <Star className="w-3 h-3 text-white fill-white" />
                    <span className="text-[10px] font-bold text-white">{movie.voteAverage.toFixed(1)}</span>
                </div>
            )}

            {movie.year && (
                <div className="absolute bottom-3 left-3 px-2 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 z-20">
                    <span className="text-[10px] font-bold text-zinc-300">{movie.year}</span>
                </div>
            )}
        </div>

        <div className="px-1">
            <h3 className="font-bold text-sm line-clamp-2 group-hover:text-white transition-colors uppercase tracking-tight">
                {movie.title}
            </h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                {movie.metadata?.genres?.[0]?.name || 'Movie'}
            </p>
        </div>
    </Link>
);

export function MovieRow({ title, description, movies }: { title: string, description?: string, movies: any[] }) {
    const rowRef = useRef<HTMLDivElement>(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(true);

    const handleScroll = () => {
        if (!rowRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
        setShowLeft(scrollLeft > 0);
        setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
    };

    useEffect(() => {
        handleScroll();
        window.addEventListener('resize', handleScroll);
        return () => window.removeEventListener('resize', handleScroll);
    }, [movies]);

    const scroll = (direction: 'left' | 'right') => {
        if (rowRef.current) {
            const { clientWidth } = rowRef.current;
            const scrollAmount = direction === 'left' ? -clientWidth + 200 : clientWidth - 200;
            rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (!movies || movies.length === 0) return null;

    return (
        <section className="mb-16 relative group/row">
            <div className="px-6 md:px-16 mb-6">
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest flex items-center gap-3">
                    {title} <div className="flex-1 h-[1px] bg-zinc-900" />
                </h2>
                {description && (
                    <p className="text-sm text-zinc-500 font-medium mt-2 max-w-3xl leading-relaxed">
                        {description}
                    </p>
                )}
            </div>
            
            <div className="relative">
                {/* Left Scroll Button */}
                {showLeft && (
                    <button 
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-0 bottom-12 w-16 bg-gradient-to-r from-black via-black/80 to-transparent z-30 flex items-center justify-start pl-4 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 hidden md:flex"
                    >
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-white hover:text-black hover:scale-110 transition-all">
                            <ChevronLeft className="w-6 h-6" />
                        </div>
                    </button>
                )}

                {/* Right Scroll Button */}
                {showRight && (
                    <button 
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-0 bottom-12 w-16 bg-gradient-to-l from-black via-black/80 to-transparent z-30 flex items-center justify-end pr-4 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 hidden md:flex"
                    >
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-white hover:text-black hover:scale-110 transition-all">
                            <ChevronRight className="w-6 h-6" />
                        </div>
                    </button>
                )}

                <div 
                    ref={rowRef}
                    onScroll={handleScroll}
                    className="flex items-start overflow-x-auto gap-6 px-6 md:px-16 pb-8 snap-x scrollbar-hide scroll-smooth"
                >
                    {movies.map(movie => (
                        <div key={movie.id} className="snap-start shrink-0">
                            <MovieCard movie={movie} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
