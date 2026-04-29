"use client"

import Link from "next/link";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { registerUser } from "@/app/actions/auth";
import { Loader2, Volume2, VolumeX } from "lucide-react";

export default function RegisterPage() {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      const isMuted = !videoRef.current.muted;
      videoRef.current.muted = isMuted;
      videoRef.current.volume = isMuted ? 0 : 1;
      setMuted(isMuted);
      
      // Ensure video is playing if unmuting
      if (!isMuted) {
        videoRef.current.play().catch(console.error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess("Initiation successful. Check your email to verify your identity.");
    }
    
    setLoading(false);
  };

  return (
    <main className="min-h-[100dvh] bg-black text-white flex flex-col items-center justify-center relative overflow-x-hidden overflow-y-auto selection:bg-white selection:text-black py-12 px-4">
      
      {/* Background Cinematic Video */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/auth-bg.mp4" type="video/mp4" />
        </video>
        {/* Soft edge vignette — center stays clear */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.5) 100%)" }} />
      </div>

      {/* Volume Toggle */}
      <motion.button
        onClick={toggleMute}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed top-6 right-6 md:top-auto md:bottom-8 md:right-8 z-[60] p-3 md:p-4 rounded-full bg-black/60 backdrop-blur-2xl border border-white/20 text-white shadow-2xl transition-all"
        style={{ pointerEvents: "auto" }}
      >
        {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </motion.button>

      {/* Glassy Register Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 w-[92%] max-w-md px-6 sm:px-8 py-10 sm:py-12 rounded-3xl backdrop-blur-3xl bg-white/[0.03] border border-white/[0.1] shadow-[0_20px_80px_rgba(0,0,0,0.5)]"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-block text-3xl font-bold tracking-tighter mb-2 hover:opacity-80 transition-opacity">
            TFIVERSE
          </Link>
          <p className="text-white/50 tracking-widest text-xs uppercase font-medium">Initiate Protocol</p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 p-4 rounded-xl bg-red-500/10 backdrop-blur-sm border border-red-500/20 text-red-200 text-sm text-center">
            {error}
          </motion.div>
        )}

        {success ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 p-6 rounded-xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.15] text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <p className="text-white/80 text-sm font-medium tracking-wide leading-relaxed">{success}</p>
          </motion.div>
        ) : (
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-semibold text-white/40 tracking-[0.2em] uppercase">Display Name</label>
              <input 
                name="name"
                type="text" 
                className="w-full bg-white/[0.06] backdrop-blur-sm border border-white/[0.1] rounded-xl text-white px-4 py-3 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all placeholder:text-white/20"
                placeholder="Agent Name"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-semibold text-white/40 tracking-[0.2em] uppercase">Email</label>
              <input 
                name="email"
                type="email" 
                className="w-full bg-white/[0.06] backdrop-blur-sm border border-white/[0.1] rounded-xl text-white px-4 py-3 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all placeholder:text-white/20"
                placeholder="agent@tfiverse.com"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-semibold text-white/40 tracking-[0.2em] uppercase">Password</label>
              <input 
                name="password"
                type="password" 
                className="w-full bg-white/[0.06] backdrop-blur-sm border border-white/[0.1] rounded-xl text-white px-4 py-3 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all placeholder:text-white/20 tracking-widest"
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-semibold text-white/40 tracking-[0.2em] uppercase">Confirm Password</label>
              <input 
                name="confirmPassword"
                type="password" 
                className="w-full bg-white/[0.06] backdrop-blur-sm border border-white/[0.1] rounded-xl text-white px-4 py-3 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all placeholder:text-white/20 tracking-widest"
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="group relative w-full bg-white/90 backdrop-blur-sm text-black font-bold py-4 mt-4 rounded-xl hover:bg-white transition-all tracking-[0.2em] uppercase text-xs overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Processing..." : "Create Profile"}
              </span>
            </button>
          </form>
        )}

        <p className="mt-10 text-center text-xs text-white/30 tracking-wide">
          Already cleared? <Link href="/login" className="text-white/70 hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/60">Authenticate</Link>
        </p>
      </motion.div>

    </main>
  );
}
