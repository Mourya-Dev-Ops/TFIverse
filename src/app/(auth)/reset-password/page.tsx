"use client"

import Link from "next/link";
import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/app/actions/auth";
import { Loader2, Volume2, VolumeX, LockKeyhole, CheckCircle2 } from "lucide-react";

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
      if (!videoRef.current.muted) videoRef.current.play().catch(() => {});
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
    <main className="min-h-[100dvh] w-full flex items-stretch relative overflow-hidden bg-black">
      
      {/* LEFT — Cinematic Video (Desktop Only) */}
      <div className="hidden lg:block lg:w-[55%] relative">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover transform-gpu"
        >
          <source src="/videos/auth-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Volume Toggle */}
      <button
        onClick={toggleMute}
        className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full border border-white/10 text-white/40 hover:text-white bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-white/10 hover:border-white/20 active:scale-90"
        title={muted ? "Unmute" : "Mute"}
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>

      {/* RIGHT — Auth Form */}
      <div className="w-full lg:w-[45%] flex flex-col items-center justify-center px-6 py-10 relative">
        
        {/* Mobile header with video peek */}
        <div className="lg:hidden w-full mb-6 -mx-6 -mt-10 relative h-[160px] overflow-hidden shrink-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover transform-gpu"
          >
            <source src="/videos/auth-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="w-full max-w-[380px] relative z-10">

          {/* Brand */}
          <div className="text-center mb-10">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] shadow-inner flex items-center justify-center mx-auto mb-4">
              <LockKeyhole className="w-6 h-6 text-white/60" />
            </div>
            <h1 className="text-[28px] sm:text-[32px] font-extrabold text-white tracking-[-0.03em] mb-1.5">
              New password
            </h1>
            <p className="text-white/30 text-[13px] font-medium">
              Set a new password
            </p>
          </div>

          {!token ? (
            <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-center">
              <div className="w-14 h-14 rounded-full border border-red-500/20 flex items-center justify-center mx-auto mb-5 bg-red-500/5">
                <svg className="w-7 h-7 text-red-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-white text-lg font-bold tracking-tight mb-2">Invalid Link</h3>
              <p className="text-white/40 text-[13px] font-medium leading-relaxed mb-6">
                This reset link is invalid or has already been used.
              </p>
              <Link
                href="/forgot-password"
                className="inline-block w-full bg-white text-black font-semibold py-3.5 rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all text-[14px] text-center"
              >
                Request new link
              </Link>
            </div>
          ) : success ? (
            <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 bg-white/[0.03] border border-white/[0.08] shadow-inner">
                <CheckCircle2 className="w-8 h-8 text-white/60" />
              </div>
              <h3 className="text-white text-lg font-bold tracking-tight mb-2">Password Updated</h3>
              <p className="text-white/40 text-[13px] font-medium leading-relaxed mb-6">
                Your password has been reset successfully.
              </p>
              <Link
                href="/login?reset=true"
                className="inline-block w-full bg-white text-black font-semibold py-3.5 rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all text-[14px] text-center"
              >
                Sign in now
              </Link>
            </div>
          ) : (
            <>
              {/* Error */}
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/8 border border-red-500/15 text-center">
                  <p className="text-red-300/90 text-[13px] font-medium">{error}</p>
                </div>
              )}

              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-semibold text-white/40 pl-1">New Password</label>
                  <input
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl text-white px-4 py-3.5 text-[14px] font-medium focus:outline-none focus:border-white/25 focus:bg-white/[0.06] transition-all placeholder:text-white/15"
                    placeholder="••••••••"
                    required
                    minLength={8}
                    autoFocus
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-semibold text-white/40 pl-1">Confirm Password</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl text-white px-4 py-3.5 text-[14px] font-medium focus:outline-none focus:border-white/25 focus:bg-white/[0.06] transition-all placeholder:text-white/15"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black font-semibold py-3.5 mt-2 rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all text-[14px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Resetting...
                    </span>
                  ) : (
                    "Reset password"
                  )}
                </button>
              </form>
            </>
          )}

          {/* Footer */}
          <p className="mt-10 text-center text-[13px] text-white/25 font-medium">
            <Link
              href="/login"
              className="text-white/70 hover:text-white transition-colors font-semibold"
            >
              ← Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[100dvh] bg-black flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-white/30" />
      </div>
    }>
      <ResetForm />
    </Suspense>
  );
}
