import { getBoxOfficeData, getBoxOfficeStats } from '@/app/actions/box-office';
import { getVerdictBadgeBg } from '@/lib/verdict-engine';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { BoxOfficeFilters } from './components';
import { TrendingUp, Trophy, IndianRupee, Film, BarChart3, ArrowUpRight, Crown, Flame, Star } from 'lucide-react';

export const metadata = {
  title: 'Box Office Tracker | TFIverse',
  description: 'Track Telugu cinema box office collections, verdicts, and regional breakdowns. From Blockbusters to Disasters — the definitive TFI Box Office database.',
};

export default async function BoxOfficePage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const year = params.year || 'all';
  const sortBy = (params.sort as any) || 'revenue';

  const [boxOfficeMovies, stats] = await Promise.all([
    getBoxOfficeData({ year, sortBy, limit: 50 }),
    getBoxOfficeStats(),
  ]);

  // Top 3 for the hero podium
  const top3 = boxOfficeMovies.slice(0, 3);
  const restMovies = boxOfficeMovies.slice(3);

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* ══════════════════════════════════════════════════════════ */}
      {/* HERO — Cinematic Header with Stats                        */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/30 via-black to-yellow-950/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent" />
        
        <div className="relative max-w-[1600px] mx-auto px-6 md:px-16 pt-28 md:pt-36 pb-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>→</span>
            <span className="text-emerald-500">Box Office</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none">
                    Box Office
                  </h1>
                </div>
              </div>
              <p className="text-zinc-400 text-sm md:text-base font-medium max-w-xl leading-relaxed">
                The definitive tracker for Telugu cinema collections. Every blockbuster, 
                every flop — tracked with verdicts powered by the <span className="text-emerald-400 font-bold">TFI Verdict Engine</span>.
              </p>
              <div className="mt-4">
                <Link
                  href="/box-office/live"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-blue-400 hover:text-blue-300 font-bold text-sm transition-all shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  Live Box Office Dashboard
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <Suspense fallback={null}>
              <BoxOfficeFilters currentYear={year} currentSort={sortBy} />
            </Suspense>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/5 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Film className="w-4 h-4 text-zinc-500" />
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Movies Tracked</span>
              </div>
              <p className="text-2xl font-black text-white">{stats.totalMovies}</p>
            </div>
            <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/5 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <IndianRupee className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total Revenue</span>
              </div>
              <p className="text-2xl font-black text-emerald-400">{stats.totalRevenue}</p>
            </div>
            <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/5 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Avg. Rating</span>
              </div>
              <p className="text-2xl font-black text-yellow-400">{stats.avgRating}<span className="text-sm text-zinc-500">/10</span></p>
            </div>
            <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/5 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-amber-500" />
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Best Year</span>
              </div>
              <p className="text-2xl font-black text-amber-400">{stats.topYear}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TOP 3 PODIUM                                              */}
      {/* ══════════════════════════════════════════════════════════ */}
      {top3.length >= 3 && (
        <section className="max-w-[1600px] mx-auto px-6 md:px-16 mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-500">
              {year !== 'all' ? `${year} ` : ''}Top Grossers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {top3.map((movie, index) => {
              const medals = ['🥇', '🥈', '🥉'];
              const gradients = [
                'from-yellow-500/10 via-amber-500/5 to-transparent border-yellow-500/20',
                'from-zinc-400/10 via-zinc-500/5 to-transparent border-zinc-400/20',
                'from-orange-700/10 via-orange-800/5 to-transparent border-orange-700/20',
              ];
              return (
                <Link
                  key={movie.id}
                  href={`/movies/${movie.slug}`}
                  className={`group relative bg-gradient-to-br ${gradients[index]} border rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-300`}
                >
                  {/* Backdrop Image */}
                  <div className="relative w-full aspect-video">
                    {movie.backdropUrl ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w780${movie.backdropUrl}`}
                        alt={movie.title}
                        fill
                        className="object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-zinc-900" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                    {/* Medal */}
                    <div className="absolute top-4 left-4 text-3xl">{medals[index]}</div>

                    {/* Verdict Badge */}
                    <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${getVerdictBadgeBg(movie.verdict)} ${movie.verdictColor}`}>
                      {movie.verdict}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-black text-white mb-1 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                      {movie.title}
                    </h3>
                    <p className="text-xs font-bold text-zinc-500 mb-4">{movie.year}</p>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Budget</p>
                        <p className="text-sm font-black text-zinc-300">{movie.budgetCr}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Gross</p>
                        <p className="text-sm font-black text-emerald-400">{movie.revenueCr}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">ROI</p>
                        <p className="text-sm font-black text-white">{movie.multiplier}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* FULL TABLE — All Movies                                   */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-16">
        <div className="flex items-center gap-3 mb-8">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          <h2 className="text-sm font-black uppercase tracking-widest text-zinc-500">
            Complete Box Office Rankings
          </h2>
          <span className="text-xs font-bold text-zinc-600 ml-auto">{boxOfficeMovies.length} movies</span>
        </div>

        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 mb-2">
          <div className="col-span-1 text-[9px] font-black text-zinc-600 uppercase tracking-widest">#</div>
          <div className="col-span-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest">Movie</div>
          <div className="col-span-1 text-[9px] font-black text-zinc-600 uppercase tracking-widest text-right">Budget</div>
          <div className="col-span-2 text-[9px] font-black text-zinc-600 uppercase tracking-widest text-right">Gross</div>
          <div className="col-span-1 text-[9px] font-black text-zinc-600 uppercase tracking-widest text-right">ROI</div>
          <div className="col-span-3 text-[9px] font-black text-zinc-600 uppercase tracking-widest text-right">Verdict</div>
        </div>

        {/* Rows */}
        <div className="space-y-1">
          {boxOfficeMovies.map((movie, index) => (
            <Link
              key={movie.id}
              href={`/movies/${movie.slug}`}
              className="group grid grid-cols-12 gap-4 items-center px-6 py-4 rounded-2xl hover:bg-zinc-900/60 transition-all duration-200 border border-transparent hover:border-white/5"
            >
              {/* Rank */}
              <div className="col-span-1">
                <span className={`text-lg font-black ${index < 3 ? 'text-yellow-500' : index < 10 ? 'text-zinc-300' : 'text-zinc-600'}`}>
                  {index + 1}
                </span>
              </div>

              {/* Movie Info */}
              <div className="col-span-7 md:col-span-4 flex items-center gap-4">
                <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-zinc-900 shrink-0 border border-white/5">
                  {movie.posterUrl ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w92${movie.posterUrl}`}
                      alt={movie.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Film className="w-5 h-5 text-zinc-700" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors truncate">
                    {movie.title}
                  </h3>
                  <p className="text-[10px] font-bold text-zinc-500">{movie.year}</p>
                  {/* Mobile verdict */}
                  <div className="md:hidden mt-1">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${movie.verdictColor}`}>
                      {movie.verdict}
                    </span>
                  </div>
                </div>
              </div>

              {/* Budget — hidden on mobile */}
              <div className="hidden md:block col-span-1 text-right">
                <span className="text-sm font-bold text-zinc-400">{movie.budgetCr}</span>
              </div>

              {/* Gross */}
              <div className="col-span-4 md:col-span-2 text-right">
                <span className="text-sm font-black text-emerald-400">{movie.revenueCr}</span>
              </div>

              {/* ROI — hidden on mobile */}
              <div className="hidden md:block col-span-1 text-right">
                <span className="text-sm font-bold text-white">{movie.multiplier}</span>
              </div>

              {/* Verdict */}
              <div className="hidden md:flex col-span-3 justify-end">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${getVerdictBadgeBg(movie.verdict)} ${movie.verdictColor}`}>
                  {movie.verdict === 'All-Time Blockbuster' && <Flame className="w-3 h-3" />}
                  {movie.verdict}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {boxOfficeMovies.length === 0 && (
          <div className="text-center py-20">
            <BarChart3 className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
            <p className="text-zinc-500 font-bold">No box office data available for this selection.</p>
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* LEGEND                                                     */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-16 mt-20">
        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8">
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-6">Verdict Engine — How It Works</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { verdict: 'All-Time Blockbuster', range: '5x+ Revenue/Budget', color: 'text-yellow-400', icon: '🔥' },
              { verdict: 'Blockbuster', range: '3.5x - 5x', color: 'text-emerald-400', icon: '💎' },
              { verdict: 'Super Hit', range: '2.5x - 3.5x', color: 'text-green-400', icon: '🎯' },
              { verdict: 'Hit', range: '2x - 2.5x', color: 'text-lime-400', icon: '✅' },
              { verdict: 'Above Average', range: '1.5x - 2x', color: 'text-blue-400', icon: '📈' },
              { verdict: 'Average', range: '1x - 1.5x', color: 'text-zinc-300', icon: '➖' },
              { verdict: 'Below Average', range: '0.75x - 1x', color: 'text-orange-400', icon: '📉' },
              { verdict: 'Flop', range: '0.5x - 0.75x', color: 'text-red-400', icon: '❌' },
              { verdict: 'Disaster', range: 'Below 0.5x', color: 'text-red-600', icon: '💀' },
            ].map(v => (
              <div key={v.verdict} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/50">
                <span className="text-lg">{v.icon}</span>
                <div>
                  <p className={`text-xs font-black ${v.color}`}>{v.verdict}</p>
                  <p className="text-[9px] font-bold text-zinc-600 mt-0.5">{v.range}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] font-bold text-zinc-600 mt-6 leading-relaxed">
            * Verdicts are automatically calculated using the TFI Verdict Engine™. Revenue/Budget ratio determines the verdict tier. 
            Data sourced from TMDB with community verification. All amounts converted to INR (₹) at standard rates.
          </p>
        </div>
      </section>
    </div>
  );
}
