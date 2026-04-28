import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/movies?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setMenuOpen(false);
    }
  };

  const navClass = ({ isActive }) =>
    isActive
      ? 'text-brand font-semibold'
      : 'text-white/70 hover:text-white transition-colors';

  return (
    <header className="sticky top-0 z-50 bg-dark/95 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl">🎬</span>
            <span className="text-xl font-bold">
              <span className="text-brand">TFI</span>verse
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/" className={navClass} end>Home</NavLink>
            <NavLink to="/movies" className={navClass}>Movies</NavLink>
            <NavLink to="/persons" className={navClass}>People</NavLink>
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
            <input
              className="input w-56 text-sm"
              type="search"
              placeholder="Search movies…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className="btn-brand text-sm py-2">Search</button>
          </form>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white/70 hover:text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                className="input flex-1 text-sm"
                type="search"
                placeholder="Search movies…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button type="submit" className="btn-brand text-sm">Go</button>
            </form>
            <nav className="flex flex-col gap-2">
              <NavLink to="/" className={navClass} end onClick={() => setMenuOpen(false)}>Home</NavLink>
              <NavLink to="/movies" className={navClass} onClick={() => setMenuOpen(false)}>Movies</NavLink>
              <NavLink to="/persons" className={navClass} onClick={() => setMenuOpen(false)}>People</NavLink>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
