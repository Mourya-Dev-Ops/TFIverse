'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, useDroppable, closestCenter } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaArrowLeft, FaPlus, FaTrash, FaSave, FaEye, FaEyeSlash, FaTelegram, FaReddit, FaInstagram, FaSearch, FaTwitter, FaFacebook, FaWhatsapp, FaDownload } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { getTierList, updateTierList } from '@/app/actions/tierlist';
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

const DEFAULT_TIER_CONFIGS: TierInfo[] = [
  { id: 'S', label: 'S TIER', emoji: '🏆', color: 'from-yellow-500 to-yellow-600', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/50' },
  { id: 'A', label: 'A TIER', emoji: '💎', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/50' },
  { id: 'B', label: 'B TIER', emoji: '⭐', color: 'from-green-500 to-green-600', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/50' },
  { id: 'C', label: 'C TIER', emoji: '📊', color: 'from-gray-400 to-gray-500', bgColor: 'bg-gray-400/20', borderColor: 'border-gray-400/50' },
  { id: 'D', label: 'D TIER', emoji: '⚠️', color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-500/50' },
  { id: 'F', label: 'F TIER', emoji: '💀', color: 'from-red-500 to-red-600', bgColor: 'bg-red-500/20', borderColor: 'border-red-500/50' },
];

const DEFAULT_POSTER = '/images/no-poster.png';

function resolvePoster(input?: string) {
  if (!input) return DEFAULT_POSTER;
  const p = String(input).trim();
  if (p.startsWith('/public/')) return p.replace(/^\/public/, '');
  if (p.startsWith('http://') || p.startsWith('https://') || p.startsWith('/')) return p;
  return `/${p}`;
}

function DraggableMovie({ movie }: { movie: Movie }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: movie.slug });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className="relative group">
        <div className="w-28 h-40 rounded-lg overflow-hidden border-2 border-white/30 hover:border-[#E50914] hover:scale-105 transition-all cursor-move shadow-xl">
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
      </div>
    </div>
  );
}

function TierRow({ 
  tier, 
  movies, 
  onRemove, 
  onLabelChange, 
  onEmojiChange, 
  onDelete, 
  canDelete 
}: { 
  tier: TierInfo; 
  movies: Movie[]; 
  onRemove: (slug: string) => void;
  onLabelChange: (id: string, newLabel: string) => void;
  onEmojiChange: (id: string, newEmoji: string) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `tier-${tier.id}` });
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(tier.label);
  const [editEmoji, setEditEmoji] = useState(tier.emoji);
  
  const handleSave = () => {
    if (editLabel.trim()) onLabelChange(tier.id, editLabel.trim());
    if (editEmoji.trim()) onEmojiChange(tier.id, editEmoji.trim());
    setIsEditing(false);
  };

  return (
    <div className={`flex gap-0 rounded-xl overflow-hidden border-2 ${isOver ? 'border-[#E50914] shadow-2xl scale-[1.02]' : 'border-white/10'} transition-all duration-300 shadow-xl`}>
      <div className={`w-32 bg-gradient-to-br ${tier.color} flex flex-col items-center justify-center p-4 relative group`}>
        {canDelete && (
          <button
            onClick={() => onDelete(tier.id)}
            className="absolute top-2 right-2 w-6 h-6 bg-red-600/80 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition z-10"
          >
            <FaTrash size={10} />
          </button>
        )}
        
        {isEditing ? (
          <div className="space-y-2 w-full">
            <input
              type="text"
              value={editEmoji}
              onChange={(e) => setEditEmoji(e.target.value)}
              className="w-full px-2 py-1 text-3xl text-center bg-black/30 border border-white/40 rounded outline-none"
              maxLength={2}
            />
            <input
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') { setEditLabel(tier.label); setEditEmoji(tier.emoji); setIsEditing(false); }
              }}
              autoFocus
              className="w-full px-2 py-1 text-sm font-black text-white text-center bg-black/30 border border-white/40 rounded outline-none"
            />
          </div>
        ) : (
          <>
            <div className="text-5xl mb-2">{tier.emoji}</div>
            <div 
              className="text-white font-black text-base cursor-pointer hover:text-white/80 transition text-center"
              onDoubleClick={() => setIsEditing(true)}
            >
              {tier.label}
            </div>
          </>
        )}
      </div>

      <div ref={setNodeRef} className={`flex-1 ${tier.bgColor} ${isOver ? 'ring-4 ring-inset ring-[#E50914]/40' : ''} p-6 min-h-[180px] transition-all`}>
        <SortableContext items={movies.map(m => m.slug)} strategy={rectSortingStrategy}>
          <div className="flex flex-wrap gap-4 items-start">
            {movies.length === 0 ? (
              <div className="text-white/50 text-base font-medium w-full text-center py-12">
                {isOver ? '🎯 Drop here!' : 'Drag movies here...'}
              </div>
            ) : (
              movies.map(movie => (
                <div key={movie.slug} className="relative group">
                  <DraggableMovie movie={movie} />
                  <button
                    onClick={() => onRemove(movie.slug)}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white font-bold text-sm opacity-0 group-hover:opacity-100 transition-all z-10 shadow-lg"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}

export default function EditTierListPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const id = params?.id as string;
  const tierListRef = useRef<HTMLDivElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [loadingPosters, setLoadingPosters] = useState(true);
  const [tierList, setTierList] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [activeTiers, setActiveTiers] = useState<TierInfo[]>(DEFAULT_TIER_CONFIGS);
  const [tiers, setTiers] = useState<Record<string, Movie[]>>({});
  const [availableMovies, setAvailableMovies] = useState<Movie[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [movieSearchQuery, setMovieSearchQuery] = useState('');
  const [movieDisplayLimit, setMovieDisplayLimit] = useState(20);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  // Load existing tier list data
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin?callbackUrl=/tier-list/' + id + '/edit');
      return;
    }

    if (!id || !session?.user) return;

    (async () => {
      try {
        const tierListData = await getTierList(id);

        if (!tierListData) {
          alert('Tier list not found!');
          router.push('/tier-list');
          return;
        }

        if (tierListData.userId !== session.user.id) {
          alert('You cannot edit someone else\'s tier list!');
          router.push(`/tier-list/${id}`);
          return;
        }

        setTierList(tierListData);
        setTitle(tierListData.title || '');
        setIsPublic(tierListData.isPublic ?? true);

        const tiersData = tierListData.tiers as any;

        // Load movie details for each tier
        const loadMovieDetails = async (slug: string): Promise<Movie | null> => {
          for (const hero of heroesData as any[]) {
            if (hero.movies && Array.isArray(hero.movies)) {
              const movie = hero.movies.find((m: any) => m.slug === slug);
              if (movie) {
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
          return null;
        };

        const resolved: Record<string, Movie[]> = {};
        for (const tier of DEFAULT_TIER_CONFIGS) {
          const tierMovies = tiersData[tier.id] || [];
          const movies: Movie[] = [];

          for (const item of tierMovies) {
            let movie: Movie | null = null;

            if (typeof item === 'string') {
              movie = await loadMovieDetails(item);
            }

            if (movie) movies.push(movie);
          }

          resolved[tier.id] = movies;
        }

        setTiers(resolved);

        // Load available movies
        const allMovies: Movie[] = [];

        for (const hero of heroesData as any[]) {
          if (hero.movies && Array.isArray(hero.movies)) {
            for (const movie of hero.movies) {
              allMovies.push({
                slug: movie.slug,
                title: movie.title,
                year: movie.year,
                poster: resolvePoster(movie.poster || `/images/movies/${movie.slug}.jpg`),
                hero: hero.name,
              });
            }
          }
        }

        const usedSlugs = new Set<string>();
        Object.values(resolved).forEach(movies => {
          movies.forEach(m => usedSlugs.add(m.slug));
        });

        setAvailableMovies(allMovies.filter(m => !usedSlugs.has(m.slug)));
        setLoadingPosters(false);
        setLoading(false);
      } catch (error) {
        console.error('Error loading tier list:', error);
        setLoading(false);
      }
    })();
  }, [id, session, status, router]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (overId.startsWith('tier-')) {
      const targetTierId = overId.replace('tier-', '');
      
      let movie = availableMovies.find(m => m.slug === activeId);
      let sourceTierId: string | null = null;
      
      if (!movie) {
        for (const [tierId, movies] of Object.entries(tiers)) {
          const found = movies.find(m => m.slug === activeId);
          if (found) {
            movie = found;
            sourceTierId = tierId;
            break;
          }
        }
      }
      
      if (!movie) return;
      
      setAvailableMovies(prev => prev.filter(m => m.slug !== activeId));
      
      if (sourceTierId && sourceTierId !== targetTierId) {
        setTiers(prev => ({
          ...prev,
          [sourceTierId]: prev[sourceTierId].filter(m => m.slug !== activeId)
        }));
      }
      
      setTiers(prev => ({
        ...prev,
        [targetTierId]: prev[targetTierId]?.some(m => m.slug === activeId) 
          ? prev[targetTierId] 
          : [...(prev[targetTierId] || []), movie!]
      }));
    }
  };

  const removeFromTier = (slug: string) => {
    const movie = Object.values(tiers).flat().find(m => m.slug === slug);
    if (!movie) return;

    setTiers(prev => {
      const newTiers = { ...prev };
      for (const tierId of Object.keys(newTiers)) {
        newTiers[tierId] = newTiers[tierId].filter(m => m.slug !== slug);
      }
      return newTiers;
    });

    setAvailableMovies(prev => [...prev, movie]);
  };

  const addNewTier = () => {
    const newId = `custom-${Date.now()}`;
    const newTier: TierInfo = {
      id: newId,
      label: 'NEW TIER',
      emoji: '⭐',
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500',
    };
    setActiveTiers(prev => [...prev, newTier]);
    setTiers(prev => ({ ...prev, [newId]: [] }));
  };

  const deleteTier = (tierId: string) => {
    if (activeTiers.length <= 2) {
      alert('Must have at least 2 tiers!');
      return;
    }

    if (tiers[tierId]) {
      tiers[tierId].forEach(movie => {
        setAvailableMovies(prev => [...prev, movie]);
      });
    }

    setActiveTiers(prev => prev.filter(t => t.id !== tierId));
    setTiers(prev => {
      const newTiers = { ...prev };
      delete newTiers[tierId];
      return newTiers;
    });
  };

  const handleTierLabelChange = (id: string, newLabel: string) => {
    setActiveTiers(prev => prev.map(t => t.id === id ? { ...t, label: newLabel } : t));
  };

  const handleTierEmojiChange = (id: string, newEmoji: string) => {
    setActiveTiers(prev => prev.map(t => t.id === id ? { ...t, emoji: newEmoji } : t));
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

      const dataUrl = await toPng(element, { quality: 1.0, pixelRatio: 2, backgroundColor: '#000000', cacheBust: true });
      
      element.removeChild(watermark);
      element.style.position = originalPosition;
      element.style.display = originalDisplay;
      buttons.forEach((btn, i) => { (btn as HTMLElement).style.display = buttonDisplays[i]; });
      
      const link = document.createElement('a');
      const filename = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
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

  const handleSave = async () => {
    if (!session?.user) return;
    if (!title.trim()) {
      alert('Please enter a title!');
      return;
    }

    const totalMovies = Object.values(tiers).flat().length;
    if (totalMovies === 0) {
      alert('Please add at least one movie to your tier list!');
      return;
    }

    setSaving(true);

    try {
      const tierData = Object.fromEntries(
        Object.entries(tiers).map(([tierId, movies]) => [
          tierId, 
          movies.map(m => m.slug)
        ])
      );

      await updateTierList(id, {
        title: title.trim(),
        tiers: tierData,
        isPublic,
      });

      alert('✅ Tier list updated!');
      router.push(`/tier-list/${id}`);
    } catch (error: any) {
      console.error('Save error:', error);
      alert(`Failed to save: ${error.message}`);
    } finally {
      setSaving(false);
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

  const activeMovie = activeId ? [...availableMovies, ...Object.values(tiers).flat()].find(m => m.slug === activeId) : null;
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

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <Link href={`/tier-list/${id}`} className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20 transition flex items-center gap-2">
            <FaArrowLeft size={16} />
            <span>Back to View</span>
          </Link>
          
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`px-4 py-2 rounded-lg border-2 ${isPublic ? 'bg-green-600/20 border-green-500 text-green-400' : 'bg-red-600/20 border-red-500 text-red-400'} font-bold text-sm transition flex items-center gap-2`}
            >
              {isPublic ? <FaEye size={14} /> : <FaEyeSlash size={14} />}
              {isPublic ? 'Public' : 'Private'}
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition flex items-center gap-2"
            >
              <FaDownload size={14} />
              Share
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 rounded-lg bg-[#E50914] hover:bg-[#F40612] text-white font-bold text-sm transition disabled:opacity-50 flex items-center gap-2"
            >
              <FaSave size={14} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter tier list title..."
            className="w-full px-6 py-4 rounded-xl bg-white/5 border-2 border-white/10 focus:border-[#E50914] text-white text-2xl font-bold placeholder-white/30 outline-none transition"
          />
        </div>

        {loadingPosters && (
          <div className="text-center py-8 text-white/60 mb-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E50914] mb-2"></div>
            <p>Loading movie posters...</p>
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div ref={tierListRef} className="space-y-3 mb-8">
            {activeTiers.map(tier => (
              <TierRow
                key={tier.id}
                tier={tier}
                movies={tiers[tier.id] || []}
                onRemove={removeFromTier}
                onLabelChange={handleTierLabelChange}
                onEmojiChange={handleTierEmojiChange}
                onDelete={deleteTier}
                canDelete={activeTiers.length > 2}
              />
            ))}
          </div>

          <button
            onClick={addNewTier}
            className="w-full py-4 rounded-xl bg-white/5 border-2 border-dashed border-white/20 hover:bg-white/10 hover:border-white/40 text-white font-bold text-lg transition flex items-center justify-center gap-3 mb-8"
          >
            <FaPlus size={20} />
            Add Custom Tier
          </button>

          <div className="rounded-xl bg-white/5 border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="text-white font-bold text-lg">Add More Movies</div>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={14} />
                <input
                  type="text"
                  value={movieSearchQuery}
                  onChange={(e) => setMovieSearchQuery(e.target.value)}
                  placeholder="Search movies..."
                  className="pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 outline-none focus:border-[#E50914] transition"
                />
              </div>
            </div>

            <div>
              <SortableContext items={(movieSearchQuery ? 
                availableMovies.filter(m => 
                  m.title.toLowerCase().includes(movieSearchQuery.toLowerCase()) || 
                  m.hero?.toLowerCase().includes(movieSearchQuery.toLowerCase())
                ) : 
                availableMovies
              ).slice(0, movieDisplayLimit).map(m => m.slug)} strategy={rectSortingStrategy}>
                <div className="flex flex-wrap gap-4">
                  {(movieSearchQuery ? 
                    availableMovies.filter(m => 
                      m.title.toLowerCase().includes(movieSearchQuery.toLowerCase()) || 
                      m.hero?.toLowerCase().includes(movieSearchQuery.toLowerCase())
                    ) : 
                    availableMovies
                  ).slice(0, movieDisplayLimit).map(movie => (
                    <DraggableMovie key={movie.slug} movie={movie} />
                  ))}
                </div>
              </SortableContext>

              {movieDisplayLimit < (movieSearchQuery ? 
                availableMovies.filter(m => 
                  m.title.toLowerCase().includes(movieSearchQuery.toLowerCase()) || 
                  m.hero?.toLowerCase().includes(movieSearchQuery.toLowerCase())
                ).length : 
                availableMovies.length
              ) && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => setMovieDisplayLimit(prev => prev + 20)}
                    className="px-8 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold transition"
                  >
                    Load More ({movieDisplayLimit}/{movieSearchQuery ? 
                      availableMovies.filter(m => 
                        m.title.toLowerCase().includes(movieSearchQuery.toLowerCase()) || 
                        m.hero?.toLowerCase().includes(movieSearchQuery.toLowerCase())
                      ).length : 
                      availableMovies.length
                    })
                  </button>
                </div>
              )}
            </div>
          </div>

          <DragOverlay>
            {activeMovie ? (
              <div className="w-28 h-40 rounded-lg overflow-hidden border-2 border-[#E50914] opacity-90 shadow-2xl">
                <img
                  src={activeMovie.poster}
                  alt={activeMovie.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

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
              <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out my ' + title + ' tier list on TFIverse!')}&url=${encodeURIComponent(window.location.origin + '/tier-list/' + id)}`, '_blank')} className="w-full px-6 py-4 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-bold rounded-xl transition flex items-center justify-center gap-3 text-lg">
                <FaTwitter size={24} /> Share on Twitter
              </button>
              <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '/tier-list/' + id)}`, '_blank')} className="w-full px-6 py-4 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold rounded-xl transition flex items-center justify-center gap-3 text-lg">
                <FaFacebook size={24} /> Share on Facebook
              </button>
              <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Check out my ' + title + ' tier list on TFIverse! ' + window.location.origin + '/tier-list/' + id)}`, '_blank')} className="w-full px-6 py-4 bg-[#25D366] hover:bg-[#22c55e] text-white font-bold rounded-xl transition flex items-center justify-center gap-3 text-lg">
                <FaWhatsapp size={24} /> Share on WhatsApp
              </button>
              <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.origin + '/tier-list/' + id)}&text=${encodeURIComponent('Check out my ' + title + ' tier list on TFIverse!')}`, '_blank')} className="w-full px-6 py-4 bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold rounded-xl transition flex items-center justify-center gap-3 text-lg">
                <FaTelegram size={24} /> Share on Telegram
              </button>
              <button onClick={() => window.open(`https://reddit.com/submit?url=${encodeURIComponent(window.location.origin + '/tier-list/' + id)}&title=${encodeURIComponent(title + ' - TFIverse Tier List')}`, '_blank')} className="w-full px-6 py-4 bg-[#FF4500] hover:bg-[#e03d00] text-white font-bold rounded-xl transition flex items-center justify-center gap-3 text-lg">
                <FaReddit size={24} /> Share on Reddit
              </button>
              <button onClick={() => window.open('https://www.instagram.com/', '_blank')} className="w-full px-6 py-4 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white font-bold rounded-xl transition flex items-center justify-center gap-3 text-lg">
                <FaInstagram size={24} /> Share on Instagram
              </button>
              <button onClick={handleDownload} disabled={downloading} className="w-full px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition flex items-center justify-center gap-3 text-lg border border-white/20 disabled:opacity-50">
                <FaDownload size={24} /> {downloading ? 'Downloading...' : 'Download Image'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

