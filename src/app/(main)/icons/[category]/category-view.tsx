"use client";

import { useState } from "react";
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
      
      {/* Search Box */}
      <div className="w-full max-w-2xl mb-24 relative group">
        <div className={`absolute -inset-1 ${categoryConfig.accentBg} rounded-full blur opacity-10 group-hover:opacity-30 transition duration-1000 group-hover:duration-200`} />
        <div className="relative flex items-center bg-[#0a0a0a] border border-white/10 rounded-full px-6 py-4 transition-colors focus-within:border-white/30">
          <FaSearch className="text-neutral-500 text-lg mr-4" />
          <input 
            type="text"
            placeholder={`Search through ${people.length} profiles...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-white placeholder:text-neutral-600 text-sm tracking-widest uppercase font-bold"
          />
        </div>
      </div>

      {/* Sections */}
      <div className="w-full flex flex-col gap-32">
        {sortedSubcategories.length === 0 ? (
           <div className="text-center py-32 border border-white/5 bg-white/[0.01] backdrop-blur-sm rounded-[2rem]">
             <p className="text-2xl font-black uppercase tracking-widest text-neutral-600">No Profiles Found</p>
           </div>
        ) : (
          sortedSubcategories.map((subcat, index) => (
            <section key={subcat} className="relative w-full">
              {/* Premium Section Header */}
              <div className="flex flex-col items-center mb-12 relative">
                <span className={`text-[10px] font-black uppercase tracking-[0.5em] mb-4 ${categoryConfig.accent}`}>
                  Section 0{index + 1}
                </span>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500 text-center">
                  {subcat.replace(/-/g, ' ')}
                </h2>
                <div className="mt-6 flex items-center gap-4 w-full max-w-md">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-600">
                    {grouped[subcat].length} Icons
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
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
function ProfileCard({ person, categoryConfig, categorySlug }: { person: any, categoryConfig: any, categorySlug: string }) {
  const [imgError, setImgError] = useState(false);
  const portraitUrl = person.images?.portrait?.url || person.images?.avatar?.url;

  return (
    <Link 
      href={`/icons/${categorySlug}/${person.subcategory}/${person.slug}`} 
      className="group relative rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/5 block hover:border-white/20 transition-all duration-500 aspect-[3/4]"
    >
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
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-105 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 z-10"
        />
      )}
      
      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity z-20" />
      
      {/* Text Content */}
      <div className="absolute bottom-0 left-0 w-full p-4 md:p-5 flex flex-col justify-end translate-y-3 group-hover:translate-y-0 transition-transform duration-500 z-30">
        <h3 className="font-black uppercase tracking-tight leading-none mb-1 text-white text-base md:text-lg lg:text-xl line-clamp-2">
          {person.name}
        </h3>
        
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
          <div className={`w-4 h-px ${categoryConfig.accentBg}`} />
          <p className={`font-bold uppercase tracking-[0.2em] text-[8px] md:text-[9px] ${categoryConfig.accent} truncate`}>
            {person.title || "View Profile"}
          </p>
        </div>
      </div>
    </Link>
  );
}
