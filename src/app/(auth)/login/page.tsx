"use client"

import Link from "next/link";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { loginUser, resendVerification } from "@/app/actions/auth";
import { signIn } from "next-auth/react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

function LoginForm() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [showResend, setShowResend] = useState(false);
  const [resending, setResending] = useState(false);
  const [lastEmail, setLastEmail] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (searchParams.get("verified")) {
      setSuccess("Account verified successfully! You can now log in.");
    }
    if (searchParams.get("reset")) {
      setSuccess("Password reset successfully! Please log in with your new password.");
    }
    if (searchParams.get("onboarded")) {
      setSuccess("Profile completed! Please sign in to continue.");
    }
    if (searchParams.get("error")) {
      const errorType = searchParams.get("error");
      if (errorType === "OAuthAccountNotLinked") {
        setError("This email is already registered with a different sign-in method.");
      } else if (errorType === "OAuthSignin" || errorType === "OAuthCallback") {
        setError("OAuth sign-in failed. Please try again.");
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShowResend(false);
    const formData = new FormData(e.currentTarget);
    setLastEmail(formData.get("email") as string || "");
    
    const result = await loginUser(formData);
    
    if (result?.error) { 
      setError(result.error);
      setShowResend(result.error.includes("not verified"));
      setLoading(false); 
    }
  };

  const handleOAuth = (provider: string) => {
    setOauthLoading(provider);
    signIn(provider, { callbackUrl: "/" });
  };

  const handleResend = async () => {
    setResending(true);
    const fd = new FormData();
    fd.set("email", lastEmail);
    const res = await resendVerification(fd);
    if (res?.success) {
      setError("");
      setShowResend(false);
      setSuccess("Verification email sent! Check your inbox.");
    } else if (res?.error) {
      setError(res.error);
    }
    setResending(false);
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
        {/* Soft edge fade into the form side */}
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
          <div className="text-center mb-12">
            <h1 className="text-[32px] font-extrabold text-white tracking-[-0.03em] mb-1">
              TFIverse
            </h1>
            <p className="text-white/30 text-[13px] font-medium">
              Sign in to your account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/8 border border-red-500/15 text-center">
              <p className="text-red-300/90 text-[13px] font-medium">{error}</p>
              {showResend && (
                <button
                  type="button"
                  disabled={resending}
                  onClick={handleResend}
                  className="mt-3 text-[12px] text-white/60 hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white/50 transition-all font-medium disabled:opacity-50"
                >
                  {resending ? "Sending..." : "Resend verification email →"}
                </button>
              )}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/15 text-center flex items-center justify-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-400/80" />
              <p className="text-emerald-300/90 text-[13px] font-medium">{success}</p>
            </div>
          )}

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
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-[12px] font-semibold text-white/40 pl-1">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-white/30 hover:text-white/60 transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl text-white px-4 py-3.5 text-[14px] font-medium focus:outline-none focus:border-white/25 focus:bg-white/[0.06] transition-all placeholder:text-white/15"
                placeholder="••••••••"
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
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-10 text-center text-[13px] text-white/25 font-medium">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-white/70 hover:text-white transition-colors font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[100dvh] bg-black flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-white/30" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
