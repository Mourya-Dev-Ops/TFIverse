'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.error);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-black" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-center mb-2">
            <span className="text-[#E50914]">TFi</span>
            <span className="text-white">verse</span>
          </h1>
          <p className="text-white/60 text-center mb-8">Reset your password 🔐</p>

          {status === 'success' ? (
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/80 mb-6">{message}</p>
              <Link
                href="/signin"
                className="inline-block bg-[#E50914] hover:bg-[#b8070f] text-white font-semibold py-3 px-6 rounded-lg transition-all"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6"
                >
                  {message}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-white/80 text-sm mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] transition-all"
                    placeholder="you@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-[#E50914] hover:bg-[#b8070f] text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <p className="text-center text-white/60 mt-6 text-sm">
                Remember your password?{' '}
                <Link href="/signin" className="text-[#E50914] hover:underline font-semibold">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
