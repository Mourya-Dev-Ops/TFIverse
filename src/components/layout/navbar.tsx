'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut } from 'lucide-react';
import { PiGlobeDuotone, PiSmileyDuotone, PiTrophyDuotone, PiUserDuotone } from 'react-icons/pi';
import { signOut } from 'next-auth/react';

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const displayName = user?.name || 'User';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <>
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-black/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* LEFT: Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tighter">
                TFIverse
              </h1>
            </Link>
          </div>

          {/* CENTER: Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {[
              { href: '/icons', label: 'Icons', icon: <PiGlobeDuotone className="w-3.5 h-3.5 text-white/70" /> },
              { href: '/memes', label: 'Memes', icon: <PiSmileyDuotone className="w-3.5 h-3.5 text-white/70" /> },
              { href: '/tier-list', label: 'Tier Lists', icon: <PiTrophyDuotone className="w-3.5 h-3.5 text-white/70" /> },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white/50 hover:text-white hover:bg-white/[0.05] rounded-full transition-all duration-200"
              >
                {link.icon} {link.label}
              </Link>
            ))}
          </div>

          {/* RIGHT: Auth & Profile */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  onClick={() => setShowDropdown(!showDropdown)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-2 px-2 sm:px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] transition-all duration-200 group"
                >
                  {user.image ? (
                    <img src={user.image} alt={displayName} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-white/20" />
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs sm:text-sm">
                      {initials}
                    </div>
                  )}
                  <span className="hidden sm:block text-white/80 group-hover:text-white font-medium text-xs sm:text-sm transition-colors">
                    Account
                  </span>
                </motion.button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-black border border-white/[0.1] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-2xl"
                    >
                      <div className="px-5 py-4 border-b border-white/[0.06] bg-white/[0.02]">
                        <p className="text-sm font-bold text-white mb-0.5">{displayName}</p>
                        <p className="text-[10px] text-white/40 truncate uppercase tracking-widest">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <DropdownLink href="/profile" label="My Profile" icon={<PiUserDuotone size={16} className="text-white/60" />} onClick={() => setShowDropdown(false)} />
                        <DropdownLink href="/tier-list/my-lists" label="My Tier Lists" icon={<PiTrophyDuotone size={16} className="text-white/60" />} onClick={() => setShowDropdown(false)} />
                        <DropdownLink href="/memes" label="My Memes" icon={<PiSmileyDuotone size={16} className="text-white/60" />} onClick={() => setShowDropdown(false)} />
                      </div>

                      <div className="p-2 border-t border-white/[0.06]">
                        <button 
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className="w-full text-left px-3 py-2 text-xs text-white/50 hover:text-white hover:bg-white/[0.05] rounded-xl transition-all flex items-center gap-3 font-bold uppercase tracking-widest"
                        >
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-4">
                <Link href="/login" className="text-white/60 hover:text-white font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-all px-2 sm:px-4 py-2">
                  Sign In
                </Link>
                <Link href="/register" className="bg-white text-black hover:bg-white/90 text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] px-3 sm:px-6 py-2 sm:py-2.5 rounded-full transition-all shadow-xl hover:scale-105 active:scale-95">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
    </>
  );
}

function DropdownLink({ href, label, icon, onClick }: { href: string; label: string; icon: React.ReactNode; onClick?: () => void }) {
  return (
    <motion.div whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }} transition={{ duration: 0.15 }}>
      <Link href={href} onClick={onClick} className="block px-4 py-3 text-sm text-white/70 hover:text-white transition-colors duration-200 border-b border-white/[0.04] last:border-b-0 flex items-center gap-3 group font-medium">
        <span className="text-white/50 group-hover:text-white transition-colors">{icon}</span>
        {label}
      </Link>
    </motion.div>
  );
}
