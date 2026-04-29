"use client";

import { useState, useEffect } from "react";
import { updateProfile, checkUsername } from "@/app/actions/profile";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const STATUS_EMOJIS = ["🎬", "😊", "🎮", "🎨", "🔥", "⚡", "✨", "🎉", "😴", "🍕", "☕", "🌟"];
const USERNAME_MAX = 20;
const BIO_MAX = 500;

interface EditProfileModalProps {
  profile: any;
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ profile, userId, isOpen, onClose }: EditProfileModalProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [checkingUsername, setCheckingUsername] = useState(false);

  const [formData, setFormData] = useState({
    username: profile.username || "",
    bio: profile.bio || "",
    location: profile.location || "",
    pronouns: profile.pronouns || "",
    website: profile.website || "",
    statusMessage: profile.statusMessage || "",
    statusEmoji: profile.statusEmoji || "🎬",
    twitterUrl: profile.twitterUrl || "",
    instagramUrl: profile.instagramUrl || "",
    youtubeUrl: profile.youtubeUrl || "",
    tiktokUrl: profile.tiktokUrl || "",
    letterboxdUrl: profile.letterboxdUrl || "",
    imdbUrl: profile.imdbUrl || "",
    avatarUrl: profile.avatarUrl || "",
    bannerUrl: profile.bannerUrl || "",
  });

  // Username validation with debounce
  useEffect(() => {
    if (!formData.username || formData.username === profile.username) {
      setUsernameError("");
      return;
    }
    if (formData.username.length < 3) {
      setUsernameError("Min 3 characters");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      setUsernameError("Letters, numbers, underscores only");
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingUsername(true);
      const result = await checkUsername(formData.username, userId);
      setCheckingUsername(false);
      setUsernameError(result.available ? "" : "Username taken");
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username, profile.username, userId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (usernameError || checkingUsername) return;
    setLoading(true);
    setMessage("");
    setError("");

    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => fd.append(key, value));

    const result = await updateProfile(fd);
    if (result.error) {
      setError(result.error);
    } else {
      setMessage("Profile updated successfully");
      setTimeout(() => onClose(), 1000);
    }
    setLoading(false);
  }

  const update = (key: string, value: string) => setFormData(prev => ({ ...prev, [key]: value }));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-black border border-neutral-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-black/95 backdrop-blur-xl border-b border-neutral-800 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-neutral-300">Edit Profile</h2>
            <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && <div className="text-red-400 text-xs p-3 bg-red-950/30 border border-red-900/50">{error}</div>}
            {message && <div className="text-green-400 text-xs p-3 bg-green-950/30 border border-green-900/50">{message}</div>}

            {/* Username */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-semibold text-neutral-500 tracking-[0.2em] uppercase">Username</label>
                <span className="text-[10px] text-neutral-600">{formData.username.length}/{USERNAME_MAX}</span>
              </div>
              <input
                value={formData.username}
                onChange={e => update("username", e.target.value)}
                maxLength={USERNAME_MAX}
                className="w-full bg-transparent border-b border-neutral-800 text-white px-0 py-2 focus:outline-none focus:border-white transition-colors"
                required
              />
              {checkingUsername && <p className="text-neutral-500 text-[10px] mt-1">Checking...</p>}
              {usernameError && <p className="text-red-400 text-[10px] mt-1">{usernameError}</p>}
            </div>

            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-semibold text-neutral-500 tracking-[0.2em] uppercase mb-2 block">Avatar Image URL</label>
                <input
                  value={formData.avatarUrl}
                  onChange={e => update("avatarUrl", e.target.value)}
                  placeholder="https://imgur.com/..."
                  className="w-full bg-transparent border-b border-neutral-800 text-white px-0 py-2 focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-neutral-500 tracking-[0.2em] uppercase mb-2 block">Banner Image URL</label>
                <input
                  value={formData.bannerUrl}
                  onChange={e => update("bannerUrl", e.target.value)}
                  placeholder="https://unsplash.com/..."
                  className="w-full bg-transparent border-b border-neutral-800 text-white px-0 py-2 focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-semibold text-neutral-500 tracking-[0.2em] uppercase">Bio</label>
                <span className={`text-[10px] ${formData.bio.length > BIO_MAX - 50 ? "text-red-400" : "text-neutral-600"}`}>{formData.bio.length}/{BIO_MAX}</span>
              </div>
              <textarea
                value={formData.bio}
                onChange={e => update("bio", e.target.value)}
                maxLength={BIO_MAX}
                rows={3}
                className="w-full bg-transparent border-b border-neutral-800 text-white px-0 py-2 focus:outline-none focus:border-white transition-colors resize-none"
              />
            </div>

            {/* Status */}
            <div>
              <label className="text-[10px] font-semibold text-neutral-500 tracking-[0.2em] uppercase mb-2 block">Status</label>
              <div className="flex gap-3">
                <select
                  value={formData.statusEmoji}
                  onChange={e => update("statusEmoji", e.target.value)}
                  className="bg-neutral-950 border border-neutral-800 text-white px-3 py-2 focus:outline-none focus:border-white transition-colors text-lg w-16"
                >
                  {STATUS_EMOJIS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                <input
                  value={formData.statusMessage}
                  onChange={e => update("statusMessage", e.target.value)}
                  maxLength={150}
                  placeholder="What are you watching?"
                  className="flex-1 bg-transparent border-b border-neutral-800 text-white px-0 py-2 focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            {/* Location + Pronouns */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-semibold text-neutral-500 tracking-[0.2em] uppercase mb-2 block">Location</label>
                <input
                  value={formData.location}
                  onChange={e => update("location", e.target.value)}
                  placeholder="City, Country"
                  className="w-full bg-transparent border-b border-neutral-800 text-white px-0 py-2 focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-neutral-500 tracking-[0.2em] uppercase mb-2 block">Pronouns</label>
                <input
                  value={formData.pronouns}
                  onChange={e => update("pronouns", e.target.value)}
                  placeholder="he/him, she/her, they/them"
                  className="w-full bg-transparent border-b border-neutral-800 text-white px-0 py-2 focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            {/* Social Links */}
            <div>
              <label className="text-[10px] font-semibold text-neutral-500 tracking-[0.2em] uppercase mb-4 block">Social Links</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "twitterUrl", label: "𝕏 Twitter", placeholder: "https://twitter.com/..." },
                  { key: "instagramUrl", label: "Instagram", placeholder: "https://instagram.com/..." },
                  { key: "youtubeUrl", label: "YouTube", placeholder: "https://youtube.com/..." },
                  { key: "tiktokUrl", label: "TikTok", placeholder: "https://tiktok.com/@..." },
                  { key: "letterboxdUrl", label: "Letterboxd", placeholder: "https://letterboxd.com/..." },
                  { key: "imdbUrl", label: "IMDb", placeholder: "https://imdb.com/..." },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="text-[10px] text-neutral-600 mb-1 block">{label}</label>
                    <input
                      value={(formData as any)[key]}
                      onChange={e => update(key, e.target.value)}
                      placeholder={placeholder}
                      className="w-full bg-transparent border-b border-neutral-800 text-white px-0 py-2 focus:outline-none focus:border-white transition-colors text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="text-[10px] font-semibold text-neutral-500 tracking-[0.2em] uppercase mb-2 block">Website</label>
              <input
                value={formData.website}
                onChange={e => update("website", e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full bg-transparent border-b border-neutral-800 text-white px-0 py-2 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors text-xs tracking-widest uppercase font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !!usernameError || checkingUsername}
                className="flex-1 py-3 bg-white text-black font-bold text-xs tracking-widest uppercase hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
