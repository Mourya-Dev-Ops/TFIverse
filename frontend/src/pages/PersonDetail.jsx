import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchJSON } from '../api';
import Spinner from '../components/Spinner';

export default function PersonDetail() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchJSON(`/persons/${id}`)
      .then(setPerson)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!person) return (
    <div className="text-center py-20">
      <span className="text-5xl block mb-4">👤</span>
      <p className="text-white/50">Person not found.</p>
      <Link to="/persons" className="btn-brand mt-4 inline-block">Back to People</Link>
    </div>
  );

  const age = person.born
    ? Math.floor((Date.now() - new Date(person.born)) / (365.25 * 24 * 3600 * 1000))
    : null;

  // Merge filmography + directed movies (deduplicate by id)
  const allMovies = [...(person.filmography || [])];
  (person.directedMovies || []).forEach(dm => {
    if (!allMovies.some(f => f.id === dm.id)) {
      allMovies.push({ ...dm, role: 'Director', role_type: 'director' });
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <Link to="/persons" className="text-white/50 hover:text-white text-sm transition-colors mb-8 inline-block">
        ← People
      </Link>

      {/* ── Profile ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Photo */}
        <div className="flex-shrink-0 w-40 md:w-56">
          <div className="rounded-xl overflow-hidden bg-dark-card shadow-2xl aspect-square">
            {!imgError && person.photo ? (
              <img
                src={person.photo}
                alt={person.name}
                className="w-full h-full object-cover object-top"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">👤</div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{person.name}</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {person.born && (
              <div className="bg-dark-card rounded-lg p-3">
                <p className="text-white/40 text-xs mb-0.5">Born</p>
                <p className="font-medium">
                  {new Date(person.born).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  {age && <span className="text-white/50 text-sm ml-2">({age} years old)</span>}
                </p>
              </div>
            )}
            {person.birth_place && (
              <div className="bg-dark-card rounded-lg p-3">
                <p className="text-white/40 text-xs mb-0.5">Birth Place</p>
                <p className="font-medium">{person.birth_place}</p>
              </div>
            )}
            <div className="bg-dark-card rounded-lg p-3">
              <p className="text-white/40 text-xs mb-0.5">Films</p>
              <p className="font-medium text-brand">{allMovies.length}</p>
            </div>
          </div>

          {person.bio && (
            <div>
              <h2 className="font-semibold text-white/80 mb-2">Biography</h2>
              <p className="text-white/70 leading-relaxed">{person.bio}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Filmography ───────────────────────────────────────────────────── */}
      {allMovies.length > 0 && (
        <section>
          <h2 className="section-title">
            <span className="text-brand">🎬</span> Filmography
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {allMovies.map(m => (
              <Link key={`${m.id}-${m.role_type}`} to={`/movies/${m.id}`} className="card group block">
                <div className="aspect-[2/3] overflow-hidden bg-dark-hover relative">
                  {m.poster ? (
                    <img
                      src={m.poster}
                      alt={m.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={e => { e.target.style.display = 'none'; }}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🎬</div>
                  )}
                  {m.imdb_rating && (
                    <div className="absolute top-2 right-2 bg-black/80 rounded px-1.5 py-0.5 flex items-center gap-1">
                      <span className="text-brand text-xs">★</span>
                      <span className="text-xs font-semibold">{m.imdb_rating}</span>
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="font-semibold text-xs group-hover:text-brand transition-colors">{m.title}</p>
                  <p className="text-white/40 text-xs">{m.release_year}</p>
                  {m.role && <p className="text-white/30 text-xs mt-0.5 truncate">{m.role}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
