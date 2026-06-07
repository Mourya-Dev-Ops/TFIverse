'use client';

import Link from 'next/link';
import { FaTrophy, FaArrowRight } from 'react-icons/fa';

export default function TierListPreview() {
  return (
    <section className="rounded-2xl bg-gradient-to-br from-[#E50914]/10 to-transparent border border-[#E50914]/20 p-8 md:p-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2 flex items-center gap-3">
            <FaTrophy className="text-[#E50914]" size={32} />
            Tier Lists
          </h2>
          <p className="text-white/60 text-lg">
            Rank your favorite Telugu movies and see what others think!
          </p>
        </div>
        <Link
          href="/tier-list"
          className="px-6 py-3 rounded-lg bg-[#E50914] hover:bg-[#F40612] text-white font-bold transition flex items-center gap-2"
        >
          View All
          <FaArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#E50914]/50 transition">
          <div className="text-2xl font-black text-white mb-2">🏆 Create</div>
          <p className="text-white/60 text-sm mb-4">
            Build your own tier list
          </p>
          <Link
            href="/tier-list/create"
            className="text-[#E50914] font-bold text-sm hover:underline"
          >
            Get Started →
          </Link>
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#E50914]/50 transition">
          <div className="text-2xl font-black text-white mb-2">🔥 Trending</div>
          <p className="text-white/60 text-sm mb-4">
            Most liked tier lists
          </p>
          <Link
            href="/tier-list?sort=trending"
            className="text-[#E50914] font-bold text-sm hover:underline"
          >
            Explore →
          </Link>
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#E50914]/50 transition">
          <div className="text-2xl font-black text-white mb-2">⚡ Latest</div>
          <p className="text-white/60 text-sm mb-4">
            Recently created lists
          </p>
          <Link
            href="/tier-list?sort=latest"
            className="text-[#E50914] font-bold text-sm hover:underline"
          >
            Browse →
          </Link>
        </div>
      </div>
    </section>
  );
}
