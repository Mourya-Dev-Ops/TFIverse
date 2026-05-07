"use client";

import { useState } from "react";
import { FaInstagram, FaTwitter, FaImdb, FaCar, FaHome, FaStar, FaQuoteLeft, FaDumbbell, FaMoneyBillWave, FaFilm, FaCrown, FaChartBar, FaMusic, FaFire } from "react-icons/fa";
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
    accent: "text-pink-500",
    accentBg: "bg-pink-500",
    bgPattern: "bg-[url('https://www.transparenttextures.com/patterns/dust.png')]",
    bgGradient: "from-[#1a0510] via-[#0f0208] to-black",
    glowColor: "bg-pink-500/5 border-pink-500/10",
    badgeTheme: "bg-pink-500/10 text-pink-500 border-pink-500/20",
    activeTab: "text-pink-500 border-pink-500",
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
  const social = data.socialMedia || data.socialMediaInfluence || data.socialMediaPresence || {};
  
  // Aura extraction (Hero vs Heroine vs Diva vs Villain vs Comedian vs Character Artist vs Singer)
  const aura = data.heroAura || data.queenAura || data.divaAura || data.risingQueenAura || data.antagonistEssence || data.comedyEssence || data.characterEssence || data.singerEssence || null;
  
  const physicalStats = data.physicalStats || data.appearance || null;
  const appearance = data.appearance || null;
  const detailedSocialInfluence = data.socialMediaInfluence?.instagram ? data.socialMediaInfluence : null;
  const transformations = data.physicalTransformations || data.beautyTransformations || data.transformations || [];
  const voiceProfile = data.voiceProfile || null;
  const lifestyle = data.lifestyle || null;
  const financial = data.financialProfile || null;
  const favorites = data.favorites || null;
  const collaborations = data.collaborations || null;
  const hobbies = data.hobbiesAndInterests || data.hobbies || [];
  const careerStats = data.careerStats || data.careerStatistics || data.commercialStatistics || data.villainCareerStats || data.comedyCareerStats || data.characterStatistics || data.singingStatistics || null;
  const genreStrength = data.genreStrength || data.genreExpertise || data.genreSpecialization || null;
  const philanthropy = data.philanthropy || data.philanthrophy || null;
  const awards = data.awards || data.beautyAwards || data.fashionAwards || data.awardsAndRecognition || [];
  const awardsByType = data.awardsBYType || data.awardsByType || null;
  const boxOfficeMilestones = data.boxOfficeMilestones || null;
  const quotes = data.quotes || [];
  const trivia = data.trivia || [];
  const knownFor = data.knownFor || [];
  const alternateNames = data.alternateNames || [];
  
  // Heroine/Diva specific data
  const rawBeautyProfile = data.beautyProfile || data.beautyLegacy || null;
  const rawFashionIcon = data.fashionIcon || data.fashionStyle || data.fashionImpact || null;
  const screenChemistry = data.screenChemistry || null;

  // Normalize Beauty Profile
  const beautyProfile = rawBeautyProfile ? {
    philosophy: rawBeautyProfile.beautyPhilosophy || rawBeautyProfile.beautyStandardsSet || rawBeautyProfile.iconicLook || null,
    skinCare: rawBeautyProfile.skinCareRoutine || null,
    makeupObj: typeof rawBeautyProfile.makeupSignature === 'object' ? rawBeautyProfile.makeupSignature : null,
    makeupStr: typeof rawBeautyProfile.makeupSignature === 'string' ? rawBeautyProfile.makeupSignature : null,
    makeupInfluence: rawBeautyProfile.makeupInfluence || null,
    legacyStr: rawBeautyProfile.influenceOnFutureGenerations || rawBeautyProfile.beautyEvolution || null,
    hairStr: rawBeautyProfile.hairstyleInfluence || null,
    physicalAttributes: rawBeautyProfile.physicalAttributes || null,
    internationalAppeal: rawBeautyProfile.internationalAppeal || null,
    makeupArtistTestimonies: rawBeautyProfile.makeupArtistTestimonies || null
  } : null;

  // Normalize Fashion Profile
  const fashionIcon = rawFashionIcon ? {
    styleDescription: rawFashionIcon.styleDescription || rawFashionIcon.styleSignature || rawFashionIcon.fashionIcon || (typeof rawBeautyProfile?.fashionIcon === 'string' ? rawBeautyProfile.fashionIcon : null) || null,
    signatureLook: rawFashionIcon.signatureLook || null,
    everydayStyle: rawFashionIcon.everydayStyle || null,
    trends: rawFashionIcon.fashionTrends || rawFashionIcon.emergingTrends || rawFashionIcon.iconicOutfits || [],
    redCarpet: rawFashionIcon.redCarpetMoments || rawFashionIcon.redCarpetLooks || null,
    evolution: rawFashionIcon.styleEvolution || rawFashionIcon.fashionEvolution || null,
    trendSetter: rawFashionIcon.trendSetter || null,
    collaborationWithDesigners: rawFashionIcon.collaborationWithDesigners || [],
    fashionArchives: rawFashionIcon.fashionArchives || null
  } : null;

  // Legend-specific data
  const careerRetrospective = data.careerRetrospective || (data.filmographyByDecade ? { byDecade: data.filmographyByDecade } : null);
  const iconicRoles = data.iconicRoles || [];
  const onScreenPersona = data.onScreenPersona || null;
  const historicalImpact = data.historicalImpact || data.culturalImpact || null;
  const industryContribution = data.industryContribution || null;
  const mentorshipInfluence = data.mentorshipInfluence || null;
  const internationalRecognition = data.internationalRecognition || null;
  const criticalAppreciation = data.criticalAppreciation || null;
  const filmmakerRelationships = data.filmmakerRelationships || null;
  const politicalCareer = data.politicalCareer || null;
  const controversiesOrTriumphs = data.controversiesOrTriumphs || null;
  const influenceAndLegacy = data.influenceAndLegacy || data.lifeAfterCinema || data.legacyProjects || data.comparisonsAndLegacy || data.influenceOnVillains || data.antagonistLegacy || data.influenceOnComedy || null;
  const screenChemistryByCostar = data.screenChemistryByCostar || null;

  // Rising Star specific data
  const debutAnalysis = data.debutAnalysis || null;
  const breakingMoment = data.breakingMoment || data.breakThroughMoment || null;
  const fanbaseAnalysis = data.fanbaseAnalysis || null;
  const competitorComparison = data.competitorComparison || data.peerAnalysis || null;
  const superstarpotential = data.superstarpotential || data.potentialAssessment || null;
  const careerTrajectory = data.careerTrajectory || null;
  const uniqueSellingProposition = data.uniqueSellingProposition || null;

  // Villain specific data
  const villainSpecialization = data.villainSpecialization || null;
  const heroAntagonisms = data.heroAntagonisms || null;
  const legendaryMoments = data.legendaryMoments || null;
  const dualCareer = data.dualCareer || null;
  const iconicAntagonistRoles = data.iconicAntagoonistRoles || data.antagonistRoles || [];

  // Comedian specific data
  const comedySpecialization = data.comedySpecialization || null;
  const heroComedyPartnerships = data.heroComedyPartnerships || null;
  const legendaryComedyMoments = data.legendaryComedyMoments || data.viralComedyMoments || null;
  const iconicComedyRoles = data.iconicComedyRoles || [];

  // Character Artist specific data
  const characterVersatility = data.characterVersatility || null;
  const iconicCharacterRoles = data.iconicCharacterRoles || data.characterRoles || [];
  const heroPartnerships = data.heroPartnerships || null;
  const directorCollaborations = data.directorCollaborations || null;
  const memorableScenes = data.memorableScenes || null;
  const actingApproach = data.actingApproach || null;

  // Singer specific data
  const vocalProfile = data.vocalProfile || null;
  const musicDirectorCollaborations = data.musicDirectorCollaborations || null;
  const duetPartnerships = data.duetPartnerships || null;
  const chartbusterSongs = data.chartbusterSongs || null;
  const genreVersatility = data.genreVersatility || null;
  const livePerformances = data.livePerformances || null;
  const musicalFamily = data.musicalFamily || null;
  const songsSung = data.songsSung || null;

  // Director specific data
  const rawVisionaryEssence = data.visionaryEssence || data.emergingEssence || data.hitmakerEssence || null;
  const visionaryEssence = rawVisionaryEssence ? {
    directorialVision: rawVisionaryEssence.directorialVision || rawVisionaryEssence.commercialVision || rawVisionaryEssence.uniqueVision || null,
    signatureStyle: rawVisionaryEssence.signatureStyle || rawVisionaryEssence.signatureElements || rawVisionaryEssence.developingStyle || null,
    recurringThemes: rawVisionaryEssence.recurringThemes || rawVisionaryEssence.massAppeal || rawVisionaryEssence.breakThroughAppeal || null,
    culturalImpact: rawVisionaryEssence.culturalImpact || rawVisionaryEssence.boxOfficePower || rawVisionaryEssence.potentialTrajectory || null,
    cinemaRevolution: rawVisionaryEssence.cinemaRevolution || rawVisionaryEssence.uniqueStrength || rawVisionaryEssence.futureImpact || null
  } : null;

  const rawFilmmakingStyle = data.filmmakingStyle || data.emergingFilmmakingStyle || data.commercialFilmmakingStyle || null;
  const filmmakingStyle = rawFilmmakingStyle ? {
    approach: rawFilmmakingStyle.approach || rawFilmmakingStyle.directorialApproach || null,
    visualLanguage: rawFilmmakingStyle.visualLanguage || rawFilmmakingStyle.visualSpectacle || null,
    editingStyle: rawFilmmakingStyle.editingStyle || rawFilmmakingStyle.intervalBangStrategy || rawFilmmakingStyle.influences || null,
    soundDesign: rawFilmmakingStyle.soundDesign || rawFilmmakingStyle.musicPlacement || rawFilmmakingStyle.uniqueDifference || null,
    actorDirection: rawFilmmakingStyle.actorDirection || rawFilmmakingStyle.climaxElevation || rawFilmmakingStyle.genrePreference || null,
    technicalInnovations: rawFilmmakingStyle.technicalInnovations || rawFilmmakingStyle.actionChoreography || null,
    thematicPreoccupations: rawFilmmakingStyle.thematicPreoccupations || rawFilmmakingStyle.massElements || rawFilmmakingStyle.signatureElements || null,
    styleEvolution: rawFilmmakingStyle.styleEvolution || rawFilmmakingStyle.comedyIntegration || null
  } : null;
  const directorFilms = data.filmsDirected || [];
  const upcomingProjects = data.upcomingProjects || [];
  const futureOutlook = data.futureOutlook || null;
  const brandValue = data.brandValue || null;
  const industryStanding = data.industryStanding || null;

  // Music Director specific data
  const musicalEssence = data.musicalEssence || null;
  const orchestralProfile = data.orchestralProfile || (data.productionSignature ? { ...data.productionSignature, ...(data.productionStyle || {}) } : null) || data.productionStyle || null;
  const discography = data.discography || data.recentAlbums || null;
  const chartbusterSongs = data.chartbusterSongs || null;
  const musicalInnovations = data.musicalInnovations || null;
  const backgroundScoreMastery = data.backgroundScoreMastery || null;
  const streamingDominance = data.streamingDominance || data.streamingPresence || null;
  const commercialImpact = data.commercialImpact || null;
  const careersTimeline = data.careersTimeline || null;
  const viralMoments = data.viralMoments || null;
  const recentFilmography = data.recentFilmography || data.filmography || data.recentSongs || null;
  
  // Available Tabs logic dynamically generated based on data availability
  const tabs = [
    { id: "overview", label: "Overview" },
  ];

  if (physicalStats || appearance || voiceProfile || personalInfo.education || onScreenPersona) {
    tabs.push({ id: "dossier", label: "Dossier" });
  }

  if (beautyProfile || fashionIcon) {
    tabs.push({ id: "glamour", label: "Glamour" });
  }

  if (transformations.length > 0 || voiceProfile?.iconicDialogues?.length > 0 || collaborations || iconicRoles.length > 0 || filmmakerRelationships || screenChemistry || visionaryEssence || filmmakingStyle || musicalEssence || orchestralProfile || villainSpecialization || heroAntagonisms || iconicAntagonistRoles.length > 0 || comedySpecialization || heroComedyPartnerships || iconicComedyRoles.length > 0 || characterVersatility || actingApproach || iconicCharacterRoles.length > 0 || heroPartnerships || directorCollaborations || vocalProfile || musicDirectorCollaborations || duetPartnerships || genreVersatility) {
    tabs.push({ id: "craft", label: category === "director" ? "Vision & Craft" : category === "music-director" ? "Sonic Blueprint" : category === "villain" ? "Dark Craft" : category === "comedian" ? "Comedy Lab" : category === "character-artists" ? "The Method" : category === "singers" ? "Sonic Identity" : "The Craft" });
  }

  if (lifestyle || financial || politicalCareer || brandValue) {
    tabs.push({ id: "empire", label: "Empire" });
  }

  if (careerStats || boxOfficeMilestones || genreStrength || awards.length > 0 || awardsByType || careerRetrospective || streamingDominance || commercialImpact || careersTimeline || chartbusterSongs || songsSung) {
    tabs.push({ id: "career", label: "Career" });
  }

  if (philanthropy || quotes.length > 0 || trivia.length > 0 || historicalImpact || industryContribution || mentorshipInfluence || internationalRecognition || criticalAppreciation || controversiesOrTriumphs || influenceAndLegacy || industryStanding || legendaryMoments || legendaryComedyMoments || memorableScenes || livePerformances || musicalFamily) {
    tabs.push({ id: "legacy", label: "Legacy" });
  }

  if (fanbaseAnalysis || competitorComparison || superstarpotential || careerTrajectory || uniqueSellingProposition || upcomingProjects.length > 0 || futureOutlook || detailedSocialInfluence) {
    tabs.push({ id: "trajectory", label: "Trajectory" });
  }

  tabs.push({ id: "movies", label: category === "music-director" ? "Filmography" : "Filmography" });
  if (chartbusterSongs || discography || backgroundScoreMastery || recentFilmography) {
    tabs.push({ id: "discography", label: "Discography" });
  }

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
                {data.eraDefiner && (
                  <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] bg-white/5 border border-white/10 backdrop-blur-md text-neutral-400">
                    {data.eraDefiner}
                  </span>
                )}
                {data.commercialTier && (
                  <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] bg-white/5 border border-white/10 backdrop-blur-md text-neutral-400">
                    {data.commercialTier}
                  </span>
                )}
                {data.activeStatus && (
                  <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] bg-white/5 border border-white/10 backdrop-blur-md text-neutral-400">
                    {data.activeStatus}
                  </span>
                )}
                {data.era && (
                  <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] bg-white/5 border border-white/10 backdrop-blur-md text-neutral-400">
                    {data.era}
                  </span>
                )}
                {data.legendStatus && (
                  <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] bg-white/5 border border-white/10 backdrop-blur-md text-neutral-400">
                    {data.legendStatus}
                  </span>
                )}
                {data.careerPhase && (
                  <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] bg-white/5 border border-white/10 backdrop-blur-md text-neutral-400">
                    {data.careerPhase}
                  </span>
                )}
                {data.careerSpecialization && (
                  <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] bg-white/5 border border-white/10 backdrop-blur-md text-neutral-400">
                    {data.careerSpecialization}
                  </span>
                )}
                {data.careerType && (
                  <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] bg-white/5 border border-white/10 backdrop-blur-md text-neutral-400">
                    {data.careerType}
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

                {/* Debut & Breakthrough (Rising Stars) */}
                {(debutAnalysis || breakingMoment) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {debutAnalysis && (
                      <div className="p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] relative overflow-hidden group">
                        <div className={`absolute left-0 top-0 w-1 h-full ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>The Origin</h4>
                        <div className="mb-4">
                          <span className="text-xl font-black text-white">{debutAnalysis.debutFilm}</span>
                          <span className="text-xs text-neutral-500 font-bold ml-2">({debutAnalysis.debutYear})</span>
                        </div>
                        <p className="text-neutral-400 text-sm leading-relaxed mb-4">{debutAnalysis.debutRole}</p>
                        <p className="text-neutral-500 text-xs italic">"{debutAnalysis.significance}"</p>
                      </div>
                    )}
                    {breakingMoment && (
                      <div className="p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] relative overflow-hidden group">
                        <div className={`absolute left-0 top-0 w-1 h-full ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>The Breakthrough</h4>
                        <div className="mb-4">
                          <span className="text-xl font-black text-white">{breakingMoment.film}</span>
                          <span className="text-xs text-neutral-500 font-bold ml-2">({breakingMoment.year})</span>
                        </div>
                        <p className="text-neutral-400 text-sm leading-relaxed mb-4">{breakingMoment.impact}</p>
                        {breakingMoment.collection && (
                          <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold tracking-widest uppercase text-neutral-300">
                            Box Office: {breakingMoment.collection}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Aura Bento Grid */}
                {aura && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(aura.boxOfficeAppeal || aura.legendaryAppeal) && (
                      <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] ${theme.glowColor}`}>
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>{aura.legendaryAppeal ? 'Legendary Appeal' : 'Box Office Appeal'}</h4>
                        <p className="text-neutral-400 leading-relaxed text-sm">{aura.boxOfficeAppeal || aura.legendaryAppeal}</p>
                      </div>
                    )}
                    {aura.screenPresence && (
                      <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] ${theme.glowColor}`}>
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Screen Presence</h4>
                        <p className="text-neutral-400 leading-relaxed text-sm">{aura.screenPresence}</p>
                      </div>
                    )}
                    {aura.beautyLegacy && (
                      <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] ${theme.glowColor}`}>
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Beauty Legacy</h4>
                        <p className="text-neutral-400 leading-relaxed text-sm">{aura.beautyLegacy}</p>
                      </div>
                    )}
                    {(aura.signature || aura.signatureStyle) && (
                      <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] ${theme.glowColor}`}>
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Signature Style</h4>
                        <p className="text-neutral-400 leading-relaxed text-sm">{aura.signature || aura.signatureStyle}</p>
                      </div>
                    )}
                    {aura.trademarkStyle && (
                      <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] ${theme.glowColor}`}>
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Trademark</h4>
                        <p className="text-neutral-400 leading-relaxed text-sm">{aura.trademarkStyle}</p>
                      </div>
                    )}
                    {aura.modernAppeal && (
                      <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] ${theme.glowColor}`}>
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Modern Appeal</h4>
                        <p className="text-neutral-400 leading-relaxed text-sm">{aura.modernAppeal}</p>
                      </div>
                    )}
                    {aura.fanbase && (
                      <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] md:col-span-2 ${theme.glowColor}`}>
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>The Fanbase</h4>
                        <p className="text-neutral-400 leading-relaxed text-sm md:text-base">{aura.fanbase}</p>
                      </div>
                    )}
                    {aura.cinematicLegacy && (
                      <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] md:col-span-2 ${theme.glowColor}`}>
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Cinematic Legacy</h4>
                        <p className="text-neutral-400 leading-relaxed text-sm md:text-base">{aura.cinematicLegacy}</p>
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
                          {hobby.description && <p className="text-neutral-500 text-xs leading-relaxed">{hobby.description}</p>}
                          {hobby.impact && <p className="text-neutral-600 text-[10px] leading-relaxed mt-2 italic">{hobby.impact}</p>}
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
                        <span className={`text-2xl font-black ${theme.accent}`}>{physicalStats.body?.height || (physicalStats.height?.feet ? `${physicalStats.height.feet} (${physicalStats.height.cm}cm)` : "N/A")}</span>
                      </div>
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center">
                        <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Weight</span>
                        <span className={`text-2xl font-black ${theme.accent}`}>{physicalStats.body?.weight?.current || (physicalStats.weight?.kg ? `${physicalStats.weight.kg}kg` : "N/A")}</span>
                      </div>
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center col-span-2">
                        <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Body Type</span>
                        <span className="text-sm font-bold text-neutral-300">{physicalStats.body?.bodyType || physicalStats.build || "N/A"}</span>
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
                    {(physicalStats.appearance || physicalStats.hairColor || physicalStats.eyeColor) && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        {(physicalStats.appearance?.hairColor || physicalStats.hairColor) && (
                          <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5">
                            <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">Hair</span>
                            <span className="text-xs font-bold text-neutral-300">{physicalStats.appearance?.hairColor || physicalStats.hairColor}</span>
                          </div>
                        )}
                        {(physicalStats.appearance?.eyeColor || physicalStats.eyeColor) && (
                          <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5">
                            <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">Eyes</span>
                            <span className="text-xs font-bold text-neutral-300">{physicalStats.appearance?.eyeColor || physicalStats.eyeColor}</span>
                          </div>
                        )}
                        {physicalStats.appearance?.skinTone && (
                          <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5">
                            <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">Skin Tone</span>
                            <span className="text-xs font-bold text-neutral-300">{physicalStats.appearance.skinTone}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Distinctive Features */}
                    {(physicalStats.appearance?.distinctiveFeatures || physicalStats.distinctiveFeatures) && (
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 mb-6">
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Distinctive Features</h4>
                        <ul className="space-y-2">
                          {(Array.isArray(physicalStats.appearance?.distinctiveFeatures || physicalStats.distinctiveFeatures) ? (physicalStats.appearance?.distinctiveFeatures || physicalStats.distinctiveFeatures) : []).map((feat: string, i: number) => (
                            <li key={i} className="text-neutral-400 text-xs leading-relaxed flex gap-2"><span className="text-neutral-600 shrink-0">—</span>{feat}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Personal Style */}
                    {physicalStats.personalStyle && (
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 mb-6">
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Personal Style</h4>
                        <p className="text-neutral-400 text-sm leading-relaxed">{physicalStats.personalStyle}</p>
                      </div>
                    )}

                    {/* Health History (Legend) */}
                    {physicalStats.healthHistory && (
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 mb-6">
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Health History</h4>
                        <p className="text-neutral-400 text-sm leading-relaxed">{physicalStats.healthHistory}</p>
                      </div>
                    )}

                    {/* Footwear */}
                    {physicalStats.footwear && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        {Object.entries(physicalStats.footwear).map(([key, val]: [string, any]) => (
                          <div key={key} className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5 text-center">
                            <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">Shoe {key}</span>
                            <span className="text-xs font-bold text-neutral-300">{val}</span>
                          </div>
                        ))}
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
                            {physicalStats.nutritionProfile.supplementationApproach && (
                              <div className="bg-black/50 p-3 rounded-lg border border-white/5">
                                <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">Supplements</span>
                                <span className="text-xs text-neutral-200">{physicalStats.nutritionProfile.supplementationApproach}</span>
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

                      {voiceProfile.notableCharacteristics && voiceProfile.notableCharacteristics.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-neutral-500">Notable Characteristics</h4>
                          <ul className="space-y-2">
                            {voiceProfile.notableCharacteristics.map((char: string, i: number) => (
                              <li key={i} className="text-neutral-400 text-xs leading-relaxed flex gap-2"><span className={`${theme.accent} shrink-0`}>•</span>{char}</li>
                            ))}
                          </ul>
                        </div>
                      )}

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

                {/* On-Screen Persona (Legend) */}
                {onScreenPersona && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">The Persona</h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden">
                      {onScreenPersona.actingStyle && (
                        <div className="mb-6">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 ${theme.accent}`}>Acting Style</h4>
                          <p className="text-neutral-300 text-sm leading-relaxed">{onScreenPersona.actingStyle}</p>
                        </div>
                      )}
                      {onScreenPersona.typecastedAs && (
                        <div className="mb-6">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 ${theme.accent}`}>Archetypes</h4>
                          <p className="text-neutral-400 text-xs leading-relaxed">{onScreenPersona.typecastedAs}</p>
                        </div>
                      )}
                      {onScreenPersona.strengthAreas && (
                        <div className="mb-6">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 ${theme.accent}`}>Strength Areas</h4>
                          <ul className="space-y-2">
                            {onScreenPersona.strengthAreas.map((area: string, i: number) => (
                              <li key={i} className="text-neutral-400 text-xs leading-relaxed flex gap-2"><span className="text-neutral-600 shrink-0">—</span>{area}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {onScreenPersona.styleEvolution && (
                        <div className="mb-6">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 ${theme.accent}`}>Style Evolution</h4>
                          <p className="text-neutral-400 text-xs leading-relaxed">{onScreenPersona.styleEvolution}</p>
                        </div>
                      )}
                      {onScreenPersona.actingPhilosophy && (
                        <div>
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 ${theme.accent}`}>Acting Philosophy</h4>
                          <p className="text-neutral-400 text-xs leading-relaxed italic">"{onScreenPersona.actingPhilosophy}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ========================================== */}
            {/* TAB: GLAMOUR (Heroines / Divas) */}
            {/* ========================================== */}
            {activeTab === "glamour" && (
              <>
                {/* Beauty Profile */}
                {beautyProfile && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 flex items-center gap-3">
                      <span className={theme.accent}>✦</span> Beauty & Aesthetics
                    </h3>
                    
                    {beautyProfile.philosophy && (
                      <div className="p-8 md:p-10 rounded-[2rem] bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/5 relative overflow-hidden mb-8">
                        <div className={`absolute top-0 right-0 w-full h-1 ${theme.accentBg} opacity-20`} />
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-neutral-500`}>Philosophy & Iconic Look</h4>
                        <p className="text-lg text-neutral-300 leading-relaxed italic">
                          "{beautyProfile.philosophy}"
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {beautyProfile.skinCare && (
                        <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] ${theme.glowColor}`}>
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Skincare Protocol</h4>
                          {beautyProfile.skinCare.dailyRoutine && (
                            <p className="text-neutral-300 text-sm leading-relaxed mb-3">{beautyProfile.skinCare.dailyRoutine}</p>
                          )}
                          {beautyProfile.skinCare.productsUsed && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {beautyProfile.skinCare.productsUsed.map((prod: string, i: number) => (
                                <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-widest text-neutral-300 border border-white/10">{prod}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {(beautyProfile.makeupObj || beautyProfile.makeupStr || beautyProfile.hairStr) && (
                        <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] ${theme.glowColor}`}>
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Signature Look</h4>
                          {beautyProfile.makeupStr && (
                            <p className="text-neutral-300 text-sm leading-relaxed mb-4">{beautyProfile.makeupStr}</p>
                          )}
                          {beautyProfile.hairStr && (
                            <p className="text-neutral-300 text-sm leading-relaxed mb-4"><span className="text-neutral-500 mr-2">Hair:</span>{beautyProfile.hairStr}</p>
                          )}
                          {beautyProfile.makeupObj?.dailyMakeup && (
                            <p className="text-neutral-300 text-sm leading-relaxed mb-3"><span className="text-neutral-500 mr-2">Daily:</span>{beautyProfile.makeupObj.dailyMakeup}</p>
                          )}
                          {beautyProfile.makeupObj?.redCarpetMakeup && (
                            <p className="text-neutral-300 text-sm leading-relaxed"><span className="text-neutral-500 mr-2">Red Carpet:</span>{beautyProfile.makeupObj.redCarpetMakeup}</p>
                          )}
                        </div>
                      )}
                      
                      {(beautyProfile.makeupInfluence || beautyProfile.makeupArtistTestimonies) && (
                        <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] ${theme.glowColor}`}>
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Makeup Influence</h4>
                          {beautyProfile.makeupInfluence && <p className="text-neutral-300 text-sm leading-relaxed mb-4">{beautyProfile.makeupInfluence}</p>}
                          {beautyProfile.makeupArtistTestimonies && <p className="text-neutral-300 text-sm leading-relaxed italic border-l-2 border-white/20 pl-4">"{beautyProfile.makeupArtistTestimonies}"</p>}
                        </div>
                      )}

                      {(beautyProfile.legacyStr || beautyProfile.physicalAttributes || beautyProfile.internationalAppeal) && (
                        <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] md:col-span-2 ${theme.glowColor}`}>
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>The Legacy</h4>
                          {beautyProfile.physicalAttributes && (
                            <div className="mb-4">
                              <span className="text-neutral-500 text-[10px] uppercase tracking-widest font-bold mb-1 block">Physical Attributes</span>
                              <p className="text-neutral-300 text-sm leading-relaxed">{beautyProfile.physicalAttributes}</p>
                            </div>
                          )}
                          {beautyProfile.legacyStr && (
                            <div className="mb-4">
                              <span className="text-neutral-500 text-[10px] uppercase tracking-widest font-bold mb-1 block">Influence on Generations</span>
                              <p className="text-neutral-300 text-sm leading-relaxed">{beautyProfile.legacyStr}</p>
                            </div>
                          )}
                          {beautyProfile.internationalAppeal && (
                            <div>
                              <span className="text-neutral-500 text-[10px] uppercase tracking-widest font-bold mb-1 block">International Appeal</span>
                              <p className="text-neutral-300 text-sm leading-relaxed">{beautyProfile.internationalAppeal}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Fashion Icon */}
                {fashionIcon && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 flex items-center gap-3">
                      <span className={theme.accent}>✦</span> Sartorial Elegance
                    </h3>
                    
                    {(fashionIcon.styleDescription || fashionIcon.evolution) && (
                      <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 mb-8">
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Style Blueprint</h4>
                        {fashionIcon.styleDescription && (
                          <p className="text-neutral-300 text-sm leading-relaxed mb-6">{fashionIcon.styleDescription}</p>
                        )}
                        {fashionIcon.evolution && (
                          <p className="text-neutral-300 text-sm leading-relaxed mb-6"><span className="text-neutral-500 mr-2">Evolution:</span>{fashionIcon.evolution}</p>
                        )}
                        {fashionIcon.trendSetter && (
                          <p className="text-neutral-300 text-sm leading-relaxed mb-6"><span className="text-neutral-500 mr-2">Trendsetter:</span>{fashionIcon.trendSetter}</p>
                        )}
                        {fashionIcon.fashionArchives && (
                          <p className="text-neutral-300 text-sm leading-relaxed mb-6"><span className="text-neutral-500 mr-2">Archives:</span>{fashionIcon.fashionArchives}</p>
                        )}
                        {fashionIcon.collaborationWithDesigners && fashionIcon.collaborationWithDesigners.length > 0 && (
                          <div className="mb-6">
                            <span className="text-neutral-500 mr-2 text-[10px] uppercase tracking-widest font-bold block mb-2">Designers</span>
                            <div className="flex flex-wrap gap-2 inline-flex">
                              {fashionIcon.collaborationWithDesigners.map((d: string, i: number) => (
                                <span key={i} className="px-2 py-1 bg-white/5 rounded border border-white/5 text-[10px] uppercase tracking-widest text-neutral-300">{d}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {(fashionIcon.signatureLook || fashionIcon.everydayStyle) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-white/5">
                            {fashionIcon.signatureLook && (
                              <div>
                                <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Signature Look</span>
                                <span className="text-xs font-bold text-neutral-300">{fashionIcon.signatureLook}</span>
                              </div>
                            )}
                            {fashionIcon.everydayStyle && (
                              <div>
                                <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Everyday Style</span>
                                <span className="text-xs font-bold text-neutral-300">{fashionIcon.everydayStyle}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {fashionIcon.trends && fashionIcon.trends.length > 0 && (
                      <div className="space-y-6">
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 px-2 ${theme.accent}`}>Trendsetting Moments</h4>
                        {fashionIcon.trends.map((trend: any, idx: number) => (
                          <div key={idx} className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                            <div className="flex justify-between items-start mb-4 pl-4">
                              <h5 className="text-lg font-black text-white">{trend.trend || trend.outfit}</h5>
                              {(trend.whenStarted || trend.year) && (
                                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${theme.badgeTheme}`}>{trend.whenStarted || trend.year}</span>
                              )}
                            </div>
                            <p className="text-neutral-400 text-sm leading-relaxed pl-4 mb-4">{trend.impact || trend.adoption || trend.description}</p>
                            {trend.film && (
                                <span className={`text-[10px] ml-4 font-bold uppercase tracking-widest text-neutral-500 border border-white/5 px-2 py-1 rounded-md`}>Film: {trend.film}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* ========================================== */}
            {/* TAB 3: THE CRAFT / VISION */}
            {/* ========================================== */}
            {activeTab === "craft" && (
              <>
                {/* Villain Specialization */}
                {villainSpecialization && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Villain Specialization
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-red-500 opacity-50 group-hover:opacity-100 transition-opacity`} />
                      {Object.entries(villainSpecialization).map(([key, value]: [string, any]) => {
                        if (typeof value === 'string') {
                          return (
                            <div key={key} className="mb-6 pl-4 last:mb-0">
                              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-red-400`}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </h4>
                              <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                            </div>
                          );
                        } else if (Array.isArray(value)) {
                          return (
                            <div key={key} className="mb-6 pl-4 last:mb-0">
                              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-red-400`}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {value.map((item: string, i: number) => (
                                  <span key={i} className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] text-red-300 font-bold">{item}</span>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}

                {/* Iconic Antagonist Roles */}
                {iconicAntagonistRoles.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaFilm /> Iconic Antagonist Roles
                    </h3>
                    <div className="space-y-4">
                      {iconicAntagonistRoles.map((role: any, idx: number) => (
                        <div key={idx} className="p-6 md:p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                          <div className="pl-4">
                            <div className="flex flex-col md:flex-row gap-2 md:gap-6 md:items-center mb-3">
                              <h4 className="text-lg font-black text-white">{role.film || role.movie}</h4>
                              <span className="text-[10px] font-black uppercase tracking-widest text-red-400">{role.year} {role.language && `• ${role.language}`}</span>
                            </div>
                            {role.characterName && (
                              <div className="mb-2">
                                <span className="text-xs font-bold text-neutral-200">as </span>
                                <span className={`text-sm font-black text-red-400`}>{role.characterName}</span>
                              </div>
                            )}
                            {role.characterType && (
                              <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[9px] uppercase tracking-widest font-bold text-red-300 inline-block mb-3">{role.characterType}</span>
                            )}
                            {role.impact && <p className="text-neutral-400 text-sm leading-relaxed mt-2">{role.impact}</p>}
                            {role.iconicScene && <p className="text-neutral-500 text-xs leading-relaxed mt-2 italic border-l-2 border-red-500/30 pl-3">{role.iconicScene}</p>}
                            {role.heroOpposite && (
                              <div className="mt-3 flex items-center gap-2">
                                <span className="text-[9px] uppercase tracking-widest text-neutral-600 font-bold">vs</span>
                                <span className="text-xs font-bold text-white">{role.heroOpposite}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hero Antagonisms (Villain vs Hero matchups) */}
                {heroAntagonisms && Array.isArray(heroAntagonisms) && heroAntagonisms.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Hero Antagonisms
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {heroAntagonisms.map((matchup: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-red-500/20 transition-colors">
                          <div className="flex items-center gap-3 mb-3">
                            <span className={`text-lg font-black text-red-400`}>{matchup.hero || matchup.heroName}</span>
                          </div>
                          <div className="space-y-2">
                            {matchup.filmsCount && (
                              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-xs text-neutral-400">Films Together</span>
                                <span className="text-sm font-black text-white">{matchup.filmsCount}</span>
                              </div>
                            )}
                            {matchup.chemistry && <p className="text-neutral-400 text-xs leading-relaxed mt-2">{matchup.chemistry}</p>}
                            {matchup.bestFilm && (
                              <div className="flex justify-between items-center border-b border-white/5 pb-2 mt-2">
                                <span className="text-xs text-neutral-400">Best Film</span>
                                <span className="text-xs font-bold text-white">{matchup.bestFilm}</span>
                              </div>
                            )}
                            {matchup.dynamicType && <p className="text-[10px] uppercase tracking-widest font-bold text-red-300 mt-2">{matchup.dynamicType}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dual Career (Jagapathi Babu) */}
                {dualCareer && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaChartBar /> Dual Career Analysis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {dualCareer.leadRoles && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 ${theme.accent}`}>Lead Roles Era</h4>
                          <p className="text-neutral-300 text-sm leading-relaxed">{dualCareer.leadRoles}</p>
                        </div>
                      )}
                      {dualCareer.antagonistRoles && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-red-400">Antagonist Roles Era</h4>
                          <p className="text-neutral-300 text-sm leading-relaxed">{dualCareer.antagonistRoles}</p>
                        </div>
                      )}
                      {dualCareer.careerBalance && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 md:col-span-2">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-neutral-400">Career Balance</h4>
                          <p className="text-neutral-300 text-sm leading-relaxed">{dualCareer.careerBalance}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Comedy Specialization */}
                {comedySpecialization && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Comedy Specialization
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-amber-500 opacity-50 group-hover:opacity-100 transition-opacity`} />
                      {Object.entries(comedySpecialization).map(([key, value]: [string, any]) => {
                        if (typeof value === 'string') {
                          return (
                            <div key={key} className="mb-6 pl-4 last:mb-0">
                              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-amber-400">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </h4>
                              <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                            </div>
                          );
                        } else if (Array.isArray(value)) {
                          return (
                            <div key={key} className="mb-6 pl-4 last:mb-0">
                              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-amber-400">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {value.map((item: string, i: number) => (
                                  <span key={i} className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] text-amber-300 font-bold">{item}</span>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}

                {/* Iconic Comedy Roles */}
                {iconicComedyRoles.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaFilm /> Iconic Comedy Roles
                    </h3>
                    <div className="space-y-4">
                      {iconicComedyRoles.map((role: any, idx: number) => (
                        <div key={idx} className="p-6 md:p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                          <div className="pl-4">
                            <div className="flex flex-col md:flex-row gap-2 md:gap-6 md:items-center mb-3">
                              <h4 className="text-lg font-black text-white">{role.film || role.movie}</h4>
                              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">{role.year} {role.language && `• ${role.language}`}</span>
                            </div>
                            {role.characterName && (
                              <div className="mb-2">
                                <span className="text-xs font-bold text-neutral-200">as </span>
                                <span className="text-sm font-black text-amber-400">{role.characterName}</span>
                              </div>
                            )}
                            {role.comedyType && (
                              <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[9px] uppercase tracking-widest font-bold text-amber-300 inline-block mb-3">{role.comedyType}</span>
                            )}
                            {role.impact && <p className="text-neutral-400 text-sm leading-relaxed mt-2">{role.impact}</p>}
                            {role.iconicScene && <p className="text-neutral-500 text-xs leading-relaxed mt-2 italic border-l-2 border-amber-500/30 pl-3">{role.iconicScene}</p>}
                            {role.iconicDialogue && <p className="text-neutral-500 text-xs leading-relaxed mt-2 italic border-l-2 border-amber-500/30 pl-3">"{role.iconicDialogue}"</p>}
                            {role.heroOpposite && (
                              <div className="mt-3 flex items-center gap-2">
                                <span className="text-[9px] uppercase tracking-widest text-neutral-600 font-bold">with</span>
                                <span className="text-xs font-bold text-white">{role.heroOpposite}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hero Comedy Partnerships */}
                {heroComedyPartnerships && Array.isArray(heroComedyPartnerships) && heroComedyPartnerships.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Hero Comedy Partnerships
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {heroComedyPartnerships.map((partner: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-amber-500/20 transition-colors">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-lg font-black text-amber-400">{partner.hero || partner.heroName}</span>
                          </div>
                          <div className="space-y-2">
                            {partner.filmsCount && (
                              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-xs text-neutral-400">Films Together</span>
                                <span className="text-sm font-black text-white">{partner.filmsCount}</span>
                              </div>
                            )}
                            {partner.chemistry && <p className="text-neutral-400 text-xs leading-relaxed mt-2">{partner.chemistry}</p>}
                            {partner.bestFilm && (
                              <div className="flex justify-between items-center border-b border-white/5 pb-2 mt-2">
                                <span className="text-xs text-neutral-400">Best Film</span>
                                <span className="text-xs font-bold text-white">{partner.bestFilm}</span>
                              </div>
                            )}
                            {partner.comedyDynamic && <p className="text-[10px] uppercase tracking-widest font-bold text-amber-300 mt-2">{partner.comedyDynamic}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Character Artist: Character Versatility */}
                {characterVersatility && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Character Versatility
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                      {Object.entries(characterVersatility).map(([key, value]: [string, any]) => {
                        if (typeof value === 'string') {
                          return (
                            <div key={key} className="mb-6 pl-4 last:mb-0">
                              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </h4>
                              <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                            </div>
                          );
                        } else if (Array.isArray(value)) {
                          return (
                            <div key={key} className="mb-6 pl-4 last:mb-0">
                              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 ${theme.accent}`}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {value.map((item: string, i: number) => (
                                  <span key={i} className={`px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-neutral-300 font-bold`}>{item}</span>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}

                {/* Character Artist: Acting Approach */}
                {actingApproach && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Acting Approach
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                      {Object.entries(actingApproach).map(([key, value]: [string, any]) => {
                        if (typeof value === 'string') {
                          return (
                            <div key={key} className="mb-6 pl-4 last:mb-0">
                              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </h4>
                              <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                            </div>
                          );
                        } else if (Array.isArray(value)) {
                          return (
                            <div key={key} className="mb-6 pl-4 last:mb-0">
                              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 ${theme.accent}`}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {value.map((item: string, i: number) => (
                                  <span key={i} className={`px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-neutral-300 font-bold`}>{item}</span>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}

                {/* Character Artist: Iconic Character Roles */}
                {iconicCharacterRoles.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaFilm /> Iconic Character Roles
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {iconicCharacterRoles.map((role: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                          <div className="pl-4">
                            <div className="flex flex-col gap-1 mb-3">
                              <h4 className="text-lg font-black text-white">{role.film || role.movie}</h4>
                              <span className={`text-[10px] font-black uppercase tracking-widest ${theme.accent}`}>{role.year} {role.language && `• ${role.language}`}</span>
                            </div>
                            {role.characterName && (
                              <div className="mb-2">
                                <span className="text-xs font-bold text-neutral-400">as </span>
                                <span className="text-sm font-black text-white">{role.characterName}</span>
                              </div>
                            )}
                            {role.characterType && (
                              <span className={`px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] uppercase tracking-widest font-bold text-neutral-300 inline-block mb-3`}>{role.characterType}</span>
                            )}
                            {role.impact && <p className="text-neutral-400 text-xs leading-relaxed mt-2">{role.impact}</p>}
                            {role.description && <p className="text-neutral-400 text-xs leading-relaxed mt-2">{role.description}</p>}
                            {role.iconicScene && <p className="text-neutral-500 text-[10px] leading-relaxed mt-2 italic border-l-2 border-white/10 pl-3">{role.iconicScene}</p>}
                            {role.iconicDialogue && <p className="text-neutral-500 text-[10px] leading-relaxed mt-2 italic border-l-2 border-white/10 pl-3">"{role.iconicDialogue}"</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Character Artist: Hero Partnerships */}
                {heroPartnerships && Array.isArray(heroPartnerships) && heroPartnerships.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Hero Partnerships
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {heroPartnerships.map((partner: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-lg font-black text-white">{partner.hero || partner.heroName}</span>
                          </div>
                          <div className="space-y-2">
                            {partner.filmsCount && (
                              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-xs text-neutral-400">Films Together</span>
                                <span className="text-sm font-black text-white">{partner.filmsCount}</span>
                              </div>
                            )}
                            {partner.partnership && <p className="text-neutral-400 text-xs leading-relaxed mt-2">{partner.partnership}</p>}
                            {partner.bestFilm && (
                              <div className="flex justify-between items-center border-b border-white/5 pb-2 mt-2">
                                <span className="text-xs text-neutral-400">Best Film</span>
                                <span className="text-xs font-bold text-white">{partner.bestFilm}</span>
                              </div>
                            )}
                            {partner.dynamicType && <p className={`text-[10px] uppercase tracking-widest font-bold ${theme.accent} mt-2`}>{partner.dynamicType}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Character Artist: Director Collaborations */}
                {directorCollaborations && Array.isArray(directorCollaborations) && directorCollaborations.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaFilm /> Director Collaborations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {directorCollaborations.map((collab: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-lg font-black text-white">{collab.directorName || collab.director}</span>
                          </div>
                          <div className="space-y-2">
                            {collab.filmsTogether && (
                              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-xs text-neutral-400">Films Together</span>
                                <span className="text-sm font-black text-white">{collab.filmsTogether}</span>
                              </div>
                            )}
                            {collab.partnership && <p className="text-neutral-400 text-xs leading-relaxed mt-2">{collab.partnership}</p>}
                            {collab.films && Array.isArray(collab.films) && (
                              <div className="mt-4 space-y-2">
                                {collab.films.map((film: any, i: number) => (
                                  <div key={i} className="flex flex-col gap-1 text-xs border-l-2 border-white/10 pl-2">
                                    <span className="font-bold text-neutral-300">{film.title} <span className="text-neutral-500">({film.year})</span></span>
                                    {film.character && <span className={`text-[9px] uppercase tracking-widest ${theme.accent}`}>{film.character}</span>}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Singer: Vocal Profile */}
                {vocalProfile && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaMicrophone /> Vocal Profile
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(vocalProfile).map(([key, value]: [string, any]) => (
                          <div key={key} className="pl-4">
                            <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                            {typeof value === 'string' ? (
                              <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                            ) : Array.isArray(value) ? (
                              <ul className="space-y-1">
                                {value.map((item: string, i: number) => (
                                  <li key={i} className="text-neutral-300 text-sm leading-relaxed flex items-center gap-2">
                                    <span className={`w-1 h-1 rounded-full ${theme.accentBg}`} /> {item}
                                  </li>
                                ))}
                              </ul>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Singer: Genre Versatility */}
                {genreVersatility && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaMusic /> Genre Mastery
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(genreVersatility).map(([genre, data]: [string, any]) => (
                        <div key={genre} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden group">
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${data.expertise === 'Mastery' ? theme.accentBg : data.expertise === 'Strong' ? 'bg-neutral-400' : 'bg-neutral-600'} opacity-50 group-hover:opacity-100 transition-opacity`} />
                          <div className="pl-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-black text-white uppercase tracking-tight">{genre.replace(/([A-Z])/g, ' $1').trim()}</h4>
                              <span className={`text-[10px] font-black uppercase tracking-widest ${data.expertise === 'Mastery' ? theme.accent : 'text-neutral-400'}`}>{data.expertise}</span>
                            </div>
                            {data.iconicSongs && Array.isArray(data.iconicSongs) && (
                              <div className="space-y-1 mt-3">
                                {data.iconicSongs.map((song: string, i: number) => (
                                  <p key={i} className="text-neutral-400 text-xs leading-relaxed border-l-2 border-white/10 pl-2">
                                    "{song}"
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Singer: Music Director Collaborations */}
                {musicDirectorCollaborations && Array.isArray(musicDirectorCollaborations) && musicDirectorCollaborations.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaHeadphones /> Maestro Collaborations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {musicDirectorCollaborations.map((collab: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-lg font-black text-white">{collab.musicDirectorName || collab.musicDirector}</span>
                            {collab.songsTogether && <span className={`text-sm font-black ${theme.accent}`}>{collab.songsTogether} <span className="text-[10px] text-neutral-500 uppercase">Songs</span></span>}
                          </div>
                          <div className="space-y-2">
                            {collab.partnership && <p className="text-neutral-400 text-xs leading-relaxed mt-2">{collab.partnership}</p>}
                            {collab.mostIconicSong && (
                              <div className="flex justify-between items-center border-b border-white/5 pb-2 mt-2">
                                <span className="text-xs text-neutral-400">Iconic Song</span>
                                <span className="text-xs font-bold text-white">{collab.mostIconicSong}</span>
                              </div>
                            )}
                            {collab.vocalarrangement && <p className={`text-[10px] leading-relaxed italic text-neutral-500 mt-2`}>{collab.vocalarrangement}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Singer: Duet Partnerships */}
                {duetPartnerships && Array.isArray(duetPartnerships) && duetPartnerships.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaUserFriends /> Duet Partnerships
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {duetPartnerships.map((partner: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-lg font-black text-white">{partner.partnerName || partner.partner}</span>
                            {partner.duetsTogether && <span className={`text-sm font-black ${theme.accent}`}>{partner.duetsTogether} <span className="text-[10px] text-neutral-500 uppercase">Duets</span></span>}
                          </div>
                          <div className="space-y-2">
                            {partner.vocalChemistry && <p className="text-neutral-400 text-xs leading-relaxed mt-2">{partner.vocalChemistry}</p>}
                            {partner.mostMemorableDuet && (
                              <div className="flex justify-between items-center border-b border-white/5 pb-2 mt-2">
                                <span className="text-xs text-neutral-400">Iconic Duet</span>
                                <span className="text-xs font-bold text-white">{partner.mostMemorableDuet}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Music Director Sonic Blueprint */}
                {musicalEssence && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaMusic /> Musical Essence
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                      
                      {Object.entries(musicalEssence).map(([key, value]) => {
                        if (typeof value !== 'string') return null;
                        return (
                          <div key={key} className="mb-6 pl-4 last:mb-0">
                            <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                            <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {orchestralProfile && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaMusic /> Orchestral Profile & Production
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {Object.entries(orchestralProfile).map(([key, value]) => {
                        if (typeof value !== 'string' && !Array.isArray(value)) return null;
                        return (
                          <div key={key} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                            <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-neutral-500`}>
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                            {typeof value === 'string' ? (
                              <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                            ) : (
                              <ul className="space-y-2">
                                {value.map((item: string, i: number) => (
                                  <li key={i} className="text-neutral-300 text-xs flex gap-2"><span className={`${theme.accent} shrink-0`}>•</span>{item}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {musicalInnovations && musicalInnovations.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Musical Innovations
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {musicalInnovations.map((innovation: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-xs font-bold text-white mb-2`}>{innovation.innovation || innovation.title}</h4>
                          <p className="text-neutral-400 text-sm leading-relaxed">{innovation.description || innovation.impact}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Director Visionary Essence */}
                {visionaryEssence && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaFilm /> The Vision
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                      
                      {visionaryEssence.directorialVision && (
                        <div className="mb-6 pl-4">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>Directorial Vision</h4>
                          <p className="text-neutral-300 text-sm leading-relaxed">{visionaryEssence.directorialVision}</p>
                        </div>
                      )}
                      
                      {visionaryEssence.signatureStyle && (
                        <div className="mb-6 pl-4">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>Signature Style</h4>
                          <p className="text-neutral-300 text-sm leading-relaxed">{visionaryEssence.signatureStyle}</p>
                        </div>
                      )}

                      {visionaryEssence.recurringThemes && (
                        <div className="mb-6 pl-4">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>Recurring Themes</h4>
                          <p className="text-neutral-400 text-sm leading-relaxed">{visionaryEssence.recurringThemes}</p>
                        </div>
                      )}

                      {visionaryEssence.culturalImpact && (
                        <div className="mb-6 pl-4">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>Cultural Impact</h4>
                          <p className="text-neutral-300 text-sm leading-relaxed italic border-l-2 border-white/10 pl-4">{visionaryEssence.culturalImpact}</p>
                        </div>
                      )}
                      
                      {visionaryEssence.cinemaRevolution && (
                        <div className="pl-4">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>Cinema Revolution</h4>
                          <p className="text-neutral-400 text-sm leading-relaxed">{visionaryEssence.cinemaRevolution}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Director Filmmaking Style */}
                {filmmakingStyle && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <span className={theme.accent}>✦</span> Filmmaking Style
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {filmmakingStyle.approach && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-neutral-500`}>Approach</h4>
                          <p className="text-neutral-300 text-sm leading-relaxed">{filmmakingStyle.approach}</p>
                        </div>
                      )}
                      {filmmakingStyle.visualLanguage && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-neutral-500`}>Visual Language</h4>
                          <p className="text-neutral-300 text-sm leading-relaxed">{filmmakingStyle.visualLanguage}</p>
                        </div>
                      )}
                      {filmmakingStyle.editingStyle && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-neutral-500`}>Editing Style</h4>
                          <p className="text-neutral-300 text-sm leading-relaxed">{filmmakingStyle.editingStyle}</p>
                        </div>
                      )}
                      {filmmakingStyle.soundDesign && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-neutral-500`}>Sound Design</h4>
                          <p className="text-neutral-300 text-sm leading-relaxed">{filmmakingStyle.soundDesign}</p>
                        </div>
                      )}
                      {filmmakingStyle.actorDirection && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 md:col-span-2">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-neutral-500`}>Actor Direction</h4>
                          <p className="text-neutral-300 text-sm leading-relaxed">{filmmakingStyle.actorDirection}</p>
                        </div>
                      )}
                    </div>
                    
                    {(filmmakingStyle.technicalInnovations || filmmakingStyle.thematicPreoccupations || filmmakingStyle.styleEvolution) && (
                      <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5">
                        {filmmakingStyle.styleEvolution && (
                          <div className="mb-6">
                            <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>Style Evolution</h4>
                            <p className="text-neutral-300 text-sm leading-relaxed italic">{filmmakingStyle.styleEvolution}</p>
                          </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {filmmakingStyle.technicalInnovations && (
                            <div>
                              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-neutral-500`}>Technical Innovations</h4>
                              {Array.isArray(filmmakingStyle.technicalInnovations) ? (
                                <ul className="space-y-2">
                                  {filmmakingStyle.technicalInnovations.map((item: string, i: number) => (
                                    <li key={i} className="text-neutral-400 text-xs flex gap-2"><span className={`${theme.accent} shrink-0`}>•</span>{item}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-neutral-400 text-sm leading-relaxed">{filmmakingStyle.technicalInnovations}</p>
                              )}
                            </div>
                          )}
                          {filmmakingStyle.thematicPreoccupations && filmmakingStyle.thematicPreoccupations.length > 0 && (
                            <div>
                              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-neutral-500`}>Thematic Preoccupations</h4>
                              <ul className="space-y-2">
                                {filmmakingStyle.thematicPreoccupations.map((item: string, i: number) => (
                                  <li key={i} className="text-neutral-400 text-xs flex gap-2"><span className={`${theme.accent} shrink-0`}>•</span>{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Iconic Roles (Legend) */}
                {iconicRoles.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Cinematic Milestones
                    </h3>
                    <div className="space-y-6">
                      {iconicRoles.map((role: any, idx: number) => (
                        <div key={idx} className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                          
                          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-4 pl-4">
                            <div>
                              <h4 className="text-2xl font-black tracking-tight text-white mb-1">{role.characterName}</h4>
                              <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">{role.film} ({role.year})</span>
                            </div>
                            <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shrink-0 text-center">
                              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme.accent} block`}>Role Type</span>
                              <span className="text-sm font-bold text-white">{role.roleType}</span>
                            </div>
                          </div>
                          
                          <div className="pl-4 space-y-3">
                            <p className="text-neutral-300 text-sm leading-relaxed"><span className="text-neutral-500 font-bold mr-2">Significance:</span>{role.significance}</p>
                            <p className="text-neutral-400 text-xs leading-relaxed"><span className="text-neutral-500 font-bold mr-2">Impact:</span>{role.culturalImpact}</p>
                            {role.legendaryQuote && (
                              <p className="text-neutral-300 text-xs italic bg-black/50 p-3 rounded-lg border border-white/5">"{role.legendaryQuote}"</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                            <span className="text-xs text-neutral-500">{dialogue.context}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Collaborations */}
                {(collaborations?.frequentDirectors || filmmakerRelationships?.frequentDirectors) && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 mt-12">Visionary Partners (Directors)</h3>
                    <div className="flex overflow-x-auto gap-4 pb-8 no-scrollbar snap-x">
                      {(collaborations?.frequentDirectors || filmmakerRelationships?.frequentDirectors).map((collab: any, idx: number) => (
                        <div key={idx} className="w-[300px] md:w-[400px] shrink-0 p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 snap-start flex flex-col justify-between whitespace-normal">
                          <div>
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-black text-white shrink-0">
                                {collab.name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="text-lg font-black text-white leading-tight">{collab.name}</h4>
                                <span className={`text-[9px] uppercase tracking-widest ${theme.accent}`}>{collab.filmCount} Films</span>
                              </div>
                            </div>
                            {(collab.partnership || collab.chemistry) && (
                              <p className="text-sm text-neutral-400 leading-relaxed mb-6 italic">"{collab.partnership || collab.chemistry}"</p>
                            )}
                          </div>
                          <div>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {(Array.isArray(collab.films) ? collab.films : []).map((film: any, i: number) => (
                                <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-widest text-neutral-300 border border-white/5">
                                  {typeof film === 'string' ? film : film.title}
                                </span>
                              ))}
                            </div>
                            {collab.legacy && (
                              <p className="text-xs text-neutral-500 mt-2"><strong className="text-neutral-400">Legacy:</strong> {collab.legacy}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {screenChemistryByCostar && (
                  <div className="p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] mb-8 mt-12">
                    <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Chemistry Breakdown</h4>
                    <div className="space-y-4">
                      {screenChemistryByCostar.bestChemistry && (
                        <div>
                          <span className="text-neutral-500 text-[10px] uppercase tracking-widest font-bold mb-1 block">Best Chemistry</span>
                          <p className="text-neutral-300 text-sm leading-relaxed">{screenChemistryByCostar.bestChemistry}</p>
                        </div>
                      )}
                      {screenChemistryByCostar.chemistryComparisonAcrossActors && (
                        <div>
                          <span className="text-neutral-500 text-[10px] uppercase tracking-widest font-bold mb-1 block">Actor Comparison</span>
                          <p className="text-neutral-300 text-sm leading-relaxed">{screenChemistryByCostar.chemistryComparisonAcrossActors}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {(collaborations?.frequentHeroines || filmmakerRelationships?.frequentHeroines) && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 mt-12">On-Screen Chemistry</h3>
                    <div className="flex overflow-x-auto gap-4 pb-8 no-scrollbar snap-x">
                      {(collaborations?.frequentHeroines || filmmakerRelationships?.frequentHeroines).map((collab: any, idx: number) => (
                        <div key={idx} className="w-[300px] md:w-[400px] shrink-0 p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 snap-start flex flex-col justify-between whitespace-normal">
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-black text-white shrink-0">
                                  {collab.name.charAt(0)}
                                </div>
                                <div>
                                  <h4 className="text-lg font-black text-white leading-tight">{collab.name}</h4>
                                  <span className={`text-[9px] uppercase tracking-widest ${theme.accent}`}>{collab.filmCount} Films</span>
                                </div>
                              </div>
                              {collab.fanFollowing && <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded ${theme.badgeTheme}`}>{collab.fanFollowing}</span>}
                            </div>
                            {(collab.chemistry || collab.relationship) && (
                              <p className="text-sm text-neutral-400 leading-relaxed mb-4 italic">"{collab.chemistry || collab.relationship}"</p>
                            )}
                          </div>
                          {collab.films && (
                            <div className="flex flex-wrap gap-2">
                              {(Array.isArray(collab.films) ? collab.films : []).map((film: any, i: number) => (
                                <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-widest text-neutral-300 border border-white/5">
                                  {typeof film === 'string' ? film : film.title}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {(screenChemistry?.frequentLeadMen) && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 mt-12">On-Screen Chemistry</h3>
                    <div className="flex overflow-x-auto gap-4 pb-8 no-scrollbar snap-x">
                      {screenChemistry.frequentLeadMen.map((collab: any, idx: number) => (
                        <div key={idx} className="w-[300px] md:w-[400px] shrink-0 p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 snap-start flex flex-col justify-between whitespace-normal">
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-black text-white shrink-0">
                                  {collab.actorName.charAt(0)}
                                </div>
                                <div>
                                  <h4 className="text-lg font-black text-white leading-tight">{collab.actorName}</h4>
                                  <span className={`text-[9px] uppercase tracking-widest ${theme.accent}`}>{collab.pairingCount} Films</span>
                                </div>
                              </div>
                            </div>
                            {(collab.chemistry) && (
                              <p className="text-sm text-neutral-400 leading-relaxed mb-4 italic">"{collab.chemistry}"</p>
                            )}
                            {collab.fanFollowing && <p className={`text-[10px] text-neutral-500 leading-relaxed mb-4`}>Fan Following: {collab.fanFollowing}</p>}
                          </div>
                          {collab.latestFilm && (
                            <div className="flex flex-wrap gap-2">
                              <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-widest text-neutral-300 border border-white/5">
                                Latest: {collab.latestFilm}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {(collaborations?.musicDirectors || filmmakerRelationships?.musicDirectors) && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 mt-4">Musical Synergy</h3>
                    <div className="flex overflow-x-auto gap-4 pb-8 no-scrollbar snap-x">
                      {(collaborations?.musicDirectors || filmmakerRelationships?.musicDirectors).map((collab: any, idx: number) => (
                        <div key={idx} className="w-[300px] md:w-[400px] shrink-0 p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 snap-start whitespace-normal">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                              <FaMusic className="text-neutral-400" />
                            </div>
                            <div>
                              <h4 className="text-lg font-black text-white leading-tight">{collab.name || collab.musicDirector}</h4>
                              {collab.filmCount && <span className={`text-[9px] uppercase tracking-widest ${theme.accent}`}>{collab.filmCount} Films</span>}
                            </div>
                          </div>
                          {(collab.relationship || collab.chemistry) && (
                            <p className="text-sm text-neutral-400 leading-relaxed mb-4 italic">"{collab.relationship || collab.chemistry}"</p>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {(collab.legendaryCompositions || collab.films || []).map((comp: any, i: number) => (
                              <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-widest text-neutral-300 border border-white/5">
                                {typeof comp === 'string' ? comp : comp.title}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Director Collaborations */}
                {(collaborations?.heroCollaborations || collaborations?.heroineCollaborations || collaborations?.cinematographers) && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 mt-8 flex items-center gap-3">
                      <FaFilm /> Iconic Collaborations
                    </h3>
                    
                    {collaborations.heroCollaborations && (
                      <div className="mb-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-4 px-2">Hero Collaborations</h4>
                        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x">
                          {collaborations.heroCollaborations.map((collab: any, idx: number) => (
                            <div key={idx} className="w-[300px] md:w-[400px] shrink-0 p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 snap-start whitespace-normal flex flex-col justify-between">
                              <div>
                                <h4 className="text-lg font-black text-white mb-2">{collab.actor}</h4>
                                {collab.legacy && <p className="text-sm text-neutral-400 leading-relaxed mb-4 italic">"{collab.legacy}"</p>}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {(collab.films || []).map((film: string, i: number) => (
                                  <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-widest text-neutral-300 border border-white/5">
                                    {film}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {collaborations.heroineCollaborations && (
                      <div className="mb-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-4 px-2">Heroine Collaborations</h4>
                        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x">
                          {collaborations.heroineCollaborations.map((collab: any, idx: number) => (
                            <div key={idx} className="w-[300px] md:w-[400px] shrink-0 p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 snap-start whitespace-normal flex flex-col justify-between">
                              <div>
                                <h4 className="text-lg font-black text-white mb-2">{collab.actor}</h4>
                                {collab.legacy && <p className="text-sm text-neutral-400 leading-relaxed mb-4 italic">"{collab.legacy}"</p>}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {(collab.films || []).map((film: string, i: number) => (
                                  <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-widest text-neutral-300 border border-white/5">
                                    {film}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {collaborations.cinematographers && (
                      <div className="mb-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-4 px-2">Cinematographers</h4>
                        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x">
                          {collaborations.cinematographers.map((collab: any, idx: number) => (
                            <div key={idx} className="w-[300px] md:w-[400px] shrink-0 p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 snap-start whitespace-normal flex flex-col justify-between">
                              <div>
                                <h4 className="text-lg font-black text-white mb-2">{collab.name || collab.cinematographer}</h4>
                                {collab.visualStyle && <p className="text-sm text-neutral-400 leading-relaxed mb-4 italic">"{collab.visualStyle}"</p>}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {(collab.films || []).map((film: string, i: number) => (
                                  <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-widest text-neutral-300 border border-white/5">
                                    {film}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
                          <span className="text-xs text-neutral-400 text-right max-w-[60%]">{artist}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Playback Singers */}
                {voiceProfile?.playbackSingers && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">Musical Voices</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {voiceProfile.playbackSingers.primary && (
                        <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5 flex items-center justify-between">
                          <span className="text-xs font-bold text-white uppercase tracking-wide">Primary Voice</span>
                          <span className="text-xs text-neutral-400 text-right max-w-[60%]">{voiceProfile.playbackSingers.primary}</span>
                        </div>
                      )}
                      {voiceProfile.playbackSingers.others?.map((singer: string, idx: number) => (
                        <div key={idx} className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5 flex items-center justify-between">
                          <span className="text-xs font-bold text-white uppercase tracking-wide">Frequent Voice</span>
                          <span className="text-xs text-neutral-400 text-right max-w-[60%]">{singer}</span>
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
                {/* Political Career (Legend) */}
                {politicalCareer && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Political Empire
                    </h3>
                    <div className={`p-10 rounded-[2rem] bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/5 relative overflow-hidden ${theme.glowColor}`}>
                      <div className="absolute -right-10 -bottom-10 opacity-[0.03]">
                        <FaStar size={250} />
                      </div>
                      <div className="relative z-10 flex flex-col md:flex-row gap-8 justify-between">
                        <div className="flex-1">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2 block">Party Founded</span>
                          <h3 className={`text-4xl md:text-5xl font-black tracking-tighter ${theme.accent} mb-2`}>
                            {politicalCareer.partyFounded}
                          </h3>
                          <p className="text-neutral-400 text-sm italic font-bold">"{politicalCareer.foundingPrinciple}"</p>
                          <span className="text-xs text-neutral-500 block mt-2">Founded: {politicalCareer.foundingDate}</span>
                        </div>
                        <div className="flex flex-col justify-center items-start md:items-end">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-1 block">Electoral Victories</span>
                          <span className="text-6xl font-black text-white">{politicalCareer.electoralVictories}</span>
                        </div>
                      </div>

                      {/* Chief Minister Terms */}
                      {politicalCareer.chiefMinisterTerms && (
                        <div className="mt-8">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-neutral-500">Chief Minister Terms</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {politicalCareer.chiefMinisterTerms.map((term: any, idx: number) => (
                              <div key={idx} className="p-4 rounded-xl bg-[#050505] border border-white/5 relative group">
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-20 group-hover:opacity-100 transition-opacity rounded-l-xl`} />
                                <div className="pl-4">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-1">Term {term.termNumber} ({term.duration})</span>
                                  <p className="text-sm font-bold text-white mb-2">{term.period}</p>
                                  <p className="text-xs text-neutral-500">{term.achievement}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Major Policies */}
                      {politicalCareer.majorPolicies && (
                        <div className="mt-8">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-neutral-500">Major Policies</h4>
                          <div className="flex flex-wrap gap-2">
                            {politicalCareer.majorPolicies.map((policy: string, idx: number) => (
                              <span key={idx} className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-widest text-neutral-300 border border-white/5">
                                {policy}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Campaign Innovations */}
                      {politicalCareer.campaignInnovations && (
                        <div className="mt-8">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-neutral-500">Campaign Innovations</h4>
                          <ul className="space-y-2">
                            {politicalCareer.campaignInnovations.map((innovation: string, idx: number) => (
                              <li key={idx} className="text-neutral-400 text-xs flex gap-2"><span className={`${theme.accent} shrink-0`}>•</span>{innovation}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

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
                          <p className="text-xs text-neutral-400">{car.notes}</p>
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
                {financial?.businessVentures && (typeof financial.businessVentures === 'string' ? financial.businessVentures.length > 0 : true) && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">Corporate Ventures</h3>
                    {Array.isArray(financial.businessVentures) ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {financial.businessVentures.map((venture: any, idx: number) => (
                          <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 group hover:border-white/10 transition-colors">
                            <span className={`text-[9px] uppercase tracking-widest ${theme.accent} font-bold mb-1 block`}>{venture.industry || venture.type}</span>
                            <h4 className="text-lg font-black text-white mb-1">{venture.name}</h4>
                            {venture.stake && <span className="text-xs text-neutral-500 block mb-1">{venture.stake}</span>}
                            {venture.role && <span className="text-xs text-neutral-400 block">{venture.role}</span>}
                            {venture.status && <span className={`text-[9px] uppercase tracking-widest ${theme.accent} font-bold block mt-2`}>{venture.status}</span>}
                            {venture.notes && <p className="text-neutral-500 text-[10px] leading-relaxed mt-2">{venture.notes}</p>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                        <p className="text-sm text-neutral-400 leading-relaxed">{financial.businessVentures}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Earnings Breakdown (Superstar) */}
                {financial?.earnings && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">Earnings Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(financial.earnings).map(([key, val]: [string, any]) => (
                        <div key={key} className="p-5 rounded-xl bg-[#0a0a0a] border border-white/5">
                          <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="text-sm font-bold text-neutral-300">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Investments (Legend) */}
                {financial?.investments && Array.isArray(financial.investments) && financial.investments.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">Investments</h3>
                    <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                      <ul className="space-y-2">
                        {financial.investments.map((inv: string, i: number) => (
                          <li key={i} className="text-neutral-400 text-xs leading-relaxed flex gap-2"><span className={`${theme.accent} shrink-0`}>•</span>{inv}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Assets (Legend) */}
                {financial?.assets && Array.isArray(financial.assets) && financial.assets.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">Asset Portfolio</h3>
                    <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                      <ul className="space-y-2">
                        {financial.assets.map((asset: string, i: number) => (
                          <li key={i} className="text-neutral-400 text-xs leading-relaxed flex gap-2"><span className="text-neutral-600 shrink-0">—</span>{asset}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Endorsements */}
                {(financial?.endorsements || financial?.brandEndorsements) && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">Brand Portfolio</h3>
                    {Array.isArray(financial.endorsements) ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {financial.endorsements.map((brand: any, idx: number) => (
                          <div key={idx} className="p-5 rounded-xl bg-[#0a0a0a] border border-white/5 group hover:border-white/10 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-bold text-white">{brand.brand}</h4>
                              {brand.annualDeal && <span className={`text-xs font-bold ${theme.accent}`}>{brand.annualDeal}</span>}
                            </div>
                            <span className="text-[10px] text-neutral-500 block mb-1">{brand.category}</span>
                            {brand.status && <span className={`text-[9px] uppercase tracking-widest font-bold block mb-1 ${brand.status?.includes('Active') ? 'text-green-500' : 'text-neutral-600'}`}>{brand.status}</span>}
                            {brand.notes && <p className="text-neutral-500 text-[10px] leading-relaxed mt-1">{brand.notes}</p>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                        <p className="text-sm text-neutral-400 leading-relaxed">{financial.endorsements || financial.brandEndorsements}</p>
                      </div>
                    )}
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

                {/* Brand Value (Director) */}
                {brandValue && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">Brand Value</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {brandValue.estimatedFeePerFilm && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Estimated Fee</span>
                          <span className={`text-2xl font-black ${theme.accent}`}>{brandValue.estimatedFeePerFilm}</span>
                        </div>
                      )}
                      {brandValue.marketValue && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 md:col-span-2">
                          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Market Position</span>
                          <p className="text-neutral-300 text-sm leading-relaxed">{brandValue.marketValue}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ========================================== */}
            {/* TAB: CAREER (Stats & Achievements) */}
            {/* ========================================== */}
            {activeTab === "career" && (
              <>
                {/* Career Retrospective (Legend) */}
                {careerRetrospective && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaChartBar /> Career Retrospective
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center">
                        <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Total Films</span>
                        <span className={`text-3xl font-black text-white`}>{careerRetrospective.totalCareerFilms}</span>
                      </div>
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center">
                        <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Hit Ratio</span>
                        <span className={`text-3xl font-black ${theme.accent}`}>{careerRetrospective.hitPercentage?.replace(/[^0-9%]/g, '') || "N/A"}</span>
                      </div>
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center col-span-2">
                        <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Peak Era</span>
                        <span className={`text-lg font-black text-white block`}>{careerRetrospective.peakPeriod?.split(' - ')[0] || "N/A"}</span>
                      </div>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 mb-8">
                      <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>The Arc</h4>
                      <p className="text-neutral-300 text-sm leading-relaxed">{careerRetrospective.careerArc}</p>
                    </div>

                    {/* Decade by Decade */}
                    {careerRetrospective.byDecade && (
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-neutral-500">Decade Breakdown</h4>
                        <div className="space-y-4">
                          {Object.entries(careerRetrospective.byDecade).map(([decade, data]: [string, any]) => {
                            if (!data || !data.contribution) return null;
                            return (
                              <div key={decade} className="p-6 rounded-2xl bg-[#050505] border border-white/5 flex flex-col md:flex-row gap-6 relative group overflow-hidden">
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-20 group-hover:opacity-100 transition-opacity`} />
                                <div className="w-24 shrink-0">
                                  <span className={`text-2xl font-black ${theme.accent}`}>{decade}</span>
                                  {data.filmCount && <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 block mt-1">{data.filmCount} Films</span>}
                                </div>
                                <div className="flex-1">
                                  {data.peakStatus && <h5 className="text-sm font-bold text-white mb-2">{data.peakStatus}</h5>}
                                  <p className="text-xs text-neutral-400 leading-relaxed mb-3">{data.contribution}</p>
                                  {data.majorFilms && data.majorFilms.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                      {data.majorFilms.map((film: string, i: number) => (
                                        <span key={i} className="px-2 py-1 bg-white/5 rounded text-[9px] uppercase tracking-widest text-neutral-300 border border-white/5">
                                          {film}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Career Stats Hero */}
                {careerStats && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2">Career Dashboard</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      {(careerStats.totalMovies || careerStats.totalFilms || careerStats.totalFilmsDirected) && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center">
                          <span className={`text-3xl font-black ${theme.accent}`}>{careerStats.totalMovies || careerStats.totalFilms || careerStats.totalFilmsDirected}</span>
                          <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mt-1">Total Films</span>
                        </div>
                      )}
                      {(careerStats.totalBlockbusters || careerStats.blockbusters) && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center">
                          <span className={`text-3xl font-black ${theme.accent}`}>{careerStats.totalBlockbusters || careerStats.blockbusters}</span>
                          <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mt-1">Blockbusters</span>
                        </div>
                      )}
                      {careerStats.hitPercentage && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center">
                          <span className={`text-3xl font-black ${theme.accent}`}>{careerStats.hitPercentage}</span>
                          <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mt-1">Hit Rate</span>
                        </div>
                      )}
                      {careerStats.nationalAwards && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center">
                          <span className={`text-3xl font-black ${theme.accent}`}>{careerStats.nationalAwards}</span>
                          <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mt-1">National Awards</span>
                        </div>
                      )}
                      {(careerStats.yearsActive || careerStats.careerSpan) && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center">
                          <span className={`text-3xl font-black ${theme.accent}`}>{careerStats.yearsActive || careerStats.careerSpan}</span>
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

                {/* Box Office Milestones */}
                {boxOfficeMilestones && (
                  <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 mb-8 mt-8">
                    <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-6 ${theme.accent}`}>Box Office Milestones</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                        <span className="text-xs text-neutral-400 block mb-1">Career Gross</span>
                        <span className="text-lg font-black text-white">{boxOfficeMilestones.totalCareerBoxOffice || 'N/A'}</span>
                      </div>
                      <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                        <span className="text-xs text-neutral-400 block mb-1">Hit Rate</span>
                        <span className="text-lg font-black text-white">{boxOfficeMilestones.hitPercentage || 'N/A'}</span>
                      </div>
                    </div>
                    {boxOfficeMilestones.highestGrossingFilms && (
                      <div className="mt-4">
                        <h5 className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-3">Highest Grossing Films</h5>
                        <div className="space-y-2">
                          {boxOfficeMilestones.highestGrossingFilms.map((film: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-black/50 border border-white/5">
                              <span className="text-xs font-bold text-neutral-200">{film.film} <span className="text-[10px] font-normal text-neutral-500">({film.year})</span></span>
                              <span className={`text-xs font-black ${theme.accent}`}>{film.collection}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Awards By Type */}
                {awardsByType && (
                  <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 mb-8 mt-8">
                    <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-6 ${theme.accent}`}>Awards Overview</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {awardsByType.totalAwardsWon && (
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-xs text-neutral-400">Total Won</span>
                          <span className="text-sm font-black text-white">{awardsByType.totalAwardsWon}</span>
                        </div>
                      )}
                      {awardsByType.totalNominations && (
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-xs text-neutral-400">Nominations</span>
                          <span className="text-sm font-black text-white">{awardsByType.totalNominations}</span>
                        </div>
                      )}
                      {awardsByType.nationalAwards && (
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-xs text-neutral-400">National</span>
                          <span className="text-sm font-black text-white">{awardsByType.nationalAwards}</span>
                        </div>
                      )}
                      {awardsByType.stateAwards && (
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-xs text-neutral-400">State</span>
                          <span className="text-sm font-black text-white">{awardsByType.stateAwards}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Genre Strength Radar */}
                {genreStrength && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">Genre Mastery</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(genreStrength).map(([genre, data]: [string, any]) => (
                        <div key={genre} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 group hover:border-white/10 transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-black text-white uppercase tracking-tight">{data.genre || genre}</h4>
                            <span className={`text-lg font-black ${theme.accent}`}>{data.rating || data.score || 0}<span className="text-neutral-600 text-xs">/100</span></span>
                          </div>
                          <div className="w-full h-1.5 bg-white/5 rounded-full mb-3 overflow-hidden">
                            <div className={`h-full ${theme.accentBg} rounded-full`} style={{ width: `${data.rating || data.score || 0}%` }} />
                          </div>
                          
                          {data.strength && <p className="text-neutral-500 text-[10px] leading-relaxed mb-3">{data.strength}</p>}
                          {data.strengths && (
                            <ul className="space-y-1 mb-3">
                              {data.strengths.map((s: string, i: number) => (
                                <li key={i} className="text-neutral-500 text-[10px] leading-relaxed">• {s}</li>
                              ))}
                            </ul>
                          )}
                          
                          {(data.iconicFilm || (data.iconicFilms && data.iconicFilms.length > 0)) && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {data.iconicFilm && (
                                <span className="px-2 py-0.5 bg-white/5 rounded text-[8px] uppercase tracking-widest text-neutral-400 border border-white/5">{data.iconicFilm}</span>
                              )}
                              {data.iconicFilms?.map((f: string, i: number) => (
                                <span key={i} className="px-2 py-0.5 bg-white/5 rounded text-[8px] uppercase tracking-widest text-neutral-400 border border-white/5">{f}</span>
                              ))}
                            </div>
                          )}
                          {data.notes && <p className="text-neutral-600 text-[10px] leading-relaxed mt-2 italic">{data.notes}</p>}
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

                {/* Streaming Dominance */}
                {streamingDominance && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8 flex items-center gap-2"><FaChartBar /> Streaming & Digital Dominance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {streamingDominance.digitalInfluenceScore && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 md:col-span-2 text-center flex flex-col items-center justify-center">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2 block">Digital Influence Score</span>
                          <span className={`text-6xl font-black ${theme.accent}`}>{streamingDominance.digitalInfluenceScore}</span>
                        </div>
                      )}
                      
                      {Object.entries(streamingDominance).map(([key, value]: [string, any]) => {
                        if (key === 'digitalInfluenceScore') return null;
                        if (typeof value === 'string') {
                          return (
                            <div key={key} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                              <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                            </div>
                          );
                        } else if (typeof value === 'object' && value !== null) {
                          return (
                            <div key={key} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-white capitalize flex items-center gap-2`}>
                                {key} Platform
                              </h4>
                              <div className="space-y-3">
                                {value.followers && (
                                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                    <span className="text-xs text-neutral-400">Followers</span>
                                    <span className={`text-sm font-black ${theme.accent}`}>{value.followers.toLocaleString()}</span>
                                  </div>
                                )}
                                {value.subscribers && (
                                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                    <span className="text-xs text-neutral-400">Subscribers</span>
                                    <span className={`text-sm font-black text-red-500`}>{value.subscribers.toLocaleString()}</span>
                                  </div>
                                )}
                                {value.totalListens && (
                                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                    <span className="text-xs text-neutral-400">Total Listens</span>
                                    <span className="text-sm font-black text-white">{value.totalListens}</span>
                                  </div>
                                )}
                                {value.monthlyListeners && (
                                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                    <span className="text-xs text-neutral-400">Monthly Listeners</span>
                                    <span className={`text-sm font-black ${theme.accent}`}>{value.monthlyListeners.toLocaleString()}</span>
                                  </div>
                                )}
                                {value.totalStreams && (
                                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                    <span className="text-xs text-neutral-400">Total Streams</span>
                                    <span className="text-sm font-black text-white">{value.totalStreams}</span>
                                  </div>
                                )}
                                {value.subscribersOnChannel && (
                                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                    <span className="text-xs text-neutral-400">Subscribers</span>
                                    <span className={`text-sm font-black text-red-500`}>{value.subscribersOnChannel.toLocaleString()}</span>
                                  </div>
                                )}
                                {value.mostViewedSong && (
                                  <div className="flex flex-col gap-1 border-b border-white/5 pb-2">
                                    <span className="text-xs text-neutral-400">Most Viewed Song</span>
                                    <span className="text-xs font-black text-white">{value.mostViewedSong}</span>
                                  </div>
                                )}
                                {value.totalViews && (
                                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                    <span className="text-xs text-neutral-400">Total Views</span>
                                    <span className="text-sm font-black text-white">{value.totalViews}</span>
                                  </div>
                                )}
                                {value.topSongs && Array.isArray(value.topSongs) && (
                                  <div className="flex flex-col gap-1 mt-2">
                                    <span className="text-xs text-neutral-400 mb-1">Top Songs</span>
                                    <div className="flex flex-wrap gap-1">
                                      {value.topSongs.map((song: string, i: number) => (
                                        <span key={i} className="text-[9px] px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-neutral-300">{song}</span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}

                {/* Singer: Chartbuster Songs */}
                {chartbusterSongs && Array.isArray(chartbusterSongs) && chartbusterSongs.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaCompactDisc /> Chartbuster Songs
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {chartbusterSongs.map((song: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                          <div className="pl-4">
                            <div className="flex flex-col gap-1 mb-3">
                              <h4 className="text-lg font-black text-white">{song.song || song.title}</h4>
                              <span className={`text-[10px] font-black uppercase tracking-widest ${theme.accent}`}>{song.film} ({song.year})</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {song.musicDirector && <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] uppercase tracking-widest font-bold text-neutral-300">MD: {song.musicDirector}</span>}
                              {song.chartPerformance && <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] uppercase tracking-widest font-bold text-neutral-300">📈 {song.chartPerformance}</span>}
                            </div>
                            {song.significance && <p className="text-neutral-400 text-xs leading-relaxed mt-2">{song.significance}</p>}
                            {song.culturalImpact && <p className="text-neutral-500 text-[10px] leading-relaxed mt-2 italic border-l-2 border-white/10 pl-3">{song.culturalImpact}</p>}
                            {(song.spotifyPlays || song.youtubeViews) && (
                              <div className="flex gap-4 mt-3 pt-3 border-t border-white/5">
                                {song.spotifyPlays && <span className="text-[10px] font-black text-neutral-400"><FaSpotify className="inline mr-1" /> {song.spotifyPlays}</span>}
                                {song.youtubeViews && <span className="text-[10px] font-black text-neutral-400"><FaYoutube className="inline mr-1 text-red-500" /> {song.youtubeViews}</span>}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Singer: Songs Sung */}
                {songsSung && Array.isArray(songsSung) && songsSung.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaMusic /> Iconic Discography
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {songsSung.map((song: any, idx: number) => (
                        <div key={idx} className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors flex justify-between items-center group">
                          <div>
                            <h4 className="text-sm font-black text-white mb-1 group-hover:text-neutral-200 transition-colors">{song.song || song.title}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-neutral-500">{song.film}</span>
                              <span className={`text-[8px] font-black uppercase tracking-widest ${theme.accent}`}>{song.language || 'Telugu'}</span>
                            </div>
                          </div>
                          <span className="text-xs font-black text-neutral-600">{song.year}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Commercial Impact (Music Director) */}
                {commercialImpact && (
                  <div className="mt-8">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 flex items-center gap-2"><FaStar /> Commercial Impact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center flex flex-col items-center justify-center">
                        <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">100 Crore Club</span>
                        <span className={`text-4xl font-black ${theme.accent}`}>{commercialImpact['100CroreClub']}</span>
                      </div>
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center md:col-span-2 flex flex-col items-center justify-center">
                        <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Average Film Collection</span>
                        <span className="text-4xl font-black text-white">{commercialImpact.averageFilmCollection}</span>
                      </div>
                    </div>
                    {commercialImpact.commercialReliability && (
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 mb-6">
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>Commercial Reliability</h4>
                        <p className="text-neutral-300 text-sm leading-relaxed">{commercialImpact.commercialReliability}</p>
                      </div>
                    )}
                    {commercialImpact.boxOfficeDriven && (
                      <div>
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-neutral-500 px-2`}>Box Office Driven Soundtracks</h4>
                        <div className="space-y-3">
                          {commercialImpact.boxOfficeDriven.map((film: any, i: number) => (
                            <div key={i} className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center p-4 rounded-xl bg-[#0a0a0a] border border-white/5">
                              <div>
                                <span className="text-sm font-bold text-white">{film.film} <span className="text-[10px] font-normal text-neutral-500">({film.year})</span></span>
                                <p className="text-xs text-neutral-400 mt-1 max-w-lg">{film.musicRole}</p>
                              </div>
                              <span className={`text-xs font-black shrink-0 px-3 py-1 rounded bg-green-500/10 text-green-500 border border-green-500/20`}>{film.boxOffice}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Careers Timeline */}
                {careersTimeline && careersTimeline.length > 0 && (
                  <div className="mt-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaChartBar /> Career Timeline
                    </h3>
                    <div className="space-y-6">
                      {careersTimeline.map((item: any, idx: number) => (
                        <div key={idx} className="flex flex-col md:flex-row gap-4 md:gap-6 p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <span className={`text-xl font-black ${theme.accent} shrink-0 w-24`}>{item.period || item.decade}</span>
                          <div>
                            <h4 className="text-sm font-bold text-white mb-2">{item.phase || item.title || item.period}</h4>
                            <p className="text-neutral-400 text-sm leading-relaxed">{item.description}</p>
                            {item.keyFilms && item.keyFilms.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {item.keyFilms.map((film: string, i: number) => (
                                  <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-neutral-300">{film}</span>
                                ))}
                              </div>
                            )}
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
                {/* Legendary Moments (Villain) */}
                {legendaryMoments && Array.isArray(legendaryMoments) && legendaryMoments.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Legendary Moments
                    </h3>
                    <div className="space-y-4">
                      {legendaryMoments.map((moment: any, idx: number) => (
                        <div key={idx} className="p-6 md:p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                          <div className="pl-4">
                            <div className="flex flex-col md:flex-row gap-2 md:gap-4 md:items-center mb-2">
                              <h4 className="text-sm font-black text-white">{moment.film || moment.movie}</h4>
                              {moment.year && <span className="text-[10px] font-black uppercase tracking-widest text-red-400">{moment.year}</span>}
                            </div>
                            {moment.moment && <p className="text-neutral-300 text-sm leading-relaxed">{moment.moment}</p>}
                            {moment.description && <p className="text-neutral-300 text-sm leading-relaxed">{moment.description}</p>}
                            {moment.impact && <p className="text-neutral-500 text-xs leading-relaxed mt-2 italic">{moment.impact}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Legendary Comedy Moments */}
                {legendaryComedyMoments && Array.isArray(legendaryComedyMoments) && legendaryComedyMoments.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Legendary Comedy Moments
                    </h3>
                    <div className="space-y-4">
                      {legendaryComedyMoments.map((moment: any, idx: number) => (
                        <div key={idx} className="p-6 md:p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                          <div className="pl-4">
                            <div className="flex flex-col md:flex-row gap-2 md:gap-4 md:items-center mb-2">
                              <h4 className="text-sm font-black text-white">{moment.film || moment.movie}</h4>
                              {moment.year && <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">{moment.year}</span>}
                            </div>
                            {moment.moment && <p className="text-neutral-300 text-sm leading-relaxed">{moment.moment}</p>}
                            {moment.description && <p className="text-neutral-300 text-sm leading-relaxed">{moment.description}</p>}
                            {moment.impact && <p className="text-neutral-500 text-xs leading-relaxed mt-2 italic">{moment.impact}</p>}
                            {moment.dialogue && <p className="text-amber-300/60 text-xs leading-relaxed mt-2 italic border-l-2 border-amber-500/30 pl-3">"{moment.dialogue}"</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Character Artist: Memorable Scenes */}
                {memorableScenes && Array.isArray(memorableScenes) && memorableScenes.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Memorable Scenes
                    </h3>
                    <div className="space-y-4">
                      {memorableScenes.map((scene: any, idx: number) => (
                        <div key={idx} className="p-6 md:p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                          <div className="pl-4">
                            <div className="flex flex-col gap-1 mb-3">
                              <h4 className="text-sm font-black text-white">{scene.film || scene.movie}</h4>
                              <span className={`text-[10px] font-black uppercase tracking-widest ${theme.accent}`}>{scene.year}</span>
                            </div>
                            {scene.scene && <p className="text-neutral-300 text-sm leading-relaxed mb-2">{scene.scene}</p>}
                            {scene.description && <p className="text-neutral-400 text-xs leading-relaxed">{scene.description}</p>}
                            {scene.impact && <p className="text-neutral-500 text-[10px] leading-relaxed mt-2 italic border-l-2 border-white/10 pl-3">{scene.impact}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Singer: Live Performances */}
                {livePerformances && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaGlobe /> Global Stage Presence
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-4">
                        <div>
                          {livePerformances.concertCareer && (
                            <div className="mb-4">
                              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>Concert Career</h4>
                              <p className="text-neutral-300 text-sm leading-relaxed">{livePerformances.concertCareer}</p>
                            </div>
                          )}
                          {livePerformances.stagePresence && (
                            <div className="mb-4">
                              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>Stage Presence</h4>
                              <p className="text-neutral-300 text-sm leading-relaxed">{livePerformances.stagePresence}</p>
                            </div>
                          )}
                        </div>
                        <div>
                          {livePerformances.notableConcerts && Array.isArray(livePerformances.notableConcerts) && (
                            <div className="mb-4">
                              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>Notable Concerts</h4>
                              <ul className="space-y-2">
                                {livePerformances.notableConcerts.map((concert: any, i: number) => (
                                  <li key={i} className="text-neutral-300 text-xs flex justify-between items-center border-b border-white/5 pb-1">
                                    <span>{concert.event} <span className="text-[9px] text-neutral-500 block">{concert.location}</span></span>
                                    <span className="font-black text-neutral-500">{concert.year}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Singer: Musical Family */}
                {musicalFamily && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaHeart /> Personal & Legacy
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {musicalFamily.musicalLegacy && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>Musical Legacy</h4>
                          <p className="text-neutral-300 text-sm leading-relaxed">{musicalFamily.musicalLegacy}</p>
                        </div>
                      )}
                      {musicalFamily.childrenSingers && Array.isArray(musicalFamily.childrenSingers) && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>Next Generation</h4>
                          <ul className="space-y-2">
                            {musicalFamily.childrenSingers.map((child: any, i: number) => (
                              <li key={i} className="text-neutral-300 text-sm border-l-2 border-white/10 pl-2">
                                <span className="font-bold text-white">{child.name}</span>
                                {child.profession && <span className="text-[10px] block text-neutral-500 mt-1">{child.profession}</span>}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Industry Standing (Director) */}
                {industryStanding && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Industry Standing
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {industryStanding.currentRank && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Current Rank</span>
                          <span className={`text-xl font-black ${theme.accent}`}>{industryStanding.currentRank}</span>
                        </div>
                      )}
                      {industryStanding.producerConfidence && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Producer Confidence</span>
                          <p className="text-neutral-300 text-xs leading-relaxed">{industryStanding.producerConfidence}</p>
                        </div>
                      )}
                      {industryStanding.peerRespect && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Peer Respect</span>
                          <p className="text-neutral-300 text-xs leading-relaxed">{industryStanding.peerRespect}</p>
                        </div>
                      )}
                      {industryStanding.starPreference && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Star Preference</span>
                          <p className="text-neutral-300 text-xs leading-relaxed">{industryStanding.starPreference}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Controversies & Triumphs */}
                {controversiesOrTriumphs && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Triumphs & Resilience
                    </h3>
                    
                    {(controversiesOrTriumphs.resilience || controversiesOrTriumphs.personalTriumphs) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {controversiesOrTriumphs.resilience && (
                          <div className="p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a]">
                            <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Resilience</h4>
                            <p className="text-neutral-300 text-sm leading-relaxed">{controversiesOrTriumphs.resilience}</p>
                          </div>
                        )}
                        {controversiesOrTriumphs.personalTriumphs && (
                          <div className="p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a]">
                            <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Personal Triumphs</h4>
                            <p className="text-neutral-300 text-sm leading-relaxed">{controversiesOrTriumphs.personalTriumphs}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {controversiesOrTriumphs.majorChallenges && controversiesOrTriumphs.majorChallenges.length > 0 && (
                      <div className="mb-6">
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-neutral-500`}>Major Challenges</h4>
                        <div className="space-y-4">
                          {controversiesOrTriumphs.majorChallenges.map((challenge: any, idx: number) => (
                            <div key={idx} className="p-6 rounded-2xl border border-white/5 bg-[#0a0a0a] flex flex-col md:flex-row gap-6">
                              <div className="w-full md:w-1/4 shrink-0">
                                <span className="text-xs font-bold text-white block mb-1">{challenge.period}</span>
                                <span className={`text-[10px] uppercase tracking-widest ${theme.accent}`}>{challenge.challenge}</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-neutral-400 text-sm leading-relaxed mb-3">{challenge.description}</p>
                                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                  <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">Outcome</span>
                                  <span className="text-xs text-neutral-200">{challenge.outcome}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {controversiesOrTriumphs.comebackStories && controversiesOrTriumphs.comebackStories.length > 0 && (
                      <div>
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-neutral-500`}>Comeback Stories</h4>
                        <div className="grid grid-cols-1 gap-4">
                          {controversiesOrTriumphs.comebackStories.map((story: any, idx: number) => (
                            <div key={idx} className="p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-[#0a0a0a] to-[#050505] relative overflow-hidden group">
                              <div className={`absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent`} />
                              <div className="flex justify-between items-start mb-3 relative z-10">
                                <h5 className="text-sm font-bold text-white">{story.story}</h5>
                                <span className={`text-[10px] uppercase tracking-widest px-2 py-1 bg-white/5 rounded ${theme.accent}`}>{story.period}</span>
                              </div>
                              <p className="text-neutral-400 text-xs leading-relaxed relative z-10"><span className="font-bold text-neutral-500">Breakthrough:</span> {story.breakthrough}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Historical Impact (Legend) */}
                {historicalImpact && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Historical Impact
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 mb-6 relative overflow-hidden group">
                      <div className={`absolute left-0 top-0 right-0 h-1 ${theme.accentBg} opacity-50`} />
                      <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Cinematic Revolution</h4>
                      <p className="text-neutral-300 text-sm leading-relaxed mb-6">{historicalImpact.cinematicRevolution}</p>
                      
                      {historicalImpact.recordsSet && (
                        <div className="mb-6">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-neutral-500">Records Set</h4>
                          <ul className="space-y-2">
                            {historicalImpact.recordsSet.map((record: string, i: number) => (
                              <li key={i} className="text-neutral-400 text-xs leading-relaxed flex gap-2"><span className={`${theme.accent} shrink-0`}>•</span>{record}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {historicalImpact.techniquesIntroduced && (
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-neutral-500">Techniques Introduced</h4>
                          <div className="flex flex-wrap gap-2">
                            {historicalImpact.techniquesIntroduced.map((tech: string, i: number) => (
                              <span key={i} className="px-3 py-1.5 bg-white/5 rounded border border-white/5 text-[10px] uppercase tracking-widest text-neutral-300">{tech}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Influence and Legacy (Maestro) */}
                {influenceAndLegacy && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Influence & Legacy
                    </h3>
                    
                    {influenceAndLegacy.cinemaRevolution && (
                      <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 mb-6 relative overflow-hidden group">
                        <div className={`absolute left-0 top-0 right-0 h-1 ${theme.accentBg} opacity-50`} />
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Cinema Revolution</h4>
                        <p className="text-neutral-300 text-sm leading-relaxed mb-6">{influenceAndLegacy.cinemaRevolution}</p>
                        
                        {influenceAndLegacy.timelineSignificance && (
                          <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-neutral-500">Timeline Significance</h4>
                            <p className="text-neutral-400 text-sm leading-relaxed">{influenceAndLegacy.timelineSignificance}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {influenceAndLegacy.directorsInfluenced && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Directors Influenced</h4>
                          <ul className="space-y-2">
                            {influenceAndLegacy.directorsInfluenced.map((director: string, i: number) => (
                              <li key={i} className="text-neutral-300 text-xs flex gap-2"><span className={`${theme.accent} shrink-0`}>•</span>{director}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {influenceAndLegacy.cinematicInnovations && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Cinematic Innovations</h4>
                          <ul className="space-y-2">
                            {influenceAndLegacy.cinematicInnovations.map((innovation: string, i: number) => (
                              <li key={i} className="text-neutral-300 text-xs flex gap-2"><span className={`${theme.accent} shrink-0`}>•</span>{innovation}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Mentorship Influence (Legend) */}
                {mentorshipInfluence && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Mentorship & Influence
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {mentorshipInfluence.actorsMentored && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Actors Mentored</h4>
                          <div className="space-y-4">
                            {mentorshipInfluence.actorsMentored.map((mentee: any, i: number) => (
                              <div key={i}>
                                <span className="text-sm font-bold text-white block mb-1">{mentee.name}</span>
                                <span className="text-xs text-neutral-500">{mentee.significance}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {mentorshipInfluence.directorsInfluenced && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Directors Influenced</h4>
                          <div className="space-y-4">
                            {mentorshipInfluence.directorsInfluenced.map((mentee: any, i: number) => (
                              <div key={i}>
                                <span className="text-sm font-bold text-white block mb-1">{mentee.name}</span>
                                <span className="text-xs text-neutral-500">{mentee.films || mentee.significance}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Industry Contribution (Legend) */}
                {industryContribution && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Industry Contribution
                    </h3>
                    {industryContribution.firsts && (
                      <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 mb-6">
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Historic Firsts</h4>
                        <ul className="space-y-3">
                          {industryContribution.firsts.map((first: string, i: number) => (
                            <li key={i} className="text-neutral-300 text-sm leading-relaxed flex gap-3"><span className={`font-black ${theme.accent} shrink-0`}>{i+1}.</span>{first}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* International Recognition (Legend) */}
                {internationalRecognition && internationalRecognition.filmFestivalRecognitions && internationalRecognition.filmFestivalRecognitions.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Global Footprint
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {internationalRecognition.filmFestivalRecognitions.map((fest: any, i: number) => (
                        <div key={i} className="p-6 rounded-2xl bg-[#050505] border border-white/5 relative">
                          <h4 className="text-sm font-bold text-white mb-1">{fest.festival}</h4>
                          <span className={`text-[10px] uppercase tracking-widest font-black ${theme.accent} block mb-3`}>{fest.year}</span>
                          <p className="text-xs text-neutral-400">{fest.recognition}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Critical Appreciation (Legend) */}
                {criticalAppreciation && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Critical Appreciation
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5">
                      <p className="text-neutral-300 text-sm leading-relaxed mb-6 italic">"{criticalAppreciation.criticalAnalysis}"</p>
                      {criticalAppreciation.biographicalBooks && criticalAppreciation.biographicalBooks.length > 0 && (
                        <div>
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Biographical Literature</h4>
                          <ul className="space-y-2">
                            {criticalAppreciation.biographicalBooks.map((book: string, i: number) => (
                              <li key={i} className="text-neutral-400 text-xs leading-relaxed flex gap-2"><span className="text-neutral-600 shrink-0">—</span>{book}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

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

                    {/* Foundations */}
                    {philanthropy.foundations && philanthropy.foundations.length > 0 && (
                      <div className="mb-6">
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 px-2 ${theme.accent}`}>Foundations</h4>
                        <div className="space-y-4">
                          {philanthropy.foundations.map((f: any, idx: number) => (
                            <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-black text-white">{f.name}</h4>
                                {f.established && <span className="text-[10px] text-neutral-500 font-bold">Est. {f.established}</span>}
                              </div>
                              {f.annualBudget && <span className={`text-xs font-bold ${theme.accent} block mb-3`}>{f.annualBudget} /year</span>}
                              {f.focus && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {f.focus.map((area: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-widest text-neutral-300 border border-white/5">{area}</span>
                                  ))}
                                </div>
                              )}
                              {f.majorInitiatives && (
                                <ul className="space-y-1">
                                  {f.majorInitiatives.map((mi: string, i: number) => (
                                    <li key={i} className="text-neutral-500 text-[10px] leading-relaxed flex gap-2"><span className="text-neutral-600 shrink-0">—</span>{mi}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Initiatives */}
                    {philanthropy.initiatives && philanthropy.initiatives.length > 0 && (
                      <div className="space-y-4 mb-6">
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

                    {/* Recognitions */}
                    {philanthropy.recognitions && philanthropy.recognitions.length > 0 && (
                      <div>
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 px-2 ${theme.accent}`}>Recognitions</h4>
                        <div className="space-y-3">
                          {philanthropy.recognitions.map((rec: any, idx: number) => (
                            <div key={idx} className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5 flex items-center justify-between">
                              <div>
                                <span className="text-sm font-bold text-white">{rec.award}</span>
                                <span className="text-[10px] text-neutral-500 block">{rec.givenBy}</span>
                              </div>
                              <span className={`text-xs font-bold ${theme.accent}`}>{rec.year}</span>
                            </div>
                          ))}
                        </div>
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
            {/* TAB: TRAJECTORY (Rising Stars Only) */}
            {/* ========================================== */}
            {activeTab === "trajectory" && (
              <>
                {/* Career Trajectory */}
                {careerTrajectory && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaChartBar /> Career Trajectory
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center">
                        <span className={`text-3xl font-black ${theme.accent}`}>{careerTrajectory.totalFilms}</span>
                        <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mt-1">Total Films</span>
                      </div>
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center">
                        <span className={`text-3xl font-black text-white`}>{careerTrajectory.hitPercentage}</span>
                        <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mt-1">Hit Rate</span>
                      </div>
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center col-span-2">
                        <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Trend</span>
                        <span className={`text-lg font-black text-white block`}>{careerTrajectory.careerTrend}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {careerTrajectory.boxOfficeGrowth && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>Box Office Growth</h4>
                          <p className="text-neutral-400 text-sm leading-relaxed">{careerTrajectory.boxOfficeGrowth}</p>
                        </div>
                      )}
                      {careerTrajectory.trajectoryAnalysis && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>Analysis</h4>
                          <p className="text-neutral-400 text-sm leading-relaxed">{careerTrajectory.trajectoryAnalysis}</p>
                        </div>
                      )}
                    </div>
                    
                    {careerTrajectory.filmography && careerTrajectory.filmography.length > 0 && (
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 overflow-x-auto">
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-neutral-500`}>Key Projects</h4>
                        <div className="min-w-[600px]">
                          <div className="grid grid-cols-6 gap-4 text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-3 px-2">
                            <span className="col-span-2">Film</span>
                            <span>Role</span>
                            <span>Box Office</span>
                            <span className="col-span-2">Verdict</span>
                          </div>
                          {careerTrajectory.filmography.map((film: any, i: number) => (
                            <div key={i} className="grid grid-cols-6 gap-4 items-center p-3 rounded-xl hover:bg-white/5 border border-transparent transition-colors">
                              <div className="col-span-2">
                                <span className="text-sm font-bold text-white block">{film.film}</span>
                                <span className={`text-[9px] font-black ${theme.accent}`}>{film.year} • {film.language}</span>
                              </div>
                              <span className="text-xs text-neutral-400">{film.character}</span>
                              <span className="text-xs text-neutral-300 font-bold">{film.collection}</span>
                              <div className="col-span-2">
                                <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest inline-block mb-1 ${film.verdict?.includes('Hit') || film.verdict?.includes('Success') || film.verdict?.includes('Blockbuster') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{film.verdict}</span>
                                <p className="text-[10px] text-neutral-500 line-clamp-2" title={film.criticalResponse}>{film.criticalResponse}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Unique Selling Proposition */}
                {uniqueSellingProposition && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Unique Selling Proposition
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(uniqueSellingProposition).map(([key, value]: [string, any]) => (
                        <div key={key} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                          <p className="text-neutral-400 text-sm leading-relaxed">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Superstar Potential Bento */}
                {superstarpotential && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaChartBar /> Potential Forecast
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] ${theme.glowColor}`}>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2 block">Likelihood</span>
                        <span className={`text-4xl font-black ${theme.accent}`}>{superstarpotential.likelihood}</span>
                      </div>
                      <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] md:col-span-2 ${theme.glowColor}`}>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2 block">Estimated Timeline</span>
                        <span className="text-3xl font-black text-white">{superstarpotential.estimatedTimeline || superstarpotential.timelineToEstablish}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a]">
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-6 ${theme.accent}`}>The Roadmap (Required Factors)</h4>
                        <ul className="space-y-4">
                          {superstarpotential.requiredFactors.map((factor: string, i: number) => (
                            <li key={i} className="text-neutral-300 text-sm leading-relaxed flex gap-3">
                              <span className={`font-black ${theme.accent} shrink-0`}>→</span>{factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a]">
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Long-term Forecast</h4>
                        <p className="text-neutral-400 text-sm leading-relaxed">{superstarpotential.forecast}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Detailed Social Influence */}
                {detailedSocialInfluence && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Digital Influence
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] ${theme.glowColor} col-span-1 md:col-span-2 flex flex-col items-center text-center justify-center`}>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2 block">Influence Score</span>
                        <span className={`text-6xl font-black ${theme.accent}`}>{detailedSocialInfluence.digitalInfluenceScore}</span>
                        <p className="text-neutral-400 mt-4 text-sm max-w-lg">{detailedSocialInfluence.socialMediaStrategy}</p>
                      </div>
                      
                      {detailedSocialInfluence.instagram && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-[#E1306C]`}>Instagram</h4>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                              <span className="text-xs text-neutral-400">Followers</span>
                              <span className="text-sm font-black text-white">{detailedSocialInfluence.instagram.followers?.toLocaleString() || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                              <span className="text-xs text-neutral-400">Engagement</span>
                              <span className="text-sm font-black text-white">{detailedSocialInfluence.instagram.engagementRate}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                              <span className="text-xs text-neutral-400">Level</span>
                              <span className="text-sm font-black text-white">{detailedSocialInfluence.instagram.influencerLevel}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {detailedSocialInfluence.youtube && detailedSocialInfluence.youtube.active && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-[#FF0000]`}>YouTube</h4>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                              <span className="text-xs text-neutral-400">Channel</span>
                              <span className="text-sm font-black text-white">{detailedSocialInfluence.youtube.channel}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                              <span className="text-xs text-neutral-400">Subscribers</span>
                              <span className="text-sm font-black text-white">{detailedSocialInfluence.youtube.subscribers?.toLocaleString() || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Market & Fanbase Analysis */}
                {fanbaseAnalysis && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Market & Fanbase
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2 block">Primary Demographic</span>
                        <p className="text-sm text-white leading-relaxed">{fanbaseAnalysis.primaryDemographic}</p>
                      </div>
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2 block">Social Media Influence</span>
                        <p className="text-sm text-neutral-400 leading-relaxed">{fanbaseAnalysis.socialMediaInfluence}</p>
                      </div>
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 block">Geographic Reach</span>
                        <span className="text-sm font-bold text-white">{fanbaseAnalysis.geographicReach}</span>
                      </div>
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 block">Loyalty Level</span>
                        <span className={`text-sm font-black ${theme.accent}`}>{fanbaseAnalysis.loyaltyLevel}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Competitor Comparison */}
                {competitorComparison && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaChartBar /> Competitive Analysis
                    </h3>
                    
                    <div className="p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] mb-6">
                      <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Unique Differentiator</h4>
                      <p className="text-neutral-300 text-sm leading-relaxed">{competitorComparison.uniqueDifference}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a]">
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Competitive Edge</h4>
                        <p className="text-neutral-400 text-sm leading-relaxed">{competitorComparison.competitiveEdge}</p>
                      </div>
                      
                      {competitorComparison.peersInSamePhase && (
                        <div className="p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a]">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-6 ${theme.accent}`}>Peers in Same Phase</h4>
                          <div className="space-y-3">
                            {competitorComparison.peersInSamePhase.map((peer: string, idx: number) => {
                              const [name, desc] = peer.split(' (');
                              return (
                                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5">
                                  <span className="text-sm font-bold text-white block mb-1">{name}</span>
                                  {desc && <span className="text-[10px] text-neutral-500 uppercase tracking-widest">{desc.replace(')', '')}</span>}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {/* Upcoming Projects */}
                {upcomingProjects && upcomingProjects.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaFilm /> Upcoming Projects
                    </h3>
                    <div className="space-y-4">
                      {upcomingProjects.map((project: any, idx: number) => (
                        <div key={idx} className="p-6 md:p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                          
                          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-4 pl-4">
                            <div>
                              <h4 className="text-xl font-black text-white mb-1">{project.film}</h4>
                              <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">{project.genre} • {project.expectedRelease}</span>
                            </div>
                            <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 shrink-0">
                              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme.accent} block text-center`}>Status</span>
                              <span className="text-sm font-bold text-white block text-center">{project.status}</span>
                            </div>
                          </div>

                          <div className="pl-4 grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div>
                              <p className="text-neutral-400 text-sm leading-relaxed mb-3"><span className="text-neutral-500 font-bold mr-2 block mb-1">Significance:</span>{project.significance}</p>
                              <div className="flex gap-4">
                                {project.hero && (
                                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-white/5 border border-white/10 rounded text-neutral-300">Hero: {project.hero}</span>
                                )}
                                {project.budget && (
                                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-white/5 border border-white/10 rounded text-neutral-300">Budget: {project.budget}</span>
                                )}
                              </div>
                            </div>
                            {project.expectations && (
                              <div className="flex flex-col justify-center items-center p-4 rounded-xl bg-white/5 border border-white/5">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2 block">Expectations</span>
                                <span className={`text-xl font-black ${theme.accent}`}>{project.expectations}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Future Outlook */}
                {futureOutlook && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaChartBar /> Future Outlook
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {futureOutlook.nextPhase && (
                        <div className={`p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 md:col-span-2 ${theme.glowColor}`}>
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Next Phase</h4>
                          <p className="text-neutral-300 text-sm leading-relaxed">{futureOutlook.nextPhase}</p>
                        </div>
                      )}
                      {futureOutlook.criticalFilm && (
                        <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Critical Turning Point</h4>
                          <p className="text-neutral-400 text-sm leading-relaxed">{futureOutlook.criticalFilm}</p>
                        </div>
                      )}
                      {futureOutlook.marketPosition && (
                        <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Market Position</h4>
                          <p className="text-neutral-400 text-sm leading-relaxed">{futureOutlook.marketPosition}</p>
                        </div>
                      )}
                      {futureOutlook.industrySentiment && (
                        <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 md:col-span-2">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Industry Sentiment</h4>
                          <p className="text-neutral-400 text-sm leading-relaxed">{futureOutlook.industrySentiment}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ========================================== */}
            {/* TAB: DISCOGRAPHY (Music Directors) */}
            {/* ========================================== */}
            {activeTab === "discography" && (
              <div className="flex flex-col gap-12">
                
                {backgroundScoreMastery && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Background Score Mastery
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                      {backgroundScoreMastery.map((score: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 flex flex-col md:flex-row gap-6">
                          <div className="md:w-1/3 shrink-0">
                            <h4 className="text-lg font-black text-white">{score.film}</h4>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${theme.accent} block mt-1`}>{score.year}</span>
                            {score.impact && <p className="text-neutral-500 text-xs italic mt-3 leading-relaxed border-l-2 border-white/10 pl-3">{score.impact}</p>}
                          </div>
                          <div className="flex-1">
                            {score.bgmApproach && (
                              <div className="mb-4">
                                <h5 className="text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-2">Approach</h5>
                                <p className="text-neutral-300 text-sm leading-relaxed">{score.bgmApproach}</p>
                              </div>
                            )}
                            {score.iconicScenes && (
                              <div className="mb-4">
                                <h5 className="text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-2">Iconic Scenes Enhanced</h5>
                                <div className="flex flex-wrap gap-2">
                                  {score.iconicScenes.map((scene: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-white/5 rounded-full border border-white/5 text-[10px] text-neutral-300">{scene}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {score.technicalAchievements && (
                              <div>
                                <h5 className="text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-2">Technical Achievement</h5>
                                <p className="text-neutral-400 text-xs leading-relaxed">{score.technicalAchievements}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {chartbusterSongs && chartbusterSongs.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaMusic /> Chartbuster Anthems
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {chartbusterSongs.map((song: any, idx: number) => (
                        <div key={idx} className="p-5 rounded-2xl bg-[#0a0a0a] border border-white/5 relative overflow-hidden group hover:border-white/20 transition-all">
                          <div className={`absolute top-0 right-0 w-2 h-full ${theme.accentBg} opacity-0 group-hover:opacity-100 transition-opacity`} />
                          <h4 className="text-sm font-bold text-white mb-1">{song.song || song.trackName}</h4>
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${theme.accent} block mb-3`}>{song.film} ({song.year})</span>
                          {song.genre && <span className="text-[9px] uppercase tracking-widest px-2 py-1 bg-white/5 rounded inline-block mb-3 text-neutral-400">{song.genre}</span>}
                          {song.impact && <p className="text-neutral-400 text-xs leading-relaxed">{song.impact}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {discography && discography.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaFilm /> Iconic Albums
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {discography.map((album: any, idx: number) => (
                        <div key={idx} className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5 flex flex-col items-center justify-center text-center">
                          <span className={`text-2xl mb-2 ${theme.accent}`}>🎵</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">{album.year || album.releaseYear}</span>
                          <h4 className="text-sm font-bold text-neutral-200">{album.album || album.title || album.film}</h4>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {recentFilmography && recentFilmography.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaFilm /> Iconic Filmography (Musical Milestones)
                    </h3>
                    <div className="space-y-6">
                      {recentFilmography.map((film: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 flex flex-col md:flex-row gap-6">
                          <div className="md:w-1/3 shrink-0">
                            <h4 className="text-lg font-black text-white">{film.film}</h4>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${theme.accent} block mt-1`}>{film.year} • {film.language}</span>
                            {film.director && <span className="text-[10px] uppercase tracking-widest text-neutral-500 block mt-1">Dir: {film.director}</span>}
                            {film.boxOffice && <span className="text-[10px] uppercase tracking-widest text-green-500 block mt-2 font-bold">Box Office: {film.boxOffice}</span>}
                          </div>
                          <div className="flex-1">
                            {film.chartbusterSongs && (
                              <div className="mb-4">
                                <h5 className="text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-2">Chartbusters</h5>
                                <div className="flex flex-wrap gap-2">
                                  {film.chartbusterSongs.map((song: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-white/5 rounded-full border border-white/5 text-[10px] text-neutral-300">{song}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {film.musicImpact && (
                              <div className="mb-4">
                                <h5 className="text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-2">Musical Impact</h5>
                                <p className="text-neutral-300 text-sm leading-relaxed">{film.musicImpact}</p>
                              </div>
                            )}
                            {film.significance && (
                              <div>
                                <h5 className="text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-2">Significance</h5>
                                <p className="text-neutral-400 text-xs leading-relaxed italic">{film.significance}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
              </div>
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
                            <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 block mt-1">{credit.character || credit.job}</span>
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
                      {personalInfo.familyInfo.spouse && (
                        <span className="text-[10px] text-neutral-400 mt-1">Spouse: {personalInfo.familyInfo.spouse}</span>
                      )}
                      {personalInfo.familyInfo.family?.siblings && personalInfo.familyInfo.family.siblings.length > 0 && (
                        <div className="mt-1 space-y-1">
                          {personalInfo.familyInfo.family.siblings.map((s: any, i: number) => (
                            <span key={i} className="text-[10px] text-neutral-400 block">{s.name} — {s.relationship || s.profession}</span>
                          ))}
                        </div>
                      )}
                      {personalInfo.familyInfo.children && personalInfo.familyInfo.children.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <span className="text-[9px] text-neutral-500 font-bold block">CHILDREN</span>
                          {personalInfo.familyInfo.children.map((c: any, i: number) => (
                            <span key={i} className="text-[10px] text-neutral-400 block">• {c.name} {c.profession ? `(${c.profession})` : ''}</span>
                          ))}
                        </div>
                      )}
                      {personalInfo.familyInfo.grandchildren && personalInfo.familyInfo.grandchildren.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <span className="text-[9px] text-neutral-500 font-bold block">GRANDCHILDREN</span>
                          {personalInfo.familyInfo.grandchildren.map((g: any, i: number) => (
                            <span key={i} className="text-[10px] text-neutral-400 block">• {g.name} {g.profession ? `(${g.profession})` : ''}</span>
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
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block">Instagram Following</span>
                      {social.instagram?.influencerLevel && <span className={`text-[8px] uppercase tracking-widest ${theme.badgeTheme} px-2 py-0.5 rounded font-bold`}>{social.instagram.influencerLevel}</span>}
                    </div>
                    <span className="text-xl font-black text-white block mb-4">{(social.instagram.followers / 1000000).toFixed(1)}M</span>
                    
                    {social.instagram?.contentType && (
                      <div className="mb-4">
                        <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Content Pillars</span>
                        <div className="flex flex-wrap gap-1.5">
                          {social.instagram.contentType.map((type: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 bg-white/5 rounded text-[8px] uppercase tracking-widest text-neutral-300 border border-white/10">{type}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {social.instagram?.viralMoments && (
                      <div className="mb-4">
                        <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">Viral Impact</span>
                        <p className="text-[10px] text-neutral-400 leading-relaxed">{social.instagram.viralMoments}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {social.socialMediaStrategy && (
                  <div className="mt-2 pt-4 border-t border-white/5">
                    <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">Digital Strategy</span>
                    <p className="text-[10px] text-neutral-400 leading-relaxed">{social.socialMediaStrategy}</p>
                  </div>
                )}

                {viralMoments && viralMoments.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-white/5">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-4 flex items-center gap-2">
                      <FaFire /> Viral Phenomenons
                    </h4>
                    <div className="space-y-4">
                      {viralMoments.map((vm: any, i: number) => (
                        <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10 relative overflow-hidden">
                          <h5 className="text-xs font-bold text-white mb-1">{vm.song || vm.track || vm.event}</h5>
                          <span className={`text-[8px] font-bold uppercase tracking-widest ${theme.accent} block mb-2`}>{vm.film} ({vm.year})</span>
                          <span className="text-[9px] px-2 py-0.5 bg-black/40 rounded text-neutral-400 inline-block mb-2 uppercase tracking-wider">{vm.viralOn}</span>
                          <p className="text-[10px] text-neutral-300 leading-relaxed italic border-l border-white/10 pl-2">{vm.trend}</p>
                        </div>
                      ))}
                    </div>
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
