import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchJSON } from '../api';
import MovieCard from '../components/MovieCard';
import PersonCard from '../components/PersonCard';
import Spinner from '../components/Spinner';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [persons, setPersons] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchJSON('/movies/featured'),
      fetchJSON('/persons?limit=8'),
      fetchJSON('/genres'),
    ]).then(([feat, pers, gen]) => {
      setFeatured(feat);
      setPersons(pers.persons);
      setGenres(gen.filter(g => g.movie_count > 0));
      setLoading(false);
    }).catch(console.error);
  }, []);

  if (loading) return <Spinner />;

  const hero = featured[0];

  return (
    <div>
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      {hero && (
        <section className="relative h-[70vh] min-h-[480px] overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <img
              src={hero.banner || hero.poster}
              alt={hero.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="badge bg-brand text-black font-semibold">Featured</span>
                <span className="text-white/60 text-sm">{hero.release_year}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">{hero.title}</h1>

              <div className="flex items-center gap-3 mb-4">
                {hero.imdb_rating && (
                  <div className="flex items-center gap-1">
                    <span className="text-brand text-lg">★</span>
                    <span className="font-semibold">{hero.imdb_rating}</span>
                    <span className="text-white/50 text-sm">/ 10</span>
                  </div>
                )}
                {hero.director_name && (
                  <span className="text-white/50 text-sm">Dir: {hero.director_name}</span>
                )}
              </div>

              <p className="text-white/70 leading-relaxed mb-6 line-clamp-3">{hero.synopsis}</p>

              <div className="flex gap-3">
                <Link to={`/movies/${hero.id}`} className="btn-brand">
                  View Details
                </Link>
                <Link
                  to="/movies"
                  className="px-4 py-2 rounded-lg border border-white/20 hover:border-white/40 font-semibold transition-colors text-sm"
                >
                  All Movies
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Top Rated ─────────────────────────────────────────────────────── */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title mb-0">
              <span className="text-brand">★</span> Top Rated Movies
            </h2>
            <Link to="/movies" className="text-brand text-sm hover:text-brand-light transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {featured.map(m => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        </section>

        {/* ── Genres ────────────────────────────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="section-title">
            <span className="text-brand">🎭</span> Browse by Genre
          </h2>
          <div className="flex flex-wrap gap-3">
            {genres.map(g => (
              <Link
                key={g.id}
                to={`/movies?genre=${encodeURIComponent(g.name)}`}
                className="px-4 py-2 rounded-full bg-dark-card border border-white/10
                           hover:border-brand/50 hover:text-brand transition-all duration-200 text-sm"
              >
                {g.name}
                <span className="ml-1.5 text-white/30 text-xs">{g.movie_count}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── People ────────────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title mb-0">
              <span className="text-brand">👤</span> Notable People
            </h2>
            <Link to="/persons" className="text-brand text-sm hover:text-brand-light transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {persons.map(p => (
              <PersonCard key={p.id} person={p} />
            ))}
          </div>
        </section>
      </div>

      {/* ── Stats Banner ────────────────────────────────────────────────────── */}
      <section className="bg-dark-card border-y border-white/5 py-10 my-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: '🎬', label: 'Movies', value: '20+' },
              { icon: '⭐', label: 'Top Rating', value: '8.6' },
              { icon: '🎭', label: 'Genres', value: genres.length },
              { icon: '👥', label: 'People', value: '18+' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-3xl mb-1">{s.icon}</div>
                <div className="text-2xl font-bold text-brand">{s.value}</div>
                <div className="text-white/50 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
