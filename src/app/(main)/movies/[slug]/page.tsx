import { getMovieDetails } from '@/app/actions/movies';
import { Film, Star, Clock, PlayCircle, Calendar, Plus, Check, MoreHorizontal, Trophy, MessageSquare, Edit3, Image as ImageIcon, Globe, Camera, MessageCircle, ChevronRight, Bookmark, Heart, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const movie = await getMovieDetails(slug);
    if (!movie) return { title: 'Movie Not Found | TFIverse' };
    
    return {
        title: `${movie.title} (${movie.year}) | TFIverse`,
        description: movie.overview || `Details and credits for ${movie.title}`,
    };
}

// Map platform names to branded colors/initials since we don't have official logo images hosted
const getPlatformBrand = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('netflix')) return { bg: 'bg-gradient-to-br from-[#E50914] to-[#B8000A]', color: 'text-white', initial: 'N' };
    if (p.includes('prime')) return { bg: 'bg-gradient-to-br from-[#00A8E1] to-[#007EA8]', color: 'text-white', initial: 'P' };
    if (p.includes('hotstar')) return { bg: 'bg-gradient-to-br from-[#021A5D] to-[#0433BA]', color: 'text-white', initial: 'H' };
    if (p.includes('aha')) return { bg: 'bg-gradient-to-br from-[#FF4D00] to-[#CC3D00]', color: 'text-white', initial: 'aha' };
    if (p.includes('zee5')) return { bg: 'bg-gradient-to-br from-[#8230C6] to-[#5D1F91]', color: 'text-white', initial: 'Z5' };
    if (p.includes('sun')) return { bg: 'bg-gradient-to-br from-[#FFB800] to-[#CC9300]', color: 'text-black', initial: 'S' };
    if (p.includes('sony')) return { bg: 'bg-gradient-to-br from-[#FF0000] to-[#B30000]', color: 'text-white', initial: 'LIV' };
    if (p.includes('bookmy')) return { bg: 'bg-gradient-to-br from-[#F84464] to-[#C93350]', color: 'text-white', initial: 'BMS' };
    return { bg: 'bg-gradient-to-br from-zinc-700 to-zinc-900', color: 'text-white', initial: platform.substring(0, 2).toUpperCase() };
};

export default async function MovieDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const movie = await getMovieDetails(slug);

    if (!movie) {
        return notFound();
    }

    const deduplicateCredits = (creditsArray: any[]) => {
        const seen = new Set();
        return creditsArray.filter(item => {
            if (seen.has(item.person.id)) return false;
            seen.add(item.person.id);
            return true;
        });
    };

    const rawCast = movie.credits.filter(c => c.roleType === 'cast').sort((a, b) => (a.orderIndex || 99) - (b.orderIndex || 99));
    const cast = deduplicateCredits(rawCast).slice(0, 10);
    
    const crew = movie.credits.filter(c => c.roleType === 'crew');
    const director = crew.find(c => c.job === 'Director');
    const writers = deduplicateCredits(crew.filter(c => ['Writer', 'Screenplay', 'Story', 'Dialogue'].includes(c.job || '')));

    const ottLinks = movie.ottLinks || [];
    const streaming = ottLinks.filter(l => !['BookMyShow', 'District by Zomato', 'Cinépolis India', 'PVR Cinemas'].includes(l.platform));
    const theatrical = ottLinks.filter(l => ['BookMyShow', 'District by Zomato', 'Cinépolis India', 'PVR Cinemas'].includes(l.platform));

    const metadata = movie.metadata as any || {};
    const genres = metadata.genres || [];
    const companies = metadata.production_companies || [];
    const languages = metadata.spoken_languages || [];
    const keywords = metadata.keywords?.keywords || metadata.keywords?.results || [];
    const externalIds = metadata.external_ids || {};
    const collection = metadata.belongs_to_collection;
    const productionCountries = metadata.production_countries || [];
    
    const videos = metadata.videos?.results || [];
    const officialTrailer = videos.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube') || videos.find((v: any) => v.site === 'YouTube');

    const formatCurrency = (amount?: number) => {
        if (!amount) return '-';
        if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
        return `$${(amount / 1000000).toFixed(1)}M`;
    };

    return (
        <div className="min-h-screen bg-black text-white pb-32 font-sans selection:bg-amber-500 selection:text-black overflow-x-hidden">
            {/* Cinematic Hero Section - Edge-to-Edge with Deep Blur */}
            <div className="relative w-full h-[85vh] md:h-[95vh] flex items-end justify-center">
                <div className="absolute inset-0 overflow-hidden">
                    {movie.backdropUrl ? (
                        <Image 
                            src={`https://image.tmdb.org/t/p/original${movie.backdropUrl}`}
                            alt={movie.title}
                            fill
                            className="object-cover object-top opacity-50 transform scale-105 blur-[2px]"
                            priority
                        />
                    ) : (
                        <div className="absolute inset-0 bg-zinc-900" />
                    )}
                </div>
                
                {/* Multi-layered Vignette & Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
                <div className="absolute inset-0 bg-black/20 mix-blend-overlay z-10" />
                
                <div className="relative z-20 w-full max-w-[1600px] px-6 md:px-12 lg:px-20 pb-16">
                    <div className="flex flex-col md:flex-row gap-10 md:gap-20 items-end w-full">
                        
                        {/* Ultra-Premium Glass Poster Overlapping */}
                        <div className="shrink-0 w-48 md:w-[340px] aspect-[2/3] relative rounded-3xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,1)] border border-white/10 bg-zinc-900 group transform md:translate-y-12">
                            {movie.posterUrl ? (
                                <Image 
                                    src={`https://image.tmdb.org/t/p/w780${movie.posterUrl}`}
                                    alt={movie.title}
                                    fill
                                    className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                                    priority
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full opacity-20">
                                    <Film className="w-16 h-16" />
                                </div>
                            )}
                            
                            {/* Seamless Trailer Play Overlay */}
                            {officialTrailer && (
                                <a 
                                    href={`https://youtube.com/watch?v=${officialTrailer.key}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-md"
                                >
                                    <div className="w-24 h-24 rounded-full bg-white/10 border border-white/30 flex items-center justify-center backdrop-blur-xl hover:bg-white hover:text-black transition-all transform group-hover:scale-110 duration-500 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                                        <PlayCircle className="w-10 h-10 ml-1" />
                                    </div>
                                </a>
                            )}
                        </div>

                        {/* Title & Action Engine */}
                        <div className="flex-1 pb-4 md:pb-8 w-full">
                            <div className="flex flex-wrap gap-3 mb-6">
                                {genres.map((g: any) => (
                                    <span key={g.id} className="text-[10px] font-black text-white uppercase tracking-[0.25em] border border-white/20 rounded-full px-5 py-2 bg-white/5 backdrop-blur-xl shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                                        {g.name}
                                    </span>
                                ))}
                                {movie.status === 'Post Production' && (
                                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.25em] border border-amber-500/30 rounded-full px-5 py-2 bg-amber-500/10 backdrop-blur-xl shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                                        Coming Soon
                                    </span>
                                )}
                            </div>
                            
                            {/* Epic Title Treatment */}
                            <h1 className="text-6xl md:text-[8rem] font-black tracking-tighter uppercase mb-2 leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 drop-shadow-[0_0_40px_rgba(0,0,0,0.8)] pb-2">
                                {movie.title}
                            </h1>
                            
                            {movie.tagline && (
                                <p className="text-zinc-300 font-medium text-2xl md:text-4xl mb-8 drop-shadow-2xl max-w-4xl tracking-tight leading-tight italic opacity-90">
                                    "{movie.tagline}"
                                </p>
                            )}
                            
                            <div className="flex flex-wrap items-center gap-8 text-sm font-bold text-zinc-300 uppercase tracking-[0.15em] mb-12">
                                {movie.voteAverage > 0 && (
                                    <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 px-4 py-2 rounded-xl border border-yellow-500/30 backdrop-blur-sm shadow-[0_0_20px_rgba(234,179,8,0.1)]">
                                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
                                        <span className="text-xl text-yellow-500">{movie.voteAverage.toFixed(1)}</span>
                                        <span className="text-xs text-yellow-500/60">/ 10</span>
                                    </div>
                                )}
                                {movie.year && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-1 h-1 rounded-full bg-zinc-500" />
                                        <Calendar className="w-5 h-5 text-zinc-400" />
                                        <span className="text-lg text-zinc-200">{movie.year}</span>
                                    </div>
                                )}
                                {movie.runtime ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-1 h-1 rounded-full bg-zinc-500" />
                                        <Clock className="w-5 h-5 text-zinc-400" />
                                        <span className="text-lg text-zinc-200">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                                    </div>
                                ) : null}
                            </div>

                            {/* Ultra Premium Glass Action Bar */}
                            <div className="flex items-center gap-5 flex-wrap">
                                <button className="group flex items-center justify-center gap-3 h-16 px-10 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all bg-white text-black hover:bg-zinc-200 shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95">
                                    <Bookmark className="w-5 h-5 group-hover:fill-black transition-colors" />
                                    Watchlist
                                </button>
                                
                                <div className="flex bg-zinc-900/60 border border-white/10 rounded-2xl p-1.5 backdrop-blur-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                    <button className="flex items-center justify-center w-16 h-14 rounded-xl transition-all text-zinc-400 hover:text-white hover:bg-white/10 active:scale-95 group relative" title="Watched">
                                        <Check className="w-6 h-6 group-hover:text-green-500 transition-colors" />
                                        <span className="absolute -bottom-10 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black uppercase tracking-widest text-green-500">Seen</span>
                                    </button>
                                    <div className="w-px h-8 bg-white/10 my-auto mx-1" />
                                    <button className="flex items-center justify-center w-16 h-14 rounded-xl transition-all text-zinc-400 hover:text-white hover:bg-white/10 active:scale-95 group relative" title="Rate">
                                        <Star className="w-6 h-6 group-hover:text-yellow-500 group-hover:fill-yellow-500 transition-colors" />
                                        <span className="absolute -bottom-10 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black uppercase tracking-widest text-yellow-500">Rate</span>
                                    </button>
                                    <div className="w-px h-8 bg-white/10 my-auto mx-1" />
                                    <button className="flex items-center justify-center w-16 h-14 rounded-xl transition-all text-zinc-400 hover:text-white hover:bg-white/10 active:scale-95 group relative" title="Write Review">
                                        <Edit3 className="w-6 h-6 group-hover:text-purple-400 transition-colors" />
                                        <span className="absolute -bottom-10 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black uppercase tracking-widest text-purple-400">Review</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expansive Main Layout */}
            <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 mt-20 grid grid-cols-1 xl:grid-cols-12 gap-16 relative">
                
                {/* Left Column (Main Content) - Broader */}
                <div className="xl:col-span-8 space-y-24">
                    
                    {/* Premium App-Style OTT Hub */}
                    {(streaming.length > 0 || theatrical.length > 0) && (
                        <section>
                            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-8 flex items-center gap-6">
                                Streaming On <div className="flex-1 h-px bg-gradient-to-r from-zinc-800 to-transparent" />
                            </h2>
                            <div className="flex flex-wrap gap-8">
                                {streaming.map(link => {
                                    const brand = getPlatformBrand(link.platform);
                                    return (
                                        <a key={link.id} href={link.url || '#'} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-4 w-24">
                                            <div className={`w-20 h-20 rounded-[1.5rem] ${brand.bg} flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all duration-500 border border-white/5`}>
                                                <span className={`font-black ${brand.color} tracking-tighter ${brand.initial.length > 2 ? 'text-sm' : 'text-3xl'}`}>
                                                    {brand.initial}
                                                </span>
                                            </div>
                                            <span className="text-[11px] font-bold text-zinc-400 uppercase text-center line-clamp-1 group-hover:text-white transition-colors tracking-widest w-full">
                                                {link.platform}
                                            </span>
                                        </a>
                                    );
                                })}
                                {theatrical.map(link => {
                                    const brand = getPlatformBrand(link.platform);
                                    return (
                                        <a key={link.id} href={link.url || '#'} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-4 w-24">
                                            <div className={`w-20 h-20 rounded-[1.5rem] ${brand.bg} flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(248,68,100,0.4)] transition-all duration-500 border border-white/5`}>
                                                <span className={`font-black ${brand.color} tracking-tighter text-sm`}>
                                                    {brand.initial}
                                                </span>
                                            </div>
                                            <span className="text-[11px] font-bold text-zinc-400 uppercase text-center line-clamp-1 group-hover:text-amber-500 transition-colors tracking-widest w-full">
                                                Tickets
                                            </span>
                                        </a>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Premium Editorial Synopsis */}
                    <section className="relative pl-8 md:pl-12">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-500 via-amber-700 to-transparent rounded-r-full" />
                        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-6">The Story</h2>
                        <p className="text-zinc-200 leading-[2] text-xl md:text-[1.75rem] font-medium max-w-4xl tracking-tight">
                            {movie.overview || 'The plot is currently being kept under wraps. Be the first to contribute!'}
                        </p>
                    </section>

                    {/* Cinematic Cast Cards */}
                    <section className="relative">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-6 w-full">
                                Starring <div className="flex-1 h-px bg-gradient-to-r from-zinc-800 to-transparent" />
                            </h2>
                            <button className="shrink-0 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-white hover:text-amber-500 transition-colors ml-4 bg-zinc-900/80 px-4 py-2 rounded-full border border-white/10 hover:border-amber-500/50">
                                Full Cast & Crew <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <div className="flex overflow-x-auto gap-6 pb-12 snap-x scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                            {cast.map(c => (
                                <Link href={`/profile/${c.person.slug}`} key={c.person.id} className="shrink-0 w-[180px] group snap-start relative">
                                    <div className="w-[180px] aspect-[2/3] rounded-[2rem] overflow-hidden bg-zinc-900 border border-white/5 mb-5 group-hover:border-white/30 group-hover:-translate-y-4 transition-all duration-500 relative shadow-xl group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                                        {(c.person.metadata as any)?.profile_path ? (
                                            <Image 
                                                src={`https://image.tmdb.org/t/p/w500${(c.person.metadata as any).profile_path}`}
                                                alt={c.person.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-5xl font-black text-zinc-800 bg-zinc-900/50">
                                                {c.person.name.charAt(0)}
                                            </div>
                                        )}
                                        {/* Epic Bottom Fade for Text */}
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                                        
                                        <div className="absolute bottom-6 left-6 right-6">
                                            <h3 className="font-black text-lg text-white uppercase tracking-wider line-clamp-2 leading-tight drop-shadow-md">
                                                {c.person.name}
                                            </h3>
                                        </div>
                                    </div>
                                    <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.15em] line-clamp-2 px-2">
                                        {c.character}
                                    </p>
                                </Link>
                            ))}
                            {/* Fade out edge effect */}
                            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent pointer-events-none hidden md:block" />
                        </div>
                    </section>

                    {/* Highly Polished TFIverse Community Sections */}
                    <section className="bg-zinc-900/20 rounded-[3rem] p-8 md:p-14 border border-white/5 backdrop-blur-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                        
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-16 flex items-center gap-4 relative z-10">
                            The Hub <span className="text-zinc-600 text-sm font-bold tracking-[0.3em] uppercase">Community</span>
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                            
                            {/* Member Reviews */}
                            <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 rounded-[2rem] p-8 border border-white/10 hover:border-white/30 transition-all duration-500 cursor-pointer group flex flex-col justify-between h-[300px] shadow-2xl hover:shadow-[0_0_50px_rgba(255,255,255,0.05)] hover:-translate-y-2">
                                <div>
                                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:bg-white group-hover:text-black transition-all">
                                        <MessageSquare className="w-6 h-6 text-white group-hover:text-black transition-colors" />
                                    </div>
                                    <h3 className="font-black text-2xl uppercase tracking-widest mb-4">Fan Reviews</h3>
                                    <p className="text-zinc-400 text-sm font-medium leading-[1.8]">Read raw, unfiltered thoughts from hardcore TFI fans.</p>
                                </div>
                                <div className="flex items-center gap-3 text-[11px] font-black text-white uppercase tracking-[0.2em] opacity-50 group-hover:opacity-100 transition-opacity">
                                    0 Written <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>

                            {/* Awards Module */}
                            <div className="bg-gradient-to-br from-yellow-900/40 to-zinc-900/80 rounded-[2rem] p-8 border border-yellow-500/20 hover:border-yellow-500/60 transition-all duration-500 cursor-pointer group flex flex-col justify-between h-[300px] shadow-2xl hover:shadow-[0_0_50px_rgba(234,179,8,0.1)] hover:-translate-y-2">
                                <div>
                                    <div className="w-14 h-14 bg-yellow-500/20 rounded-2xl flex items-center justify-center mb-8 border border-yellow-500/30 group-hover:bg-yellow-500 transition-all">
                                        <Trophy className="w-6 h-6 text-yellow-500 group-hover:text-black transition-colors" />
                                    </div>
                                    <h3 className="font-black text-2xl uppercase tracking-widest mb-4 text-yellow-500">Awards</h3>
                                    <p className="text-zinc-400 text-sm font-medium leading-[1.8]">View community-voted honors and industry recognitions.</p>
                                </div>
                                <div className="flex items-center gap-3 text-[11px] font-black text-yellow-500 uppercase tracking-[0.2em] opacity-70 group-hover:opacity-100 transition-opacity">
                                    Nominations <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>

                            {/* Memes & Edits */}
                            <div className="bg-gradient-to-br from-purple-900/40 to-zinc-900/80 rounded-[2rem] p-8 border border-purple-500/20 hover:border-purple-500/60 transition-all duration-500 cursor-pointer group flex flex-col justify-between h-[300px] shadow-2xl hover:shadow-[0_0_50px_rgba(168,85,247,0.1)] hover:-translate-y-2">
                                <div>
                                    <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-8 border border-purple-500/30 group-hover:bg-purple-500 transition-all">
                                        <ImageIcon className="w-6 h-6 text-purple-400 group-hover:text-black transition-colors" />
                                    </div>
                                    <h3 className="font-black text-2xl uppercase tracking-widest mb-4 text-purple-400">Memes</h3>
                                    <p className="text-zinc-400 text-sm font-medium leading-[1.8]">The ultimate collection of fan-made art and viral edits.</p>
                                </div>
                                <div className="flex items-center gap-3 text-[11px] font-black text-purple-400 uppercase tracking-[0.2em] opacity-70 group-hover:opacity-100 transition-opacity">
                                    Gallery <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column (Data Sheet) */}
                <div className="xl:col-span-4 space-y-8">
                    <div className="bg-gradient-to-b from-zinc-900/80 to-zinc-900/30 rounded-[3rem] p-10 border border-white/10 backdrop-blur-3xl sticky top-8 shadow-[0_0_60px_rgba(0,0,0,0.5)]">
                        
                        {/* Links Row */}
                        <div className="flex justify-between items-center pb-10 mb-10 border-b border-white/5">
                            <h3 className="font-black uppercase tracking-[0.3em] text-white/40 text-[10px]">
                                Official Links
                            </h3>
                            <div className="flex gap-4">
                                {externalIds.imdb_id && (
                                    <a href={`https://www.imdb.com/title/${externalIds.imdb_id}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black hover:scale-110 transition-all duration-300" title="IMDB">
                                        <Film className="w-5 h-5" />
                                    </a>
                                )}
                                {externalIds.instagram_id && (
                                    <a href={`https://instagram.com/${externalIds.instagram_id}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black hover:scale-110 transition-all duration-300" title="Instagram">
                                        <Camera className="w-5 h-5" />
                                    </a>
                                )}
                                {externalIds.twitter_id && (
                                    <a href={`https://twitter.com/${externalIds.twitter_id}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black hover:scale-110 transition-all duration-300" title="Twitter">
                                        <MessageCircle className="w-5 h-5" />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="space-y-10">
                            
                            <div>
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-3">Original Title</p>
                                <p className="text-white font-black text-lg tracking-widest">{movie.originalTitle || movie.title}</p>
                            </div>

                            {director && (
                                <div>
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-3">Director</p>
                                    <Link href={`/profile/${director.person.slug}`} className="inline-block text-amber-500 hover:text-amber-400 font-black text-lg tracking-widest transition-colors">
                                        {director.person.name}
                                    </Link>
                                </div>
                            )}

                            {writers.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-3">Writers</p>
                                    <div className="flex flex-col gap-3">
                                        {writers.slice(0, 3).map((w: any) => (
                                            <Link key={w.person.id} href={`/profile/${w.person.slug}`} className="group flex justify-between items-center text-white hover:text-amber-500 transition-colors">
                                                <span className="font-bold text-sm tracking-widest">{w.person.name}</span>
                                                <span className="text-zinc-600 text-[10px] uppercase font-black tracking-widest group-hover:text-amber-500/50">{w.job}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-8 p-6 bg-black/40 rounded-3xl border border-white/5">
                                <div>
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-2">Budget</p>
                                    <p className="text-white font-black text-lg tracking-widest">
                                        {formatCurrency(movie.budget || 0)}
                                    </p>
                                </div>
                                
                                <div>
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-2">Revenue</p>
                                    <p className="text-green-500 font-black text-lg tracking-widest drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                                        {formatCurrency(movie.revenue || 0)}
                                    </p>
                                </div>
                            </div>

                            {productionCountries.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-3">Origin</p>
                                    <p className="text-zinc-300 font-bold text-sm tracking-[0.2em] uppercase">
                                        {productionCountries.map((c: any) => c.name).join(', ')}
                                    </p>
                                </div>
                            )}

                            {languages.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-3">Audio</p>
                                    <p className="text-zinc-300 font-bold text-sm tracking-[0.2em] uppercase">
                                        {languages.map((l: any) => l.english_name || l.name).join(', ')}
                                    </p>
                                </div>
                            )}

                            {companies.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-3">Production</p>
                                    <p className="text-zinc-400 font-medium text-sm leading-relaxed tracking-wide">
                                        {companies.map((c: any) => c.name).join(' • ')}
                                    </p>
                                </div>
                            )}

                            {keywords.length > 0 && (
                                <div className="pt-8 border-t border-white/5">
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-5">Keywords</p>
                                    <div className="flex flex-wrap gap-2.5">
                                        {keywords.slice(0, 15).map((k: any) => (
                                            <span key={k.id} className="text-[10px] font-bold text-zinc-400 bg-white/5 px-4 py-2 rounded-xl border border-white/5 uppercase tracking-widest hover:bg-white hover:text-black transition-colors cursor-pointer">
                                                {k.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="pt-8 border-t border-white/5">
                                <button className="w-full flex items-center justify-center gap-3 h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all bg-white/5 text-zinc-300 border border-white/10 hover:bg-white hover:text-black hover:scale-[1.02] active:scale-[0.98] shadow-xl">
                                    <Edit3 className="w-4 h-4" />
                                    Suggest Edits
                                </button>
                                <p className="text-center text-[10px] font-black text-amber-500/70 mt-5 uppercase tracking-[0.3em]">
                                    Earn +50 points
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
