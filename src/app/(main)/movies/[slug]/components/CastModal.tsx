'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function CastModal({ cast, crew }: { cast: any[], crew: any[] }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className="text-xs font-black uppercase tracking-widest text-blue-500 hover:text-white transition-colors ml-6"
            >
                View Full Cast & Crew
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsOpen(false)} />
            
            <div className="relative w-full max-w-5xl bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/50 backdrop-blur-md">
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
                        Full Cast & Crew
                    </h2>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-16 scrollbar-hide">
                    
                    {/* Cast Section */}
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-8 border-b border-white/5 pb-4">
                            Cast
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-6">
                            {cast.map(c => (
                                <Link href={`/profile/${c.person.slug}`} key={c.person.id} className="group flex flex-col items-center text-center">
                                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-zinc-900 border border-white/10 mb-4 group-hover:border-blue-500 transition-colors relative shadow-lg">
                                        {(c.person.metadata as any)?.profile_path ? (
                                            <Image 
                                                src={`https://image.tmdb.org/t/p/w185${(c.person.metadata as any).profile_path}`}
                                                alt={c.person.name} fill className="object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-3xl font-black text-zinc-800 bg-black">
                                                {c.person.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="font-bold text-sm text-white tracking-tight mb-1 group-hover:text-blue-500 transition-colors">
                                        {c.person.name}
                                    </h4>
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                        {c.character}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Crew Section */}
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-8 border-b border-white/5 pb-4">
                            Crew
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-6">
                            {crew.map((c, idx) => (
                                <Link href={`/profile/${c.person.slug}`} key={`${c.person.id}-${idx}`} className="group flex flex-col items-center text-center">
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-zinc-900 border border-white/10 mb-4 group-hover:border-blue-500 transition-colors relative shadow-lg">
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
                                    <h4 className="font-bold text-xs text-white tracking-tight mb-1 group-hover:text-blue-500 transition-colors">
                                        {c.person.name}
                                    </h4>
                                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                                        {c.job}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
