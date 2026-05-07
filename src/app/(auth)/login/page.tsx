"use client"

import Link from "next/link";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { loginUser } from "@/app/actions/auth";
import { signIn } from "next-auth/react";
import { Loader2, Volume2, VolumeX, CheckCircle2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

function LoginForm() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
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
      if (!videoRef.current.muted) videoRef.current.play().catch(console.error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    
    const result = await loginUser(formData);
    
    if (result?.error) { 
      setError(result.error); 
      setLoading(false); 
    }
    // If no error, the server action will handle the redirect.
    // If it throws a redirect, Next.js will handle it.
  };

  const handleOAuth = (provider: string) => {
    setOauthLoading(provider);
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#050505]">
      
      {/* CINEMATIC VIDEO BACKGROUND (Desktop Only) */}
      <div className="absolute inset-0 z-0 hidden md:block">
        <video ref={videoRef} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover scale-105 opacity-40">
          <source src="/videos/auth-bg.mp4" type="video/mp4" />
        </video>
        {/* Advanced Gradient Overlay */}
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

      {/* LOGIN CONTAINER */}
      <div className="relative z-20 w-full max-w-[440px] mx-auto px-6">
        <div className="p-10 rounded-[2.5rem] bg-white/[0.03] backdrop-blur-[24px] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          
          {/* Subtle Glow Effect */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/5 rounded-full blur-[80px] group-hover:bg-white/10 transition-all duration-700" />
          
          <div className="text-center mb-12 relative z-10">
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2">TFIVERSE</h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-4 bg-white/20" />
              <p className="text-white/30 tracking-[0.4em] text-[8px] uppercase font-bold">Secure Access</p>
              <div className="h-[1px] w-4 bg-white/20" />
            </div>
          </div>

          {error && (
            <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200 text-[11px] text-center font-medium tracking-wide animate-in fade-in slide-in-from-top-2 duration-300">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-8 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-[11px] text-center font-medium flex items-center justify-center gap-2 tracking-wide animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircle2 size={14} />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} method="POST" className="flex flex-col gap-6 relative z-10">
            <div className="flex flex-col gap-2.5">
              <label className="text-[10px] font-black text-white/40 tracking-[0.2em] uppercase px-1">Email Address</label>
              <div className="relative">
                <input name="email" type="email" autoComplete="email" required
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl text-white px-6 py-4 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all placeholder:text-white/10 text-sm font-medium" 
                  placeholder="name@example.com" />
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-white/40 tracking-[0.2em] uppercase">Password</label>
                <Link href="/forgot-password" 
                  className="text-[9px] text-white/30 hover:text-white transition-colors tracking-widest uppercase font-bold">
                  Forgot?
                </Link>
              </div>
              <input name="password" type="password" autoComplete="current-password" required
                className="w-full bg-white/[0.04] border border-white/10 rounded-2xl text-white px-6 py-4 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all placeholder:text-white/10 tracking-[0.3em] text-sm font-medium" 
                placeholder="••••••••" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-white text-black font-black py-4 mt-4 rounded-2xl hover:bg-white/90 active:scale-[0.97] transition-all tracking-[0.25em] uppercase text-[10px] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_20px_rgba(255,255,255,0.1)] group overflow-hidden relative">
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {loading ? "Authenticating..." : "Sign In"}
              </span>
            </button>
          </form>

          {/* Minimalist Divider */}
          <div className="mt-10 mb-8 flex items-center justify-center gap-6 opacity-20">
            <div className="h-[0.5px] bg-white flex-1" />
            <span className="text-[8px] text-white uppercase tracking-[0.4em] font-black">Secure Auth</span>
            <div className="h-[0.5px] bg-white flex-1" />
          </div>

          {/* Glassy OAuth Buttons */}
            <button 
              type="button"
              onClick={() => handleOAuth("google")}
              disabled={!!oauthLoading}
              className="w-full py-4 bg-white/[0.04] border border-white/10 rounded-2xl hover:border-white/20 hover:bg-white/[0.08] transition-all text-[10px] font-black text-white/50 hover:text-white active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 tracking-widest uppercase"
            >
              {oauthLoading === "google" ? <Loader2 className="w-3 h-3 animate-spin" /> : <FcGoogle size={18} />}
              Continue with Google
            </button>

          <p className="mt-12 text-center text-[10px] text-white/20 tracking-widest uppercase font-bold">
            New to TFIverse?{" "}
            <Link href="/register" className="text-white/60 hover:text-white transition-colors underline underline-offset-8 decoration-white/10 hover:decoration-white/40">
              Create Account
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
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-white" />
        <p className="text-white/40 text-xs tracking-widest uppercase font-bold">Loading...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
