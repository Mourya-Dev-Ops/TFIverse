"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEdit, FaCamera, FaSignOutAlt, FaShareAlt, FaDownload, FaLink, FaCheck,
  FaTrash, FaExclamationTriangle, FaBell, FaBookmark, FaEye, FaPen,
  FaTwitter, FaInstagram, FaYoutube, FaTiktok, FaImdb, FaGlobe,
  FaLayerGroup, FaTh, FaSearch, FaTimes
} from "react-icons/fa";
import { SiLetterboxd } from "react-icons/si";
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const joinDate = new Date(user.createdAt || "").toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const profileLink = typeof window !== "undefined" ? `${window.location.origin}/u/${profile.username}` : `/u/${profile.username}`;
  const avatarUrl = profile.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.username)}&size=200&background=C0C0C0&color=000&bold=true`;
  const bannerUrl = profile.bannerUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920";

  // Profile completeness (matches legacy exactly)
  const { completeness, missingFields } = useMemo(() => {
    const core: Record<string, boolean> = {
      username: !!profile.username?.trim(),
      bio: !!profile.bio?.trim(),
      avatar: !!profile.avatarUrl,
      banner: !!profile.bannerUrl,
      location: !!profile.location,
    };
    const socials: Record<string, boolean> = {
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
    const pct = Math.round(((coreFilled + socialCredits) / 10) * 100);
    const missing: string[] = [];
    Object.entries(core).forEach(([k, v]) => { if (!v) missing.push(k); });
    if (socialCredits < 5) missing.push(`${5 - socialCredits} social links`);
    return { completeness: pct, missingFields: missing };
  }, [profile]);

  const handleCopyLink = async () => {
    try { await navigator.clipboard.writeText(profileLink); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };

  const handleExportData = () => {
    const data = { user: { name: user.name, email: user.email }, profile, followersCount, followingCount };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    a.href = url; a.download = `tfiverse-profile-${(profile.username || "user").toLowerCase()}-${ts}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="bg-black min-h-screen">
      {/* ═══ HERO BANNER ═══ */}
      <section className="relative overflow-hidden">
        <div className="relative h-[500px] overflow-hidden bg-gradient-to-r from-white/[0.05] to-white/[0.02]">
          <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-60 hover:opacity-70 transition-opacity duration-300" loading="eager" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black" />

        {/* Banner Upload */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <label className="px-4 py-2 bg-black/60 backdrop-blur-md text-white font-bold rounded-lg hover:bg-black/80 transition-all cursor-pointer flex items-center gap-2 border border-white/[0.2] hover:border-white/[0.4]">
            <FaCamera size={16} /><span className="text-sm">Change Banner</span>
          </label>
        </div>

        {/* ═══ AVATAR + PROFILE INFO ═══ */}
        <div className="relative z-10 container mx-auto px-4 md:px-8 -mt-32">
          <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
            {/* Avatar */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} className="relative group flex-shrink-0">
              <div className="relative w-48 h-48">
                <img src={avatarUrl} alt={profile.username} className="w-full h-full rounded-full border-4 border-black shadow-lg object-cover relative z-10" loading="eager" />
                <label className="absolute bottom-0 left-0 w-12 h-12 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg border-4 border-black hover:shadow-xl transition-all z-30 hover:scale-110">
                  <FaEdit className="text-black" size={18} />
                </label>
              </div>
            </motion.div>

            {/* Profile Info */}
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} className="flex-1 pt-4">
              {/* Username + Badges */}
              <div className="mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-5xl font-black text-white">{profile.username}</h1>
                  {user.emailVerified && (
                    <span className="px-2.5 py-1 bg-white text-black text-[10px] uppercase tracking-widest font-bold rounded-full">Verified</span>
                  )}
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex items-center gap-3 text-white/70 text-sm mb-3 flex-wrap">
                <span>@{(profile.username || "").toLowerCase().replace(/\s+/g, "")}</span>
                {profile.pronouns && <><span>•</span><span>{profile.pronouns}</span></>}
                {profile.location && <span>📍 {profile.location}</span>}
                <span>📅 {joinDate}</span>
              </div>

              {/* Status Message */}
              {profile.statusMessage && (
                <p className="text-white/70 text-sm mb-3 italic">
                  {profile.statusEmoji || "🎬"} &quot;{profile.statusMessage}&quot;
                </p>
              )}

              {/* Bio */}
              {profile.bio && (
                <p className="text-white/80 text-sm mb-4 italic max-w-2xl">&quot;{profile.bio}&quot;</p>
              )}

              {/* Followers & Following */}
              <div className="flex items-center gap-3 text-white/70 text-sm mb-4">
                <button className="hover:text-white transition-colors">
                  <span className="font-bold text-white">{followersCount}</span> Followers
                </button>
                <span>•</span>
                <button className="hover:text-white transition-colors">
                  <span className="font-bold text-white">{followingCount}</span> Following
                </button>
              </div>

              {/* Social Icons */}
              <div className="flex gap-3 mb-4">
                {profile.twitterUrl && <a href={profile.twitterUrl} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors"><FaTwitter size={16} /></a>}
                {profile.instagramUrl && <a href={profile.instagramUrl} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors"><FaInstagram size={16} /></a>}
                {profile.youtubeUrl && <a href={profile.youtubeUrl} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors"><FaYoutube size={16} /></a>}
                {profile.tiktokUrl && <a href={profile.tiktokUrl} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors"><FaTiktok size={16} /></a>}
                {profile.letterboxdUrl && <a href={profile.letterboxdUrl} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors"><SiLetterboxd size={16} /></a>}
                {profile.imdbUrl && <a href={profile.imdbUrl} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors"><FaImdb size={16} /></a>}
                {profile.website && <a href={profile.website} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors"><FaGlobe size={16} /></a>}
              </div>

              {/* Buttons + Stats Row */}
              <div className="flex items-center gap-6 flex-wrap mb-8">
                <motion.button onClick={() => setShowEditModal(true)} whileHover={{ scale: 1.05 }} className="px-6 py-2.5 bg-white text-black font-bold rounded-lg text-sm hover:shadow-lg transition-all">
                  Edit Profile
                </motion.button>
                {profile.username && (
                  <Link href={`/u/${encodeURIComponent(profile.username)}`} className="px-6 py-2.5 border border-white/30 text-white font-bold rounded-lg text-sm hover:bg-white/10 transition-all">
                    View Profile
                  </Link>
                )}
                <motion.button onClick={() => setShowShareModal(true)} whileHover={{ scale: 1.05 }} className="hidden md:flex items-center gap-2 text-white/70 hover:text-white font-bold text-sm transition-colors">
                  <FaShareAlt size={16} /><span>Share</span>
                </motion.button>
                <motion.button onClick={handleExportData} whileHover={{ scale: 1.05 }} className="hidden md:flex items-center gap-2 text-white/70 hover:text-white font-bold text-sm transition-colors">
                  <FaDownload size={16} /><span>Export</span>
                </motion.button>
                <motion.button onClick={handleCopyLink} whileHover={{ scale: 1.05 }} className="hidden md:flex items-center gap-2 text-white/70 hover:text-white font-bold text-sm transition-colors">
                  <FaLink size={16} /><span>{copied ? "✅ Copied!" : "Copy"}</span>
                </motion.button>
                <motion.button onClick={() => signOut({ callbackUrl: "/" })} whileHover={{ scale: 1.05 }} className="hidden md:flex items-center gap-2 text-white/70 hover:text-white font-bold text-sm transition-colors">
                  <FaSignOutAlt size={16} /><span>Sign Out</span>
                </motion.button>

                {/* Stats Inline */}
                <div className="flex items-center gap-3 text-white/70 text-xs ml-auto">
                  <div className="text-center"><p className="font-black text-white text-lg">0</p><p>👁️ Watched</p></div>
                  <div className="h-8 w-px bg-white/20" />
                  <div className="text-center"><p className="font-black text-white text-lg">0</p><p>📚 Watchlist</p></div>
                  <div className="h-8 w-px bg-white/20" />
                  <div className="text-center"><p className="font-black text-white text-lg">0</p><p>✍️ Reviews</p></div>
                  <div className="h-8 w-px bg-white/20" />
                  <div className="text-center"><p className="font-black text-white text-lg">0</p><p>🏆 Tier Lists</p></div>
                </div>
              </div>

              {/* Completeness Bar */}
              {completeness < 100 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/[0.1] bg-white/5 p-4 hover:bg-white/[0.08] transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold text-white">📊 Profile Completeness</div>
                    <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-white font-bold">
                      {completeness}%
                    </motion.div>
                  </div>
                  <div className="mt-3 h-3 w-full rounded-full bg-white/10 overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completeness}%` }}
                      transition={{ type: "spring", stiffness: 90, damping: 20 }}
                      className={`h-full relative shadow-lg ${completeness >= 70 ? "bg-white/80" : completeness >= 40 ? "bg-white/60" : "bg-white/40"}`}
                    />
                  </div>
                  <div className="mt-3 text-sm font-medium text-white/70">🎯 Complete profile to unlock badges!</div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ CONTENT SECTIONS ═══ */}
      <section className="container mx-auto px-4 md:px-8 py-12 max-w-7xl">
        <div className="space-y-12">

          {/* Tier Lists */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
              <FaLayerGroup className="text-white/60" /> 🏆 Tier Lists <span className="text-white/40 text-xl">0</span>
            </h2>
            <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/[0.1]">
              <FaTh className="text-white/20 text-6xl mx-auto mb-4" />
              <p className="text-white/60 mb-6">📭 No tier lists created yet</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/tier-lists/create" className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-black hover:bg-white/90 font-bold transition-all shadow-lg">
                  <FaLayerGroup size={20} /><span>➕ Create Your First Tier List</span>
                </Link>
              </motion.div>
            </div>
          </motion.section>

          {/* Activity Timeline */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <h2 className="text-3xl font-black mb-6 flex items-center gap-3 text-white">📅 Activity</h2>
            <div className="text-center py-12 bg-white/5 rounded-xl border border-white/[0.1]">
              <p className="text-white/60">📭 No recent activity</p>
            </div>
          </motion.section>

          {/* Watchlist */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
              <FaBookmark className="text-white/60" /> 📚 Watchlist <span className="text-white/40 text-xl">0</span>
            </h2>
            <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/[0.1]">
              <FaBookmark className="text-white/20 text-6xl mx-auto mb-4" />
              <p className="text-white/60 mb-4">🎬 No movies in watchlist yet</p>
              <Link href="/movies" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.1] bg-white/5 hover:bg-white/10 text-white transition-all">🎯 Browse Movies</Link>
            </div>
          </motion.section>

          {/* Reviews */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <h2 className="text-3xl font-black mb-6 flex items-center gap-3 text-white">
              <FaPen className="text-white/60" /> ✍️ Reviews <span className="text-white/40 text-xl">0</span>
            </h2>
            <div className="text-center py-16 bg-white/5 rounded-xl border border-white/[0.1]">
              <p className="text-white/60">📝 No reviews written yet</p>
            </div>
          </motion.section>

          {/* Watched */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <h2 className="text-3xl font-black mb-6 flex items-center gap-3 text-white">
              <FaEye className="text-white/60" /> 👁️ Watched <span className="text-white/40 text-xl">0</span>
            </h2>
            <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/[0.1]">
              <p className="text-white/60">🍿 No watched movies yet</p>
            </div>
          </motion.section>

          {/* Memes */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
              <span className="text-4xl">😂</span> My Memes
            </h2>
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/[0.1]">
              <div className="text-6xl mb-4">😢</div>
              <p className="text-white/70 text-lg">No memes uploaded yet 📸</p>
              <Link href="/memes" className="mt-4 inline-block px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-white/90 transition">🎬 Explore Memes</Link>
            </div>
          </motion.section>
        </div>
      </section>

      {/* ═══ DANGER ZONE ═══ */}
      <section className="container mx-auto px-4 md:px-8 py-12 max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-6 bg-white/5 rounded-xl border border-white/[0.1] hover:border-white/[0.2] transition-all">
          <h2 className="text-2xl font-bold text-white/80 mb-2 flex items-center gap-3">
            <span className="text-3xl">⚠️</span><span>Danger Zone</span>
          </h2>
          <p className="text-white/60 mb-4">Once you delete your account, there is no going back. All your data will be permanently removed. 🗑️</p>
          <motion.button onClick={() => setShowDeleteModal(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-3 bg-white text-black hover:bg-white/90 font-bold rounded-lg transition-all flex items-center gap-2 shadow-lg">
            <FaTrash /> 🗑️ Delete My Account
          </motion.button>
        </motion.div>
      </section>

      {/* ═══ SHARE MODAL ═══ */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowShareModal(false)} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} onClick={e => e.stopPropagation()} className="bg-black border border-white/[0.1] rounded-2xl p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.1]">
                <h3 className="text-xl md:text-2xl font-black text-white">📤 Share Profile</h3>
                <motion.button onClick={() => setShowShareModal(false)} whileHover={{ scale: 1.1, rotate: 90 }} className="text-white/60 hover:text-white transition-colors"><FaTimes size={22} /></motion.button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Preview Card */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl overflow-hidden border border-white/[0.1] bg-white/5">
                  <div className="relative h-28 w-full bg-gradient-to-r from-white/10 to-white/5">
                    <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-60" loading="eager" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full overflow-hidden border border-white/[0.1]">
                        <img src={avatarUrl} alt={profile.username} className="w-full h-full object-cover" loading="eager" />
                      </div>
                      <div className="font-semibold text-white">{profile.username}</div>
                    </div>
                    {profile.bio && <div className="mt-3 text-white/70 text-sm line-clamp-2">&quot;{profile.bio}&quot;</div>}
                    <div className="mt-3 text-xs text-white/60 break-all">🔗 {profileLink}</div>
                  </div>
                </motion.div>

                {/* QR Code */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="rounded-xl border border-white/[0.1] bg-white/5 p-4 flex flex-col items-center justify-center">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(profileLink)}`} alt="QR Code" className="h-56 w-56 rounded-xl border border-white/[0.1] bg-black p-2" />
                  <div className="mt-4 grid grid-cols-2 gap-2 w-full">
                    <motion.button onClick={handleCopyLink} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/5 hover:bg-white/10 px-3 py-2 text-white transition-all">
                      {copied ? <FaCheck /> : <FaLink />} {copied ? "✅ Copied!" : "🔗 Copy"}
                    </motion.button>
                    <motion.button onClick={async () => {
                      if (navigator.share) { try { await navigator.share({ title: `${profile.username} on TFiverse`, text: profile.bio || "Check out this profile", url: profileLink }); } catch {} } else { handleCopyLink(); }
                    }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/5 hover:bg-white/10 px-3 py-2 text-white transition-all">
                      <FaShareAlt /> 📤 Share
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ MODALS ═══ */}
      <EditProfileModal profile={profile} userId={user.id} isOpen={showEditModal} onClose={() => setShowEditModal(false)} />
      <DeleteAccountModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} />
    </main>
  );
}
