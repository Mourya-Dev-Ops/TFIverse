import Link from "next/link";
import { FaArrowRight, FaPenNib } from "react-icons/fa";

export const metadata = {
  title: "The Archives | TFIverse",
  description: "Explore the complete archives of the Telugu Film Industry.",
};

const MAIN_CATEGORIES = [
  { id: "heroes", name: "Heroes", tagline: "The Leading Men", image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070", cols: "col-span-1 md:col-span-8" },
  { id: "heroines", name: "Heroines", tagline: "The Leading Ladies", image: "https://images.unsplash.com/photo-1516528387618-afa90b13e000?q=80&w=2070", cols: "col-span-1 md:col-span-4" },
  { id: "directors", name: "Directors", tagline: "The Visionaries", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059", cols: "col-span-1 md:col-span-5" },
  { id: "music-directors", name: "Music Directors", tagline: "The Maestros", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070", cols: "col-span-1 md:col-span-7" },
];

const THE_CAST = [
  { id: "villains", name: "Villains", count: 28 },
  { id: "comedians", name: "Comedians", count: 14 },
  { id: "character-artists", name: "Character Artists", count: 32 },
  { id: "singers", name: "Singers", count: 18 },
];

const THE_CREW = [
  { id: "producers", name: "Producers" },
  { id: "cinematographers", name: "Cinematographers" },
  { id: "editors", name: "Editors" },
  { id: "lyricists", name: "Lyricists" },
  { id: "choreographers", name: "Choreographers" },
  { id: "stunt-directors", name: "Stunt Directors" },
  { id: "art-directors", name: "Art Directors" },
  { id: "costume-designers", name: "Costume Designers" },
  { id: "line-producers", name: "Line Producers" },
  { id: "vfx-supervisors", name: "VFX Supervisors" },
  { id: "pros", name: "PROs" },
];

export default function IconsHubPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-neutral-800 pb-32">
      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      {/* Cinematic Header */}
      <div className="relative pt-40 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.5em] text-neutral-500 mb-6 flex items-center gap-4">
            <span className="w-12 h-px bg-neutral-600 block" /> Directory 01
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-[140px] font-black tracking-tighter leading-[0.85] uppercase text-neutral-100">
            The<br />Archives
          </h1>
        </div>
        <div className="max-w-sm">
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed border-l border-white/10 pl-6 py-2">
            The definitive compendium of Telugu Cinema. Over 20 meticulously curated categories documenting the legendary talent that shapes our silver screen.
          </p>
        </div>
      </div>

      {/* 1. THE PILLARS (Bento Grid) */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-32 relative z-10">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500">The Pillars</h2>
          <div className="flex-1 h-px bg-white/5" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-auto md:h-[600px]">
          {MAIN_CATEGORIES.map((cat) => (
            <Link 
              href={`/icons/${cat.id}`} 
              key={cat.id} 
              className={`group relative rounded-3xl overflow-hidden min-h-[300px] md:min-h-0 ${cat.cols} bg-neutral-900 border border-white/5`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center grayscale opacity-30 transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-60"
                style={{ backgroundImage: `url(${cat.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
              
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase px-4 py-2 rounded-full border border-white/20 backdrop-blur-md">
                    Explore
                  </span>
                  <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    <FaArrowRight />
                  </div>
                </div>
                
                <div>
                  <p className="text-neutral-400 text-sm font-bold tracking-widest uppercase mb-2 group-hover:text-white transition-colors">{cat.tagline}</p>
                  <h3 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter uppercase">{cat.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-24 relative z-10">
        
        {/* 2. THE CAST */}
        <div>
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500">The Cast</h2>
            <div className="flex-1 h-px bg-white/5" />
          </div>
          
          <div className="flex flex-col gap-2">
            {THE_CAST.map((cat) => (
              <Link 
                href={`/icons/${cat.id}`} 
                key={cat.id} 
                className="group flex items-center justify-between py-6 px-8 rounded-2xl hover:bg-white/[0.03] transition-colors border border-transparent hover:border-white/5"
              >
                <h3 className="text-2xl md:text-4xl font-black tracking-tight uppercase group-hover:translate-x-4 transition-transform duration-500">
                  {cat.name}
                </h3>
                <div className="flex items-center gap-6">
                  <span className="text-neutral-600 font-mono text-sm">{cat.count} Profiles</span>
                  <FaArrowRight className="text-neutral-600 group-hover:text-white transition-colors group-hover:-rotate-45" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 3. THE CREW */}
        <div>
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500">The Crew</h2>
            <div className="flex-1 h-px bg-white/5" />
          </div>
          
          <div className="flex flex-wrap gap-3">
            {THE_CREW.map((cat) => (
              <Link 
                href={`/icons/${cat.id}`} 
                key={cat.id} 
                className="group relative px-6 py-4 rounded-full border border-white/10 hover:border-white bg-transparent hover:bg-white transition-all duration-300"
              >
                <span className="text-xs md:text-sm font-bold tracking-widest uppercase text-neutral-400 group-hover:text-black transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
          
          <div className="mt-16 p-8 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center justify-center text-center">
             <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-6">
               <FaPenNib className="text-xl text-neutral-400" />
             </div>
             <h4 className="text-lg font-bold uppercase tracking-widest mb-2">Contribute to the Archives</h4>
             <p className="text-sm text-neutral-500 max-w-sm mb-6">Help us document the unsung heroes of Telugu Cinema.</p>
             <button className="px-8 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-neutral-200 transition-colors">
               Submit Profile
             </button>
          </div>
        </div>
        
      </div>
    </main>
  );
}
