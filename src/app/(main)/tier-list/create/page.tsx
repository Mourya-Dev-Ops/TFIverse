'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  DndContext, DragEndEvent, DragOverlay, DragStartEvent, 
  PointerSensor, useSensor, useSensors, useDroppable, pointerWithin 
} from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toPng } from 'html-to-image';
import { useSession } from 'next-auth/react';
import { createTierList } from '@/app/actions/tierlist';
import { getHeroMoviesForTierList } from '@/app/actions/heroes';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Search, Download, Save, Check, Plus, Trash2, RotateCcw, 
  ArrowLeft, Share2, X, Link as LinkIcon 
} from 'lucide-react';
import { FaTwitter, FaFacebook } from 'react-icons/fa';
import toast from 'react-hot-toast';

type Movie = {
  slug: string;
  title: string;
  year?: number | string;
  poster?: string;
  hero?: string;
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
  { id: 'S', label: 'MASTERPIECE', emoji: '🏆', color: 'from-yellow-500 to-amber-600', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/30' },
  { id: 'A', label: 'EXCELLENT', emoji: '💎', color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30' },
  { id: 'B', label: 'GOOD', emoji: '⭐', color: 'from-green-500 to-emerald-600', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30' },
  { id: 'C', label: 'AVERAGE', emoji: '📊', color: 'from-gray-400 to-gray-600', bgColor: 'bg-gray-400/10', borderColor: 'border-gray-400/30' },
  { id: 'D', label: 'BELOW AVG', emoji: '⚠️', color: 'from-orange-500 to-red-500', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/30' },
  { id: 'F', label: 'TERRIBLE', emoji: '💀', color: 'from-red-600 to-rose-800', bgColor: 'bg-white/10', borderColor: 'border-red-500/30' },
];

const ADDITIONAL_TIER_CONFIGS: TierInfo[] = [
  { id: 'G', label: 'FORGETTABLE', emoji: '🔻', color: 'from-pink-500 to-fuchsia-600', bgColor: 'bg-pink-500/10', borderColor: 'border-pink-500/30' },
  { id: 'H', label: 'TRASH', emoji: '🗑️', color: 'from-purple-500 to-violet-600', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/30' },
];

const DEFAULT_POSTER = '/images/no-poster.png';

function resolvePoster(input?: string, useProxy = false) {
  if (!input) return DEFAULT_POSTER;
  const p = String(input).trim();
  
  if (p.startsWith('http://') || p.startsWith('https://')) {
    // Only proxy during PNG export (to avoid canvas CORS tainting)
    return useProxy ? `/api/proxy-image?url=${encodeURIComponent(p)}` : p;
  }
  
  if (p.startsWith('/public/')) return p.replace(/^\/public/, '');
  if (p.startsWith('/')) return p;
  return `/${p}`;
}

// ============================================================================
// MOVIE CARD COMPONENTS
// ============================================================================

// MovieCard removed — using DraggableMovie everywhere for unified drag+select

function DraggableMovie({ movie, isSelected, onToggle }: { movie: Movie, isSelected?: boolean, onToggle?: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: movie.slug });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div 
        className={`relative group touch-none transition-transform duration-150 ${isSelected ? 'ring-2 ring-white/80 scale-[0.92] rounded-xl' : 'hover:scale-105'}`}
        onClick={(e) => {
          if (onToggle) {
            e.stopPropagation();
            onToggle();
          }
        }}
      >
        <div className="w-[100px] h-[150px] rounded-xl overflow-hidden border border-white/20 shadow-lg cursor-grab active:cursor-grabbing hover:border-white/40 transition-colors">
          <img
            src={resolvePoster(movie.poster)}
            alt={movie.title}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_POSTER; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2">
            <span className="text-[10px] text-white/90 font-medium leading-tight line-clamp-2">{movie.title}</span>
          </div>
        </div>
        {isSelected && (
          <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg z-10">
            <Check size={12} className="text-black" />
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// TIER ROW COMPONENT
// ============================================================================

function TierRow({ 
  tier, movies, onRemove, onLabelChange, onEmojiChange, onDelete, canDelete
}: { 
  tier: TierInfo; movies: Movie[]; onRemove: (slug: string) => void;
  onLabelChange: (id: string, newLabel: string) => void;
  onEmojiChange: (id: string, newEmoji: string) => void;
  onDelete: (id: string) => void; canDelete: boolean;
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
    <div className={`flex rounded-2xl overflow-hidden border border-white/5 bg-black/40 backdrop-blur-md transition-all duration-300 ${isOver ? 'ring-2 ring-white/50 scale-[1.01] shadow-2xl' : 'shadow-xl'}`}>
      
      {/* Tier Label Column */}
      <div className={`w-[140px] flex-shrink-0 bg-gradient-to-br ${tier.color} flex flex-col items-center justify-center p-3 relative group border-r border-white/10`}>
        {canDelete && (
          <button
            onClick={() => onDelete(tier.id)}
            className="absolute top-2 right-2 w-6 h-6 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm z-10"
            title="Delete tier"
          >
            <Trash2 size={12} />
          </button>
        )}
        
        {isEditing ? (
          <div className="space-y-2 w-full animate-in fade-in zoom-in duration-200">
            <input
              type="text"
              value={editEmoji}
              onChange={(e) => setEditEmoji(e.target.value)}
              className="w-full px-2 py-1 text-2xl text-center bg-black/40 border border-white/20 rounded-lg outline-none focus:border-white/50 transition-colors"
              placeholder="🏆"
            />
            <input
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') {
                  setEditLabel(tier.label);
                  setEditEmoji(tier.emoji);
                  setIsEditing(false);
                }
              }}
              autoFocus
              className="w-full px-2 py-2 text-[10px] font-black tracking-wider uppercase text-white text-center bg-black/40 border border-white/20 rounded-lg outline-none focus:border-white/50 transition-colors"
              placeholder="Tier name"
            />
          </div>
        ) : (
          <div 
            className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:scale-105 transition-transform"
            onDoubleClick={() => setIsEditing(true)}
            title="Double-click to edit"
          >
            <div className="text-3xl mb-2 drop-shadow-lg">{tier.emoji}</div>
            <div className="text-white/90 font-black text-[10px] tracking-widest uppercase text-center drop-shadow-md">
              {tier.label}
            </div>
          </div>
        )}
      </div>

      {/* Tier Drop Zone */}
      <div 
        ref={setNodeRef} 
        className={`flex-1 ${tier.bgColor} p-3 ${movies.length === 0 ? 'min-h-[80px]' : 'min-h-[80px]'} transition-all relative`}
      >
        <SortableContext items={movies.map(m => m.slug)} strategy={rectSortingStrategy}>
          <div className="flex flex-wrap gap-3 items-start min-h-full">
            {movies.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-white/30 text-sm font-medium tracking-wide">
                {isOver ? 'Drop movie here' : 'Drag & drop movies'}
              </div>
            ) : (
              movies.map(movie => (
                <div key={movie.slug} className="relative group">
                  <DraggableMovie movie={movie} />
                  <button
                    onClick={() => onRemove(movie.slug)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-black/80 backdrop-blur hover:bg-white text-black border border-white/20 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all z-10 shadow-xl"
                  >
                    <X size={12} />
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

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function CreateTierListPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [unrankedMovies, setUnrankedMovies] = useState<Movie[]>([]);
  const [tiers, setTiers] = useState<Record<string, Movie[]>>({
    S: [], A: [], B: [], C: [], D: [], F: []
  });
  const [tierConfigs, setTierConfigs] = useState<TierInfo[]>(DEFAULT_TIER_CONFIGS);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovies, setSelectedMovies] = useState<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const { setNodeRef: setUnrankedNodeRef } = useDroppable({ id: 'unranked' });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/tier-list/create');
      return;
    }

    (async () => {
      try {
        const heroMovies = await getHeroMoviesForTierList();
        const movies: Movie[] = heroMovies.map((m: any) => ({
          slug: m.slug,
          title: m.title,
          year: m.year,
          poster: m.poster || `/images/movies/${m.slug}.jpg`,
          hero: m.hero,
        }));
        setAllMovies(movies);
        setUnrankedMovies(movies);
      } catch (err) {
        console.error('Failed to load movies:', err);
      }
    })();
  }, [status, router]);

  const filteredMovies = unrankedMovies.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.hero?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeSlug = active.id as string;
    const overId = over.id as string;

    if (overId.startsWith('tier-')) {
      const targetTier = overId.replace('tier-', '');
      setUnrankedMovies(prev => prev.filter(m => m.slug !== activeSlug));
      Object.keys(tiers).forEach(tier => {
        setTiers(prev => ({ ...prev, [tier]: prev[tier].filter(m => m.slug !== activeSlug) }));
      });
      const movie = allMovies.find(m => m.slug === activeSlug);
      if (movie) setTiers(prev => ({ ...prev, [targetTier]: [...prev[targetTier], movie] }));
    } else if (overId === 'unranked') {
      Object.keys(tiers).forEach(tier => {
        const movie = tiers[tier].find(m => m.slug === activeSlug);
        if (movie) {
          setTiers(prev => ({ ...prev, [tier]: prev[tier].filter(m => m.slug !== activeSlug) }));
          setUnrankedMovies(prev => [...prev, movie]);
        }
      });
    }
  };

  const handleRemoveFromTier = (tierId: string, slug: string) => {
    const movie = tiers[tierId].find(m => m.slug === slug);
    if (movie) {
      setTiers(prev => ({ ...prev, [tierId]: prev[tierId].filter(m => m.slug !== slug) }));
      setUnrankedMovies(prev => [...prev, movie]);
    }
  };

  const handleTierLabelChange = (id: string, newLabel: string) => setTierConfigs(prev => prev.map(t => t.id === id ? { ...t, label: newLabel } : t));
  const handleTierEmojiChange = (id: string, newEmoji: string) => setTierConfigs(prev => prev.map(t => t.id === id ? { ...t, emoji: newEmoji } : t));

  const handleAddTier = () => {
    const availableTiers = ADDITIONAL_TIER_CONFIGS.filter(t => !tierConfigs.find(tc => tc.id === t.id));
    if (availableTiers.length > 0) {
      const newTier = availableTiers[0];
      setTierConfigs(prev => [...prev, newTier]);
      setTiers(prev => ({ ...prev, [newTier.id]: [] }));
    }
  };

  const handleDeleteTier = (id: string) => {
    if (tierConfigs.length <= 1) return;
    const moviesToReturn = tiers[id] || [];
    setUnrankedMovies(prev => [...prev, ...moviesToReturn]);
    setTierConfigs(prev => prev.filter(t => t.id !== id));
    setTiers(prev => { const newTiers = { ...prev }; delete newTiers[id]; return newTiers; });
  };

  const toggleSelectMovie = (slug: string) => {
    setSelectedMovies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(slug)) newSet.delete(slug);
      else newSet.add(slug);
      return newSet;
    });
  };

  const handleBulkAddToTier = (tierId: string) => {
    const moviesToAdd = allMovies.filter(m => selectedMovies.has(m.slug));
    setUnrankedMovies(prev => prev.filter(m => !selectedMovies.has(m.slug)));
    Object.keys(tiers).forEach(tier => {
      setTiers(prev => ({ ...prev, [tier]: prev[tier].filter(m => !selectedMovies.has(m.slug)) }));
    });
    setTiers(prev => ({ ...prev, [tierId]: [...prev[tierId], ...moviesToAdd] }));
    setSelectedMovies(new Set());
    toast.success(`Added ${moviesToAdd.length} movies to tier`);
  };

  const handleClearAll = () => {
    if (!confirm('Clear all tiers? Movies will return to unranked.')) return;
    const allRankedMovies: Movie[] = [];
    Object.values(tiers).forEach(tierMovies => allRankedMovies.push(...tierMovies));
    setUnrankedMovies(prev => [...prev, ...allRankedMovies]);
    setTiers(Object.keys(tiers).reduce((acc, key) => ({ ...acc, [key]: [] }), {}));
    setSelectedMovies(new Set());
    toast.success('Tier list cleared');
  };

  const handleSave = async () => {
    if (!title.trim()) { toast.error('Please give your tier list a name!'); return; }
    if (title.trim().length > 50) { toast.error('Title must be 50 characters or less'); return; }
    if (!session?.user?.id) { toast.error('You must be signed in to save'); return; }
    const hasMovies = Object.values(tiers).some(t => t.length > 0);
    if (!hasMovies) { toast.error('Add at least one movie to a tier before saving'); return; }

    setSaving(true);
    try {
      const tierData = Object.keys(tiers).reduce((acc, key) => {
        acc[key] = tiers[key].map(m => m.slug);
        return acc;
      }, {} as Record<string, string[]>);

      const result = await createTierList({
        title: title.trim(),
        description: description.trim(),
        tiers: tierData,
        isPublic,
      });

      toast.success('Tier list saved successfully!');
      router.push(`/tier-list/${result.id}`);
    } catch (error: any) {
      console.error('Error saving:', error);
      toast.error('Failed to save tier list: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleExportImage = async () => {
    const toastId = toast.loading('Preparing export...');
    const element = document.getElementById('tier-list-capture');
    if (!element) { toast.dismiss(toastId); return; }

    try {
      // Swap all TMDB images to proxied versions for canvas CORS compliance
      const imgs = element.querySelectorAll('img');
      const originalSrcs: string[] = [];
      imgs.forEach((img, i) => {
        originalSrcs[i] = img.src;
        const src = img.getAttribute('src') || '';
        if (src.startsWith('https://image.tmdb.org')) {
          img.src = `/api/proxy-image?url=${encodeURIComponent(src)}`;
        }
      });

      // Wait for proxied images to load
      await Promise.all(
        Array.from(imgs).map(img => 
          img.complete ? Promise.resolve() : new Promise(resolve => { img.onload = resolve; img.onerror = resolve; })
        )
      );

      toast.loading('Generating PNG...', { id: toastId });

      const dataUrl = await toPng(element, { 
        quality: 1, pixelRatio: 2, backgroundColor: '#000000',
        style: { padding: '24px' }
      });

      // Restore original sources
      imgs.forEach((img, i) => { img.src = originalSrcs[i]; });

      const link = document.createElement('a');
      link.download = `${title || 'tfiverse-tier-list'}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Exported successfully!', { id: toastId });
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export image', { id: toastId });
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={pointerWithin}>
      <main className="bg-[#050505] min-h-screen pb-32 text-white selection:bg-red-500/30">
        
        {/* PREMIUM NAV BAR */}
        <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-2xl border-b border-white/5 shadow-2xl">
          <div className="max-w-[1600px] mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Link href="/tier-list" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/5">
                <ArrowLeft size={18} />
              </Link>
              <div className="flex-1">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value.slice(0, 50))}
                  placeholder="Name your Tier List..."
                  className="w-full bg-transparent text-xl md:text-2xl font-bold placeholder-white/30 outline-none border-b border-transparent focus:border-white/50 transition-colors py-1"
                />
                {title.length > 0 && (
                  <span className={`text-[10px] font-medium ${title.length > 45 ? 'text-amber-400' : 'text-white/20'}`}>{title.length}/50</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button onClick={handleExportImage} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all flex items-center gap-2 hover:border-white/20">
                <Download size={14} /> <span className="hidden sm:inline">Export PNG</span>
              </button>
              <button onClick={() => setShowShareModal(true)} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all flex items-center gap-2 hover:border-white/20">
                <Share2 size={14} /> <span className="hidden sm:inline">Share</span>
              </button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2 rounded-lg bg-white text-black hover:bg-white/90 text-sm font-semibold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:shadow-none">
                {saving ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Save size={14} />}
                <span>Save</span>
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8">
          
          {/* DRAG & DROP AREA */}
          <div id="tier-list-capture" className="space-y-2 mb-10 p-2 sm:p-4 rounded-3xl bg-white/[0.02] border border-white/5">
            {tierConfigs.map(tier => (
              <TierRow
                key={tier.id}
                tier={tier}
                movies={tiers[tier.id] || []}
                onRemove={(slug) => handleRemoveFromTier(tier.id, slug)}
                onLabelChange={handleTierLabelChange}
                onEmojiChange={handleTierEmojiChange}
                onDelete={handleDeleteTier}
                canDelete={tierConfigs.length > 1}
              />
            ))}
            {/* Branding watermark for PNG export */}
            <div className="flex justify-end pt-1 pr-2">
              <span className="text-white/10 text-[10px] font-bold tracking-widest">TFIverse.in</span>
            </div>
          </div>

          {tierConfigs.length < (DEFAULT_TIER_CONFIGS.length + ADDITIONAL_TIER_CONFIGS.length) && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddTier}
              className="mb-12 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-dashed border-white/20 text-white/70 font-medium transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus size={16} /> Add Tier
            </motion.button>
          )}

          {/* POOL AREA (Apple Bento Style) */}
          <div className="rounded-3xl border border-white/10 bg-[#0A0A0A] overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
            
            <div className="px-6 py-5 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 bg-black/20 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Search size={18} className="text-white/50" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg tracking-tight">Movie Pool</h3>
                  <p className="text-white/40 text-xs font-medium">{unrankedMovies.length} unranked movies</p>
                </div>
              </div>
              
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title or hero..."
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/30 outline-none focus:border-white/50 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {selectedMovies.size > 0 && (
                  <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded-lg">
                    <span className="text-white/80 text-xs font-bold">{selectedMovies.size} selected</span>
                    <div className="h-4 w-px bg-white/20 mx-1" />
                    <div className="flex gap-1">
                      {tierConfigs.map(tier => (
                        <button
                          key={tier.id}
                          onClick={() => handleBulkAddToTier(tier.id)}
                          className="w-6 h-6 flex items-center justify-center rounded bg-white/5 hover:bg-white/20 transition-colors text-[10px]"
                          title={`Move to ${tier.label}`}
                        >
                          {tier.emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {Object.values(tiers).some(t => t.length > 0) && (
                  <button
                    onClick={handleClearAll}
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/20 hover:text-white/80 border border-white/10 hover:border-red-500/30 text-white/60 text-xs font-bold transition-all flex items-center gap-2"
                  >
                    <RotateCcw size={12} /> Clear Board
                  </button>
                )}
              </div>
            </div>

            <div ref={setUnrankedNodeRef} className="p-6 h-[500px] overflow-y-auto custom-scrollbar relative z-10" id="unranked">
              <SortableContext items={filteredMovies.map(m => m.slug)} strategy={rectSortingStrategy}>
                <div className="flex flex-wrap gap-3">
                  {filteredMovies.map(movie => (
                    <DraggableMovie
                      key={movie.slug}
                      movie={movie}
                      isSelected={selectedMovies.has(movie.slug)}
                      onToggle={() => toggleSelectMovie(movie.slug)}
                    />
                  ))}
                  {filteredMovies.length === 0 && (
                    <div className="w-full py-20 flex flex-col items-center justify-center text-white/30">
                      <Search size={40} className="mb-4 opacity-50" />
                      <p className="font-medium">No movies found</p>
                    </div>
                  )}
                </div>
              </SortableContext>
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeId && (() => {
            const movie = allMovies.find(m => m.slug === activeId);
            return movie ? <DraggableMovie movie={movie} /> : null;
          })()}
        </DragOverlay>

        <AnimatePresence>
          {showShareModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowShareModal(false)} />
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-[#111] border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl">
                <button onClick={() => setShowShareModal(false)} className="absolute top-4 right-4 p-2 text-white/40 hover:text-white bg-white/5 rounded-full transition-colors"><X size={16} /></button>
                <h3 className="text-xl font-bold text-white mb-6">Share Tier List</h3>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button className="py-3 rounded-xl bg-blue-500/10 hover:bg-white/10 hover:text-white hover:border-white/30 font-semibold text-sm transition-colors flex flex-col items-center gap-2"><FaTwitter size={20} /> Twitter</button>
                  <button className="py-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 font-semibold text-sm transition-colors flex flex-col items-center gap-2"><FaFacebook size={20} /> Facebook</button>
                </div>
                <div className="p-3 rounded-xl bg-black border border-white/10 flex items-center gap-3">
                  <LinkIcon size={16} className="text-white/40 ml-2" />
                  <input type="text" readOnly value={`https://tfiverse.com/tier-list/preview`} className="bg-transparent text-sm text-white/80 w-full outline-none" />
                  <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors">Copy</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        
        <style dangerouslySetInnerHTML={{__html: `
          .custom-scrollbar::-webkit-scrollbar { width: 8px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        `}} />
      </main>
    </DndContext>
  );
}
