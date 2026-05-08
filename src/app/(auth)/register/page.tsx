"use client"

import Link from "next/link";
import { useState, useRef } from "react";
import { registerUser } from "@/app/actions/auth";
import { signIn } from "next-auth/react";
import { Loader2, Volume2, VolumeX, Film, MailCheck } from "lucide-react";
import { PiGlobeDuotone, PiSmileyDuotone, PiTrophyDuotone } from "react-icons/pi";
import { FcGoogle } from "react-icons/fc";

export default function RegisterPage() {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
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
      <div className="w-full lg:w-[45%] flex flex-col items-center justify-center px-6 py-10 relative overflow-y-auto">
        
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
          <div className="absolute bottom-4 left-6 z-10">
            <p className="text-white/60 text-[10px] font-semibold tracking-wide flex items-center gap-1.5">
              <Film className="w-3 h-3 text-white/50" /> The home of Telugu cinema
            </p>
          </div>
        </div>

        <div className="w-full max-w-[380px] relative z-10">
          
          {/* Brand */}
          <div className="text-center mb-8">
            <h1 className="text-[28px] sm:text-[32px] font-extrabold text-white tracking-[-0.03em] mb-1.5">
              Join TFIverse 🚀
            </h1>
            <p className="text-white/30 text-[13px] font-medium">
              Create your free account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-500/8 border border-red-500/15 text-center">
              <p className="text-red-300/90 text-[13px] font-medium">{error}</p>
            </div>
          )}

          {/* Success */}
          {success ? (
            <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 bg-white/[0.03] border border-white/[0.08] shadow-inner">
                <MailCheck className="w-8 h-8 text-white/60" />
              </div>
              <h3 className="text-white text-lg font-bold tracking-tight mb-2">Check your email ✨</h3>
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
              <div className="my-6 flex items-center gap-4">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-[11px] text-white/20 uppercase tracking-[0.15em] font-medium">or</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>

              {/* Form */}
              <form method="POST" className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[12px] font-semibold text-white/40 pl-1">Display Name</label>
                    <span className="text-[10px] text-white/15 font-medium pr-1">Max 25</span>
                  </div>
                  <input
                    name="name"
                    type="text"
                    maxLength={25}
                    autoComplete="name"
                    required
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl text-white px-4 py-3 text-[14px] font-medium focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 focus:bg-white/[0.06] transition-all placeholder:text-white/15"
                    placeholder="Your name"
                  />
                </div>

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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-white/40 pl-1">Password</label>
                    <input
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl text-white px-4 py-3 text-[14px] font-medium focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 focus:bg-white/[0.06] transition-all placeholder:text-white/15"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-white/40 pl-1">Confirm</label>
                    <input
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl text-white px-4 py-3 text-[14px] font-medium focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 focus:bg-white/[0.06] transition-all placeholder:text-white/15"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black font-semibold py-3 mt-1 rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all text-[14px] disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Sign in link */}
          <p className="mt-8 text-center text-[13px] text-white/25 font-medium">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-white/70 hover:text-white transition-colors font-semibold"
            >
              Sign in
            </Link>
          </p>

          {/* Feature highlights */}
          <div className="mt-8 pt-6 border-t border-white/[0.05]">
            <div className="flex flex-col gap-3">
              {[
                { icon: <PiGlobeDuotone className="w-4 h-4 text-white/70" />, bg: "bg-white/[0.03]", border: "border-white/[0.08]", text: "Browse 500+ Telugu cinema icons" },
                { icon: <PiTrophyDuotone className="w-4 h-4 text-white/70" />, bg: "bg-white/[0.03]", border: "border-white/[0.08]", text: "Create & share tier lists" },
                { icon: <PiSmileyDuotone className="w-4 h-4 text-white/70" />, bg: "bg-white/[0.03]", border: "border-white/[0.08]", text: "Upload & discover TFI memes" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-4 text-white/40 text-[12px] font-medium p-2 rounded-lg hover:bg-white/[0.02] transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.bg} ${item.border} border shadow-inner`}>
                    {item.icon}
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
