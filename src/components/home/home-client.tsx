"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ChevronRight, ChevronLeft, Globe, TrendingUp, DollarSign,
  Clapperboard, Trophy, Calendar, Play, Cake, Tv, Laugh, Images,
  Heart, PenLine, AlertCircle, ArrowRight, Flame, RotateCcw
} from "lucide-react";

type Hero = { id: number; slug: string; name: string; title?: string; birthDate?: string; portraitUrl?: string; bannerUrl?: string; featuredUrl?: string; featured?: boolean; movies?: any[] };
type Rumor = { id: string; title: string; summary: string; status: "discussion" | "trade" | "confirmed"; source: string };
type Upcoming = { slug: string; title: string; status: "pre" | "filming" | "post"; date?: string; poster?: string };

const IMG_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600' fill='%23111'%3E%3Crect width='400' height='600'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23333' font-family='system-ui' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";
const fade = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-80px" }, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } as any };

interface HomeClientProps {
  heroesData: Hero[];
  rumorsData: Rumor[];
  upcomingData: Upcoming[];
  isAuthenticated: boolean;
  userId?: string;
}

export default function HomeClient({ heroesData, rumorsData, upcomingData, isAuthenticated, userId }: HomeClientProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const t = query.toLowerCase();
    return heroesData.filter(h => h.name.toLowerCase().includes(t)).slice(0, 4).map(h => ({ label: h.name, sub: h.title || "Hero", href: `/hero/${h.slug}` }));
  }, [query, heroesData]);

  return (
    <div className="relative">

      {/* Global ambient glow behind content */}
      <div className="absolute top-[400px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-amber-500/[0.015] blur-[200px] pointer-events-none" />
      <div className="absolute top-[2000px] left-1/4 w-[600px] h-[600px] rounded-full bg-blue-500/[0.01] blur-[180px] pointer-events-none" />
      <div className="absolute top-[3500px] right-1/4 w-[500px] h-[500px] rounded-full bg-purple-500/[0.01] blur-[160px] pointer-events-none" />

      {/* ══════ SEARCH ══════ */}
      <section className="px-6 md:px-10 lg:px-16 pt-24 pb-12 relative">
        <motion.div {...fade} className="max-w-2xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-white/[0.06] via-white/[0.02] to-white/[0.06] rounded-3xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 z-10" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search heroes, movies…"
              className="relative w-full pl-14 pr-6 py-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-white placeholder:text-white/20 outline-none focus:border-white/[0.15] focus:bg-white/[0.05] transition-all text-[15px] font-medium shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            />
          </div>
          <AnimatePresence>
            {results.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="mt-3 rounded-2xl bg-[#0a0a0a] border border-white/[0.08] overflow-hidden shadow-2xl">
                {results.map((r, i) => (
                  <Link key={i} href={r.href} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.04] transition border-b border-white/[0.04] last:border-0 group">
                    <div>
                      <p className="text-white font-semibold text-[15px]">{r.label}</p>
                      <p className="text-white/30 text-xs mt-0.5">{r.sub}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/15 group-hover:text-white/50 transition" />
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>



      {/* ══════ EXPLORE GRID ══════ */}
      <section className="px-6 md:px-10 lg:px-16 py-8">
        <motion.div {...fade} className="max-w-7xl mx-auto">
          <SectionHead label="Explore" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <NavCard href="/icons" icon={Globe} title="The Icons" sub="The cinematic universe" />
            <NavCard href="/box-office" icon={DollarSign} title="Box Office" sub="Collections & records" />
            <NavCard href="/re-releases" icon={RotateCcw} title="Re-releases" sub="Classics return" />
            <NavCard href="/movies" icon={Clapperboard} title="Movies" sub="Browse the database" />
          </div>
        </motion.div>
      </section>

      {/* ══════ LATEST UPDATES ══════ */}
      <LatestUpdates />

      {/* ══════ NEW ON OTT ══════ */}
      <OTTReleases />

      {/* ══════ UPCOMING + RUMORS ══════ */}
      <section className="px-6 md:px-10 lg:px-16 py-8">
        <motion.div {...fade} className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6">
          <UpcomingPanel items={upcomingData} />
          <RumorsPanel items={rumorsData} />
        </motion.div>
      </section>

      {/* ══════ COMMUNITY ══════ */}
      <section className="px-6 md:px-10 lg:px-16 py-8">
        <motion.div {...fade} className="max-w-7xl mx-auto">
          <SectionHead label="Community" />
          <div className="grid md:grid-cols-3 gap-4">
            <NavCard href="/tier-list" icon={Trophy} title="Tier Lists" sub="Rank your favorites" tall />
            <NavCard href="/memes" icon={Laugh} title="Memes" sub="TFI's funniest" tall />
            <NavCard href="/calendar/2025" icon={Calendar} title="2025 Calendar" sub="What's dropping" tall />
          </div>
        </motion.div>
      </section>

      {/* ══════ CULTURE — Memes + Gallery ══════ */}
      <section className="px-6 md:px-10 lg:px-16 py-8">
        <motion.div {...fade} className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
          <GalleryCard icon={Laugh} title="Meme Portal" href="/memes" cta="Browse Memes" />
          <GalleryCard icon={Images} title="Fan Gallery" href="/fan-gallery" cta="View Gallery" />
        </motion.div>
      </section>

      {/* ══════ FAN ZONE + DIARY ══════ */}
      <section className="px-6 md:px-10 lg:px-16 py-8">
        <motion.div {...fade} className="max-w-7xl mx-auto grid md:grid-cols-[1.5fr_1fr] gap-6">
          <FanZone />
          <DiaryCard isAuth={isAuthenticated} />
        </motion.div>
      </section>

      {/* ══════ CORRECTIONS ══════ */}
      <section className="px-6 md:px-10 lg:px-16 py-16">
        <motion.div {...fade} className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <AlertCircle className="w-5 h-5 text-white/20 hidden sm:block flex-shrink-0" />
            <div>
              <p className="text-white/70 text-sm font-semibold">Notice an error?</p>
              <p className="text-white/30 text-xs mt-0.5">Help us keep the database accurate.</p>
            </div>
          </div>
          <Link href="/contact" className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white border border-white/10 hover:border-white/20 px-6 py-2.5 rounded-full transition-all whitespace-nowrap">
            Submit
          </Link>
        </motion.div>
      </section>

    </div>
  );
}

/* ═══════════════════════════════════════════ */
/* SHARED COMPONENTS */
/* ═══════════════════════════════════════════ */

function SectionHead({ label, href }: { label: string; href?: string }) {
  return (
    <div className="flex items-center justify-between mb-10">
      <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{label}</h2>
      {href && (
        <Link href={href} className="text-[11px] font-semibold text-white/30 hover:text-white/70 uppercase tracking-[0.2em] transition-colors flex items-center gap-1.5">
          View All <ChevronRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
}

function NavCard({ href, icon: Icon, title, sub, tall }: { href: string; icon: any; title: string; sub?: string; tall?: boolean }) {
  return (
    <Link href={href} className={`glow-card group flex flex-col justify-between rounded-2xl p-7 ${tall ? 'min-h-[200px]' : 'min-h-[160px]'} glass-premium relative overflow-hidden`}>
      <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-white/[0.03] blur-2xl group-hover:bg-white/[0.06] transition-colors duration-700" />
      <Icon className="w-6 h-6 text-white/30 group-hover:text-white/60 transition-colors duration-500 relative z-10" />
      <div className="mt-auto relative z-10">
        <h3 className="text-white font-bold text-lg tracking-tight">{title}</h3>
        {sub && <p className="text-white/25 text-[11px] mt-1.5 font-medium tracking-wide">{sub}</p>}
      </div>
    </Link>
  );
}

function GalleryCard({ icon: Icon, title, href, cta }: { icon: any; title: string; href: string; cta: string }) {
  return (
    <div className="rounded-2xl p-8 glass-premium">
      <div className="flex items-center gap-3 mb-8">
        <Icon className="w-5 h-5 text-white/40" />
        <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="aspect-square rounded-xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.04] flex items-center justify-center">
            <Icon className="w-5 h-5 text-white/10" />
          </div>
        ))}
      </div>
      <Link href={href} className="block text-center py-3 rounded-xl border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 transition-all text-[11px] font-bold uppercase tracking-[0.2em]">
        {cta}
      </Link>
    </div>
  );
}

function FanZone() {
  const fans = [
    { name: "Rajesh", quote: "Devara BGM gave me chills 🔥" },
    { name: "Sneha", quote: "Can't wait for Pushpa 2 trailer!" },
    { name: "Kiran", quote: "TFI domination incoming 💪" },
  ];
  return (
    <div className="rounded-2xl p-8 glass-premium">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-5 h-5 text-white/40" />
        <h3 className="text-xl font-bold text-white tracking-tight">Fan Zone</h3>
      </div>
      <div className="space-y-4">
        {fans.map((f, i) => (
          <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="w-9 h-9 rounded-full bg-white/[0.08] flex items-center justify-center text-[11px] font-bold text-white/50 flex-shrink-0">{f.name[0]}</div>
            <div>
              <p className="text-white/60 text-sm font-medium">{f.name}</p>
              <p className="text-white/30 text-xs mt-1 italic leading-relaxed">"{f.quote}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiaryCard({ isAuth }: { isAuth: boolean }) {
  return (
    <div className="rounded-2xl p-8 glass-premium flex flex-col items-center justify-center text-center">
      <PenLine className="w-8 h-8 text-white/20 mb-6" />
      <h3 className="text-xl font-bold text-white tracking-tight mb-3">Movie Diary</h3>
      <p className="text-white/30 text-sm mb-8 max-w-[220px] leading-relaxed">Log watches, rate films, and build your profile.</p>
      <Link href={isAuth ? "/profile" : "/login"} className={`px-8 py-3 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] transition-all ${isAuth ? "bg-white text-black hover:bg-white/90" : "border border-white/15 text-white/50 hover:text-white hover:border-white/30"}`}>
        {isAuth ? "Open Diary" : "Sign In"}
      </Link>
    </div>
  );
}

function UpcomingPanel({ items }: { items: Upcoming[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d: "l" | "r") => ref.current?.scrollBy({ left: d === "l" ? -260 : 260, behavior: "smooth" });

  return (
    <div className="rounded-2xl p-8 glass">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-white tracking-tight">Upcoming</h3>
        <div className="flex gap-1.5">
          <button onClick={() => scroll("l")} className="w-8 h-8 rounded-full border border-white/[0.08] hover:border-white/20 flex items-center justify-center transition"><ChevronLeft className="w-3.5 h-3.5 text-white/50" /></button>
          <button onClick={() => scroll("r")} className="w-8 h-8 rounded-full border border-white/[0.08] hover:border-white/20 flex items-center justify-center transition"><ChevronRight className="w-3.5 h-3.5 text-white/50" /></button>
        </div>
      </div>
      <div ref={ref} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
        {items.map(m => (
          <div key={m.slug} className="flex-shrink-0 w-[150px] group cursor-pointer snap-start">
            <div className="relative rounded-xl overflow-hidden h-[225px] mb-3">
              <img src={m.poster || IMG_FALLBACK} alt={m.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <span className="absolute top-2.5 left-2.5 text-[9px] font-bold uppercase tracking-widest text-white/70 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/[0.08]">
                {m.status === "filming" ? "Filming" : m.status === "pre" ? "Pre-Prod" : "Post"}
              </span>
            </div>
            <h4 className="text-white/80 font-semibold text-sm leading-tight line-clamp-2">{m.title}</h4>
            {m.date && <p className="text-white/25 text-[10px] mt-1 font-medium">{new Date(m.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function RumorsPanel({ items }: { items: Rumor[] }) {
  return (
    <div className="rounded-2xl p-8 glass-premium flex flex-col">
      <h3 className="text-xl font-bold text-white tracking-tight mb-8">Rumors & Trades</h3>
      <div className="flex-1 space-y-3 max-h-[380px] overflow-y-auto scrollbar-hide pr-1">
        {items.map(r => (
          <div key={r.id} className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1] transition-all">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h4 className="text-white/80 font-semibold text-sm leading-snug line-clamp-2">{r.title}</h4>
              <span className={`text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full font-bold flex-shrink-0 border ${r.status === "confirmed" ? "bg-white/10 text-white/80 border-white/20" : "bg-white/[0.04] text-white/40 border-white/[0.08]"}`}>
                {r.status}
              </span>
            </div>
            <p className="text-white/30 text-xs leading-relaxed line-clamp-2">{r.summary}</p>
            <p className="text-white/15 text-[10px] mt-3 font-semibold uppercase tracking-widest">{r.source}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LatestUpdates() {
  const news = [
    { id: "1", type: "trailer", title: "Salaar Part 2 — Official Trailer", desc: "The much-awaited sequel trailer drops with intense action sequences.", thumb: IMG_FALLBACK },
    { id: "2", type: "teaser", title: "Game Changer Teaser", desc: "Ram Charan's political thriller gets its first look.", thumb: IMG_FALLBACK },
    { id: "3", type: "announcement", title: "NTR 31 Announcement", desc: "Koratala Siva confirmed to direct Jr NTR's next project.", thumb: IMG_FALLBACK },
  ];

  return (
    <section className="px-6 md:px-10 lg:px-16 py-8">
      <motion.div {...fade} className="max-w-7xl mx-auto">
        <SectionHead label="Latest Updates" />
        <div className="grid md:grid-cols-3 gap-5">
          {news.map(n => (
            <div key={n.id} className="glow-card group rounded-2xl overflow-hidden glass-premium">
              <div className="relative h-44 overflow-hidden">
                <img src={n.thumb} alt={n.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" onError={e => ((e.target as HTMLImageElement).src = IMG_FALLBACK)} />
                <span className="absolute top-3 left-3 text-[9px] font-bold uppercase tracking-widest text-white/80 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/[0.08]">
                  {n.type}
                </span>
              </div>
              <div className="p-5">
                <h4 className="text-white/80 font-bold text-[15px] leading-snug mb-2 group-hover:text-white transition">{n.title}</h4>
                <p className="text-white/30 text-xs line-clamp-2">{n.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function OTTReleases() {
  const items = [
    { id: "1", title: "Salaar", platform: "Netflix", poster: IMG_FALLBACK, date: "2025-10-15", slug: "salaar" },
    { id: "2", title: "Hi Nanna", platform: "Netflix", poster: IMG_FALLBACK, date: "2025-10-20", slug: "hi-nanna" },
    { id: "3", title: "Extra Ordinary Man", platform: "Prime", poster: IMG_FALLBACK, date: "2025-10-22", slug: "extra-ordinary-man" },
    { id: "4", title: "Tiger Nageswara Rao", platform: "Hotstar", poster: IMG_FALLBACK, date: "2025-10-18", slug: "tiger-nageswara-rao" },
  ];
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d: "l" | "r") => ref.current?.scrollBy({ left: d === "l" ? -280 : 280, behavior: "smooth" });

  return (
    <section className="px-6 md:px-10 lg:px-16 py-8">
      <motion.div {...fade} className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <Tv className="w-5 h-5 text-white/40" />
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">New on OTT</h2>
          </div>
          <div className="flex gap-1.5">
            <button onClick={() => scroll("l")} className="w-8 h-8 rounded-full border border-white/[0.08] hover:border-white/20 flex items-center justify-center transition"><ChevronLeft className="w-3.5 h-3.5 text-white/50" /></button>
            <button onClick={() => scroll("r")} className="w-8 h-8 rounded-full border border-white/[0.08] hover:border-white/20 flex items-center justify-center transition"><ChevronRight className="w-3.5 h-3.5 text-white/50" /></button>
          </div>
        </div>
        <div ref={ref} className="flex gap-5 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
          {items.map(m => (
            <Link key={m.id} href={`/movie/${m.slug}`} className="flex-shrink-0 w-[170px] group block snap-start">
              <div className="relative rounded-2xl overflow-hidden h-[255px] mb-3">
                <img src={m.poster || IMG_FALLBACK} alt={m.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" onError={e => ((e.target as HTMLImageElement).src = IMG_FALLBACK)} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <span className="absolute top-2.5 left-2.5 text-[9px] font-bold uppercase tracking-widest text-white/70 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/[0.08]">{m.platform}</span>
              </div>
              <h4 className="text-white/80 font-semibold text-sm leading-tight line-clamp-1">{m.title}</h4>
              <p className="text-white/25 text-[10px] mt-1 font-medium">{new Date(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
            </Link>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
