import { getNewOnOtt, getAvailablePlatforms } from '@/app/actions/ott-feed';
import { getPlatformBrand } from '@/lib/platform-brands';
import Image from 'next/image';
import Link from 'next/link';
import { Tv, Play, Star, Shuffle, ExternalLink, Film } from 'lucide-react';

export const metadata = {
  title: 'New on OTT | TFIverse',
  description: 'Discover the latest Telugu movies streaming on Netflix, Prime Video, Aha, Hotstar, and more. Your one-stop OTT discovery engine.',
};

export default async function NewOnOttPage({
  searchParams,
}: {
  searchParams: Promise<{ platform?: string; page?: string }>;
}) {
  const params = await searchParams;
  const platform = params.platform || 'all';
  const page = parseInt(params.page || '1');

  const [ottMovies, platforms] = await Promise.all([
    getNewOnOtt({ platform, limit: 30, page }),
    getAvailablePlatforms(),
  ]);

  // Group platforms for the filter bar (top platforms only)
  const topPlatforms = ['Netflix', 'Amazon Prime Video', 'Aha', 'JioHotstar', 'ZEE5', 'Sony Liv', 'Sun NXT', 'JioCinema'];

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* ══════════════════════════════════════════════════════════ */}
      {/* HERO HEADER                                                */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/30 via-black to-blue-950/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/5 via-transparent to-transparent" />
        
        <div className="relative max-w-[1600px] mx-auto px-6 md:px-16 pt-28 md:pt-36 pb-12">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>→</span>
            <span className="text-purple-400">New on OTT</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Tv className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none">
                  New on OTT
                </h1>
              </div>
              <p className="text-zinc-400 text-sm md:text-base font-medium max-w-xl leading-relaxed">
                Every Telugu movie now streaming. Filter by platform, discover hidden gems, 
                and find your next <span className="text-purple-400 font-bold">binge-worthy watch</span>.
              </p>
            </div>
          </div>

          {/* Platform Filter Bar */}
          <div className="flex overflow-x-auto gap-3 pb-4 snap-x scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
            <Link
              href="/new-on-ott"
              className={`shrink-0 snap-start px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
                platform === 'all'
                  ? 'bg-white text-black border-white shadow-lg'
                  : 'bg-zinc-900/50 text-zinc-400 border-white/5 hover:text-white hover:border-white/20'
              }`}
            >
              All Platforms
            </Link>
            {topPlatforms.map(p => {
              const brand = getPlatformBrand(p);
              const isActive = platform.toLowerCase() === p.toLowerCase() || platform.toLowerCase().includes(p.toLowerCase().split(' ')[0]);
              return (
                <Link
                  key={p}
                  href={`/new-on-ott?platform=${encodeURIComponent(p)}`}
                  className={`shrink-0 snap-start flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    isActive
                      ? 'bg-white text-black border-white shadow-lg'
                      : 'bg-zinc-900/50 text-zinc-400 border-white/5 hover:text-white hover:border-white/20'
                  }`}
                >
                  {brand.logo && (
                    <img src={brand.logo} alt={brand.name} className="w-5 h-5 rounded-md object-cover" />
                  )}
                  {brand.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MOVIE GRID                                                 */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-16 mt-8">
        {ottMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {ottMovies.map(movie => (
              <Link
                key={movie.id}
                href={`/movies/${movie.slug}`}
                className="group relative"
              >
                {/* Poster */}
                <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 shadow-lg group-hover:shadow-xl group-hover:shadow-purple-500/10 transition-all duration-300 group-hover:scale-[1.03] group-hover:border-white/10">
                  {movie.posterUrl ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w342${movie.posterUrl}`}
                      alt={movie.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Film className="w-10 h-10 text-zinc-800" />
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Play Icon on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                      <Play className="w-6 h-6 text-white ml-1" fill="white" />
                    </div>
                  </div>

                  {/* Rating Badge */}
                  {movie.voteAverage && movie.voteAverage > 0 && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md rounded-lg px-2 py-1 flex items-center gap-1 border border-white/10">
                      <Star className="w-3 h-3 text-yellow-400" fill="#FBBF24" />
                      <span className="text-[10px] font-black text-white">{movie.voteAverage.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="mt-3 px-1">
                  <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-purple-400 transition-colors">
                    {movie.title}
                  </h3>
                  <p className="text-[10px] font-bold text-zinc-500 mt-0.5">{movie.year}</p>
                  
                  {/* Platform Pills */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {movie.platforms.slice(0, 3).map(p => {
                      const brand = getPlatformBrand(p.platform);
                      return (
                        <span
                          key={p.platform}
                          className="inline-flex items-center gap-1 bg-zinc-900 border border-white/5 rounded-md px-1.5 py-0.5"
                        >
                          {brand.logo && (
                            <img src={brand.logo} alt={brand.name} className="w-3.5 h-3.5 rounded-sm object-cover" />
                          )}
                          <span className="text-[8px] font-bold text-zinc-400">{brand.name}</span>
                        </span>
                      );
                    })}
                    {movie.platforms.length > 3 && (
                      <span className="text-[8px] font-bold text-zinc-600 px-1.5 py-0.5">+{movie.platforms.length - 3}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Tv className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
            <p className="text-zinc-500 font-bold">No movies found for this platform.</p>
            <Link href="/new-on-ott" className="text-purple-400 text-sm font-bold hover:underline mt-2 inline-block">
              Show all platforms →
            </Link>
          </div>
        )}

        {/* Pagination */}
        {ottMovies.length >= 30 && (
          <div className="flex justify-center gap-3 mt-12">
            {page > 1 && (
              <Link
                href={`/new-on-ott?${platform !== 'all' ? `platform=${platform}&` : ''}page=${page - 1}`}
                className="px-6 py-3 rounded-xl bg-zinc-900 border border-white/5 text-sm font-bold text-zinc-400 hover:text-white hover:border-white/20 transition-all"
              >
                ← Previous
              </Link>
            )}
            <Link
              href={`/new-on-ott?${platform !== 'all' ? `platform=${platform}&` : ''}page=${page + 1}`}
              className="px-6 py-3 rounded-xl bg-zinc-900 border border-white/5 text-sm font-bold text-zinc-400 hover:text-white hover:border-white/20 transition-all"
            >
              Next →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
