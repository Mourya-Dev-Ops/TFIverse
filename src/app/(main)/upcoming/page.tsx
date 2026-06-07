import { db } from '@/lib/db';
import { movies } from '@/lib/schema';
import { eq, gt, desc, asc, and, or, isNotNull, gte } from 'drizzle-orm';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, Clapperboard, Film, Rocket, AlertCircle, Star, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Upcoming Telugu Movies | TFIverse',
  description: 'Track every upcoming Telugu movie — from announced to post-production. Release dates, trailers, and cast info for every Tollywood film in the pipeline.',
};

interface UpcomingMovie {
  id: number;
  title: string;
  slug: string;
  year: number | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: Date | null;
  status: string | null;
  voteAverage: number | null;
  popularity: number | null;
  overview: string | null;
}

async function getUpcomingByStatus(status: string, limit = 20): Promise<UpcomingMovie[]> {
  return await db.select({
    id: movies.id,
    title: movies.title,
    slug: movies.slug,
    year: movies.year,
    posterUrl: movies.posterUrl,
    backdropUrl: movies.backdropUrl,
    releaseDate: movies.releaseDate,
    status: movies.status,
    voteAverage: movies.voteAverage,
    popularity: movies.popularity,
    overview: movies.overview,
  })
  .from(movies)
  .where(eq(movies.status, status))
  .orderBy(desc(movies.popularity))
  .limit(limit);
}

async function getReleasingThisYear(): Promise<UpcomingMovie[]> {
  const currentYear = new Date().getFullYear();
  return await db.select({
    id: movies.id,
    title: movies.title,
    slug: movies.slug,
    year: movies.year,
    posterUrl: movies.posterUrl,
    backdropUrl: movies.backdropUrl,
    releaseDate: movies.releaseDate,
    status: movies.status,
    voteAverage: movies.voteAverage,
    popularity: movies.popularity,
    overview: movies.overview,
  })
  .from(movies)
  .where(
    and(
      eq(movies.year, currentYear),
      gte(movies.releaseDate, new Date()),
    )
  )
  .orderBy(asc(movies.releaseDate))
  .limit(30);
}

const statusConfig: Record<string, { icon: string; color: string; bgColor: string; label: string; description: string }> = {
  'Post Production': { icon: '🎬', color: 'text-orange-400', bgColor: 'from-orange-500/10 to-transparent border-orange-500/20', label: 'Post Production', description: 'Filming complete — in editing, VFX, and sound design.' },
  'In Production': { icon: '🎥', color: 'text-blue-400', bgColor: 'from-blue-500/10 to-transparent border-blue-500/20', label: 'In Production', description: 'Currently filming on set.' },
  'Planned': { icon: '📋', color: 'text-purple-400', bgColor: 'from-purple-500/10 to-transparent border-purple-500/20', label: 'Planned', description: 'Officially announced with confirmed cast/crew.' },
  'Rumored': { icon: '👀', color: 'text-pink-400', bgColor: 'from-pink-500/10 to-transparent border-pink-500/20', label: 'Rumored', description: 'Unconfirmed reports from industry insiders.' },
  'Canceled': { icon: '❌', color: 'text-red-400', bgColor: 'from-red-500/10 to-transparent border-red-500/20', label: 'Canceled', description: 'Projects that were shelved or abandoned.' },
};

function formatDate(date: Date | null): string {
  if (!date) return 'TBA';
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function MovieSection({ title, movies, config }: { title: string; movies: UpcomingMovie[]; config: typeof statusConfig[string] }) {
  if (movies.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{config.icon}</span>
        <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">{title}</h2>
        <span className={`text-xs font-bold ${config.color} bg-zinc-900 px-3 py-1 rounded-full border border-white/5`}>
          {movies.length}
        </span>
      </div>
      <p className="text-xs font-bold text-zinc-500 mb-8 ml-10">{config.description}</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
        {movies.map(movie => (
          <Link
            key={movie.id}
            href={`/movies/${movie.slug}`}
            className="group relative"
          >
            <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-[1.03] group-hover:border-white/10">
              {movie.posterUrl ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w342${movie.posterUrl}`}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-950">
                  <Film className="w-10 h-10 text-zinc-800" />
                </div>
              )}

              {/* Status Badge */}
              <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10`}>
                <span className={`text-[9px] font-black uppercase tracking-widest ${config.color}`}>
                  {config.label}
                </span>
              </div>

              {/* Release Date */}
              {movie.releaseDate && (
                <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-md rounded-lg px-3 py-2 border border-white/10">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-zinc-400" />
                    <span className="text-[10px] font-bold text-white">{formatDate(movie.releaseDate)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 px-1">
              <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
                {movie.title}
              </h3>
              <p className="text-[10px] font-bold text-zinc-500 mt-0.5">{movie.year || 'TBA'}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function UpcomingPage() {
  const [postProduction, inProduction, planned, rumored, canceled, thisYear] = await Promise.all([
    getUpcomingByStatus('Post Production', 20),
    getUpcomingByStatus('In Production', 20),
    getUpcomingByStatus('Planned', 20),
    getUpcomingByStatus('Rumored', 15),
    getUpcomingByStatus('Canceled', 10),
    getReleasingThisYear(),
  ]);

  const totalUpcoming = postProduction.length + inProduction.length + planned.length + rumored.length;

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* ══════════════════════════════════════════════════════════ */}
      {/* HERO HEADER                                                */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-black to-orange-950/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />
        
        <div className="relative max-w-[1600px] mx-auto px-6 md:px-16 pt-28 md:pt-36 pb-12">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>→</span>
            <span className="text-blue-400">Upcoming</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none">
                  Upcoming
                </h1>
              </div>
              <p className="text-zinc-400 text-sm md:text-base font-medium max-w-xl leading-relaxed">
                Track every Telugu film in the pipeline — from first announcement to theater release. 
                <span className="text-blue-400 font-bold"> {totalUpcoming} movies</span> currently in development.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-3">
              {[
                { label: 'Post-Prod', count: postProduction.length, color: 'text-orange-400' },
                { label: 'Filming', count: inProduction.length, color: 'text-blue-400' },
                { label: 'Planned', count: planned.length, color: 'text-purple-400' },
                { label: 'Rumored', count: rumored.length, color: 'text-pink-400' },
              ].map(s => (
                <div key={s.label} className="bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-3 text-center">
                  <p className={`text-lg font-black ${s.color}`}>{s.count}</p>
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* RELEASING THIS YEAR                                        */}
      {/* ══════════════════════════════════════════════════════════ */}
      {thisYear.length > 0 && (
        <section className="max-w-[1600px] mx-auto px-6 md:px-16 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-5 h-5 text-emerald-500" />
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
              Releasing in {new Date().getFullYear()}
            </h2>
          </div>

          <div className="flex overflow-x-auto gap-4 pb-4 snap-x scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
            {thisYear.map(movie => (
              <Link
                key={movie.id}
                href={`/movies/${movie.slug}`}
                className="shrink-0 w-64 snap-start group"
              >
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 shadow-lg group-hover:shadow-emerald-500/10 group-hover:border-white/10 transition-all duration-300">
                  {movie.backdropUrl ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.backdropUrl}`}
                      alt={movie.title}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  ) : movie.posterUrl ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w342${movie.posterUrl}`}
                      alt={movie.title}
                      fill
                      className="object-cover opacity-80"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-950">
                      <Film className="w-8 h-8 text-zinc-800" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-sm font-black text-white line-clamp-1">{movie.title}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Calendar className="w-3 h-3 text-emerald-400" />
                      <span className="text-[10px] font-bold text-emerald-400">{formatDate(movie.releaseDate)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SECTIONS BY STATUS                                         */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-16">
        <MovieSection title="Post Production" movies={postProduction} config={statusConfig['Post Production']} />
        <MovieSection title="In Production" movies={inProduction} config={statusConfig['In Production']} />
        <MovieSection title="Planned" movies={planned} config={statusConfig['Planned']} />
        <MovieSection title="Rumored" movies={rumored} config={statusConfig['Rumored']} />
        {canceled.length > 0 && (
          <MovieSection title="Canceled" movies={canceled} config={statusConfig['Canceled']} />
        )}
      </div>
    </div>
  );
}
