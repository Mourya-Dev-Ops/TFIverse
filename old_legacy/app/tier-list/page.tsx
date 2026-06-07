'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaFire, FaClock, FaPlus, FaUser, FaArrowLeft, FaHeart } from 'react-icons/fa';
import { getTierLists } from '@/app/actions/tierlist';
import { useSession } from 'next-auth/react';

type TierList = {
  id: string;
  title: string;
  userId: string;
  createdAt: Date | null;
  username: string | null;
  avatar: string | null;
  likeCount: number;
};

export default function TierListHubPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [tierLists, setTierLists] = useState<TierList[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'trending' | 'recent'>('all');

  useEffect(() => {
    fetchTierLists();
  }, [filter]);

  const fetchTierLists = async () => {
    setLoading(true);
    try {
      const lists = await getTierLists();
      
      // Sort based on filter
      let sorted = [...lists];
      if (filter === 'recent') {
        sorted.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
      } else if (filter === 'trending') {
        sorted.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
      }

      setTierLists(sorted as any);
    } catch (err: any) {
      console.error('❌ Error:', err);
      setTierLists([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-black min-h-screen pb-20">
      {/* NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          {/* LEFT SIDE: Logo + Back */}
          <div className="flex items-center gap-3">
            <Link href="/" className="text-2xl font-black text-white hover:opacity-80 transition">
              TFI<span className="text-[#E50914]">verse</span>
            </Link>
            <button 
              onClick={() => router.back()} 
              className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm transition flex items-center gap-2"
            >
              <FaArrowLeft size={14} />
              <span className="hidden md:inline">Back</span>
            </button>
          </div>

          {/* RIGHT SIDE: Hub + Home + Profile */}
          <div className="flex items-center gap-3">
            <Link href="/tier-list" className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm transition flex items-center gap-2">
              🏆 <span className="hidden md:inline">Hub</span>
            </Link>
            <Link href="/" className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm transition flex items-center gap-2">
              🏠 <span className="hidden md:inline">Home</span>
            </Link>
            {session?.user ? (
              <Link href="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition">
                {session.user.image ? (
                  <img 
                    src={session.user.image} 
                    alt={session.user.name || 'Avatar'} 
                    className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E50914] to-[#831010] flex items-center justify-center">
                    <FaUser size={12} className="text-white" />
                  </div>
                )}
                <span className="text-white text-sm font-medium hidden md:inline">
                  {session.user.name || 'Profile'}
                </span>
              </Link>
            ) : (
              <Link href="/signin?callbackUrl=/tier-list" className="px-6 py-2 rounded-lg bg-[#E50914] text-white font-bold text-sm hover:bg-[#F40612] transition">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="pt-16"></div>

      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-2">Tier List Hub</h1>
            <p className="text-white/60 text-lg">Create and share your movie rankings</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/tier-list/my-lists" className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold transition">
              My Lists
            </Link>
            <Link href="/tier-list/create" className="px-6 py-3 rounded-xl bg-[#E50914] hover:bg-[#F40612] text-white font-bold transition flex items-center gap-2">
              <FaPlus size={16} />
              Create Tier List
            </Link>
          </div>
        </div>

        {/* FILTER TABS */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          <button onClick={() => setFilter('all')} className={`px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap ${filter === 'all' ? 'bg-[#E50914] text-white' : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'}`}>
            <FaFire size={16} />
            Trending
          </button>
          <button onClick={() => setFilter('recent')} className={`px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap ${filter === 'recent' ? 'bg-[#E50914] text-white' : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'}`}>
            <FaClock size={16} />
            Recent
          </button>
          <button onClick={() => setFilter('trending')} className={`px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap ${filter === 'trending' ? 'bg-[#E50914] text-white' : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'}`}>
            <FaHeart size={16} />
            Popular
          </button>
        </div>

        {/* TIER LISTS GRID */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#E50914] mb-4"></div>
            <p className="text-white/60 text-lg">Loading tier lists...</p>
          </div>
        ) : tierLists.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-4">🎬</div>
            <h2 className="text-3xl font-black text-white mb-4">No tier lists yet</h2>
            <p className="text-white/60 mb-8">Be the first to create one!</p>
            <Link href="/tier-list/create" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#E50914] hover:bg-[#F40612] text-white font-bold text-lg transition">
              <FaPlus size={20} />
              Create Tier List
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tierLists.map((list) => (
              <Link key={list.id} href={`/tier-list/${list.id}`} className="group">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-[#E50914] transition-all hover:scale-105">
                  <h3 className="text-2xl font-black text-white mb-3 group-hover:text-[#E50914] transition line-clamp-2">{list.title}</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      {list.avatar ? (
                        <img 
                          src={list.avatar} 
                          alt={list.username || 'User'} 
                          className="w-8 h-8 rounded-full border-2 border-white/20 object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full border-2 border-white/20 bg-gradient-to-br from-[#E50914] to-[#831010] flex items-center justify-center flex-shrink-0">
                          <FaUser size={14} className="text-white" />
                        </div>
                      )}
                      <span className="text-white/80 font-medium text-sm">{list.username || 'Anonymous'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-white/60 text-sm">
                    <div className="flex items-center gap-1">
                      <FaHeart size={14} />
                      <span>{list.likeCount || 0}</span>
                    </div>
                    <div className="ml-auto text-xs">
                      {list.createdAt ? new Date(list.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
