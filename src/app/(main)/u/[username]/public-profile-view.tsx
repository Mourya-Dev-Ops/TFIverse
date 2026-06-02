"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShareAlt, FaLink, FaTwitter, FaInstagram, FaYoutube, FaTiktok, FaImdb, FaGlobe
} from "react-icons/fa";
import { SiLetterboxd } from "react-icons/si";
import { MdLocationOn, MdDateRange } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";
import { followUser, unfollowUser } from "@/app/actions/follow";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import verifiedAnim from "../../../../../public/images/badges/verified-gold.json";

interface PublicProfileViewProps {
  user: any;
  profile: any;
  followersCount: number;
  followingCount: number;
  initialIsFollowing: boolean;
  currentUserId?: string;
  memes: any[];
  tierLists: any[];
  engagementStats?: { watchlist: number; watched: number; reviews: number };
  engagementData?: {
    watchlist: any[];
    watched: any[];
    reviews: any[];
  };
}

export default function PublicProfileView({ 
  user, profile, followersCount: initialFollowers, followingCount, initialIsFollowing, currentUserId, memes, tierLists,
  engagementStats = { watchlist: 0, watched: 0, reviews: 0 },
  engagementData = { watchlist: [], watched: [], reviews: [] }
}: PublicProfileViewProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"tierlists" | "memes">("tierlists");
  const [isClient, setIsClient] = useState(false);
  
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followersCount, setFollowersCount] = useState(initialFollowers);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "";
  const dob = profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "";
  const profileLink = typeof window !== "undefined" ? `${window.location.origin}/u/${profile.username}` : `/u/${profile.username}`;
  
  const avatarUrl = profile.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.username)}&size=200&background=C0C0C0&color=000&bold=true`;
  const bannerUrl = profile.bannerUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920";

  const { completeness } = useMemo(() => {
    const core = {
      username: !!profile.username?.trim(),
      bio: !!profile.bio?.trim(),
      avatar: !!profile.avatarUrl,
      banner: !!profile.bannerUrl,
      location: !!profile.location,
    };
    const socials = {
      website: !!profile.website,
      twitter: !!profile.twitterUrl,
      instagram: !!profile.instagramUrl,
      youtube: !!profile.youtubeUrl,
      tiktok: !!profile.tiktokUrl,
      letterboxd: !!profile.letterboxdUrl,
      imdb: !!profile.imdbUrl,
    };
    const socialsFilled = Object.values(socials).filter(Boolean).length;
    const socialCredits = Math.min(5, socialsFilled);
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

  const handleFollowToggle = async () => {
    if (!currentUserId) {
      toast.error("Please login to follow users");
      return;
    }
    
    setIsFollowLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(profile.userId);
        setIsFollowing(false);
        setFollowersCount(prev => prev - 1);
        toast.success(`Unfollowed ${profile.username}`);
      } else {
        await followUser(profile.userId);
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
        toast.success(`Following ${profile.username}`);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update follow status");
    } finally {
      setIsFollowLoading(false);
    }
  };

  const stats = engagementStats;

  const isOwnProfile = currentUserId === profile.userId;

  return (
    <main className="bg-black min-h-screen text-white font-sans selection:bg-neutral-800 selection:text-white pb-20">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* ─── CINEMATIC HEADER ─── */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img 
          src={bannerUrl} 
          alt="Banner" 
          className="w-full h-full object-cover opacity-80" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black pointer-events-none" />
      </div>

      {/* ─── BENTO GRID CONTAINER ─── */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 relative -mt-32 z-10">
        
        {/* TOP BENTO ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          
          {/* LEFT CARD: IDENTITY (Spans 8 columns) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 bg-[#0a0a0a] border border-white/5 backdrop-blur-xl rounded-[2rem] p-8 flex flex-col md:flex-row gap-8 relative overflow-hidden"
          >
            {/* The Avatar */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0">
              <img 
                src={avatarUrl} 
                alt={profile.username} 
                className="w-full h-full rounded-full object-cover border-[6px] border-[#0a0a0a] shadow-2xl" 
              />
              
              {/* Lottie Animated Badge */}
              {isClient && completeness === 100 && (
                <div className="absolute -bottom-2 -right-2 w-14 h-14 bg-[#0a0a0a] rounded-full flex items-center justify-center p-1 shadow-xl z-30" title="Verified - 100% Complete">
                  <Lottie animationData={verifiedAnim} loop={false} />
                </div>
              )}
            </div>

            {/* Profile Text Content */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-4xl font-black tracking-tight">{profile.username}</h1>
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
            
            {/* Top Right Action - Follow Button */}
            <div className="absolute top-6 right-6">
              {!isOwnProfile && (
                <button 
                  onClick={handleFollowToggle}
                  disabled={isFollowLoading}
                  className={`px-6 py-2 rounded-full font-bold text-sm transition-all shadow-lg ${
                    isFollowing 
                      ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20' 
                      : 'bg-white text-black hover:scale-105'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </motion.div>

          {/* RIGHT CARD: THE NUMBERS & FAVORITES (Spans 4 columns) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 flex flex-col gap-6"
          >
            {/* Stats Bento */}
            <div className="bg-[#0a0a0a] border border-white/5 backdrop-blur-xl rounded-[2rem] p-6 flex-1 flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div className="flex flex-col">
                  <span className="text-3xl font-black">{stats.watched}</span>
                  <span className="text-neutral-500 text-xs font-bold tracking-wider uppercase mt-1">Watched</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-black">{stats.watchlist}</span>
                  <span className="text-neutral-500 text-xs font-bold tracking-wider uppercase mt-1">Watchlist</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-black">{stats.reviews}</span>
                  <span className="text-neutral-500 text-xs font-bold tracking-wider uppercase mt-1">Reviews</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black">{followersCount}</span>
                    <span className="text-neutral-600">/</span>
                    <span className="text-xl font-bold text-neutral-400">{followingCount}</span>
                  </div>
                  <span className="text-neutral-500 text-xs font-bold tracking-wider uppercase mt-1">Followers / Following</span>
                </div>
              </div>
            </div>

            {/* Pinned Movie / Favorite Hero */}
            <div className="bg-[#0a0a0a] border border-white/5 backdrop-blur-xl rounded-[2rem] p-6">
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
                   <Link href={`/icons/${profile.favoriteHeroSlug}`} className="group flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
                     <span className="text-xl">🦸‍♂️</span>
                     <div className="flex flex-col">
                       <span className="text-sm font-bold text-white capitalize group-hover:text-blue-400 transition-colors">{profile.favoriteHeroSlug.replace(/-/g, ' ')}</span>
                       <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Favorite Hero</span>
                     </div>
                   </Link>
                 )}
               </div>
            </div>
          </motion.div>
        </div>

        {/* ─── QUICK ACTIONS STRIP ─── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-start gap-6 mb-12 px-2"
        >
          <button onClick={handleShare} className="text-sm font-bold text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
            <FaShareAlt /> Share Profile
          </button>
          <button onClick={handleCopyLink} className="text-sm font-bold text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
            <FaLink /> {copied ? "Copied" : "Copy Link"}
          </button>
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
                  : "bg-[#0a0a0a] text-neutral-400 border border-white/5 hover:bg-white/5 hover:text-white"
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
            className="bg-[#0a0a0a] border border-white/5 backdrop-blur-xl rounded-[2rem] p-12 min-h-[400px] flex flex-col items-center justify-center text-center"
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
                          <span className="text-xs text-neutral-500 font-bold uppercase tracking-widest">{new Date(list.createdAt).toLocaleDateString()}</span>
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
                  <p className="text-neutral-500 max-w-sm mb-8">{profile.username} hasn't created any tier lists yet.</p>
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
                          <video src={meme.mediaUrl} className="w-full object-cover" />
                        ) : (
                          <img src={meme.mediaUrl} alt={meme.title} className="w-full object-cover" />
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
                  <h3 className="text-xl font-bold text-white mb-2">No Memes Yet</h3>
                  <p className="text-neutral-500 max-w-sm mb-8">{profile.username} hasn't uploaded any memes yet.</p>
                </>
              )
            )}
          </motion.div>
        </AnimatePresence>

        {/* WATCHED MOVIES */}
        {(profile.showWatched ?? true) && (
          <div className="mt-8">
            <section className="bg-[#0a0a0a] border border-white/5 backdrop-blur-xl rounded-[2rem] p-8 md:p-12">
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
                   <span className="text-sm text-neutral-400">No watched movies yet</span>
                </div>
              )}
            </section>
          </div>
        )}

        {/* WATCHLIST */}
        {(profile.showWatchlist ?? true) && (
          <div className="mt-8">
            <section className="bg-[#0a0a0a] border border-white/5 backdrop-blur-xl rounded-[2rem] p-8 md:p-12">
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
                   <span className="text-sm text-neutral-400">No movies in watchlist yet</span>
                </div>
              )}
            </section>
          </div>
        )}

        {/* REVIEWS */}
        {(profile.showReviews ?? true) && (
          <div className="mt-8">
            <section className="bg-[#0a0a0a] border border-white/5 backdrop-blur-xl rounded-[2rem] p-8 md:p-12">
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
          </div>
        )}

      </div>
    </main>
  );
}
