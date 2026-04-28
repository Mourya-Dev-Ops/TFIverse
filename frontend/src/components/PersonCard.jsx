import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function PersonCard({ person }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link to={`/persons/${person.id}`} className="card group block text-center">
      {/* Photo */}
      <div className="aspect-square overflow-hidden bg-dark-hover">
        {!imgError && person.photo ? (
          <img
            src={person.photo}
            alt={person.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl">👤</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-sm group-hover:text-brand transition-colors">{person.name}</h3>
        {person.role_types && person.role_types.length > 0 && (
          <p className="text-white/40 text-xs mt-0.5 capitalize">{person.role_types[0]}</p>
        )}
        {person.movie_count != null && (
          <p className="text-white/30 text-xs mt-1">{person.movie_count} film{person.movie_count !== 1 ? 's' : ''}</p>
        )}
      </div>
    </Link>
  );
}
