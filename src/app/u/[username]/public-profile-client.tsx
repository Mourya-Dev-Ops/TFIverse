"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toggleFollow } from "@/app/actions/profile";
import { ArrowLeft, Share2, Home, UserPlus, UserCheck, MapPin, Calendar, AtSign, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

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

  const joinDate = new Date(user.createdAt || "").toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const handleFollow = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setFollowLoading(true);
    const result = await toggleFollow(profile.userId);
    if (result.action === "followed") {
      setIsFollowing(true);
      setFollowers(prev => prev + 1);
    } else if (result.action === "unfollowed") {
      setIsFollowing(false);
      setFollowers(prev => prev - 1);
    }
    setFollowLoading(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: `${profile.username} on TFiverse`, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const socials = [
    { url: profile.twitterUrl, label: "𝕏" },
    { url: profile.instagramUrl, label: "IG" },
    { url: profile.youtubeUrl, label: "YT" },
    { url: profile.tiktokUrl, label: "TT" },
    { url: profile.letterboxdUrl, label: "LB" },
    { url: profile.imdbUrl, label: "IMDb" },
    { url: profile.website, label: "Web" },
  ].filter(s => s.url);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Banner */}
      <div className="relative h-72 md:h-80 bg-gradient-to-b from-neutral-900/50 to-black overflow-hidden">
        {profile.bannerUrl && (
          <img src={profile.bannerUrl} alt="" className="w-full h-full object-cover opacity-40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />

        {/* Top Nav */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
          <button onClick={() => router.back()} className="p-3 bg-black/40 backdrop-blur-xl border border-white/10 hover:bg-black/60 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div className="flex gap-2">
            <button onClick={handleShare} className="p-3 bg-black/40 backdrop-blur-xl border border-white/10 hover:bg-black/60 transition-colors">
              <Share2 size={18} />
            </button>
            <Link href="/" className="p-3 bg-black/40 backdrop-blur-xl border border-white/10 hover:bg-black/60 transition-colors">
              <Home size={18} />
            </Link>
          </div>
        </div>

        {/* Avatar */}
        <div className="absolute -bottom-20 left-8 z-20">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-40 h-40 md:w-48 md:h-48">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.username} className="w-full h-full rounded-full border-4 border-black object-cover" />
            ) : (
              <div className="w-full h-full rounded-full border-4 border-black bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
                <span className="text-5xl font-black">{(profile.username || "U")[0].toUpperCase()}</span>
              </div>
            )}
            {profile.isOnline && (
              <div className="absolute bottom-2 right-2 w-5 h-5 bg-white border-4 border-black rounded-full" />
            )}
          </motion.div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="max-w-5xl mx-auto px-6 pt-28 pb-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-1">{profile.username}</h1>
            {profile.statusMessage && (
              <p className="text-neutral-400 text-sm italic">{profile.statusEmoji || "🎬"} &quot;{profile.statusMessage}&quot;</p>
            )}
          </motion.div>

          {!isOwnProfile ? (
            <motion.button
              onClick={handleFollow}
              disabled={followLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-6 py-3 font-bold text-xs tracking-widest uppercase transition-colors ${
                isFollowing
                  ? "bg-neutral-900 text-white border border-neutral-700 hover:border-white"
                  : "bg-white text-black hover:bg-neutral-200"
              }`}
            >
              {isFollowing ? <><UserCheck size={16} /> Following</> : <><UserPlus size={16} /> Follow</>}
            </motion.button>
          ) : (
            <Link href="/profile" className="px-6 py-3 bg-white text-black font-bold text-xs tracking-widest uppercase hover:bg-neutral-200 transition-colors flex items-center gap-2">
              <ExternalLink size={14} /> Edit Profile
            </Link>
          )}
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-neutral-300 text-sm mb-4 italic max-w-2xl leading-relaxed">&quot;{profile.bio}&quot;</p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 text-neutral-500 text-sm mb-4 flex-wrap">
          <span className="flex items-center gap-1"><AtSign size={12} />@{profile.username.toLowerCase()}</span>
          {profile.pronouns && <><span>•</span><span>{profile.pronouns}</span></>}
          {profile.location && <span className="flex items-center gap-1"><MapPin size={12} />{profile.location}</span>}
          <span className="flex items-center gap-1"><Calendar size={12} />{joinDate}</span>
        </div>

        {/* Followers */}
        <div className="flex items-center gap-3 text-neutral-500 text-sm mb-4">
          <span><b className="text-white">{followers}</b> Followers</span>
          <span>•</span>
          <span><b className="text-white">{followingCount}</b> Following</span>
        </div>

        {/* Social Links */}
        {socials.length > 0 && (
          <div className="flex gap-2 mb-8">
            {socials.map(({ url, label }) => (
              <a key={label} href={url!} target="_blank" rel="noreferrer" className="px-3 py-1.5 border border-neutral-800 text-neutral-500 hover:text-white hover:border-neutral-600 transition-colors text-[10px] tracking-widest uppercase font-bold">
                {label}
              </a>
            ))}
          </div>
        )}

        {/* Stats Bar */}
        <div className="flex items-center gap-6 text-neutral-500 text-xs mb-12">
          {[
            { label: "Watched", value: 0 },
            { label: "Watchlist", value: 0 },
            { label: "Reviews", value: 0 },
            { label: "Tier Lists", value: 0 },
          ].map(({ label, value }, i) => (
            <div key={label} className="flex items-center gap-2">
              {i > 0 && <div className="h-6 w-px bg-neutral-800" />}
              <div className="text-center">
                <p className="font-black text-white text-xl">{value}</p>
                <p className="tracking-widest uppercase">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Content Tabs — empty states for now */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {["Watched", "Watchlist", "Reviews", "Tier Lists"].map(tab => (
            <button key={tab} className="px-4 py-2 bg-neutral-900 text-neutral-500 font-bold text-xs tracking-widest uppercase whitespace-nowrap">
              {tab} (0)
            </button>
          ))}
        </div>

        <div className="min-h-[200px] flex items-center justify-center border border-neutral-900 bg-neutral-950/50">
          <p className="text-neutral-700 text-sm">Content coming soon</p>
        </div>
      </div>
    </div>
  );
}
