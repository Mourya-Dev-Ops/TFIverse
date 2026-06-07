'use client';

import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-black" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Glassmorphism card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl text-center">
          {/* Success icon */}
          <div className="mx-auto w-16 h-16 bg-[#E50914]/20 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-[#E50914]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">
            Check Your Email! 📧
          </h1>

          <p className="text-white/80 mb-2">
            We've sent a verification link to:
          </p>
          <p className="text-[#E50914] font-semibold mb-6">
            {email || 'your email'}
          </p>

          <p className="text-white/60 text-sm mb-8">
            Click the link in the email to verify your account and start your movie journey!
          </p>

          <div className="space-y-3">
            <Link
              href="/signin"
              className="block w-full bg-[#E50914] hover:bg-[#b8070f] text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-[1.02]"
            >
              Back to Sign In
            </Link>

            <p className="text-white/40 text-xs">
              Didn't receive the email? Check your spam folder.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
