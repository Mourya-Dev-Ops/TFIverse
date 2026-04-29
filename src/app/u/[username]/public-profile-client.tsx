"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toggleFollow } from "@/app/actions/profile";
import {
  FaArrowLeft, FaHome, FaShareAlt, FaUserPlus, FaUserCheck,
  FaBookmark, FaEye, FaPen, FaStar, FaLayerGroup,
  FaTwitter, FaInstagram, FaYoutube, FaTiktok, FaImdb, FaGlobe
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
  const bannerUrl = profile.bannerUrl || "";

  const handleFollow = async () => {
    if (!isLoggedIn) { router.push("/login"); return; }
    setFollowLoading(true);
    const result = await toggleFollow(profile.userId);
    if (result.action === "followed") { setIsFollowing(true); setFollowers(prev => prev + 1); }
    else if (result.action === "unfollowed") { setIsFollowing(false); setFollowers(prev => prev - 1); }
    setFollowLoading(false);
  };

  const handleShare = () => {
    if (navigator.share) { navigator.share({ title: `${profile.username}'s Profile`, url: window.location.href }); }
    else { navigator.clipboard.writeText(window.location.href); }
  };

  // Stats (will be filled when content exists)
  const counts = { watched: 0, watchlist: 0, reviews: 0, tierLists: 0, memes: 0 };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Banner Section */}
      <div className="relative h-80 bg-gradient-to-b from-white/10 to-black overflow-visible">
        {bannerUrl && (
          <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-40" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
        )}

        {/* Top Nav */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
          <button onClick={() => router.back()} className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl transition">
            <FaArrowLeft className="text-white" size={18} />
          </button>
          <div className="flex gap-3">
            <button onClick={handleShare} className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl transition">
              <FaShareAlt className="text-white" size={18} />
            </button>
            <Link href="/" className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl transition">
              <FaHome className="text-white" size={18} />
            </Link>
          </div>
        </div>

        {/* Avatar - FULL VISIBLE */}
        <div className="absolute -bottom-24 left-8 z-20">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-48 h-48">
            <img src={avatarUrl} alt={profile.username} className="w-full h-full rounded-full border-4 border-black shadow-lg object-cover" onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${profile.username}&size=200&background=C0C0C0&color=000`; }} />
            {profile.isOnline && (
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-white border-4 border-black rounded-full z-20 shadow-lg" />
            )}
          </motion.div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-10">
        {/* Header with Follow */}
        <div className="flex items-start justify-between mb-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-5xl font-black text-white">{profile.username}</h1>
              {profile.isOnline && <span className="text-xs text-green-400 font-semibold">🟢 Online now</span>}
            </div>
          </motion.div>

          {!isOwnProfile ? (
            <motion.button onClick={handleFollow} disabled={followLoading} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition ${isFollowing ? "bg-white/20 text-white hover:bg-white/30" : "bg-white text-black hover:shadow-lg"}`}>
              {isFollowing ? <><FaUserCheck size={16} /> Following</> : <><FaUserPlus size={16} /> Follow</>}
            </motion.button>
          ) : (
            <motion.button onClick={() => router.push("/profile")} whileHover={{ scale: 1.05 }} className="px-6 py-2.5 bg-white text-black font-bold rounded-lg text-sm hover:shadow-lg transition-all">
              Edit Profile
            </motion.button>
          )}
        </div>

        {/* Status Message */}
        {profile.statusMessage && (
          <p className="text-white/70 text-sm mb-2 italic">&quot;{profile.statusMessage}&quot;</p>
        )}

        {/* Bio */}
        {profile.bio && (
          <p className="text-white/80 text-sm mb-4 italic max-w-2xl">&quot;{profile.bio}&quot;</p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-3 text-white/70 text-sm mb-4 flex-wrap">
          <span>@{(profile.username || "").toLowerCase().replace(/\s+/g, "")}</span>
          {profile.pronouns && <><span>•</span><span>{profile.pronouns}</span></>}
          {profile.location && <span>📍 {profile.location}</span>}
          {user.createdAt && <span>📅 {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>}
        </div>

        {/* Followers & Following */}
        <div className="flex items-center gap-3 text-white/70 text-sm mb-4">
          <button className="hover:text-white transition-colors"><span className="font-bold text-white">{followers}</span> Followers</button>
          <span>•</span>
          <button className="hover:text-white transition-colors"><span className="font-bold text-white">{followingCount}</span> Following</button>
        </div>

        {/* Social Links */}
        <div className="flex gap-3 mb-6">
          {profile.website && <a href={profile.website} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors"><FaGlobe size={16} /></a>}
          {profile.twitterUrl && <a href={profile.twitterUrl} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors"><FaTwitter size={16} /></a>}
          {profile.instagramUrl && <a href={profile.instagramUrl} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors"><FaInstagram size={16} /></a>}
          {profile.youtubeUrl && <a href={profile.youtubeUrl} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors"><FaYoutube size={16} /></a>}
          {profile.tiktokUrl && <a href={profile.tiktokUrl} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors"><FaTiktok size={16} /></a>}
          {profile.imdbUrl && <a href={profile.imdbUrl} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors"><FaImdb size={16} /></a>}
          {profile.letterboxdUrl && <a href={profile.letterboxdUrl} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors"><SiLetterboxd size={16} /></a>}
        </div>

        {/* Stats + Edit Button */}
        <div className="flex items-center gap-4 flex-wrap mb-8">
          {isOwnProfile && (
            <motion.button onClick={() => router.push("/profile")} whileHover={{ scale: 1.05 }} className="px-6 py-2.5 bg-white text-black font-bold rounded-lg text-sm hover:shadow-lg transition-all">
              Edit Profile
            </motion.button>
          )}
          <div className="flex items-center gap-3 text-white/70 text-xs">
            <div className="text-center"><p className="font-black text-white text-lg">{counts.watched}</p><p>👁️ Watched</p></div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center"><p className="font-black text-white text-lg">{counts.watchlist}</p><p>📚 Watchlist</p></div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center"><p className="font-black text-white text-lg">{counts.reviews}</p><p>✍️ Reviews</p></div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center"><p className="font-black text-white text-lg">{counts.tierLists}</p><p>🏆 Tier Lists</p></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { key: "watched" as const, label: "👁️ Watched", count: counts.watched },
            { key: "watchlist" as const, label: "📚 Watchlist", count: counts.watchlist },
            { key: "reviews" as const, label: "✍️ Reviews", count: counts.reviews },
            { key: "tier-lists" as const, label: "🏆 Tier Lists", count: counts.tierLists },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition ${
                activeTab === tab.key ? "bg-white text-black" : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === "watched" && (
            <div className="text-center py-20 text-white/40">
              <FaEye className="text-5xl mx-auto mb-4 opacity-20" />
              <p>No watched movies yet</p>
            </div>
          )}
          {activeTab === "watchlist" && (
            <div className="text-center py-20 text-white/40">
              <FaBookmark className="text-5xl mx-auto mb-4 opacity-20" />
              <p>No movies in watchlist yet</p>
            </div>
          )}
          {activeTab === "reviews" && (
            <div className="text-center py-20 text-white/40">
              <FaStar className="text-5xl mx-auto mb-4 opacity-20" />
              <p>No reviews yet</p>
            </div>
          )}
          {activeTab === "tier-lists" && (
            <div className="text-center py-20 text-white/40">
              <FaLayerGroup className="text-5xl mx-auto mb-4 opacity-20" />
              <p>No tier lists yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
