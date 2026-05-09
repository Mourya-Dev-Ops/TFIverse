'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ConfirmVerificationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message);
          // Redirect to sign in after 3 seconds
          setTimeout(() => {
            router.push('/signin');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.error);
        }
      } catch (error) {
        setStatus('error');
        setMessage('Failed to verify email');
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-black" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl text-center">
          {status === 'loading' && (
            <>
              <div className="mx-auto w-16 h-16 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin mb-6" />
              <h1 className="text-2xl font-bold text-white mb-4">
                Verifying your email...
              </h1>
              <p className="text-white/60">Please wait a moment</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">
                Email Verified! 🎉
              </h1>
              <p className="text-white/80 mb-6">{message}</p>
              <p className="text-white/60 text-sm">
                Redirecting to sign in...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">
                Verification Failed
              </h1>
              <p className="text-white/80 mb-6">{message}</p>
              <Link
                href="/signup"
                className="inline-block bg-[#E50914] hover:bg-[#b8070f] text-white font-semibold py-3 px-6 rounded-lg transition-all"
              >
                Try Again
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
