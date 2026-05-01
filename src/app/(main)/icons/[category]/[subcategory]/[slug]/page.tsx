import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { people } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { FaInstagram, FaTwitter, FaFacebook, FaImdb, FaGlobe } from "react-icons/fa";
import { SiLetterboxd } from "react-icons/si";
import { MdLocationOn, MdDateRange } from "react-icons/md";
import dynamic from "next/dynamic";

// Thematic Configuration Engine
const THEMES: Record<string, any> = {
  hero: {
    accent: "text-neutral-100",
    bgPattern: "bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]", // Gritty cinematic texture
    bgGradient: "from-[#0a0a0a] via-[#111111] to-black",
    glowColor: "bg-white/10",
    badgeTheme: "bg-white/10 text-white border-white/20",
  },
  heroine: {
    accent: "text-rose-200",
    bgPattern: "bg-[url('https://www.transparenttextures.com/patterns/dust.png')]", // Soft elegant texture
    bgGradient: "from-[#1a0f14] via-[#0f0a0c] to-black",
    glowColor: "bg-rose-500/10",
    badgeTheme: "bg-rose-500/10 text-rose-200 border-rose-500/20",
  },
  director: {
    accent: "text-amber-400",
    bgPattern: "bg-[url('https://www.transparenttextures.com/patterns/film-grain.png')]", // Vintage film grain
    bgGradient: "from-[#1a140a] via-[#0f0c05] to-black",
    glowColor: "bg-amber-500/10",
    badgeTheme: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  "music-director": {
    accent: "text-blue-400",
    bgPattern: "bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]", 
    bgGradient: "from-[#0a111a] via-[#050a0f] to-black",
    glowColor: "bg-blue-500/10",
    badgeTheme: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  default: {
    accent: "text-white",
    bgPattern: "",
    bgGradient: "from-[#111] via-black to-black",
    glowColor: "bg-white/5",
    badgeTheme: "bg-white/10 text-white border-white/20",
  }
};

interface IconProfilePageProps {
  params: {
    category: string;
    subcategory: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: IconProfilePageProps) {
  const [person] = await db.select().from(people).where(eq(people.slug, params.slug));
  if (!person) return { title: "Not Found" };
  return {
    title: `${person.name} | TFIverse`,
    description: (person.metadata as any)?.bio?.substring(0, 150) + "...",
  };
}

export default async function IconProfilePage({ params }: IconProfilePageProps) {
  // Query Database
  const [person] = await db.select()
    .from(people)
    .where(
      and(
        eq(people.slug, params.slug),
        eq(people.category, params.category),
        eq(people.subcategory, params.subcategory)
      )
    );

  if (!person) notFound();

  const data = person.metadata as any;
  const theme = THEMES[params.category] || THEMES.default;
  
  // Safely extract deeply nested JSONB data
  const images = data.images || {};
  const personalInfo = data.personalInfo || {};
  const social = data.socialMedia || {};
  const heroAura = data.heroAura || {};

  return (
    <main className={`min-h-screen text-white selection:bg-neutral-800 ${theme.bgGradient} relative`}>
      {/* Dynamic Thematic Background Pattern */}
      <div className={`absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay ${theme.bgPattern}`} />
      
      {/* Cinematic Banner Area */}
      <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
        {images.banner?.url ? (
          <img src={images.banner.url} alt={`${person.name} Banner`} className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="w-full h-full bg-neutral-900" />
        )}
        <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent`} />
        
        {/* Title Lockup overlaying the banner bottom */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 z-20 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-end">
            {/* The Portrait Frame */}
            {images.portrait?.url && (
              <div className={`w-40 h-56 md:w-56 md:h-80 shrink-0 rounded-xl overflow-hidden border-2 border-white/10 shadow-2xl relative group`}>
                <img src={images.portrait.url} alt={person.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl pointer-events-none" />
              </div>
            )}
            
            {/* The Typography */}
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${theme.badgeTheme}`}>
                  {params.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-black/50 backdrop-blur-md border border-white/10`}>
                  {params.subcategory.replace('-', ' ')}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none mb-2">
                {person.name}
              </h1>
              {data.title && (
                <h2 className={`text-xl md:text-3xl font-bold tracking-widest uppercase ${theme.accent}`}>
                  {data.title}
                </h2>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout (Bento Grid Style) */}
      <div className="max-w-7xl mx-auto px-4 md:px-16 py-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Core Details (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Bio Glass Card */}
            <div className="glass-premium rounded-3xl p-8 md:p-10">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500 mb-6">Biography</h3>
              <p className="text-lg md:text-xl leading-relaxed text-neutral-200">
                {data.bio}
              </p>
            </div>

            {/* The Aura / Style (Category Specific Data) */}
            {heroAura.screenPresence && (
              <div className={`rounded-3xl p-8 md:p-10 border border-white/5 ${theme.glowColor}`}>
                <h3 className={`text-sm font-black uppercase tracking-[0.2em] mb-6 ${theme.accent}`}>The Aura</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-white mb-2 uppercase tracking-wider text-sm">Screen Presence</h4>
                    <p className="text-neutral-400 leading-relaxed text-sm">{heroAura.screenPresence}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2 uppercase tracking-wider text-sm">Signature Style</h4>
                    <p className="text-neutral-400 leading-relaxed text-sm">{heroAura.trademarkStyle || heroAura.signature}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Gallery Mini-Bento */}
            {images.gallery && images.gallery.length > 0 && (
              <div className="rounded-3xl overflow-hidden">
                 <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500 mb-6 px-2">Visual Archives</h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                   {images.gallery.slice(0, 3).map((imgUrl: string, idx: number) => (
                     <div key={idx} className={`aspect-[4/5] rounded-2xl overflow-hidden relative group`}>
                       <img src={imgUrl} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                       <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                     </div>
                   ))}
                 </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: Metadata & Stats (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Quick Stats Bento */}
            <div className="glass-premium rounded-3xl p-8">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500 mb-6">Data Packet</h3>
              <ul className="flex flex-col gap-4">
                {personalInfo.fullName && (
                  <li className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Full Name</span>
                    <span className="text-sm text-neutral-200">{personalInfo.fullName}</span>
                  </li>
                )}
                {personalInfo.birthDate && (
                  <li className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Born</span>
                    <span className="text-sm text-neutral-200">{personalInfo.birthDate} ({personalInfo.age} Years)</span>
                  </li>
                )}
                {personalInfo.birthPlace && (
                  <li className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Origin</span>
                    <span className="text-sm text-neutral-200">{personalInfo.birthPlace}</span>
                  </li>
                )}
                {personalInfo.careerStart?.debutYear && (
                  <li className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Active Since</span>
                    <span className="text-sm text-neutral-200">{personalInfo.careerStart.debutYear} ({personalInfo.careerStart.yearsActive} Years)</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Social Network */}
            <div className="glass-premium rounded-3xl p-8">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500 mb-6">Network</h3>
              <div className="flex flex-wrap gap-4">
                {social.instagram?.url && (
                  <a href={social.instagram.url} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/5 transition-colors">
                    <FaInstagram size={20} className={theme.accent} />
                  </a>
                )}
                {social.twitter?.url && (
                  <a href={social.twitter.url} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/5 transition-colors">
                    <FaTwitter size={20} className={theme.accent} />
                  </a>
                )}
                {data.imdbId && (
                  <a href={`https://www.imdb.com/name/${data.imdbId}`} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/5 transition-colors">
                    <FaImdb size={20} className="text-[#f5c518]" />
                  </a>
                )}
              </div>
            </div>

            {/* Admin Edit Prompt (for the future) */}
            <div className="mt-8 border border-white/10 rounded-2xl p-6 text-center border-dashed">
               <p className="text-xs text-neutral-500 uppercase tracking-widest mb-3">Notice an error?</p>
               <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs font-bold transition-colors">
                 Submit Edit Request
               </button>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
