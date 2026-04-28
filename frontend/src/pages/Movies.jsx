import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchJSON } from '../api';
import MovieCard from '../components/MovieCard';
import Spinner from '../components/Spinner';
import Pagination from '../components/Pagination';

export default function Movies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState({ movies: [], total: 0, pages: 1 });
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  const q = searchParams.get('q') || '';
  const genre = searchParams.get('genre') || '';
  const year = searchParams.get('year') || '';
  const page = Number(searchParams.get('page') || 1);

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v) next.set(k, v);
      else next.delete(k);
    });
    if ('page' in updates === false) next.delete('page');
    setSearchParams(next);
  };

  useEffect(() => {
    fetchJSON('/genres').then(setGenres).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (genre) params.set('genre', genre);
    if (year) params.set('year', year);
    params.set('page', page);
    params.set('limit', 12);

    fetchJSON(`/movies?${params}`)
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [q, genre, year, page]);

  // Year options (2000 – current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">
          <span className="text-brand">Telugu</span> Movies
        </h1>
        <p className="text-white/50">
          {data.total} movie{data.total !== 1 ? 's' : ''} in the database
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8 p-4 bg-dark-card rounded-xl border border-white/5">
        {/* Search */}
        <input
          className="input flex-1 min-w-48 text-sm"
          type="search"
          placeholder="Search by title…"
          value={q}
          onChange={e => updateParams({ q: e.target.value })}
        />

        {/* Genre */}
        <select
          className="input text-sm"
          value={genre}
          onChange={e => updateParams({ genre: e.target.value })}
        >
          <option value="">All Genres</option>
          {genres.map(g => (
            <option key={g.id} value={g.name}>{g.name} ({g.movie_count})</option>
          ))}
        </select>

        {/* Year */}
        <select
          className="input text-sm"
          value={year}
          onChange={e => updateParams({ year: e.target.value })}
        >
          <option value="">All Years</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>

        {/* Clear */}
        {(q || genre || year) && (
          <button
            className="px-4 py-2 text-sm rounded-lg border border-white/10 hover:border-white/30 transition-colors"
            onClick={() => setSearchParams({})}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <Spinner />
      ) : data.movies.length === 0 ? (
        <div className="text-center py-16 text-white/50">
          <span className="text-4xl block mb-3">🎬</span>
          No movies found. Try adjusting the filters.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {data.movies.map(m => <MovieCard key={m.id} movie={m} />)}
          </div>
          <Pagination
            page={page}
            pages={data.pages}
            onPage={p => updateParams({ page: p })}
          />
        </>
      )}
    </div>
  );
}
