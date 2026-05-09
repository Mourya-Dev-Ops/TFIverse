'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaFire, FaClock, FaHeart, FaUser, FaEye, FaPlus, FaSearch, FaBookmark } from 'react-icons/fa';

type Meme = {
  id: string;
  title: string;
  imageUrl: string;
  likes: number;
  views: number;
  userProfile: { username: string };
  userHasLiked?: boolean;
  userHasBookmarked?: boolean;
};

export default function MemesClient({ user }: any) {
  const router = useRouter();
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'hot' | 'new' | 'top'>('hot');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadMemes();
  }, [filter, page]);

 async function loadMemes() {
  setLoading(true);
  try {
    const params = new URLSearchParams({
      filter,
      page: page.toString(),
      limit: '20',
      userId: user?.id || '',
      search: search, // ✅ Add search param
    });
    const res = await fetch(`/api/memes?${params}`);
    const data = await res.json();
    setMemes(prev => page === 1 ? data.memes : [...prev, ...data.memes]);
  } catch (error) {
    console.error('Failed to load memes:', error);
  } finally {
    setLoading(false);
  }
}


async function handleLike(memeId: string) {
  if (!user) {
    router.push('/signin');
    return;
  }
  
  // Call API to toggle like
  await fetch(`/api/memes/${memeId}`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'like' })
  });
  
  // Fetch fresh data for this meme only
  const res = await fetch(`/api/memes/${memeId}`);
  const updatedMeme = await res.json();
  
  // Update local state with fresh data
  setMemes(prev => prev.map(m => 
    m.id === memeId ? { ...m, ...updatedMeme } : m
  ));
}

async function handleBookmark(memeId: string) {
  if (!user) {
    router.push('/signin');
    return;
  }
  
  // Call API to toggle bookmark
  await fetch(`/api/memes/${memeId}`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'bookmark' })
  });
  
  // Fetch fresh data for this meme only
  const res = await fetch(`/api/memes/${memeId}`);
  const updatedMeme = await res.json();
  
  // Update local state with fresh data
  setMemes(prev => prev.map(m => 
    m.id === memeId ? { ...m, ...updatedMeme } : m
  ));
}


  const filteredMemes = search
    ? memes.filter(m => m.title.toLowerCase().includes(search.toLowerCase()))
    : memes;

  return (
    <div className="text-white pt-20">
      {/* Sticky Filter Bar */}
      <div className="sticky top-16 z-40 bg-black/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">🎭 Memes</h1>

          {/* Search Bar */}
<div className="max-w-4xl mx-auto mb-6 px-4">
  <div className="relative">
    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
    <input
      type="text"
      placeholder="Search memes..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full pl-12 pr-4 py-3 bg-gray-900 rounded-lg border border-gray-800 focus:border-red-600 focus:outline-none text-white"
    />
  </div>
</div>

{/* ✅ ADD THIS RIGHT AFTER SEARCH BAR */}
{user && (
  <div className="flex flex-wrap justify-center items-center gap-4 mb-6 px-4">
    <Link
      href="/memes/my"
      className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-2 transition-colors"
    >
      <FaUser /> My Memes
    </Link>
   <Link
  href="/memes/my"
  onClick={() => {
    // This will open My Memes, user can click Bookmarks tab there
  }}
  className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-2 transition-colors"
>
  <FaBookmark /> My Bookmarks
</Link>

    {user.role === 'admin' && (
      <Link
        href="/admin/memes"
        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-2 transition-colors"
      >
        🛡️ Admin Panel
      </Link>
    )}
  </div>
)}
          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { key: 'hot', icon: FaFire, label: 'Hot' },
              { key: 'new', icon: FaClock, label: 'New' },
              { key: 'top', icon: FaHeart, label: 'Top' },
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => { setFilter(key as any); setPage(1); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap ${
                  filter === key ? 'bg-red-600' : 'bg-gray-900 hover:bg-gray-800'
                }`}
              >
                <Icon /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Memes Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading && page === 1 ? (
          <div className="text-center py-20">Loading...</div>
        ) : filteredMemes.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No memes found</div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {filteredMemes.map((meme) => (
                <motion.div
                  key={meme.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900 rounded-lg overflow-hidden hover:ring-2 hover:ring-red-600 transition-all"
                >
                  <Link href={`/memes/${meme.id}`}>
                    <div className="relative aspect-square">
                      <Image src={meme.imageUrl} alt={meme.title} fill className="object-cover" />
                    </div>
                  </Link>
                  <div className="p-2 md:p-3">
                    <Link href={`/memes/${meme.id}`}>
                      <h3 className="font-semibold text-sm md:text-base hover:text-red-500 line-clamp-2">{meme.title}</h3>
                    </Link>
                    <div className="flex items-center gap-3 mt-2 text-xs md:text-sm text-gray-400">
                      <button
                        onClick={() => handleLike(meme.id)}
                        className={meme.userHasLiked ? 'text-red-500' : 'hover:text-red-500'}
                      >
                        <FaHeart className="inline" /> {meme.likes}
                      </button>
                      <span><FaEye className="inline" /> {meme.views}</span>
                      <button
                        onClick={() => handleBookmark(meme.id)}
                        className={meme.userHasBookmarked ? 'text-yellow-500' : 'hover:text-yellow-500'}
                      >
                        <FaBookmark />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Floating Upload Button */}
      {user && (
        <Link href="/memes/upload">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 md:w-16 md:h-16 bg-red-600 hover:bg-red-700 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl z-50"
          >
            <FaPlus />
          </motion.button>
        </Link>
      )}
    </div>
  );
}
