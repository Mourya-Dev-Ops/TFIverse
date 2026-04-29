"use client"

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { registerUser } from "@/app/actions/auth";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess("Initiation successful. Check your email to verify your identity.");
    }
    
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden selection:bg-white selection:text-black">
      
      {/* Background Cinematic Video */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        >
          <source src="/videos/auth-bg.mp4" type="video/mp4" />
        </video>
        {/* Corner vignettes only — no full black overlay */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)" }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 w-full max-w-md px-8 py-12"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-block text-3xl font-bold tracking-tighter mb-2 hover:opacity-80 transition-opacity">
            TFIVERSE
          </Link>
          <p className="text-neutral-500 tracking-widest text-xs uppercase font-medium">Initiate Protocol</p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 p-4 bg-red-950/50 border border-red-900 text-red-200 text-sm text-center">
            {error}
          </motion.div>
        )}

        {success ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 p-6 bg-white/5 border border-white/10 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border border-white flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <p className="text-white text-sm font-medium tracking-wide leading-relaxed">{success}</p>
          </motion.div>
        ) : (
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-semibold text-neutral-500 tracking-[0.2em] uppercase">Display Name</label>
              <input 
                name="name"
                type="text" 
                className="w-full bg-transparent border-b border-neutral-800 text-white px-0 py-3 focus:outline-none focus:border-white transition-colors placeholder:text-neutral-700"
                placeholder="Agent Name"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-semibold text-neutral-500 tracking-[0.2em] uppercase">Email</label>
              <input 
                name="email"
                type="email" 
                className="w-full bg-transparent border-b border-neutral-800 text-white px-0 py-3 focus:outline-none focus:border-white transition-colors placeholder:text-neutral-700"
                placeholder="agent@tfiverse.com"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-semibold text-neutral-500 tracking-[0.2em] uppercase">Password</label>
              <input 
                name="password"
                type="password" 
                className="w-full bg-transparent border-b border-neutral-800 text-white px-0 py-3 focus:outline-none focus:border-white transition-colors placeholder:text-neutral-700 tracking-widest"
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-semibold text-neutral-500 tracking-[0.2em] uppercase">Confirm Password</label>
              <input 
                name="confirmPassword"
                type="password" 
                className="w-full bg-transparent border-b border-neutral-800 text-white px-0 py-3 focus:outline-none focus:border-white transition-colors placeholder:text-neutral-700 tracking-widest"
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="group relative w-full bg-white text-black font-bold py-4 mt-6 hover:bg-neutral-200 transition-all tracking-[0.2em] uppercase text-xs overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Processing..." : "Create Profile"}
              </span>
            </button>
          </form>
        )}

        <p className="mt-12 text-center text-xs text-neutral-500 tracking-wide">
          Already cleared? <Link href="/login" className="text-white hover:text-neutral-300 transition-colors underline underline-offset-4 decoration-neutral-700 hover:decoration-white">Authenticate</Link>
        </p>
      </motion.div>

    </main>
  );
}
