import Link from "next/link";
import { FaStar, FaFilm, FaMusic, FaCamera, FaMask, FaLaugh, FaUsers, FaMicrophone, FaBriefcase, FaCut, FaPenNib, FaShoePrints, FaFistRaised, FaPalette, FaTshirt, FaClipboardList, FaBullhorn, FaDesktop } from "react-icons/fa";

export const metadata = {
  title: "The Icons | TFIverse",
  description: "Explore the complete archives of the Telugu Film Industry.",
};

const MAIN_CATEGORIES = [
  { id: "heroes", name: "Heroes", icon: <FaStar className="text-yellow-500" />, image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070", colSpan: "md:col-span-2 lg:col-span-2" },
  { id: "heroines", name: "Heroines", icon: <FaStar className="text-rose-400" />, image: "https://images.unsplash.com/photo-1516528387618-afa90b13e000?q=80&w=2070", colSpan: "md:col-span-2 lg:col-span-2" },
  { id: "directors", name: "Directors", icon: <FaFilm className="text-amber-500" />, image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059", colSpan: "md:col-span-2 lg:col-span-2" },
  { id: "music-directors", name: "Music Directors", icon: <FaMusic className="text-blue-500" />, image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070", colSpan: "md:col-span-2 lg:col-span-2" },
];

const THE_CAST = [
  { id: "villains", name: "Villains", icon: <FaMask /> },
  { id: "comedians", name: "Comedians", icon: <FaLaugh /> },
  { id: "character-artists", name: "Character Artists", icon: <FaUsers /> },
  { id: "singers", name: "Singers", icon: <FaMicrophone /> },
];

const THE_CREW = [
  { id: "producers", name: "Producers", icon: <FaBriefcase /> },
  { id: "cinematographers", name: "Cinematographers", icon: <FaCamera /> },
  { id: "editors", name: "Editors", icon: <FaCut /> },
  { id: "lyricists", name: "Lyricists", icon: <FaPenNib /> },
  { id: "choreographers", name: "Choreographers", icon: <FaShoePrints /> },
  { id: "stunt-directors", name: "Stunt Directors", icon: <FaFistRaised /> },
  { id: "art-directors", name: "Art Directors", icon: <FaPalette /> },
  { id: "costume-designers", name: "Costume Designers", icon: <FaTshirt /> },
  { id: "line-producers", name: "Line Producers", icon: <FaClipboardList /> },
  { id: "vfx-supervisors", name: "VFX Supervisors", icon: <FaDesktop /> },
  { id: "pros", name: "PROs", icon: <FaBullhorn /> },
];

export default function IconsHubPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-neutral-800 pb-24 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-16 relative z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 uppercase">
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-600">Archives</span>
        </h1>
        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto font-medium">
          Discover the complete compendium of Telugu Cinema. Over 20 categories documenting the legendary talent in front of and behind the camera.
        </p>
      </div>

      {/* 1. THE PILLARS (Big Cards) */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-16 relative z-10">
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2">The Pillars</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6">
          {MAIN_CATEGORIES.map((cat) => (
            <Link href={`/icons/${cat.id}`} key={cat.id} className={`group relative h-[350px] md:h-[450px] rounded-[2rem] overflow-hidden glass-premium block ${cat.colSpan}`}>
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110 opacity-40 group-hover:opacity-60"
                style={{ backgroundImage: `url(${cat.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-[#0a0a0a] pointer-events-none" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/10 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h3 className="text-3xl md:text-4xl font-black tracking-tight uppercase mb-1">{cat.name}</h3>
                <p className="text-neutral-400 text-xs font-bold tracking-widest uppercase">Explore Database &rarr;</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 2. THE CAST */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-16 relative z-10">
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2">The Cast</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {THE_CAST.map((cat) => (
            <Link href={`/icons/${cat.id}`} key={cat.id} className="group relative h-[180px] rounded-3xl overflow-hidden glass-premium flex flex-col items-center justify-center text-center p-6 border border-white/5 hover:border-white/20 transition-all hover:bg-white/[0.02]">
              <div className="text-white/40 group-hover:text-white transition-colors mb-4 text-3xl">
                {cat.icon}
              </div>
              <h3 className="text-lg font-black tracking-tight uppercase group-hover:text-white transition-colors">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. THE CREW */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2">Behind The Camera</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {THE_CREW.map((cat) => (
            <Link href={`/icons/${cat.id}`} key={cat.id} className="group relative py-6 px-4 rounded-2xl glass-premium flex flex-col items-center justify-center text-center border border-white/5 hover:border-white/20 transition-all hover:bg-white/[0.02]">
              <div className="text-white/30 group-hover:text-white transition-colors mb-3 text-xl">
                {cat.icon}
              </div>
              <h3 className="text-[11px] font-bold tracking-widest uppercase text-neutral-400 group-hover:text-white transition-colors">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
