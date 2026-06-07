import { db } from '@/lib/db';
import { rumors } from '@/lib/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { Newspaper, Clock, ExternalLink, AlertTriangle, CheckCircle2, HelpCircle, Flame, TrendingUp } from 'lucide-react';

export const metadata = {
  title: 'Rumors & Trade Talk | TFIverse',
  description: 'The latest Telugu cinema industry rumors, trade buzz, casting news, and insider reports. Stay ahead of the game.',
};

const statusConfig: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  confirmed: { icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Confirmed' },
  rumor: { icon: <HelpCircle className="w-3.5 h-3.5" />, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', label: 'Rumor' },
  denied: { icon: <AlertTriangle className="w-3.5 h-3.5" />, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: 'Denied' },
  breaking: { icon: <Flame className="w-3.5 h-3.5" />, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', label: 'Breaking' },
  trending: { icon: <TrendingUp className="w-3.5 h-3.5" />, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Trending' },
};

function formatTimeAgo(date: Date | null): string {
  if (!date) return '';
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default async function RumorsPage() {
  const allRumors = await db.select()
    .from(rumors)
    .orderBy(desc(rumors.createdAt));

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* ══════════════════════════════════════════════════════════ */}
      {/* HERO HEADER                                                */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950/30 via-black to-red-950/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent" />
        
        <div className="relative max-w-[1600px] mx-auto px-6 md:px-16 pt-28 md:pt-36 pb-12">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>→</span>
            <span className="text-amber-400">Rumors & Trade</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Newspaper className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none">
                  Rumors & Trade
                </h1>
              </div>
              <p className="text-zinc-400 text-sm md:text-base font-medium max-w-xl leading-relaxed">
                The pulse of Telugu cinema — insider reports, casting news, deal updates, and 
                industry buzz. <span className="text-amber-400 font-bold">Unfiltered and raw</span>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* RUMORS FEED                                                */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="max-w-[900px] mx-auto px-6 md:px-16 mt-8">
        {allRumors.length > 0 ? (
          <div className="space-y-4">
            {allRumors.map((rumor, index) => {
              const config = statusConfig[rumor.status] || statusConfig['rumor'];
              return (
                <article
                  key={rumor.id}
                  className="group bg-zinc-900/40 border border-white/5 rounded-2xl p-6 md:p-8 hover:border-white/10 hover:bg-zinc-900/60 transition-all duration-300"
                >
                  {/* Status & Time */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${config.bg} ${config.color}`}>
                      {config.icon}
                      {config.label}
                    </span>
                    <div className="flex items-center gap-1.5 text-zinc-600">
                      <Clock className="w-3 h-3" />
                      <span className="text-[10px] font-bold">{formatTimeAgo(rumor.createdAt)}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-lg md:text-xl font-black text-white mb-3 leading-tight group-hover:text-amber-400 transition-colors">
                    {rumor.title}
                  </h2>

                  {/* Summary */}
                  <p className="text-sm text-zinc-400 font-medium leading-relaxed mb-4">
                    {rumor.summary}
                  </p>

                  {/* Source Link */}
                  {rumor.url && (
                    <a
                      href={rumor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      {rumor.source || 'Source'}
                    </a>
                  )}

                  {!rumor.url && rumor.source && (
                    <span className="text-xs font-bold text-zinc-600">
                      Source: {rumor.source}
                    </span>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-900/30 border border-white/5 rounded-3xl">
            <Newspaper className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
            <h3 className="text-lg font-black text-zinc-500 mb-2">No Rumors Yet</h3>
            <p className="text-sm text-zinc-600 font-medium max-w-md mx-auto">
              The industry is quiet... for now. Check back soon for the latest Telugu cinema trade buzz and insider reports.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
