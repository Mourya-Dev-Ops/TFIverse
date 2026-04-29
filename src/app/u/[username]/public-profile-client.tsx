"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toggleFollow } from "@/app/actions/profile";
import {
  FaArrowLeft, FaHome, FaShareAlt, FaUserPlus, FaUserCheck,
  FaBookmark, FaEye, FaPen, FaStar, FaLayerGroup,
  FaTwitter, FaInstagram, FaYoutube, FaTiktok, FaImdb, FaGlobe, FaCircle
} from "react-icons/fa";
import { SiLetterboxd } from "react-icons/si";

interface PublicProfileClientProps {
  user: any;
  profile: any;
  followersCount: number;
  followingCount: number;
  isFollowingInitial: boolean;
  isOwnProfile: boolean;
  isLoggedIn: boolean;
}

export default function PublicProfileClient({
  user,
  profile,
  followersCount: initialFollowers,
  followingCount,
  isFollowingInitial,
  isOwnProfile,
  isLoggedIn,
}: PublicProfileClientProps) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(isFollowingInitial);
  const [followers, setFollowers] = useState(initialFollowers);
  const [followLoading, setFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"watched" | "watchlist" | "reviews" | "tier-lists" | "memes">("watched");

  const avatarUrl = profile.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.username)}&size=200&background=C0C0C0&color=000&bold=true`;
  const bannerUrl = profile.bannerUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920";

  const handleFollow = async () => {
    if (!isLoggedIn) { router.push("/login"); return; }
    setFollowLoading(true);
    const result = await toggleFollow(profile.userId);
    if (result.action === "followed") { setIsFollowing(true); setFollowers(prev => prev + 1); }
    else if (result.action === "unfollowed") { setIsFollowing(false); setFollowers(prev => prev - 1); }
    setFollowLoading(false);
  };

  const handleShare = () => {
    if (navigator.share) { navigator.share({ title: `${profile.username}'s Profile on TFiverse`, url: window.location.href }); }
    else { navigator.clipboard.writeText(window.location.href); }
  };

  const counts = { watched: 0, watchlist: 0, reviews: 0, tierLists: 0, memes: 0 };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      
      {/* ═══ CINEMATIC NOISE OVERLAY ═══ */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* ═══ HERO BANNER ═══ */}
      <section className="relative overflow-hidden group">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative h-[450px] w-full overflow-hidden"
        >
          <img 
            src={bannerUrl} 
            alt="Banner" 
            className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-[3s] ease-out opacity-60" 
            loading="eager" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
        </motion.div>

        {/* Top Nav Actions */}
        <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-20">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()} 
            className="p-4 rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 text-white/70 hover:text-white transition-all shadow-2xl"
          >
            <FaArrowLeft size={16} />
          </motion.button>
          <div className="flex gap-4">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare} 
              className="p-4 rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 text-white/70 hover:text-white transition-all shadow-2xl"
            >
              <FaShareAlt size={16} />
            </motion.button>
            <Link href="/" className="p-4 rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 text-white/70 hover:text-white transition-all shadow-2xl">
              <FaHome size={16} />
            </Link>
          </div>
        </div>

        {/* ═══ AVATAR OVERLAP ═══ */}
        <div className="absolute -bottom-24 left-12 z-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-48 h-48 md:w-56 md:h-56 rounded-full p-1 bg-gradient-to-b from-white/20 to-transparent shadow-[0_0_50px_rgba(255,255,255,0.1)]"
          >
            <div className="w-full h-full rounded-full overflow-hidden border-8 border-black">
              <img src={avatarUrl} alt={profile.username} className="w-full h-full object-cover" loading="eager" />
            </div>
            {profile.isOnline && (
              <div className="absolute bottom-4 right-4 w-8 h-8 bg-green-500 rounded-full border-4 border-black shadow-lg animate-pulse" />
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══ PROFILE INFO ═══ */}
      <div className="max-w-6xl mx-auto px-12 pt-36 pb-20 relative">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start justify-between gap-12 border-b border-white/[0.06] pb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex-1 space-y-6"
          >
            <div className="space-y-2">
              <h1 className="text-6xl font-black text-white tracking-tighter drop-shadow-2xl">
                {profile.username}
              </h1>
              <div className="flex items-center gap-4 text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
                <span className="text-white/60">@{(profile.username || "").toLowerCase().replace(/\s+/g, "")}</span>
                {profile.pronouns && <><FaCircle size={4} className="opacity-20" /><span>{profile.pronouns}</span></>}
                {profile.location && <><FaCircle size={4} className="opacity-20" /><span>📍 {profile.location}</span></>}
                <FaCircle size={4} className="opacity-20" /><span>📅 {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : 'Recent'}</span>
              </div>
            </div>

            <div className="max-w-2xl">
              {profile.statusMessage && (
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 text-sm text-white/80 mb-4 italic">
                  <span className="text-lg">🎬</span>
                  <span>&quot;{profile.statusMessage}&quot;</span>
                </div>
              )}
              {profile.bio && (
                <p className="text-xl text-white/70 font-medium leading-relaxed italic border-l-2 border-white/10 pl-6">
                  &quot;{profile.bio}&quot;
                </p>
              )}
            </div>

            {/* Social Links Cluster */}
            <div className="flex gap-5 items-center">
              {profile.twitterUrl && <a href={profile.twitterUrl} target="_blank" rel="noreferrer" className="text-white/30 hover:text-white transition-all transform hover:scale-125"><FaTwitter size={18} /></a>}
              {profile.instagramUrl && <a href={profile.instagramUrl} target="_blank" rel="noreferrer" className="text-white/30 hover:text-white transition-all transform hover:scale-125"><FaInstagram size={18} /></a>}
              {profile.youtubeUrl && <a href={profile.youtubeUrl} target="_blank" rel="noreferrer" className="text-white/30 hover:text-white transition-all transform hover:scale-125"><FaYoutube size={18} /></a>}
              {profile.letterboxdUrl && <a href={profile.letterboxdUrl} target="_blank" rel="noreferrer" className="text-white/30 hover:text-white transition-all transform hover:scale-125"><SiLetterboxd size={18} /></a>}
              {profile.imdbUrl && <a href={profile.imdbUrl} target="_blank" rel="noreferrer" className="text-white/30 hover:text-white transition-all transform hover:scale-125"><FaImdb size={18} /></a>}
              {profile.website && <a href={profile.website} target="_blank" rel="noreferrer" className="text-white/30 hover:text-white transition-all transform hover:scale-125"><FaGlobe size={18} /></a>}
            </div>
          </motion.div>

          {/* Action Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col items-center md:items-end gap-8"
          >
            {!isOwnProfile ? (
              <motion.button 
                onClick={handleFollow} 
                disabled={followLoading} 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                className={`flex items-center gap-3 px-10 py-4 rounded-full font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-2xl ${isFollowing ? "bg-white/10 text-white border border-white/20 hover:bg-white/20" : "bg-white text-black hover:bg-neutral-200"}`}
              >
                {isFollowing ? <><FaUserCheck size={14} /> Following</> : <><FaUserPlus size={14} /> Initiate Follow</>}
              </motion.button>
            ) : (
              <motion.button onClick={() => router.push("/profile")} whileHover={{ scale: 1.05 }} className="px-10 py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-full shadow-2xl hover:bg-neutral-200 transition-all">
                Edit Protocol
              </motion.button>
            )}

            <div className="flex items-center gap-10">
              <div className="text-center">
                <p className="text-4xl font-black text-white">{followers}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-black">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-black text-white">{followingCount}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-black">Following</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ═══ TABS & CONTENT ═══ */}
        <div className="pt-20 space-y-16">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {[
              { key: "watched" as const, label: "Watched", icon: FaEye, count: counts.watched },
              { key: "watchlist" as const, label: "Watchlist", icon: FaBookmark, count: counts.watchlist },
              { key: "reviews" as const, label: "Reviews", icon: FaStar, count: counts.reviews },
              { key: "tier-lists" as const, label: "Tier Lists", icon: FaLayerGroup, count: counts.tierLists },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-8 py-3 rounded-full font-black uppercase tracking-widest text-[10px] transition-all border ${
                  activeTab === tab.key ? "bg-white text-black border-white" : "bg-white/5 text-white/40 border-white/5 hover:border-white/20 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <tab.icon size={12} /> {tab.label} <span className="opacity-40">{tab.count}</span>
                </span>
              </button>
            ))}
          </div>

          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-[500px]"
          >
            <div className="py-32 bg-white/[0.02] rounded-[40px] border border-white/[0.05] text-center space-y-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full" />
                <div className="relative p-8 rounded-full bg-black border border-white/10 text-white/20">
                  {activeTab === 'watched' && <FaEye size={40} />}
                  {activeTab === 'watchlist' && <FaBookmark size={40} />}
                  {activeTab === 'reviews' && <FaStar size={40} />}
                  {activeTab === 'tier-lists' && <FaLayerGroup size={40} />}
                </div>
              </div>
              <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-xs">Archive Empty</p>
              <p className="text-white/20 text-sm italic max-w-xs mx-auto">This section of the cinematic archive remains unexplored.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
