'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { getTierLists } from '@/app/actions/tierlist';
import { Search, Plus, TrendingUp, Clock, Heart, User, ArrowLeft } from 'lucide-react';

type TierList = {
  id: string;
  title: string;
  description: string | null;
  userId: string;
  tiers: any;
  createdAt: Date | null;
  username: string | null;
  avatar: string | null;
  likeCount: number;
};

export default function TierListHubPage() {
  const { data: session } = useSession();
  const [tierListsData, setTierListsData] = useState<TierList[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'trending' | 'recent'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const lists = await getTierLists();
        setTierListsData(lists as TierList[]);
      } catch (err) {
        console.error('Error loading tier lists:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = tierListsData
    .filter(l => !searchQuery || l.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (filter === 'trending') return (b.likeCount || 0) - (a.likeCount || 0);
      if (filter === 'recent') {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db2 = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return db2 - da;
      }
      return (b.likeCount || 0) - (a.likeCount || 0); // default: trending
    });

  const totalMoviesRanked = tierListsData.reduce((sum, list) => {
    const tiers = list.tiers as Record<string, string[]>;
    return sum + Object.values(tiers || {}).flat().length;
  }, 0);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 pt-28 pb-20 relative z-10">

        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm font-medium mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-2">Tier List Hub</h1>
            <p className="text-white/40 text-lg">Rank, share, debate.</p>
          </div>
          <div className="flex gap-3">
            {session?.user && (
              <Link href="/tier-list/my-lists" className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold text-sm transition-all hover:border-white/20">
                My Lists
              </Link>
            )}
            <Link
              href="/tier-list/create"
              className="flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-white/90 rounded-xl font-bold text-sm transition-all shadow-[0_0_30px_rgba(255,255,255,0.08)] hover:shadow-[0_0_50px_rgba(255,255,255,0.15)]"
            >
              <Plus size={18} />
              Create New
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
            <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-1">Total Lists</p>
            <p className="text-3xl font-black">{tierListsData.length}</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
            <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-1">Movies Ranked</p>
            <p className="text-3xl font-black">{totalMoviesRanked}</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
            <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-1">Total Likes</p>
            <p className="text-3xl font-black">{tierListsData.reduce((s, l) => s + l.likeCount, 0)}</p>
          </div>
        </div>

        {/* Filters + Search */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'Trending', icon: TrendingUp },
              { key: 'recent', label: 'Recent', icon: Clock },
              { key: 'trending', label: 'Popular', icon: Heart },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                  filter === key
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lists..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/30 outline-none focus:border-white/30 transition-all"
            />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-7xl mb-6 grayscale opacity-40">🏆</div>
            <h2 className="text-2xl font-bold mb-2 text-white/60">
              {searchQuery ? 'No Results' : 'No tier lists yet'}
            </h2>
            <p className="text-white/30 mb-8">
              {searchQuery ? 'Try a different search' : 'Be the first to rank your favorite movies!'}
            </p>
            {!searchQuery && (
              <Link href="/tier-list/create" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl font-bold">
                <Plus size={20} /> Create Tier List
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((list) => {
              const tiers = list.tiers as Record<string, string[]>;
              const movieCount = Object.values(tiers || {}).flat().length;
              const tierCount = Object.keys(tiers || {}).filter(k => (tiers[k]?.length || 0) > 0).length;

              return (
                <div key={list.id} className="group relative">
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300 h-full flex flex-col">
                    <Link href={`/tier-list/${list.id}`} className="absolute inset-0 z-10" aria-label={`View ${list.title}`} />
                    
                    <h3 className="text-lg font-bold text-white/90 mb-3 line-clamp-2 group-hover:text-white transition-colors relative z-0">
                      {list.title}
                    </h3>

                    {list.description && (
                      <p className="text-white/30 text-sm mb-4 line-clamp-2 relative z-0">{list.description}</p>
                    )}

                    {/* Tier Preview Dots */}
                    <div className="flex gap-1 mb-4 relative z-0">
                      {Object.keys(tiers || {}).slice(0, 6).map(tier => (
                        <div key={tier} className="flex items-center gap-0.5">
                          <span className="text-[10px] font-black text-white/30">{tier}</span>
                          <span className="text-[10px] text-white/20">({tiers[tier]?.length || 0})</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto flex items-center justify-between relative z-20">
                      <Link href={list.username ? `/u/${list.username}` : '#'} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        {list.avatar ? (
                          <img src={list.avatar} alt="" className="w-6 h-6 rounded-full object-cover border border-white/10" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                            <User size={12} className="text-white/40" />
                          </div>
                        )}
                        <span className="text-white/40 text-xs font-medium hover:text-white/70 transition-colors">{list.username || 'Anonymous'}</span>
                      </Link>

                      <div className="flex items-center gap-3 text-white/30 text-xs">
                        <span className="flex items-center gap-1"><Heart size={12} /> {list.likeCount}</span>
                        <span>{movieCount} movies</span>
                        {list.createdAt && (
                          <span>{new Date(list.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
