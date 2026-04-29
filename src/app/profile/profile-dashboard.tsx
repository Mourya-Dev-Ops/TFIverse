"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  FaEdit, FaCamera, FaSignOutAlt, FaShareAlt, FaDownload, FaLink,
  FaTwitter, FaInstagram, FaYoutube, FaTiktok, FaImdb, FaGlobe,
  FaCheckCircle, FaUserFriends, FaBirthdayCake
} from "react-icons/fa";
import { SiLetterboxd } from "react-icons/si";
import { MdVerified, MdLocationOn, MdDateRange } from "react-icons/md";
import { uploadProfileImage } from "@/app/actions/profile";
import EditProfileModal from "./edit-profile-modal";
import DeleteAccountModal from "./delete-account-modal";
import toast, { Toaster } from "react-hot-toast";

interface ProfileDashboardProps {
  user: any;
  profile: any;
  followersCount: number;
  followingCount: number;
}

export default function ProfileDashboard({ user, profile, followersCount, followingCount }: ProfileDashboardProps) {
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);

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

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
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

  const stats = { ratings: 0, watched: 0, watchlist: 0, likes: 0, reviews: 0, tierLists: 0, memes: 0 };

  return (
    <main className="bg-black min-h-screen text-white font-sans selection:bg-neutral-800 selection:text-white pt-16">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* ─── BANNER ─── */}
      <div className="relative h-[250px] md:h-[350px] w-full bg-neutral-900 group">
        <img src={bannerUrl} alt="Banner" className={`w-full h-full object-cover transition-opacity ${uploading ? 'opacity-50' : 'opacity-100'}`} />
        <label className="absolute top-4 right-4 bg-black/80 hover:bg-black px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold border border-neutral-800 transition-colors cursor-pointer opacity-0 group-hover:opacity-100">
          <FaCamera /> {uploading ? "Uploading..." : "Change Banner"}
          <input type="file" className="hidden" accept="image/*" disabled={uploading} onChange={(e) => handleFileUpload(e, "banner")} />
        </label>
      </div>

      {/* ─── PROFILE INFO ─── */}
      <div className="max-w-6xl mx-auto px-6 relative pb-12">
        
        {/* Avatar */}
        <div className="absolute -top-20 left-6 z-10">
          {/* Pinned Movie Badge (Legacy Feature) */}
          {profile.favoriteMovieSlug && (
            <div className="absolute -top-12 left-4 bg-black/90 border border-neutral-800 rounded-full px-4 py-1.5 flex items-center gap-2 shadow-2xl z-30 group/badge animate-in fade-in slide-in-from-bottom-2 duration-500">
              <span className="text-neutral-500"><FaCamera size={12} /></span>
              <span className="text-[11px] font-black uppercase tracking-widest text-white">{profile.favoriteMovieSlug}</span>
            </div>
          )}

          <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-black bg-neutral-900 group">
            <img src={avatarUrl} alt={profile.username} className={`w-full h-full rounded-full object-cover transition-opacity ${uploading ? 'opacity-50' : 'opacity-100'}`} />
            <label className="absolute bottom-1 right-1 w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white border-4 border-black cursor-pointer transition-colors shadow-lg z-20">
              <FaEdit size={16} />
              <input type="file" className="hidden" accept="image/*" disabled={uploading} onChange={(e) => handleFileUpload(e, "avatar")} />
            </label>
          </div>
          {profile.statusMessage && (
             <div className="absolute -top-8 left-12 bg-[#1a1a1a] border border-neutral-800 rounded-2xl px-4 py-2 text-sm flex items-center gap-2 shadow-lg whitespace-nowrap">
                <span>{profile.statusEmoji || "🍕"}</span>
                <span className="text-neutral-300">{profile.statusMessage}</span>
             </div>
          )}
        </div>

        {/* Content */}
        <div className="pt-28 border-b border-neutral-900 pb-8">
          
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">TFIverse</h1>
            <span className="text-neutral-600 px-3">/</span>
            <h2 className="text-4xl md:text-2xl font-bold tracking-tight text-neutral-400">{profile.username}</h2>
            {completeness === 100 && (
              <MdVerified className="text-blue-500 text-2xl drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-neutral-400 text-sm font-medium mb-4">
            <span>@{(profile.username || "").toLowerCase().replace(/\s+/g, "")}</span>
            {profile.pronouns && <><span>•</span><span>{profile.pronouns}</span></>}
            {profile.location && <><span>•</span><span className="flex items-center gap-1"><MdLocationOn size={16}/> {profile.location}</span></>}
            {dob && <><span>•</span><span className="flex items-center gap-1"><FaBirthdayCake size={14}/> {dob}</span></>}
            {joinDate && <><span>•</span><span className="flex items-center gap-1"><MdDateRange size={16}/> Joined {joinDate}</span></>}
          </div>

          {profile.bio && (
            <p className="text-neutral-300 italic mb-5 max-w-2xl text-base">"{profile.bio}"</p>
          )}

          <div className="flex items-center gap-4 mb-6">
             <div className="flex items-center gap-2 px-4 py-2 bg-[#111] rounded-xl border border-neutral-800 text-sm font-semibold">
                <FaUserFriends className="text-neutral-500" />
                <span className="text-white">{followersCount}</span>
                <span className="text-neutral-400">Followers</span>
             </div>
             <div className="flex items-center gap-2 px-4 py-2 bg-[#111] rounded-xl border border-neutral-800 text-sm font-semibold">
                <FaUserFriends className="text-neutral-500" />
                <span className="text-white">{followingCount}</span>
                <span className="text-neutral-400">Following</span>
             </div>
          </div>

          <div className="flex gap-4 mb-8">
            {profile.twitterUrl && <a href={profile.twitterUrl} target="_blank" rel="noreferrer" className="text-[#1DA1F2] hover:opacity-80 transition-opacity"><FaTwitter size={20} /></a>}
            {profile.instagramUrl && <a href={profile.instagramUrl} target="_blank" rel="noreferrer" className="text-[#E1306C] hover:opacity-80 transition-opacity"><FaInstagram size={20} /></a>}
            {profile.youtubeUrl && <a href={profile.youtubeUrl} target="_blank" rel="noreferrer" className="text-[#FF0000] hover:opacity-80 transition-opacity"><FaYoutube size={20} /></a>}
            {profile.tiktokUrl && <a href={profile.tiktokUrl} target="_blank" rel="noreferrer" className="text-white hover:opacity-80 transition-opacity"><FaTiktok size={20} /></a>}
            {profile.letterboxdUrl && <a href={profile.letterboxdUrl} target="_blank" rel="noreferrer" className="text-[#00e53a] hover:opacity-80 transition-opacity"><SiLetterboxd size={20} /></a>}
            {profile.imdbUrl && <a href={profile.imdbUrl} target="_blank" rel="noreferrer" className="text-[#f5c518] hover:opacity-80 transition-opacity"><FaImdb size={20} /></a>}
            {profile.website && <a href={profile.website} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition-colors"><FaGlobe size={20} /></a>}
          </div>

          <div className="flex flex-col xl:flex-row xl:items-center gap-8 justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowEditModal(true)} 
                style={{ backgroundColor: profile.themeColor || "white", color: (profile.themeColor && profile.themeColor !== "white") ? "white" : "black" }}
                className="px-6 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <FaEdit /> Edit Profile
              </button>
              <Link 
                href={`/u/${encodeURIComponent(profile.username)}`} 
                className="bg-[#111] text-white border border-neutral-800 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-neutral-900 transition-colors"
              >
                View Public Profile
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 md:gap-8">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black">{stats.ratings}</span>
                <span className="text-neutral-500 text-xs font-semibold flex items-center gap-1 mt-1"><span className="text-yellow-500 text-sm">⭐</span> Ratings</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black">{stats.watched}</span>
                <span className="text-neutral-500 text-xs font-semibold flex items-center gap-1 mt-1"><span className="text-green-500 text-sm">👁️</span> Watched</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black">{stats.watchlist}</span>
                <span className="text-neutral-500 text-xs font-semibold flex items-center gap-1 mt-1"><span className="text-blue-500 text-sm">🔖</span> Watchlist</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black">{stats.likes}</span>
                <span className="text-neutral-500 text-xs font-semibold flex items-center gap-1 mt-1"><span className="text-red-500 text-sm">❤️</span> Likes</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── QUICK ACTIONS (Moved Down) ─── */}
        <div className="mt-12 p-8 bg-neutral-950 border border-neutral-900 rounded-2xl flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-6 text-sm font-bold text-neutral-400">
            <button onClick={handleShare} className="flex items-center gap-2 hover:text-white transition-colors"><FaShareAlt /> Share</button>
            <button onClick={handleExportData} className="flex items-center gap-2 hover:text-white transition-colors"><FaDownload /> Export</button>
            <button onClick={handleCopyLink} className="flex items-center gap-2 hover:text-white transition-colors"><FaLink /> {copied ? "Copied Link" : "Copy Link"}</button>
          </div>
          <div className="flex items-center gap-4">
            {completeness === 100 ? (
              <div className="px-4 py-2 bg-green-950/50 border border-green-900 rounded-full text-green-500 text-sm font-bold flex items-center gap-2">
                <FaCheckCircle /> Profile complete
              </div>
            ) : (
              <div className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-full text-neutral-400 text-sm font-bold">
                Profile {completeness}% complete
              </div>
            )}
            <button onClick={() => signOut({ callbackUrl: "/" })} className="px-6 py-2 bg-red-600/10 border border-red-600/20 text-red-500 hover:bg-red-600/20 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
              <FaSignOutAlt /> Sign Out
            </button>
          </div>
        </div>

        {/* ─── TIER LISTS & MEMES (Empty States for now) ─── */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-[#0a0a0a] border border-neutral-900 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-400">Tier Lists</h3>
              <Link href="/tier-list/create" className="text-xs font-bold text-neutral-500 hover:text-white transition-colors">Create New +</Link>
            </div>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="text-4xl mb-4 opacity-20">🏆</span>
              <p className="text-neutral-600 text-sm italic">"No tier lists created yet. Rank your favorites and share them with the universe."</p>
            </div>
          </div>

          <div className="p-8 bg-[#0a0a0a] border border-neutral-900 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-400">Memes</h3>
              <Link href="/memes/upload" className="text-xs font-bold text-neutral-500 hover:text-white transition-colors">Upload +</Link>
            </div>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="text-4xl mb-4 opacity-20">😂</span>
              <p className="text-neutral-600 text-sm italic">"Your meme sanctuary is empty. Upload your best creations to start the streak."</p>
            </div>
          </div>
        </div>

      </div>

      <EditProfileModal profile={profile} userId={user.id} isOpen={showEditModal} onClose={() => setShowEditModal(false)} />
      <DeleteAccountModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} />

    </main>
  );
}
