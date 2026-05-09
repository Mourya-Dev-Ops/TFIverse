import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import peopleData from '@/data/people.json'; // Will use this after you generate

export const metadata: Metadata = {
  title: 'Telugu Heroes | TFIverse',
  description: 'Complete list of 135 Telugu cinema heroes from legends to rising stars',
};

export default function HeroesPage() {
  // TODO: Replace with actual data from people.json after generation
  const heroes = {
    legends: Array(35).fill(null).map((_, i) => ({
      id: i,
      name: `Legend ${i + 1}`,
      slug: `legend-${i + 1}`,
      title: 'Legend',
      portrait: '/images/placeholder.jpg'
    })),
    superstars: Array(25).fill(null).map((_, i) => ({
      id: i + 35,
      name: `Superstar ${i + 1}`,
      slug: `superstar-${i + 1}`,
      title: 'Superstar',
      portrait: '/images/placeholder.jpg'
    })),
    risingStars: Array(75).fill(null).map((_, i) => ({
      id: i + 60,
      name: `Rising Star ${i + 1}`,
      slug: `rising-star-${i + 1}`,
      title: 'Actor',
      portrait: '/images/placeholder.jpg'
    }))
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative px-4 md:px-8 pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-purple-900/20" />
        
        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-purple-500">
              Telugu Heroes
            </span>
          </h1>
          <p className="text-white/70 text-lg mb-8">
            135 heroes spanning three generations of Telugu cinema
          </p>

          {/* Category tabs */}
          <div className="flex gap-4 flex-wrap">
            <Link href="#legends" className="px-6 py-3 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 transition">
              👑 Legends (35)
            </Link>
            <Link href="#superstars" className="px-6 py-3 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 transition">
              ⭐ Superstars (25)
            </Link>
            <Link href="#rising" className="px-6 py-3 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 transition">
              🌟 Rising Stars (75)
            </Link>
          </div>
        </div>
      </section>

      {/* Legends Section */}
      <section id="legends" className="px-4 md:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-5xl">👑</span>
            <h2 className="text-3xl font-black text-white">Legends</h2>
            <span className="text-white/40">(35 Heroes)</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {heroes.legends.map(hero => (
              <HeroCard key={hero.id} hero={hero} />
            ))}
          </div>
        </div>
      </section>

      {/* Superstars Section */}
      <section id="superstars" className="px-4 md:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-5xl">⭐</span>
            <h2 className="text-3xl font-black text-white">Superstars</h2>
            <span className="text-white/40">(25 Heroes)</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {heroes.superstars.map(hero => (
              <HeroCard key={hero.id} hero={hero} />
            ))}
          </div>
        </div>
      </section>

      {/* Rising Stars Section */}
      <section id="rising" className="px-4 md:px-8 py-12 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-5xl">🌟</span>
            <h2 className="text-3xl font-black text-white">Rising Stars</h2>
            <span className="text-white/40">(75 Heroes)</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {heroes.risingStars.map(hero => (
              <HeroCard key={hero.id} hero={hero} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Hero Card Component
function HeroCard({ hero }: { hero: any }) {
  return (
    <Link
      href={`/hero/${hero.slug}`}
      className="group relative rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105"
    >
      {/* Portrait */}
      <div className="aspect-[3/4] relative overflow-hidden bg-white/10">
        <img
          src={hero.portrait}
          alt={hero.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
        
        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white font-bold text-sm line-clamp-2">{hero.name}</h3>
          {hero.title && (
            <p className="text-white/60 text-xs mt-1">{hero.title}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
