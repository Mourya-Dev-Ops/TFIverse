"use client"

import Link from "next/link";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { loginUser } from "@/app/actions/auth";
import { Loader2, Volume2, VolumeX, CheckCircle2 } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (searchParams.get("verified")) {
      setSuccess("Account verified successfully! You can now log in.");
    }
    if (searchParams.get("reset")) {
      setSuccess("Password reset successfully! Please log in with your new password.");
    }
  }, [searchParams]);

  const toggleMute = () => {
    if (videoRef.current) {
      const isMuted = !videoRef.current.muted;
      videoRef.current.muted = isMuted;
      videoRef.current.volume = isMuted ? 0 : 1;
      setMuted(isMuted);
      if (!isMuted) videoRef.current.play().catch(console.error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    try {
      const result = await loginUser(formData);
      if (result?.error) { setError(result.error); setLoading(false); }
    } catch (err) { console.error(err); setLoading(false); }
  };

  return (
    <main className="min-h-[100dvh] bg-black text-white flex flex-col items-center justify-center relative overflow-x-hidden overflow-y-auto selection:bg-white selection:text-black py-16 px-4">
      
      {/* Background Video — DESKTOP ONLY */}
      <div className="absolute inset-0 z-0 pointer-events-none hidden md:block">
        <video ref={videoRef} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/videos/auth-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.40)' }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)" }} />
      </div>

      {/* Mobile — Subtle ambient glow instead of video */}
      <div className="absolute inset-0 z-0 pointer-events-none md:hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)' }} />
      </div>

      {/* Volume Toggle — DESKTOP ONLY */}
      <motion.button
        onClick={toggleMute}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-[60] p-4 rounded-full border border-white/20 text-white shadow-2xl transition-all hidden md:flex items-center justify-center"
        style={{ pointerEvents: "auto", backgroundColor: 'rgba(0,0,0,0.7)' }}
      >
        {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </motion.button>

      {/* Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-20 w-full max-w-md px-6 sm:px-8 py-10 sm:py-12 rounded-3xl border border-white/[0.12]"
        style={{ backgroundColor: 'rgba(18,18,18,0.98)', boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 20px 80px rgba(0,0,0,0.9)' }}
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-block text-3xl font-bold tracking-tighter mb-2 hover:opacity-80 transition-opacity">
            TFIVERSE
          </Link>
          <p className="text-white/50 tracking-widest text-xs uppercase font-medium">Secure Access</p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center font-light">
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-200 text-sm text-center font-light flex items-center justify-center gap-2">
            <CheckCircle2 size={16} />
            {success}
          </motion.div>
        )}

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-semibold text-white/40 tracking-[0.2em] uppercase">Email</label>
            <input name="email" type="email" className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl text-white px-4 py-3 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all placeholder:text-white/20" placeholder="agent@tfiverse.com" required />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-semibold text-white/40 tracking-[0.2em] uppercase">Password</label>
              <Link href="/forgot-password" className="text-[10px] text-white/30 hover:text-white/70 transition-colors tracking-widest uppercase">Forgot?</Link>
            </div>
            <input name="password" type="password" className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl text-white px-4 py-3 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all placeholder:text-white/20 tracking-widest" placeholder="••••••••" required />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-white/90 text-black font-bold py-4 mt-4 rounded-xl hover:bg-white transition-all tracking-[0.2em] uppercase text-xs disabled:opacity-70 disabled:cursor-not-allowed shadow-lg">
            <span className="flex items-center justify-center gap-2">
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
          <button className="flex-1 py-3 bg-white/[0.06] border border-white/[0.1] rounded-xl hover:border-white/30 hover:bg-white/[0.1] transition-all flex items-center justify-center gap-2 text-xs tracking-widest font-medium uppercase text-white/50 hover:text-white">
            Google
          </button>
          <button className="flex-1 py-3 bg-white/[0.06] border border-white/[0.1] rounded-xl hover:border-white/30 hover:bg-white/[0.1] transition-all flex items-center justify-center gap-2 text-xs tracking-widest font-medium uppercase text-white/50 hover:text-white">
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-white/20" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
