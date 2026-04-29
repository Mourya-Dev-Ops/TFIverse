"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEdit, FaCamera, FaSignOutAlt, FaShareAlt, FaDownload, FaLink, FaCheck,
  FaTrash, FaExclamationTriangle, FaBell, FaBookmark, FaEye, FaPen,
  FaTwitter, FaInstagram, FaYoutube, FaTiktok, FaImdb, FaGlobe,
  FaLayerGroup, FaTh, FaSearch, FaTimes, FaCircle
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
    <main className="bg-black min-h-screen text-white selection:bg-white selection:text-black font-sans">
      
      {/* ═══ CINEMATIC NOISE OVERLAY ═══ */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* ═══ HERO BANNER ═══ */}
      <section className="relative overflow-hidden group">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative h-[550px] w-full overflow-hidden"
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

        {/* Banner Upload Action */}
        <div className="absolute top-8 right-8 z-20 flex gap-3">
          <motion.label 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2.5 bg-black/40 backdrop-blur-2xl text-white/80 font-bold rounded-full hover:bg-white hover:text-black transition-all cursor-pointer flex items-center gap-2 border border-white/10 hover:border-white shadow-2xl"
          >
            <FaCamera size={14} /><span className="text-xs uppercase tracking-widest font-black">Change Banner</span>
          </motion.label>
        </div>

        {/* ═══ AVATAR + PROFILE INFO OVERLAP ═══ */}
        <div className="relative z-10 container mx-auto px-6 md:px-12 -mt-40">
          <div className="flex flex-col md:flex-row items-end gap-8 md:gap-12 pb-12 border-b border-white/[0.06]">
            
            {/* Avatar Section */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative group"
            >
              <div className="relative w-52 h-52 md:w-60 md:h-60 rounded-full p-1 bg-gradient-to-b from-white/20 to-transparent shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                <div className="w-full h-full rounded-full overflow-hidden border-8 border-black relative">
                  <img src={avatarUrl} alt={profile.username} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="eager" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                     <label className="cursor-pointer p-4 rounded-full bg-white text-black transform scale-0 group-hover:scale-100 transition-transform duration-300">
                        <FaEdit size={24} />
                     </label>
                  </div>
                </div>
                {/* Online Status Dot */}
                <div className="absolute bottom-6 right-6 w-8 h-8 bg-green-500 rounded-full border-4 border-black shadow-lg" />
              </div>
            </motion.div>

            {/* Profile Info Details */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex-1 space-y-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-4 flex-wrap">
                  <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter drop-shadow-2xl">
                    {profile.username}
                  </h1>
                  {user.emailVerified && (
                    <span className="px-3 py-1.5 bg-white text-black text-[10px] uppercase tracking-[0.2em] font-black rounded-md shadow-xl">Verified</span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-white/40 text-xs font-bold uppercase tracking-[0.3em]">
                  <span className="text-white/60">@{(profile.username || "").toLowerCase().replace(/\s+/g, "")}</span>
                  {profile.pronouns && <><FaCircle size={4} className="opacity-20" /><span>{profile.pronouns}</span></>}
                  {profile.location && <><FaCircle size={4} className="opacity-20" /><span>📍 {profile.location}</span></>}
                  <FaCircle size={4} className="opacity-20" /><span>📅 {joinDate}</span>
                </div>
              </div>

              {/* Sexy Bio Section */}
              <div className="max-w-2xl">
                {profile.statusMessage && (
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 text-sm text-white/80 mb-4 italic">
                    <span className="text-lg">{profile.statusEmoji || "🎬"}</span>
                    <span>&quot;{profile.statusMessage}&quot;</span>
                  </div>
                )}
                {profile.bio && (
                  <p className="text-xl text-white/70 font-medium leading-relaxed italic border-l-2 border-white/10 pl-6">
                    &quot;{profile.bio}&quot;
                  </p>
                )}
              </div>

              {/* Interactive Stats Row */}
              <div className="flex items-center gap-12 pt-4">
                <button className="group text-left">
                  <p className="text-3xl font-black text-white group-hover:text-white transition-colors tracking-tight">{followersCount}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 group-hover:text-white/60 transition-colors">Followers</p>
                </button>
                <button className="group text-left">
                  <p className="text-3xl font-black text-white group-hover:text-white transition-colors tracking-tight">{followingCount}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 group-hover:text-white/60 transition-colors">Following</p>
                </button>
                
                {/* Social Cluster */}
                <div className="flex gap-5 items-center">
                  {profile.twitterUrl && <a href={profile.twitterUrl} target="_blank" rel="noreferrer" className="text-white/30 hover:text-white transition-all transform hover:scale-125"><FaTwitter size={18} /></a>}
                  {profile.instagramUrl && <a href={profile.instagramUrl} target="_blank" rel="noreferrer" className="text-white/30 hover:text-white transition-all transform hover:scale-125"><FaInstagram size={18} /></a>}
                  {profile.youtubeUrl && <a href={profile.youtubeUrl} target="_blank" rel="noreferrer" className="text-white/30 hover:text-white transition-all transform hover:scale-125"><FaYoutube size={18} /></a>}
                  {profile.letterboxdUrl && <a href={profile.letterboxdUrl} target="_blank" rel="noreferrer" className="text-white/30 hover:text-white transition-all transform hover:scale-125"><SiLetterboxd size={18} /></a>}
                  {profile.imdbUrl && <a href={profile.imdbUrl} target="_blank" rel="noreferrer" className="text-white/30 hover:text-white transition-all transform hover:scale-125"><FaImdb size={18} /></a>}
                  {profile.website && <a href={profile.website} target="_blank" rel="noreferrer" className="text-white/30 hover:text-white transition-all transform hover:scale-125"><FaGlobe size={18} /></a>}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ ACTION NAV BAR (STICKY & GLASSY) ═══ */}
      <nav className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-black/60 backdrop-blur-2xl">
        <div className="container mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button 
              onClick={() => setShowEditModal(true)} 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-full shadow-2xl hover:bg-neutral-200 transition-all"
            >
              Edit Profile
            </motion.button>
            <Link 
              href={`/u/${encodeURIComponent(profile.username)}`} 
              className="px-8 py-3 border border-white/20 text-white/80 font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-white/10 hover:border-white/40 transition-all"
            >
              Public View
            </Link>
          </div>

          <div className="flex items-center gap-8">
            <button onClick={() => setShowShareModal(true)} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-[10px] uppercase tracking-widest font-black group">
              <FaShareAlt className="group-hover:scale-110 transition-transform" /> <span>Share</span>
            </button>
            <button onClick={handleExportData} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-[10px] uppercase tracking-widest font-black group">
              <FaDownload className="group-hover:scale-110 transition-transform" /> <span>Export</span>
            </button>
            <button onClick={handleCopyLink} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-[10px] uppercase tracking-widest font-black group">
              <FaLink className="group-hover:scale-110 transition-transform" /> <span>{copied ? "Copied" : "Link"}</span>
            </button>
            <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-2 text-red-500/60 hover:text-red-500 transition-colors text-[10px] uppercase tracking-widest font-black group">
              <FaSignOutAlt className="group-hover:translate-x-1 transition-transform" /> <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ═══ CONTENT GRID ═══ */}
      <section className="container mx-auto px-6 md:px-12 py-20 max-w-7xl relative">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-white/[0.01] rounded-full blur-[150px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Stats & Progress */}
          <div className="lg:col-span-4 space-y-12">
            
            {/* Editorial Stats Block */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h3 className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-black border-b border-white/[0.06] pb-4">Cinematic Footprint</h3>
              <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                <div className="space-y-1">
                  <p className="text-4xl font-black text-white">0</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Movies Watched</p>
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-black text-white">0</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">In Watchlist</p>
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-black text-white">0</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Reviews Written</p>
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-black text-white">0</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Tier Lists</p>
                </div>
              </div>
            </motion.div>

            {/* Profile Progress (Premium Glass) */}
            {completeness < 100 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-3xl shadow-2xl space-y-6"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Profile Status</p>
                  <p className="text-2xl font-black text-white">{completeness}%</p>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${completeness}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-white relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                  </motion.div>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">
                  Complete your identity to unlock premium badges and community features.
                </p>
                <button 
                  onClick={() => setShowEditModal(true)}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all"
                >
                  Complete Profile
                </button>
              </motion.div>
            )}
          </div>

          {/* Right Column: Content Sections */}
          <div className="lg:col-span-8 space-y-24">
            
            {/* Sections Wrapper */}
            {[
              { id: 'tier-lists', title: 'Tier Lists', icon: FaLayerGroup, empty: 'No lists curated yet', action: 'Create List', href: '/tier-lists/create' },
              { id: 'watchlist', title: 'Watchlist', icon: FaBookmark, empty: 'Your future viewings are empty', action: 'Explore Movies', href: '/movies' },
              { id: 'reviews', title: 'Recent Reviews', icon: FaPen, empty: 'No critiques published', action: 'Write Review', href: '/movies' },
              { id: 'memes', title: 'My Memes', icon: '😂', empty: 'No humor uploaded', action: 'Browse Memes', href: '/memes' },
            ].map((section, idx) => (
              <motion.section 
                key={section.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                  <h2 className="text-3xl font-black text-white flex items-center gap-4">
                    {typeof section.icon === 'string' ? <span className="text-4xl">{section.icon}</span> : <section.icon className="text-white/40" size={24} />}
                    {section.title}
                  </h2>
                  <Link href={section.href} className="text-[10px] uppercase tracking-widest font-black text-white/30 hover:text-white transition-colors">View All</Link>
                </div>

                <div className="group relative py-20 bg-white/[0.02] hover:bg-white/[0.04] rounded-3xl border border-white/[0.05] hover:border-white/10 transition-all text-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 space-y-6">
                    <p className="text-white/40 font-medium tracking-wide">{section.empty}</p>
                    <Link 
                      href={section.href} 
                      className="inline-flex items-center gap-3 px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-full transform hover:scale-105 transition-all shadow-2xl"
                    >
                      {section.action}
                    </Link>
                  </div>
                </div>
              </motion.section>
            ))}

            {/* ═══ DANGER ZONE (ELEGANT RED) ═══ */}
            <motion.section 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="pt-20"
            >
              <div className="p-12 rounded-[40px] bg-red-950/10 border border-red-500/10 hover:border-red-500/30 transition-all group">
                <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                  <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 group-hover:scale-110 transition-transform">
                    <FaExclamationTriangle size={32} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h2 className="text-2xl font-black text-red-500/80 tracking-tighter uppercase">Termination Protocol</h2>
                    <p className="text-sm text-red-500/40 font-medium leading-relaxed">
                      Permanently erase your identity and cinematic history from the TFiverse database. This action is irreversible.
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowDeleteModal(true)}
                    className="px-8 py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-2xl"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </motion.section>

          </div>
        </div>
      </section>

      {/* ═══ SHARE MODAL (REFINED GLASS) ═══ */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setShowShareModal(false)} 
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 30 }} 
              onClick={e => e.stopPropagation()} 
              className="bg-[#050505] border border-white/10 rounded-[40px] p-10 max-w-4xl w-full shadow-[0_0_100px_rgba(255,255,255,0.05)]"
            >
              <div className="flex items-center justify-between mb-12 border-b border-white/[0.06] pb-6">
                <div>
                  <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Broadcast Identity</h3>
                  <p className="text-xs text-white/30 font-bold uppercase tracking-widest mt-1">Share your cinematic taste with the world</p>
                </div>
                <button onClick={() => setShowShareModal(false)} className="w-12 h-12 rounded-full bg-white/5 hover:bg-white hover:text-black transition-all flex items-center justify-center border border-white/10">
                  <FaTimes size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Visual Card Preview */}
                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white/20 ml-2">Digital Pass</p>
                  <div className="rounded-[32px] overflow-hidden border border-white/10 bg-gradient-to-b from-white/[0.08] to-transparent relative group aspect-[4/5]">
                    <div className="absolute inset-0">
                      <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-20 grayscale group-hover:grayscale-0 transition-all duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    </div>
                    <div className="absolute bottom-8 left-8 right-8 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full border-2 border-white/20 overflow-hidden">
                          <img src={avatarUrl} alt={profile.username} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-2xl font-black text-white">{profile.username}</p>
                          <p className="text-[10px] uppercase tracking-widest text-white/40">TFIVERSE ARCHIVE</p>
                        </div>
                      </div>
                      <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">&quot;{profile.bio || 'Exploring the infinite universe of cinema.'}&quot;</p>
                    </div>
                  </div>
                </div>

                {/* QR & Sharing Actions */}
                <div className="flex flex-col justify-center space-y-8">
                  <div className="p-6 bg-white rounded-[32px] w-fit mx-auto shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(profileLink)}`} alt="QR" className="h-48 w-48" />
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={handleCopyLink}
                      className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-2xl flex items-center justify-center gap-3 hover:bg-neutral-200 transition-all"
                    >
                      {copied ? <FaCheck /> : <FaLink />} {copied ? "Copied to Clipboard" : "Copy Profile URL"}
                    </button>
                    <button 
                      onClick={async () => {
                        if (navigator.share) { try { await navigator.share({ title: `${profile.username} on TFiverse`, url: profileLink }); } catch {} } else { handleCopyLink(); }
                      }}
                      className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl flex items-center justify-center gap-3 transition-all"
                    >
                      <FaShareAlt /> Share via Socials
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <EditProfileModal profile={profile} userId={user.id} isOpen={showEditModal} onClose={() => setShowEditModal(false)} />
      <DeleteAccountModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} />
    </main>
  );
}
