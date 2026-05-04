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
    try {
      const result = await resetPassword(formData);
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
      
      {/* CINEMATIC VIDEO BACKGROUND (Desktop Only) */}
      <div className="absolute inset-0 z-0 hidden md:block">
        <video ref={videoRef} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover scale-105 opacity-40">
          <source src="/videos/auth-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      {/* MODERN GLASSMORPHISM BACKGROUND (Mobile Only) */}
      <div className="absolute inset-0 z-0 md:hidden bg-gradient-to-br from-black via-purple-950/20 to-black">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" />
      </div>

      {/* Audio Toggle (Desktop Only) */}
      <button
        onClick={toggleMute}
        className="hidden md:flex absolute bottom-8 right-8 z-[60] w-12 h-12 rounded-full border border-white/10 text-white/50 hover:text-white bg-white/5 backdrop-blur-xl items-center justify-center transition-all hover:bg-white/10 hover:scale-110 active:scale-95 group"
      >
        {muted ? <VolumeX size={18} className="group-hover:scale-110 transition-transform" /> : <Volume2 size={18} className="group-hover:scale-110 transition-transform" />}
      </button>

      {/* CONTAINER */}
      <div className="relative z-20 w-full max-w-[440px] mx-auto px-6">
        <div className="p-10 rounded-[2.5rem] bg-white/[0.03] backdrop-blur-[24px] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/5 rounded-full blur-[80px] group-hover:bg-white/10 transition-all duration-700" />

          <div className="text-center mb-10 relative z-10">
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2">TFIVERSE</h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-4 bg-white/20" />
              <p className="text-white/30 tracking-[0.4em] text-[8px] uppercase font-bold">Protocol Reset</p>
              <div className="h-[1px] w-4 bg-white/20" />
            </div>
          </div>

          {!token ? (
            <div className="text-center relative z-10">
              <div className="w-16 h-16 rounded-full border border-red-500/20 flex items-center justify-center mx-auto mb-6 bg-red-500/5">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>
              </div>
              <h3 className="text-white text-lg font-black tracking-tight mb-2">Invalid Link</h3>
              <p className="text-white/50 text-[11px] font-medium tracking-wide leading-relaxed mb-8">This reset sequence is invalid or has already been utilized.</p>
              <Link href="/forgot-password" 
                className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-white/90 active:scale-[0.97] transition-all tracking-[0.2em] uppercase text-[10px]">
                Request New Protocol
              </Link>
            </div>
          ) : success ? (
            <div className="mb-6 p-8 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-center flex flex-col items-center backdrop-blur-xl relative z-10">
              <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mb-6 text-white bg-white/5">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="text-white text-lg font-black tracking-tight mb-2">Success</h3>
              <p className="text-white/50 text-[11px] font-medium tracking-wide leading-relaxed mb-8">Your access key has been successfully reconfigured.</p>
              <Link href="/login?reset=true" 
                className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-white/90 active:scale-[0.97] transition-all tracking-[0.2em] uppercase text-[10px]">
                Sign In Now
              </Link>
            </div>
          ) : (
            <div className="relative z-10">
              {error && <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200 text-[11px] text-center font-medium tracking-wide animate-in fade-in slide-in-from-top-2 duration-300">{error}</div>}
              <form className="flex flex-col gap-6" onSubmit={handleSubmit} method="POST">
                <div className="flex flex-col gap-2.5">
                  <label className="text-[10px] font-black text-white/40 tracking-[0.2em] uppercase px-1">New Access Key</label>
                  <input name="password" type="password" autoComplete="new-password"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl text-white px-6 py-4 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all placeholder:text-white/10 tracking-[0.3em] text-sm font-medium" 
                    placeholder="••••••••" required minLength={8} autoFocus />
                </div>
                <div className="flex flex-col gap-2.5">
                  <label className="text-[10px] font-black text-white/40 tracking-[0.2em] uppercase px-1">Confirm Key</label>
                  <input name="confirmPassword" type="password" autoComplete="new-password"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl text-white px-6 py-4 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all placeholder:text-white/10 tracking-[0.3em] text-sm font-medium" 
                    placeholder="••••••••" required minLength={8} />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-white text-black font-black py-4 mt-4 rounded-2xl hover:bg-white/90 active:scale-[0.97] transition-all tracking-[0.25em] uppercase text-[10px] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_20px_rgba(255,255,255,0.1)]">
                  <span className="flex items-center justify-center gap-3">
                    {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {loading ? "Configuring..." : "Reset Access Key"}
                  </span>
                </button>
              </form>
            </div>
          )}

          <p className="mt-12 text-center text-[10px] text-white/20 tracking-widest uppercase font-bold relative z-10">
            <Link href="/login" className="text-white/60 hover:text-white transition-colors underline underline-offset-8 decoration-white/10 hover:decoration-white/40">Back to Session Entry</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
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
