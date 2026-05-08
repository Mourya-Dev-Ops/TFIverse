"use client";

import { useState, useMemo, useCallback, useTransition, Suspense } from "react";
import { FaInstagram, FaTwitter, FaImdb, FaCar, FaHome, FaStar, FaQuoteLeft, FaDumbbell, FaMoneyBillWave, FaFilm, FaCrown, FaChartBar, FaMusic, FaFire } from "react-icons/fa";
import { Edit3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SuggestionModal from "../../components/suggestion-modal";

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

import dynamic from "next/dynamic";

// ============================================================================
// LAZY-LOADED TABS — Only the active tab's JS is downloaded.
// Reduces initial bundle by ~300KB.
// ============================================================================

const tabLoader = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-8 w-48 bg-white/5 rounded-lg" />
    <div className="h-4 w-full bg-white/5 rounded" />
    <div className="h-4 w-3/4 bg-white/5 rounded" />
    <div className="h-32 w-full bg-white/5 rounded-2xl" />
    <div className="h-4 w-1/2 bg-white/5 rounded" />
  </div>
);

const OverviewTab = dynamic(() => import("../../../components/tabs/OverviewTab"), { loading: tabLoader, ssr: false });
const DossierTab = dynamic(() => import("../../../components/tabs/DossierTab"), { loading: tabLoader, ssr: false });
const CareerTab = dynamic(() => import("../../../components/tabs/CareerTab"), { loading: tabLoader, ssr: false });
const GlamourTab = dynamic(() => import("../../../components/tabs/GlamourTab"), { loading: tabLoader, ssr: false });
const CraftTab = dynamic(() => import("../../../components/tabs/CraftTab"), { loading: tabLoader, ssr: false });
const EmpireTab = dynamic(() => import("../../../components/tabs/EmpireTab"), { loading: tabLoader, ssr: false });
const LegacyTab = dynamic(() => import("../../../components/tabs/LegacyTab"), { loading: tabLoader, ssr: false });
const TrajectoryTab = dynamic(() => import("../../../components/tabs/TrajectoryTab"), { loading: tabLoader, ssr: false });
const MoviesTab = dynamic(() => import("../../../components/tabs/MoviesTab"), { loading: tabLoader, ssr: false });
const DiscographyTab = dynamic(() => import("../../../components/tabs/DiscographyTab"), { loading: tabLoader, ssr: false });
const GalleryTab = dynamic(() => import("../../../components/tabs/GalleryTab"), { loading: tabLoader, ssr: false });

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
  const hubCategory = category === "hero" ? "heroes" : category === "heroine" ? "heroines" : category === "pro" ? "pros" : `${category}s`;
  const theme = THEMES[hubCategory] || THEMES.default;
  const [activeTab, setActiveTab] = useState("overview");
  const [isPending, startTransition] = useTransition();
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);

  const handleTabSwitch = useCallback((tabId: string) => {
    startTransition(() => setActiveTab(tabId));
  }, []);

  // Safely extract deeply nested JSONB data
  const images = data.images || {};
  const personalInfo = data.personalInfo || {};
  const social = data.socialMedia || data.socialMediaInfluence || data.socialMediaPresence || {};
  
  // Aura extraction (all categories)
  const aura = data.heroAura || data.queenAura || data.divaAura || data.risingQueenAura || data.antagonistEssence || data.comedyEssence || data.characterEssence || data.singerEssence || data.producerEssence || data.cinematographyEssence || data.editingEssence || data.lyricalEssence || data.choreographyEssence || data.stuntEssence || data.artDirectionEssence || data.costumeEssence || data.vfxEssence || data.lineProducerEssence || data.proEssence || null;
  
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
  const careerStats = data.careerStats || data.careerStatistics || data.commercialStatistics || data.villainCareerStats || data.comedyCareerStats || data.characterStatistics || data.singingStatistics || data.productionStatistics || data.cinematographyStatistics || data.editingStatistics || data.lyricalStatistics || data.choreographyStatistics || data.stuntStatistics || data.artDirectionStatistics || data.costumeStatistics || data.vfxStatistics || data.coordinationStatistics || data.proStatistics || null;
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

  // Producer specific data
  const productionHouse = data.productionHouse || null;
  const productionByDecade = data.productionByDecade || null;
  const starCollaborations = data.starCollaborations || null;
  const talentDiscovery = data.talentDiscovery || null;
  const landmarkProductions = data.landmarkProductions || null;
  const productionApproach = data.productionApproach || null;

  // Cinematographer specific data
  const visualStyle = data.visualStyle || null;
  const technicalExpertise = data.technicalExpertise || null;
  const iconicVisuallyStunningFilms = data.iconicVisuallyStunningFilms || null;

  // Editor specific data
  const editingStyle = data.editingStyle || null;
  const pacingAndRhythm = data.pacingAndRhythm || null;
  const iconicEditedFilms = data.iconicEditedFilms || null;

  // Lyricist specific data
  const lyricalStyle = data.lyricalStyle || null;
  const teluguLanguageContribution = data.teluguLanguageContribution || null;
  const literaryWorks = data.literaryWorks || null;
  const famousLyricalLines = data.famousLyricalLines || null;
  const iconicSongsWritten = data.iconicSongsWritten || null;
  const frequentDirectorCollaborations = data.frequentDirectorCollaborations || null;

  // Choreographer specific data
  const danceStyle = data.danceStyle || null;
  const danceStyleVersatility = data.danceStyleVersatility || null;
  const actorCollaborations = data.actorCollaborations || null;
  const iconicChoreography = data.iconicChoreography || null;
  const signatureMovesCreated = data.signatureMovesCreated || null;
  const viralDanceMoments = data.viralDanceMoments || null;

  // Stunt Director specific data
  const actionStyle = data.actionStyle || null;
  const stuntExpertise = data.stuntExpertise || null;
  const actionVersatility = data.actionVersatility || null;
  const iconicActionSequences = data.iconicActionSequences || null;
  const safetyAndProtocols = data.safetyAndProtocols || null;
  const internationalWork = data.internationalWork || null;

  // Art Director specific data
  const designStyle = data.designStyle || null;
  const productionDesignExpertise = data.productionDesignExpertise || null;
  const iconicSetDesigns = data.iconicSetDesigns || null;
  const researchAndAuthenticity = data.researchAndAuthenticity || null;

  // Costume Designer specific data
  const costumeExpertise = data.costumeExpertise || null;
  const iconicCharacterCostumes = data.iconicCharacterCostumes || null;
  const characterCostumeApproach = data.characterCostumeApproach || null;

  // VFX Supervisor specific data
  const vfxStyle = data.vfxStyle || null;

  const iconicVFXSequences = data.iconicVFXSequences || null;
  const vfxStudioAssociation = data.vfxStudioAssociation || null;
  const innovationInVFX = data.innovationInVFX || null;

  // Line Producer specific data
  const coordinationExpertise = data.coordinationExpertise || null;
  const productionsCoordinated = data.productionsCoordinated || null;
  const productionHouseAssociations = data.productionHouseAssociations || null;
  const budgetManagementSkills = data.budgetManagementSkills || null;
  const problemSolvingAbilities = data.problemSolvingAbilities || null;

  // PRO specific data
  const mediaInfluence = data.mediaInfluence || null;
  const journalismCareer = data.journalismCareer || null;
  const industryRelationships = data.industryRelationships || null;
  const strategicPromotions = data.strategicPromotions || null;
  const industryContributions = data.industryContributions || null;
  const legacyAndImpact = data.legacyAndImpact || null;

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

  const musicalInnovations = data.musicalInnovations || null;
  const backgroundScoreMastery = data.backgroundScoreMastery || null;
  const streamingDominance = data.streamingDominance || data.streamingPresence || null;
  const commercialImpact = data.commercialImpact || null;
  const careersTimeline = data.careersTimeline || null;
  const viralMoments = data.viralMoments || null;
  const recentFilmography = data.recentFilmography || data.filmography || data.recentSongs || data.filmsProduced || data.filmsShot || data.filmsEdited || data.songsWritten || data.songsChoreographed || data.filmsChoreographed || data.filmsDesigned || data.filmsCostumed || data.filmsWorkedOn || data.filmsSupervised || data.recentProductions || data.filmsPromoted || null;
  
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

  if (transformations.length > 0 || voiceProfile?.iconicDialogues?.length > 0 || collaborations || iconicRoles.length > 0 || filmmakerRelationships || screenChemistry || visionaryEssence || filmmakingStyle || musicalEssence || orchestralProfile || villainSpecialization || heroAntagonisms || iconicAntagonistRoles.length > 0 || comedySpecialization || heroComedyPartnerships || iconicComedyRoles.length > 0 || characterVersatility || actingApproach || iconicCharacterRoles.length > 0 || heroPartnerships || directorCollaborations || vocalProfile || musicDirectorCollaborations || duetPartnerships || genreVersatility || starCollaborations || productionApproach || visualStyle || technicalExpertise || editingStyle || pacingAndRhythm || lyricalStyle || frequentDirectorCollaborations || danceStyle || danceStyleVersatility || actorCollaborations || actionStyle || stuntExpertise || actionVersatility || designStyle || productionDesignExpertise || costumeExpertise || characterCostumeApproach || vfxStyle || coordinationExpertise || mediaInfluence || journalismCareer) {
    tabs.push({ id: "craft", label: category === "director" ? "Vision & Craft" : category === "music-director" ? "Sonic Blueprint" : category === "villain" ? "Dark Craft" : category === "comedian" ? "Comedy Lab" : category === "character-artists" ? "The Method" : category === "singers" ? "Sonic Identity" : category === "producers" ? "Production Blueprint" : category === "cinematographers" ? "Visual Signature" : category === "editors" ? "The Edit Room" : category === "lyricists" ? "The Pen & Paper" : category === "choreographers" ? "The Dance Floor" : category === "stunt-directors" ? "The War Room" : category === "art-directors" ? "The Design Studio" : category === "costume-designers" ? "The Atelier" : category === "vfx-supervisors" ? "The VFX Lab" : category === "line-producers" ? "Operations Control" : category === "pros" ? "The Press Box" : "The Craft" });
  }

  if (lifestyle || financial || politicalCareer || brandValue || productionHouse) {
    tabs.push({ id: "empire", label: "Empire" });
  }

  if (careerStats || boxOfficeMilestones || genreStrength || awards.length > 0 || awardsByType || careerRetrospective || streamingDominance || commercialImpact || careersTimeline || chartbusterSongs || songsSung || productionByDecade || landmarkProductions || iconicVisuallyStunningFilms || iconicEditedFilms || iconicSongsWritten || iconicChoreography || iconicActionSequences || iconicSetDesigns || iconicCharacterCostumes || iconicVFXSequences || productionsCoordinated || strategicPromotions) {
    tabs.push({ id: "career", label: "Career" });
  }

  if (philanthropy || quotes.length > 0 || trivia.length > 0 || historicalImpact || industryContribution || mentorshipInfluence || internationalRecognition || criticalAppreciation || controversiesOrTriumphs || influenceAndLegacy || industryStanding || legendaryMoments || legendaryComedyMoments || memorableScenes || livePerformances || musicalFamily || talentDiscovery || teluguLanguageContribution || literaryWorks || famousLyricalLines || viralDanceMoments || signatureMovesCreated || safetyAndProtocols || internationalWork || researchAndAuthenticity || innovationInVFX || legacyAndImpact || industryContributions) {
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
          <img src={images.banner.url} alt={`${person.name} Banner`} className="w-full h-full object-cover opacity-50" loading="eager" fetchPriority="high" />
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

              <div className="mt-8">
                <button 
                  onClick={() => setIsSuggestionOpen(true)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-[0.2em] group"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
                  Suggest an Edit
                </button>
              </div>
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
                onClick={() => handleTabSwitch(tab.id)}
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
              <OverviewTab data={data} theme={theme} />
            )}

            {/* ========================================== */}
            {/* TAB 2: DOSSIER (The Human) */}
            {/* ========================================== */}
            {activeTab === "dossier" && (
              <DossierTab data={data} theme={theme} />
            )}

            {/* ========================================== */}
            {/* TAB: GLAMOUR (Heroines / Divas) */}
            {/* ========================================== */}
            {activeTab === "glamour" && (
              <GlamourTab data={data} theme={theme} />
            )}

            {/* ========================================== */}
            {/* TAB 3: THE CRAFT / VISION */}
            {/* ========================================== */}
            {activeTab === "craft" && (
              <CraftTab data={data} theme={theme} category={category} />
            )}

            {/* ========================================== */}
            {/* TAB 4: EMPIRE (Lifestyle & Finance) */}
            {/* ========================================== */}
            {activeTab === "empire" && (
              <EmpireTab data={data} theme={theme} category={category} />
            )}

            {/* ========================================== */}
            {/* TAB: CAREER (Stats & Achievements) */}
            {/* ========================================== */}
            {activeTab === "career" && (
              <CareerTab data={data} theme={theme} />
            )}

            {/* ========================================== */}
            {/* TAB: LEGACY (Philanthropy & Trivia) */}
            {/* ========================================== */}
            {activeTab === "legacy" && (
              <LegacyTab data={data} theme={theme} category={category} />
            )}

            {/* ========================================== */}
            {/* TAB: TRAJECTORY (Rising Stars Only) */}
            {/* ========================================== */}
            {activeTab === "trajectory" && (
              <TrajectoryTab data={data} theme={theme} category={category} />
            )}

            {/* ========================================== */}
            {/* TAB: DISCOGRAPHY (Music Directors) */}
            {/* ========================================== */}
            {activeTab === "discography" && (
              <DiscographyTab data={data} theme={theme} category={category} />
            )}

            {/* ========================================== */}
            {/* TAB: FILMOGRAPHY (From Database) */}
            {/* ========================================== */}
            {activeTab === "movies" && (
              <MoviesTab data={data} theme={theme} category={category} filmography={filmography} />
            )}

            {/* ========================================== */}
            {/* TAB 6: GALLERY */}
            {/* ========================================== */}
            {activeTab === "gallery" && images.gallery && (
              <GalleryTab data={data} theme={theme} />
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

      <SuggestionModal 
        isOpen={isSuggestionOpen}
        onClose={() => setIsSuggestionOpen(false)}
        entityType="people"
        entityId={person.id}
        currentData={{
            name: person.name,
            metadata: data
        }}
        entityName={person.name}
      />
    </main>
  );
}
