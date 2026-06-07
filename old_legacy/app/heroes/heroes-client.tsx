// app/heroes/heroes-client.tsx - v15 OPTIMIZED FOR JSONB

'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaRegHeart, FaSpinner, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { toggleHeroFollow, getMultipleHeroFollows, getMultipleHeroFollowerCounts } from '@/app/actions/heroes';

type HeroData = {
  id: number;
  slug: string;
  data: {
    name: string;
    title?: string;
    images?: {
      banner?: any;
      portrait?: any;
      featured?: any;
    };
    personalInfo?: {
      debutYear?: number;
      birthDate?: string;
      birthPlace?: string;
      nationality?: string;
    };
    filmography?: Array<{
      title: string;
      year?: number;
      role?: string;
    }>;
  };
  createdAt: string;
  updatedAt: string;
};

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const DEFAULT_POSTER = '/images/no-poster.png';

function getImageUrl(imageObj: any): string {
  if (!imageObj) return DEFAULT_POSTER;
  
  if (typeof imageObj === 'string') {
    if (imageObj.startsWith('/') && !imageObj.startsWith('//')) {
      return `${TMDB_IMAGE_BASE}${imageObj}`;
    }
    if (imageObj.startsWith('http')) return imageObj;
    return imageObj;
  }
  
  if (imageObj.source === 'supabase' && imageObj.fallback) {
    return imageObj.fallback;
  }
  
  if (imageObj.url) {
    if (imageObj.url.startsWith('/') && !imageObj.url.startsWith('//')) {
      return `${TMDB_IMAGE_BASE}${imageObj.url}`;
    }
    return imageObj.url;
  }
  
  return imageObj.fallback || DEFAULT_POSTER;
}

export default function HeroesPage({ initialHeroes }: { initialHeroes: HeroData[] }) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [heroesData, setHeroesData] = useState<HeroData[]>(initialHeroes || []);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const [q, setQ] = useState('');
  const [since, setSince] = useState<string>('All');

  const [heroFollowers, setHeroFollowers] = useState<Record<string, number>>({});
  const [followedHeroes, setFollowedHeroes] = useState<Set<string>>(new Set());
  const [followLoading, setFollowLoading] = useState<Record<string, boolean>>({});

  // ✅ Load follower counts and follow status
  useEffect(() => {
    if (heroesData.length === 0) return;

    const loadData = async () => {
      const heroSlugs = heroesData.map(h => h.slug);
      const counts = await getMultipleHeroFollowerCounts(heroSlugs);
      setHeroFollowers(counts);

      if (session?.user?.id) {
        const follows = await getMultipleHeroFollows(heroSlugs);
        setFollowedHeroes(new Set(Object.keys(follows).filter(slug => follows[slug])));
      }
    };

    loadData();
  }, [heroesData, session?.user?.id]);

  // ✅ Follow/unfollow handler
  const toggleFollow = async (heroSlug: string, heroName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      router.push('/signin?redirect=/heroes');
      return;
    }

    setFollowLoading(prev => ({ ...prev, [heroSlug]: true }));

    try {
      const result = await toggleHeroFollow(heroSlug, heroName);

      if (result.following) {
        setFollowedHeroes(prev => new Set(prev).add(heroSlug));
        setHeroFollowers(prev => ({ ...prev, [heroSlug]: (prev[heroSlug] || 0) + 1 }));
      } else {
        setFollowedHeroes(prev => {
          const next = new Set(prev);
          next.delete(heroSlug);
          return next;
        });
        setHeroFollowers(prev => ({ ...prev, [heroSlug]: Math.max(0, (prev[heroSlug] || 0) - 1) }));
      }
    } catch (error) {
      console.error('❌ Follow error:', error);
    } finally {
      setFollowLoading(prev => ({ ...prev, [heroSlug]: false }));
    }
  };

  // ✅ Auto-rotate spotlight
  useEffect(() => {
    if (!autoplay || heroesData.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((p) => (p + 1) % Math.max(heroesData.length, 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [autoplay, heroesData]);

  // ✅ Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setCurrentIndex((p) => (p + 1) % Math.max(heroesData.length, 1));
        setAutoplay(false);
      }
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((p) => (p - 1 + Math.max(heroesData.length, 1)) % Math.max(heroesData.length, 1));
        setAutoplay(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [heroesData]);

  // ✅ Filters (from JSONB data)
  const years = useMemo(() => {
    const set = new Set<number>();
    heroesData.forEach(h => {
      const year = h.data?.personalInfo?.debutYear;
      if (year) set.add(Number(year));
    });
    const arr = Array.from(set).sort((a, b) => a - b);
    return ['All', ...arr.map(String)];
  }, [heroesData]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return heroesData
      .filter(h => {
        const name = h.data?.name || '';
        const title = h.data?.title || '';
        return !term || 
               name.toLowerCase().includes(term) || 
               title.toLowerCase().includes(term);
      })
      .filter(h => {
        return since === 'All' || String(h.data?.personalInfo?.debutYear || '') === since;
      });
  }, [q, since, heroesData]);

  // ✅ Loading skeleton
  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="h-80 bg-gradient-to-b from-white/5 to-black animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-white/5 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentHero = heroesData[currentIndex];
  const currentInfo = currentHero?.data;

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* SPOTLIGHT SECTION */}
      {heroesData.length > 0 && currentInfo && (
        <section className="relative h-screen max-h-[800px] md:max-h-[900px] overflow-hidden">
          {/* Background image with gradient overlay */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <img
                src={getImageUrl(currentInfo?.images?.banner || currentInfo?.images?.featured || currentInfo?.images?.portrait)}
                alt={currentInfo?.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_POSTER;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Hero Info */}
          <div className="absolute inset-0 flex items-end z-10">
            <div className="w-full px-4 sm:px-6 md:px-8 pb-12 md:pb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-3xl"
              >
                {currentInfo.title && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white font-bold text-xs md:text-sm mb-4 border border-white/30"
                  >
                    👑 {currentInfo.title}
                  </motion.span>
                )}

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight drop-shadow-lg">
                  {currentInfo.name}
                </h1>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 text-white/90 mb-6 text-sm md:text-base">
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex items-center gap-2">
                    🎬 {(currentInfo.filmography?.length || 0)} Films
                  </motion.span>
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center gap-2">
                    👥 {(heroFollowers[currentHero.slug] || 0).toLocaleString()} Followers
                  </motion.span>
                  {currentInfo.personalInfo?.debutYear && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex items-center gap-2">
                      📅 Since {currentInfo.personalInfo?.debutYear}
                    </motion.span>
                  )}
                </div>

                {/* Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap gap-3"
                >
                  <Link
                    href={`/hero/${currentHero.slug}`}
                    className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white text-black font-bold rounded-lg hover:bg-white/90 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    View Full Profile
                    <FaChevronRight size={16} />
                  </Link>

                  <button
                    onClick={(e) => toggleFollow(currentHero.slug, currentInfo.name, e)}
                    disabled={followLoading[currentHero.slug]}
                    className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold rounded-lg hover:bg-white/30 shadow-lg transition-all disabled:opacity-50"
                  >
                    {followLoading[currentHero.slug] ? (
                      <>
                        <FaSpinner className="animate-spin" size={18} />
                        Loading...
                      </>
                    ) : followedHeroes.has(currentHero.slug) ? (
                      <>
                        <FaHeart className="text-red-400" size={18} />
                        Following
                      </>
                    ) : (
                      <>
                        <FaRegHeart size={18} />
                        Follow
                      </>
                    )}
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="absolute inset-x-0 bottom-6 z-20 flex items-center justify-center gap-4">
            <motion.button
              onClick={() => {
                setCurrentIndex((p) => (p - 1 + Math.max(heroesData.length, 1)) % Math.max(heroesData.length, 1));
                setAutoplay(false);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white flex items-center justify-center transition border border-white/30"
              aria-label="Previous hero"
            >
              <FaChevronLeft size={20} />
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-white text-sm font-bold border border-white/20"
            >
              {currentIndex + 1} / {heroesData.length}
            </motion.div>

            <motion.button
              onClick={() => {
                setCurrentIndex((p) => (p + 1) % Math.max(heroesData.length, 1));
                setAutoplay(false);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white flex items-center justify-center transition border border-white/30"
              aria-label="Next hero"
            >
              <FaChevronRight size={20} />
            </motion.button>
          </div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute right-6 bottom-8 z-20 text-white/60"
          >
            ↓
          </motion.div>
        </section>
      )}

      {/* ALL HEROES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-black text-white mb-4 flex items-center gap-2">
            👥 Explore All Heroes
          </h2>

          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="🔍 Search heroes..."
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition text-sm md:text-base"
              />
            </div>

            {/* Year filter */}
            <select
              value={since}
              onChange={(e) => setSince(e.target.value)}
              className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white text-sm md:text-base outline-none focus:ring-2 focus:ring-white/40 transition"
              style={{ colorScheme: 'dark' }}
            >
              {years.map(y => (
                <option key={y} value={y} style={{ backgroundColor: '#0a0a0a', color: '#fff' }}>
                  {y === 'All' ? '📅 All Years' : `📅 Since ${y}`}
                </option>
              ))}
            </select>

            {/* Clear button */}
            <button
              onClick={() => {
                setQ('');
                setSince('All');
              }}
              className="px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold transition text-sm md:text-base"
            >
              ✕ Clear
            </button>

            {/* Results count */}
            <div className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm md:text-base font-semibold whitespace-nowrap">
              {filtered.length} {filtered.length === 1 ? 'Hero' : 'Heroes'}
            </div>
          </div>
        </motion.div>

        {/* Heroes Grid - FULLY RESPONSIVE */}
        {filtered.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5"
          >
            {filtered.map((hero, idx) => {
              const img = getImageUrl(hero.data?.images?.portrait || hero.data?.images?.featured || hero.data?.images?.banner);
              const isFollowing = followedHeroes.has(hero.slug);
              const isLoading = followLoading[hero.slug];

              return (
                <motion.div
                  key={hero.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.05, y: -8 }}
                  className="group"
                >
                  <Link href={`/hero/${hero.slug}`} className="block relative rounded-xl overflow-hidden">
                    {/* Image Container */}
                    <div className="aspect-[2/3] bg-gradient-to-b from-white/5 to-black/20 rounded-xl overflow-hidden border border-white/10 group-hover:border-white/30 transition">
                      <img
                        src={img}
                        alt={hero.data?.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = DEFAULT_POSTER;
                        }}
                        loading="lazy"
                      />

                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      {/* Hero info on image */}
                      <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-4">
                        <h3 className="text-sm md:text-base font-bold text-white mb-1 line-clamp-1">
                          {hero.data?.name}
                        </h3>
                        {hero.data?.title && (
                          <p className="text-xs text-white/70 line-clamp-1 mb-2">
                            {hero.data.title}
                          </p>
                        )}
                        <p className="text-xs text-white/60 flex items-center gap-1">
                          🎬 {(hero.data?.filmography?.length || 0)} films
                        </p>
                      </div>

                      {/* Follow button - appears on hover */}
                      <motion.button
                        onClick={(e) => toggleFollow(hero.slug, hero.data?.name || '', e)}
                        disabled={isLoading}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute top-3 right-3 p-2.5 md:p-3 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 text-white transition opacity-0 group-hover:opacity-100 border border-white/20 hover:border-white/40"
                      >
                        {isLoading ? (
                          <FaSpinner className="animate-spin" size={16} />
                        ) : isFollowing ? (
                          <FaHeart className="text-red-400" size={16} />
                        ) : (
                          <FaRegHeart size={16} />
                        )}
                      </motion.button>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-white/50 text-lg mb-3">❌ No heroes found</p>
            <p className="text-white/40 text-sm mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setQ('');
                setSince('All');
              }}
              className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-white/90 transition"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}
      </section>
    </main>
  );
}
