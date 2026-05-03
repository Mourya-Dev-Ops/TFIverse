import { db } from "@/lib/db";
import { people } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

// Define the valid categories to prevent routing to non-existent sections
const VALID_CATEGORIES: Record<string, { title: string, description: string, theme: string, accent: string, accentBg: string }> = {
  "heroes": { title: "Heroes", description: "The leading men who define the box office.", theme: "from-neutral-900 to-black", accent: "text-amber-500", accentBg: "bg-amber-500" },
  "heroines": { title: "Heroines", description: "The leading ladies who captivate the silver screen.", theme: "from-[#1a0f14] to-black", accent: "text-rose-500", accentBg: "bg-rose-500" },
  "directors": { title: "Directors", description: "The visionary captains steering the ship of cinema.", theme: "from-[#1a140a] to-black", accent: "text-blue-500", accentBg: "bg-blue-500" },
  "music-directors": { title: "Music Directors", description: "The maestros composing the heartbeat of TFI.", theme: "from-[#0a111a] to-black", accent: "text-purple-500", accentBg: "bg-purple-500" },
  "villains": { title: "Villains", description: "The iconic antagonists we love to hate.", theme: "from-neutral-900 to-black", accent: "text-red-600", accentBg: "bg-red-600" },
  "comedians": { title: "Comedians", description: "The kings and queens of comedy.", theme: "from-amber-900/20 to-black", accent: "text-yellow-500", accentBg: "bg-yellow-500" },
  "character-artists": { title: "Character Artists", description: "The versatile performers who bring life to every story.", theme: "from-zinc-900 to-black", accent: "text-teal-500", accentBg: "bg-teal-500" },
  "singers": { title: "Singers", description: "The voices behind the chartbusters.", theme: "from-blue-900/20 to-black", accent: "text-sky-500", accentBg: "bg-sky-500" },
  "producers": { title: "Producers", description: "The titans who fund the dreams.", theme: "from-green-900/20 to-black", accent: "text-emerald-500", accentBg: "bg-emerald-500" },
  "cinematographers": { title: "Cinematographers", description: "The eyes that capture the magic.", theme: "from-stone-900 to-black", accent: "text-stone-400", accentBg: "bg-stone-400" },
  "editors": { title: "Editors", description: "The invisible architects of storytelling.", theme: "from-zinc-900 to-black", accent: "text-zinc-400", accentBg: "bg-zinc-400" },
  "lyricists": { title: "Lyricists", description: "The poets of the silver screen.", theme: "from-slate-900 to-black", accent: "text-indigo-400", accentBg: "bg-indigo-400" },
  "choreographers": { title: "Choreographers", description: "The masters of dance and movement.", theme: "from-rose-900/20 to-black", accent: "text-pink-500", accentBg: "bg-pink-500" },
  "stunt-directors": { title: "Stunt Directors", description: "The choreographers of high-octane action.", theme: "from-red-900/20 to-black", accent: "text-orange-600", accentBg: "bg-orange-600" },
  "art-directors": { title: "Art Directors", description: "The creators of cinematic worlds.", theme: "from-yellow-900/20 to-black", accent: "text-amber-600", accentBg: "bg-amber-600" },
  "costume-designers": { title: "Costume Designers", description: "The stylists of the stars.", theme: "from-pink-900/20 to-black", accent: "text-fuchsia-500", accentBg: "bg-fuchsia-500" },
  "line-producers": { title: "Line Producers", description: "The operational backbone of productions.", theme: "from-zinc-900 to-black", accent: "text-gray-400", accentBg: "bg-gray-400" },
  "vfx-supervisors": { title: "VFX Supervisors", description: "The magicians of digital reality.", theme: "from-indigo-900/20 to-black", accent: "text-cyan-500", accentBg: "bg-cyan-500" },
  "pros": { title: "PROs", description: "The bridge between stars and the masses.", theme: "from-gray-900 to-black", accent: "text-neutral-400", accentBg: "bg-neutral-400" },
};

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = VALID_CATEGORIES[category];
  if (!cat) return { title: "Not Found" };
  return {
    title: `${cat.title} | The Archives | TFIverse`,
    description: cat.description,
  };
}

export default async function CategoryHubPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const categoryConfig = VALID_CATEGORIES[category];
  if (!categoryConfig) notFound();

  const dbCategoryMap: Record<string, string> = {
    "heroes": "hero",
    "heroines": "heroine",
    "directors": "director",
    "music-directors": "music-director",
    "villains": "villain",
    "comedians": "comedian",
    "character-artists": "character-artist",
    "singers": "singer",
    "producers": "producer",
    "cinematographers": "cinematographer",
    "editors": "editor",
    "lyricists": "lyricist",
    "choreographers": "choreographer",
    "stunt-directors": "stunt-director",
    "art-directors": "art-director",
    "costume-designers": "costume-designer",
    "line-producers": "line-producer",
    "vfx-supervisors": "vfx-supervisor",
    "pros": "pro",
  };
  
  const dbCategory = dbCategoryMap[category] || category;

  // OPTIMIZED QUERY
  const allPeople = await db.select({
    id: people.id,
    name: people.name,
    slug: people.slug,
    subcategory: people.subcategory,
    images: sql`${people.metadata}->'images'`,
    title: sql`${people.metadata}->>'title'`,
  }).from(people).where(eq(people.category, dbCategory));

  // Group by subcategory
  const grouped: Record<string, typeof allPeople> = {};
  for (const person of allPeople) {
    const sub = person.subcategory || "Other";
    if (!grouped[sub]) grouped[sub] = [];
    grouped[sub].push(person);
  }

  const sortedSubcategories = Object.keys(grouped).sort();

  return (
    <main className="min-h-screen bg-[#030303] text-white selection:bg-neutral-800 pb-32 relative overflow-hidden">
      {/* Background Ambient Glow & Noise */}
      <div className={`absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[800px] ${categoryConfig.accentBg} opacity-10 blur-[150px] rounded-full pointer-events-none`} />
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      {/* Massive Background Text for Cinematic Feel */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-full flex justify-center pointer-events-none select-none overflow-hidden opacity-[0.02] z-0">
        <h1 className="text-[25vw] font-black uppercase tracking-tighter leading-none whitespace-nowrap">
          {categoryConfig.title}
        </h1>
      </div>

      {/* Sleek Minimalist Navigation */}
      <div className="sticky top-0 z-50 px-6 md:px-12 py-6 flex items-center justify-between pointer-events-none">
        <Link href="/icons" className="pointer-events-auto group flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-all duration-300">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
            <FaArrowLeft className="transform group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="hidden md:block">Back to Archives</span>
        </Link>
        <div className="pointer-events-auto px-4 py-2 rounded-full border border-white/10 bg-black/50 backdrop-blur-md">
           <span className="text-[9px] font-black uppercase tracking-[0.3em] text-neutral-500">
             Directory // {categoryConfig.title}
           </span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative pt-20 pb-32 px-6 md:px-12 max-w-[1600px] mx-auto z-10 text-center flex flex-col items-center">
        <div className={`w-1px h-24 ${categoryConfig.accentBg} mb-8 opacity-50`} style={{ width: '1px' }} />
        <h1 className="text-6xl md:text-8xl lg:text-[130px] font-black tracking-tighter leading-[0.85] uppercase mb-8 z-10 relative">
          {categoryConfig.title}
        </h1>
        <p className="text-lg md:text-2xl text-neutral-400 max-w-2xl font-light tracking-wide">
          {categoryConfig.description}
        </p>
      </div>

      {/* Sections */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col gap-40 relative z-10">
        {sortedSubcategories.length === 0 ? (
           <div className="text-center py-32 border border-white/5 bg-white/[0.01] backdrop-blur-sm rounded-[2rem]">
             <p className="text-2xl font-black uppercase tracking-widest text-neutral-600">Awaiting Data</p>
           </div>
        ) : (
          sortedSubcategories.map((subcat, index) => {
            const isEven = index % 2 === 0;
            
            return (
              <section key={subcat} className="relative">
                {/* Premium Section Header */}
                <div className="flex flex-col items-center mb-16 relative">
                  <span className={`text-[10px] font-black uppercase tracking-[0.5em] mb-4 ${categoryConfig.accent}`}>
                    Section 0{index + 1}
                  </span>
                  <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500">
                    {subcat.replace(/-/g, ' ')}
                  </h2>
                  <div className="mt-8 flex items-center gap-4 w-full max-w-md">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-600">
                      {grouped[subcat].length} Icons
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </div>
                </div>

                {/* Staggered Masonry-ish Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                  {grouped[subcat].map((person: any, pIndex: number) => {
                    const portraitUrl = person.images?.portrait?.url || person.images?.avatar?.url;
                    
                    // The first item in the grid gets a special double-width layout
                    const isFeatured = pIndex === 0;
                    
                    return (
                      <Link 
                        href={`/icons/${category}/${person.subcategory}/${person.slug}`} 
                        key={person.id}
                        className={`group relative rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/5 block hover:border-white/20 transition-all duration-500 ${isFeatured ? 'col-span-2 md:col-span-2 lg:col-span-2 aspect-[16/10]' : 'col-span-1 md:col-span-1 lg:col-span-1 aspect-[3/4]'}`}
                      >
                        {/* 
                          We use a clever CSS trick to hide broken images.
                          'color: transparent' hides the alt text. 
                          The div underneath acts as a beautiful fallback.
                        */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#111] to-[#050505] z-0">
                           <span className={`${isFeatured ? 'text-9xl' : 'text-7xl'} font-black uppercase text-white/[0.03]`}>
                             {person.name.charAt(0)}
                           </span>
                        </div>

                        {portraitUrl && (
                          <img 
                            src={portraitUrl} 
                            alt={person.name} 
                            className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-105 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 z-10"
                            style={{ color: 'transparent' }} // hides alt text if broken
                          />
                        )}
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity z-20" />
                        
                        {/* Text Content */}
                        <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500 z-30">
                          <h3 className={`font-black uppercase tracking-tight mb-2 text-white ${isFeatured ? 'text-3xl md:text-5xl' : 'text-xl md:text-2xl'}`}>
                            {person.name}
                          </h3>
                          
                          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                            <div className={`w-8 h-px ${categoryConfig.accentBg}`} />
                            <p className={`font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs ${categoryConfig.accent}`}>
                              {person.title || "View Profile"}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })
        )}
      </div>
    </main>
  );
}
