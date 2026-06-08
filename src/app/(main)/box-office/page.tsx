import { getBoxOfficeData, getBoxOfficeStats } from '@/app/actions/box-office';
import { getBoxOfficeHubData } from '@/app/actions/boxoffice';
import { getVerdictBadgeBg } from '@/lib/verdict-engine';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { BoxOfficeFilters } from './components';
import { TrendingUp, Trophy, IndianRupee, Film, BarChart3, ArrowUpRight, Crown, Flame, Star, Activity, MapPin, Building2, Ticket, Zap, Radio, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Box Office Tracker | TFIverse',
  description: 'Track Telugu cinema box office collections, verdicts, and regional breakdowns. From Blockbusters to Disasters — the definitive TFI Box Office database.',
};

function formatGross(val: number): string {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)} K`;
  return `₹${val.toFixed(0)}`;
}

function formatCount(val: number): string {
  if (val >= 10000000) return `${(val / 10000000).toFixed(1)} Cr`;
  if (val >= 100000) return `${(val / 100000).toFixed(1)} L`;
  if (val >= 1000) return `${(val / 1000).toFixed(1)} K`;
  return val.toLocaleString();
}

export default async function BoxOfficePage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const year = params.year || 'all';
  const sortBy = (params.sort as any) || 'revenue';

  const [boxOfficeMovies, stats, hubData] = await Promise.all([
    getBoxOfficeData({ year, sortBy, limit: 50 }),
    getBoxOfficeStats(),
    getBoxOfficeHubData(),
  ]);

  // Top 3 for the hero podium
  const top3 = boxOfficeMovies.slice(0, 3);

  // Live data
  const liveTopMovies = hubData?.topMovies || [];
  const trendingTheaters = hubData?.trendingTheaters || [];
  const sysStats = hubData?.systemStats;

  return (
    <div className="min-h-screen bg-black text-white pb-20 selection:bg-white selection:text-black">
      {/* ══════════════════════════════════════════════════════════ */}
      {/* HERO — Cinematic Header with Stats                        */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden border-b border-white/[0.04]">
        {/* Subtle Background Pattern instead of heavy gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent" />
        
        <div className="relative max-w-[1600px] mx-auto px-6 md:px-16 pt-28 md:pt-36 pb-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>→</span>
            <span className="text-white/80">Box Office</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] shadow-inner flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white/60" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-none text-white">
                    Box Office
                  </h1>
                </div>
              </div>
              <p className="text-white/50 text-sm md:text-base font-medium max-w-xl leading-relaxed mt-4">
                The definitive tracker for Telugu cinema collections. Every blockbuster, 
                every flop — tracked with live analytics.
              </p>
            </div>

            <Suspense fallback={null}>
              <BoxOfficeFilters currentYear={year} currentSort={sortBy} />
            </Suspense>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl p-6 glass-premium border border-white/[0.04] bg-white/[0.01]">
              <div className="flex items-center gap-2 mb-3">
                <Film className="w-4 h-4 text-blue-400" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Movies Tracked</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.totalMovies}</p>
            </div>
            <div className="rounded-2xl p-6 glass-premium border border-white/[0.04] bg-white/[0.01]">
              <div className="flex items-center gap-2 mb-3">
                <IndianRupee className="w-4 h-4 text-emerald-500/50" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Total Revenue</span>
              </div>
              <p className="text-2xl font-bold text-emerald-400">{stats.totalRevenue}</p>
            </div>
            <div className="rounded-2xl p-6 glass-premium border border-white/[0.04] bg-white/[0.01]">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Avg. Rating</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.avgRating}<span className="text-sm text-white/30 ml-1">/10</span></p>
            </div>
            <div className="rounded-2xl p-6 glass-premium border border-white/[0.04] bg-white/[0.01]">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-4 h-4 text-purple-400" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Best Year</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.topYear}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 🔴 LIVE BOX OFFICE HUB — Real-Time Tracking Data         */}
      {/* ══════════════════════════════════════════════════════════ */}
      {liveTopMovies.length > 0 && (
        <section className="max-w-[1600px] mx-auto px-6 md:px-16 mt-16 mb-20">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Radio className="w-4 h-4 text-red-500" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
              </div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                Live Top Grossers
              </h2>
            </div>
            {sysStats && (
              <div className="hidden md:flex items-center gap-6 text-[11px] font-medium text-white/40 tracking-wide">
                <span className="flex items-center gap-1.5"><Film className="w-3.5 h-3.5" />{sysStats.totalMovies} Movies</span>
                <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" />{formatCount(sysStats.totalVenues)} Venues</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{sysStats.totalCities} Cities</span>
                <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" />{formatCount(sysStats.totalSessions)} Sessions</span>
              </div>
            )}
          </div>

          {/* Top 5 Live Movies — Featured Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {liveTopMovies.slice(0, 5).map((movie, index) => {
              const ranks = ['01', '02', '03', '04', '05'];
              return (
                <Link
                  key={movie.id}
                  href={`/box-office/track/${movie.id}`}
                  className="group flex flex-col rounded-2xl glass-premium border border-white/[0.04] bg-white/[0.01] overflow-hidden hover:bg-white/[0.03] transition-all duration-500"
                >
                  {/* Poster / Backdrop */}
                  <div className="relative w-full aspect-[4/3] bg-[#0a0a0a]">
                    {movie.backdropUrl ? (
                      <Image
                        src={movie.backdropUrl.startsWith('http') ? movie.backdropUrl : `https://image.tmdb.org/t/p/w500${movie.backdropUrl}`}
                        alt={movie.title}
                        fill
                        className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-white/[0.02]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent" />
                    
                    {/* Rank */}
                    <div className="absolute top-4 left-4 text-xs font-bold tracking-widest text-white/50">{ranks[index]}</div>
                    
                    {/* Occupancy Badge */}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                      <div className={`w-1.5 h-1.5 rounded-full ${movie.occupancy >= 70 ? 'bg-red-500' : movie.occupancy >= 40 ? 'bg-yellow-500' : 'bg-white/40'}`} />
                      <span className="text-[9px] font-bold tracking-[0.1em] text-white/80">{movie.occupancy}% OCC</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5 flex-1 flex flex-col justify-end bg-gradient-to-b from-[#0a0a0a] to-black">
                    <h3 className="text-sm font-bold text-white mb-2 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                      {movie.title}
                    </h3>
                    <p className="text-xl font-bold text-emerald-400 mb-4 tracking-tight">
                      {formatGross(movie.totalGross)}
                    </p>
                    <div className="flex items-center justify-between text-[11px] font-medium text-white/40">
                      <span className="flex items-center gap-1.5"><Ticket className="w-3.5 h-3.5" />{formatCount(movie.totalSold)}</span>
                      <span>{movie.showsCount.toLocaleString()} shows</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Remaining Movies — Compact List */}
          {liveTopMovies.length > 5 && (
            <div className="rounded-2xl border border-white/[0.04] bg-white/[0.01] overflow-hidden">
              <div className="px-6 py-4 border-b border-white/[0.04] flex items-center justify-between">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Live Tracking Pool</span>
              </div>
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/[0.04] bg-white/[0.01]">
                <div className="col-span-1 text-[10px] font-bold text-white/30 uppercase tracking-[0.1em]">Rk</div>
                <div className="col-span-3 text-[10px] font-bold text-white/30 uppercase tracking-[0.1em]">Movie</div>
                <div className="col-span-2 text-[10px] font-bold text-white/30 uppercase tracking-[0.1em] text-right">Gross</div>
                <div className="col-span-2 text-[10px] font-bold text-white/30 uppercase tracking-[0.1em] text-right">Tickets</div>
                <div className="col-span-1 text-[10px] font-bold text-white/30 uppercase tracking-[0.1em] text-right">Shows</div>
                <div className="col-span-1 text-[10px] font-bold text-white/30 uppercase tracking-[0.1em] text-right">Venues</div>
                <div className="col-span-2 text-[10px] font-bold text-white/30 uppercase tracking-[0.1em] text-right">Occupancy</div>
              </div>
              {liveTopMovies.slice(5).map((movie, index) => (
                <Link
                  key={movie.id}
                  href={`/box-office/track/${movie.id}`}
                  className="group grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-white/[0.02] transition-colors border-b border-white/[0.02] last:border-0"
                >
                  <div className="col-span-1">
                    <span className="text-xs font-bold text-white/30 tracking-widest">{(index + 6).toString().padStart(2, '0')}</span>
                  </div>
                  <div className="col-span-7 md:col-span-3 flex items-center gap-4">
                    <span className="text-sm font-semibold text-white/80 group-hover:text-emerald-400 truncate transition-colors">
                      {movie.title}
                    </span>
                  </div>
                  <div className="col-span-4 md:col-span-2 text-right">
                    <span className="text-sm font-bold text-emerald-400">{formatGross(movie.totalGross)}</span>
                  </div>
                  <div className="hidden md:block col-span-2 text-right">
                    <span className="text-sm font-medium text-white/60">{formatCount(movie.totalSold)}</span>
                  </div>
                  <div className="hidden md:block col-span-1 text-right">
                    <span className="text-xs font-medium text-white/40">{movie.showsCount.toLocaleString()}</span>
                  </div>
                  <div className="hidden md:block col-span-1 text-right">
                    <span className="text-xs font-medium text-white/40">{movie.venues}</span>
                  </div>
                  <div className="hidden md:block col-span-2 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="w-16 h-1 rounded-full bg-white/5 overflow-hidden">
                        <div 
                          className="h-full bg-white/40 group-hover:bg-white/80 transition-all"
                          style={{ width: `${Math.min(100, movie.occupancy)}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-white/60 w-10 text-right">{movie.occupancy}%</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 🔥 TRENDING THEATERS                                     */}
      {/* ══════════════════════════════════════════════════════════ */}
      {trendingTheaters.length > 0 && (
        <section className="max-w-[1600px] mx-auto px-6 md:px-16 mb-24">
          <div className="flex items-center gap-3 mb-8">
            <Zap className="w-4 h-4 text-orange-400" />
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
              Trending Theaters
            </h2>
            <span className="text-[10px] font-medium text-white/30 tracking-widest ml-auto hidden md:block">HIGHEST OCCUPANCY LIVE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {trendingTheaters.slice(0, 10).map((theater, i) => (
              <div
                key={`${theater.venueName}-${i}`}
                className="rounded-2xl p-5 border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.02] transition-colors"
              >
                {/* Occupancy Bar */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xl font-bold ${theater.occupancy >= 90 ? 'text-red-400' : 'text-white/80'}`}>
                    {theater.occupancy}%
                  </span>
                  {theater.occupancy >= 90 && (
                    <span className="text-[9px] font-bold uppercase tracking-widest text-red-400 bg-red-500/10 px-2 py-1 rounded-sm">
                      Full
                    </span>
                  )}
                  {theater.occupancy >= 70 && theater.occupancy < 90 && (
                    <span className="text-[9px] font-bold uppercase tracking-widest text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-sm">
                      Fast
                    </span>
                  )}
                </div>
                <div className="w-full h-1 rounded-full bg-white/5 mb-4 overflow-hidden">
                  <div 
                    className="h-full bg-white/40"
                    style={{ width: `${Math.min(100, theater.occupancy)}%` }}
                  />
                </div>
                <h3 className="text-sm font-semibold text-white line-clamp-1 mb-1.5">{theater.venueName}</h3>
                <p className="text-xs font-medium text-white/40 mb-1">{theater.city}, {theater.state}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mt-3 border-t border-white/5 pt-3">{theater.chainName} • {theater.shows} SHOWS</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ALL-TIME RANKINGS (Verified via Tracking Engine)          */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-16 mb-20">
        <div className="flex items-center gap-3 mb-10">
          <Trophy className="w-4 h-4 text-amber-400" />
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
            {year !== 'all' ? `${year} ` : ''}Verified Box Office Rankings
          </h2>
          <span className="text-[10px] font-medium text-white/30 tracking-widest ml-auto">{boxOfficeMovies.length} TRACKED</span>
        </div>

        {/* Top 3 Podium - Clean Minimalist Style */}
        {top3.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {top3.map((movie, index) => {
              const ranks = ['01', '02', '03'];
              return (
                <Link
                  key={movie.id}
                  href={`/movies/${movie.slug}`}
                  className="group flex flex-col rounded-2xl border border-white/[0.04] bg-white/[0.01] overflow-hidden hover:bg-white/[0.03] transition-all duration-500"
                >
                  <div className="relative w-full aspect-video bg-[#0a0a0a]">
                    {movie.backdropUrl && (
                      <Image
                        src={movie.backdropUrl.startsWith('http') ? movie.backdropUrl : `https://image.tmdb.org/t/p/w780${movie.backdropUrl}`}
                        alt={movie.title}
                        fill
                        className="object-cover opacity-50 group-hover:opacity-80 transition-opacity duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

                    <div className="absolute top-5 left-5 text-lg font-black tracking-widest text-white/50">{ranks[index]}</div>
                    
                    <div className="absolute top-5 right-5 px-3 py-1.5 rounded-sm border border-white/10 text-[9px] font-bold uppercase tracking-[0.2em] text-white/60 bg-black/40 backdrop-blur-md">
                      {movie.verdict}
                    </div>
                  </div>

                  <div className="p-6 bg-[#0a0a0a]">
                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                      {movie.title}
                    </h3>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-6">{movie.year}</p>

                    <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-5">
                      <div>
                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.1em] mb-1.5">Budget</p>
                        <p className="text-sm font-semibold text-white/60">{movie.budgetCr}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.1em] mb-1.5">Tracked Gross</p>
                        <p className="text-sm font-bold text-emerald-400">{movie.revenueCr}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.1em] mb-1.5">ROI</p>
                        <p className="text-sm font-semibold text-white/80">{movie.multiplier}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/[0.06] mb-2 bg-white/[0.01] rounded-t-2xl">
          <div className="col-span-1 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Rank</div>
          <div className="col-span-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Movie</div>
          <div className="col-span-1 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] text-right">Budget</div>
          <div className="col-span-2 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] text-right">Tracked Gross</div>
          <div className="col-span-1 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] text-right">ROI</div>
          <div className="col-span-3 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] text-right">Verdict</div>
        </div>

        {/* Rows */}
        <div className="space-y-0.5">
          {boxOfficeMovies.map((movie, index) => (
            <Link
              key={movie.id}
              href={`/movies/${movie.slug}`}
              className="group grid grid-cols-12 gap-4 items-center px-6 py-4 rounded-xl hover:bg-white/[0.02] transition-colors border-b border-transparent hover:border-white/[0.04]"
            >
              <div className="col-span-1">
                <span className="text-xs font-bold text-white/30 tracking-widest">
                  {(index + 1).toString().padStart(2, '0')}
                </span>
              </div>

              <div className="col-span-7 md:col-span-4 flex items-center gap-4">
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm text-white/80 group-hover:text-emerald-400 transition-colors truncate">
                    {movie.title}
                  </h3>
                  <p className="text-[10px] font-bold text-white/30 tracking-widest mt-1">{movie.year}</p>
                  <div className="md:hidden mt-2">
                    <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-white/50 border border-white/10 px-2 py-0.5 rounded-sm">
                      {movie.verdict}
                    </span>
                  </div>
                </div>
              </div>

              <div className="hidden md:block col-span-1 text-right">
                <span className="text-sm font-medium text-white/40">{movie.budgetCr}</span>
              </div>

              <div className="col-span-4 md:col-span-2 text-right">
                <span className="text-sm font-bold text-emerald-400">{movie.revenueCr}</span>
              </div>

              <div className="hidden md:block col-span-1 text-right">
                <span className="text-sm font-medium text-white/60">{movie.multiplier}</span>
              </div>

              <div className="hidden md:flex col-span-3 justify-end">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-white/10 text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
                  {movie.verdict === 'All-Time Blockbuster' && <Flame className="w-3 h-3 text-white/40" />}
                  {movie.verdict}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {boxOfficeMovies.length === 0 && (
          <div className="text-center py-24 border border-white/5 rounded-2xl bg-white/[0.01]">
            <BarChart3 className="w-8 h-8 text-white/20 mx-auto mb-4" />
            <p className="text-white/40 font-medium text-sm">No verified tracking data available.</p>
            <p className="text-white/20 text-xs mt-2">The system only displays movies with aggregated tracking data.</p>
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* LEGEND                                                     */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-16 mt-20">
        <div className="border border-white/5 rounded-2xl p-8 bg-white/[0.01]">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-8">Verdict Engine Architecture</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { verdict: 'All-Time Blockbuster', range: '5x+ Ratio' },
              { verdict: 'Blockbuster', range: '3.5x - 5x' },
              { verdict: 'Super Hit', range: '2.5x - 3.5x' },
              { verdict: 'Hit', range: '2x - 2.5x' },
              { verdict: 'Above Average', range: '1.5x - 2x' },
              { verdict: 'Average', range: '1x - 1.5x' },
              { verdict: 'Below Average', range: '0.75x - 1x' },
              { verdict: 'Flop', range: '0.5x - 0.75x' },
              { verdict: 'Disaster', range: 'Below 0.5x' },
            ].map(v => (
              <div key={v.verdict} className="flex flex-col p-4 rounded-xl border border-white/[0.03] bg-[#0a0a0a]">
                <p className="text-xs font-bold text-white/80 mb-1">{v.verdict}</p>
                <p className="text-[10px] font-medium text-white/30 tracking-widest">{v.range}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] font-medium text-white/30 mt-8 max-w-3xl leading-relaxed">
            * The TFI Box Office Engine exclusively uses verified tracking data aggregated from live sessions. 
            Static database estimates are ignored for all verified entries. Verdicts are calculated using the precise Ratio = (Tracked Gross / Budget).
          </p>
        </div>
      </section>
    </div>
  );
}
