import { getMovieDetails } from '@/app/actions/movies';
import { Film, Star, Clock, PlayCircle, Calendar, Plus, Check, MoreHorizontal, Trophy, MessageSquare, Edit3, Image as ImageIcon, Globe, Camera, MessageCircle, ChevronRight, Bookmark, Heart, ThumbsUp, Sparkles, ExternalLink, Link2, Users, Music, Video, LayoutGrid } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CastModal } from './components/CastModal';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const movie = await getMovieDetails(slug);
    if (!movie) return { title: 'Movie Not Found | TFIverse' };
    
    return {
        title: `${movie.title} (${movie.year}) | TFIverse`,
        description: movie.overview || `Details and credits for ${movie.title}`,
    };
}

// Map platform names to real TMDB provider logo URLs (verified from /watch/providers/movie API)
const getPlatformBrand = (platform: string) => {
    const p = platform.toLowerCase();
    const tmdb = (path: string) => `https://image.tmdb.org/t/p/w185${path}`;
    if (p.includes('netflix')) return { logo: tmdb('/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg'), name: 'Netflix' };
    if (p.includes('prime') || p.includes('amazon')) return { logo: tmdb('/pvske1MyAoymrs5bguRfVqYiM9a.jpg'), name: 'Prime Video' };
    if (p.includes('hotstar') || p.includes('jiohotstar') || p.includes('disney')) return { logo: tmdb('/kVqjgpcwvDJOhCupjcLzwwtOp52.jpg'), name: 'JioHotstar' };
    if (p === 'aha' || p.includes('aha')) return { logo: tmdb('/8WerMI8XcZXqPpkHTZNtzMzousF.jpg'), name: 'Aha' };
    if (p.includes('zee5')) return { logo: tmdb('/gP67NRy1ShUJilrzMsbOmEmdmcv.jpg'), name: 'ZEE5' };
    if (p.includes('sun')) return { logo: tmdb('/6KEQzITx2RrCAQt5Nw9WrL1OI8z.jpg'), name: 'Sun NXT' };
    if (p.includes('sony')) return { logo: tmdb('/3973zlBbBXdXxaWqRWzGG2GYxbT.jpg'), name: 'Sony LIV' };
    if (p.includes('jio') && !p.includes('hotstar')) return { logo: tmdb('/kVqjgpcwvDJOhCupjcLzwwtOp52.jpg'), name: 'JioCinema' };
    if (p.includes('apple')) return { logo: tmdb('/mcbz1LgtErU9p4UdbZ0rG6RTWHX.jpg'), name: 'Apple TV' };
    if (p.includes('youtube')) return { logo: tmdb('/pTnn5JwWr4p3pG8H6VrpiQo7Vs0.jpg'), name: 'YouTube' };
    if (p.includes('google play')) return { logo: tmdb('/8z7rC8uIDaTM91X0ZfkRf04ydj2.jpg'), name: 'Google Play' };
    if (p.includes('mx player') || p === 'mx player') return { logo: tmdb('/ayHY6wKxvCKj2PU8eRPFxnPc6B0.jpg'), name: 'MX Player' };
    if (p.includes('voot')) return { logo: tmdb('/kVqjgpcwvDJOhCupjcLzwwtOp52.jpg'), name: 'Voot' };
    if (p.includes('bookmy') || p.includes('bookmyshow')) return { logo: tmdb('/hAKPOEwWdjE9evzxByVdF8QUMH3.jpg'), name: 'BookMyShow' };
    if (p.includes('hoichoi')) return { logo: tmdb('/u7dwMceEbjxd1N3TLEUBILSK2x6.jpg'), name: 'Hoichoi' };
    if (p.includes('vi movies')) return { logo: tmdb('/9YJY5OwsIPMoX3xC3TdtZVbKBpE.jpg'), name: 'Vi Movies' };
    if (p.includes('mubi')) return { logo: tmdb('/x570VpH2C9EKDf1riP83rYc5dnL.jpg'), name: 'MUBI' };
    if (p.includes('discovery')) return { logo: tmdb('/eMTnWwNVtThkjvQA6zwxaoJG9NE.jpg'), name: 'Discovery+' };
    if (p.includes('lionsgate')) return { logo: tmdb('/e2hCUg2Z3sJ6yWF9NLU24SIKeWa.jpg'), name: 'Lionsgate Play' };
    if (p.includes('tubi')) return { logo: tmdb('/zLYr7OPvpskMA4S79E3vlCi71iC.jpg'), name: 'Tubi TV' };
    if (p.includes('hungama')) return { logo: tmdb('/pMTVKAUyjMb0xdMnHqfNj73MGH6.jpg'), name: 'Hungama Play' };
    if (p.includes('crunchyroll')) return { logo: tmdb('/fzN5Jok5Ig1eJ7gyNGoMhnLSCfh.jpg'), name: 'Crunchyroll' };
    if (p.includes('plex')) return { logo: tmdb('/vLZKlXUNDcZR7ilvfY9Wr9k80FZ.jpg'), name: 'Plex' };
    if (p.includes('shemaroo')) return { logo: tmdb('/ec3kgfQ6YXbT3AFRh8bkQZQFLb2.jpg'), name: 'ShemarooMe' };
    if (p.includes('epic')) return { logo: tmdb('/ymlo2k6RlX0zF5Te1AYwXRQ7Pra.jpg'), name: 'EPIC ON' };
    if (p.includes('tata')) return { logo: tmdb('/5VLMQDq6LWfftQCl7sYrtTseXRA.jpg'), name: 'Tata Play' };
    if (p.includes('manorama')) return { logo: tmdb('/tFkqZYsDhNe6hJCx50Aw6oma24w.jpg'), name: 'ManoramaMax' };
    if (p.includes('curiosity')) return { logo: tmdb('/oR1aNm1Qu9jQBkW4VrGPWhqbC3P.jpg'), name: 'Curiosity Stream' };
    if (p.includes('docsville')) return { logo: tmdb('/5zqbck5mo8PuVbGu2ngBUdn5Yga.jpg'), name: 'DocuBay' };
    if (p.includes('ticketnew') || p.includes('ticket new')) return { logo: tmdb('/hAKPOEwWdjE9evzxByVdF8QUMH3.jpg'), name: 'TicketNew' };
    if (p.includes('district')) return { logo: '', name: 'District', fallbackBg: 'bg-[#E23744]', fallbackText: 'DIS' };
    if (p.includes('cinépolis') || p.includes('cinepolis')) return { logo: '', name: 'Cinépolis', fallbackBg: 'bg-[#1a1a6c]', fallbackText: 'CIN' };
    if (p.includes('pvr')) return { logo: '', name: 'PVR INOX', fallbackBg: 'bg-[#FFD700]', fallbackText: 'PVR' };
    // Fallback
    return { logo: '', name: platform, fallbackBg: 'bg-zinc-800', fallbackText: platform.substring(0, 3).toUpperCase() };
};

export default async function MovieDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const movie = await getMovieDetails(slug);

    if (!movie) {
        return notFound();
    }

    // --- DATA EXTRACTION & DEDUPLICATION ---
    const deduplicateCredits = (creditsArray: any[]) => {
        const seen = new Set();
        return creditsArray.filter(item => {
            if (seen.has(item.person.id)) return false;
            seen.add(item.person.id);
            return true;
        });
    };

    const rawCast = movie.credits.filter(c => c.roleType === 'cast').sort((a, b) => (a.orderIndex || 99) - (b.orderIndex || 99));
    const cast = deduplicateCredits(rawCast);
    
    const crew = movie.credits.filter(c => c.roleType === 'crew');
    const director = crew.find(c => c.job === 'Director');
    const writers = deduplicateCredits(crew.filter(c => ['Writer', 'Screenplay', 'Story', 'Dialogue', 'Lyricist'].includes(c.job || '')));
    const musicDirectors = deduplicateCredits(crew.filter(c => ['Original Music Composer', 'Music', 'Music Director'].includes(c.job || '')));
    const cinematographers = deduplicateCredits(crew.filter(c => ['Director of Photography', 'Cinematography'].includes(c.job || '')));
    const editors = deduplicateCredits(crew.filter(c => c.job === 'Editor'));
    const producers = deduplicateCredits(crew.filter(c => ['Producer', 'Executive Producer', 'Co-Producer', 'Line Producer'].includes(c.job || '')));

    // Extended crew from raw metadata (these roles aren't stored in DB)
    const rawCrew = (movie.metadata as any)?.credits?.crew || [];
    const dedupeRaw = (arr: any[]) => { const seen = new Set(); return arr.filter(c => { if (seen.has(c.id)) return false; seen.add(c.id); return true; }); };
    const artDept = dedupeRaw(rawCrew.filter((c: any) => ['Production Design', 'Art Direction'].includes(c.job)));
    const stunts = dedupeRaw(rawCrew.filter((c: any) => ['Stunt Coordinator', 'Fight Choreographer'].includes(c.job)));
    const costumes = dedupeRaw(rawCrew.filter((c: any) => c.job === 'Costume Design'));
    const choreographers = dedupeRaw(rawCrew.filter((c: any) => c.job === 'Choreographer'));

    const ottLinks = movie.ottLinks || [];
    const streaming = ottLinks.filter(l => !['BookMyShow', 'District by Zomato', 'Cinépolis India', 'PVR Cinemas'].includes(l.platform));
    const theatrical = ottLinks.filter(l => ['BookMyShow', 'District by Zomato', 'Cinépolis India', 'PVR Cinemas'].includes(l.platform));

    const metadata = movie.metadata as any || {};
    const genres = metadata.genres || [];
    const keywords = metadata.keywords?.keywords || metadata.keywords?.results || [];
    const externalIds = metadata.external_ids || {};
    
    const collection = metadata.belongs_to_collection;
    const productionCountries = metadata.production_countries || [];
    const companies = metadata.production_companies || [];
    const isIndian = productionCountries.some((c: any) => c.iso_3166_1 === 'IN');
    const homepage = metadata.homepage;
    const voteCount = movie.voteCount || metadata.vote_count || 0;
    const popularityScore = movie.popularity || metadata.popularity || 0;
    
    // Media Extraction
    const videos = metadata.videos?.results || [];
    const officialTrailer = videos.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube') || videos.find((v: any) => v.site === 'YouTube');
    const allTrailers = videos.filter((v: any) => v.site === 'YouTube');
    
    const posters = metadata.images?.posters || [];
    const backdrops = metadata.images?.backdrops || [];
    const logos = metadata.images?.logos || [];
    
    // Release Dates & Certification
    const releaseDates = metadata.release_dates?.results || [];
    const indiaRelease = releaseDates.find((r: any) => r.iso_3166_1 === 'IN');
    const certification = indiaRelease?.release_dates?.[0]?.certification || releaseDates.find((r: any) => r.iso_3166_1 === 'US')?.release_dates?.[0]?.certification || '';
    
    // Alternative Titles
    const altTitles = metadata.alternative_titles?.titles || [];

    // Original title from JSONB metadata (preserves UTF-8 encoding)
    const correctOriginalTitle = metadata.original_title || movie.originalTitle || movie.title;

    // Smart Currency Formatter — TMDB always stores in USD
    const formatCurrency = (amount?: number) => {
        if (!amount || amount === 0) return '-';
        if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(2)}B`;
        if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
        if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
        return `$${amount.toLocaleString()}`;
    };

    return (
        <div className="min-h-screen bg-black text-white pb-32 font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">
            
            {/* ═══════════════════════════════════════════════════ */}
            {/* HERO SECTION — Full Cinematic Backdrop              */}
            {/* ═══════════════════════════════════════════════════ */}
            <div className="relative w-full h-[60vh] md:h-[70vh] mb-0">
                {movie.backdropUrl ? (
                    <Image 
                        src={`https://image.tmdb.org/t/p/original${movie.backdropUrl}`}
                        alt={movie.title}
                        fill
                        className="object-cover object-top"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-zinc-950" />
                )}
                
                {/* Soft bottom fade into black page */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
            </div>

            {/* ═══════════════════════════════════════════════════ */}
            {/* TITLE & ACTIONS — Below Hero                       */}
            {/* ═══════════════════════════════════════════════════ */}
            <div className="w-full max-w-[1600px] mx-auto px-6 md:px-16 pt-12 md:pt-16 relative z-20 mb-16">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 leading-none text-white drop-shadow-2xl">
                    {movie.title}
                </h1>
                
                <div className="flex flex-wrap gap-2 mb-6 items-center text-xs font-bold text-zinc-300 uppercase tracking-widest">
                    <span>{movie.year}</span>
                    {movie.runtime && movie.runtime > 0 && (
                        <>
                            <span className="text-zinc-600">•</span>
                            <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                        </>
                    )}
                    {certification && (
                        <>
                            <span className="text-zinc-600">•</span>
                            <span className="px-2 py-0.5 border border-zinc-600 rounded text-[10px]">{certification}</span>
                        </>
                    )}
                    <span className="text-zinc-600">•</span>
                    {genres.slice(0, 3).map((g: any, i: number) => (
                        <span key={g.id}>
                            {g.name}{i !== Math.min(genres.length, 3) - 1 ? ',' : ''}
                        </span>
                    ))}
                    {movie.status === 'Post Production' && (
                        <>
                            <span className="text-zinc-600">•</span>
                            <span className="text-orange-500">Coming Soon</span>
                        </>
                    )}
                </div>

                {/* Apple Style Action Bar */}
                <div className="flex items-center gap-3 flex-wrap">
                    {officialTrailer && (
                        <a 
                            href={`https://youtube.com/watch?v=${officialTrailer.key}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 h-11 px-5 rounded-xl font-bold text-sm transition-all bg-white text-black hover:scale-105 shadow-lg"
                        >
                            🎬 Trailer
                        </a>
                    )}
                    <button className="flex items-center justify-center gap-2 h-11 px-5 rounded-xl font-bold text-sm transition-all bg-zinc-900/80 backdrop-blur text-white hover:bg-zinc-800 border border-white/10">
                        🔖 Watchlist
                    </button>
                    <button className="flex items-center justify-center gap-2 h-11 px-5 rounded-xl font-bold text-sm transition-all bg-zinc-900/80 backdrop-blur text-white hover:bg-zinc-800 border border-white/10">
                        ✅ Seen
                    </button>
                    <button className="flex items-center justify-center gap-2 h-11 px-5 rounded-xl font-bold text-sm transition-all bg-zinc-900/80 backdrop-blur text-white hover:bg-zinc-800 border border-white/10">
                        ⭐️ Rate
                    </button>
                    <button className="flex items-center justify-center gap-2 h-11 px-5 rounded-xl font-bold text-sm transition-all bg-zinc-900/80 backdrop-blur text-white hover:bg-zinc-800 border border-white/10">
                        📝 Review
                    </button>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════ */}
            {/* MAIN CONTENT — 2 Column Layout                     */}
            {/* ═══════════════════════════════════════════════════ */}
            <div className="w-full max-w-[1600px] mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-20">
                
                {/* LEFT COLUMN: Editorial Content */}
                <div className="lg:col-span-8 space-y-20">
                    
                    {/* Synopsis Focus */}
                    <section>
                        {movie.tagline && (
                            <p className="text-zinc-400 font-bold text-lg md:text-2xl mb-6 tracking-wide leading-relaxed italic border-l-4 border-zinc-800 pl-6">
                                "{movie.tagline}"
                            </p>
                        )}
                        <p className="text-zinc-100 leading-[1.8] text-lg md:text-xl font-medium max-w-4xl tracking-tight">
                            {movie.overview || 'The plot is currently being kept under wraps. Be the first to contribute any leaks or official summaries!'}
                        </p>
                    </section>

                    {/* Rich Color OTT Hub */}
                    {(streaming.length > 0 || theatrical.length > 0) && (
                        <section>
                            <h2 className="text-sm font-black uppercase tracking-widest mb-6 text-zinc-500 border-b border-white/10 pb-4">
                                Available On
                            </h2>
                            <div className="flex flex-wrap gap-4">
                                {streaming.map(link => {
                                    const brand = getPlatformBrand(link.platform);
                                    return (
                                        <a key={link.id} href={link.url || '#'} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-1.5 w-[60px]">
                                            <div className={`w-12 h-12 rounded-xl ${brand.logo ? 'bg-zinc-900' : (brand as any).fallbackBg || 'bg-zinc-800'} border border-white/10 overflow-hidden transition-transform hover:scale-110 shadow-lg flex items-center justify-center`}>
                                                {brand.logo ? (
                                                    <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="font-black text-white text-[9px]">{(brand as any).fallbackText || link.platform.substring(0, 3).toUpperCase()}</span>
                                                )}
                                            </div>
                                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest text-center group-hover:text-white transition-colors truncate w-full">
                                                {brand.name}
                                            </span>
                                        </a>
                                    );
                                })}
                                {theatrical.map(link => {
                                    const brand = getPlatformBrand(link.platform);
                                    return (
                                        <a key={link.id} href={link.url || '#'} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-1.5 w-[60px]">
                                            <div className={`w-12 h-12 rounded-xl ${brand.logo ? 'bg-zinc-900' : (brand as any).fallbackBg || 'bg-zinc-800'} border border-white/10 overflow-hidden transition-transform hover:scale-110 shadow-lg flex items-center justify-center`}>
                                                {brand.logo ? (
                                                    <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="font-black text-white text-[9px]">{(brand as any).fallbackText || link.platform.substring(0, 3).toUpperCase()}</span>
                                                )}
                                            </div>
                                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest text-center group-hover:text-white transition-colors truncate w-full">
                                                {brand.name}
                                            </span>
                                        </a>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Round Avatar Cast (Apple TV Style) */}
                    <section>
                        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-500">
                                Cast & Crew
                            </h2>
                            <CastModal cast={cast} crew={crew} />
                        </div>
                        
                        <div className="flex overflow-x-auto gap-6 pb-4 snap-x scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                            {cast.slice(0, 10).map(c => (
                                <Link href={`/profile/${c.person.slug}`} key={c.person.id} className="shrink-0 w-24 group snap-start flex flex-col items-center text-center">
                                    <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-900 border border-white/5 mb-3 group-hover:border-blue-500 transition-colors relative shadow-lg">
                                        {(c.person.metadata as any)?.profile_path ? (
                                            <Image 
                                                src={`https://image.tmdb.org/t/p/w185${(c.person.metadata as any).profile_path}`}
                                                alt={c.person.name} fill className="object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-zinc-800 bg-black">
                                                {c.person.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-xs text-white tracking-tight line-clamp-1 mb-1 group-hover:text-blue-500 transition-colors">
                                        {c.person.name}
                                    </h3>
                                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest line-clamp-1">
                                        {c.character}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Posters & Gallery (Missing Data Addition) */}
                    {(posters.length > 0 || backdrops.length > 0) && (
                        <section>
                            <h2 className="text-sm font-black uppercase tracking-widest mb-6 text-zinc-500 border-b border-white/10 pb-4">
                                Posters & Gallery
                            </h2>
                            <div className="flex overflow-x-auto gap-4 pb-4 snap-x scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                                {backdrops.slice(0, 5).map((img: any, i: number) => (
                                    <div key={`backdrop-${i}`} className="shrink-0 w-80 aspect-video rounded-xl overflow-hidden bg-zinc-900 relative shadow-md snap-start">
                                        <Image src={`https://image.tmdb.org/t/p/w780${img.file_path}`} alt="Gallery Backdrop" fill className="object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>
                                ))}
                                {posters.slice(0, 5).map((img: any, i: number) => (
                                    <div key={`poster-${i}`} className="shrink-0 w-40 aspect-[2/3] rounded-xl overflow-hidden bg-zinc-900 relative shadow-md snap-start">
                                        <Image src={`https://image.tmdb.org/t/p/w342${img.file_path}`} alt="Gallery Poster" fill className="object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Trailers & Clips (Missing Data Addition) */}
                    {allTrailers.length > 0 && (
                        <section>
                            <h2 className="text-sm font-black uppercase tracking-widest mb-6 text-zinc-500 border-b border-white/10 pb-4">
                                Trailers & Clips
                            </h2>
                            <div className="flex overflow-x-auto gap-4 pb-4 snap-x scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                                {allTrailers.map((vid: any) => (
                                    <a key={vid.id} href={`https://youtube.com/watch?v=${vid.key}`} target="_blank" rel="noopener noreferrer" className="shrink-0 w-72 aspect-video rounded-xl overflow-hidden bg-zinc-900 relative shadow-md group snap-start">
                                        <Image src={`https://img.youtube.com/vi/${vid.key}/mqdefault.jpg`} alt={vid.name} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
                                                <PlayCircle className="w-5 h-5 text-white" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black to-transparent p-4">
                                            <p className="text-xs font-bold text-white line-clamp-1">{vid.name}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Community Hub Upgrade */}
                    <section className="bg-[#111] rounded-[2rem] p-8 md:p-12 border border-white/5">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-1 text-white">
                                    Community Hub
                                </h2>
                                <p className="text-zinc-500 font-bold text-sm">Discussions, Tier Lists, and Fan Art</p>
                            </div>
                            <Link href={`/movies/${movie.slug}/hub`} className="px-6 py-3 rounded-full bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 transition-colors text-center">
                                Enter Hub
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-6 bg-zinc-900/50 rounded-2xl hover:bg-zinc-900 transition-colors cursor-pointer group border border-transparent hover:border-white/10">
                                <div className="text-2xl mb-4">💬</div>
                                <h3 className="font-bold text-lg mb-2 text-white">Reviews</h3>
                                <p className="text-zinc-500 text-xs font-medium leading-relaxed mb-4">Read raw, unfiltered diaries from the TFIverse community.</p>
                                <span className="text-xs font-bold text-blue-500 group-hover:text-blue-400">Read All &rarr;</span>
                            </div>

                            <div className="p-6 bg-zinc-900/50 rounded-2xl hover:bg-zinc-900 transition-colors cursor-pointer group border border-transparent hover:border-white/10">
                                <div className="text-2xl mb-4">🏆</div>
                                <h3 className="font-bold text-lg mb-2 text-white">Awards</h3>
                                <p className="text-zinc-500 text-xs font-medium leading-relaxed mb-4">Box office milestones and community-voted honors.</p>
                                <span className="text-xs font-bold text-blue-500 group-hover:text-blue-400">View Stats &rarr;</span>
                            </div>

                            <div className="p-6 bg-zinc-900/50 rounded-2xl hover:bg-zinc-900 transition-colors cursor-pointer group border border-transparent hover:border-white/10">
                                <div className="text-2xl mb-4">🖼️</div>
                                <h3 className="font-bold text-lg mb-2 text-white">Memes & Edits</h3>
                                <p className="text-zinc-500 text-xs font-medium leading-relaxed mb-4">Explore high-fidelity fan art and viral movie edits.</p>
                                <span className="text-xs font-bold text-blue-500 group-hover:text-blue-400">Explore &rarr;</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* ═══════════════════════════════════════════════════ */}
                {/* RIGHT COLUMN: The Data Matrix                      */}
                {/* ═══════════════════════════════════════════════════ */}
                <div className="lg:col-span-4">
                    <div className="sticky top-8 space-y-6">
                        
                        {/* Movie Poster — compact Apple TV style */}
                        <div className="relative group w-3/4 mx-auto">
                            <div className="absolute -inset-1.5 bg-gradient-to-b from-blue-500/10 via-purple-500/5 to-transparent rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
                            <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl">
                            {movie.posterUrl ? (
                                <Image src={`https://image.tmdb.org/t/p/w500${movie.posterUrl}`} alt={movie.title} fill className="object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center"><Film className="w-16 h-16 text-zinc-800" /></div>
                            )}
                            </div>
                        </div>
                        {/* Rich Color Social / External Links */}
                        <div className="flex gap-3 flex-wrap">
                            {homepage && (
                                <a href={homepage} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors" title="Official Website"><Globe className="w-4 h-4 text-white" /></a>
                            )}
                            {externalIds.imdb_id && (
                                <a href={`https://www.imdb.com/title/${externalIds.imdb_id}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#F5C518] flex items-center justify-center hover:brightness-110 transition-colors shadow-lg" title="IMDB"><span className="font-black text-black text-[10px] tracking-tighter">IMDb</span></a>
                            )}
                            {(externalIds.instagram_id || externalIds.instagram) && (
                                <a href={`https://instagram.com/${externalIds.instagram_id || externalIds.instagram}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center hover:brightness-110 transition-colors shadow-lg" title="Instagram"><Camera className="w-4 h-4 text-white" /></a>
                            )}
                            {(externalIds.twitter_id || externalIds.twitter) && (
                                <a href={`https://twitter.com/${externalIds.twitter_id || externalIds.twitter}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-black border border-white/20 flex items-center justify-center hover:bg-zinc-900 transition-colors" title="X"><span className="font-black text-white text-[12px]">X</span></a>
                            )}
                            {externalIds.wikidata_id && (
                                <a href={`https://www.wikidata.org/wiki/${externalIds.wikidata_id}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors" title="Wikidata"><span className="font-black text-white text-[9px]">Wiki</span></a>
                            )}
                        </div>

                        {/* Info Card */}
                        <div className="bg-[#111] border border-white/5 rounded-3xl p-6 space-y-5">
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest border-b border-white/5 pb-3">Film Details</p>
                            
                            {director && <div><p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Director</p><Link href={`/profile/${director.person.slug}`} className="text-sm font-bold text-white hover:text-blue-500 transition-colors">{director.person.name}</Link></div>}
                            
                            {writers.length > 0 && <div><p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Writers</p>{writers.map((w: any) => <div key={w.person.id} className="flex justify-between"><Link href={`/profile/${w.person.slug}`} className="text-sm font-bold text-zinc-300 hover:text-white">{w.person.name}</Link><span className="text-[9px] text-zinc-600 uppercase">{w.job}</span></div>)}</div>}
                            
                            {musicDirectors.length > 0 && <div><p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">🎵 Music</p>{musicDirectors.map((m: any) => <Link key={m.person.id} href={`/profile/${m.person.slug}`} className="text-sm font-bold text-zinc-300 hover:text-white block">{m.person.name}</Link>)}</div>}
                            
                            {cinematographers.length > 0 && <div><p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">📷 Cinematography</p>{cinematographers.map((c: any) => <Link key={c.person.id} href={`/profile/${c.person.slug}`} className="text-sm font-bold text-zinc-300 hover:text-white block">{c.person.name}</Link>)}</div>}
                            
                            {editors.length > 0 && <div><p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">✂️ Editing</p>{editors.map((e: any) => <span key={e.person.id} className="text-sm font-bold text-zinc-300 block">{e.person.name}</span>)}</div>}
                            
                            {producers.length > 0 && <div><p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Producers</p><div className="flex flex-wrap gap-x-3 gap-y-1">{producers.slice(0, 5).map((p: any) => <Link key={p.person.id} href={`/profile/${p.person.slug}`} className="text-sm font-bold text-zinc-300 hover:text-white">{p.person.name}</Link>)}</div></div>}

                            {artDept.length > 0 && <div><p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">🎨 Art & Design</p>{artDept.map((a: any) => <span key={a.id} className="text-sm font-bold text-zinc-300 block">{a.name} <span className="text-[9px] text-zinc-600">({a.job})</span></span>)}</div>}

                            {costumes.length > 0 && <div><p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">👗 Costume</p>{costumes.map((c: any) => <span key={c.id} className="text-sm font-bold text-zinc-300 block">{c.name}</span>)}</div>}

                            {choreographers.length > 0 && <div><p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">💃 Choreography</p>{choreographers.map((c: any) => <span key={c.id} className="text-sm font-bold text-zinc-300 block">{c.name}</span>)}</div>}

                            {stunts.length > 0 && <div><p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">🥊 Stunts</p>{stunts.map((s: any) => <span key={s.id} className="text-sm font-bold text-zinc-300 block">{s.name}</span>)}</div>}
                        </div>

                        {/* Financial & Metadata Card */}
                        <div className="bg-[#111] border border-white/5 rounded-3xl p-6 space-y-5">
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest border-b border-white/5 pb-3">Information</p>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">💰 Budget</p><p className="text-sm font-bold text-white">{formatCurrency(movie.budget ?? undefined)}</p></div>
                                <div><p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">📊 Revenue</p><p className="text-sm font-bold text-white">{formatCurrency(movie.revenue ?? undefined)}</p></div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">⭐ Rating</p><p className="text-sm font-bold text-white">{movie.voteAverage?.toFixed(1) || '-'} <span className="text-[9px] text-zinc-500">({voteCount.toLocaleString()} votes)</span></p></div>
                                <div><p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">🔥 Popularity</p><p className="text-sm font-bold text-white">{popularityScore > 0 ? popularityScore.toFixed(1) : '-'}</p></div>
                            </div>

                            {certification && <div><p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">🎬 Certification</p><p className="text-sm font-bold text-white">{certification}</p></div>}

                            <div><p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Original Title</p><p className="text-sm font-bold text-zinc-300" style={{fontFamily: "'Noto Sans Telugu', 'Noto Sans Devanagari', 'Noto Sans Kannada', 'Noto Sans Tamil', 'Noto Sans Malayalam', system-ui, sans-serif"}}>{correctOriginalTitle}</p></div>
                            
                            {collection && <div><p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">📀 Collection</p><p className="text-sm font-bold text-zinc-300">{collection.name}</p></div>}
                            
                            <div><p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">🌍 Origin</p><p className="text-sm font-bold text-zinc-300">{productionCountries.length > 0 ? productionCountries.map((c: any) => c.name).join(', ') : '-'}</p></div>
                            
                            {metadata.spoken_languages && <div><p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">🗣️ Audio</p><p className="text-sm font-bold text-zinc-300">{metadata.spoken_languages.map((l: any) => l.english_name || l.name).join(', ')}</p></div>}

                            {companies.length > 0 && <div><p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">🏢 Studios</p>{companies.map((c: any) => <p key={c.id} className="text-sm font-bold text-zinc-300">{c.name}</p>)}</div>}
                        </div>

                        {/* Keywords / Tags */}
                        {keywords.length > 0 && (
                            <div className="bg-[#111] border border-white/5 rounded-3xl p-6">
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest border-b border-white/5 pb-3 mb-4">Tags</p>
                                <div className="flex flex-wrap gap-2">
                                    {keywords.slice(0, 20).map((k: any) => (
                                        <span key={k.id} className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-3 py-1.5 border border-zinc-800 rounded-lg hover:text-white hover:border-zinc-600 cursor-pointer transition-colors">{k.name}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Alternative Titles */}
                        {altTitles.length > 0 && (
                            <div className="bg-[#111] border border-white/5 rounded-3xl p-6">
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest border-b border-white/5 pb-3 mb-4">Also Known As</p>
                                <div className="space-y-2">
                                    {altTitles.slice(0, 8).map((t: any, i: number) => (
                                        <div key={i} className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-zinc-300">{t.title}</span>
                                            <span className="text-[9px] font-bold text-zinc-600 uppercase">{t.iso_3166_1}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-zinc-900 border border-white/5 text-zinc-400 font-bold text-sm hover:bg-zinc-800 transition-colors">
                            <Edit3 className="w-4 h-4" /> Suggest Edit
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}
