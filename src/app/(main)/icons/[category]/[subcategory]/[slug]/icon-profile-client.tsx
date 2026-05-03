"use client";

import { useState } from "react";
import { FaInstagram, FaTwitter, FaImdb, FaCar, FaHome, FaStar, FaQuoteLeft, FaDumbbell, FaMoneyBillWave, FaFilm, FaCrown } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

// Premium Thematic Engine
const THEMES: Record<string, any> = {
  heroes: {
    accent: "text-zinc-100",
    accentBg: "bg-zinc-100",
    bgPattern: "bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]",
    bgGradient: "from-[#0a0a0a] via-black to-black",
    glowColor: "bg-white/5 border-white/10",
    badgeTheme: "bg-white/10 text-white border-white/20",
    activeTab: "text-white border-white",
  },
  heroines: {
    accent: "text-rose-500",
    accentBg: "bg-rose-500",
    bgPattern: "bg-[url('https://www.transparenttextures.com/patterns/dust.png')]",
    bgGradient: "from-[#1a0f14] via-[#0f0a0c] to-black",
    glowColor: "bg-rose-500/5 border-rose-500/10",
    badgeTheme: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    activeTab: "text-rose-500 border-rose-500",
  },
  directors: {
    accent: "text-blue-500",
    accentBg: "bg-blue-500",
    bgPattern: "bg-[url('https://www.transparenttextures.com/patterns/film-grain.png')]",
    bgGradient: "from-[#0a111a] via-[#050a0f] to-black",
    glowColor: "bg-blue-500/5 border-blue-500/10",
    badgeTheme: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    activeTab: "text-blue-500 border-blue-500",
  },
  default: {
    accent: "text-white",
    accentBg: "bg-white",
    bgPattern: "",
    bgGradient: "from-[#0a0a0a] via-black to-black",
    glowColor: "bg-white/5 border-white/10",
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
  // Map singular DB categories to plural UI categories (hero -> heroes, director -> directors)
  const hubCategory = category === "hero" ? "heroes" : category === "heroine" ? "heroines" : category === "pro" ? "pros" : `${category}s`;
  const theme = THEMES[hubCategory] || THEMES.default;
  const [activeTab, setActiveTab] = useState("overview");

  // Safely extract deeply nested JSONB data
  const images = data.images || {};
  const personalInfo = data.personalInfo || {};
  const social = data.socialMedia || {};
  const heroAura = data.heroAura || null;
  const physicalStats = data.physicalStats || null;
  const transformations = data.physicalTransformations || [];
  const voiceProfile = data.voiceProfile || null;
  const lifestyle = data.lifestyle || null;
  const financial = data.financialProfile || null;
  const favorites = data.favorites || null;
  const collaborations = data.collaborations || null;
  const hobbies = data.hobbiesAndInterests || [];
  const careerStats = data.careerStats || null;
  const genreStrength = data.genreStrength || null;
  const philanthropy = data.philanthropy || null;
  const awards = data.awards || [];
  const quotes = data.quotes || [];
  const trivia = data.trivia || [];
  const knownFor = data.knownFor || [];
  const alternateNames = data.alternateNames || [];

  // Available Tabs logic dynamically generated based on data availability
  const tabs = [
    { id: "overview", label: "Overview" },
  ];

  if (physicalStats || voiceProfile || personalInfo.education) {
    tabs.push({ id: "dossier", label: "Dossier" });
  }

  if (transformations.length > 0 || voiceProfile?.iconicDialogues?.length > 0 || collaborations) {
    tabs.push({ id: "craft", label: "The Craft" });
  }

  if (lifestyle || financial) {
    tabs.push({ id: "empire", label: "Empire" });
  }

  if (careerStats || genreStrength || awards.length > 0) {
    tabs.push({ id: "career", label: "Career" });
  }

  if (philanthropy || quotes.length > 0 || trivia.length > 0) {
    tabs.push({ id: "legacy", label: "Legacy" });
  }

  tabs.push({ id: "movies", label: "Filmography" });

  if (images.gallery?.length > 0) tabs.push({ id: "gallery", label: "Gallery" });

  return (
    <main className={`min-h-screen text-white selection:bg-neutral-800 ${theme.bgGradient} relative pb-32`}>
      {/* Background Pattern */}
      <div className={`absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay ${theme.bgPattern}`} />

      {/* Cinematic Banner */}
      <div className="relative h-[65vh] md:h-[85vh] w-full overflow-hidden">
        {images.banner?.url ? (
          <img src={images.banner.url} alt={`${person.name} Banner`} className="w-full h-full object-cover opacity-50" />
        ) : (
          <div className="w-full h-full bg-neutral-900" />
        )}
        {/* Gradients to blend banner into the page */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

        {/* Title Lockup overlaying the banner bottom */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 z-20 max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-end">
            {/* The Portrait Frame - Awwwards Style */}
            {images.portrait?.url && (
              <div className="w-48 h-64 md:w-64 md:h-[340px] shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group bg-black/50 backdrop-blur-sm">
                <img src={images.portrait.url} alt={person.name} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 group-hover:opacity-90" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            )}

            {/* The Typography */}
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] ${theme.badgeTheme} backdrop-blur-md`}>
                  {category}
                </span>
                <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] bg-white/5 border border-white/10 backdrop-blur-md text-neutral-300">
                  {subcategory.replace('-', ' ')}
                </span>
                {personalInfo.age && (
                  <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] bg-white/5 border border-white/10 backdrop-blur-md text-neutral-400">
                    Age {personalInfo.age}
                  </span>
                )}
                {data.generation && (
                  <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] bg-white/5 border border-white/10 backdrop-blur-md text-neutral-400">
                    {data.generation}
                  </span>
                )}
              </div>

              <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.85] mb-4 drop-shadow-2xl">
                {person.name}
              </h1>

              {data.title && (
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-1 ${theme.accentBg}`} />
                  <h2 className={`text-2xl md:text-4xl font-bold tracking-[0.2em] uppercase ${theme.accent} drop-shadow-lg`}>
                    {data.title}
                  </h2>
                </div>
              )}

              {/* Alternate Names / AKA */}
              {alternateNames.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {alternateNames.map((name: string, i: number) => (
                    <span key={i} className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                      {name}{i < alternateNames.length - 1 && <span className="ml-2 text-neutral-700">•</span>}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Premium Tab Navigation */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-6 md:px-16 flex items-center">
          {/* Back Button */}
          <Link
            href={`/icons/${hubCategory}`}
            className="group flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-colors mr-6 md:mr-10"
            title="Back to Directory"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
          </Link>

          <div className="flex gap-8 md:gap-12 overflow-x-auto no-scrollbar relative flex-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-6 text-xs md:text-sm font-black tracking-[0.2em] uppercase whitespace-nowrap transition-all duration-300 relative ${activeTab === tab.id
                  ? `${theme.accent}`
                  : "text-neutral-500 hover:text-neutral-300"
                  }`}
              >
                {tab.label}
                {/* Animated active indicator */}
                {activeTab === tab.id && (
                  <div className={`absolute bottom-0 left-0 w-full h-[3px] ${theme.accentBg} shadow-[0_0_15px_rgba(255,255,255,0.5)] shadow-${theme.accentBg.replace('bg-', '')}`} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-16 py-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">

          {/* LEFT COLUMN: Dynamic Tab Content (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-12">

            {/* ========================================== */}
            {/* TAB 1: OVERVIEW */}
            {/* ========================================== */}
            {activeTab === "overview" && (
              <>
                {/* Cinematic Bio */}
                <div className="relative p-10 md:p-14 rounded-[2rem] bg-[#0a0a0a] border border-white/5 overflow-hidden group hover:border-white/10 transition-colors">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                  <FaStar className={`absolute top-10 right-10 text-4xl opacity-5 ${theme.accent}`} />

                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 flex items-center gap-4">
                    <span className={`w-4 h-4 rounded-full ${theme.accentBg} animate-pulse opacity-50`} />
                    The Legend
                  </h3>
                  <div className="text-base md:text-lg lg:text-xl leading-[1.8] text-neutral-300 font-light tracking-wide">
                    <p className="first-letter:text-6xl md:first-letter:text-8xl first-letter:font-black first-letter:text-white first-letter:mr-3 first-letter:mt-2 first-letter:float-left">
                      {data.bio}
                    </p>
                  </div>
                </div>

                {/* Hero Aura Bento Grid */}
                {heroAura && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {heroAura.boxOfficeAppeal && (
                      <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] ${theme.glowColor}`}>
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Box Office Appeal</h4>
                        <p className="text-neutral-400 leading-relaxed text-sm">{heroAura.boxOfficeAppeal}</p>
                      </div>
                    )}
                    {heroAura.screenPresence && (
                      <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] ${theme.glowColor}`}>
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Screen Presence</h4>
                        <p className="text-neutral-400 leading-relaxed text-sm">{heroAura.screenPresence}</p>
                      </div>
                    )}
                    {heroAura.signature && (
                      <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] ${theme.glowColor}`}>
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Signature Style</h4>
                        <p className="text-neutral-400 leading-relaxed text-sm">{heroAura.signature}</p>
                      </div>
                    )}
                    {heroAura.trademarkStyle && (
                      <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] ${theme.glowColor}`}>
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Trademark</h4>
                        <p className="text-neutral-400 leading-relaxed text-sm">{heroAura.trademarkStyle}</p>
                      </div>
                    )}
                    {heroAura.fanbase && (
                      <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] md:col-span-2 ${theme.glowColor}`}>
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>The Fanbase</h4>
                        <p className="text-neutral-400 leading-relaxed text-sm md:text-base">{heroAura.fanbase}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Known For Highlights */}
                {knownFor.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2">Defining Legacy</h3>
                    <div className="space-y-3">
                      {knownFor.map((item: string, idx: number) => (
                        <div key={idx} className="flex gap-4 items-start p-4 rounded-xl bg-[#0a0a0a] border border-white/5">
                          <span className={`text-lg font-black ${theme.accent} shrink-0 mt-0.5`}>0{idx + 1}</span>
                          <p className="text-neutral-400 text-sm leading-relaxed">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Favorites Mini Bento */}
                {favorites && Object.keys(favorites).length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2">Favorites & Preferences</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(favorites).map(([key, value], idx) => (
                        <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 flex flex-col justify-center">
                          <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-2 block">{key}</span>
                          <span className="font-bold text-neutral-200 text-sm">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hobbies & Interests - Full Detail */}
                {hobbies && hobbies.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-4">Beyond Cinema</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {hobbies.map((hobby: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 group hover:border-white/10 transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-black text-white uppercase tracking-tight">{typeof hobby === 'string' ? hobby : hobby.hobby}</h4>
                            {hobby.proficiency && (
                              <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${theme.badgeTheme}`}>{hobby.proficiency}</span>
                            )}
                          </div>
                          {hobby.description && <p className="text-neutral-500 text-xs leading-relaxed line-clamp-3">{hobby.description}</p>}
                          {hobby.frequency && <span className="text-[9px] text-neutral-600 uppercase tracking-widest mt-2 block">{hobby.frequency}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quotes */}
                {quotes.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-4">In Their Words</h3>
                    <div className="space-y-4">
                      {quotes.slice(0, 4).map((q: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 relative">
                          <FaQuoteLeft className="text-xl opacity-10 absolute top-4 right-4" />
                          <p className="text-neutral-300 text-sm leading-relaxed italic mb-3">"{q.quote}"</p>
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-bold uppercase tracking-widest ${theme.accent}`}>{q.year}</span>
                            {q.source && <span className="text-[9px] text-neutral-600">— {q.source}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ========================================== */}
            {/* TAB 2: DOSSIER (The Human) */}
            {/* ========================================== */}
            {activeTab === "dossier" && (
              <>
                {/* Personal Traits */}
                {personalInfo.personalTraits && (
                  <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-4">Character Profile</h3>
                    {personalInfo.personalTraits.personalityType && <p className="text-neutral-300 text-sm leading-relaxed mb-4">{personalInfo.personalTraits.personalityType}</p>}
                    {personalInfo.personalTraits.knownForPersonality && <p className="text-neutral-500 text-xs leading-relaxed">{personalInfo.personalTraits.knownForPersonality}</p>}
                    <div className="flex gap-3 mt-4 flex-wrap">
                      {personalInfo.personalTraits.zodiacSign && (
                        <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-neutral-300 font-bold">☉ {personalInfo.personalTraits.zodiacSign}</span>
                      )}
                      {personalInfo.personalTraits.bloodGroup && (
                        <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-neutral-300 font-bold">🩸 {personalInfo.personalTraits.bloodGroup}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Physical Stats Bento */}
                {physicalStats && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 flex items-center gap-3">
                      <FaDumbbell /> Physical Architecture
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center">
                        <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Height</span>
                        <span className={`text-2xl font-black ${theme.accent}`}>{physicalStats.body?.height || "N/A"}</span>
                      </div>
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center">
                        <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Weight</span>
                        <span className={`text-2xl font-black ${theme.accent}`}>{physicalStats.body?.weight?.current || "N/A"}</span>
                      </div>
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center col-span-2">
                        <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Body Type</span>
                        <span className="text-sm font-bold text-neutral-300">{physicalStats.body?.bodyType || "N/A"}</span>
                      </div>
                    </div>

                    {/* Measurements */}
                    {physicalStats.measurements && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {Object.entries(physicalStats.measurements).map(([key, val]: [string, any]) => (
                          <div key={key} className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5 text-center">
                            <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">{key}</span>
                            <span className="text-xs font-bold text-neutral-300">{val}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Appearance */}
                    {physicalStats.appearance && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        {physicalStats.appearance.hairColor && (
                          <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5">
                            <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">Hair</span>
                            <span className="text-xs font-bold text-neutral-300">{physicalStats.appearance.hairColor}</span>
                          </div>
                        )}
                        {physicalStats.appearance.eyeColor && (
                          <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5">
                            <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">Eyes</span>
                            <span className="text-xs font-bold text-neutral-300">{physicalStats.appearance.eyeColor}</span>
                          </div>
                        )}
                        {physicalStats.appearance.skinTone && (
                          <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5">
                            <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">Skin Tone</span>
                            <span className="text-xs font-bold text-neutral-300">{physicalStats.appearance.skinTone}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Distinctive Features */}
                    {physicalStats.appearance?.distinctiveFeatures && (
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 mb-6">
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Distinctive Features</h4>
                        <ul className="space-y-2">
                          {physicalStats.appearance.distinctiveFeatures.map((feat: string, i: number) => (
                            <li key={i} className="text-neutral-400 text-xs leading-relaxed flex gap-2"><span className="text-neutral-600 shrink-0">—</span>{feat}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Fitness & Nutrition Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {physicalStats.fitnessProfile && (
                        <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Fitness Regimen</h4>
                          <p className="text-neutral-400 text-sm mb-3">{physicalStats.fitnessProfile.fitnessLevel}</p>
                          {physicalStats.fitnessProfile.mainTrainer && (
                            <div className="bg-black/50 p-3 rounded-lg border border-white/5 mb-3">
                              <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">Trainer</span>
                              <span className="text-xs text-neutral-300">{physicalStats.fitnessProfile.mainTrainer}</span>
                            </div>
                          )}
                          {physicalStats.fitnessProfile.dailyTrainingHours && (
                            <span className="text-[10px] text-neutral-500 block mb-1">Training: {physicalStats.fitnessProfile.dailyTrainingHours}</span>
                          )}
                          {physicalStats.fitnessProfile.trainingFocus && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {physicalStats.fitnessProfile.trainingFocus.map((focus: string, i: number) => (
                                <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-widest text-neutral-300">{focus}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {physicalStats.nutritionProfile && (
                        <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Nutrition Protocol</h4>
                          <p className="text-neutral-400 text-sm mb-3">{physicalStats.nutritionProfile.dietaryApproach}</p>
                          <div className="space-y-2">
                            {physicalStats.nutritionProfile.calorieManagement && (
                              <div className="bg-black/50 p-3 rounded-lg border border-white/5">
                                <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">Caloric Intake</span>
                                <span className="text-xs text-neutral-200">{physicalStats.nutritionProfile.calorieManagement}</span>
                              </div>
                            )}
                            {physicalStats.nutritionProfile.macroFocus && (
                              <div className="bg-black/50 p-3 rounded-lg border border-white/5">
                                <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">Macros</span>
                                <span className="text-xs text-neutral-200">{physicalStats.nutritionProfile.macroFocus}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Health Metrics */}
                    {physicalStats.healthMetrics && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        {Object.entries(physicalStats.healthMetrics).map(([key, val]: [string, any]) => (
                          <div key={key} className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5 text-center">
                            <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="text-xs font-bold text-neutral-300">{val}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Voice Profile */}
                {voiceProfile && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">Vocal Dynamics</h3>
                    <div className="p-8 md:p-10 rounded-[2rem] bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/5 relative overflow-hidden">
                      <div className={`absolute top-0 right-0 w-full h-1 ${theme.accentBg} opacity-20`} />
                      <p className="text-lg text-neutral-300 leading-relaxed mb-8 italic">
                        "{voiceProfile.signatureVoiceElements || voiceProfile.voiceCharacteristics?.voiceType}"
                      </p>

                      {voiceProfile.languagesFluent && (
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-neutral-500">Linguistic Arsenal</h4>
                          <div className="flex flex-wrap gap-3">
                            {voiceProfile.languagesFluent.map((lang: any, i: number) => (
                              <div key={i} className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-1">
                                <span className="text-sm font-bold text-white">{lang.language}</span>
                                <span className={`text-[9px] uppercase tracking-widest ${theme.accent}`}>{lang.proficiency}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ========================================== */}
            {/* TAB 3: THE CRAFT (Legend) */}
            {/* ========================================== */}
            {activeTab === "craft" && (
              <>
                {/* Physical Transformations Timeline */}
                {transformations.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Cinematic Transformations
                    </h3>
                    <div className="space-y-6">
                      {transformations.map((trans: any, idx: number) => (
                        <div key={idx} className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                          {/* Animated background line */}
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />

                          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-4 pl-4">
                            <div>
                              <h4 className="text-2xl font-black uppercase tracking-tight text-white mb-1">{trans.film}</h4>
                              <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">{trans.period}</span>
                            </div>

                            {/* Weight Tag */}
                            {(trans.targetWeight || trans.weightGained) && (
                              <div className={`px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shrink-0 text-center`}>
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme.accent} block`}>Result</span>
                                <span className="text-sm font-bold text-white">{trans.targetWeight || trans.weightGained}</span>
                              </div>
                            )}
                          </div>

                          <p className="text-neutral-400 text-sm leading-relaxed pl-4">{trans.transformation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Iconic Dialogues Box */}
                {voiceProfile?.iconicDialogues && voiceProfile.iconicDialogues.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 mt-12 flex items-center gap-3">
                      <FaQuoteLeft /> Immortal Lines
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {voiceProfile.iconicDialogues.map((dialogue: any, idx: number) => (
                        <div key={idx} className={`p-8 rounded-[2rem] border border-white/5 bg-[#050505] relative ${theme.glowColor} group`}>
                          <FaQuoteLeft className={`text-4xl absolute top-6 right-6 opacity-10 ${theme.accent} group-hover:scale-110 transition-transform`} />
                          <p className="text-xl md:text-2xl font-bold text-white leading-tight mb-6 mt-4 relative z-10">
                            "{dialogue.dialogue}"
                          </p>
                          <div className="flex flex-col gap-1">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${theme.accent}`}>{dialogue.movie} ({dialogue.year})</span>
                            <span className="text-xs text-neutral-500 line-clamp-2">{dialogue.context}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Collaborations */}
                {collaborations?.frequentDirectors && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 mt-12">Visionary Partners (Directors)</h3>
                    <div className="flex overflow-x-auto gap-4 pb-8 no-scrollbar snap-x">
                      {collaborations.frequentDirectors.map((collab: any, idx: number) => (
                        <div key={idx} className="min-w-[280px] md:min-w-[320px] p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 snap-start shrink-0 flex flex-col justify-between">
                          <div>
                            <h4 className="text-xl font-black uppercase tracking-tight text-white mb-1">{collab.name}</h4>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${theme.accent} mb-4 block`}>{collab.filmCount} Films Together</span>
                            <p className="text-xs text-neutral-400 leading-relaxed line-clamp-4">{collab.chemistry}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Music Directors */}
                {collaborations?.musicDirectors && collaborations.musicDirectors.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 mt-12">Sonic Architects</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {collaborations.musicDirectors.map((md: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 flex items-center justify-between group">
                          <div>
                            <h4 className="text-sm font-black uppercase text-white mb-1 group-hover:text-zinc-300 transition-colors">{md.name}</h4>
                            <span className="text-xs text-neutral-500">{md.iconicAlbum || md.chemistry}</span>
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${theme.accent}`}>{md.filmCount} Films</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Frequent Heroines */}
                {collaborations?.frequentHeroines && collaborations.frequentHeroines.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 mt-12">On-Screen Chemistry</h3>
                    <div className="flex overflow-x-auto gap-4 pb-8 no-scrollbar snap-x">
                      {collaborations.frequentHeroines.map((h: any, idx: number) => (
                        <div key={idx} className="min-w-[280px] md:min-w-[320px] p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 snap-start shrink-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-lg font-black uppercase tracking-tight text-white">{h.name}</h4>
                              {h.fanFollowing && <span className={`text-[9px] font-bold uppercase tracking-widest ${theme.accent}`}>{h.fanFollowing}</span>}
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${theme.accent} mb-3 block`}>{h.filmCount} Films Together</span>
                            <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">{h.chemistry}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dubbing Artists */}
                {voiceProfile?.dubbingArtists && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">Voice Counterparts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(voiceProfile.dubbingArtists).map(([lang, artist]: [string, any]) => (
                        <div key={lang} className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5 flex items-center justify-between">
                          <span className="text-xs font-bold text-white uppercase tracking-wide">{lang}</span>
                          <span className="text-xs text-neutral-400 text-right max-w-[60%] line-clamp-1">{artist}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ========================================== */}
            {/* TAB 4: EMPIRE (Lifestyle & Finance) */}
            {/* ========================================== */}
            {activeTab === "empire" && (
              <>
                {/* Net Worth Hero Box */}
                {financial?.netWorth && (
                  <div className={`p-10 rounded-[2rem] bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 ${theme.glowColor}`}>
                    <div className="absolute -right-10 -bottom-10 opacity-5">
                      <FaMoneyBillWave size={200} />
                    </div>
                    <div className="relative z-10">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2 block">Estimated Valuation</span>
                      <h3 className={`text-5xl md:text-7xl font-black tracking-tighter ${theme.accent}`}>
                        {financial.netWorth.estimatedValue}
                      </h3>
                      {financial.netWorth.perFilmFee && (
                        <span className="text-sm font-bold text-neutral-300 mt-2 block bg-white/5 px-4 py-1.5 rounded-full inline-block border border-white/10">
                          {financial.netWorth.perFilmFee}
                        </span>
                      )}
                    </div>
                    {financial.netWorth.ranking && (
                      <div className="text-right relative z-10 hidden md:block max-w-xs">
                        <span className="text-xs text-neutral-400 leading-relaxed font-bold uppercase tracking-widest">
                          {financial.netWorth.ranking}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* The Garage (Cars) */}
                {lifestyle?.carCollection && lifestyle.carCollection.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8 flex items-center gap-3">
                      <FaCar /> The Garage
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {lifestyle.carCollection.map((car: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 flex flex-col justify-between group hover:border-white/20 transition-colors">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-black uppercase tracking-tight text-white">{car.make} {car.model}</h4>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">{car.color} • {car.year}</span>
                            </div>
                            <span className={`text-xs font-bold ${theme.accent} whitespace-nowrap`}>{car.estimatedValue}</span>
                          </div>
                          <p className="text-xs text-neutral-400 line-clamp-2">{car.notes}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Real Estate / Properties */}
                {lifestyle?.properties && lifestyle.properties.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8 flex items-center gap-3">
                      <FaHome /> Real Estate Portfolio
                    </h3>
                    <div className="space-y-4">
                      {lifestyle.properties.map((prop: any, idx: number) => (
                        <div key={idx} className="p-6 md:p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 flex flex-col md:flex-row gap-6 justify-between group">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-xl font-black uppercase tracking-tight text-white">{prop.location}</h4>
                              {prop.primaryResidence && (
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${theme.badgeTheme}`}>Primary</span>
                              )}
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 block mb-4">{prop.type} • {prop.area}</span>
                            <p className="text-sm text-neutral-400 leading-relaxed">{prop.description}</p>
                          </div>
                          <div className="shrink-0 flex items-start md:justify-end">
                            <span className={`text-lg font-black ${theme.accent}`}>{prop.estimatedValue}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Business Ventures */}
                {financial?.businessVentures && financial.businessVentures.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">Corporate Ventures</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {financial.businessVentures.map((venture: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <span className={`text-[9px] uppercase tracking-widest ${theme.accent} font-bold mb-1 block`}>{venture.industry}</span>
                          <h4 className="text-lg font-black text-white">{venture.name}</h4>
                          <span className="text-xs text-neutral-400">{venture.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Endorsements */}
                {financial?.endorsements && financial.endorsements.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">Brand Portfolio</h3>
                    <div className="flex flex-wrap gap-3">
                      {financial.endorsements.map((brand: any, idx: number) => (
                        <div key={idx} className="px-4 py-3 bg-[#0a0a0a] border border-white/5 rounded-xl flex items-center gap-3">
                          <span className="text-sm font-bold text-white">{brand.brand}</span>
                          <span className="text-[10px] text-neutral-500 px-2 py-0.5 bg-white/5 rounded">{brand.category}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Fashion & Watches */}
                {lifestyle?.fashion && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">Style & Horlogerie</h3>
                    {lifestyle.fashion.signatureLook && (
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 mb-4">
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 ${theme.accent}`}>Signature Look</h4>
                        <p className="text-neutral-400 text-xs leading-relaxed">{lifestyle.fashion.signatureLook}</p>
                      </div>
                    )}
                    {lifestyle.fashion.favoriteDesigners && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {lifestyle.fashion.favoriteDesigners.map((d: string, i: number) => (
                          <span key={i} className="px-3 py-1.5 bg-white/5 rounded-full text-[10px] font-bold text-neutral-300 uppercase tracking-widest">{d}</span>
                        ))}
                      </div>
                    )}
                    {lifestyle.fashion.watches && lifestyle.fashion.watches.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {lifestyle.fashion.watches.map((w: any, idx: number) => (
                          <div key={idx} className="p-5 rounded-xl bg-[#0a0a0a] border border-white/5 flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-black text-white">{w.brand}</h4>
                              <span className="text-[10px] text-neutral-500">{w.model} • {w.year}</span>
                            </div>
                            <span className={`text-xs font-bold ${theme.accent}`}>{w.estimatedValue}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* ========================================== */}
            {/* TAB: CAREER (Stats & Achievements) */}
            {/* ========================================== */}
            {activeTab === "career" && (
              <>
                {/* Career Stats Hero */}
                {careerStats && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2">Career Dashboard</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      {careerStats.totalMovies && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center">
                          <span className={`text-3xl font-black ${theme.accent}`}>{careerStats.totalMovies}</span>
                          <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mt-1">Total Films</span>
                        </div>
                      )}
                      {careerStats.totalBlockbusters && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center">
                          <span className={`text-3xl font-black ${theme.accent}`}>{careerStats.totalBlockbusters}</span>
                          <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mt-1">Blockbusters</span>
                        </div>
                      )}
                      {careerStats.hitPercentage && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center">
                          <span className={`text-3xl font-black ${theme.accent}`}>{careerStats.hitPercentage}</span>
                          <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mt-1">Hit Rate</span>
                        </div>
                      )}
                      {careerStats.yearsActive && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center">
                          <span className={`text-3xl font-black ${theme.accent}`}>{careerStats.yearsActive}</span>
                          <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mt-1">Years Active</span>
                        </div>
                      )}
                    </div>

                    {/* Records */}
                    {careerStats.records && careerStats.records.length > 0 && (
                      <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 mb-8">
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-6 ${theme.accent}`}>Records & Firsts</h4>
                        <ul className="space-y-3">
                          {careerStats.records.map((r: string, i: number) => (
                            <li key={i} className="text-neutral-400 text-xs leading-relaxed flex gap-3"><span className={`${theme.accent} shrink-0 font-black`}>★</span>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Milestones Timeline */}
                    {careerStats.milestones && careerStats.milestones.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2">Career Timeline</h4>
                        <div className="space-y-3">
                          {careerStats.milestones.map((m: string, i: number) => (
                            <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-[#0a0a0a] border border-white/5">
                              <span className={`text-xs font-black ${theme.accent} shrink-0 w-12`}>{m.substring(0, 4)}</span>
                              <p className="text-neutral-400 text-xs leading-relaxed">{m.substring(6)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Genre Strength Radar */}
                {genreStrength && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">Genre Mastery</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(genreStrength).map(([genre, data]: [string, any]) => (
                        <div key={genre} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-black text-white uppercase tracking-tight">{genre}</h4>
                            <span className={`text-lg font-black ${theme.accent}`}>{data.rating}<span className="text-neutral-600 text-xs">/100</span></span>
                          </div>
                          <div className="w-full h-1.5 bg-white/5 rounded-full mb-3 overflow-hidden">
                            <div className={`h-full ${theme.accentBg} rounded-full`} style={{ width: `${data.rating}%` }} />
                          </div>
                          {data.strengths && (
                            <ul className="space-y-1">
                              {data.strengths.slice(0, 2).map((s: string, i: number) => (
                                <li key={i} className="text-neutral-500 text-[10px] leading-relaxed">• {s}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Awards */}
                {awards.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">Awards & Recognition</h3>
                    <div className="space-y-3">
                      {awards.map((a: any, idx: number) => (
                        <div key={idx} className="p-5 rounded-xl bg-[#0a0a0a] border border-white/5 flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="text-sm font-black text-white">{a.awardName}</h4>
                            <span className="text-[10px] text-neutral-500">{a.givenBy} • {a.category}</span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className={`text-sm font-black ${theme.accent}`}>{a.year}</span>
                            {a.won && <span className="text-[9px] text-green-500 block uppercase tracking-widest font-bold">Won</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ========================================== */}
            {/* TAB: LEGACY (Philanthropy & Trivia) */}
            {/* ========================================== */}
            {activeTab === "legacy" && (
              <>
                {/* Philanthropy */}
                {philanthropy && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2">Giving Back</h3>
                    {philanthropy.totalEstimatedContribution && (
                      <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] mb-6 ${theme.glowColor}`}>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 block mb-2">Total Contributions</span>
                        <span className={`text-3xl md:text-5xl font-black ${theme.accent}`}>{philanthropy.totalEstimatedContribution}</span>
                      </div>
                    )}
                    {philanthropy.initiatives && philanthropy.initiatives.length > 0 && (
                      <div className="space-y-4">
                        {philanthropy.initiatives.map((init: any, idx: number) => (
                          <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-black text-white">{init.name}</h4>
                              <span className={`text-xs font-bold ${theme.accent}`}>{init.amount}</span>
                            </div>
                            <p className="text-neutral-500 text-xs leading-relaxed mb-2">{init.description}</p>
                            {init.beneficiaries && <span className="text-[9px] text-neutral-600 uppercase tracking-widest">{init.beneficiaries}</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Trivia */}
                {trivia.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">Did You Know?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {trivia.map((t: string, idx: number) => (
                        <div key={idx} className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5 flex gap-3 items-start">
                          <span className={`text-xs font-black ${theme.accent} shrink-0`}>#{idx + 1}</span>
                          <p className="text-neutral-400 text-xs leading-relaxed">{t}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Quotes (Full) */}
                {quotes.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">Complete Quotes Archive</h3>
                    <div className="space-y-4">
                      {quotes.map((q: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 relative">
                          <FaQuoteLeft className="text-xl opacity-10 absolute top-4 right-4" />
                          <p className="text-neutral-300 text-sm leading-relaxed italic mb-3">"{q.quote}"</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[9px] font-bold uppercase tracking-widest ${theme.accent}`}>{q.year}</span>
                            {q.context && <span className="text-[9px] text-neutral-600">• {q.context}</span>}
                            {q.source && <span className="text-[9px] text-neutral-600">— {q.source}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ========================================== */}
            {/* TAB: FILMOGRAPHY (From Database) */}
            {/* ========================================== */}
            {activeTab === "movies" && (
              <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 flex items-center gap-3">
                    <FaFilm /> Theatrical Releases
                  </h3>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${theme.badgeTheme}`}>
                    {filmography.length} Films
                  </span>
                </div>

                {filmography.length === 0 ? (
                  <div className="p-16 rounded-[2rem] border border-white/5 bg-[#0a0a0a] text-center">
                    <FaFilm className="text-4xl text-neutral-600 mx-auto mb-4 opacity-50" />
                    <p className="text-neutral-300 font-bold uppercase tracking-widest mb-2">Database Syncing</p>
                    <p className="text-neutral-500 text-sm">Filmography is being imported from TMDB servers.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {filmography.map((credit, idx) => (
                      <div key={idx} className="aspect-[2/3] rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/5 relative group hover:border-white/20 transition-all duration-500">
                        {credit.moviePoster ? (
                          <img
                            src={credit.moviePoster}
                            alt={credit.movieTitle}
                            className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#111] to-black p-4 text-center">
                            <span className="text-neutral-600 text-[10px] font-bold uppercase tracking-widest mb-2">{credit.movieYear}</span>
                            <span className="text-neutral-400 text-sm font-bold uppercase">{credit.movieTitle}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity z-10" />
                        <div className="absolute bottom-0 left-0 w-full p-4 md:p-5 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-500 z-20">
                          <p className="font-black uppercase text-white leading-tight mb-1">{credit.movieTitle}</p>
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-bold uppercase tracking-[0.2em] ${theme.accent}`}>{credit.movieYear}</span>
                            <span className="text-neutral-500 text-[9px]">•</span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 truncate">{credit.character || credit.job}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ========================================== */}
            {/* TAB 6: GALLERY */}
            {/* ========================================== */}
            {activeTab === "gallery" && images.gallery && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.gallery.map((img: string, i: number) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/5 group relative">
                    <img src={img} alt="Gallery" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none z-10" />
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* ========================================== */}
          {/* RIGHT COLUMN: Sticky Sidebar Metadata (4 cols) */}
          {/* ========================================== */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            <div className="sticky top-32 flex flex-col gap-6">
              {/* Quick Stats Bento */}
              <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 flex items-center gap-2">
                  <FaCrown /> Identity Dossier
                </h3>
                <ul className="flex flex-col gap-5">
                  {personalInfo.fullName && (
                    <li className="flex flex-col gap-1 border-b border-white/5 pb-4">
                      <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Legal Name</span>
                      <span className="text-sm font-bold text-neutral-200">{personalInfo.fullName}</span>
                    </li>
                  )}
                  {personalInfo.birthDate && (
                    <li className="flex flex-col gap-1 border-b border-white/5 pb-4">
                      <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Born</span>
                      <span className="text-sm font-bold text-neutral-200">{personalInfo.birthDate} {personalInfo.age ? `(Age ${personalInfo.age})` : ""}</span>
                    </li>
                  )}
                  {personalInfo.birthPlace && (
                    <li className="flex flex-col gap-1 border-b border-white/5 pb-4">
                      <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Origin</span>
                      <span className="text-sm font-bold text-neutral-200">{personalInfo.birthPlace}</span>
                    </li>
                  )}
                  {personalInfo.currentResidence && (
                    <li className="flex flex-col gap-1 border-b border-white/5 pb-4">
                      <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Base of Operations</span>
                      <span className="text-sm font-bold text-neutral-200">{personalInfo.currentResidence}</span>
                    </li>
                  )}
                  {personalInfo.nationality && (
                    <li className="flex flex-col gap-1 border-b border-white/5 pb-4">
                      <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Nationality</span>
                      <span className="text-sm font-bold text-neutral-200">{personalInfo.nationality}</span>
                      {personalInfo.ethnicity && <span className="text-[10px] text-neutral-400">{personalInfo.ethnicity}</span>}
                    </li>
                  )}
                  {personalInfo.familyInfo?.maritalStatus && (
                    <li className="flex flex-col gap-1 border-b border-white/5 pb-4">
                      <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Status</span>
                      <span className="text-sm font-bold text-neutral-200">{personalInfo.familyInfo.maritalStatus}</span>
                    </li>
                  )}
                  {personalInfo.careerStart && (
                    <li className="flex flex-col gap-1 border-b border-white/5 pb-4">
                      <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Career Genesis</span>
                      <span className="text-sm font-bold text-neutral-200">{personalInfo.careerStart.debutFilm} ({personalInfo.careerStart.debutYear})</span>
                      {personalInfo.careerStart.yearsActive && <span className="text-[10px] text-neutral-400">{personalInfo.careerStart.yearsActive} years active</span>}
                    </li>
                  )}
                  {personalInfo.education && (
                    <li className="flex flex-col gap-1 border-b border-white/5 pb-4">
                      <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Education</span>
                      {personalInfo.education.college && <span className="text-sm font-bold text-neutral-200">{personalInfo.education.college}</span>}
                      {personalInfo.education.degree && <span className="text-sm font-bold text-neutral-200">{personalInfo.education.degree}</span>}
                      {personalInfo.education.highSchool && <span className="text-[10px] text-neutral-400">{personalInfo.education.highSchool}</span>}
                      {personalInfo.education.institution && <span className="text-[10px] text-neutral-400">{personalInfo.education.institution}</span>}
                    </li>
                  )}
                  {personalInfo.familyInfo && (
                    <li className="flex flex-col gap-1">
                      <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Family Heritage</span>
                      {personalInfo.familyInfo.family?.father && (
                        <span className="text-sm font-bold text-neutral-200">{personalInfo.familyInfo.family.father}</span>
                      )}
                      {personalInfo.familyInfo.family?.mother && (
                        <span className="text-[10px] text-neutral-400">{personalInfo.familyInfo.family.mother}</span>
                      )}
                      {personalInfo.familyInfo.family?.siblings && personalInfo.familyInfo.family.siblings.length > 0 && (
                        <div className="mt-1 space-y-1">
                          {personalInfo.familyInfo.family.siblings.map((s: any, i: number) => (
                            <span key={i} className="text-[10px] text-neutral-400 block">{s.name} — {s.relationship}</span>
                          ))}
                        </div>
                      )}
                      {personalInfo.familyInfo.parents?.father && !personalInfo.familyInfo.family?.father && (
                        <span className="text-sm font-bold text-neutral-200">Son of {personalInfo.familyInfo.parents.father}</span>
                      )}
                      {personalInfo.familyInfo.notableRelatives && personalInfo.familyInfo.notableRelatives.length > 0 && (
                        <span className="text-[10px] text-neutral-400 mt-1">Relatives: {personalInfo.familyInfo.notableRelatives.map((r:any) => r.name).join(', ')}</span>
                      )}
                    </li>
                  )}
                </ul>
              </div>

              {/* Social Network */}
              <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-6">Digital Footprint</h3>
                <div className="flex flex-wrap gap-4">
                  {social.instagram?.url && (
                    <a href={social.instagram.url} target="_blank" rel="noreferrer" className={`w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 transition-colors ${theme.accent} group`}>
                      <FaInstagram size={18} className="group-hover:scale-110 transition-transform" />
                    </a>
                  )}
                  {social.twitter?.url && (
                    <a href={social.twitter.url} target="_blank" rel="noreferrer" className={`w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 transition-colors ${theme.accent} group`}>
                      <FaTwitter size={18} className="group-hover:scale-110 transition-transform" />
                    </a>
                  )}
                  {data.imdbId && (
                    <a href={`https://www.imdb.com/name/${data.imdbId}`} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 transition-colors group">
                      <FaImdb size={18} className="text-[#f5c518] group-hover:scale-110 transition-transform" />
                    </a>
                  )}
                </div>
                {social.instagram?.followers && (
                  <div className="mt-6 pt-6 border-t border-white/5">
                    <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">Instagram Following</span>
                    <span className="text-xl font-black text-white">{(social.instagram.followers / 1000000).toFixed(1)}M</span>
                  </div>
                )}
              </div>

              {/* Wikipedia Contribute Button */}
              <div className="border border-white/10 rounded-[2rem] p-8 text-center bg-white/[0.02] backdrop-blur-md relative overflow-hidden group">
                <div className={`absolute top-0 left-0 w-full h-1 ${theme.accentBg} opacity-20 group-hover:opacity-100 transition-opacity`} />
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-xl">✍️</span>
                </div>
                <h3 className="font-bold text-white mb-2 uppercase tracking-wide">Notice Missing Data?</h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                  TFIverse is community-driven. Suggest an edit to add awards, OTT links, or missing movies.
                </p>
                <button className={`w-full py-4 ${theme.accentBg} text-black font-black hover:opacity-90 rounded-xl text-[10px] uppercase tracking-[0.2em] transition-all`}>
                  Submit Edit Request
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
