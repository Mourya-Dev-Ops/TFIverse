"use client"

import Link from "next/link";
import { useState, useRef } from "react";
import { forgotPassword } from "@/app/actions/auth";
import { Loader2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* RIGHT — Auth Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center px-6 py-12 relative">
        
        {/* Mobile subtle background */}
        <div className="absolute inset-0 lg:hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[120px]" />
        </div>

        <div className="w-full max-w-[380px] relative z-10">

          {/* Back Link */}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors text-[13px] font-medium mb-10"
          >
            <ArrowLeft size={16} />
            Back to sign in
          </Link>

          {/* Brand */}
          <div className="text-center mb-10">
            <h1 className="text-[32px] font-extrabold text-white tracking-[-0.03em] mb-1">
              TFIverse
            </h1>
            <p className="text-white/30 text-[13px] font-medium">
              Reset your password
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
              <div className="w-14 h-14 rounded-full border border-white/15 flex items-center justify-center mx-auto mb-5 text-white/70">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-white text-lg font-bold tracking-tight mb-2">Check your email</h3>
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
            <>
              <p className="text-white/35 text-[13px] text-center mb-8 leading-relaxed font-medium">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-semibold text-white/40 pl-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl text-white px-4 py-3.5 text-[14px] font-medium focus:outline-none focus:border-white/25 focus:bg-white/[0.06] transition-all placeholder:text-white/15"
                    placeholder="you@example.com"
                    required
                    autoFocus
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
                      Sending...
                    </span>
                  ) : (
                    "Send reset link"
                  )}
                </button>
              </form>
            </>
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
