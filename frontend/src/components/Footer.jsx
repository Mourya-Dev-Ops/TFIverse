import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark/80 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🎬</span>
              <span className="text-lg font-bold">
                <span className="text-brand">TFI</span>verse
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              The ultimate Telugu Film Industry database. Explore movies, actors, directors, and the rich legacy of Tollywood.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold mb-3 text-white/80">Explore</h3>
            <ul className="space-y-2 text-sm text-white/50">
              <li><Link to="/movies" className="hover:text-brand transition-colors">All Movies</Link></li>
              <li><Link to="/movies?genre=Action" className="hover:text-brand transition-colors">Action</Link></li>
              <li><Link to="/movies?genre=Drama" className="hover:text-brand transition-colors">Drama</Link></li>
              <li><Link to="/movies?genre=Romance" className="hover:text-brand transition-colors">Romance</Link></li>
              <li><Link to="/persons" className="hover:text-brand transition-colors">People</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold mb-3 text-white/80">About</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              TFIverse celebrates the Telugu Film Industry — its stars, directors, stories, and cultural impact. Data covers movies from 2004 to present.
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-6 text-center text-white/30 text-xs">
          © {new Date().getFullYear()} TFIverse · Telugu Film Industry Database Platform
        </div>
      </div>
    </footer>
  );
}
