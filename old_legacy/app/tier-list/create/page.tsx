'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, useDroppable, pointerWithin } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toPng } from 'html-to-image';
import { FaSearch, FaDownload, FaSave, FaCheck, FaEdit, FaShare, FaTwitter, FaFacebook, FaWhatsapp, FaReddit, FaTelegram, FaTimes, FaPlus, FaTrash, FaCheckDouble, FaUndo, FaArrowLeft, FaInstagram } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { createTierList } from '@/app/actions/tierlist';
import heroesData from '@/data/heroes.json';
// Remove upcomingData import if not using, or keep if you have it
// import upcomingData from '@/data/upcoming.json';

type Movie = {
  slug: string;
  title: string;
  year?: number | string;
  poster?: string;
  hero?: string;
  isUpcoming?: boolean;
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

const ADDITIONAL_TIER_CONFIGS: TierInfo[] = [
  { id: 'G', label: 'G TIER', emoji: '🔻', color: 'from-pink-500 to-pink-600', bgColor: 'bg-pink-500/20', borderColor: 'border-pink-500/50' },
  { id: 'H', label: 'H TIER', emoji: '🗑️', color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-500/20', borderColor: 'border-purple-500/50' },
];

const DEFAULT_POSTER = '/images/no-poster.png';

function resolvePoster(input?: string) {
  if (!input) return DEFAULT_POSTER;
  
  const p = String(input).trim();
  
  if (p.startsWith('http://') || p.startsWith('https://')) {
    return p;
  }
  
  if (p.startsWith('/public/')) {
    return p.replace(/^\/public/, '');
  }
  
  if (p.startsWith('/')) {
    return p;
  }
  
  return `/${p}`;
}

// MovieCard component
function MovieCard({ movie, isDragging, isSelected, onToggle }: { 
  movie: Movie; 
  isDragging?: boolean;
  isSelected?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div 
      className={`relative group ${isDragging ? 'opacity-50' : ''} ${isSelected ? 'ring-2 ring-[#E50914] scale-95' : ''}`}
      onClick={onToggle}
    >
      <div className="w-24 h-36 rounded-lg overflow-hidden border-2 border-white/20 hover:border-[#E50914] hover:scale-105 transition-all cursor-pointer shadow-lg">
        <img
          src={resolvePoster(movie.poster)}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_POSTER; }}
        />
      </div>
      {isSelected && (
        <div className="absolute top-1 right-1 w-7 h-7 bg-[#E50914] rounded-full flex items-center justify-center shadow-lg">
          <FaCheck size={14} className="text-white" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end justify-center p-2">
        <div className="text-white text-xs font-bold text-center line-clamp-2">{movie.title}</div>
      </div>
    </div>
  );
}

// DraggableMovie component
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
            src={resolvePoster(movie.poster)}
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

// TierRow component - same as your code, no database changes here
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
    if (editLabel.trim()) {
      onLabelChange(tier.id, editLabel.trim());
    }
    if (editEmoji.trim()) {
      onEmojiChange(tier.id, editEmoji.trim());
    }
    setIsEditing(false);
  };
  
  return (
    <div className={`flex gap-0 rounded-xl overflow-hidden border-2 ${isOver ? 'border-[#E50914] shadow-2xl scale-[1.02]' : 'border-white/10'} transition-all duration-300 shadow-xl`}>
      <div className={`w-32 bg-gradient-to-br ${tier.color} flex flex-col items-center justify-center p-4 relative group`}>
        {canDelete && (
          <button
            onClick={() => onDelete(tier.id)}
            className="absolute top-2 right-2 w-6 h-6 bg-red-600/80 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition z-10"
            title="Delete tier"
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
              placeholder="🏆"
              maxLength={2}
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
              className="w-full px-2 py-1 text-sm font-black text-white text-center bg-black/30 border border-white/40 rounded outline-none"
              placeholder="Tier name"
            />
          </div>
        ) : (
          <>
            <div className="text-5xl mb-2">{tier.emoji}</div>
            <div 
              className="text-white font-black text-base cursor-pointer hover:text-white/80 transition text-center"
              onDoubleClick={() => setIsEditing(true)}
              title="Double-click to edit"
            >
              {tier.label}
            </div>
          </>
        )}
      </div>

      <div 
        ref={setNodeRef} 
        className={`flex-1 ${tier.bgColor} ${isOver ? 'ring-4 ring-inset ring-[#E50914]/40 ' + tier.borderColor : ''} p-6 min-h-[180px] transition-all`}
      >
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
// Main Component
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
  const [shareUrl, setShareUrl] = useState('');
  
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  // Load movies from heroes data
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin?callbackUrl=/tier-list/create');
      return;
    }

    const movies: Movie[] = [];
    
    // Load from heroes.json
    heroesData.forEach((hero: any) => {
      hero.movies?.forEach((movie: any) => {
        if (!movies.find(m => m.slug === movie.slug)) {
          movies.push({
            slug: movie.slug,
            title: movie.title,
            year: movie.year,
            poster: movie.poster || `/images/movies/${movie.slug}.jpg`,
            hero: hero.name,
          });
        }
      });
    });

    // If you have upcoming data, uncomment:
    // upcomingData.forEach((movie: any) => {
    //   if (!movies.find(m => m.slug === movie.slug)) {
    //     movies.push({
    //       slug: movie.slug,
    //       title: movie.title,
    //       year: movie.year,
    //       poster: movie.poster,
    //       isUpcoming: true,
    //     });
    //   }
    // });

    setAllMovies(movies);
    setUnrankedMovies(movies);
  }, [status, router]);

  const filteredMovies = unrankedMovies.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.hero?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeSlug = active.id as string;
    const overId = over.id as string;

    if (overId.startsWith('tier-')) {
      const targetTier = overId.replace('tier-', '');
      
      // Remove from source
      setUnrankedMovies(prev => prev.filter(m => m.slug !== activeSlug));
      Object.keys(tiers).forEach(tier => {
        setTiers(prev => ({ ...prev, [tier]: prev[tier].filter(m => m.slug !== activeSlug) }));
      });

      // Add to target tier
      const movie = allMovies.find(m => m.slug === activeSlug);
      if (movie) {
        setTiers(prev => ({ ...prev, [targetTier]: [...prev[targetTier], movie] }));
      }
    } else if (overId === 'unranked') {
      // Move back to unranked
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

  const handleTierLabelChange = (id: string, newLabel: string) => {
    setTierConfigs(prev => prev.map(t => t.id === id ? { ...t, label: newLabel } : t));
  };

  const handleTierEmojiChange = (id: string, newEmoji: string) => {
    setTierConfigs(prev => prev.map(t => t.id === id ? { ...t, emoji: newEmoji } : t));
  };

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
    
    // Move movies back to unranked
    const moviesToReturn = tiers[id] || [];
    setUnrankedMovies(prev => [...prev, ...moviesToReturn]);
    
    // Remove tier
    setTierConfigs(prev => prev.filter(t => t.id !== id));
    setTiers(prev => {
      const newTiers = { ...prev };
      delete newTiers[id];
      return newTiers;
    });
  };

  const toggleSelectMovie = (slug: string) => {
    setSelectedMovies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(slug)) {
        newSet.delete(slug);
      } else {
        newSet.add(slug);
      }
      return newSet;
    });
  };

  const handleBulkAddToTier = (tierId: string) => {
    const moviesToAdd = allMovies.filter(m => selectedMovies.has(m.slug));
    
    // Remove from unranked and other tiers
    setUnrankedMovies(prev => prev.filter(m => !selectedMovies.has(m.slug)));
    Object.keys(tiers).forEach(tier => {
      setTiers(prev => ({ ...prev, [tier]: prev[tier].filter(m => !selectedMovies.has(m.slug)) }));
    });

    // Add to target tier
    setTiers(prev => ({ ...prev, [tierId]: [...prev[tierId], ...moviesToAdd] }));
    setSelectedMovies(new Set());
  };

  const handleClearAll = () => {
    if (!confirm('Clear all tiers? Movies will return to unranked.')) return;
    
    const allRankedMovies: Movie[] = [];
    Object.values(tiers).forEach(tierMovies => {
      allRankedMovies.push(...tierMovies);
    });
    
    setUnrankedMovies(prev => [...prev, ...allRankedMovies]);
    setTiers(Object.keys(tiers).reduce((acc, key) => ({ ...acc, [key]: [] }), {}));
    setSelectedMovies(new Set());
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title for your tier list');
      return;
    }

    if (!session?.user?.id) {
      alert('You must be signed in to save');
      router.push('/signin?callbackUrl=/tier-list/create');
      return;
    }

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

      alert('✅ Tier list saved successfully!');
      router.push(`/tier-list/${result.id}`);
    } catch (error: any) {
      console.error('Error saving:', error);
      alert('Failed to save tier list: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleExportImage = async () => {
    const element = document.getElementById('tier-list-capture');
    if (!element) return;

    try {
      const dataUrl = await toPng(element, { 
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#000000',
      });
      
      const link = document.createElement('a');
      link.download = `${title || 'tier-list'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export image');
    }
  };

  const handleShare = async () => {
    // First save if not saved
    if (!title.trim()) {
      alert('Please save your tier list first');
      return;
    }
    
    await handleSave();
    // After save, show share modal with URL
    // For now just show current URL
    setShareUrl(window.location.origin + '/tier-list/create');
    setShowShareModal(true);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={pointerWithin}>
      <main className="bg-black min-h-screen pb-20">
        {/* NAVIGATION */}
        <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
          <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/tier-list" className="text-white hover:text-[#E50914] transition">
                <FaArrowLeft size={20} />
              </Link>
              <Link href="/" className="text-2xl font-black text-white hover:opacity-80 transition">
                TFI<span className="text-[#E50914]">verse</span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportImage}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition flex items-center gap-2"
              >
                <FaDownload size={14} />
                <span className="hidden md:inline">Export</span>
              </button>
              
              <button
                onClick={handleShare}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition flex items-center gap-2"
              >
                <FaShare size={14} />
                <span className="hidden md:inline">Share</span>
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 rounded-lg bg-[#E50914] hover:bg-[#F40612] text-white font-bold text-sm transition flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? '...' : <><FaSave size={14} /> Save</>}
              </button>
            </div>
          </div>

          {/* Title input */}
          <div className="max-w-[1800px] mx-auto px-4 md:px-8 pb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter tier list title..."
              className="w-full px-6 py-4 text-3xl font-black bg-white/5 border-2 border-white/10 focus:border-[#E50914] rounded-xl text-white placeholder-white/40 outline-none transition"
            />
          </div>
        </nav>

        <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-8">
          {/* Tier List Capture Area */}
          <div id="tier-list-capture" className="space-y-4 mb-8">
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
          </div>

          {/* Add Tier Button */}
          {tierConfigs.length < (DEFAULT_TIER_CONFIGS.length + ADDITIONAL_TIER_CONFIGS.length) && (
            <button
              onClick={handleAddTier}
              className="mb-8 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border-2 border-dashed border-white/30 text-white font-bold transition flex items-center gap-2 mx-auto"
            >
              <FaPlus size={16} />
              Add Tier
            </button>
          )}

          {/* Unranked Movies */}
          <div className="rounded-xl overflow-hidden border-2 border-white/10 bg-white/5 shadow-xl">
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl">📦</div>
                <h3 className="text-white font-black text-xl">UNRANKED MOVIES</h3>
                <span className="text-white/60 text-sm">({unrankedMovies.length})</span>
              </div>
              
              <div className="flex items-center gap-3">
                {selectedMovies.size > 0 && (
                  <>
                    <span className="text-white/80 text-sm font-medium">{selectedMovies.size} selected</span>
                    <div className="flex gap-2">
                      {tierConfigs.map(tier => (
                        <button
                          key={tier.id}
                          onClick={() => handleBulkAddToTier(tier.id)}
                          className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
                          title={`Add to ${tier.label}`}
                        >
                          {tier.emoji}
                        </button>
                      ))}
                    </div>
                  </>
                )}
                
                {Object.values(tiers).some(t => t.length > 0) && (
                  <button
                    onClick={handleClearAll}
                    className="px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 text-red-300 text-sm font-bold transition flex items-center gap-2"
                  >
                    <FaUndo size={12} />
                    Clear All
                  </button>
                )}
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search movies..."
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 outline-none focus:border-[#E50914] transition text-base"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {filteredMovies.map(movie => (
                  <MovieCard
                    key={movie.slug}
                    movie={movie}
                    isSelected={selectedMovies.has(movie.slug)}
                    onToggle={() => toggleSelectMovie(movie.slug)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeId && (() => {
            const movie = allMovies.find(m => m.slug === activeId);
            return movie ? <DraggableMovie movie={movie} /> : null;
          })()}
        </DragOverlay>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl max-w-md w-full p-8 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-white">Share Tier List</h3>
                <button onClick={() => setShowShareModal(false)} className="text-white/60 hover:text-white">
                  <FaTimes size={20} />
                </button>
              </div>
              
              <div className="flex gap-3 mb-6">
                <button className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center justify-center gap-2">
                  <FaTwitter size={18} />
                  Twitter
                </button>
                <button className="flex-1 py-3 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold transition flex items-center justify-center gap-2">
                  <FaFacebook size={18} />
                  Facebook
                </button>
              </div>
              
              <div className="space-y-3">
                <button className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition flex items-center justify-center gap-2">
                  <FaWhatsapp size={18} />
                  WhatsApp
                </button>
                <button className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition flex items-center justify-center gap-2">
                  <FaReddit size={18} />
                  Reddit
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </DndContext>
  );
}

