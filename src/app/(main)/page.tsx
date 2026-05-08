import { auth } from "@/auth";
import HomeClient from "@/components/home/home-client";
import HeroSequence from "@/components/home/hero-sequence";
import Footer from "@/components/layout/footer";
import Link from "next/link";

import { db } from "@/lib/db";
import { rumors, movies, people } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const metadata = {
  title: "TFiverse — The Home of Telugu Cinema",
  description: "Everything Telugu cinema: Heroes, Movies, Box Office, Awards, OTT & More",
};

// ============================================================================
// CACHED DATA FETCHERS — Single Source of Truth: PostgreSQL
// ============================================================================

const getHomeHeroes = unstable_cache(
  async () => {
    const dbHeroes = await db.query.people.findMany({ where: eq(people.category, "hero") });
    return dbHeroes.map(h => ({ id: h.id, slug: h.slug, name: h.name, ...(h.metadata as object) }));
  },
  ['home-heroes-v2'],
  { revalidate: 3600, tags: ['heroes-v2'] }
);

const getHomeRumors = unstable_cache(
  async () => {
    return await db.query.rumors.findMany();
  },
  ['home-rumors'],
  { revalidate: 1800, tags: ['rumors'] }
);

const getUpcomingMovies = unstable_cache(
  async () => {
    const dbUpcoming = await db.query.movies.findMany({ where: eq(movies.status, "upcoming") });
    return dbUpcoming.map(m => ({ slug: m.slug, title: m.title, status: "pre", ...(m.metadata as object) }));
  },
  ['home-upcoming-v2'],
  { revalidate: 3600, tags: ['upcoming-v2'] }
);

export default async function HomePage() {
  const session = await auth();

  // Parallel DB fetches with error resilience
  const [heroesData, rumorsData, upcomingData] = await Promise.all([
    getHomeHeroes().catch(() => []),
    getHomeRumors().catch(() => []),
    getUpcomingMovies().catch(() => []),
  ]);

  return (
    <div className="flex-1 flex flex-col bg-black text-white selection:bg-white selection:text-black">
      <div className="flex-1">
        {/* ═══════════════════════════════════════════════════ */}
        {/*  CINEMATIC HERO — Scrollytelling Sequence         */}
        {/* ═══════════════════════════════════════════════════ */}
        <HeroSequence isAuthenticated={!!session} />

        {/* ═══════════════════════════════════════════════════ */}
        {/*  CLIENT SECTIONS                                   */}
        {/* ═══════════════════════════════════════════════════ */}
        <HomeClient
          heroesData={heroesData as any}
          rumorsData={rumorsData as any}
          upcomingData={upcomingData as any}
          isAuthenticated={!!session}
          userId={session?.user?.id}
        />
      </div>

      <Footer />
    </div>
  );
}
