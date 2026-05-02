import { db } from "@/lib/db";
import { people } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

// Define the valid categories to prevent routing to non-existent sections
const VALID_CATEGORIES: Record<string, { title: string, description: string, theme: string }> = {
  "heroes": { title: "Heroes", description: "The leading men who define the box office.", theme: "from-neutral-900 to-black" },
  "heroines": { title: "Heroines", description: "The leading ladies who captivate the silver screen.", theme: "from-[#1a0f14] to-black" },
  "directors": { title: "Directors", description: "The visionary captains steering the ship of cinema.", theme: "from-[#1a140a] to-black" },
  "music-directors": { title: "Music Directors", description: "The maestros composing the heartbeat of TFI.", theme: "from-[#0a111a] to-black" },
  "villains": { title: "Villains", description: "The iconic antagonists we love to hate.", theme: "from-neutral-900 to-black" },
  "comedians": { title: "Comedians", description: "The kings and queens of comedy.", theme: "from-amber-900/20 to-black" },
  "character-artists": { title: "Character Artists", description: "The versatile performers who bring life to every story.", theme: "from-zinc-900 to-black" },
  "singers": { title: "Singers", description: "The voices behind the chartbusters.", theme: "from-blue-900/20 to-black" },
  "producers": { title: "Producers", description: "The titans who fund the dreams.", theme: "from-green-900/20 to-black" },
  "cinematographers": { title: "Cinematographers", description: "The eyes that capture the magic.", theme: "from-stone-900 to-black" },
  "editors": { title: "Editors", description: "The invisible architects of storytelling.", theme: "from-zinc-900 to-black" },
  "lyricists": { title: "Lyricists", description: "The poets of the silver screen.", theme: "from-slate-900 to-black" },
  "choreographers": { title: "Choreographers", description: "The masters of dance and movement.", theme: "from-rose-900/20 to-black" },
  "stunt-directors": { title: "Stunt Directors", description: "The choreographers of high-octane action.", theme: "from-red-900/20 to-black" },
  "art-directors": { title: "Art Directors", description: "The creators of cinematic worlds.", theme: "from-yellow-900/20 to-black" },
  "costume-designers": { title: "Costume Designers", description: "The stylists of the stars.", theme: "from-pink-900/20 to-black" },
  "line-producers": { title: "Line Producers", description: "The operational backbone of productions.", theme: "from-zinc-900 to-black" },
  "vfx-supervisors": { title: "VFX Supervisors", description: "The magicians of digital reality.", theme: "from-indigo-900/20 to-black" },
  "pros": { title: "PROs", description: "The bridge between stars and the masses.", theme: "from-gray-900 to-black" },
};

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = VALID_CATEGORIES[category];
  if (!cat) return { title: "Not Found" };
  return {
    title: `${cat.title} | The Icons | TFIverse`,
    description: cat.description,
  };
}

export default async function CategoryHubPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const categoryConfig = VALID_CATEGORIES[category];
  if (!categoryConfig) notFound();

  // The database stores category in singular form (e.g., 'hero', 'heroine')
  // We need to map the URL parameter (plural) to the DB value
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

  // OPTIMIZED QUERY: We only pull the 'images' and 'title' from the heavy JSONB metadata.
  // This turns a 75MB request (for 1000 people) into a 1MB request!
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

  // Sort subcategories (just alphabetical for now, can be customized later)
  const sortedSubcategories = Object.keys(grouped).sort();

  return (
    <main className={`min-h-screen text-white bg-gradient-to-b ${categoryConfig.theme} pb-24`}>
      {/* Header section */}
      <div className="relative pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto text-center border-b border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 text-xs uppercase tracking-widest font-bold text-neutral-400">
          <Link href="/icons" className="hover:text-white transition-colors">The Icons</Link>
          <span>/</span>
          <span className="text-white">{categoryConfig.title}</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6">
          {categoryConfig.title}
        </h1>
        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto font-medium">
          {categoryConfig.description}
        </p>
      </div>

      {/* Grouped Lists */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16 flex flex-col gap-24">
        {sortedSubcategories.length === 0 ? (
           <div className="text-center py-20 text-neutral-500 glass-premium rounded-3xl">
             <p className="text-xl font-bold uppercase tracking-widest">Database Syncing</p>
             <p className="mt-2 text-sm">Profiles are currently being indexed for this category.</p>
           </div>
        ) : (
          sortedSubcategories.map((subcat) => (
            <section key={subcat} className="relative">
              {/* Subcategory Header */}
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-black uppercase tracking-tight">{subcat.replace('-', ' ')}</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
                <span className="text-sm font-bold text-neutral-500">{grouped[subcat].length} PROFILES</span>
              </div>

              {/* Grid of Profiles */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                {grouped[subcat].map((person: any) => {
                  const portraitUrl = person.images?.portrait?.url || person.images?.avatar?.url;
                  
                  return (
                    <Link 
                      href={`/icons/${category}/${person.subcategory}/${person.slug}`} 
                      key={person.id}
                      className="group relative aspect-[3/4] rounded-2xl overflow-hidden glass-premium block"
                    >
                      {portraitUrl ? (
                        <img 
                          src={portraitUrl} 
                          alt={person.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/20">
                           <span className="font-bold text-2xl uppercase">{person.name.charAt(0)}</span>
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="absolute bottom-0 left-0 w-full p-4 md:p-5 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform">
                        <h3 className="font-bold text-lg leading-tight uppercase tracking-wide mb-1">{person.name}</h3>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{person.title || "Actor"}</p>
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
