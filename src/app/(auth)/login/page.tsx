"use client"

import Link from "next/link";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { loginUser } from "@/app/actions/auth";
import { Loader2, Volume2, VolumeX, CheckCircle2 } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    
    if (searchParams.get("verified")) {
      setSuccess("Account verified successfully! You can now log in.");
    }
    if (searchParams.get("reset")) {
      setSuccess("Password reset successfully! Please log in with your new password.");
    }
    
    return () => window.removeEventListener('resize', handleResize);
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
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative py-20 px-4">
      
      {/* DESKTOP BACKGROUND */}
      {!isMobile && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <video ref={videoRef} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src="/videos/auth-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)" }} />
          
          <button
            onClick={toggleMute}
            className="fixed bottom-8 right-8 z-[60] p-4 rounded-full border border-white/20 text-white shadow-2xl transition-all flex items-center justify-center pointer-events-auto bg-black/70"
          >
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      )}

      {/* MOBILE BACKGROUND */}
      {isMobile && (
        <div className="absolute inset-0 z-0 pointer-events-none bg-[#0a0a0a]">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/[0.03] to-transparent" />
        </div>
      )}

      {/* LOGIN CARD */}
      <div 
        className="relative z-20 w-full max-w-md px-6 sm:px-8 py-10 sm:py-12 rounded-3xl border border-white/10 shadow-2xl transition-all"
        style={{ 
          backgroundColor: isMobile ? 'rgb(28, 28, 28)' : 'rgba(20, 20, 20, 0.95)',
          backdropFilter: 'blur(20px)'
        }}
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-block text-3xl font-bold tracking-tighter mb-2 hover:opacity-80 transition-opacity">
            TFIVERSE
          </Link>
          <p className="text-white/50 tracking-widest text-xs uppercase font-medium">Secure Access</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center font-light animate-in fade-in slide-in-from-top-2 duration-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-200 text-sm text-center font-light flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 size={16} />
            {success}
          </div>
        )}

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-semibold text-white/40 tracking-[0.2em] uppercase">Email</label>
            <input 
              name="email" 
              type="email" 
              className="w-full bg-white/[0.08] border border-white/[0.12] rounded-xl text-white px-4 py-4 focus:outline-none focus:border-white/40 focus:bg-white/[0.12] transition-all placeholder:text-white/20 text-base" 
              placeholder="agent@tfiverse.com" 
              required 
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-semibold text-white/40 tracking-[0.2em] uppercase">Password</label>
              <Link href="/forgot-password" className="text-[10px] text-white/30 hover:text-white/70 transition-colors tracking-widest uppercase">Forgot?</Link>
            </div>
            <input 
              name="password" 
              type="password" 
              className="w-full bg-white/[0.08] border border-white/[0.12] rounded-xl text-white px-4 py-4 focus:outline-none focus:border-white/40 focus:bg-white/[0.12] transition-all placeholder:text-white/20 tracking-widest text-base" 
              placeholder="••••••••" 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-white text-black font-black py-5 mt-4 rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all tracking-[0.2em] uppercase text-xs disabled:opacity-70 disabled:cursor-not-allowed shadow-xl cursor-pointer"
          >
            <span className="flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "AUTHENTICATING..." : "LOGIN"}
            </span>
          </button>
        </form>

        <div className="mt-10 flex items-center justify-center gap-4">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-[10px] text-white/30 uppercase tracking-widest">Or Access Via</span>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>

        <div className="mt-8 flex gap-4">
          <button className="flex-1 py-4 bg-white/[0.06] border border-white/[0.1] rounded-xl hover:border-white/30 hover:bg-white/[0.1] transition-all flex items-center justify-center gap-2 text-[10px] tracking-widest font-bold uppercase text-white/50 hover:text-white active:scale-95 cursor-pointer">
            Google
          </button>
          <button className="flex-1 py-4 bg-white/[0.06] border border-white/[0.1] rounded-xl hover:border-white/30 hover:bg-white/[0.1] transition-all flex items-center justify-center gap-2 text-[10px] tracking-widest font-bold uppercase text-white/50 hover:text-white active:scale-95 cursor-pointer">
            Github
          </button>
        </div>

        <p className="mt-12 text-center text-xs text-white/30 tracking-wide">
          Awaiting clearance? <Link href="/register" className="text-white/70 hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/60">Request Access</Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-white" />
        <p className="text-white/40 text-xs tracking-widest uppercase font-bold">Initializing...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
