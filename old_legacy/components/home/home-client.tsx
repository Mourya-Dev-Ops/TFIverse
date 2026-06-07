'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, FaChevronRight, FaChevronLeft, FaGlobe,
  FaMoneyBillWave, FaHistory, FaFilm, FaTrophy, 
  FaCalendarAlt, FaPlay, FaStar, FaHeart, 
  FaExclamationTriangle, FaLaugh, FaImages,
  FaBirthdayCake, FaTv, FaEnvelope
} from 'react-icons/fa';

type Hero = { id: number; slug: string; name: string; title?: string; birthDate?: string; movies?: any[]; followers?: number; featured?: boolean; portraitUrl?: string; bannerUrl?: string; featuredUrl?: string; };
type Rumor = { id: string; title: string; summary: string; status: 'discussion' | 'trade' | 'confirmed'; source: string; };
type Upcoming = { slug: string; title: string; status: 'pre' | 'filming' | 'post'; date?: string; director?: string; poster?: string; };
type NewsItem = { id: string; type: 'trailer' | 'teaser' | 'announcement' | 'poster'; title: string; description: string; thumbnail: string; videoUrl?: string; hero?: string; movie?: string; date: string; source: string; };
type OTTRelease = { id: string; title: string; platform: 'Netflix' | 'Prime' | 'Hotstar' | 'Aha'; poster: string; releaseDate: string; slug: string; };
type HomeClientProps = { heroesData: Hero[]; rumorsData: Rumor[]; upcomingData: Upcoming[]; isAuthenticated: boolean; userId?: string; };

const DEFAULT_POSTER = '/images/no-poster.png';

export default function HomeClient({ heroesData, rumorsData, upcomingData, isAuthenticated, userId }: HomeClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const parallaxElements = document.querySelectorAll('.parallax-slow');
      parallaxElements.forEach((el) => { (el as HTMLElement).style.transform = `translate3d(0, ${scrolled * 0.3}px, 0)`; });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setTimeout(() => setLoading(false), 500); }, []);

  const birthdayHeroes = useMemo(() => {
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDate = today.getDate();
    return heroesData.filter(h => { if (!h.birthDate) return false; const [year, month, date] = h.birthDate.split('-').map(Number); return month === todayMonth && date === todayDate; });
  }, [heroesData]);

  const ottReleases: OTTRelease[] = [
    { id: '1', title: 'Salaar', platform: 'Netflix', poster: '/images/salaar.jpg', releaseDate: '2025-10-15', slug: 'salaar' },
    { id: '2', title: 'Hi Nanna', platform: 'Netflix', poster: '/images/hi-nanna.jpg', releaseDate: '2025-10-20', slug: 'hi-nanna' },
    { id: '3', title: 'Extra Ordinary Man', platform: 'Prime', poster: '/images/eom.jpg', releaseDate: '2025-10-22', slug: 'extra-ordinary-man' },
    { id: '4', title: 'Tiger Nageswara Rao', platform: 'Hotstar', poster: '/images/tnr.jpg', releaseDate: '2025-10-18', slug: 'tiger-nageswara-rao' },
  ];

  const newsData: NewsItem[] = [
    { id: '1', type: 'trailer', title: 'Salaar Part 2 - Official Trailer', description: 'The much-awaited sequel trailer is here!', thumbnail: '/images/news/salaar-2.jpg', videoUrl: 'https://youtube.com/watch?v=xxx', hero: 'Prabhas', movie: 'Salaar Part 2', date: '2025-10-20', source: 'YouTube' },
    { id: '2', type: 'teaser', title: 'Game Changer Teaser', description: 'Ram Charan\'s next big release', thumbnail: '/images/news/game-changer.jpg', hero: 'Ram Charan', movie: 'Game Changer', date: '2025-10-22', source: 'Twitter' },
    { id: '3', type: 'announcement', title: 'NTR 31 Announcement', description: 'Koratala Siva to direct Jr NTR', thumbnail: '/images/news/ntr-31.jpg', hero: 'Jr NTR', date: '2025-10-18', source: 'Official' }
  ];

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const term = searchQuery.toLowerCase();
    const heroes = heroesData.filter((h) => h.name.toLowerCase().includes(term)).slice(0, 5).map((h) => ({ type: 'Hero', title: h.name, subtitle: h.title || '', href: `/hero/${h.slug}` }));
    const movies: any[] = [];
    heroesData.forEach(h => (h.movies || []).forEach(m => movies.push({ ...m, hero: h.name })));
    const moviesRes = movies.filter(m => m.title?.toLowerCase().includes(term)).slice(0, 5).map(m => ({ type: 'Movie', title: m.title, subtitle: `${m.year} • ${m.hero}`, href: `/movie/${m.slug}` }));
    return [...heroes, ...moviesRes];
  }, [searchQuery, heroesData]);

  if (loading) return <LoadingState />;

  return (<>
    {/* Search Section - CINEMA SILVER */}
    <section className="px-6 md:px-12 -mt-10 relative z-20 mb-16">
      <div className="max-w-3xl mx-auto">
        <div className="relative group">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 z-10" />
          <input 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder="Search heroes, movies, awards..." 
            className="w-full pl-14 pr-6 py-4 rounded-xl bg-zinc-900/50 backdrop-blur-xl border border-white/[0.06] text-white placeholder-white/20 outline-none focus:border-white/[0.3] focus:bg-zinc-900/80 transition-all shadow-xl hover:border-white/[0.12]" 
          />
        </div>
        <AnimatePresence>
          {searchResults.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 10 }} 
              className="mt-3 rounded-xl bg-zinc-900/98 backdrop-blur-xl border border-white/[0.06] overflow-hidden shadow-2xl"
            >
              {searchResults.map((r, i) => (
                <Link 
                  key={i} 
                  href={r.href} 
                  className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.03] transition border-b border-white/[0.04] last:border-0"
                >
                  <div className="flex-1">
                    <div className="text-white font-semibold">{r.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-1 rounded-full bg-white/[0.05] text-white border border-white/[0.1] font-semibold">{r.type}</span>
                      {r.subtitle && <span className="text-sm text-white/30">{r.subtitle}</span>}
                    </div>
                  </div>
                  <FaChevronRight className="text-white/15" />
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>

    {/* Birthday Section */}
    {birthdayHeroes.length > 0 && (
      <motion.section 
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }} 
        transition={{ duration: 0.6 }}
        className="px-6 md:px-12 mb-16"
      >
        <div className="max-w-7xl mx-auto">
          <BirthdaySpotlight heroes={birthdayHeroes} />
        </div>
      </motion.section>
    )}

    {/* Primary Boxes */}
    <motion.section 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="px-6 md:px-12 mb-16"
    >
      <div className="max-width mx-auto grid md:grid-cols-4 gap-4">
        <PrimaryBox href="/universe" icon={FaGlobe} title="TFI Universe" color="blue" />
        <PrimaryBox href="/box-office" icon={FaMoneyBillWave} title="Box Office" color="green" />
        <PrimaryBox href="/re-releases" icon={FaHistory} title="Re-releases" color="purple" />
        <PrimaryBox href="/movies" icon={FaFilm} title="Browse Movies" color="red" />
      </div>
    </motion.section>

    {/* Featured Hero - CINEMA SILVER */}
    <motion.section 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="px-6 md:px-12 mb-16"
    >
      <div className="max-w-7xl mx-auto">
        <FeaturedHeroCompact heroesData={heroesData} />
      </div>
    </motion.section>

    {/* Quick Actions */}
    <motion.section 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="px-6 md:px-12 mb-16"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-4">
        <QuickActionBox href="/tier-list/create" icon={FaTrophy} title="Create Tier List" color="yellow" />
        <QuickActionBox href="/calendar/2025" icon={FaCalendarAlt} title="Rate 2025 Movies" color="blue" />
      </div>
    </motion.section>

    {/* Latest Updates */}
    <motion.section 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="px-6 md:px-12 mb-16"
    >
      <div className="max-w-7xl mx-auto">
        <LatestUpdates items={newsData} />
      </div>
    </motion.section>

    {/* OTT Releases */}
    <motion.section 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="px-6 md:px-12 mb-16"
    >
      <div className="max-w-7xl mx-auto">
        <OTTReleases items={ottReleases} />
      </div>
    </motion.section>

    {/* Rumors & Upcoming */}
    <motion.section 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="px-6 md:px-12 mb-16"
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6">
        <RumorsScrollable items={rumorsData} />
        <UpcomingNetflixImproved items={upcomingData} />
      </div>
    </motion.section>

    {/* Galleries */}
    <motion.section 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="px-6 md:px-12 mb-16"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
        <MemesGallery />
        <FanGallery />
      </div>
    </motion.section>

    {/* Fan Zone */}
    <motion.section 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="px-6 md:px-12 mb-16"
    >
      <div className="max-w-7xl mx-auto">
        <FanZoneCompact />
      </div>
    </motion.section>

    {/* Movie Diary */}
    {isAuthenticated && (
      <motion.section 
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-6 md:px-12 mb-16"
      >
        <div className="max-w-7xl mx-auto">
          <MovieDiaryCompact userId={userId} />
        </div>
      </motion.section>
    )}

    {/* Corrections */}
    <motion.section 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="px-6 md:px-12 mb-20"
    >
      <div className="max-w-5xl mx-auto">
        <CorrectionsCompact />
      </div>
    </motion.section>
  </>);
}

function LoadingState() { 
  return (
    <div className="px-6 md:px-12 py-20">
      <div className="max-w-7xl mx-auto space-y-16">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-8 bg-white/5 rounded w-48 mb-6" />
            <div className="grid md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-40 bg-white/5 rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  ); 
}

/* ═══════════════════════════════════════════════════════════ */
/* CINEMA SILVER - HERO CARD COMPONENTS */
/* ═══════════════════════════════════════════════════════════ */

function BirthdaySpotlight({ heroes }: { heroes: Hero[] }) { 
  const hero = heroes[0]; 
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="rounded-xl overflow-hidden border border-white/[0.06] shadow-xl hover:shadow-2xl transition-shadow"
    >
      <div className="grid md:grid-cols-[200px_1fr] gap-0 bg-zinc-900/30">
        <div className="relative h-[280px] md:h-auto overflow-hidden">
          <motion.img 
            src={hero.portraitUrl || DEFAULT_POSTER} 
            alt={hero.name} 
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            onError={(e) => ((e.target as HTMLImageElement).src = DEFAULT_POSTER)} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
        </div>
        <div className="p-8 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <FaBirthdayCake className="text-3xl text-white/60" />
            <span className="text-white/50 font-bold text-xs uppercase tracking-widest">Birthday Today</span>
          </div>
          <h2 className="text-4xl font-black text-white mb-3 leading-tight">Happy Birthday,<br />{hero.name}! 🎉</h2>
          <p className="text-white/40 text-base mb-6 font-light">{hero.title || 'Legend'}</p>
          <Link href={`/hero/${hero.slug}`} className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-black font-bold rounded-lg hover:bg-white/90 transition w-fit shadow-lg">
            View Profile <FaChevronRight />
          </Link>
        </div>
      </div>
    </motion.div>
  ); 
}

function PrimaryBox({ href, icon: Icon, title, color }: any) { 
  const colors = { 
    blue: 'bg-white/5 hover:bg-white/10', 
    green: 'bg-white/5 hover:bg-white/10', 
    purple: 'bg-white/5 hover:bg-white/10', 
    red: 'bg-white/5 hover:bg-white/10', 
    yellow: 'bg-white/5 hover:bg-white/10' 
  }; 
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={href} className="group relative rounded-xl p-6 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 overflow-hidden block bg-zinc-900/30 hover:bg-zinc-900/50">
        <div className="relative z-10">
          <div className="w-12 h-12 rounded-lg bg-white/10 group-hover:bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <Icon className="text-2xl text-white" />
          </div>
          <h3 className="text-white text-lg font-bold mb-1">{title}</h3>
          <div className="flex items-center gap-1 text-white/40 text-sm group-hover:text-white/60 transition">
            <span>Explore</span>
            <FaChevronRight className="text-xs" />
          </div>
        </div>
      </Link>
    </motion.div>
  ); 
}

function FeaturedHeroCompact({ heroesData }: { heroesData: Hero[] }) { 
  const featuredHero = heroesData.find((h: any) => h.featured); 
  if (!featuredHero) return null; 
  const poster = featuredHero.featuredUrl || featuredHero.bannerUrl || featuredHero.portraitUrl || DEFAULT_POSTER; 
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-xl overflow-hidden border border-white/[0.06] shadow-xl hover:shadow-2xl transition-shadow bg-zinc-900/30"
    >
      <div className="grid md:grid-cols-[200px_1fr]">
        <div className="relative h-[280px] md:h-auto overflow-hidden group">
          <motion.img 
            src={poster} 
            alt={featuredHero.name} 
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.5 }}
            onError={(e) => ((e.target as HTMLImageElement).src = DEFAULT_POSTER)} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>
        <div className="p-8 flex flex-col justify-center">
          <div className="text-white/60 text-xs font-bold mb-2 uppercase tracking-widest">Featured Hero</div>
          <h2 className="text-4xl font-black text-white mb-3 leading-tight">{featuredHero.name}</h2>
          <p className="text-white/40 text-base mb-6 font-light">{featuredHero.title || 'Telugu Cinema Legend'}</p>
          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link href={`/hero/${featuredHero.slug}`} className="px-6 py-2.5 bg-white text-black text-sm font-bold rounded-lg hover:bg-white/90 transition inline-block">
                View Profile
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link href={`/hero/${featuredHero.slug}#filmography`} className="px-6 py-2.5 border border-white/[0.12] text-white hover:bg-white/[0.05] text-sm rounded-lg transition inline-block">
                Filmography
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  ); 
}

function QuickActionBox({ href, icon: Icon, title, color }: any) { 
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={href} className="group rounded-xl p-6 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 bg-zinc-900/30 hover:bg-zinc-900/50 block">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white/10 group-hover:bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg flex-shrink-0">
            <Icon className="text-2xl text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white text-xl font-bold mb-1">{title}</h3>
            <div className="flex items-center gap-1 text-white/40 text-sm group-hover:text-white/60 transition">
              <span>Start now</span>
              <FaChevronRight className="text-xs" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  ); 
}

/* Rest of the components remain the same but with updated colors and animations */
function LatestUpdates({ items }: { items: NewsItem[] }) { 
  const getTypeBadge = (type: string) => { 
    const badges = { 
      trailer: 'bg-white/5 text-white/60 border-white/10', 
      teaser: 'bg-white/5 text-white/60 border-white/10', 
      announcement: 'bg-white/5 text-white/60 border-white/10', 
      poster: 'bg-white/5 text-white/60 border-white/10' 
    }; 
    return badges[type as keyof typeof badges] || 'bg-white/5 text-white/60 border-white/10'; 
  }; 
  return (
    <div>
      <h2 className="text-2xl font-black text-white mb-6">Latest Updates</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="group rounded-xl overflow-hidden border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 bg-zinc-900/30 hover:bg-zinc-900/50"
          >
            <div className="relative h-40 overflow-hidden hero-card">
              <motion.img 
                src={item.thumbnail || DEFAULT_POSTER} 
                alt={item.title} 
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.4 }}
                onError={(e) => ((e.target as HTMLImageElement).src = DEFAULT_POSTER)} 
              />
              {item.videoUrl && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.div 
                    className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.1 }}
                  >
                    <FaPlay className="text-black ml-1" />
                  </motion.div>
                </div>
              )}
              <div className={`absolute top-2 left-2 px-2 py-1 rounded-full border backdrop-blur-xl text-xs font-bold uppercase ${getTypeBadge(item.type)}`}>
                {item.type}
              </div>
            </div>
            <div className="p-4">
              {item.hero && <div className="text-xs text-white/50 font-bold mb-2">{item.hero}</div>}
              <h3 className="text-white font-bold text-sm mb-2 line-clamp-2 group-hover:text-white/80 transition">{item.title}</h3>
              <p className="text-white/40 text-xs line-clamp-2">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  ); 
}

function OTTReleases({ items }: { items: OTTRelease[] }) { 
  const scrollRef = useRef<HTMLDivElement>(null); 
  const scroll = (direction: 'left' | 'right') => { 
    if (scrollRef.current) { 
      scrollRef.current.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' }); 
    } 
  }; 
  const getPlatformColor = (platform: string) => { 
    const colors = { 
      Netflix: 'text-white/60', 
      Prime: 'text-white/60', 
      Hotstar: 'text-white/60', 
      Aha: 'text-white/60' 
    }; 
    return colors[platform as keyof typeof colors] || 'text-white/60'; 
  }; 
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shadow-lg">
            <FaTv className="text-xl text-white" />
          </div>
          <h2 className="text-2xl font-black text-white">New on OTT</h2>
        </div>
        <div className="flex gap-2">
          <motion.button onClick={() => scroll('left')} whileHover={{ scale: 1.1 }} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
            <FaChevronLeft className="text-white text-sm" />
          </motion.button>
          <motion.button onClick={() => scroll('right')} whileHover={{ scale: 1.1 }} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
            <FaChevronRight className="text-white text-sm" />
          </motion.button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {items.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0 w-[160px]"
          >
            <Link href={`/movie/${item.slug}`}>
              <div className="relative rounded-lg overflow-hidden mb-3 shadow-lg gallery-item">
                <motion.img 
                  src={item.poster || DEFAULT_POSTER} 
                  alt={item.title} 
                  className="w-full h-[220px] object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.4 }}
                  onError={(e) => ((e.target as HTMLImageElement).src = DEFAULT_POSTER)} 
                />
                <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-white/10 text-white text-xs font-bold shadow-lg backdrop-blur-xl">
                  {item.platform}
                </div>
              </div>
              <h3 className="text-white font-bold text-sm line-clamp-2 mb-1 hover:text-white/80 transition">{item.title}</h3>
              <p className="text-white/40 text-xs">{new Date(item.releaseDate).toLocaleDateString()}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  ); 
}

function RumorsScrollable({ items }: { items: Rumor[] }) { 
  const statusColor = (status: Rumor['status']) => { 
    if (status === 'confirmed') return 'bg-white/5 text-white/70 border-white/10'; 
    if (status === 'trade') return 'bg-white/5 text-white/70 border-white/10'; 
    return 'bg-white/5 text-white/50 border-white/10'; 
  }; 
  return (
    <div className="rounded-xl p-6 bg-zinc-900/30 border border-white/[0.06]">
      <h2 className="text-xl font-black text-white mb-5">Rumors & Trade Talk</h2>
      <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
        {items.map((rumor) => (
          <motion.div 
            key={rumor.id} 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="rounded-lg p-4 bg-black/20 border border-white/[0.04] hover:bg-black/30 hover:border-white/[0.08] transition-all"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-white font-bold text-sm line-clamp-2 flex-1">{rumor.title}</h3>
              <span className={`text-xs px-2 py-1 rounded-full border flex-shrink-0 font-bold ${statusColor(rumor.status)}`}>
                {rumor.status}
              </span>
            </div>
            <p className="text-white/40 text-xs leading-relaxed mb-2 line-clamp-2">{rumor.summary}</p>
            <div className="text-xs text-white/20">
              <span className="text-white/30">{rumor.source}</span>
            </div>
          </motion.div>
        ))}
      </div>
      <Link href="/rumors" className="mt-4 block text-center py-2 rounded-lg border border-white/[0.1] text-white text-sm hover:bg-white/[0.03] transition">
        View All →
      </Link>
    </div>
  ); 
}

function UpcomingNetflixImproved({ items }: { items: Upcoming[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const statusConfig = (status: Upcoming['status']) => {
    const config = {
      pre: { color: 'bg-white/5 text-white/60 border-white/10', text: 'Pre-Production' },
      filming: { color: 'bg-white/5 text-white/60 border-white/10', text: 'Filming' },
      post: { color: 'bg-white/5 text-white/60 border-white/10', text: 'Post-Production' }
    };
    return config[status];
  };

  return (
    <div className="rounded-xl p-6 bg-zinc-900/30 border border-white/[0.06]">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-black text-white">Upcoming Movies</h2>
        <div className="flex gap-2">
          <motion.button 
            onClick={() => scroll('left')} 
            whileHover={{ scale: 1.1 }}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition shadow-lg"
          >
            <FaChevronLeft className="text-white text-sm" />
          </motion.button>
          <motion.button 
            onClick={() => scroll('right')} 
            whileHover={{ scale: 1.1 }}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition shadow-lg"
          >
            <FaChevronRight className="text-white text-sm" />
          </motion.button>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-3">
        {items.map((movie, idx) => {
          const status = statusConfig(movie.status);
          return (
            <motion.div
              key={movie.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="flex-shrink-0 w-[180px]"
            >
              <Link 
                href={`/movie/${movie.slug}`} 
              >
                <div className="relative rounded-xl overflow-hidden mb-3 shadow-xl border border-white/[0.05] hero-card">
                  <motion.img 
                    src={movie.poster || DEFAULT_POSTER} 
                    alt={movie.title} 
                    className="w-full h-[320px] object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.4 }}
                    onError={(e) => ((e.target as HTMLImageElement).src = DEFAULT_POSTER)} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  
                  <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full border backdrop-blur-xl text-xs font-bold ${status.color}`}>
                    {status.text}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-white font-bold text-sm line-clamp-2 mb-1 hover:text-white/80 transition">
                      {movie.title}
                    </h3>
                    {movie.date && (
                      <p className="text-white/60 text-xs font-medium">
                        {new Date(movie.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
      
      <Link 
        href="/upcoming" 
        className="mt-4 block text-center py-2 rounded-lg border border-white/[0.15] text-white text-sm hover:bg-white/[0.05] transition font-semibold"
      >
        View All Upcoming →
      </Link>
    </div>
  );
}

function MemesGallery() { 
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-xl p-6 bg-zinc-900/30 border border-white/[0.06] hover:border-white/[0.12] hover:bg-zinc-900/50 transition-all"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shadow-lg">
          <FaLaugh className="text-xl text-white" />
        </div>
        <h2 className="text-xl font-black text-white">Memes</h2>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[1, 2, 3].map((i) => (
          <motion.div 
            key={i} 
            className="aspect-square rounded-lg bg-zinc-800/50 border border-white/[0.05]"
            whileHover={{ scale: 1.05 }}
          />
        ))}
      </div>
      <motion.div whileHover={{ scale: 1.02 }}>
        <Link href="/memes" className="block text-center py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition font-semibold">
          View Gallery →
        </Link>
      </motion.div>
    </motion.div>
  ); 
}

function FanGallery() { 
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-xl p-6 bg-zinc-900/30 border border-white/[0.06] hover:border-white/[0.12] hover:bg-zinc-900/50 transition-all"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shadow-lg">
          <FaImages className="text-xl text-white" />
        </div>
        <h2 className="text-xl font-black text-white">Fan Gallery</h2>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[1, 2, 3].map((i) => (
          <motion.div 
            key={i} 
            className="aspect-square rounded-lg bg-zinc-800/50 border border-white/[0.05]"
            whileHover={{ scale: 1.05 }}
          />
        ))}
      </div>
      <motion.div whileHover={{ scale: 1.02 }}>
        <Link href="/fan-gallery" className="block text-center py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition font-semibold">
          View Gallery →
        </Link>
      </motion.div>
    </motion.div>
  ); 
}

function FanZoneCompact() { 
  const testimonials = [
    { id: 1, name: 'Rajesh', quote: '"Devara BGM gave me chills 🔥"' }, 
    { id: 2, name: 'Sneha', quote: '"Can\'t wait for Pushpa 2 trailer!"' }, 
    { id: 3, name: 'Kiran', quote: '"TFI domination incoming 💪"' }
  ]; 
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-xl p-8 bg-zinc-900/30 border border-white/[0.06]"
    >
      <div className="flex items-center gap-3 mb-8">
        <FaHeart className="text-3xl text-white/60" />
        <h2 className="text-2xl font-black text-white">Fan Zone</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {testimonials.map((item) => (
          <motion.div 
            key={item.id} 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-lg p-5 bg-black/20 border border-white/[0.04]"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-zinc-800/80 border border-white/[0.08] flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <div className="text-white font-bold">{item.name}</div>
            </div>
            <p className="text-white/60 text-sm italic">{item.quote}</p>
          </motion.div>
        ))}
      </div>
      <div className="text-center">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link href="/community" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-white/90 transition shadow-lg">
            Join the Conversation <FaChevronRight />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  ); 
}

function MovieDiaryCompact({ userId }: { userId?: string }) { 
  const recentWatched = [
    { id: '1', title: 'Salaar', poster: '/images/salaar.jpg', rating: 4.5, date: '2025-10-20' }, 
    { id: '2', title: 'RRR', poster: '/images/rrr.jpg', rating: 5, date: '2025-10-18' }, 
    { id: '3', title: 'Baahubali 2', poster: '/images/baahubali2.jpg', rating: 4.8, date: '2025-10-15' }
  ]; 
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-xl p-8 bg-zinc-900/30 border border-white/[0.06]"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">Your Movie Diary</h2>
          <p className="text-white/40 text-sm">Track what you've watched</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link href="/diary" className="px-6 py-2.5 bg-white text-black text-sm font-bold rounded-lg hover:bg-white/90 transition">
            View All
          </Link>
        </motion.div>
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {recentWatched.map((movie) => (
          <motion.div 
            key={movie.id} 
            className="flex-shrink-0 w-[140px]"
            whileHover={{ y: -4 }}
          >
            <div className="relative rounded-lg overflow-hidden mb-3 group hero-card">
              <motion.img 
                src={movie.poster || DEFAULT_POSTER} 
                alt={movie.title} 
                className="w-full h-[200px] object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                onError={(e) => ((e.target as HTMLImageElement).src = DEFAULT_POSTER)} 
              />
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <div className="text-white font-bold text-lg flex items-center gap-1">
                  <FaStar className="text-yellow-400" />
                  {movie.rating}
                </div>
              </div>
            </div>
            <h4 className="text-white font-bold text-sm line-clamp-1 mb-1">{movie.title}</h4>
            <p className="text-white/30 text-xs">{new Date(movie.date).toLocaleDateString()}</p>
          </motion.div>
        ))}
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link href="/diary/add" className="flex-shrink-0 w-[140px] flex flex-col items-center justify-center h-[200px] rounded-lg border-2 border-dashed border-white/[0.12] hover:border-white/[0.3] hover:bg-white/[0.02] transition">
            <div className="text-4xl mb-2 text-white/30">+</div>
            <div className="text-white/40 text-sm font-semibold">Log Movie</div>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  ); 
}

function CorrectionsCompact() { 
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-xl p-6 bg-zinc-900/30 border border-white/[0.06]"
    >
      <div className="flex items-start gap-4">
        <FaExclamationTriangle className="text-2xl text-white/60 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-white text-lg font-bold mb-2">Found an Error?</h3>
          <p className="text-white/40 text-sm mb-4 leading-relaxed">Help us improve! Report incorrect data, missing information, or broken links. We review all submissions and update within 24-48 hours.</p>
          <motion.div whileHover={{ x: 4 }}>
            <Link href="/corrections" className="inline-flex items-center gap-2 text-white hover:text-white/80 font-semibold text-sm transition">
              Report Correction <FaChevronRight className="text-xs" />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  ); 
}
