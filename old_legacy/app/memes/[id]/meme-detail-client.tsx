'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHeart, FaEye, FaShare, FaDownload, FaBookmark, FaArrowLeft,
  FaEdit, FaTrash, FaTwitter, FaFacebook, FaWhatsapp, FaTelegram
} from 'react-icons/fa';

export default function MemeDetailClient({ memeId, user }: { memeId: string; user: any }) {
  const router = useRouter();
  const [meme, setMeme] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  
  // ✅ Comments state
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    loadMeme();
    loadComments(); // ✅ Load comments
    if (typeof window !== 'undefined') {
      setShareUrl(`${window.location.origin}/memes/${memeId}`);
    }
  }, [memeId]);

  async function loadMeme() {
    try {
      const res = await fetch(`/api/memes/${memeId}`);
      const data = await res.json();
      setMeme(data);
      setLiked(data.userHasLiked || false);
      setBookmarked(data.userHasBookmarked || false);
      setLikes(data.likes);
    } catch (error) {
      console.error('Failed to load meme:', error);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Load comments
  async function loadComments() {
    try {
      const res = await fetch(`/api/memes/${memeId}/comments`);
      const data = await res.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  }

  // ✅ Add comment
  async function handleAddComment() {
    if (!user || !newComment.trim()) return;
    
    try {
      await fetch(`/api/memes/${memeId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: newComment }),
      });
      
      setNewComment('');
      loadComments();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  }

  async function handleLike() {
    if (!user) {
      router.push('/signin');
      return;
    }
    
    await fetch(`/api/memes/${memeId}`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'like' })
    });
    
    await loadMeme();
  }

  async function handleBookmark() {
    if (!user) {
      router.push('/signin');
      return;
    }
    
    await fetch(`/api/memes/${memeId}`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'bookmark' })
    });
    
    await loadMeme();
  }

  async function handleDownload() {
    try {
      await fetch(`/api/memes/${memeId}/download`, { method: 'POST' });
      const response = await fetch(meme.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${meme.title.replace(/[^a-z0-9]/gi, '_')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Download failed');
    }
  }

  async function handleShare(platform: string) {
    await fetch(`/api/memes/${memeId}/share`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform })
    });
    const urls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(meme.title)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(meme.title + ' ' + shareUrl)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(meme.title)}`,
    };
    window.open(urls[platform as keyof typeof urls], '_blank');
    setShowShareMenu(false);
  }

  async function handleDelete() {
    if (!confirm('Delete this meme?')) return;
    await fetch(`/api/memes/${memeId}/delete`, { method: 'DELETE' });
    router.push('/memes');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white pt-20">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>Loading meme...</p>
        </div>
      </div>
    );
  }

  if (!meme) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white pt-20">
        <div className="text-center">
          <p className="text-xl text-gray-400">Meme not found</p>
          <Link href="/memes" className="text-red-500 hover:text-red-400 mt-4 inline-block">
            Back to Memes
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === meme.userId;

  return (
    <div className="text-white pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        {/* Navigation */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Link href="/memes" className="flex items-center gap-2 text-gray-400 hover:text-white">
            <FaArrowLeft /> Back
          </Link>
          {user && (
            <Link href="/memes/my" className="flex items-center gap-2 text-gray-400 hover:text-white">
              My Memes
            </Link>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Image */}
          <div className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden">
            <Image src={meme.imageUrl} alt={meme.title} fill className="object-contain" priority />
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{meme.title}</h1>
              {meme.description && <p className="text-gray-400">{meme.description}</p>}
            </div>

            {/* Owner Actions */}
            {isOwner && (
              <div className="flex gap-2">
                <Link 
                  href={`/memes/${meme.id}/edit`} 
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  <FaEdit /> Edit
                </Link>
                <button 
                  onClick={handleDelete} 
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  liked ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <FaHeart /> {likes}
              </button>
              
              <button
                onClick={handleBookmark}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  bookmarked ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <FaBookmark />
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
                >
                  <FaShare />
                </button>
                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-2 right-0 bg-gray-800 rounded-lg shadow-xl p-2 z-10 min-w-[150px]"
                    >
                      {[
                        { key: 'twitter', icon: FaTwitter, label: 'Twitter', color: 'text-blue-400' },
                        { key: 'facebook', icon: FaFacebook, label: 'Facebook', color: 'text-blue-600' },
                        { key: 'whatsapp', icon: FaWhatsapp, label: 'WhatsApp', color: 'text-green-500' },
                        { key: 'telegram', icon: FaTelegram, label: 'Telegram', color: 'text-blue-500' },
                      ].map(({ key, icon: Icon, label, color }) => (
                        <button
                          key={key}
                          onClick={() => handleShare(key)}
                          className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-700 rounded"
                        >
                          <Icon className={color} /> {label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <button 
                onClick={handleDownload} 
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
              >
                <FaDownload />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-900 rounded-lg">
              <div>
                <div className="text-xl md:text-2xl font-bold">{likes}</div>
                <div className="text-xs md:text-sm text-gray-400">Likes</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold">{meme.views}</div>
                <div className="text-xs md:text-sm text-gray-400">Views</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold">{meme.downloads || 0}</div>
                <div className="text-xs md:text-sm text-gray-400">Downloads</div>
              </div>
            </div>

            {/* Creator */}
            <div className="p-4 bg-gray-900 rounded-lg">
              <div className="text-sm text-gray-400 mb-2">Created by</div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                  {meme.userProfile?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="font-semibold">@{meme.userProfile?.username || 'Unknown'}</div>
                  <div className="text-sm text-gray-400">
                    {new Date(meme.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {(meme.tags?.length > 0 || meme.heroTags?.length > 0) && (
              <div className="space-y-3">
                {meme.tags?.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Tags</div>
                    <div className="flex flex-wrap gap-2">
                      {meme.tags.map((tag: string) => (
                        <span key={tag} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {meme.heroTags?.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Heroes</div>
                    <div className="flex flex-wrap gap-2">
                      {meme.heroTags.map((hero: string) => (
                        <span key={hero} className="px-3 py-1 bg-red-900/30 rounded-full text-sm">
                          {hero}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ✅ Comments Section */}
        <div className="max-w-3xl mx-auto mt-12 px-4">
          <h2 className="text-2xl font-bold mb-6">💬 Comments</h2>
          
          {/* Add Comment Form */}
          {user ? (
            <div className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-800 focus:border-red-600 focus:outline-none resize-none text-white"
                rows={3}
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="mt-2 px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Post Comment
              </button>
            </div>
          ) : (
            <div className="mb-6 text-center text-gray-400 py-8 bg-gray-900 rounded-lg">
              <Link href="/signin" className="text-red-500 hover:underline">Sign in</Link> to comment
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center font-bold">
                    {comment.user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="font-semibold">@{comment.user?.username || 'Unknown'}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 ml-13">{comment.comment}</p>
              </div>
            ))}
            {comments.length === 0 && (
              <div className="text-center text-gray-400 py-12 bg-gray-900 rounded-lg">
                No comments yet. Be the first! 🎉
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
