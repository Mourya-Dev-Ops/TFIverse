"use client";

import { useState } from "react";
import { FaInstagram, FaTwitter, FaImdb } from "react-icons/fa";
import Image from "next/image";

// Thematic Configuration Engine
const THEMES: Record<string, any> = {
  heroes: {
    accent: "text-neutral-100",
    bgPattern: "bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]",
    bgGradient: "from-[#0a0a0a] via-[#111111] to-black",
    glowColor: "bg-white/10",
    badgeTheme: "bg-white/10 text-white border-white/20",
    activeTab: "text-white border-white",
  },
  heroines: {
    accent: "text-rose-200",
    bgPattern: "bg-[url('https://www.transparenttextures.com/patterns/dust.png')]",
    bgGradient: "from-[#1a0f14] via-[#0f0a0c] to-black",
    glowColor: "bg-rose-500/10",
    badgeTheme: "bg-rose-500/10 text-rose-200 border-rose-500/20",
    activeTab: "text-rose-300 border-rose-400",
  },
  directors: {
    accent: "text-amber-400",
    bgPattern: "bg-[url('https://www.transparenttextures.com/patterns/film-grain.png')]",
    bgGradient: "from-[#1a140a] via-[#0f0c05] to-black",
    glowColor: "bg-amber-500/10",
    badgeTheme: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    activeTab: "text-amber-400 border-amber-500",
  },
  "music-directors": {
    accent: "text-blue-400",
    bgPattern: "bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]",
    bgGradient: "from-[#0a111a] via-[#050a0f] to-black",
    glowColor: "bg-blue-500/10",
    badgeTheme: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    activeTab: "text-blue-400 border-blue-500",
  },
  default: {
    accent: "text-white",
    bgPattern: "",
    bgGradient: "from-[#111] via-black to-black",
    glowColor: "bg-white/5",
    badgeTheme: "bg-white/10 text-white border-white/20",
    activeTab: "text-white border-white",
  }
};

export default function IconProfileClient({ 
  person, 
  data, 
  category, 
  subcategory, 
  filmography 
}: { 
  person: any, 
  data: any, 
  category: string, 
  subcategory: string, 
  filmography: any[] 
}) {
  const theme = THEMES[category] || THEMES.default;
  const [activeTab, setActiveTab] = useState("overview");

  // Safely extract deeply nested JSONB data
  const images = data.images || {};
  const personalInfo = data.personalInfo || {};
  const social = data.socialMedia || {};
  const heroAura = data.heroAura || null;
  const lifestyle = data.lifestyle || null;
  const awards = data.awards || [];
  
  // Available Tabs logic
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "info", label: "Personal Info" },
    { id: "movies", label: "Filmography" },
  ];
  
  if (awards.length > 0) tabs.push({ id: "awards", label: "Awards" });
  if (lifestyle && (lifestyle.carCollection?.length > 0 || lifestyle.realEstate?.length > 0)) {
    tabs.push({ id: "lifestyle", label: "Lifestyle" });
  }
  if (images.gallery?.length > 0) tabs.push({ id: "gallery", label: "Gallery" });

  return (
    <main className={`min-h-screen text-white selection:bg-neutral-800 ${theme.bgGradient} relative`}>
      {/* Background Pattern */}
      <div className={`absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay ${theme.bgPattern}`} />
      
      {/* Cinematic Banner */}
      <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
        {images.banner?.url ? (
          <img src={images.banner.url} alt={`${person.name} Banner`} className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="w-full h-full bg-neutral-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        
        {/* Title Lockup overlaying the banner bottom */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 z-20 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-end">
            {/* The Portrait Frame */}
            {images.portrait?.url && (
              <div className="w-40 h-56 md:w-56 md:h-80 shrink-0 rounded-xl overflow-hidden border-2 border-white/10 shadow-2xl relative group">
                <img src={images.portrait.url} alt={person.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl pointer-events-none" />
              </div>
            )}
            
            {/* The Typography */}
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${theme.badgeTheme}`}>
                  {category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-black/50 backdrop-blur-md border border-white/10">
                  {subcategory.replace('-', ' ')}
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

      {/* Sticky Tab Navigation */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-16">
          <div className="flex gap-8 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-xs md:text-sm font-bold tracking-[0.2em] uppercase whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? theme.activeTab
                    : "text-neutral-500 border-transparent hover:text-neutral-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-16 py-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Dynamic Tab Content (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <>
                {/* Bio */}
                <div className="glass-premium rounded-3xl p-8 md:p-10">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500 mb-6">Biography</h3>
                  <p className="text-lg md:text-xl leading-relaxed text-neutral-200">
                    {data.bio}
                  </p>
                </div>

                {/* Conditional: Hero Aura */}
                {heroAura && heroAura.screenPresence && (
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
                
                {/* Conditional: Director's Vision */}
                {data.directorialVision && (
                  <div className={`rounded-3xl p-8 md:p-10 border border-white/5 ${theme.glowColor}`}>
                    <h3 className={`text-sm font-black uppercase tracking-[0.2em] mb-6 ${theme.accent}`}>Directorial Vision</h3>
                    <p className="text-neutral-300 leading-relaxed">{data.directorialVision}</p>
                  </div>
                )}
              </>
            )}

            {/* INFO TAB */}
            {activeTab === "info" && (
              <div className="glass-premium rounded-3xl p-8 md:p-10">
                 <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500 mb-6">Detailed Dossier</h3>
                 {/* This will expand later with physical stats, family, etc. */}
                 <p className="text-neutral-400">Detailed info module goes here...</p>
              </div>
            )}

            {/* MOVIES TAB (From Database!) */}
            {activeTab === "movies" && (
              <div className="flex flex-col gap-6">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500 px-2">Filmography ({filmography.length})</h3>
                
                {filmography.length === 0 ? (
                  <div className="glass-premium rounded-3xl p-10 text-center">
                    <p className="text-neutral-500 font-bold uppercase tracking-widest mb-2">No Movies Found</p>
                    <p className="text-neutral-600 text-sm">Filmography is being synced from TMDB.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filmography.map((credit, idx) => (
                      <div key={idx} className="aspect-[2/3] rounded-2xl overflow-hidden glass-premium relative group">
                        {credit.moviePoster ? (
                          <img src={credit.moviePoster} alt={credit.movieTitle} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-white/5">
                            <span className="text-neutral-600 text-xs font-bold uppercase">{credit.movieTitle}</span>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
                          <p className="font-bold text-white leading-tight">{credit.movieTitle}</p>
                          <p className="text-xs text-neutral-400 mt-1">{credit.movieYear} • {credit.character || credit.job}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* LIFESTYLE TAB */}
            {activeTab === "lifestyle" && lifestyle && (
              <div className="flex flex-col gap-8">
                {lifestyle.carCollection && lifestyle.carCollection.length > 0 && (
                  <div className="glass-premium rounded-3xl p-8 md:p-10">
                     <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500 mb-6">Garage</h3>
                     <ul className="space-y-4">
                       {lifestyle.carCollection.map((car: any, i: number) => (
                         <li key={i} className="flex justify-between items-center border-b border-white/5 pb-4">
                           <span className="font-bold text-lg">{car.model || car.name || car}</span>
                           {car.price && <span className="text-neutral-500 font-mono">{car.price}</span>}
                         </li>
                       ))}
                     </ul>
                  </div>
                )}
              </div>
            )}

            {/* AWARDS TAB */}
            {activeTab === "awards" && awards.length > 0 && (
              <div className="glass-premium rounded-3xl p-8 md:p-10">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500 mb-6">Personal Trophies</h3>
                <div className="grid gap-4">
                  {awards.map((award: any, i: number) => (
                    <div key={i} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="w-16 h-16 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                        🏆
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg">{award.name || award.award}</h4>
                        <p className="text-neutral-400 text-sm">{award.category} • {award.movie} ({award.year})</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GALLERY TAB */}
            {activeTab === "gallery" && images.gallery && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.gallery.map((img: string, i: number) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden glass-premium">
                    <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: Metadata Sidebar (4 cols) */}
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
                    <span className="text-sm text-neutral-200">{personalInfo.birthDate} {personalInfo.age ? `(${personalInfo.age} Years)` : ""}</span>
                  </li>
                )}
                {personalInfo.birthPlace && (
                  <li className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Origin</span>
                    <span className="text-sm text-neutral-200">{personalInfo.birthPlace}</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Social Network */}
            <div className="glass-premium rounded-3xl p-8">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500 mb-6">Network</h3>
              <div className="flex flex-wrap gap-4">
                {social.instagram?.url && (
                  <a href={social.instagram.url} target="_blank" rel="noreferrer" className={`w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/5 transition-colors ${theme.accent}`}>
                    <FaInstagram size={20} />
                  </a>
                )}
                {social.twitter?.url && (
                  <a href={social.twitter.url} target="_blank" rel="noreferrer" className={`w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/5 transition-colors ${theme.accent}`}>
                    <FaTwitter size={20} />
                  </a>
                )}
                {data.imdbId && (
                  <a href={`https://www.imdb.com/name/${data.imdbId}`} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/5 transition-colors">
                    <FaImdb size={20} className="text-[#f5c518]" />
                  </a>
                )}
              </div>
            </div>

            {/* Wikipedia Contribute Button */}
            <div className="mt-4 border border-white/10 rounded-3xl p-6 text-center bg-white/5 backdrop-blur-md">
               <div className="w-12 h-12 rounded-full bg-white/10 mx-auto mb-4 flex items-center justify-center">
                 <span className="text-xl">✍️</span>
               </div>
               <h3 className="font-bold text-white mb-2">Notice Missing Data?</h3>
               <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                 TFIverse is community-driven. Suggest an edit to add awards, OTT links, or missing movies.
               </p>
               <button className="w-full py-3 bg-white text-black hover:bg-neutral-200 rounded-full text-xs font-bold transition-colors uppercase tracking-widest">
                 Suggest Edit
               </button>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
