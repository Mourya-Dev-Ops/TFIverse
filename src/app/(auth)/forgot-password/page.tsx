"use client"

import Link from "next/link";
import { useState, useRef } from "react";
import { forgotPassword } from "@/app/actions/auth";
import { Loader2, ArrowLeft, Volume2, VolumeX } from "lucide-react";

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
      if (!videoRef.current.muted) videoRef.current.play().catch(() => {});
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
    <main className="min-h-[100dvh] w-full flex items-stretch relative overflow-hidden bg-black">
      
      {/* LEFT — Cinematic Video (Desktop Only) */}
      <div className="hidden lg:block lg:w-[55%] relative">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/auth-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black" />
        <div className="absolute inset-0 bg-black/15" />
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
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/auth-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />
        </div>

        <div className="w-full max-w-[380px] relative z-10">

          {/* Back Link */}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors text-[13px] font-medium mb-8"
          >
            <ArrowLeft size={16} />
            Back to sign in
          </Link>

          {/* Brand */}
          <div className="text-center mb-10">
            <h1 className="text-[28px] sm:text-[32px] font-extrabold text-white tracking-[-0.03em] mb-1.5">
              Forgot password? 🔑
            </h1>
            <p className="text-white/30 text-[13px] font-medium">
              No worries, we&apos;ll send you a reset link
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/8 border border-red-500/15 text-center">
              <p className="text-red-300/90 text-[13px] font-medium">{error}</p>
            </div>
          )}

          {success ? (
            <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-center">
              <div className="text-[40px] mb-4">📧</div>
              <h3 className="text-white text-lg font-bold tracking-tight mb-2">Check your email ✨</h3>
              <p className="text-white/40 text-[13px] font-medium leading-relaxed mb-6">
                If an account exists with that email, we&apos;ve sent a password reset link. It expires in 60 minutes.
              </p>
              <Link
                href="/login"
                className="inline-block w-full bg-white text-black font-semibold py-3.5 rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all text-[14px] text-center"
              >
                Return to sign in
              </Link>
            </div>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-white/40 pl-1">Email</label>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl text-white px-4 py-3 text-[14px] font-medium focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 focus:bg-white/[0.06] transition-all placeholder:text-white/15"
                  placeholder="you@example.com"
                  required
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-semibold py-3 mt-1 rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all text-[14px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  "Send reset link"
                )}
              </button>
            </form>
          )}

          {/* Footer */}
          <p className="mt-10 text-center text-[13px] text-white/25 font-medium">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-white/70 hover:text-white transition-colors font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
