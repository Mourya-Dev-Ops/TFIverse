"use client"

import Link from "next/link";
import { useState, useRef } from "react";
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
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
      if (!videoRef.current.muted) videoRef.current.play().catch(console.error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const formData = new FormData(e.currentTarget);
    
    // Client-side name length validation
    const name = formData.get("name") as string;
    if (name && name.length > 25) {
      setError("Display name cannot exceed 25 characters");
      setLoading(false);
      return;
    }

    try {
      const result = await registerUser(formData);
      if (result?.error) { setError(result.error); setLoading(false); }
      else if (result?.success) { setSuccess("Initiation successful. Check your email to verify your identity."); setLoading(false); }
    } catch { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative py-24 px-4">
      
      {/* DESKTOP: Video Background */}
      <div className="absolute inset-0 z-0 pointer-events-none hidden md:block">
        <video ref={videoRef} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/videos/auth-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)" }} />
      </div>

      {/* MOBILE: Simple gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none md:hidden bg-gradient-to-b from-[#111] via-black to-black" />

      {/* Volume — desktop only */}
      <button onClick={toggleMute}
        className="fixed bottom-8 right-8 z-[60] p-4 rounded-full border border-white/20 text-white shadow-2xl hidden md:flex items-center justify-center bg-black/70 cursor-pointer">
        {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      {/* REGISTER CARD */}
      <div className="relative z-20 w-full max-w-md px-6 sm:px-8 py-10 sm:py-12 rounded-3xl shadow-2xl
                       bg-[#1c1c1c] md:bg-[#141414]/95 border border-white/[0.12] md:border-white/[0.08]
                       md:backdrop-blur-xl">

        <div className="text-center mb-10">
          <Link href="/" className="inline-block text-3xl font-bold tracking-tighter mb-2 hover:opacity-80 transition-opacity">
            TFIVERSE
          </Link>
          <p className="text-white/50 tracking-widest text-xs uppercase font-medium">Initiate Protocol</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center font-light">
            {error}
          </div>
        )}

        {success ? (
          <div className="mb-6 p-6 rounded-xl bg-white/[0.06] border border-white/[0.15] text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <p className="text-white/80 text-sm font-medium tracking-wide leading-relaxed">{success}</p>
            <Link href="/login" className="mt-6 text-xs text-white underline underline-offset-4 font-bold tracking-widest uppercase">Go to Login</Link>
          </div>
        ) : (
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-semibold text-white/40 tracking-[0.2em] uppercase">Display Name</label>
                <span className="text-[10px] text-white/20">Max 25 chars</span>
              </div>
              <input name="name" type="text" maxLength={25} autoComplete="name"
                className="w-full bg-white/[0.08] border border-white/[0.12] rounded-xl text-white px-4 py-4 focus:outline-none focus:border-white/40 focus:bg-white/[0.12] transition-all placeholder:text-white/20 text-base" 
                placeholder="Agent Name" required />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-semibold text-white/40 tracking-[0.2em] uppercase">Email</label>
              <input name="email" type="email" autoComplete="email"
                className="w-full bg-white/[0.08] border border-white/[0.12] rounded-xl text-white px-4 py-4 focus:outline-none focus:border-white/40 focus:bg-white/[0.12] transition-all placeholder:text-white/20 text-base" 
                placeholder="agent@tfiverse.com" required />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-semibold text-white/40 tracking-[0.2em] uppercase">Password</label>
              <input name="password" type="password" autoComplete="new-password"
                className="w-full bg-white/[0.08] border border-white/[0.12] rounded-xl text-white px-4 py-4 focus:outline-none focus:border-white/40 focus:bg-white/[0.12] transition-all placeholder:text-white/20 tracking-widest text-base" 
                placeholder="••••••••" required minLength={8} />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-semibold text-white/40 tracking-[0.2em] uppercase">Confirm Password</label>
              <input name="confirmPassword" type="password" autoComplete="new-password"
                className="w-full bg-white/[0.08] border border-white/[0.12] rounded-xl text-white px-4 py-4 focus:outline-none focus:border-white/40 focus:bg-white/[0.12] transition-all placeholder:text-white/20 tracking-widest text-base" 
                placeholder="••••••••" required minLength={8} />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-white text-black font-black py-5 mt-4 rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all tracking-[0.2em] uppercase text-xs disabled:opacity-70 disabled:cursor-not-allowed shadow-xl cursor-pointer">
              <span className="flex items-center justify-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "PROCESSING..." : "CREATE PROFILE"}
              </span>
            </button>
          </form>
        )}

        <p className="mt-12 text-center text-xs text-white/30 tracking-wide">
          Already cleared? <Link href="/login" className="text-white/70 hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/60">Authenticate</Link>
        </p>
      </div>
    </main>
  );
}
