import { auth } from '@/lib/auth';
import Navbar from '@/components/layout/navbar';
import HomeClient from '@/components/home/home-client';
import Footer from '@/components/layout/footer';
import heroesData from '@/data/heroes.json';
import rumorsData from '@/data/rumors.json';
import upcomingData from '@/data/upcoming.json';

export const metadata = {
  title: 'TFiverse - The Home of Telugu Cinema',
  description: 'Everything Telugu cinema: Heroes, Movies, Box Office, Awards, OTT & More',
};

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-black">
      <Navbar user={session?.user} />

      {/* Hero Section - CINEMA SILVER */}
      <section className="relative px-6 md:px-12 pt-32 pb-20 overflow-hidden">
        
        {/* Parallax Background - CINEMA SILVER Gradient */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950/50 to-black"
          style={{ transform: 'translateZ(0)', willChange: 'transform' }}
        />
        
        {/* Silver Accent Blur - Subtle Premium Effect */}
        <div 
          className="absolute w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-[150px] top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 parallax-slow"
          style={{ willChange: 'transform' }}
        />

        {/* Premium Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        {/* Main Content */}
        <div className="relative max-w-5xl mx-auto text-center">
          {/* Main Headline - CINEMA SILVER */}
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none tracking-tight text-white animate-fade-in-up">
            The Home of
            <br />
            <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
              Telugu Cinema
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-white/50 mb-12 font-light animate-fade-in-up delay-500">
            Everything Telugu cinema — curated for fans
          </p>

          {/* CTA Button - CINEMA SILVER (White) */}
          <a
            href="/universe"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black hover:bg-white/90 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-2xl hover:shadow-white/20 hover:scale-105 active:scale-95 animate-fade-in-up delay-1000"
          >
            <span className="text-xl">🌟</span>
            Meet the TFI Universe
          </a>

          {/* Secondary Button Option */}
          <div className="mt-6 animate-fade-in-up delay-1000">
            <p className="text-white/40 text-sm mb-4">Or explore directly:</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <a
                href="/heroes"
                className="px-6 py-2 border border-white/[0.2] hover:border-white/[0.4] text-white/70 hover:text-white rounded-lg text-sm font-medium transition-all hover:bg-white/[0.05]"
              >
                👥 Heroes
              </a>
              <a
                href="/movies"
                className="px-6 py-2 border border-white/[0.2] hover:border-white/[0.4] text-white/70 hover:text-white rounded-lg text-sm font-medium transition-all hover:bg-white/[0.05]"
              >
                🎬 Movies
              </a>
              <a
                href="/tier-list"
                className="px-6 py-2 border border-white/[0.2] hover:border-white/[0.4] text-white/70 hover:text-white rounded-lg text-sm font-medium transition-all hover:bg-white/[0.05]"
              >
                🏆 Tier Lists
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Home Content - All Sections */}
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
