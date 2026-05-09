'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';

interface NavbarProps {
  user?: any;
  showBackButton?: boolean;
  backButtonHref?: string;
  backButtonLabel?: string;
  pageTitle?: string;
}

export default function Navbar({ 
  user, 
  showBackButton = false,
  backButtonHref = '/',
  backButtonLabel = 'Back',
  pageTitle 
}: NavbarProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch user profile with avatar
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/profile/me', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
          const data = await res.json();
          setUserProfile(data);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [session?.user?.id]);

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    router.push('/signin');
    router.refresh();
  };

  // ✅ Use avatar from profile or session
  const avatarUrl = userProfile?.avatarUrl || session?.user?.image;
  const displayName = userProfile?.username || session?.user?.name || 'User';
  const initials = displayName?.charAt(0).toUpperCase() || 'U';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LEFT SIDE: Logo or Back Button */}
          <div className="flex items-center space-x-4">
            {showBackButton ? (
              <motion.div
                whileHover={{ x: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Link 
                  href={backButtonHref}
                  className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="font-semibold text-sm">{backButtonLabel}</span>
                </Link>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Link href="/" className="flex items-center space-x-2 group">
                  <div className="relative">
                    <h1 className="text-2xl font-black">
                      <span className="text-white">🎬 TFi</span>
                      <span className="text-white/80">verse</span>
                    </h1>
                    <motion.div
                      className="absolute -bottom-1 left-0 h-0.5 bg-white/60 rounded-full"
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </Link>
              </motion.div>
            )}
            
            {/* Page Title */}
            {pageTitle && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden md:flex items-center space-x-3 pl-4 border-l border-white/[0.1]"
              >
                <h2 className="text-lg font-bold text-white/80">
                  {pageTitle}
                </h2>
              </motion.div>
            )}
          </div>

          {/* CENTER: Navigation Links */}
          {!showBackButton && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="hidden md:flex items-center space-x-1"
            >
              <NavLink href="/" label="🏠 Home" />
              <NavLink href="/tier-list" label="🏆 Hub" />
              <NavLink href="/heroes" label="👥 Heroes" />
              <NavLink href="/memes" label="😂 Memes" />
            </motion.div>
          )}

          {/* RIGHT SIDE: User Profile & Auth */}
          <div className="flex items-center space-x-4">
            {session?.user ? (
              <div className="relative">
                {/* User Dropdown Button */}
                <motion.button
                  onClick={() => setShowDropdown(!showDropdown)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-200 group"
                >
                  {/* ✅ AVATAR - SHOWING NOW */}
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-8 h-8 rounded-full object-cover border border-white/20"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`;
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white to-white/50 text-black flex items-center justify-center font-bold text-sm shadow-lg group-hover:shadow-xl transition-shadow">
                      {initials}
                    </div>
                  )}

                  <span className="hidden md:block text-white/80 group-hover:text-white font-medium text-sm transition-colors">
                    {displayName}
                  </span>

                  <motion.svg
                    className="w-4 h-4 text-white/60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: showDropdown ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -12, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -12, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-56 bg-black/95 backdrop-blur-xl border border-white/[0.06] rounded-lg shadow-2xl overflow-hidden"
                    >
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                        <p className="text-sm font-semibold text-white">👤 {displayName}</p>
                        <p className="text-xs text-white/50 truncate">✉️ {session.user?.email}</p>
                      </div>

                      {/* Dropdown Links */}
                      <DropdownLink
                        href="/profile"
                        label="My Profile"
                        icon="🎬"
                        onClick={() => setShowDropdown(false)}
                      />
                      <DropdownLink
                        href="/tier-list/my-lists"
                        label="My Tier Lists"
                        icon="📋"
                        onClick={() => setShowDropdown(false)}
                      />
                      <DropdownLink
                        href="/memes"
                        label="My Memes"
                        icon="😂"
                        onClick={() => setShowDropdown(false)}
                      />

                      {/* Sign Out Button */}
                      <motion.button
                        onClick={handleSignOut}
                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                        className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:text-white border-t border-white/[0.06] transition-colors duration-200 flex items-center gap-2 font-medium"
                      >
                        <span>🚪</span>
                        Sign Out
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center space-x-3"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    href="/signin" 
                    className="text-white/70 hover:text-white font-medium text-sm transition-colors duration-200 px-3 py-2"
                  >
                    Sign In
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/signup"
                    className="bg-white text-black hover:bg-white/90 text-sm font-bold px-5 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// Navigation Link Component
function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={href}
        className="relative px-4 py-2 text-white/70 hover:text-white font-medium text-sm transition-colors duration-200 group"
      >
        <span className="relative z-10">{label}</span>
        
        {/* Underline Animation */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-white/40 rounded-full"
          initial={{ width: 0 }}
          whileHover={{ width: '100%' }}
          transition={{ duration: 0.3 }}
        />
      </Link>
    </motion.div>
  );
}

// Dropdown Link Component
function DropdownLink({ 
  href, 
  label, 
  icon,
  onClick 
}: { 
  href: string; 
  label: string;
  icon?: string;
  onClick?: () => void;
}) {
  return (
    <motion.div
      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
      transition={{ duration: 0.15 }}
    >
      <Link
        href={href}
        onClick={onClick}
        className="block px-4 py-2.5 text-sm text-white/70 hover:text-white transition-colors duration-200 border-b border-white/[0.04] last:border-b-0 flex items-center gap-2 group font-medium"
      >
        <span className="text-lg group-hover:scale-110 transition-transform">{icon}</span>
        {label}
      </Link>
    </motion.div>
  );
}
