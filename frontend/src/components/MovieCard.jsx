import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function MovieCard({ movie }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link to={`/movies/${movie.id}`} className="card group block">
      {/* Poster */}
      <div className="aspect-[2/3] overflow-hidden bg-dark-hover relative">
        {!imgError && movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <span className="text-4xl">🎬</span>
            <span className="text-white/30 text-xs text-center px-2">{movie.title}</span>
          </div>
        )}

        {/* Rating badge */}
        {movie.imdb_rating && (
          <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm rounded px-1.5 py-0.5 flex items-center gap-1">
            <span className="text-brand text-xs">★</span>
            <span className="text-white text-xs font-semibold">{movie.imdb_rating}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-brand transition-colors">
          {movie.title}
        </h3>
        <p className="text-white/50 text-xs mt-1">{movie.release_year}</p>

        {/* Genres */}
        {movie.genres && movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {movie.genres.slice(0, 2).map(g => (
              <span key={g} className="badge bg-brand/10 text-brand/80">{g}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
