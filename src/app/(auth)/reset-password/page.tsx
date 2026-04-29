"use client"

import Link from "next/link";
import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/app/actions/auth";
import { Loader2, Volume2, VolumeX } from "lucide-react";

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
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
    formData.set("token", token || "");
    const result = await resetPassword(formData);
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
        <div className="text-center mb-10">
          <Link href="/" className="inline-block text-3xl font-bold tracking-tighter mb-2 hover:opacity-80 transition-opacity">TFIVERSE</Link>
          <p className="text-white/50 tracking-widest text-xs uppercase font-medium">Set New Password</p>
        </div>

        {!token ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full border border-red-500/30 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Invalid Reset Link</h3>
            <p className="text-white/50 text-sm mb-6">This link is invalid or has been used.</p>
            <Link href="/forgot-password" className="inline-block px-6 py-3 bg-white text-black font-bold rounded-xl text-xs tracking-widest uppercase shadow-lg hover:bg-white/90 transition-all">Request New Link</Link>
          </div>
        ) : success ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Password Updated</h3>
            <p className="text-white/50 text-sm mb-6">Your password has been reset.</p>
            <Link href="/login?reset=true" className="inline-block px-6 py-3 bg-white text-black font-bold rounded-xl text-xs tracking-widest uppercase shadow-lg hover:bg-white/90 transition-all">Sign In Now</Link>
          </div>
        ) : (
          <>
            {error && <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center">{error}</div>}
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-semibold text-white/40 tracking-[0.2em] uppercase">New Password</label>
                <input name="password" type="password" autoComplete="new-password"
                  className="w-full bg-white/[0.08] border border-white/[0.12] rounded-xl text-white px-4 py-4 focus:outline-none focus:border-white/40 focus:bg-white/[0.12] transition-all placeholder:text-white/20 tracking-widest text-base" 
                  placeholder="••••••••" required minLength={8} autoFocus />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-semibold text-white/40 tracking-[0.2em] uppercase">Confirm Password</label>
                <input name="confirmPassword" type="password" autoComplete="new-password"
                  className="w-full bg-white/[0.08] border border-white/[0.12] rounded-xl text-white px-4 py-4 focus:outline-none focus:border-white/40 focus:bg-white/[0.12] transition-all placeholder:text-white/20 tracking-widest text-base" 
                  placeholder="••••••••" required minLength={8} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-white text-black font-black py-5 mt-2 rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all tracking-[0.2em] uppercase text-xs disabled:opacity-70 disabled:cursor-not-allowed shadow-xl cursor-pointer">
                <span className="flex items-center justify-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "RESETTING..." : "RESET PASSWORD"}
                </span>
              </button>
            </form>
          </>
        )}

        <p className="mt-10 text-center text-xs text-white/30 tracking-wide">
          <Link href="/login" className="text-white/70 hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/60">Back to Login</Link>
        </p>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    }>
      <ResetForm />
    </Suspense>
  );
}
