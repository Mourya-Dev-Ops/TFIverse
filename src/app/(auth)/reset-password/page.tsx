"use client"

import Link from "next/link";
import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { resetPassword } from "@/app/actions/auth";
import { Loader2, Volume2, VolumeX } from "lucide-react";

function ResetPasswordForm() {
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
    const result = await resetPassword(formData);
    if (result?.error) { setError(result.error); } else { setSuccess(true); }
    setLoading(false);
  };

  return (
    <main className="min-h-[100dvh] bg-black text-white flex flex-col items-center justify-center relative overflow-x-hidden overflow-y-auto selection:bg-white selection:text-black py-16 px-4">
      
      {/* Background Video — DESKTOP ONLY */}
      <div className="absolute inset-0 z-0 pointer-events-none hidden md:block">
        <video ref={videoRef} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/videos/auth-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.65)' }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.8) 100%)" }} />
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none md:hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)' }} />
      </div>

      <motion.button onClick={toggleMute} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-[60] p-4 rounded-full border border-white/20 text-white shadow-2xl transition-all hidden md:flex items-center justify-center"
        style={{ pointerEvents: "auto", backgroundColor: 'rgba(0,0,0,0.7)' }}>
        {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </motion.button>

      {/* Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-20 w-full max-w-md px-6 sm:px-8 py-10 sm:py-12 rounded-3xl border border-white/[0.08]"
        style={{ backgroundColor: 'rgba(10,10,10,0.95)', boxShadow: '0 20px 80px rgba(0,0,0,0.9)' }}
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-block text-3xl font-bold tracking-tighter mb-2 hover:opacity-80 transition-opacity">TFIVERSE</Link>
          <p className="text-white/50 tracking-widest text-xs uppercase font-medium">Set New Password</p>
        </div>

        {!token ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="w-16 h-16 rounded-full border border-red-500/30 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Invalid Reset Link</h3>
            <p className="text-white/50 text-sm mb-6">This password reset link is invalid or has been used.</p>
            <Link href="/forgot-password" className="inline-block px-6 py-3 bg-white/90 text-black font-bold rounded-xl text-xs tracking-widest uppercase shadow-lg hover:bg-white transition-all">Request New Link</Link>
          </motion.div>
        ) : success ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Password Updated</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-6">Your password has been successfully reset.</p>
            <Link href="/login" className="inline-block px-6 py-3 bg-white/90 text-black font-bold rounded-xl text-xs tracking-widest uppercase shadow-lg hover:bg-white transition-all">Sign In Now</Link>
          </motion.div>
        ) : (
          <>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center font-light">{error}</motion.div>
            )}
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-semibold text-white/40 tracking-[0.2em] uppercase">New Password</label>
                <input name="password" type="password" className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl text-white px-4 py-3 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all placeholder:text-white/20 tracking-widest" placeholder="••••••••" required minLength={8} autoFocus />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-semibold text-white/40 tracking-[0.2em] uppercase">Confirm New Password</label>
                <input name="confirmPassword" type="password" className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl text-white px-4 py-3 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all placeholder:text-white/20 tracking-widest" placeholder="••••••••" required minLength={8} />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-white/90 text-black font-bold py-4 mt-2 rounded-xl hover:bg-white transition-all tracking-[0.2em] uppercase text-xs disabled:opacity-70 disabled:cursor-not-allowed shadow-lg">
                <span className="flex items-center justify-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "Resetting..." : "Reset Password"}
                </span>
              </button>
            </form>
          </>
        )}

        <p className="mt-10 text-center text-xs text-white/30 tracking-wide">
          <Link href="/login" className="text-white/70 hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/60">Back to Login</Link>
        </p>
      </motion.div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-white animate-spin" /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
