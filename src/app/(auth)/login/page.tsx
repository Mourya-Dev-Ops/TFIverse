"use client"

import Link from "next/link";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { loginUser } from "@/app/actions/auth";
import { Loader2, Volume2, VolumeX } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await loginUser(formData);
      
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden selection:bg-white selection:text-black">
      
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
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all"
        style={{ pointerEvents: "auto" }}
      >
        {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </motion.button>

      {/* Glassy Login Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-20 w-full max-w-md px-8 py-12 rounded-2xl backdrop-blur-2xl bg-white/[0.03] border border-white/[0.1] shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-block text-3xl font-bold tracking-tighter mb-2 hover:opacity-80 transition-opacity">
            TFIVERSE
          </Link>
          <p className="text-white/50 tracking-widest text-xs uppercase font-medium">Secure Access</p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-red-500/10 backdrop-blur-sm border border-red-500/20 text-red-200 text-sm text-center font-light">
            {error}
          </motion.div>
        )}

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
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
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-semibold text-white/40 tracking-[0.2em] uppercase">Password</label>
              <Link href="#" className="text-[10px] text-white/30 hover:text-white/70 transition-colors tracking-widest uppercase">Forgot?</Link>
            </div>
            <input 
              name="password"
              type="password" 
              className="w-full bg-white/[0.06] backdrop-blur-sm border border-white/[0.1] rounded-xl text-white px-4 py-3 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all placeholder:text-white/20 tracking-widest"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="group relative w-full bg-white/90 backdrop-blur-sm text-black font-bold py-4 mt-4 rounded-xl hover:bg-white transition-all tracking-[0.2em] uppercase text-xs overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Authenticating..." : "Login"}
            </span>
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-[10px] text-white/30 uppercase tracking-widest">Or Access Via</span>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>

        <div className="mt-6 flex gap-4">
          <button className="flex-1 py-3 bg-white/[0.06] backdrop-blur-sm border border-white/[0.1] rounded-xl hover:border-white/30 hover:bg-white/[0.1] transition-all flex items-center justify-center gap-2 text-xs tracking-widest font-medium uppercase text-white/50 hover:text-white">
            Google
          </button>
          <button className="flex-1 py-3 bg-white/[0.06] backdrop-blur-sm border border-white/[0.1] rounded-xl hover:border-white/30 hover:bg-white/[0.1] transition-all flex items-center justify-center gap-2 text-xs tracking-widest font-medium uppercase text-white/50 hover:text-white">
            Github
          </button>
        </div>

        <p className="mt-10 text-center text-xs text-white/30 tracking-wide">
          Awaiting clearance? <Link href="/register" className="text-white/70 hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/60">Request Access</Link>
        </p>
      </motion.div>

    </main>
  );
}
