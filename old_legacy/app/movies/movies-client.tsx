'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaStar,
  FaSearch,
  FaClock,
  FaFire,
  FaArrowLeft,
  FaFilm,
} from 'react-icons/fa';
import { getMoviesFromDB } from '@/app/actions/movies';

export default function MoviesClientOld({
  moviesData = [],
  stats = {},
  years = [],
  heroes = [],
}: {
  moviesData: any[];
  stats: any;
  years: number[];
  heroes: any[];
}) {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [allMovies, setAllMovies] = useState<any[]>(
    moviesData.filter((m) => m.movieType === 'upcoming') // ✅ START WITH UPCOMING ONLY
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('year-desc');
  const [activeTab, setActiveTab] = useState<'released' | 'upcoming'>('upcoming');
  const [selectedHero, setSelectedHero] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ Fetch movies when hero or tab changes
  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);

      // ✅ If hero selected: get ALL his movies (all types)
      // ✅ If no hero: get only upcoming by default
      const res = await getMoviesFromDB({
        heroSlug: selectedHero === 'all' ? undefined : selectedHero,
        movieType: selectedHero === 'all' ? activeTab : undefined, // Only filter by type if "All Heroes"
        limit: 500,
      });

      setAllMovies(res.data || []);
      setLoading(false);
    };

    loadMovies();
  }, [selectedHero, activeTab]);

  // ✅ Get available genres/years from FILTERED movies
  const availableGenres = useMemo(() => {
    const genres = new Set<string>();
    allMovies.forEach((m) => {
      if (Array.isArray(m.genre)) {
        m.genre.forEach((g) => genres.add(g));
      }
    });
    return Array.from(genres).sort();
  }, [allMovies]);

  const availableYears = useMemo(() => {
    const yearSet = new Set(allMovies.map((m) => m.year).filter(Boolean));
    return Array.from(yearSet).sort((a, b) => (b || 0) - (a || 0));
  }, [allMovies]);

  // ✅ USE USEMEMO to filter movies (NO SETSTATE in effect!)
  const filteredMovies = useMemo(() => {
    let filtered = [...allMovies];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (movie) =>
          movie.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.director?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Genre filter
    if (selectedGenre !== 'all') {
      filtered = filtered.filter((movie) =>
        Array.isArray(movie.genre) && movie.genre.includes(selectedGenre)
      );
    }

    // Year filter
    if (selectedYear !== 'all') {
      filtered = filtered.filter(
        (movie) => movie.year?.toString() === selectedYear
      );
    }

    // Sort
    switch (sortBy) {
      case 'year-desc':
        filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
      case 'year-asc':
        filtered.sort((a, b) => (a.year || 0) - (b.year || 0));
        break;
      case 'rating-desc':
        filtered.sort((a, b) => (b.imdbRating || 0) - (a.imdbRating || 0));
        break;
      case 'rating-asc':
        filtered.sort((a, b) => (a.imdbRating || 0) - (b.imdbRating || 0));
        break;
      case 'title-asc':
        filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
    }

    return filtered;
  }, [allMovies, searchQuery, selectedGenre, selectedYear, sortBy]);

  // ✅ Get poster with priority: Custom/Backblaze > TMDb ID > Fallback
  const getPosterUrl = (movie: any) => {
    if (movie.poster) {
      if (typeof movie.poster === 'string') {
        if (movie.poster.startsWith('http') || movie.poster.startsWith('/')) {
          return movie.poster;
        }
      }
      if (movie.poster.url) {
        if (
          movie.poster.url.startsWith('http') ||
          movie.poster.url.startsWith('/')
        ) {
          return movie.poster.url;
        }
      }
    }

    if (movie.tmdbId && movie.posterPath) {
      return `https://image.tmdb.org/t/p/w500${movie.posterPath}`;
    }

    return '/images/no-poster.png';
  };

  const releasedCount = moviesData.filter((m) => m.movieType === 'released')
    .length;
  const upcomingCount = moviesData.filter((m) => m.movieType === 'upcoming')
    .length;

  return (
    <main className="bg-black min-h-screen">
      {/* NAVBAR */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-lg'
            : 'bg-black/50 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 min-w-fit">
            <FaArrowLeft className="text-white" size={20} />
            <span className="text-xl md:text-2xl font-black text-white hidden sm:block">
              TFiverse
            </span>
          </Link>

          <div className="flex items-center gap-2 md:gap-6 ml-auto">
            <Link
              href="/heroes"
              className="text-white/70 hover:text-white text-sm transition hidden md:block"
            >
              Heroes
            </Link>
            <span className="text-white/60 font-bold text-sm">🎬 Movies</span>

            {session?.user ? (
              <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                      {session.user.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
              </Link>
            ) : (
              <Link
                href="/auth/signin"
                className="px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-white/90 transition text-sm"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </motion.nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-12 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-black via-black to-black/80">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <FaFilm className="text-3xl text-white" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white">
                Movies
              </h1>
            </div>

            <p className="text-white/60 text-base md:text-lg mb-8">
              {`${releasedCount} released • ${upcomingCount} upcoming`}
            </p>

            {/* ✅ Tab Switcher - ONLY show when "All Heroes" selected */}
            {selectedHero === 'all' && (
              <div className="flex gap-3 md:gap-4 mb-8 flex-wrap">
                <motion.button
                  onClick={() => setActiveTab('released')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold transition-all ${
                    activeTab === 'released'
                      ? 'bg-white text-black shadow-lg'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                  }`}
                >
                  <FaFire size={16} />
                  <span>Released ({releasedCount})</span>
                </motion.button>

                <motion.button
                  onClick={() => setActiveTab('upcoming')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold transition-all ${
                    activeTab === 'upcoming'
                      ? 'bg-white text-black shadow-lg'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                  }`}
                >
                  <FaClock size={16} />
                  <span>Upcoming ({upcomingCount})</span>
                </motion.button>
              </div>
            )}

            {/* Search Bar */}
            <div className="relative max-w-2xl mb-8">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                type="text"
                placeholder="Search movies, directors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 md:py-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 md:gap-4">
              {/* Hero Filter */}
              <select
                value={selectedHero}
                onChange={(e) => {
                  setSelectedHero(e.target.value);
                  setSelectedGenre('all'); // ✅ Reset genre when hero changes
                  setSelectedYear('all'); // ✅ Reset year when hero changes
                }}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30 cursor-pointer transition"
                style={{ colorScheme: 'dark' }}
              >
                <option value="all" className="bg-black">
                  🎭 All Heroes
                </option>
                {heroes.map((hero: any) => (
                  <option key={hero.slug} value={hero.slug} className="bg-black">
                    {hero.name}
                  </option>
                ))}
              </select>

              {/* Genre Filter - ✅ Show ONLY available genres */}
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30 cursor-pointer transition"
                style={{ colorScheme: 'dark' }}
              >
                <option value="all" className="bg-black">
                  🎬 All Genres
                </option>
                {availableGenres.map((genre: string) => (
                  <option key={genre} value={genre} className="bg-black">
                    {genre}
                  </option>
                ))}
              </select>

              {/* Year Filter - ✅ Show ONLY available years */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30 cursor-pointer transition"
                style={{ colorScheme: 'dark' }}
              >
                <option value="all" className="bg-black">
                  📅 All Years
                </option>
                {availableYears.map((year) => (
                  <option key={year} value={year} className="bg-black">
                    {year}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30 cursor-pointer transition"
                style={{ colorScheme: 'dark' }}
              >
                <option value="year-desc" className="bg-black">
                  📊 Newest
                </option>
                <option value="year-asc" className="bg-black">
                  Oldest
                </option>
                <option value="rating-desc" className="bg-black">
                  ⭐ Highest Rated
                </option>
                <option value="rating-asc" className="bg-black">
                  Lowest Rated
                </option>
                <option value="title-asc" className="bg-black">
                  A to Z
                </option>
              </select>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MOVIES GRID */}
      <section className="py-12 px-4 sm:px-6 md:px-12 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/60 mb-8 text-sm"
          >
            {loading ? 'Loading...' : `Showing ${filteredMovies.length} movies`}
          </motion.p>

          {loading ? (
            <div className="flex justify-center items-center h-96">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full"
              />
            </div>
          ) : filteredMovies.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
            >
              <AnimatePresence>
                {filteredMovies.map((movie, i) => (
                  <motion.div
                    key={`${movie.id}-${movie.slug}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: i * 0.02 }}
                    whileHover={{ y: -10 }}
                  >
                    <Link href={`/movies/${movie.slug}`}>
                      <div className="group relative rounded-lg overflow-hidden bg-white/5 border border-white/10 hover:border-white/30 transition cursor-pointer h-full flex flex-col">
                        {/* Poster */}
                        <div className="aspect-[2/3] relative bg-white/10 overflow-hidden flex-1">
                          <motion.img
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            src={getPosterUrl(movie)}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/images/no-poster.png';
                            }}
                          />

                          {/* Badges */}
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                            {movie.year && (
                              <span className="px-2 py-1 bg-white text-black text-xs font-bold rounded">
                                {movie.year}
                              </span>
                            )}

                            {movie.movieType === 'upcoming' && (
                              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/90 backdrop-blur-sm rounded text-black text-xs font-bold">
                                <FaClock size={12} />
                                Coming
                              </div>
                            )}

                            {movie.imdbRating && (
                              <div className="flex items-center gap-1 px-2 py-1 bg-black/80 backdrop-blur-sm rounded">
                                <FaStar className="text-yellow-400" size={12} />
                                <span className="text-white text-xs font-bold">
                                  {movie.imdbRating.toFixed(1)}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Hover Overlay */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"
                          >
                            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                              <p className="text-white/80 text-xs md:text-sm mb-2 line-clamp-2">
                                {movie.title}
                              </p>
                              {movie.director && (
                                <p className="text-white/70 text-xs mb-2 line-clamp-1">
                                  <span className="font-semibold">Dir:</span> {movie.director}
                                </p>
                              )}
                              {movie.role && selectedHero !== 'all' && (
                                <p className="text-blue-400 font-bold text-xs mb-1">
                                  Role: {movie.role}
                                </p>
                              )}
                              {movie.budget && (
                                <p className="text-green-400 font-bold text-xs">
                                  Budget: {movie.budget}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        </div>

                        {/* Info */}
                        <div className="p-3 md:p-4 border-t border-white/10">
                          <h3 className="text-white font-black text-sm md:text-base line-clamp-1 group-hover:text-white/80 transition">
                            {movie.title}
                          </h3>
                          {movie.genre && (
                            <p className="text-white/60 text-xs md:text-sm line-clamp-1">
                              {Array.isArray(movie.genre)
                                ? movie.genre.join(', ')
                                : movie.genre}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <FaFilm size={48} className="mx-auto mb-4 text-white/20" />
              <p className="text-white/60 text-lg mb-6">No movies found</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGenre('all');
                  setSelectedYear('all');
                  setSelectedHero('all');
                  setActiveTab('upcoming');
                }}
                className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-white/90 transition"
              >
                Clear Filters
              </motion.button>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
