"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEdit, FaCamera, FaSignOutAlt, FaShareAlt, FaDownload, FaLink,
  FaTwitter, FaInstagram, FaYoutube, FaTiktok, FaImdb, FaGlobe,
  FaUserFriends, FaTrash
} from "react-icons/fa";
import { SiLetterboxd } from "react-icons/si";
import { MdLocationOn, MdDateRange } from "react-icons/md";
import { uploadProfileImage } from "@/app/actions/profile";
import EditProfileModal from "./edit-profile-modal";
import DeleteAccountModal from "./delete-account-modal";
import toast, { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import profileCompleteAnim from "../../../../public/images/badges/profile-complete.json";
import verifiedAnim from "../../../../public/images/badges/verified-gold.json";

interface ProfileDashboardProps {
  user: any;
  profile: any;
  followersCount: number;
  followingCount: number;
  memes: any[];
  tierLists: any[];
  engagementStats?: { watchlist: number; watched: number; reviews: number };
  engagementData?: {
    watchlist: any[];
    watched: any[];
    reviews: any[];
  };
}

export default function ProfileDashboard({ 
  user, 
  profile, 
  followersCount, 
  followingCount, 
  memes, 
  tierLists,
  engagementStats = { watchlist: 0, watched: 0, reviews: 0 },
  engagementData = { watchlist: [], watched: [], reviews: [] }
}: ProfileDashboardProps) {
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"tierlists" | "memes">("tierlists");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "";
  const dob = profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "";
  const profileLink = typeof window !== "undefined" ? `${window.location.origin}/u/${profile.username}` : `/u/${profile.username}`;
  
  const avatarUrl = profile.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.username)}&size=200&background=C0C0C0&color=000&bold=true`;
  const bannerUrl = profile.bannerUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920";

  // Profile completeness calculation
  const { completeness } = useMemo(() => {
    const core = {
      username: !!profile.username?.trim(),
      bio: !!profile.bio?.trim(),
      avatar: !!profile.avatarUrl,
      banner: !!profile.bannerUrl,
      location: !!profile.location,
    };
    const socialCredits = 5; // Simplified to make 100% easier
    const coreFilled = Object.values(core).filter(Boolean).length;
    return { completeness: Math.round(((coreFilled + socialCredits) / 10) * 100) };
  }, [profile]);

  const handleCopyLink = async () => {
    try { await navigator.clipboard.writeText(profileLink); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: `${profile.username} on TFiverse`, url: profileLink }); } catch {}
    } else {
      handleCopyLink();
    }
  };

  const handleExportData = () => {
    const data = { user: { name: user.name, email: user.email }, profile, followersCount, followingCount };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `tfiverse-profile-${(profile.username || "user").toLowerCase()}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "banner") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setUploading(true);
    const toastId = toast.loading(`Uploading ${type}...`);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const result = await uploadProfileImage(formData);
    setUploading(false);

    if (result.error) {
      toast.error(result.error, { id: toastId });
    } else {
      toast.success(`${type} updated!`, { id: toastId });
      router.refresh();
    }
  };

  const stats = engagementStats;
  const customColor = profile.themeColor && profile.themeColor !== "#ffffff" ? profile.themeColor : "#3b82f6";

  return (
    <main className="bg-black min-h-screen text-white font-sans selection:bg-neutral-800 selection:text-white pb-20">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* ─── CINEMATIC HEADER ─── */}
      <div className="relative h-[600px] w-full group overflow-hidden -mt-16">
        {/* The Banner Image */}
        <img 
          src={bannerUrl} 
          alt="Banner" 
          className={`w-full h-full object-cover transition-all duration-700 ease-in-out ${uploading ? 'opacity-30 blur-sm scale-105' : 'opacity-80 scale-100 hover:scale-[1.02]'}`} 
        />
        
        {/* Soft Bottom Fade to Pure Black */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black pointer-events-none" />

        <label className="absolute top-24 right-6 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-sm font-semibold border border-white/10 transition-all cursor-pointer opacity-0 group-hover:opacity-100 shadow-xl z-20">
          <FaCamera /> {uploading ? "Uploading..." : "Update Banner"}
          <input type="file" className="hidden" accept="image/*,image/gif" disabled={uploading} onChange={(e) => handleFileUpload(e, "banner")} />
        </label>
      </div>

      {/* ─── BENTO GRID CONTAINER ─── */}
      <div className="container max-w-7xl mx-auto px-4 md:px-8 relative -mt-40 z-10">
        
        {/* TOP BENTO ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          
          {/* RIGHT CARD: THE NUMBERS & FAVORITES (Spans 4 columns) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 flex flex-col gap-6 order-2 lg:order-2"
          >
            {/* Stats Bento */}
            <div className="glass-premium rounded-[2rem] p-6 flex-1 flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                {(profile.showWatched ?? true) && (
                  <div className="flex flex-col">
                    <span className="text-3xl font-black">{stats.watched}</span>
                    <span className="text-neutral-500 text-xs font-bold tracking-wider uppercase mt-1">Watched</span>
                  </div>
                )}
                {(profile.showWatchlist ?? true) && (
                  <div className="flex flex-col">
                    <span className="text-3xl font-black">{stats.watchlist}</span>
                    <span className="text-neutral-500 text-xs font-bold tracking-wider uppercase mt-1">Watchlist</span>
                  </div>
                )}
                {(profile.showReviews ?? true) && (
                  <div className="flex flex-col">
                    <span className="text-3xl font-black">{stats.reviews}</span>
                    <span className="text-neutral-500 text-xs font-bold tracking-wider uppercase mt-1">Reviews</span>
                  </div>
                )}
                {(profile.showTierLists ?? true) && (
                  <div className="flex flex-col">
                    <span className="text-3xl font-black">{tierLists?.length || 0}</span>
                    <span className="text-neutral-500 text-xs font-bold tracking-wider uppercase mt-1">Tier Lists</span>
                  </div>
                )}
              </div>
            </div>

            {/* Pinned Movie / Favorite Hero */}
            <div className="glass-premium rounded-[2rem] p-6">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-4">Favorites</h3>
               <div className="flex flex-col gap-3">
                 {profile.favoriteMovieSlug ? (
                   <Link href={`/movies/${profile.favoriteMovieSlug}`} className="group flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
                     <span className="text-xl">🎬</span>
                     <div className="flex flex-col">
                       <span className="text-sm font-bold text-white capitalize group-hover:text-blue-400 transition-colors">{profile.favoriteMovieSlug.replace(/-/g, ' ')}</span>
                       <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Pinned Movie</span>
                     </div>
                   </Link>
                 ) : (
                   <div className="text-xs text-neutral-600 italic">No pinned movie yet.</div>
                 )}
                 {profile.favoriteHeroSlug && (
                   <Link href={`/icons/heroes/male-lead-actor/${profile.favoriteHeroSlug}`} className="group flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
                     <span className="text-xl">🦸‍♂️</span>
                     <div className="flex flex-col">
                       <span className="text-sm font-bold text-white capitalize group-hover:text-blue-400 transition-colors">{profile.favoriteHeroSlug.replace(/-/g, ' ')}</span>
                       <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Favorite Hero</span>
                     </div>
                   </Link>
                 )}
               </div>
               
               {/* TMDB Notice */}
               {(!profile.favoriteMovieSlug || !profile.favoriteHeroSlug) && (
                 <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                   <p className="text-[10px] text-yellow-500/80 uppercase tracking-widest font-bold leading-relaxed">
                     ⚠️ Note: Visual search dropdowns for heroes and movies will be unlocked once TMDB integration is complete.
                   </p>
                 </div>
               )}
            </div>
          </motion.div>

          {/* LEFT CARD: IDENTITY (Spans 8 columns) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 glass-premium rounded-[2rem] p-8 flex flex-col md:flex-row gap-8 relative overflow-hidden order-1 lg:order-1"
          >
            {/* The Avatar */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0 group/avatar">
              <img 
                src={avatarUrl} 
                alt={profile.username} 
                className={`w-full h-full rounded-full object-cover border-[6px] border-[#0a0a0a] shadow-2xl transition-all duration-500 ${uploading ? 'opacity-50' : 'opacity-100'}`} 
              />
              <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-full cursor-pointer opacity-0 group-hover/avatar:opacity-100 transition-opacity backdrop-blur-sm border-[6px] border-transparent">
                <FaCamera className="text-white text-2xl mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/90">Update</span>
                <input type="file" className="hidden" accept="image/*,image/gif" disabled={uploading} onChange={(e) => handleFileUpload(e, "avatar")} />
              </label>
            </div>

            {/* Profile Text Content */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-4xl font-black tracking-tight">{profile.username}</h1>
                {isClient && completeness === 100 && (
                  <div className="w-10 h-10 flex items-center justify-center" title="Verified - 100% Complete">
                    <Lottie animationData={verifiedAnim} loop={false} />
                  </div>
                )}
                {profile.statusMessage && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-full text-sm font-medium">
                    <span>{profile.statusEmoji || "🍿"}</span>
                    <span className="text-neutral-300">{profile.statusMessage}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-neutral-400 text-sm font-medium mb-4">
                <span className="text-white">@{(profile.username || "").toLowerCase().replace(/\s+/g, "")}</span>
                {profile.pronouns && <><span>•</span><span>{profile.pronouns}</span></>}
                {profile.location && <><span>•</span><span className="flex items-center gap-1"><MdLocationOn size={16}/> {profile.location}</span></>}
                {joinDate && <><span>•</span><span className="flex items-center gap-1"><MdDateRange size={16}/> Joined {joinDate}</span></>}
              </div>

              {profile.bio && (
                <p className="text-neutral-300 text-base leading-relaxed mb-6 max-w-xl">
                  {profile.bio}
                </p>
              )}

              {/* Followers & Following inline */}
              {(profile.showFollowers ?? true) && (
                <div className="flex items-center gap-4 text-white/70 text-sm font-medium mb-6">
                  <div className="hover:text-white transition-colors cursor-pointer">
                    <span className="font-black text-white text-lg">{followersCount}</span> Followers
                  </div>
                  <span>•</span>
                  <div className="hover:text-white transition-colors cursor-pointer">
                    <span className="font-black text-white text-lg">{followingCount}</span> Following
                  </div>
                </div>
              )}

              {/* Minimal Social Links */}
              <div className="flex items-center gap-3 flex-wrap">
                {profile.twitterUrl && <a href={profile.twitterUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-white/80 hover:text-white transition-all"><FaTwitter size={16} /></a>}
                {profile.instagramUrl && <a href={profile.instagramUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-white/80 hover:text-white transition-all"><FaInstagram size={16} /></a>}
                {profile.youtubeUrl && <a href={profile.youtubeUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-white/80 hover:text-white transition-all"><FaYoutube size={16} /></a>}
                {profile.tiktokUrl && <a href={profile.tiktokUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-white/80 hover:text-white transition-all"><FaTiktok size={16} /></a>}
                {profile.letterboxdUrl && <a href={profile.letterboxdUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-[#00e53a] transition-all"><SiLetterboxd size={16} /></a>}
                {profile.imdbUrl && <a href={profile.imdbUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-[#f5c518] transition-all"><FaImdb size={16} /></a>}
                {profile.website && <a href={profile.website} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-white/80 hover:text-white transition-all"><FaGlobe size={16} /></a>}
              </div>
            </div>
            
            {/* Top Right Action - Edit Button */}
            <div className="absolute top-6 right-6">
              <button 
                onClick={() => setShowEditModal(true)} 
                className="w-10 h-10 rounded-full bg-white text-black hover:scale-105 flex items-center justify-center transition-transform shadow-lg"
                title="Edit Profile"
              >
                <FaEdit size={16} />
              </button>
            </div>
          </motion.div>


        </div>

        {/* ─── QUICK ACTIONS STRIP ─── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-12 px-2"
        >
          <div className="flex items-center gap-6">
            <button onClick={handleShare} className="text-sm font-bold text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
              <FaShareAlt /> Share
            </button>
            <button onClick={handleCopyLink} className="text-sm font-bold text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
              <FaLink /> {copied ? "Copied" : "Copy Link"}
            </button>
            <button onClick={handleExportData} className="text-sm font-bold text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
              <FaDownload /> Export Data
            </button>
          </div>
          <div>
            <button onClick={() => signOut({ callbackUrl: "/" })} className="text-sm font-bold text-red-500 hover:text-red-400 transition-colors flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-full">
              <FaSignOutAlt /> Sign Out
            </button>
          </div>
        </motion.div>

        {/* ─── CONTENT TABS ─── */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {(["tierlists", "memes"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full text-sm font-bold capitalize transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? "bg-white text-black shadow-lg" 
                  : "glass-premium text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {tab === "tierlists" ? "🏆 Tier Lists" : "😂 Memes"}
            </button>
          ))}
        </div>

        {/* ─── TAB CONTENT (BENTO STYLE EMPTY STATES) ─── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="glass-premium rounded-[2rem] p-6 md:p-8 min-h-[300px] flex flex-col items-center justify-center text-center"
          >
            {activeTab === "tierlists" && (
              tierLists && tierLists.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                  {tierLists.map(list => (
                    <Link key={list.id} href={`/tier-list/${list.id}`} className="group block h-full">
                      <div className="glass-premium rounded-2xl p-6 h-full flex flex-col items-start text-left hover:scale-[1.02] transition-transform">
                        <h4 className="text-xl font-bold text-white mb-2 line-clamp-1">{list.title}</h4>
                        {list.description && <p className="text-sm text-neutral-400 mb-4 line-clamp-2">{list.description}</p>}
                        <div className="mt-auto flex items-center justify-between w-full pt-4 border-t border-white/5">
                          <span className="text-xs text-neutral-500 font-bold uppercase tracking-widest">{new Date(list.createdAt).toLocaleDateString("en-US")}</span>
                          <span className="text-xs text-white bg-white/10 px-2 py-1 rounded font-bold">{Object.keys(list.tiers || {}).length} Tiers</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <>
                  <span className="text-6xl mb-6 opacity-20">🏆</span>
                  <h3 className="text-xl font-bold text-white mb-2">No Tier Lists Yet</h3>
                  <p className="text-neutral-500 max-w-sm mb-8">Rank your favorite movies, heroes, and villains. Share your definitive opinions with the universe.</p>
                  <Link href="/tier-list/create" className="px-6 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform shadow-xl">
                    Create Tier List +
                  </Link>
                </>
              )
            )}

            {activeTab === "memes" && (
              memes && memes.length > 0 ? (
                <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 w-full">
                  {memes.map(meme => (
                    <Link key={meme.id} href={`/memes?id=${meme.id}`} className="block break-inside-avoid">
                      <div className="rounded-xl overflow-hidden relative group">
                        {meme.type === 'video' ? (
                          <video src={meme.imageUrl} className="w-full object-cover" />
                        ) : (
                          <img src={meme.imageUrl} alt={meme.title} className="w-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <h4 className="text-white font-bold p-4 text-center line-clamp-2">{meme.title}</h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <>
                  <span className="text-6xl mb-6 opacity-20">😂</span>
                  <h3 className="text-xl font-bold text-white mb-2">Your Meme Sanctuary is Empty</h3>
                  <p className="text-neutral-500 max-w-sm mb-8">Upload your best creations, start a streak, and make the TFIverse laugh.</p>
                  <Link href="/memes/upload" className="px-6 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform shadow-xl">
                    Upload Meme +
                  </Link>
                </>
              )
            )}
          </motion.div>
        </AnimatePresence>

        {/* ─── ADDITIONAL BENTO SECTIONS ─── */}
        <div className="mt-12 space-y-8">
          {/* ACTIVITY */}
          {(profile.showActivity ?? true) && (
            <section className="glass-premium rounded-[2rem] p-8 md:p-12">
              <h2 className="text-xl md:text-2xl font-black text-white mb-6 flex items-center gap-3">
                 <span className="text-2xl md:text-3xl">📅</span> Activity
              </h2>
              <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-white/10 rounded-xl">
                 <span className="text-neutral-500 mb-2 text-2xl">📬</span>
                 <span className="text-sm text-neutral-400">No recent activity</span>
              </div>
            </section>
          )}

          {/* WATCHED MOVIES */}
          {(profile.showWatched ?? true) && (
            <section className="glass-premium rounded-[2rem] p-8 md:p-12">
              <h2 className="text-xl md:text-2xl font-black text-white mb-6 flex items-center gap-3">
                 <span className="text-2xl md:text-3xl">✅</span> Watched Movies <span className="text-sm text-neutral-500 font-normal">{stats.watched}</span>
              </h2>
              {engagementData.watched.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {engagementData.watched.map((item) => (
                    <Link key={item.id} href={`/movies/${item.movieSlug}`} className="group block">
                      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-neutral-900 border border-white/10 hover:border-white/30 transition-all">
                        {item.posterUrl ? (
                          <img src={`https://image.tmdb.org/t/p/w300${item.posterUrl}`} alt={item.title || item.movieSlug} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center p-4 text-center text-xs font-bold text-neutral-500 capitalize">{item.title || item.movieSlug.replace(/-/g, ' ')}</div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-white/10 rounded-xl">
                   <span className="text-neutral-500 mb-2 text-2xl">👀</span>
                   <span className="text-sm text-neutral-400 mb-4">No watched movies yet</span>
                   <Link href="/movies" className="px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full text-xs font-bold uppercase tracking-widest text-white">
                     Browse Movies
                   </Link>
                </div>
              )}
            </section>
          )}

          {/* WATCHLIST */}
          {(profile.showWatchlist ?? true) && (
            <section className="glass-premium rounded-[2rem] p-8 md:p-12">
              <h2 className="text-xl md:text-2xl font-black text-white mb-6 flex items-center gap-3">
                 <span className="text-2xl md:text-3xl">📚</span> Watchlist <span className="text-sm text-neutral-500 font-normal">{stats.watchlist}</span>
              </h2>
              {engagementData.watchlist.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {engagementData.watchlist.map((item) => (
                    <Link key={item.id} href={`/movies/${item.movieSlug}`} className="group block">
                      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-neutral-900 border border-white/10 hover:border-white/30 transition-all">
                        {item.posterUrl ? (
                          <img src={`https://image.tmdb.org/t/p/w300${item.posterUrl}`} alt={item.title || item.movieSlug} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center p-4 text-center text-xs font-bold text-neutral-500 capitalize">{item.title || item.movieSlug.replace(/-/g, ' ')}</div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-white/10 rounded-xl">
                   <span className="text-neutral-500 mb-2 text-2xl">🔖</span>
                   <span className="text-sm text-neutral-400 mb-4">No movies in watchlist yet</span>
                   <Link href="/movies" className="px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full text-xs font-bold uppercase tracking-widest text-white">
                     Browse Movies
                   </Link>
                </div>
              )}
            </section>
          )}

          {/* REVIEWS */}
          {(profile.showReviews ?? true) && (
            <section className="glass-premium rounded-[2rem] p-8 md:p-12">
              <h2 className="text-xl md:text-2xl font-black text-white mb-6 flex items-center gap-3">
                 <span className="text-2xl md:text-3xl">✍️</span> Reviews <span className="text-sm text-neutral-500 font-normal">{stats.reviews}</span>
              </h2>
              {engagementData.reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {engagementData.reviews.map((review) => (
                    <div key={review.id} className="bg-white/5 border border-white/5 rounded-2xl p-6 flex gap-4">
                      {review.posterUrl && (
                        <div className="w-16 shrink-0 aspect-[2/3] relative rounded-lg overflow-hidden bg-neutral-900">
                          <img src={`https://image.tmdb.org/t/p/w154${review.posterUrl}`} alt={review.title} className="object-cover w-full h-full" />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <Link href={`/movies/${review.movieSlug}`} className="text-base font-bold text-white hover:text-blue-400 transition-colors line-clamp-1">
                              {review.title || review.movieSlug.replace(/-/g, ' ')}
                            </Link>
                            <span className="flex items-center gap-1 shrink-0 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs px-2 py-0.5 rounded font-black">
                              ★ {review.rating}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 mb-3">{new Date(review.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                          {review.reviewText && (
                            <p className="text-sm text-neutral-300 line-clamp-3">
                              {review.spoilers ? (
                                <span className="bg-neutral-800 text-neutral-800 hover:text-neutral-300 cursor-pointer select-none rounded px-1 transition-colors" title="Click to reveal spoiler">
                                  [SPOILER] {review.reviewText}
                                </span>
                              ) : (
                                review.reviewText
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-white/10 rounded-xl">
                   <span className="text-neutral-500 mb-2 text-2xl">📝</span>
                   <span className="text-sm text-neutral-400">No reviews written yet</span>
                </div>
              )}
            </section>
          )}

          {/* DANGER ZONE */}
          <section className="glass-premium rounded-[2rem] p-8 md:p-12 border border-red-500/20 bg-red-500/5">
            <h2 className="text-xl md:text-2xl font-black text-red-400 mb-2 flex items-center gap-3">
               <span className="text-2xl md:text-3xl">⚠️</span> Danger Zone
            </h2>
            <p className="text-neutral-400 text-sm mb-6">
              Once you delete your account, there is no going back. All your data will be permanently removed. 🗑️
            </p>
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="px-6 py-3 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/50 transition-all rounded-lg text-sm font-bold text-red-500 flex items-center gap-2 w-fit"
            >
              <FaTrash /> Delete My Account
            </button>
          </section>
        </div>

      </div>

      <EditProfileModal profile={profile} userId={user.id} isOpen={showEditModal} onClose={() => setShowEditModal(false)} />
      <DeleteAccountModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} />

    </main>
  );
}
