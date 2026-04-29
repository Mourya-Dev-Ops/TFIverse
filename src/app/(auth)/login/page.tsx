"use client"

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { loginUser } from "@/app/actions/auth";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await loginUser(formData);
      
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden selection:bg-white selection:text-black">
      
      {/* Background Cinematic Texture */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] blur-[100px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-20 w-full max-w-md px-8 py-12 backdrop-blur-sm bg-black/40 border border-white/5"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-block text-3xl font-bold tracking-tighter mb-2 hover:opacity-80 transition-opacity">
            TFIVERSE
          </Link>
          <p className="text-neutral-500 tracking-widest text-xs uppercase font-medium">Secure Access</p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-950/30 border border-red-900/50 text-red-200 text-sm text-center font-light">
            {error}
          </motion.div>
        )}

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
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
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-semibold text-neutral-500 tracking-[0.2em] uppercase">Password</label>
              <Link href="#" className="text-[10px] text-neutral-500 hover:text-white transition-colors tracking-widest uppercase">Forgot?</Link>
            </div>
            <input 
              name="password"
              type="password" 
              className="w-full bg-transparent border-b border-neutral-800 text-white px-0 py-3 focus:outline-none focus:border-white transition-colors placeholder:text-neutral-700 tracking-widest"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="group relative w-full bg-white text-black font-bold py-4 mt-6 hover:bg-neutral-200 transition-all tracking-[0.2em] uppercase text-xs overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Authenticating..." : "Login"}
            </span>
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="h-px bg-neutral-800 flex-1"></div>
          <span className="text-[10px] text-neutral-600 uppercase tracking-widest">Or Access Via</span>
          <div className="h-px bg-neutral-800 flex-1"></div>
        </div>

        <div className="mt-8 flex gap-4">
          <button className="flex-1 py-3 border border-neutral-800 hover:border-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-xs tracking-widest font-medium uppercase text-neutral-400 hover:text-white">
            Google
          </button>
          <button className="flex-1 py-3 border border-neutral-800 hover:border-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-xs tracking-widest font-medium uppercase text-neutral-400 hover:text-white">
            Github
          </button>
        </div>

        <p className="mt-12 text-center text-xs text-neutral-500 tracking-wide">
          Awaiting clearance? <Link href="/register" className="text-white hover:text-neutral-300 transition-colors underline underline-offset-4 decoration-neutral-700 hover:decoration-white">Request Access</Link>
        </p>
      </motion.div>

    </main>
  );
}
