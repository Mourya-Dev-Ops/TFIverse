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
      if (result?.error) { 
        setError(result.error); 
        setLoading(false); 
      }
      else if (result?.success) { 
        setSuccess("Account created! Check your email to verify your identity."); 
        setLoading(false); 
      }
    } catch (err) { 
      setError("An unexpected error occurred. Please try again.");
      setLoading(false); 
    }
  };

  const handleOAuth = (provider: string) => {
    setOauthLoading(provider);
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#050505]">
      
      {/* CINEMATIC VIDEO BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <video ref={videoRef} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover scale-105 opacity-40">
          <source src="/videos/auth-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      {/* Audio Toggle */}
      <button onClick={toggleMute}
        className="absolute bottom-8 right-8 z-[60] w-12 h-12 rounded-full border border-white/10 text-white/50 hover:text-white bg-white/5 backdrop-blur-xl flex items-center justify-center transition-all hover:bg-white/10 hover:scale-110 active:scale-95 group">
        {muted ? <VolumeX size={18} className="group-hover:scale-110 transition-transform" /> : <Volume2 size={18} className="group-hover:scale-110 transition-transform" />}
      </button>

      {/* REGISTER CONTAINER */}
      <div className="relative z-20 w-full max-w-[480px] mx-auto px-6 py-12">
        <div className="p-10 rounded-[2.5rem] bg-white/[0.03] backdrop-blur-[24px] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/5 rounded-full blur-[80px] group-hover:bg-white/10 transition-all duration-700" />

          <div className="text-center mb-10 relative z-10">
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2">TFIVERSE</h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-4 bg-white/20" />
              <p className="text-white/30 tracking-[0.4em] text-[8px] uppercase font-bold">New ID Registration</p>
              <div className="h-[1px] w-4 bg-white/20" />
            </div>
          </div>

          {error && (
            <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200 text-[11px] text-center font-medium tracking-wide animate-in fade-in slide-in-from-top-2 duration-300">
              {error}
            </div>
          )}

          {success ? (
            <div className="mb-6 p-8 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-center flex flex-col items-center backdrop-blur-xl relative z-10">
              <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mb-6 text-white bg-white/5">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="text-white text-lg font-black tracking-tight mb-2">Registration Complete</h3>
              <p className="text-white/50 text-[11px] font-medium tracking-wide leading-relaxed mb-8">{success}</p>
              <Link href="/login" 
                className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-white/90 active:scale-[0.97] transition-all tracking-[0.2em] uppercase text-[10px]">
                Proceed to Login
              </Link>
            </div>
          ) : (
            <form className="flex flex-col gap-5 relative z-10" onSubmit={handleSubmit} method="POST">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-white/40 tracking-[0.2em] uppercase">Alias</label>
                  <span className="text-[8px] text-white/20 uppercase tracking-[0.2em] font-bold">Max 25</span>
                </div>
                <input name="name" type="text" maxLength={25} autoComplete="name" required
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl text-white px-6 py-4 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all placeholder:text-white/10 text-sm font-medium" 
                  placeholder="Your Name" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-white/40 tracking-[0.2em] uppercase px-1">Network Identity</label>
                <input name="email" type="email" autoComplete="email" required
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl text-white px-6 py-4 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all placeholder:text-white/10 text-sm font-medium" 
                  placeholder="agent@tfiverse.com" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-white/40 tracking-[0.2em] uppercase px-1">Keyphrase</label>
                  <input name="password" type="password" autoComplete="new-password" required minLength={8}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl text-white px-6 py-4 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all placeholder:text-white/10 tracking-[0.2em] text-sm font-medium" 
                    placeholder="••••••••" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-white/40 tracking-[0.2em] uppercase px-1">Verify Key</label>
                  <input name="confirmPassword" type="password" autoComplete="new-password" required minLength={8}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl text-white px-6 py-4 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all placeholder:text-white/10 tracking-[0.2em] text-sm font-medium" 
                    placeholder="••••••••" />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-white text-black font-black py-4 mt-4 rounded-2xl hover:bg-white/90 active:scale-[0.97] transition-all tracking-[0.25em] uppercase text-[10px] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_20px_rgba(255,255,255,0.1)]">
                <span className="flex items-center justify-center gap-3">
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {loading ? "Processing..." : "Generate Account"}
                </span>
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="mt-10 mb-8 flex items-center justify-center gap-6 opacity-20 relative z-10">
            <div className="h-[0.5px] bg-white flex-1" />
            <span className="text-[8px] text-white uppercase tracking-[0.4em] font-black">Unified Login</span>
            <div className="h-[0.5px] bg-white flex-1" />
          </div>

          {/* OAuth Buttons */}
          <div className="flex gap-4 relative z-10">
            <button 
              type="button"
              onClick={() => handleOAuth("google")}
              disabled={!!oauthLoading}
              className="flex-1 py-4 bg-white/[0.04] border border-white/10 rounded-2xl hover:border-white/20 hover:bg-white/[0.08] transition-all text-[10px] font-black text-white/50 hover:text-white active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 tracking-widest uppercase"
            >
              {oauthLoading === "google" ? <Loader2 className="w-3 h-3 animate-spin" /> : <FcGoogle size={18} />}
              Google
            </button>
            <button 
              type="button"
              onClick={() => handleOAuth("github")}
              disabled={!!oauthLoading}
              className="flex-1 py-4 bg-white/[0.04] border border-white/10 rounded-2xl hover:border-white/20 hover:bg-white/[0.08] transition-all text-[10px] font-black text-white/50 hover:text-white active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 tracking-widest uppercase"
            >
              {oauthLoading === "github" ? <Loader2 className="w-3 h-3 animate-spin" /> : <FaGithub size={18} />}
              GitHub
            </button>
          </div>

          <p className="mt-12 text-center text-[10px] text-white/20 tracking-widest uppercase font-bold relative z-10">
            Already active?{" "}
            <Link href="/login" className="text-white/60 hover:text-white transition-colors underline underline-offset-8 decoration-white/10 hover:decoration-white/40">
              Identify Session
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
