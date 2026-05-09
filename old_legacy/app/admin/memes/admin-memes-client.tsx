'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaCheck, FaTimes, FaEye } from 'react-icons/fa';

export default function AdminMemesClient() {
  const [memes, setMemes] = useState<any[]>([]);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMemes();
  }, [filter]);

  async function loadMemes() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/memes?status=${filter}`);
      const data = await res.json();
      setMemes(data.memes);
    } catch (error) {
      console.error('Failed to load memes:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(memeId: string, action: 'approve' | 'reject') {
    await fetch(`/api/admin/memes/${memeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    loadMemes();
  }

  return (
    <div className="text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">🛡️ Meme Moderation</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg capitalize ${
                filter === status ? 'bg-red-600' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Memes Grid */}
        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : memes.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No {filter} memes</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memes.map((meme) => (
              <div key={meme.id} className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="relative aspect-square">
                  <Image src={meme.imageUrl} alt={meme.title} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-2">{meme.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">{meme.description}</p>
                  <p className="text-xs text-gray-500 mb-4">By: @{meme.userProfile.username}</p>

                  {filter === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(meme.id, 'approve')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
                      >
                        <FaCheck /> Approve
                      </button>
                      <button
                        onClick={() => handleAction(meme.id, 'reject')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
                      >
                        <FaTimes /> Reject
                      </button>
                    </div>
                  )}

                  {filter !== 'pending' && (
                    <div className="text-center text-sm text-gray-400 capitalize">
                      Status: {meme.status}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
