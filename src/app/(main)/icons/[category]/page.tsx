import { db } from "@/lib/db";
import { people } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

// Define the valid categories to prevent routing to non-existent sections
const VALID_CATEGORIES: Record<string, { title: string, description: string, theme: string, accent: string }> = {
  "heroes": { title: "Heroes", description: "The leading men who define the box office.", theme: "from-neutral-900 to-black", accent: "text-neutral-100" },
  "heroines": { title: "Heroines", description: "The leading ladies who captivate the silver screen.", theme: "from-[#1a0f14] to-black", accent: "text-rose-200" },
  "directors": { title: "Directors", description: "The visionary captains steering the ship of cinema.", theme: "from-[#1a140a] to-black", accent: "text-amber-400" },
  "music-directors": { title: "Music Directors", description: "The maestros composing the heartbeat of TFI.", theme: "from-[#0a111a] to-black", accent: "text-blue-400" },
  "villains": { title: "Villains", description: "The iconic antagonists we love to hate.", theme: "from-neutral-900 to-black", accent: "text-red-500" },
  "comedians": { title: "Comedians", description: "The kings and queens of comedy.", theme: "from-amber-900/20 to-black", accent: "text-yellow-400" },
  "character-artists": { title: "Character Artists", description: "The versatile performers who bring life to every story.", theme: "from-zinc-900 to-black", accent: "text-zinc-300" },
  "singers": { title: "Singers", description: "The voices behind the chartbusters.", theme: "from-blue-900/20 to-black", accent: "text-sky-300" },
  "producers": { title: "Producers", description: "The titans who fund the dreams.", theme: "from-green-900/20 to-black", accent: "text-emerald-400" },
  "cinematographers": { title: "Cinematographers", description: "The eyes that capture the magic.", theme: "from-stone-900 to-black", accent: "text-stone-300" },
  "editors": { title: "Editors", description: "The invisible architects of storytelling.", theme: "from-zinc-900 to-black", accent: "text-zinc-400" },
  "lyricists": { title: "Lyricists", description: "The poets of the silver screen.", theme: "from-slate-900 to-black", accent: "text-slate-300" },
  "choreographers": { title: "Choreographers", description: "The masters of dance and movement.", theme: "from-rose-900/20 to-black", accent: "text-rose-400" },
  "stunt-directors": { title: "Stunt Directors", description: "The choreographers of high-octane action.", theme: "from-red-900/20 to-black", accent: "text-red-600" },
  "art-directors": { title: "Art Directors", description: "The creators of cinematic worlds.", theme: "from-yellow-900/20 to-black", accent: "text-yellow-500" },
  "costume-designers": { title: "Costume Designers", description: "The stylists of the stars.", theme: "from-pink-900/20 to-black", accent: "text-pink-400" },
  "line-producers": { title: "Line Producers", description: "The operational backbone of productions.", theme: "from-zinc-900 to-black", accent: "text-zinc-400" },
  "vfx-supervisors": { title: "VFX Supervisors", description: "The magicians of digital reality.", theme: "from-indigo-900/20 to-black", accent: "text-indigo-400" },
  "pros": { title: "PROs", description: "The bridge between stars and the masses.", theme: "from-gray-900 to-black", accent: "text-gray-300" },
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
    <main className={`min-h-screen text-white bg-gradient-to-b ${categoryConfig.theme} pb-32`}>
      {/* Noise Texture */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      {/* Navigation Bar */}
      <div className="sticky top-0 z-50 px-6 py-4 border-b border-white/5 bg-black/50 backdrop-blur-xl flex items-center justify-between">
        <Link href="/icons" className="group flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors">
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
            <FaArrowLeft />
          </div>
          Back to Archives
        </Link>
        <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${categoryConfig.accent}`}>
          Directory 02 // {categoryConfig.title}
        </span>
      </div>

      {/* Cinematic Header section */}
      <div className="relative pt-32 pb-20 px-6 md:px-12 max-w-[1400px] mx-auto z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-4xl">
          <h1 className="text-6xl md:text-8xl lg:text-[120px] font-black tracking-tighter leading-[0.85] uppercase mb-6">
            {categoryConfig.title}
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 border-l-2 border-white/10 pl-6 py-2">
            {categoryConfig.description}
          </p>
        </div>
      </div>

      {/* Grouped Lists (The Sections) */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-16 flex flex-col gap-32 relative z-10">
        {sortedSubcategories.length === 0 ? (
           <div className="text-center py-32 border border-white/5 bg-white/[0.02] rounded-[3rem]">
             <p className="text-2xl font-black uppercase tracking-widest">Awaiting Data</p>
             <p className="mt-4 text-neutral-500">Profiles are currently being indexed for this category.</p>
           </div>
        ) : (
          sortedSubcategories.map((subcat) => (
            <section key={subcat} className="relative">
              {/* Cinematic Subcategory Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 border-b border-white/10 pb-6">
                <div>
                  <h2 className={`text-4xl md:text-5xl font-black uppercase tracking-tight ${categoryConfig.accent}`}>
                    {subcat.replace(/-/g, ' ')}
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-500">
                    {grouped[subcat].length} PROFILES
                  </span>
                </div>
              </div>

              {/* Grid of Profiles (Premium Bento Style) */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {grouped[subcat].map((person: any) => {
                  const portraitUrl = person.images?.portrait?.url || person.images?.avatar?.url;
                  
                  return (
                    <Link 
                      href={`/icons/${category}/${person.subcategory}/${person.slug}`} 
                      key={person.id}
                      className="group relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-neutral-900 border border-white/5 block"
                    >
                      {portraitUrl ? (
                        <img 
                          src={portraitUrl} 
                          alt={person.name} 
                          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/20 transition-all duration-500 group-hover:bg-white/10 group-hover:text-white/40">
                           <span className="font-black text-6xl uppercase opacity-20">{person.name.charAt(0)}</span>
                        </div>
                      )}
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Text Content */}
                      <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="font-black text-xl md:text-2xl leading-tight uppercase tracking-wide mb-1 text-white">
                          {person.name}
                        </h3>
                        <p className={`text-[10px] font-bold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 ${categoryConfig.accent}`}>
                          {person.title || "Explore Profile"}
                        </p>
                      </div>

                      {/* Top Right Badge */}
                      <div className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <FaArrowLeft className="rotate-135 text-xs text-white" style={{ transform: 'rotate(135deg)' }} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>
    </main>
  );
}
