import Image from 'next/image';
import Link from 'next/link';
import { Film } from 'lucide-react';

interface SimilarMoviesProps {
  recommendations?: any[];
}

export function SimilarMovies({ recommendations }: SimilarMoviesProps) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <section className="mt-20">
      <h2 className="text-sm font-black uppercase tracking-widest mb-6 text-zinc-500 border-b border-white/10 pb-4">
        Similar Movies
      </h2>
      <div className="flex overflow-x-auto gap-4 pb-4 snap-x scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
        {recommendations.slice(0, 10).map((movie: any) => (
          <Link 
            href={`/movies/${movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${movie.id}`} 
            key={movie.id} 
            className="shrink-0 w-36 md:w-44 group snap-start"
          >
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-zinc-900 mb-3 shadow-lg border border-white/5 group-hover:border-white/20 transition-colors">
              {movie.poster_path ? (
                <Image 
                  src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`} 
                  alt={movie.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Film className="w-8 h-8 text-zinc-800" />
                </div>
              )}
            </div>
            <h3 className="font-bold text-sm text-white tracking-tight line-clamp-1 group-hover:text-blue-400 transition-colors">
              {movie.title}
            </h3>
            <p className="text-xs font-bold text-zinc-500 mt-1">
              {movie.release_date?.substring(0, 4)} • ⭐ {movie.vote_average?.toFixed(1)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
