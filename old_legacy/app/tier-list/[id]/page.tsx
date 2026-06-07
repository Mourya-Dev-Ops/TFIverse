'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaHeart, FaRegHeart, FaShare, FaEdit, FaTrash, FaDownload, FaTwitter, FaFacebook, FaWhatsapp, FaTelegram, FaReddit, FaInstagram } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { getTierList, toggleTierListLike } from '@/app/actions/tierlist';
import { toPng } from 'html-to-image';
import heroesData from '@/data/heroes.json';
// import upcomingData from '@/data/upcoming.json'; // Uncomment if you have this

type Movie = {
  slug: string;
  title: string;
  year?: number | string;
  poster?: string;
  hero?: string;
  tmdbId?: string;
};

type TierInfo = {
  id: string;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
};

const DEFAULT_POSTER = '/images/no-poster.png';

function resolvePoster(input?: string) {
  if (!input) return DEFAULT_POSTER;
  const p = String(input).trim();
  if (p.startsWith('http://') || p.startsWith('https://')) return p;
  if (p.startsWith('/public/')) return p.replace(/^\/public/, '');
  if (p.startsWith('/')) return p;
  return `/${p}`;
}

export default function ViewTierListPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const id = params?.id as string;
  const tierListRef = useRef<HTMLDivElement>(null);
  
  const [tierList, setTierList] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPosters, setLoadingPosters] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isOwner, setIsOwner] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [resolvedMovies, setResolvedMovies] = useState<Record<string, Movie[]>>({});
  const [activeTiers, setActiveTiers] = useState<TierInfo[]>([]);

  // ✅ LOAD TIER LIST DATA
  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        console.log('🔍 Loading tier list:', id);

        const tierListData = await getTierList(id);
        
        if (!tierListData) {
          console.error('❌ Tier list not found');
          setLoading(false);
          return;
        }

        console.log('✅ Tier list loaded:', tierListData);
        setTierList(tierListData);
        
        // Check if user is owner
        setIsOwner(session?.user?.id === tierListData.userId);

        // Parse tiers data
        const tiersData = tierListData.tiers as any;
        
        // For now, use default tier configs (you can extend this to store custom tiers)
        const defaultTierConfigs: TierInfo[] = [
          { id: 'S', label: 'S TIER', emoji: '🏆', color: 'from-yellow-500 to-yellow-600', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/50' },
          { id: 'A', label: 'A TIER', emoji: '💎', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/50' },
          { id: 'B', label: 'B TIER', emoji: '⭐', color: 'from-green-500 to-green-600', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/50' },
          { id: 'C', label: 'C TIER', emoji: '📊', color: 'from-gray-400 to-gray-500', bgColor: 'bg-gray-400/20', borderColor: 'border-gray-400/50' },
          { id: 'D', label: 'D TIER', emoji: '⚠️', color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-500/50' },
          { id: 'F', label: 'F TIER', emoji: '💀', color: 'from-red-500 to-red-600', bgColor: 'bg-red-500/20', borderColor: 'border-red-500/50' },
        ];
        
        setActiveTiers(defaultTierConfigs.filter(t => Object.keys(tiersData).includes(t.id)));

        // ✅ LOAD MOVIE DETAILS
        const loadMovieDetails = async (slug: string): Promise<Movie | null> => {
          console.log(`🔍 Looking for movie: ${slug}`);
          
          // Check heroes data
          for (const hero of heroesData as any[]) {
            if (hero.movies && Array.isArray(hero.movies)) {
              const movie = hero.movies.find((m: any) => m.slug === slug);
              if (movie) {
                console.log(`✅ Found in heroes.json: ${movie.title}`);
                
                return {
                  slug: movie.slug,
                  title: movie.title,
                  year: movie.year,
                  poster: resolvePoster(movie.poster || `/images/movies/${movie.slug}.jpg`),
                  hero: hero.name,
                };
              }
            }
          }
          
          console.error(`❌ Movie not found: ${slug}`);
          return null;
        };

        // ✅ LOAD ALL MOVIES FOR ALL TIERS
        const resolvedTiers: Record<string, Movie[]> = {};
        
        for (const tier of defaultTierConfigs) {
          if (!tiersData[tier.id]) continue;
          
          const tierSlugs = tiersData[tier.id] as string[];
          console.log(`⏳ Loading ${tierSlugs.length} movies for tier ${tier.label}`);
          
          const moviePromises = tierSlugs.map((slug: string) => loadMovieDetails(slug));
          const movies = await Promise.all(moviePromises);
          resolvedTiers[tier.id] = movies.filter((m): m is Movie => m !== null);
          
          console.log(`✅ Loaded ${resolvedTiers[tier.id].length} movies for tier ${tier.label}`);
        }

        console.log('✅ All movies loaded:', resolvedTiers);
        setResolvedMovies(resolvedTiers);
        setLoadingPosters(false);
        setLoading(false);
      } catch (err) {
        console.error('❌ Error loading tier list:', err);
        setLoading(false);
      }
    })();
  }, [id, session]);

  const handleLike = async () => {
    if (!session?.user) {
      router.push('/signin?callbackUrl=/tier-list/' + id);
      return;
    }

    try {
      const result = await toggleTierListLike(id);
      setLiked(result.liked);
      setLikeCount(prev => result.liked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleDownload = async () => {
    if (!tierListRef.current) return;
    setDownloading(true);
    
    try {
      const element = tierListRef.current;
      const originalPosition = element.style.position;
      const originalDisplay = element.style.display;
      element.style.position = 'relative';
      element.style.display = 'block';
      
      const buttons = element.querySelectorAll('button');
      const buttonDisplays: string[] = [];
      buttons.forEach((btn, i) => {
        buttonDisplays[i] = (btn as HTMLElement).style.display;
        (btn as HTMLElement).style.display = 'none';
      });

      const watermark = document.createElement('div');
      watermark.style.cssText = `position: absolute; bottom: 20px; right: 20px; background: linear-gradient(135deg, #E50914 0%, #B00710 100%); padding: 16px 32px; border-radius: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-weight: 900; font-size: 24px; color: white; z-index: 10000; box-shadow: 0 8px 32px rgba(229, 9, 20, 0.6); letter-spacing: 1px;`;
      watermark.textContent = 'TFIverse.in';
      element.appendChild(watermark);

      await new Promise(resolve => setTimeout(resolve, 100));

      const dataUrl = await toPng(element, { 
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#000000',
        cacheBust: true 
      });
      
      element.removeChild(watermark);
      element.style.position = originalPosition;
      element.style.display = originalDisplay;
      buttons.forEach((btn, i) => { (btn as HTMLElement).style.display = buttonDisplays[i]; });
      
      const link = document.createElement('a');
      const filename = tierList.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      link.download = `${filename}-tfiverse.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setShowShareModal(false);
      alert('✅ Downloaded!');
    } catch (error: any) {
      console.error('Download error:', error);
      alert('❌ Failed to download');
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this tier list?')) return;
    setDeleting(true);
    try {
      // You'll need to add deleteTierList action
      // await deleteTierList(id);
      alert('✅ Tier list deleted!');
      router.push('/tier-list/my-lists');
    } catch (error) {
      console.error('Delete error:', error);
      alert('❌ Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl font-bold animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!tierList) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4">😕</div>
          <div className="text-white text-2xl font-bold mb-4">Tier List Not Found</div>
          <Link href="/tier-list" className="px-6 py-3 bg-[#E50914] text-white font-bold rounded-lg hover:bg-[#F40612] transition">Back to Hub</Link>
        </div>
      </div>
    );
  }
  return (
    <main className="bg-black min-h-screen pb-20">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
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

          <div className="flex items-center gap-3">
            <Link href="/tier-list" className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm transition flex items-center gap-2">
              🏆 <span className="hidden md:inline">Hub</span>
            </Link>
            <Link href="/" className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm transition flex items-center gap-2">
              🏠 <span className="hidden md:inline">Home</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-16"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center gap-4 mb-8 p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10">
          <div className="flex items-center gap-4">
            {session?.user?.image ? (
              <img 
                src={session.user.image} 
                alt={session.user.name || 'User'} 
                className="w-16 h-16 rounded-full border-2 border-white/20 object-cover" 
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E50914] to-[#831010] flex items-center justify-center text-white text-2xl font-bold">
                {session?.user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-black text-white mb-1">{tierList.title}</h1>
            <p className="text-white/60">
              by <span className="text-white font-bold">{session?.user?.name || 'Anonymous'}</span>
              {' • '}{tierList.createdAt ? new Date(tierList.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button 
              onClick={handleLike} 
              className={`px-4 py-2 rounded-lg border-2 ${liked ? 'bg-[#E50914] border-[#E50914] text-white' : 'bg-white/10 border-white/20 text-white'} hover:scale-105 transition flex items-center gap-2 font-bold`}
            >
              {liked ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
              <span>{likeCount}</span>
            </button>
            <button 
              onClick={() => setShowShareModal(true)} 
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition flex items-center gap-2"
            >
              <FaShare size={16} />
              <span className="hidden md:inline">Share</span>
            </button>
            {isOwner && (
              <>
                <Link 
                  href={`/tier-list/${id}/edit`} 
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center gap-2"
                >
                  <FaEdit size={16} />
                  <span className="hidden md:inline">Edit</span>
                </Link>
                <button 
                  onClick={handleDelete} 
                  disabled={deleting} 
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition flex items-center gap-2 disabled:opacity-50"
                >
                  <FaTrash size={16} />
                  <span className="hidden md:inline">{deleting ? 'Deleting...' : 'Delete'}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {loadingPosters && (
          <div className="text-center py-8 text-white/60 mb-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E50914] mb-2"></div>
            <p>Loading movie posters...</p>
          </div>
        )}

        <div ref={tierListRef} className="space-y-3 relative" id="tier-list-display">
          {activeTiers && activeTiers.length > 0 ? (
            activeTiers.map((tier: TierInfo) => {
              const movies = resolvedMovies[tier.id] || [];
              return (
                <div key={tier.id} className="flex gap-0 rounded-xl overflow-hidden border-2 border-white/10 shadow-xl">
                  <div className={`w-32 bg-gradient-to-br ${tier.color} flex flex-col items-center justify-center p-4`}>
                    <div className="text-5xl mb-2">{tier.emoji}</div>
                    <div className="text-white font-black text-base text-center">{tier.label}</div>
                  </div>
                  <div className={`flex-1 ${tier.bgColor} p-6 min-h-[180px]`}>
                    {movies.length === 0 ? (
                      <div className="text-white/50 text-base font-medium w-full text-center py-12">No movies in this tier</div>
                    ) : (
                      <div className="flex flex-wrap gap-4 items-start">
                        {movies.map((movie: Movie) => (
                          <Link key={movie.slug} href={`/movie/${movie.slug}`} className="relative group block">
                            <div className="w-28 h-40 rounded-lg overflow-hidden border-2 border-white/30 shadow-xl hover:scale-105 hover:border-[#E50914] transition-all cursor-pointer">
                              <img 
                                src={movie.poster} 
                                alt={movie.title} 
                                className="w-full h-full object-cover" 
                                onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_POSTER; }} 
                              />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end justify-center p-2">
                              <div className="text-white text-xs font-bold text-center line-clamp-3">{movie.title}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 text-white/60">
              <div className="text-6xl mb-4">🎬</div>
              <div className="text-xl font-bold">No tiers found</div>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 max-w-md w-full border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-white">Share Tier List</h3>
              <button onClick={() => setShowShareModal(false)} className="text-white/60 hover:text-white text-2xl">×</button>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
              <p className="text-yellow-200 text-sm flex items-start gap-2">
                <span className="text-2xl">💡</span>
                <span><strong>Tip:</strong> Image will auto-download. Upload it manually when posting!</span>
              </p>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out my tier list on TFIverse!')}&url=${encodeURIComponent(window.location.href)}`, '_blank')} 
                className="w-full px-6 py-4 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-bold rounded-xl transition flex items-center justify-center gap-3 text-lg"
              >
                <FaTwitter size={24} /> Share on Twitter
              </button>
              <button 
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')} 
                className="w-full px-6 py-4 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold rounded-xl transition flex items-center justify-center gap-3 text-lg"
              >
                <FaFacebook size={24} /> Share on Facebook
              </button>
              <button 
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Check out this tier list! ' + window.location.href)}`, '_blank')} 
                className="w-full px-6 py-4 bg-[#25D366] hover:bg-[#22c55e] text-white font-bold rounded-xl transition flex items-center justify-center gap-3 text-lg"
              >
                <FaWhatsapp size={24} /> Share on WhatsApp
              </button>
              <button 
                onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('Check out this tier list!')}`, '_blank')} 
                className="w-full px-6 py-4 bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold rounded-xl transition flex items-center justify-center gap-3 text-lg"
              >
                <FaTelegram size={24} /> Share on Telegram
              </button>
              <button 
                onClick={() => window.open(`https://reddit.com/submit?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(tierList.title)}`, '_blank')} 
                className="w-full px-6 py-4 bg-[#FF4500] hover:bg-[#e03d00] text-white font-bold rounded-xl transition flex items-center justify-center gap-3 text-lg"
              >
                <FaReddit size={24} /> Share on Reddit
              </button>
              <button 
                onClick={() => window.open('https://www.instagram.com/', '_blank')} 
                className="w-full px-6 py-4 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white font-bold rounded-xl transition flex items-center justify-center gap-3 text-lg"
              >
                <FaInstagram size={24} /> Share on Instagram
              </button>
              <button 
                onClick={handleDownload} 
                disabled={downloading} 
                className="w-full px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition flex items-center justify-center gap-3 text-lg border border-white/20 disabled:opacity-50"
              >
                <FaDownload size={24} /> {downloading ? 'Downloading...' : 'Download Image'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
