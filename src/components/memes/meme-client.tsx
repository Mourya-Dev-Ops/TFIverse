"use client";

import { useState, useEffect, useMemo, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, Plus, Flame, Clock, Trophy, Heart, MessageCircle, 
  Share2, Download, User, X, Check, Image as ImageIcon, Loader2, 
  ChevronRight, Sparkles, TrendingUp, Info
} from "lucide-react";
import Link from "next/link";
import { getMemes, toggleLikeMeme, trackMemeView, getMemeOfTheWeek, getUploadUrl } from "@/app/actions/memes";
import toast from "react-hot-toast";

type Meme = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  likes: number;
  views: number;
  heroTags: string[];
  movieTags: string[];
  createdAt: Date | null;
  userId: string;
};

interface MemeClientProps {
  initialMemes: Meme[];
  featuredMeme?: Meme | null;
  isAuthenticated: boolean;
  user?: any;
}

export default function MemeClient({ initialMemes, featuredMeme, isAuthenticated, user }: MemeClientProps) {
  const [memes, setMemes] = useState<Meme[]>(initialMemes);
  const [sort, setSort] = useState<"new" | "trending" | "top">("new");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);

  useEffect(() => {
    const fetchMemes = async () => {
      setLoading(true);
      try {
        const data = await getMemes({ sort, search });
        setMemes(data as any);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      if (search !== "") fetchMemes();
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchMemes = async () => {
      setLoading(true);
      const data = await getMemes({ sort, search });
      setMemes(data as any);
      setLoading(false);
    };
    fetchMemes();
  }, [sort]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      
      {/* ══════ HERO SECTION ══════ */}
      <section className="relative pt-32 pb-20 px-6 md:px-10 lg:px-16 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12 relative z-10">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-px w-8 bg-white/20" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">The Culture Hub</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] mb-8">
                MEME <br /><span className="text-white/20">PORTAL</span>
              </h1>
              <p className="text-white/40 text-sm md:text-base leading-relaxed tracking-wide max-w-lg">
                The TFIverse through the lens of pure entertainment. 
                Higher quality, lower fluff, total control.
              </p>
            </div>

            <div className="flex flex-col items-end gap-6 w-full md:w-auto">
              {featuredMeme && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-premium rounded-2xl p-4 flex items-center gap-4 group cursor-pointer hover:border-white/30 transition-all"
                  onClick={() => setSelectedMeme(featuredMeme)}
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10">
                    <img src={featuredMeme.imageUrl} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <Trophy size={10} className="text-amber-500" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-amber-500/80">Meme of the Week</span>
                    </div>
                    <p className="text-xs font-bold text-white/80 line-clamp-1">{featuredMeme.title}</p>
                  </div>
                  <ChevronRight size={16} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </motion.div>
              )}

              <button 
                onClick={() => isAuthenticated ? setShowUpload(true) : toast.error("Authenticate to contribute")}
                className="w-full md:w-auto px-8 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white/90 transition-all active:scale-95 shadow-[0_20px_60px_rgba(255,255,255,0.1)]"
              >
                <Plus size={18} strokeWidth={3} /> Post Meme
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ FILTER BAR ══════ */}
      <section className="sticky top-16 z-40 bg-black/80 backdrop-blur-xl border-y border-white/[0.06] px-6 md:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto py-4 flex flex-col md:flex-row gap-6 items-center">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by actor, movie, or legend..."
              className="w-full bg-transparent pl-14 pr-6 py-2 outline-none text-sm font-medium placeholder:text-white/20"
            />
          </div>

          <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl">
            <FilterBtn active={sort === "new"} onClick={() => setSort("new")} icon={<Clock size={12} />} label="New" />
            <FilterBtn active={sort === "trending"} onClick={() => setSort("trending")} icon={<Flame size={12} />} label="Trending" />
            <FilterBtn active={sort === "top"} onClick={() => setSort("top")} icon={<Trophy size={12} />} label="Top" />
          </div>
        </div>
      </section>

      {/* ══════ MASONRY GALLERY ══════ */}
      <section className="px-6 md:px-10 lg:px-16 pt-12 pb-32">
        <div className="max-w-7xl mx-auto">
          {loading && memes.length === 0 ? (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="w-full aspect-[3/4] bg-white/[0.03] animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : memes.length === 0 ? (
            <div className="py-32 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mb-6 opacity-20">
                <ImageIcon size={24} />
              </div>
              <p className="text-white/20 text-sm font-bold uppercase tracking-widest">No visual artifacts found in this timeline</p>
            </div>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {memes.map((meme) => (
                <MemeCard key={meme.id} meme={meme} isAuthenticated={isAuthenticated} onClick={() => setSelectedMeme(meme)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════ MODALS ══════ */}
      <AnimatePresence>
        {showUpload && <MemeUploadModal onClose={() => setShowUpload(false)} />}
        {selectedMeme && <MemeDetailsModal meme={selectedMeme} onClose={() => setSelectedMeme(null)} isAuthenticated={isAuthenticated} currentUser={user} />}
      </AnimatePresence>
    </div>
  );
}

function FilterBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${active ? 'bg-white text-black shadow-lg' : 'text-white/30 hover:text-white/60'}`}
    >
      {icon} {label}
    </button>
  );
}

const MemeCard = memo(function MemeCard({ meme, isAuthenticated, onClick }: { meme: Meme; isAuthenticated: boolean; onClick: () => void }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(meme.likes);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return toast.error("Sign in to engage");
    try {
      const result = await toggleLikeMeme(meme.id);
      setLiked(result.liked);
      setLikes(prev => result.liked ? prev + 1 : prev - 1);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={onClick}
      className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-zoom-in glass-premium"
    >
      <img 
        src={meme.imageUrl} 
        alt={meme.title} 
        className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105"
        loading="lazy"
      />
      
      {/* Soft Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 p-5 flex flex-col justify-end pointer-events-none">
        <h3 className="text-white font-bold text-sm mb-1 leading-tight">{meme.title}</h3>
        
        <div className="flex items-center justify-between pointer-events-auto mt-4">
          <div className="flex items-center gap-4">
            <motion.button 
              whileTap={{ scale: 0.8 }}
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-[10px] font-bold transition-all ${liked ? 'text-red-500' : 'text-white'}`}
            >
              <Heart size={14} className={liked ? "fill-current" : ""} /> {likes}
            </motion.button>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/50">
              <MessageCircle size={14} /> 0
            </div>
          </div>
          <Share2 size={12} className="text-white/40" />
        </div>
      </div>
    </motion.div>
  );
});

function MemeDetailsModal({ meme, onClose, isAuthenticated, currentUser }: { meme: Meme & any; onClose: () => void; isAuthenticated: boolean; currentUser: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(meme.title);
  const [editDesc, setEditDesc] = useState(meme.description || "");

  useEffect(() => {
    trackMemeView(meme.id);
  }, [meme.id]);

  const handleDelete = async () => {
    if (!confirm("Delete this artifact?")) return;
    try {
      const { deleteMeme } = await import("@/app/actions/memes");
      await deleteMeme(meme.id);
      toast.success("Artifact deleted");
      onClose();
      // Optionally trigger a refresh of the memes list
      window.location.reload();
    } catch (e: any) {
      toast.error(e.message || "Delete failed");
    }
  };

  const handleEdit = async () => {
    try {
      const { editMeme } = await import("@/app/actions/memes");
      await editMeme(meme.id, { title: editTitle, description: editDesc });
      toast.success("Artifact updated");
      meme.title = editTitle;
      meme.description = editDesc;
      setIsEditing(false);
    } catch (e: any) {
      toast.error(e.message || "Update failed");
    }
  };

  const isOwner = currentUser?.id === meme.userId;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose} />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-6xl h-full max-h-[85vh] glass-premium rounded-[32px] overflow-hidden flex flex-col md:flex-row"
      >
        <button onClick={onClose} className="absolute top-6 right-6 z-10 p-2 bg-black/50 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all"><X size={24} /></button>

        {/* Media Side */}
        <div className="flex-[1.5] bg-black flex items-center justify-center overflow-hidden border-r border-white/5 p-4">
          <img src={meme.imageUrl} className="max-w-full max-h-full object-contain shadow-2xl" alt="" />
        </div>

        {/* Interaction Side */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-between overflow-y-auto scrollbar-hide">
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Link href={`/u/${meme.user?.profile?.username || ''}`} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                  {meme.user?.profile?.avatarUrl ? <img src={meme.user.profile.avatarUrl} className="w-full h-full object-cover" /> : <User size={20} className="text-white/20" />}
                </Link>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-white/40">Intel Source</p>
                  <Link href={`/u/${meme.user?.profile?.username || ''}`} className="text-sm font-bold text-white/80 hover:text-white transition">
                    {meme.user?.profile?.username || 'Agent Alpha'}
                  </Link>
                </div>
              </div>
              
              {isOwner && (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditing(!isEditing)} className="text-[10px] font-bold uppercase text-white/50 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg">Edit</button>
                  <button onClick={handleDelete} className="text-[10px] font-bold uppercase text-red-500/50 hover:text-red-500 border border-red-500/10 px-3 py-1.5 rounded-lg">Delete</button>
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4 mb-8">
                <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none" />
                <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none" />
                <button onClick={handleEdit} className="w-full py-3 bg-white text-black font-bold uppercase text-xs rounded-lg">Save Changes</button>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-black tracking-tight mb-4 leading-tight">{meme.title}</h2>
                <p className="text-white/40 text-sm leading-relaxed mb-8 tracking-wide">{meme.description || "The timeline provides no further context for this artifact."}</p>
              </>
            )}

            <div className="flex flex-wrap gap-2 mb-12">
              {meme.heroTags?.map((tag: string) => <span key={tag} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-white/40">#{tag}</span>)}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between pb-6 border-b border-white/5">
              <div className="flex gap-8">
                <div className="text-center">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">Impact</p>
                  <p className="text-lg font-bold flex items-center gap-1.5"><Heart size={16} /> {meme.likes}</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">Signals</p>
                  <p className="text-lg font-bold flex items-center gap-1.5"><TrendingUp size={16} /> {meme.views}</p>
                </div>
              </div>
              <button className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10"><Download size={20} /></button>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/90 transition-all active:scale-95">Upvote Artifact</button>
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: meme.title, text: meme.description || "", url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied to clipboard");
                  }
                }}
                className="px-6 py-4 glass-premium hover:bg-white/10 rounded-2xl transition-all text-white/60"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function MemeUploadModal({ onClose }: { onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleUpload = async () => {
    if (!file || !title) return toast.error("Essential data missing");
    setLoading(true);
    try {
      const fileName = `meme-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const { signedUrl, publicUrl } = await getUploadUrl(fileName, file.type);
      
      const res = await fetch(signedUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      if (!res.ok) throw new Error("Link failed");

      const { createMeme } = await import("@/app/actions/memes");
      await createMeme({ title, description, imageUrl: publicUrl });

      toast.success("Artifact deployed successfully");
      onClose();
    } catch (e) {
      console.error(e);
      toast.error("Transmission intercepted");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-xl glass-premium rounded-[32px] p-8 md:p-10 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Deploy <span className="text-white/20">Artifact</span></h2>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mt-1">Direct to TFIverse Grid</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white/20 hover:text-white transition-all"><X size={20} /></button>
        </div>

        <div className="space-y-8">
          {!preview ? (
            <label className="block aspect-video border-2 border-dashed border-white/[0.05] rounded-[24px] hover:border-white/20 hover:bg-white/[0.01] transition-all cursor-pointer group">
              <input type="file" className="hidden" accept="image/*" onChange={onFileChange} />
              <div className="h-full flex flex-col items-center justify-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/[0.03] flex items-center justify-center group-hover:scale-110 transition-transform"><Plus size={24} className="text-white/20" /></div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Select Visual Asset</p>
              </div>
            </label>
          ) : (
            <div className="relative aspect-video rounded-[24px] overflow-hidden group border border-white/10">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <button onClick={() => { setFile(null); setPreview(null); }} className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition"><X size={16} /></button>
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Code Name (Title)</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Vintage Prabhas Intensity" className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-5 py-4 outline-none focus:border-white/30 transition-all text-sm font-medium" />
            </div>
            
            <div className="space-y-2">
              <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Field Notes (Description)</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add historical context..." rows={2} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-5 py-4 outline-none focus:border-white/30 transition-all text-sm font-medium resize-none" />
            </div>
          </div>

          <button onClick={handleUpload} disabled={loading || !file || !title} className="w-full py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_15px_40px_rgba(255,255,255,0.1)] hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-30 flex items-center justify-center gap-4">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Transmitting...</> : <><Sparkles size={16} /> Deploy Artifact</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
