"use client"

import Link from "next/link";
import { useState, useRef } from "react";
import { registerUser } from "@/app/actions/auth";
import { signIn } from "next-auth/react";
import { Loader2, Volume2, VolumeX } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function RegisterPage() {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
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
    
    const name = formData.get("name") as string;
    if (name && name.length > 25) {
      setError("Display name cannot exceed 25 characters");
      setLoading(false);
      return;
    }

    try {
      const result = await registerUser(formData);
      if (result?.error) { setError(result.error); setLoading(false); }
      else if (result?.success) { setSuccess("Account created! Check your email to verify your identity."); setLoading(false); }
    } catch { setLoading(false); }
  };

  const handleOAuth = (provider: string) => {
    setOauthLoading(provider);
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black">
      
      {/* VIDEO BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <video ref={videoRef} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover scale-105">
          <source src="/videos/auth-bg.mp4" type="video/mp4" />
        </video>
        {/* 4-side vignette */}
        <div className="absolute inset-0 bg-black bg-opacity-30" style={{
          background: `linear-gradient(to right, rgba(0,0,0,0.6) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.6) 100%), linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.6) 100%)`
        }} />
      </div>

      {/* Volume */}
      <button onClick={toggleMute}
        className="absolute bottom-6 right-6 z-[60] p-3 rounded-full border border-white border-opacity-20 text-white text-opacity-70 hover:text-opacity-100 bg-black bg-opacity-40 backdrop-blur-sm cursor-pointer transition-all hover:bg-opacity-60 hidden md:flex items-center justify-center">
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      {/* REGISTER CARD */}
      <div className="relative z-20 w-full max-w-md mx-auto p-10 rounded-[2.5rem] bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-[0_0_80px_rgba(245,158,11,0.1)] group transition-all duration-500 hover:bg-white/[0.03]">
        {/* Ambient glow behind the card */}
        <div className="absolute -inset-0.5 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-xl -z-10 rounded-[3rem]" />

        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-200 tracking-tighter mb-1.5 drop-shadow-lg">TFIVERSE</h1>
          <p className="text-amber-500/60 tracking-[0.3em] text-[9px] uppercase font-bold">Create Account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center font-light backdrop-blur-sm">
            {error}
          </div>
        )}

        {success ? (
          <div className="mb-6 p-6 rounded-2xl bg-white/[0.05] border border-white/[0.12] text-center flex flex-col items-center backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <p className="text-white/80 text-sm font-medium tracking-wide leading-relaxed">{success}</p>
            <Link href="/login" className="mt-6 text-xs text-amber-500 underline underline-offset-4 font-bold tracking-widest uppercase hover:text-amber-400 transition-colors">Go to Login</Link>
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[9px] font-bold text-white/50 tracking-[0.2em] uppercase">Display Name</label>
                <span className="text-[9px] text-white/20 uppercase tracking-wider">Max 25</span>
              </div>
              <input name="name" type="text" maxLength={25} autoComplete="name" required
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl text-white px-5 py-4 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.05] transition-all placeholder:text-white/20 text-sm focus:shadow-[0_0_20px_rgba(245,158,11,0.1)]" 
                placeholder="Your Name" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-bold text-white/50 tracking-[0.2em] uppercase px-1">Email</label>
              <input name="email" type="email" autoComplete="email" required
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl text-white px-5 py-4 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.05] transition-all placeholder:text-white/20 text-sm focus:shadow-[0_0_20px_rgba(245,158,11,0.1)]" 
                placeholder="agent@tfiverse.com" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-bold text-white/50 tracking-[0.2em] uppercase px-1">Password</label>
              <input name="password" type="password" autoComplete="new-password" required minLength={8}
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl text-white px-5 py-4 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.05] transition-all placeholder:text-white/20 tracking-widest text-sm focus:shadow-[0_0_20px_rgba(245,158,11,0.1)]" 
                placeholder="••••••••" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-bold text-white/50 tracking-[0.2em] uppercase px-1">Confirm Password</label>
              <input name="confirmPassword" type="password" autoComplete="new-password" required minLength={8}
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl text-white px-5 py-4 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.05] transition-all placeholder:text-white/20 tracking-widest text-sm focus:shadow-[0_0_20px_rgba(245,158,11,0.1)]" 
                placeholder="••••••••" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-black font-black py-4 mt-4 rounded-2xl hover:from-amber-400 hover:to-amber-300 active:scale-[0.98] transition-all tracking-[0.2em] uppercase text-xs disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] cursor-pointer">
              <span className="flex items-center justify-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "PROCESSING..." : "CREATE ACCOUNT"}
              </span>
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="mt-7 flex items-center justify-center gap-4">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-[10px] text-white/25 uppercase tracking-widest">Or Continue With</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        {/* OAuth Buttons */}
        <div className="mt-5 flex gap-3">
          <button 
            onClick={() => handleOAuth("google")}
            disabled={!!oauthLoading}
            className="flex-1 py-3.5 bg-white/[0.05] border border-white/[0.1] rounded-xl hover:border-white/25 hover:bg-white/[0.1] transition-all text-sm font-semibold text-white/70 hover:text-white active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {oauthLoading === "google" ? <Loader2 className="w-4 h-4 animate-spin" /> : <FcGoogle size={18} />}
            Google
          </button>
          <button 
            onClick={() => handleOAuth("github")}
            disabled={!!oauthLoading}
            className="flex-1 py-3.5 bg-white/[0.05] border border-white/[0.1] rounded-xl hover:border-white/25 hover:bg-white/[0.1] transition-all text-sm font-semibold text-white/70 hover:text-white active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {oauthLoading === "github" ? <Loader2 className="w-4 h-4 animate-spin" /> : <FaGithub size={18} />}
            GitHub
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-white/30 tracking-wide">
          Already have an account?{" "}
          <Link href="/login" className="text-white/70 hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/60">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}
