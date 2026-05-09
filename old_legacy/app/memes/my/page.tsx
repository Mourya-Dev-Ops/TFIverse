'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaClock, FaCheck, FaBan, FaUpload, FaBookmark } from 'react-icons/fa';
import Navbar from '@/components/layout/navbar';

type Meme = {
  id: string;
  title: string;
  imageUrl: string;
  status: string;
  likes: number;
  views: number;
};

export default function MyMemes() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<'my-memes' | 'bookmarks'>('my-memes');
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated' || !session?.user) {
      router.push('/signin');
      return;
    }
    loadMemes();
  }, [tab, filter, session, status]);

  async function loadMemes() {
    setLoading(true);
    try {
      if (tab === 'my-memes') {
        const params = new URLSearchParams({ userId: session?.user?.id || '' });
        if (filter !== 'all') params.append('status', filter);
        const res = await fetch(`/api/memes?${params}`);
        const data = await res.json();
        setMemes(data.memes || []);
      } else {
        const res = await fetch(`/api/memes/bookmarks`);
        const data = await res.json();
        setMemes(data.memes || []);
      }
    } catch (error) {
      console.error('Failed to load:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(memeId: string) {
    if (!confirm('Delete this meme?')) return;
    await fetch(`/api/memes/${memeId}/delete`, { method: 'DELETE' });
    loadMemes();
  }

  const statusColors = { pending: 'bg-yellow-600', approved: 'bg-green-600', rejected: 'bg-red-600' };
  const statusIcons = { pending: FaClock, approved: FaCheck, rejected: FaBan };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar user={null} />
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar user={session?.user} />
      
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 pt-20">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">My Memes</h1>
          <Link
            href="/memes/upload"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
          >
            <FaUpload /> Upload New
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'my-memes', label: 'My Memes' },
            { key: 'bookmarks', label: 'Bookmarks', icon: FaBookmark },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                tab === key ? 'bg-red-600' : 'bg-gray-900 hover:bg-gray-800'
              }`}
            >
              {Icon && <Icon />} {label}
            </button>
          ))}
        </div>

        {/* Filters */}
        {tab === 'my-memes' && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {['all', 'pending', 'approved', 'rejected'].map((key) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap ${
                  filter === key ? 'bg-red-600' : 'bg-gray-900 hover:bg-gray-800'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        )}

        {/* Memes Grid */}
        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : memes.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No memes found</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {memes.map((meme) => {
              const StatusIcon = statusIcons[meme.status as keyof typeof statusIcons];
              return (
                <motion.div
                  key={meme.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900 rounded-lg overflow-hidden"
                >
                  <Link href={`/memes/${meme.id}`}>
                    <div className="relative aspect-square">
                      <Image src={meme.imageUrl} alt={meme.title} fill className="object-cover" />
                      {tab === 'my-memes' && (
                        <div className={`absolute top-2 right-2 ${statusColors[meme.status as keyof typeof statusColors]} text-white px-2 py-1 rounded text-xs flex items-center gap-1`}>
                          <StatusIcon /> {meme.status}
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-2 md:p-3">
                    <Link href={`/memes/${meme.id}`}>
                      <h3 className="font-semibold text-sm md:text-base line-clamp-2">{meme.title}</h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-2 text-xs md:text-sm text-gray-400">
                      <span>❤️ {meme.likes}</span>
                      <span>👁️ {meme.views}</span>
                    </div>
                    {tab === 'my-memes' && (
                      <div className="flex gap-2 mt-3">
                        <Link
                          href={`/memes/${meme.id}/edit`}
                          className="flex-1 flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-xs md:text-sm"
                        >
                          <FaEdit /> Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(meme.id)}
                          className="flex-1 flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded text-xs md:text-sm"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Defensive: hide any floating FABs injected globally on this route */}
      <style jsx global>{`
        .floating-upload,
        .fixed.bottom-6.right-6,
        .fixed.bottom-6.left-6 {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
