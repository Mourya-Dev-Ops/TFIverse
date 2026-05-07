"use client"

import Link from "next/link";
import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/app/actions/auth";
import { Loader2 } from "lucide-react";

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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

          {/* Brand */}
          <div className="text-center mb-10">
            <h1 className="text-[32px] font-extrabold text-white tracking-[-0.03em] mb-1">
              TFIverse
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
              <div className="w-14 h-14 rounded-full border border-white/15 flex items-center justify-center mx-auto mb-5 text-white/70">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
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
