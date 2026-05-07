"use client"

import Link from "next/link";
import { useState, useRef } from "react";
import { registerUser } from "@/app/actions/auth";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

export default function RegisterPage() {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
        setSuccess("Account created! Check your email to verify your account."); 
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
              Create your account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/8 border border-red-500/15 text-center">
              <p className="text-red-300/90 text-[13px] font-medium">{error}</p>
            </div>
          )}

          {/* Success */}
          {success ? (
            <div className="mb-6 p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-center">
              <div className="w-14 h-14 rounded-full border border-white/15 flex items-center justify-center mx-auto mb-5 text-white/70">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-white text-lg font-bold tracking-tight mb-2">Account Created</h3>
              <p className="text-white/40 text-[13px] font-medium leading-relaxed mb-6">{success}</p>
              <Link
                href="/login"
                className="inline-block w-full bg-white text-black font-semibold py-3.5 rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all text-[14px] text-center"
              >
                Go to Sign In
              </Link>
            </div>
          ) : (
            <>
              {/* Google OAuth */}
              <button 
                type="button"
                onClick={() => handleOAuth("google")}
                disabled={!!oauthLoading}
                className="w-full py-3.5 bg-white/[0.06] border border-white/[0.08] rounded-xl hover:bg-white/[0.10] hover:border-white/[0.15] transition-all text-[13px] font-semibold text-white/80 hover:text-white flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
              >
                {oauthLoading === "google" ? <Loader2 className="w-4 h-4 animate-spin" /> : <FcGoogle size={18} />}
                Continue with Google
              </button>

              {/* Divider */}
              <div className="my-8 flex items-center gap-4">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-[11px] text-white/20 uppercase tracking-[0.15em] font-medium">or</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>

              {/* Form */}
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[12px] font-semibold text-white/40 pl-1">Name</label>
                    <span className="text-[10px] text-white/15 font-medium pr-1">Max 25</span>
                  </div>
                  <input
                    name="name"
                    type="text"
                    maxLength={25}
                    autoComplete="name"
                    required
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl text-white px-4 py-3.5 text-[14px] font-medium focus:outline-none focus:border-white/25 focus:bg-white/[0.06] transition-all placeholder:text-white/15"
                    placeholder="Your name"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-semibold text-white/40 pl-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl text-white px-4 py-3.5 text-[14px] font-medium focus:outline-none focus:border-white/25 focus:bg-white/[0.06] transition-all placeholder:text-white/15"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-semibold text-white/40 pl-1">Password</label>
                    <input
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl text-white px-4 py-3.5 text-[14px] font-medium focus:outline-none focus:border-white/25 focus:bg-white/[0.06] transition-all placeholder:text-white/15"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-semibold text-white/40 pl-1">Confirm</label>
                    <input
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl text-white px-4 py-3.5 text-[14px] font-medium focus:outline-none focus:border-white/25 focus:bg-white/[0.06] transition-all placeholder:text-white/15"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black font-semibold py-3.5 mt-2 rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all text-[14px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    "Create account"
                  )}
                </button>
              </form>
            </>
          )}

          {/* Footer */}
          <p className="mt-10 text-center text-[13px] text-white/25 font-medium">
            Already have an account?{" "}
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
