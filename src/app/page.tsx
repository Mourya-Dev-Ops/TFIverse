import { auth } from "@/auth";
import HomeClient from "@/components/home/home-client";
import HeroSequence from "@/components/home/hero-sequence";
import Footer from "@/components/layout/footer";
import Link from "next/link";

import heroesData from "@/data/heroes.json";
import rumorsData from "@/data/rumors.json";
import upcomingData from "@/data/upcoming.json";

export const metadata = {
  title: "TFiverse — The Home of Telugu Cinema",
  description: "Everything Telugu cinema: Heroes, Movies, Box Office, Awards, OTT & More",
};

export default async function HomePage() {
  const session = await auth();

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
        heroesData={heroesData}
        rumorsData={rumorsData}
        upcomingData={upcomingData}
        isAuthenticated={!!session}
        userId={session?.user?.id}
      />

      <Footer />
    </div>
  );
}
