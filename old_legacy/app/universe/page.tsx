import { Metadata } from 'next';
import Link from 'next/link';
import { FaUsers, FaFemale, FaFilm, FaMusic, FaCamera, FaPen, FaDrum, FaCut, FaPalette, FaMicrophone, FaTheaterMasks } from 'react-icons/fa';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Meet the TFI Universe | TFIverse',
  description: 'Explore 835+ Telugu cinema legends, heroes, heroines, directors, music directors, and more',
};

export default function UniversePage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative px-4 md:px-8 pt-32 pb-20 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-red-900/20 to-blue-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.15),transparent_50%)]" />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
          <div className="absolute w-96 h-96 bg-red-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000" />
          <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse delay-500" />
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl font-black mb-6">
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-white drop-shadow-[0_5px_15px_rgba(255,255,255,0.3)]">
              Meet the
            </span>
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-purple-500 to-blue-500" style={{
              textShadow: '0 10px 30px rgba(229, 9, 20, 0.5)'
            }}>
              TFI Universe
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
            Explore <span className="font-bold text-white">835+ people</span> who shaped Telugu cinema
            <br />
            <span className="text-white/60">From legendary icons to rising stars</span>
          </p>

          {/* Quick stats */}
          <div className="flex justify-center gap-4 flex-wrap">
            <div className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white">
              <span className="font-bold text-xl">135</span> Heroes
            </div>
            <div className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white">
              <span className="font-bold text-xl">80</span> Heroines
            </div>
            <div className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white">
              <span className="font-bold text-xl">100</span> Directors
            </div>
            <div className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white">
              <span className="font-bold text-xl">520+</span> Others
            </div>
          </div>
        </div>
      </section>

      {/* Main Categories Grid */}
      <section className="px-4 md:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <CategoriesGrid />
        </div>
      </section>

      <Footer />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CATEGORIES GRID COMPONENT
// ═══════════════════════════════════════════════════════════
function CategoriesGrid() {
  const categories = [
    {
      title: 'Heroes',
      icon: FaUsers,
      count: 135,
      subcategories: ['Legends (35)', 'Superstars (25)', 'Rising Stars (75)'],
      gradient: 'from-red-600/30 to-red-900/20',
      href: '/universe/heroes',
      emoji: '👑'
    },
    {
      title: 'Heroines',
      icon: FaFemale,
      count: 80,
      subcategories: ['Legends (20)', 'Leading Ladies (30)', 'New Gen (30)'],
      gradient: 'from-pink-600/30 to-pink-900/20',
      href: '/universe/heroines',
      emoji: '💃'
    },
    {
      title: 'Directors',
      icon: FaFilm,
      count: 100,
      subcategories: ['Legendary', 'Contemporary', 'Emerging'],
      gradient: 'from-purple-600/30 to-purple-900/20',
      href: '/universe/directors',
      emoji: '🎬'
    },
    {
      title: 'Music Directors',
      icon: FaMusic,
      count: 60,
      subcategories: ['Classical Era', 'Modern Masters', 'New Wave'],
      gradient: 'from-blue-600/30 to-blue-900/20',
      href: '/universe/music-directors',
      emoji: '🎵'
    },
    {
      title: 'Producers',
      icon: FaTheaterMasks,
      count: 50,
      subcategories: ['Production Houses', 'Independent'],
      gradient: 'from-emerald-600/30 to-emerald-900/20',
      href: '/universe/producers',
      emoji: '🎭'
    },
    {
      title: 'Comedians',
      icon: FaTheaterMasks,
      count: 50,
      subcategories: ['Legends', 'Contemporary'],
      gradient: 'from-yellow-600/30 to-yellow-900/20',
      href: '/universe/comedians',
      emoji: '😂'
    },
    {
      title: 'Villains',
      icon: FaTheaterMasks,
      count: 40,
      subcategories: ['Iconic', 'Character Artists'],
      gradient: 'from-gray-600/30 to-gray-900/20',
      href: '/universe/villains',
      emoji: '🦹'
    },
    {
      title: 'Character Artists',
      icon: FaUsers,
      count: 100,
      subcategories: ['Supporting Actors', 'Character Roles'],
      gradient: 'from-indigo-600/30 to-indigo-900/20',
      href: '/universe/character-artists',
      emoji: '🎭'
    },
    {
      title: 'Cinematographers',
      icon: FaCamera,
      count: 40,
      subcategories: ['Masters of Light', 'Modern Visionaries'],
      gradient: 'from-cyan-600/30 to-cyan-900/20',
      href: '/universe/cinematographers',
      emoji: '📸'
    },
    {
      title: 'Lyricists',
      icon: FaPen,
      count: 30,
      subcategories: ['Classical', 'Contemporary'],
      gradient: 'from-orange-600/30 to-orange-900/20',
      href: '/universe/lyricists',
      emoji: '✍️'
    },
    {
      title: 'Choreographers',
      icon: FaDrum,
      count: 20,
      subcategories: ['Dance Masters', 'Action Directors'],
      gradient: 'from-rose-600/30 to-rose-900/20',
      href: '/universe/choreographers',
      emoji: '💃'
    },
    {
      title: 'Editors',
      icon: FaCut,
      count: 20,
      subcategories: ['Masters of Montage'],
      gradient: 'from-teal-600/30 to-teal-900/20',
      href: '/universe/editors',
      emoji: '✂️'
    },
    {
      title: 'Art Directors',
      icon: FaPalette,
      count: 20,
      subcategories: ['Production Design Masters'],
      gradient: 'from-lime-600/30 to-lime-900/20',
      href: '/universe/art-directors',
      emoji: '🎨'
    },
    {
      title: 'Singers',
      icon: FaMicrophone,
      count: 60,
      subcategories: ['Playback Legends', 'Contemporary Voices'],
      gradient: 'from-violet-600/30 to-violet-900/20',
      href: '/universe/singers',
      emoji: '🎤'
    },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category, index) => (
        <Link
          key={category.title}
          href={category.href}
          className="group relative rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-300 hover:scale-105 overflow-hidden"
        >
          {/* Gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-50 group-hover:opacity-70 transition-opacity`} />
          
          {/* Content */}
          <div className="relative">
            {/* Icon & Emoji */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">{category.emoji}</div>
              <div className="text-2xl text-white/60 group-hover:text-white/80 transition">
                <category.icon />
              </div>
            </div>

            {/* Title & Count */}
            <h3 className="text-white text-2xl font-black mb-2">{category.title}</h3>
            <div className="text-white/60 text-sm font-semibold mb-3">
              {category.count} People
            </div>

            {/* Subcategories */}
            <div className="space-y-1 mb-4">
              {category.subcategories.map((sub, i) => (
                <div key={i} className="text-white/50 text-xs">
                  • {sub}
                </div>
              ))}
            </div>

            {/* Explore button */}
            <div className="inline-flex items-center gap-2 text-white/70 group-hover:text-white text-sm font-semibold group-hover:translate-x-1 transition">
              Explore
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>

          {/* Shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        </Link>
      ))}
    </div>
  );
}
