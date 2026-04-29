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

      <div className="relative z-20 w-full max-w-md px-6 sm:px-8 py-10 sm:py-12 rounded-3xl shadow-2xl
                       bg-[#1c1c1c] md:bg-[#141414]/95 border border-white/[0.12] md:border-white/[0.08]
                       md:backdrop-blur-xl">
        <Link href="/login" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-xs tracking-widest uppercase mb-8">
          <ArrowLeft size={14} /> Back to Login
        </Link>
        <div className="text-center mb-10">
          <Link href="/" className="inline-block text-3xl font-bold tracking-tighter mb-2 hover:opacity-80 transition-opacity">TFIVERSE</Link>
          <p className="text-white/50 tracking-widest text-xs uppercase font-medium">Password Recovery</p>
        </div>

        {error && <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center">{error}</div>}

        {success ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Check your email</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-6">If an account exists, we&apos;ve sent a reset link. It expires in 1 hour.</p>
            <Link href="/login" className="inline-block px-6 py-3 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white/70 hover:text-white hover:border-white/30 transition-all text-xs tracking-widest uppercase font-bold">Return to Login</Link>
          </div>
        ) : (
          <>
            <p className="text-white/40 text-sm text-center mb-8 leading-relaxed">Enter your email and we&apos;ll send a reset link.</p>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-semibold text-white/40 tracking-[0.2em] uppercase">Email</label>
                <input name="email" type="email" autoComplete="email"
                  className="w-full bg-white/[0.08] border border-white/[0.12] rounded-xl text-white px-4 py-4 focus:outline-none focus:border-white/40 focus:bg-white/[0.12] transition-all placeholder:text-white/20 text-base" 
                  placeholder="agent@tfiverse.com" required autoFocus />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-white text-black font-black py-5 mt-2 rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all tracking-[0.2em] uppercase text-xs disabled:opacity-70 disabled:cursor-not-allowed shadow-xl cursor-pointer">
                <span className="flex items-center justify-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "SENDING..." : "SEND RESET LINK"}
                </span>
              </button>
            </form>
          </>
        )}

        <p className="mt-10 text-center text-xs text-white/30 tracking-wide">
          Remember your password? <Link href="/login" className="text-white/70 hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/60">Authenticate</Link>
        </p>
      </div>
    </main>
  );
}
