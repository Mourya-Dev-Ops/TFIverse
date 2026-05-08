'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { getTierList, toggleTierListLike, deleteTierList, getTierListComments, addTierListComment, deleteTierListComment } from '@/app/actions/tierlist';
import { toPng } from 'html-to-image';
import { getHeroMoviesForTierList } from '@/app/actions/heroes';
import { ArrowLeft, Heart, Share2, Download, Trash2, User, X, MessageCircle, Send, Reply } from 'lucide-react';
import { FaTwitter, FaWhatsapp, FaTelegram } from 'react-icons/fa';
import toast from 'react-hot-toast';

type Movie = { slug: string; title: string; year?: number | string; poster?: string; hero?: string };
type TierInfo = { id: string; label: string; emoji: string; color: string; bgColor: string };
type Comment = { id: string; content: string; parentId: string | null; userId: string; createdAt: Date | null; username: string | null; avatar: string | null; userName: string | null };

const DEFAULT_POSTER = '/images/no-poster.png';
const TIER_CONFIGS: TierInfo[] = [
  { id: 'S', label: 'MASTERPIECE', emoji: '🏆', color: 'from-yellow-500 to-amber-600', bgColor: 'bg-yellow-500/10' },
  { id: 'A', label: 'EXCELLENT', emoji: '💎', color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-500/10' },
  { id: 'B', label: 'GOOD', emoji: '⭐', color: 'from-green-500 to-emerald-600', bgColor: 'bg-green-500/10' },
  { id: 'C', label: 'AVERAGE', emoji: '📊', color: 'from-gray-400 to-gray-600', bgColor: 'bg-gray-400/10' },
  { id: 'D', label: 'BELOW AVG', emoji: '⚠️', color: 'from-orange-500 to-red-500', bgColor: 'bg-orange-500/10' },
  { id: 'F', label: 'TERRIBLE', emoji: '💀', color: 'from-red-600 to-rose-800', bgColor: 'bg-red-500/10' },
  { id: 'G', label: 'FORGETTABLE', emoji: '🔻', color: 'from-pink-500 to-fuchsia-600', bgColor: 'bg-pink-500/10' },
  { id: 'H', label: 'TRASH', emoji: '🗑️', color: 'from-purple-500 to-violet-600', bgColor: 'bg-purple-500/10' },
];

let _cachedMovies: Movie[] | null = null;

async function loadMovies(): Promise<Movie[]> {
  if (_cachedMovies) return _cachedMovies;
  _cachedMovies = (await getHeroMoviesForTierList()) as Movie[];
  return _cachedMovies;
}

function resolveMovieSync(slug: string, allMovies: Movie[]): Movie | null {
  return allMovies.find(m => m.slug === slug) || null;
}

function resolvePoster(input?: string) {
  if (!input) return DEFAULT_POSTER;
  const p = String(input).trim();
  if (p.startsWith('http://') || p.startsWith('https://')) return p;
  if (p.startsWith('/')) return p;
  return `/${p}`;
}

function timeAgo(date: Date | null): string {
  if (!date) return '';
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ViewTierListPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const id = params?.id as string;
  const tierRef = useRef<HTMLDivElement>(null);

  const [tierList, setTierList] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [resolvedTiers, setResolvedTiers] = useState<Record<string, Movie[]>>({});
  const [showShare, setShowShare] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const [data, commentsData, heroMovies] = await Promise.all([
          getTierList(id),
          getTierListComments(id),
          loadMovies(),
        ]);
        if (!data) { setLoading(false); return; }
        setTierList(data);
        setLiked(data.liked);
        setLikeCount(data.likeCount);
        setComments(commentsData as Comment[]);

        const tiers = data.tiers as Record<string, string[]>;
        const resolved: Record<string, Movie[]> = {};
        for (const [tier, slugs] of Object.entries(tiers)) {
          resolved[tier] = (slugs || []).map(s => resolveMovieSync(s, heroMovies)).filter((m): m is Movie => m !== null);
        }
        setResolvedTiers(resolved);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setLoading(false);
      }
    })();
  }, [id]);

  const isOwner = session?.user?.id === tierList?.userId;

  const handleLike = async () => {
    if (!session?.user) { router.push(`/login?callbackUrl=/tier-list/${id}`); return; }
    try {
      const result = await toggleTierListLike(id);
      setLiked(result.liked);
      setLikeCount(prev => result.liked ? prev + 1 : prev - 1);
    } catch (e) { console.error(e); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this tier list permanently?')) return;
    try {
      await deleteTierList(id);
      toast.success('Deleted!');
      router.push('/tier-list');
    } catch (e) { toast.error('Failed to delete'); }
  };

  const handleDownload = async () => {
    if (!tierRef.current) return;
    setDownloading(true);
    try {
      const imgs = tierRef.current.querySelectorAll('img');
      const originals: string[] = [];
      imgs.forEach((img, i) => {
        originals[i] = img.src;
        if (img.src.startsWith('https://image.tmdb.org')) {
          img.src = `/api/proxy-image?url=${encodeURIComponent(img.src)}`;
        }
      });
      await Promise.all(Array.from(imgs).map(img => img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })));
      const dataUrl = await toPng(tierRef.current, { quality: 1, pixelRatio: 2, backgroundColor: '#000' });
      imgs.forEach((img, i) => { img.src = originals[i]; });
      const link = document.createElement('a');
      link.download = `${tierList?.title || 'tier-list'}-tfiverse.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Downloaded!');
    } catch (err) {
      console.error(err);
      toast.error('Export failed');
    } finally { setDownloading(false); }
  };

  const handleAddComment = async (parentId?: string) => {
    const text = parentId ? replyText : commentText;
    if (!text.trim()) return;
    if (!session?.user) { router.push(`/login?callbackUrl=/tier-list/${id}`); return; }
    setSubmitting(true);
    try {
      await addTierListComment(id, text.trim(), parentId);
      const updated = await getTierListComments(id);
      setComments(updated as Comment[]);
      if (parentId) { setReplyText(''); setReplyTo(null); }
      else setCommentText('');
      toast.success('Comment added!');
    } catch (e: any) {
      toast.error(e.message || 'Failed to comment');
    } finally { setSubmitting(false); }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteTierListComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId && c.parentId !== commentId));
      toast.success('Comment deleted');
    } catch (e: any) { toast.error(e.message); }
  };

  const activeTiers = TIER_CONFIGS.filter(t => resolvedTiers[t.id]?.length > 0);
  const topComments = comments.filter(c => !c.parentId);
  const getReplies = (parentId: string) => comments.filter(c => c.parentId === parentId);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>;
  if (!tierList) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-4">
      <div className="text-6xl opacity-40">😕</div>
      <h1 className="text-2xl font-bold">Tier List Not Found</h1>
      <Link href="/tier-list" className="px-6 py-3 bg-white text-black rounded-xl font-bold">Back to Hub</Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white pb-20">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 pt-24">

        {/* Back Button */}
        <Link href="/tier-list" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm font-medium mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Tier List Hub
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-4">
            <Link href={tierList.username ? `/u/${tierList.username}` : '#'} className="group">
              {tierList.avatar ? (
                <img src={tierList.avatar} alt="" className="w-14 h-14 rounded-full border-2 border-white/10 object-cover group-hover:border-white/40 transition-colors" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors"><User size={22} className="text-white/40" /></div>
              )}
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-black">{tierList.title}</h1>
              <p className="text-white/40 text-sm">
                by <Link href={tierList.username ? `/u/${tierList.username}` : '#'} className="text-white/70 font-medium hover:text-white hover:underline transition-colors">{tierList.username || 'Anonymous'}</Link>
                {tierList.createdAt && ` · ${new Date(tierList.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={handleLike} className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${liked ? 'bg-white text-black' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
              <Heart size={16} fill={liked ? 'currentColor' : 'none'} /> {likeCount}
            </button>
            <button onClick={() => setShowShare(true)} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-medium transition-all flex items-center gap-2">
              <Share2 size={16} /> Share
            </button>
            <button onClick={handleDownload} disabled={downloading} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50">
              <Download size={16} /> {downloading ? '...' : 'PNG'}
            </button>
            {isOwner && (
              <button onClick={handleDelete} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/30 text-sm font-medium transition-all flex items-center gap-2 text-white/60 hover:text-red-400">
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Tier Display */}
        <div ref={tierRef} className="space-y-2 p-4 rounded-3xl bg-white/[0.01] border border-white/5 mb-12">
          {activeTiers.length === 0 ? (
            <div className="text-center py-20 text-white/30">
              <div className="text-6xl mb-4 opacity-40">🎬</div>
              <p className="text-lg font-medium">No movies ranked yet</p>
            </div>
          ) : (
            activeTiers.map(tier => {
              const movies = resolvedTiers[tier.id] || [];
              return (
                <div key={tier.id} className="flex rounded-2xl overflow-hidden border border-white/5 bg-black/40">
                  <div className={`w-[110px] flex-shrink-0 bg-gradient-to-br ${tier.color} flex flex-col items-center justify-center p-3`}>
                    <div className="text-2xl mb-1">{tier.emoji}</div>
                    <div className="text-white/90 font-black text-[9px] tracking-widest uppercase text-center">{tier.label}</div>
                  </div>
                  <div className={`flex-1 ${tier.bgColor} p-3 min-h-[80px]`}>
                    <div className="flex flex-wrap gap-2">
                      {movies.map(movie => (
                        <div key={movie.slug} className="relative group">
                          <div className="w-[80px] h-[120px] rounded-lg overflow-hidden border border-white/20 shadow-lg">
                            <img src={resolvePoster(movie.poster)} alt={movie.title} loading="lazy" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_POSTER; }} />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end p-1.5">
                            <span className="text-[8px] text-white/90 font-medium leading-tight line-clamp-2">{movie.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div className="flex justify-end pt-1 pr-2">
            <span className="text-white/10 text-[10px] font-bold tracking-widest">TFIverse.in</span>
          </div>
        </div>

        {/* ============ COMMENTS SECTION ============ */}
        <div className="rounded-3xl border border-white/5 bg-white/[0.01] overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
            <MessageCircle size={20} className="text-white/40" />
            <h2 className="text-lg font-bold">Comments ({comments.length})</h2>
          </div>

          {/* Add Comment */}
          <div className="px-6 py-4 border-b border-white/5">
            {session?.user ? (
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {session.user.image ? <img src={session.user.image} alt="" className="w-full h-full object-cover" /> : <User size={16} className="text-white/40" />}
                </div>
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value.slice(0, 500))}
                    placeholder="Share your thoughts..."
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-white/30 resize-none transition-colors"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-white/20 text-[10px]">{commentText.length}/500</span>
                    <button
                      onClick={() => handleAddComment()}
                      disabled={!commentText.trim() || submitting}
                      className="px-4 py-1.5 bg-white text-black rounded-lg text-xs font-bold disabled:opacity-30 hover:bg-white/90 transition-all flex items-center gap-1.5"
                    >
                      <Send size={12} /> Post
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-white/30 text-sm mb-2">Sign in to join the discussion</p>
                <Link href={`/login?callbackUrl=/tier-list/${id}`} className="text-white text-sm font-bold hover:underline">Sign In →</Link>
              </div>
            )}
          </div>

          {/* Comments List */}
          <div className="divide-y divide-white/5">
            {topComments.length === 0 ? (
              <div className="px-6 py-10 text-center text-white/20 text-sm">No comments yet. Be the first!</div>
            ) : (
              topComments.map(comment => {
                const replies = getReplies(comment.id);
                return (
                  <div key={comment.id} className="px-6 py-4">
                    {/* Main Comment */}
                    <div className="flex gap-3">
                      <Link href={comment.username ? `/u/${comment.username}` : '#'} className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-white/20 transition-all">
                          {comment.avatar ? <img src={comment.avatar} alt="" className="w-full h-full object-cover" /> : <User size={14} className="text-white/40" />}
                        </div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Link href={comment.username ? `/u/${comment.username}` : '#'} className="text-sm font-bold text-white/80 hover:text-white hover:underline transition-colors">
                            {comment.username || comment.userName || 'User'}
                          </Link>
                          <span className="text-white/20 text-[10px]">{timeAgo(comment.createdAt)}</span>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed">{comment.content}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button onClick={() => { setReplyTo(replyTo === comment.id ? null : comment.id); setReplyText(''); }} className="text-white/30 text-[11px] font-medium hover:text-white/60 transition-colors flex items-center gap-1">
                            <Reply size={12} /> Reply
                          </button>
                          {comment.userId === session?.user?.id && (
                            <button onClick={() => handleDeleteComment(comment.id)} className="text-white/20 text-[11px] font-medium hover:text-red-400 transition-colors">Delete</button>
                          )}
                        </div>

                        {/* Reply Input */}
                        {replyTo === comment.id && session?.user && (
                          <div className="mt-3 flex gap-2">
                            <input
                              type="text"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value.slice(0, 500))}
                              placeholder={`Reply to ${comment.username || 'user'}...`}
                              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-white/30"
                              onKeyDown={(e) => { if (e.key === 'Enter' && replyText.trim()) handleAddComment(comment.id); }}
                            />
                            <button onClick={() => handleAddComment(comment.id)} disabled={!replyText.trim() || submitting} className="px-3 py-2 bg-white text-black rounded-lg text-[10px] font-bold disabled:opacity-30">
                              <Send size={12} />
                            </button>
                          </div>
                        )}

                        {/* Replies */}
                        {replies.length > 0 && (
                          <div className="mt-3 ml-2 pl-3 border-l border-white/5 space-y-3">
                            {replies.map(reply => (
                              <div key={reply.id} className="flex gap-2">
                                <Link href={reply.username ? `/u/${reply.username}` : '#'} className="flex-shrink-0">
                                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                                    {reply.avatar ? <img src={reply.avatar} alt="" className="w-full h-full object-cover" /> : <User size={10} className="text-white/40" />}
                                  </div>
                                </Link>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <Link href={reply.username ? `/u/${reply.username}` : '#'} className="text-[11px] font-bold text-white/70 hover:text-white hover:underline">{reply.username || reply.userName || 'User'}</Link>
                                    <span className="text-white/15 text-[9px]">{timeAgo(reply.createdAt)}</span>
                                  </div>
                                  <p className="text-white/50 text-xs">{reply.content}</p>
                                  {reply.userId === session?.user?.id && (
                                    <button onClick={() => handleDeleteComment(reply.id)} className="text-white/15 text-[10px] hover:text-red-400 mt-0.5">Delete</button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShare && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowShare(false)} />
          <div className="relative bg-[#111] border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <button onClick={() => setShowShare(false)} className="absolute top-4 right-4 p-2 text-white/40 hover:text-white bg-white/5 rounded-full"><X size={16} /></button>
            <h3 className="text-xl font-bold mb-6">Share This List</h3>
            <div className="space-y-3">
              <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out "${tierList.title}" on TFIverse!`)}&url=${encodeURIComponent(window.location.href)}`, '_blank')} className="w-full px-5 py-3 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] rounded-xl font-bold text-sm transition flex items-center gap-3">
                <FaTwitter size={20} /> Share on Twitter
              </button>
              <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Check out "${tierList.title}" - ${window.location.href}`)}`, '_blank')} className="w-full px-5 py-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] rounded-xl font-bold text-sm transition flex items-center gap-3">
                <FaWhatsapp size={20} /> Share on WhatsApp
              </button>
              <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(tierList.title)}`, '_blank')} className="w-full px-5 py-3 bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0088cc] rounded-xl font-bold text-sm transition flex items-center gap-3">
                <FaTelegram size={20} /> Share on Telegram
              </button>
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }} className="w-full px-5 py-3 bg-white/5 hover:bg-white/10 text-white/60 rounded-xl font-bold text-sm transition flex items-center gap-3 border border-white/10">
                🔗 Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
