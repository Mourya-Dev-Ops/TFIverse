"use client";

import { useState, memo } from "react";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";

export default function CategoryView({ 
  people, 
  categoryConfig, 
  categorySlug 
}: { 
  people: any[]; 
  categoryConfig: any; 
  categorySlug: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter people based on search query
  const filteredPeople = people.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.title && p.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Group by subcategory
  const grouped: Record<string, typeof people> = {};
  for (const person of filteredPeople) {
    const sub = person.subcategory || "Other";
    if (!grouped[sub]) grouped[sub] = [];
    grouped[sub].push(person);
  }

  const sortedSubcategories = Object.keys(grouped).sort();

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10 w-full flex flex-col items-center">
      
      {/* Sticky Glassmorphism Search & Quick Nav */}
      <div className="sticky top-24 z-40 w-full max-w-3xl mb-32 mx-auto transition-transform">
        <div className="relative group">
          <div className={`absolute -inset-1 ${categoryConfig.accentBg} rounded-full blur opacity-10 group-hover:opacity-20 transition duration-1000`} />
          <div className="relative flex items-center bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-6 py-4 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent`} />
            <FaSearch className={`text-neutral-500 text-lg mr-4 transition-colors group-focus-within:text-white`} />
            <input 
              type="text"
              placeholder={`SEARCH THROUGH ${people.length} ICONS...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-white placeholder:text-neutral-600 text-sm tracking-[0.2em] uppercase font-bold"
            />
          </div>
        </div>
        
        {/* Subcategory Pills Quick Nav (Only visible when not searching) */}
        {!searchQuery && sortedSubcategories.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {sortedSubcategories.map((subcat) => (
              <a 
                key={subcat} 
                href={`#${subcat}`}
                className="px-4 py-2 rounded-full bg-black/40 border border-white/5 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-md"
              >
                {subcat.replace(/-/g, ' ')}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Sections */}
      <div className="w-full flex flex-col gap-32">
        {sortedSubcategories.length === 0 ? (
           <div className="text-center py-32 border border-white/5 bg-white/[0.01] backdrop-blur-sm rounded-[2rem]">
             <p className="text-2xl font-black uppercase tracking-widest text-neutral-600">No Profiles Found</p>
           </div>
        ) : (
          sortedSubcategories.map((subcat, index) => (
            <section key={subcat} id={subcat} className="relative w-full pt-32 -mt-32">
              {/* Massive Watermark */}
              <div className={`absolute top-20 left-1/2 -translate-x-1/2 text-[200px] md:text-[280px] font-black leading-none opacity-[0.02] pointer-events-none select-none z-0 tracking-tighter ${categoryConfig.accent}`}>
                0{index + 1}
              </div>

              {/* Premium Section Header */}
              <div className="flex flex-col items-center mb-16 relative z-10">
                <span className={`text-[10px] font-black uppercase tracking-[0.5em] mb-4 ${categoryConfig.accent} flex items-center gap-4`}>
                  <span className="w-8 h-px bg-current opacity-50" />
                  Section 0{index + 1}
                  <span className="w-8 h-px bg-current opacity-50" />
                </span>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-600 text-center drop-shadow-2xl">
                  {subcat.replace(/-/g, ' ')}
                </h2>
                <div className="mt-8 flex items-center justify-center">
                  <div className="px-6 py-1.5 rounded-full bg-[#050505] border border-white/10 backdrop-blur-sm shadow-xl">
                    <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-neutral-400">
                      {grouped[subcat].length} Icons
                    </span>
                  </div>
                </div>
              </div>

              {/* High-Density Premium Grid for 140+ Heroes */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 lg:gap-5">
                {grouped[subcat].map((person: any) => (
                  <ProfileCard 
                    key={person.id} 
                    person={person} 
                    categoryConfig={categoryConfig} 
                    categorySlug={categorySlug} 
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}

// Separate Client Component for Individual Cards to handle image errors
const ProfileCard = memo(function ProfileCard({ person, categoryConfig, categorySlug }: { person: any, categoryConfig: any, categorySlug: string }) {
  const [imgError, setImgError] = useState(false);
  const portraitUrl = person.images?.portrait?.url || person.images?.avatar?.url;
  
  const isHeroines = categorySlug === "heroines";
  const isDirectors = ["directors", "producers", "line-producers", "stunt-directors"].includes(categorySlug);
  const isMusic = ["music-directors", "singers", "lyricists"].includes(categorySlug);
  const isVillains = categorySlug === "villains";
  const isCrafters = ["cinematographers", "editors", "art-directors", "costume-designers", "vfx-supervisors", "choreographers"].includes(categorySlug);
  const isHeroes = !isHeroines && !isDirectors && !isMusic && !isVillains && !isCrafters;

  // HEROINES: Elegant Vogue-style arch, glowing shadow
  // DIRECTORS: Sharp, cinematic letterbox style
  // MUSIC: Pill-shaped, neon borders
  // VILLAINS: Jagged bottom border, aggressive drop shadow
  // CRAFTERS: Blueprint dashed borders, rigid square-ish
  // DEFAULT (Heroes/Comedians): Gritty, sharp-edged standard rectangles
  const cardClasses = isHeroines
    ? "group relative rounded-t-[1000px] rounded-b-3xl overflow-hidden bg-[#0f0208] border border-pink-500/10 block hover:border-pink-500/40 hover:shadow-[0_0_50px_-10px_rgba(236,72,153,0.25)] transition-all duration-700 aspect-[2/3.2]"
    : isDirectors
    ? "group relative rounded-sm overflow-hidden bg-[#050505] border border-white/5 block hover:border-blue-500/30 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.15)] transition-all duration-500 aspect-[3/4]"
    : isMusic
    ? "group relative rounded-[3rem] overflow-hidden bg-[#050a14] border border-purple-500/10 block hover:border-purple-500/50 hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.3)] transition-all duration-500 aspect-[3/4]"
    : isVillains
    ? "group relative rounded-none overflow-hidden bg-[#1a0505] border-b-4 border-red-600/30 block hover:border-red-600 hover:shadow-[0_20px_40px_-10px_rgba(220,38,38,0.4)] transition-all duration-300 aspect-[3/4] hover:-translate-y-2"
    : isCrafters
    ? "group relative rounded-none overflow-hidden bg-[#050505] border border-dashed border-white/20 block hover:border-white/60 transition-all duration-500 aspect-[3/4]"
    : "group relative rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/5 block hover:border-white/20 transition-all duration-500 aspect-[3/4]";

  const imgClasses = isHeroines
    ? "absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-110 opacity-85 group-hover:opacity-100 z-10 saturate-[0.8] group-hover:saturate-125"
    : isDirectors
    ? "absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-105 contrast-125 saturate-50 group-hover:saturate-100 opacity-80 group-hover:opacity-100 z-10 mix-blend-luminosity group-hover:mix-blend-normal"
    : isMusic
    ? "absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 opacity-70 group-hover:opacity-100 z-10 brightness-75 group-hover:brightness-110 saturate-50 group-hover:saturate-100"
    : isVillains
    ? "absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-110 contrast-150 saturate-0 group-hover:saturate-150 opacity-70 group-hover:opacity-100 z-10 mix-blend-multiply group-hover:mix-blend-normal"
    : isCrafters
    ? "absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out grayscale opacity-50 group-hover:grayscale-[0.2] group-hover:opacity-100 z-10"
    : "absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-105 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 z-10";

  const overlayClasses = isHeroines
    ? "absolute inset-0 bg-gradient-to-t from-[#1a0510] via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity z-20"
    : isDirectors
    ? "absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-100 z-20 pointer-events-none shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]"
    : isMusic
    ? "absolute inset-0 bg-gradient-to-t from-[#0a051a] via-black/50 to-transparent opacity-90 group-hover:opacity-100 transition-opacity z-20"
    : isVillains
    ? "absolute inset-0 bg-gradient-to-t from-red-950/80 via-black/60 to-transparent opacity-100 group-hover:opacity-60 transition-opacity z-20 pointer-events-none"
    : isCrafters
    ? "absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-90 group-hover:opacity-100 transition-opacity z-20 pointer-events-none"
    : "absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity z-20";

  const textContainerClasses = isHeroines
    ? "absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-700 z-30 items-center text-center"
    : isDirectors
    ? "absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end translate-y-2 group-hover:-translate-y-6 transition-transform duration-700 z-30 items-center text-center"
    : isMusic
    ? "absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end items-center text-center z-30 transition-transform duration-700 group-hover:-translate-y-4"
    : isVillains
    ? "absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-300 z-30 items-start text-left"
    : isCrafters
    ? "absolute bottom-0 left-0 w-full p-4 flex flex-col justify-end z-30 border-t border-dashed border-white/20 bg-black/80 backdrop-blur-md transition-all duration-500 group-hover:bg-black"
    : "absolute bottom-0 left-0 w-full p-4 md:p-5 flex flex-col justify-end translate-y-3 group-hover:translate-y-0 transition-transform duration-500 z-30";

  return (
    <Link href={`/icons/${categorySlug}/${person.subcategory}/${person.slug}`} className={cardClasses}>
      {/* Fallback Initial */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#111] to-[#050505] z-0">
         <span className="text-6xl md:text-8xl font-black uppercase text-white/[0.03] group-hover:scale-110 transition-transform duration-700">
           {person.name.charAt(0)}
         </span>
      </div>

      {/* Profile Image */}
      {portraitUrl && !imgError && (
        <img 
          src={portraitUrl} 
          alt={person.name} 
          loading="lazy"
          onError={() => setImgError(true)}
          className={imgClasses}
        />
      )}
      
      {/* Gradient Overlay for Text Readability */}
      <div className={overlayClasses} />

      {/* Viewfinder brackets for Directors */}
      {isDirectors && (
        <div className="absolute inset-4 z-20 pointer-events-none opacity-20 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500/50" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500/50" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500/50" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500/50" />
        </div>
      )}

      {/* Music Wave Overlay for Maestros */}
      {isMusic && (
        <div className="absolute inset-x-0 bottom-16 h-12 flex items-end justify-center gap-1 px-8 z-20 opacity-0 group-hover:opacity-50 transition-opacity duration-500">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-1 bg-purple-500 rounded-t-full animate-pulse" style={{ height: `${Math.max(20, Math.random() * 100)}%`, animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      )}

      {/* Villain Blood/Scratch Overlay */}
      {isVillains && (
        <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/scratches.png')]" />
      )}

      {/* Blueprint Grid for Crafters */}
      {isCrafters && (
        <div className="absolute inset-0 z-20 opacity-10 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]" />
      )}

      {/* Cinematic Letterbox for Directors */}
      {isDirectors && (
        <>
          <div className="absolute top-0 left-0 w-full h-6 bg-black z-20 flex items-center justify-center border-b border-white/5 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            <span className="text-[6px] font-mono text-red-500 tracking-widest uppercase flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" /> REC
            </span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-8 bg-black z-20 flex items-center justify-center border-t border-white/5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
             <span className="text-[7px] font-mono text-blue-500 tracking-widest uppercase">{person.title || "Director"}</span>
          </div>
        </>
      )}
      
      {/* Text Content */}
      <div className={textContainerClasses}>
        <h3 className={`font-black uppercase leading-none mb-2 text-white ${isHeroines || isDirectors || isMusic ? 'tracking-[0.1em] text-lg md:text-xl drop-shadow-lg' : isCrafters ? 'font-mono text-base md:text-lg tracking-widest' : 'tracking-tight text-base md:text-lg lg:text-xl'} line-clamp-2`}>
          {person.name}
        </h3>
        
        <div className={`flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 ${isHeroines || isDirectors || isMusic ? 'justify-center w-full' : ''}`}>
          {(!isHeroines && !isDirectors && !isMusic) && <div className={`w-4 h-px ${categoryConfig.accentBg}`} />}
          {(!isDirectors) && (
            <p className={`${isCrafters ? 'font-mono tracking-widest' : 'font-bold uppercase tracking-[0.3em]'} text-[8px] md:text-[9px] ${categoryConfig.accent} truncate`}>
              {person.title || "View Profile"}
            </p>
          )}
          {(isHeroines || isMusic) && <div className={`w-4 h-px ${categoryConfig.accentBg}`} />}
        </div>
      </div>
    </Link>
  );
});
