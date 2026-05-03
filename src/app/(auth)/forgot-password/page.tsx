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
    const result = await forgotPassword(formData);
    if (result?.error) { setError(result.error); } else { setSuccess(true); }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative py-24 px-4">
      <div className="absolute inset-0 z-0 pointer-events-none hidden md:block">
        <video ref={videoRef} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/videos/auth-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)" }} />
      </div>
      <div className="absolute inset-0 z-0 pointer-events-none md:hidden bg-gradient-to-b from-[#111] via-black to-black" />

      <button onClick={toggleMute}
        className="fixed bottom-8 right-8 z-[60] p-4 rounded-full border border-white/20 text-white shadow-2xl hidden md:flex items-center justify-center bg-black/70 cursor-pointer">
        {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      <div className="relative z-20 w-full max-w-md mx-auto p-10 rounded-[2.5rem] bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-[0_0_80px_rgba(245,158,11,0.1)] group transition-all duration-500 hover:bg-white/[0.03]">
        {/* Ambient glow behind the card */}
        <div className="absolute -inset-0.5 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-xl -z-10 rounded-[3rem]" />

        <Link href="/login" className="inline-flex items-center gap-2 text-amber-500/60 hover:text-amber-400 transition-colors text-[9px] tracking-widest uppercase mb-8 font-bold">
          <ArrowLeft size={14} /> Back to Login
        </Link>
        <div className="text-center mb-10">
          <Link href="/" className="inline-block text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-200 tracking-tighter mb-1.5 drop-shadow-lg hover:opacity-80 transition-opacity">TFIVERSE</Link>
          <p className="text-amber-500/60 tracking-[0.3em] text-[9px] uppercase font-bold">Password Recovery</p>
        </div>

        {error && <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center font-light backdrop-blur-sm">{error}</div>}

        {success ? (
          <div className="mb-6 p-6 rounded-2xl bg-white/[0.05] border border-white/[0.12] text-center flex flex-col items-center backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">Check your email</h3>
            <p className="text-white/60 text-xs leading-relaxed mb-6">If an account exists, we&apos;ve sent a reset link. It expires in 1 hour.</p>
            <Link href="/login" className="inline-block px-6 py-3 bg-white/[0.03] border border-white/5 rounded-xl text-amber-500 hover:text-amber-400 hover:bg-white/[0.05] transition-all text-xs tracking-widest uppercase font-bold">Return to Login</Link>
          </div>
        ) : (
          <>
            <p className="text-white/60 text-xs text-center mb-8 leading-relaxed">Enter your email and we&apos;ll send a reset link.</p>
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-bold text-white/50 tracking-[0.2em] uppercase px-1">Email</label>
                <input name="email" type="email" autoComplete="email"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl text-white px-5 py-4 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.05] transition-all placeholder:text-white/20 text-sm focus:shadow-[0_0_20px_rgba(245,158,11,0.1)]" 
                  placeholder="agent@tfiverse.com" required autoFocus />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-black font-black py-4 mt-4 rounded-2xl hover:from-amber-400 hover:to-amber-300 active:scale-[0.98] transition-all tracking-[0.2em] uppercase text-xs disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] cursor-pointer">
                <span className="flex items-center justify-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "SENDING..." : "SEND RESET LINK"}
                </span>
              </button>
            </form>
          </>
        )}

        <p className="mt-10 text-center text-xs text-white/30 tracking-wide">
          Remember your password? <Link href="/login" className="text-amber-500 hover:text-amber-400 transition-colors underline underline-offset-4 decoration-amber-500/30 hover:decoration-amber-400/80">Authenticate</Link>
        </p>
      </div>
    </main>
  );
}
