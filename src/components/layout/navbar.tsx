'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Crown, Sparkles } from 'lucide-react';

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const displayName = user?.name || 'User';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LEFT: Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <h1 className="text-2xl font-black text-white tracking-tight">
                TFIverse
              </h1>
            </Link>
          </div>

          {/* RIGHT: Auth & Profile */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <motion.button
                  onClick={() => setShowDropdown(!showDropdown)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-200 group"
                >
                  {user.image ? (
                    <img src={user.image} alt={displayName} className="w-8 h-8 rounded-full object-cover border border-white/20" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm">
                      {initials}
                    </div>
                  )}
                  <span className="hidden md:block text-white/80 group-hover:text-white font-medium text-sm transition-colors">
                    Profile
                  </span>
                </motion.button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -12, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -12, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-56 bg-black border border-white/[0.06] rounded-lg shadow-2xl overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                        <p className="text-sm font-semibold text-white">{displayName}</p>
                        <p className="text-xs text-white/50 truncate">{user.email}</p>
                      </div>

                      <DropdownLink href="/profile" label="My Profile" icon={<User size={18} />} onClick={() => setShowDropdown(false)} />
                      <DropdownLink href="/tier-list/my-lists" label="My Tier Lists" icon={<Crown size={18} />} onClick={() => setShowDropdown(false)} />
                      <DropdownLink href="/memes" label="My Memes" icon={<Sparkles size={18} />} onClick={() => setShowDropdown(false)} />

                      <Link href="/api/auth/signout">
                        <motion.button
                          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                          className="w-full text-left px-4 py-3 text-sm text-white/70 hover:text-white border-t border-white/[0.06] transition-colors duration-200 flex items-center gap-3 font-medium"
                        >
                          <LogOut size={18} /> Sign Out
                        </motion.button>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login" className="text-white/70 hover:text-white font-medium text-sm transition-colors duration-200 px-3 py-2">
                  Sign In
                </Link>
                <Link href="/register" className="bg-white text-black hover:bg-white/90 text-sm font-bold px-5 py-2 rounded-lg transition-all duration-200">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
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
