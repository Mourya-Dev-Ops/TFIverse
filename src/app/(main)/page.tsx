import { auth } from "@/auth";
import HomeClient from "@/components/home/home-client";
import HeroSequence from "@/components/home/hero-sequence";
import Footer from "@/components/layout/footer";
import Link from "next/link";

import heroesData from "@/data/heroes.json";
import rumorsData from "@/data/rumors.json";
import upcomingData from "@/data/upcoming.json";

import { db } from "@/lib/db";
import { rumors, movies, people } from "@/lib/schema";
import { eq } from "drizzle-orm";

export const metadata = {
  title: "TFiverse — The Home of Telugu Cinema",
  description: "Everything Telugu cinema: Heroes, Movies, Box Office, Awards, OTT & More",
};

export default async function HomePage() {
  const session = await auth();

  // Fetch from DB
  let dbHeroes: any[] = [];
  let dbRumors: any[] = [];
  let dbUpcoming: any[] = [];
  
  try {
    dbHeroes = await db.query.people.findMany({ where: eq(people.category, "Superstar") });
    dbRumors = await db.query.rumors.findMany();
    dbUpcoming = await db.query.movies.findMany({ where: eq(movies.status, "upcoming") });
  } catch (e) {
    console.error("Failed to fetch from DB", e);
  }

  // Fallback to JSON if DB tables are empty
  const finalHeroesData = dbHeroes.length > 0 
    ? dbHeroes.map(h => ({ id: h.id, slug: h.slug, name: h.name, ...(h.metadata as object) })) 
    : heroesData;

  const finalRumorsData = dbRumors.length > 0 ? dbRumors : rumorsData;
  
  const finalUpcomingData = dbUpcoming.length > 0 
    ? dbUpcoming.map(m => ({ slug: m.slug, title: m.title, status: "pre", ...(m.metadata as object) })) 
    : upcomingData;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">

      {/* ═══════════════════════════════════════════════════ */}
      {/*  CINEMATIC HERO — Scrollytelling Sequence         */}
      {/* ═══════════════════════════════════════════════════ */}
      <HeroSequence isAuthenticated={!!session} />

      {/* ═══════════════════════════════════════════════════ */}
      {/*  CLIENT SECTIONS                                   */}
      {/* ═══════════════════════════════════════════════════ */}
      <HomeClient
        heroesData={finalHeroesData as any}
        rumorsData={finalRumorsData as any}
        upcomingData={finalUpcomingData as any}
        isAuthenticated={!!session}
        userId={session?.user?.id}
      />

      <Footer />
    </div>
  );
}
