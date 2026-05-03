import { db } from "@/lib/db";
import { people } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import CategoryView from "./category-view";

// Define the valid categories to prevent routing to non-existent sections
const VALID_CATEGORIES: Record<string, { title: string, description: string, theme: string, accent: string, accentBg: string }> = {
  "heroes": { title: "Heroes", description: "The leading men who define the box office.", theme: "from-neutral-900 to-black", accent: "text-zinc-100", accentBg: "bg-zinc-100" },
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

      {/* Client Component for Search and Grid */}
      <CategoryView 
        people={allPeople} 
        categoryConfig={categoryConfig} 
        categorySlug={category} 
      />
    </main>
  );
}
