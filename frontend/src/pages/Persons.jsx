import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchJSON } from '../api';
import PersonCard from '../components/PersonCard';
import Spinner from '../components/Spinner';
import Pagination from '../components/Pagination';

const ROLE_TYPES = ['actor', 'actress', 'director', 'producer', 'music', 'writer'];

export default function Persons() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState({ persons: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  const q = searchParams.get('q') || '';
  const role = searchParams.get('role') || '';
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
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (role) params.set('role', role);
    params.set('page', page);
    params.set('limit', 12);

    fetchJSON(`/persons?${params}`)
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [q, role, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">
          <span className="text-brand">Telugu</span> Film People
        </h1>
        <p className="text-white/50">
          {data.total} person{data.total !== 1 ? 's' : ''} in the database
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8 p-4 bg-dark-card rounded-xl border border-white/5">
        <input
          className="input flex-1 min-w-48 text-sm"
          type="search"
          placeholder="Search by name…"
          value={q}
          onChange={e => updateParams({ q: e.target.value })}
        />
        <select
          className="input text-sm"
          value={role}
          onChange={e => updateParams({ role: e.target.value })}
        >
          <option value="">All Roles</option>
          {ROLE_TYPES.map(r => (
            <option key={r} value={r} className="capitalize">{r.charAt(0).toUpperCase() + r.slice(1)}</option>
          ))}
        </select>
        {(q || role) && (
          <button
            className="px-4 py-2 text-sm rounded-lg border border-white/10 hover:border-white/30 transition-colors"
            onClick={() => setSearchParams({})}
          >
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <Spinner />
      ) : data.persons.length === 0 ? (
        <div className="text-center py-16 text-white/50">
          <span className="text-4xl block mb-3">👤</span>
          No people found.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {data.persons.map(p => <PersonCard key={p.id} person={p} />)}
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
