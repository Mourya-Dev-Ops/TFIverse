"use client"

import Link from "next/link";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { loginUser, resendVerification } from "@/app/actions/auth";
import { signIn } from "next-auth/react";
import { Loader2, CheckCircle2, Volume2, VolumeX, Film } from "lucide-react";
import { PiGlobeDuotone, PiSmileyDuotone, PiTrophyDuotone } from "react-icons/pi";
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
  const [muted, setMuted] = useState(true);
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
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover transform-gpu"
        >
          <source src="/videos/auth-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Bottom-left branding on video */}
        <div className="absolute bottom-10 left-10 z-10">
          <p className="text-white/50 text-[11px] font-medium tracking-wide mb-1 flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-white/40" /> The home of Telugu cinema
          </p>
          <p className="text-white/25 text-[10px] font-medium">
            Icons · Memes · Tier Lists · Community
          </p>
        </div>
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
        <div className="lg:hidden w-full mb-8 -mx-6 -mt-10 relative h-[180px] overflow-hidden">
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
          <div className="absolute bottom-4 left-6 z-10">
            <p className="text-white/60 text-[10px] font-semibold tracking-wide flex items-center gap-1.5">
              <Film className="w-3 h-3 text-white/50" /> The home of Telugu cinema
            </p>
          </div>
        </div>

        <div className="w-full max-w-[380px] relative z-10">
          
          {/* Brand */}
          <div className="text-center mb-10">
            <h1 className="text-[28px] sm:text-[32px] font-extrabold text-white tracking-[-0.03em] mb-1.5">
              Welcome back ✨
            </h1>
            <p className="text-white/30 text-[13px] font-medium">
              Sign in to your TFIverse account
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
              <CheckCircle2 size={14} className="text-emerald-400/80 shrink-0" />
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
          <div className="my-7 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-[11px] text-white/20 uppercase tracking-[0.15em] font-medium">or</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-white/40 pl-1">Email</label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl text-white px-4 py-3 text-[14px] font-medium focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 focus:bg-white/[0.06] transition-all placeholder:text-white/15"
                placeholder="you@example.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[12px] font-semibold text-white/40 pl-1">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-white/30 hover:text-white/60 transition-colors font-medium"
                >
                  Forgot?
                </Link>
              </div>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl text-white px-4 py-3 text-[14px] font-medium focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 focus:bg-white/[0.06] transition-all placeholder:text-white/15"
                placeholder="••••••••"
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
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Sign up link */}
          <p className="mt-8 text-center text-[13px] text-white/25 font-medium">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-white/70 hover:text-white transition-colors font-semibold"
            >
              Sign up
            </Link>
          </p>

          {/* Feature Pills */}
          <div className="mt-10 pt-8 border-t border-white/[0.05]">
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <PiGlobeDuotone className="w-4 h-4 text-white/70" />, bg: "bg-white/[0.03]", border: "border-white/[0.08]", label: "Icons" },
                { icon: <PiSmileyDuotone className="w-4 h-4 text-white/70" />, bg: "bg-white/[0.03]", border: "border-white/[0.08]", label: "Memes" },
                { icon: <PiTrophyDuotone className="w-4 h-4 text-white/70" />, bg: "bg-white/[0.03]", border: "border-white/[0.08]", label: "Tier Lists" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-2 py-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors cursor-default"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.bg} ${item.border} border shadow-inner`}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] text-white/40 font-semibold tracking-wide">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
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
