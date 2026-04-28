import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchJSON } from '../api';
import Spinner from '../components/Spinner';

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchJSON(`/movies/${id}`)
      .then(setMovie)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!movie) return (
    <div className="text-center py-20">
      <span className="text-5xl block mb-4">🎬</span>
      <p className="text-white/50">Movie not found.</p>
      <Link to="/movies" className="btn-brand mt-4 inline-block">Back to Movies</Link>
    </div>
  );

  const hours = movie.duration_min ? Math.floor(movie.duration_min / 60) : null;
  const mins = movie.duration_min ? movie.duration_min % 60 : null;

  return (
    <div>
      {/* ── Banner ──────────────────────────────────────────────────────────── */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        {!imgError && (movie.banner || movie.poster) ? (
          <img
            src={movie.banner || movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-dark-card flex items-center justify-center">
            <span className="text-6xl">🎬</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />

        {/* Breadcrumb */}
        <div className="absolute top-4 left-4 sm:left-8">
          <Link to="/movies" className="text-white/60 hover:text-white text-sm transition-colors">
            ← Movies
          </Link>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Poster */}
          <div className="flex-shrink-0 w-40 md:w-56">
            <div className="rounded-xl overflow-hidden bg-dark-card shadow-2xl aspect-[2/3]">
              {!imgError && movie.poster ? (
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-5xl">🎬</span>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 pt-24 md:pt-8">
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-3">
              {movie.genres?.map(g => (
                <Link
                  key={g}
                  to={`/movies?genre=${encodeURIComponent(g)}`}
                  className="badge bg-brand/15 text-brand hover:bg-brand/25 transition-colors"
                >
                  {g}
                </Link>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm mb-4">
              {movie.release_year && <span>{movie.release_year}</span>}
              {movie.duration_min && (
                <span>{hours}h {mins}m</span>
              )}
              {movie.language && <span>{movie.language}</span>}
              {movie.box_office && (
                <span className="text-green-400">💰 {movie.box_office}</span>
              )}
            </div>

            {/* Rating */}
            {movie.imdb_rating && (
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center gap-1 bg-brand/10 px-3 py-1.5 rounded-lg">
                  <span className="text-brand text-xl">★</span>
                  <span className="font-bold text-xl">{movie.imdb_rating}</span>
                  <span className="text-white/50 text-sm">/ 10</span>
                </div>
                <span className="text-white/40 text-sm">IMDb Rating</span>
              </div>
            )}

            {/* Synopsis */}
            {movie.synopsis && (
              <div className="mb-6">
                <h2 className="font-semibold text-white/80 mb-2">Synopsis</h2>
                <p className="text-white/70 leading-relaxed">{movie.synopsis}</p>
              </div>
            )}

            {/* Director */}
            {movie.director_name && (
              <div className="mb-6">
                <h2 className="font-semibold text-white/80 mb-2">Director</h2>
                <Link
                  to={`/persons/${movie.director_id}`}
                  className="inline-flex items-center gap-2 bg-dark-card hover:bg-dark-hover rounded-lg px-3 py-2 transition-colors"
                >
                  <span className="text-xl">🎥</span>
                  <span className="font-medium hover:text-brand transition-colors">{movie.director_name}</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ── Cast ──────────────────────────────────────────────────────────── */}
        {movie.cast && movie.cast.length > 0 && (
          <section className="mt-10">
            <h2 className="section-title">
              <span className="text-brand">🎭</span> Cast & Crew
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movie.cast.map(c => (
                <Link
                  key={c.id}
                  to={`/persons/${c.id}`}
                  className="card group text-center block"
                >
                  <div className="aspect-square overflow-hidden bg-dark-hover">
                    {c.photo ? (
                      <img
                        src={c.photo}
                        alt={c.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        onError={e => { e.target.style.display = 'none'; }}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">👤</div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="font-semibold text-xs group-hover:text-brand transition-colors">{c.name}</p>
                    <p className="text-white/40 text-xs mt-0.5 truncate">{c.role}</p>
                    <p className="text-white/25 text-xs capitalize">{c.role_type}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
