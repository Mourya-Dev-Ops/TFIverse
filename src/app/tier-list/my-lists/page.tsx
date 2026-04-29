'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { getUserTierLists, deleteTierList } from '@/app/actions/tierlist';
import { Plus, Search, Trash2, Eye, Heart, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

type TierList = {
  id: string;
  title: string;
  createdAt: Date | null;
  tiers: any;
  isPublic: boolean | null;
  likeCount: number;
};

export default function MyTierListsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [lists, setLists] = useState<TierList[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/tier-list/my-lists');
      return;
    }
    if (status === 'authenticated') {
      (async () => {
        try {
          const data = await getUserTierLists();
          setLists(data as TierList[]);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
      })();
    }
  }, [status, router]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}" permanently?`)) return;
    setDeleting(id);
    try {
      await deleteTierList(id);
      setLists(prev => prev.filter(l => l.id !== id));
      toast.success('Tier list deleted');
    } catch (e) {
      toast.error('Failed to delete');
    } finally { setDeleting(null); }
  };

  const filtered = lists.filter(l => !searchQuery || l.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const totalLikes = lists.reduce((s, l) => s + (l.likeCount || 0), 0);
  const totalMovies = lists.reduce((s, l) => {
    const tiers = l.tiers as Record<string, string[]>;
    return s + Object.values(tiers || {}).flat().length;
  }, 0);

  if (status === 'loading' || loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white pb-20">
      <div className="max-w-[1200px] mx-auto px-6 pt-28">

        <Link href="/tier-list" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm font-medium mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Tier List Hub
        </Link>

        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">My Tier Lists</h1>
            <p className="text-white/40">Manage and edit your rankings</p>
          </div>
          <Link href="/tier-list/create" className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold text-sm transition-all hover:bg-white/90">
            <Plus size={18} /> Create New
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
            <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-1">Total Lists</p>
            <p className="text-3xl font-black">{lists.length}</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
            <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-1">Total Likes</p>
            <p className="text-3xl font-black">{totalLikes}</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
            <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-1">Movies Ranked</p>
            <p className="text-3xl font-black">{totalMovies}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search your lists..." className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 outline-none focus:border-white/30 transition-all" />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-7xl mb-6 opacity-40">🎬</div>
            <h2 className="text-2xl font-bold mb-2 text-white/60">{searchQuery ? 'No Results' : 'No tier lists yet'}</h2>
            <p className="text-white/30 mb-8">{searchQuery ? 'Try a different search' : 'Create your first ranking!'}</p>
            {!searchQuery && (
              <Link href="/tier-list/create" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl font-bold"><Plus size={20} /> Create Tier List</Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(list => {
              const tiers = list.tiers as Record<string, string[]>;
              const movieCount = Object.values(tiers || {}).flat().length;
              return (
                <div key={list.id} className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all duration-300">
                  <h3 className="text-lg font-bold mb-3 line-clamp-2">{list.title}</h3>

                  <div className="flex items-center gap-3 text-white/30 text-xs mb-4">
                    <span className="flex items-center gap-1"><Heart size={12} /> {list.likeCount || 0}</span>
                    <span>{movieCount} movies</span>
                    <span>{list.isPublic ? '🌐 Public' : '🔒 Private'}</span>
                    {list.createdAt && <span>{new Date(list.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/tier-list/${list.id}`} className="flex-1 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-bold transition-all flex items-center justify-center gap-2">
                      <Eye size={14} /> View
                    </Link>
                    <button onClick={() => handleDelete(list.id, list.title)} disabled={deleting === list.id} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-white/40 text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                      <Trash2 size={14} />
                    </button>
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
