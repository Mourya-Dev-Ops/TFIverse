"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Edit3, Share2, Download, LogOut, AlertTriangle, ExternalLink, MapPin, Calendar, AtSign } from "lucide-react";
import EditProfileModal from "./edit-profile-modal";
import DeleteAccountModal from "./delete-account-modal";

interface ProfileDashboardProps {
  user: any;
  profile: any;
  followersCount: number;
  followingCount: number;
}

export default function ProfileDashboard({ user, profile, followersCount, followingCount }: ProfileDashboardProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const joinDate = new Date(user.createdAt || "").toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const profileLink = typeof window !== "undefined" ? `${window.location.origin}/u/${profile.username}` : `/u/${profile.username}`;

  // Profile completeness
  const fields = [
    !!profile.username,
    !!profile.bio,
    !!profile.avatarUrl,
    !!profile.bannerUrl,
    !!profile.location,
    !!profile.twitterUrl || !!profile.instagramUrl || !!profile.youtubeUrl,
    !!profile.website,
  ];
  const completeness = Math.round((fields.filter(Boolean).length / fields.length) * 100);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleExportData = () => {
    const data = { user: { name: user.name, email: user.email }, profile, followersCount, followingCount };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tfiverse-${profile.username}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Social links array
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
    <>
      {/* Banner */}
      <section className="relative h-[280px] md:h-[360px] bg-neutral-950 overflow-hidden">
        {profile.bannerUrl ? (
          <img src={profile.bannerUrl} alt="" className="w-full h-full object-cover opacity-50" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-neutral-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />
      </section>

      {/* Profile Header */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 -mt-24">
        <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-40 h-40 md:w-48 md:h-48 flex-shrink-0"
          >
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.username} className="w-full h-full rounded-full border-4 border-black object-cover" />
            ) : (
              <div className="w-full h-full rounded-full border-4 border-black bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
                <span className="text-5xl font-black text-white">{(profile.username || "U")[0].toUpperCase()}</span>
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 pt-2 md:pt-4">
            {/* Name + Status */}
            <div className="mb-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">{profile.username}</h1>
                {user.emailVerified && (
                  <span className="px-2.5 py-1 bg-white text-black text-[10px] uppercase tracking-widest font-bold">Verified</span>
                )}
              </div>
              {profile.statusMessage && (
                <p className="text-neutral-400 text-sm mt-1 italic">
                  {profile.statusEmoji || "🎬"} &quot;{profile.statusMessage}&quot;
                </p>
              )}
            </div>

            {/* Meta */}
            <div className="flex items-center gap-3 text-neutral-500 text-sm mb-3 flex-wrap">
              <span className="flex items-center gap-1"><AtSign size={12} />@{profile.username.toLowerCase()}</span>
              {profile.pronouns && <><span>•</span><span>{profile.pronouns}</span></>}
              {profile.location && <span className="flex items-center gap-1"><MapPin size={12} />{profile.location}</span>}
              <span className="flex items-center gap-1"><Calendar size={12} />{joinDate}</span>
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="text-neutral-300 text-sm mb-4 italic max-w-2xl leading-relaxed">&quot;{profile.bio}&quot;</p>
            )}

            {/* Followers */}
            <div className="flex items-center gap-3 text-neutral-500 text-sm mb-4">
              <span><b className="text-white">{followersCount}</b> Followers</span>
              <span>•</span>
              <span><b className="text-white">{followingCount}</b> Following</span>
            </div>

            {/* Social Links */}
            {socials.length > 0 && (
              <div className="flex gap-2 mb-6">
                {socials.map(({ url, label }) => (
                  <a key={label} href={url!} target="_blank" rel="noreferrer" className="px-3 py-1.5 border border-neutral-800 text-neutral-500 hover:text-white hover:border-neutral-600 transition-colors text-[10px] tracking-widest uppercase font-bold">
                    {label}
                  </a>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 flex-wrap mb-6">
              <button onClick={() => setShowEditModal(true)} className="px-6 py-2.5 bg-white text-black font-bold text-xs tracking-widest uppercase hover:bg-neutral-200 transition-colors flex items-center gap-2">
                <Edit3 size={14} /> Edit Profile
              </button>
              <Link href={`/u/${profile.username}`} className="px-6 py-2.5 border border-neutral-700 text-neutral-300 font-bold text-xs tracking-widest uppercase hover:border-white hover:text-white transition-colors flex items-center gap-2">
                <ExternalLink size={14} /> View Public
              </Link>
              <button onClick={handleCopyLink} className="px-4 py-2.5 border border-neutral-800 text-neutral-500 hover:text-white hover:border-neutral-600 transition-colors text-xs tracking-widest uppercase font-bold flex items-center gap-2">
                <Share2 size={14} /> {copied ? "Copied!" : "Share"}
              </button>
              <button onClick={handleExportData} className="px-4 py-2.5 border border-neutral-800 text-neutral-500 hover:text-white hover:border-neutral-600 transition-colors text-xs tracking-widest uppercase font-bold flex items-center gap-2">
                <Download size={14} /> Export
              </button>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-6 text-neutral-500 text-xs">
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

            {/* Completeness */}
            {completeness < 100 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] tracking-widest uppercase text-neutral-500">Profile Completeness</span>
                  <span className="text-[10px] font-mono text-neutral-400">{completeness}%</span>
                </div>
                <div className="h-1 bg-neutral-900 w-full max-w-xs">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${completeness}%` }} transition={{ duration: 1 }} className="h-full bg-white" />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content Sections — placeholders for Phase 2 */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["Tier Lists", "Watched Movies", "Memes", "Reviews"].map(section => (
            <div key={section} className="p-8 border border-neutral-900 bg-neutral-950/50 flex flex-col items-center justify-center text-center min-h-[160px]">
              <p className="text-neutral-600 text-sm font-light mb-3">No {section.toLowerCase()} yet</p>
              <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-700 border border-neutral-800 px-4 py-2">Coming Soon</span>
            </div>
          ))}
        </div>
      </section>

      {/* Danger Zone */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="p-6 border border-neutral-900 bg-neutral-950/50">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle size={16} className="text-neutral-600" />
            <h3 className="text-sm font-bold tracking-widest uppercase text-neutral-500">Danger Zone</h3>
          </div>
          <p className="text-neutral-600 text-xs mb-4">Once deleted, your account and all data are gone forever.</p>
          <div className="flex gap-3">
            <button onClick={() => signOut({ callbackUrl: "/" })} className="px-6 py-2.5 border border-neutral-800 text-neutral-500 hover:text-white hover:border-neutral-600 transition-colors text-xs tracking-widest uppercase font-bold flex items-center gap-2">
              <LogOut size={14} /> Sign Out
            </button>
            <button onClick={() => setShowDeleteModal(true)} className="px-6 py-2.5 border border-neutral-800 text-neutral-500 hover:text-red-400 hover:border-red-900 transition-colors text-xs tracking-widest uppercase font-bold flex items-center gap-2">
              <AlertTriangle size={14} /> Delete Account
            </button>
          </div>
        </div>
      </section>

      {/* Modals */}
      <EditProfileModal profile={profile} userId={user.id} isOpen={showEditModal} onClose={() => setShowEditModal(false)} />
      <DeleteAccountModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} />
    </>
  );
}
