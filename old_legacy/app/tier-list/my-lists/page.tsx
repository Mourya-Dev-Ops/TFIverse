'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaEye, FaHeart, FaSearch, FaUser } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { getUserTierLists, deleteTierList } from '@/app/actions/tierlist';

type TierList = {
  id: string;
  title: string;
  createdAt: Date | null;
  tiers: any;
  likeCount?: number;
};

export default function MyTierListsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [tierLists, setTierLists] = useState<TierList[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin?callbackUrl=/tier-list/my-lists');
      return;
    }

    if (status === 'authenticated' && session?.user?.id) {
      fetchTierLists();
    }
  }, [status, session, router]);

  const fetchTierLists = async () => {
    setLoading(true);
    try {
      const lists = await getUserTierLists();
      setTierLists(lists as any);
    } catch (error) {
      console.error('Error fetching tier lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setDeleting(id);
    try {
      await deleteTierList(id);
      setTierLists(prev => prev.filter(list => list.id !== id));
      alert('✅ Tier list deleted!');
    } catch (error) {
      console.error('Error deleting tier list:', error);
      alert('❌ Failed to delete tier list');
    } finally {
      setDeleting(null);
    }
  };

  const filteredLists = searchQuery
    ? tierLists.filter(list => list.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : tierLists;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl font-bold animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <main className="bg-black min-h-screen pb-20">
      {/* Header */}
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
                    alt="Profile" 
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
            ) : null}
          </div>
        </div>
      </nav>

      <div className="pt-16"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">My Tier Lists</h1>
          <p className="text-white/60 text-lg">Manage and edit your tier lists</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30">
            <div className="text-blue-400 text-sm font-bold mb-2">Total Lists</div>
            <div className="text-white text-4xl font-black">{tierLists.length}</div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30">
            <div className="text-red-400 text-sm font-bold mb-2">Total Likes</div>
            <div className="text-white text-4xl font-black">
              {tierLists.reduce((sum, list) => sum + (list.likeCount || 0), 0)}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30">
            <div className="text-green-400 text-sm font-bold mb-2">Avg Likes/List</div>
            <div className="text-white text-4xl font-black">
              {tierLists.length > 0
                ? Math.round(tierLists.reduce((sum, list) => sum + (list.likeCount || 0), 0) / tierLists.length)
                : 0}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your tier lists..."
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-[#E50914]/50"
            />
          </div>
        </div>

        {/* Tier Lists Grid */}
        {filteredLists.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-4">🎬</div>
            <h2 className="text-3xl font-black text-white mb-4">
              {searchQuery ? 'No Results Found' : 'No Tier Lists Yet'}
            </h2>
            <p className="text-white/60 mb-8">
              {searchQuery
                ? 'Try a different search term'
                : 'Create your first tier list to rank your favorite Telugu movies!'}
            </p>
            {!searchQuery && (
              <Link
                href="/tier-list/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#E50914] hover:bg-[#F40612] text-white font-bold rounded-lg transition"
              >
                <FaPlus size={18} />
                Create Your First Tier List
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLists.map((list) => (
              <div
                key={list.id}
                className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-[#E50914]/50 transition-all duration-300 hover:scale-105"
              >
                {/* Title */}
                <h3 className="text-xl font-black text-white mb-3 line-clamp-2 group-hover:text-[#E50914] transition">
                  {list.title}
                </h3>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
                  <div className="flex items-center gap-1">
                    <FaHeart size={14} className="text-red-500" />
                    <span>{list.likeCount || 0}</span>
                  </div>
                  <div>
                    {list.createdAt ? new Date(list.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }) : ''}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/tier-list/${list.id}`}
                    className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition flex items-center justify-center gap-2"
                  >
                    <FaEye size={14} />
                    View
                  </Link>

                  <Link
                    href={`/tier-list/${list.id}/edit`}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition flex items-center justify-center gap-2"
                  >
                    <FaEdit size={14} />
                  </Link>

                  <button
                    onClick={() => handleDelete(list.id, list.title)}
                    disabled={deleting === list.id}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
