"use client"

import Link from "next/link";
import { useState, useRef } from "react";
import { forgotPassword } from "@/app/actions/auth";
import { Loader2, Volume2, VolumeX, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
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
      const result = await forgotPassword(formData);
      if (result?.error) { 
        setError(result.error); 
      } else { 
        setSuccess(true); 
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
    setLoading(false);
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

      {/* CONTAINER */}
      <div className="relative z-20 w-full max-w-[440px] mx-auto px-6">
        <div className="p-10 rounded-[2.5rem] bg-white/[0.03] backdrop-blur-[24px] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/5 rounded-full blur-[80px] group-hover:bg-white/10 transition-all duration-700" />

          <Link href="/login" className="inline-flex items-center gap-2 text-white/30 hover:text-white transition-colors text-[9px] tracking-widest uppercase mb-8 font-black relative z-10">
            <ArrowLeft size={14} /> Back to Identity Check
          </Link>

          <div className="text-center mb-10 relative z-10">
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2">TFIVERSE</h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-4 bg-white/20" />
              <p className="text-white/30 tracking-[0.4em] text-[8px] uppercase font-bold">Key Recovery</p>
              <div className="h-[1px] w-4 bg-white/20" />
            </div>
          </div>

          {error && <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200 text-[11px] text-center font-medium tracking-wide relative z-10 animate-in fade-in slide-in-from-top-2 duration-300">{error}</div>}

          {success ? (
            <div className="mb-6 p-8 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-center flex flex-col items-center backdrop-blur-xl relative z-10">
              <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mb-6 text-white bg-white/5">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <h3 className="text-white text-lg font-black tracking-tight mb-2">Transmission Sent</h3>
              <p className="text-white/50 text-[11px] font-medium tracking-wide leading-relaxed mb-8">If an account matches your alias, a reset link will arrive shortly. It remains active for 60 minutes.</p>
              <Link href="/login" className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-white/90 active:scale-[0.97] transition-all tracking-[0.2em] uppercase text-[10px]">Return to Login</Link>
            </div>
          ) : (
            <div className="relative z-10">
              <p className="text-white/50 text-[11px] text-center mb-8 leading-relaxed font-medium tracking-wide px-4">Provide your network identity to receive an encrypted reset link via priority mail.</p>
              <form className="flex flex-col gap-6" onSubmit={handleSubmit} method="POST">
                <div className="flex flex-col gap-2.5">
                  <label className="text-[10px] font-black text-white/40 tracking-[0.2em] uppercase px-1">Identity</label>
                  <input name="email" type="email" autoComplete="email"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl text-white px-6 py-4 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all placeholder:text-white/10 text-sm font-medium" 
                    placeholder="agent@tfiverse.com" required autoFocus />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-white text-black font-black py-4 mt-4 rounded-2xl hover:bg-white/90 active:scale-[0.97] transition-all tracking-[0.25em] uppercase text-[10px] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_20px_rgba(255,255,255,0.1)]">
                  <span className="flex items-center justify-center gap-3">
                    {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {loading ? "Transmitting..." : "Send Reset Protocol"}
                  </span>
                </button>
              </form>
            </div>
          )}

          <p className="mt-12 text-center text-[10px] text-white/20 tracking-widest uppercase font-bold relative z-10">
            Remembered your access? <Link href="/login" className="text-white/60 hover:text-white transition-colors underline underline-offset-8 decoration-white/10 hover:decoration-white/40">Authenticate</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
