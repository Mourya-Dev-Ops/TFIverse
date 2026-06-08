'use client';

import React from 'react';
import { TrendingUp, Users, MapPin, Building2, Flame, Award, BarChart3, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export function BoxOfficeDashboard({ movieTitle, daily, regional, chain }: any) {
    // If no data exists, show a beautiful "Coming Soon" or "Tracking Not Started" state
    if (!daily && (!regional || regional.length === 0)) {
        return (
            <div className="w-full h-64 flex flex-col items-center justify-center bg-[#111] border border-white/5 rounded-3xl mt-8">
                <BarChart3 className="w-12 h-12 text-zinc-700 mb-4" />
                <h3 className="text-lg font-black text-white tracking-tight">Box Office Tracking</h3>
                <p className="text-sm text-zinc-500 mt-2 text-center max-w-sm">
                    We are not currently tracking live box office data for {movieTitle}. Data will appear here once tracking begins.
                </p>
            </div>
        );
    }

    // Formatters
    const formatCurrency = (num: number) => {
        if (num >= 1e7) return `₹${(num / 1e7).toFixed(2)} Cr`;
        if (num >= 1e5) return `₹${(num / 1e5).toFixed(2)} L`;
        return `₹${num.toLocaleString('en-IN')}`;
    };

    // Derived Stats
    const totalGross = daily?.gross || regional.reduce((acc: number, r: any) => acc + r.gross, 0) || 0;
    const totalTickets = daily?.ticketsSold || regional.reduce((acc: number, r: any) => acc + r.sold, 0) || 0;
    const totalShows = daily?.shows || regional.reduce((acc: number, r: any) => acc + r.shows, 0) || 0;
    const avgOcc = daily?.occupancy || (regional.reduce((acc: number, r: any) => acc + r.occupancy, 0) / (regional.length || 1)) || 0;

    // Group Regional by State
    const stateMap = new Map();
    (regional || []).forEach((r: any) => {
        if (!stateMap.has(r.state)) stateMap.set(r.state, { state: r.state, gross: 0, sold: 0, shows: 0, occSum: 0 });
        const s = stateMap.get(r.state);
        s.gross += r.gross; s.sold += r.sold; s.shows += r.shows; s.occSum += (r.occupancy * r.shows);
    });
    const stateStats = Array.from(stateMap.values())
        .map(s => ({ ...s, occupancy: s.shows > 0 ? s.occSum / s.shows : 0 }))
        .sort((a, b) => b.gross - a.gross);

    return (
        <div className="w-full mt-12 animate-in fade-in duration-700 slide-in-from-bottom-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Live Box Office</h2>
                    <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live Tracking Active
                    </p>
                </div>
            </div>

            {/* Premium Hero Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard 
                    title="Total Gross" 
                    value={formatCurrency(totalGross)} 
                    icon={<TrendingUp className="text-emerald-400" size={20} />} 
                    gradient="from-emerald-500/10 to-transparent"
                    accent="border-emerald-500/20"
                />
                <StatCard 
                    title="Tickets Sold" 
                    value={totalTickets.toLocaleString('en-IN')} 
                    icon={<Users className="text-blue-400" size={20} />} 
                    gradient="from-blue-500/10 to-transparent"
                    accent="border-blue-500/20"
                />
                <StatCard 
                    title="Tracked Shows" 
                    value={totalShows.toLocaleString('en-IN')} 
                    icon={<Activity className="text-purple-400" size={20} />} 
                    gradient="from-purple-500/10 to-transparent"
                    accent="border-purple-500/20"
                />
                <StatCard 
                    title="Avg Occupancy" 
                    value={`${avgOcc.toFixed(1)}%`} 
                    icon={<Flame className="text-orange-400" size={20} />} 
                    gradient="from-orange-500/10 to-transparent"
                    accent="border-orange-500/20"
                />
            </div>

            {/* Deep Dive Grids */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: States & Chains */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* State Breakdown */}
                    {stateStats.length > 0 && (
                        <DataPanel title="Territory Performance" icon={<MapPin className="text-zinc-400" size={16} />}>
                            <div className="flex flex-col gap-1">
                                <div className="grid grid-cols-12 px-4 py-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 mb-2">
                                    <div className="col-span-5">State</div>
                                    <div className="col-span-3 text-right">Gross</div>
                                    <div className="col-span-2 text-right">Shows</div>
                                    <div className="col-span-2 text-right">Occ %</div>
                                </div>
                                {stateStats.map((s: any, i) => (
                                    <div key={i} className="grid grid-cols-12 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors items-center group">
                                        <div className="col-span-5 font-bold text-sm text-white flex items-center gap-3">
                                            <span className="w-6 text-center text-xs text-zinc-600 font-black">{i + 1}</span>
                                            {s.state}
                                        </div>
                                        <div className="col-span-3 text-right font-black text-emerald-400 text-sm group-hover:scale-105 transition-transform origin-right">
                                            {formatCurrency(s.gross)}
                                        </div>
                                        <div className="col-span-2 text-right text-xs font-bold text-zinc-400">
                                            {s.shows}
                                        </div>
                                        <div className="col-span-2 text-right text-xs font-bold">
                                            <span className={`px-2 py-1 rounded-md ${s.occupancy > 50 ? 'bg-emerald-500/10 text-emerald-400' : s.occupancy > 20 ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'}`}>
                                                {s.occupancy.toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </DataPanel>
                    )}

                    {/* Chain Breakdown */}
                    {chain && chain.length > 0 && (
                        <DataPanel title="Multiplex Chains" icon={<Building2 className="text-zinc-400" size={16} />}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                                {chain.map((c: any, i: number) => (
                                    <div key={i} className="bg-zinc-950 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:border-white/20 transition-colors">
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">{c.chain}</p>
                                        <p className="text-lg font-black text-white">{formatCurrency(c.gross)}</p>
                                        <p className="text-xs text-zinc-400 mt-1">{c.sold} Tkts</p>
                                    </div>
                                ))}
                            </div>
                        </DataPanel>
                    )}
                </div>

                {/* Right Column: Key Insights & Cities */}
                <div className="space-y-8">
                    {/* Top Cities Mini */}
                    {regional && regional.length > 0 && (
                        <DataPanel title="Top Cities" icon={<Award className="text-zinc-400" size={16} />}>
                            <div className="flex flex-col p-2">
                                {regional.slice(0, 5).map((r: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 rounded-xl transition-colors">
                                        <div>
                                            <p className="text-sm font-bold text-white">{r.city}</p>
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{r.state}</p>
                                        </div>
                                        <p className="text-sm font-black text-emerald-400">{formatCurrency(r.gross)}</p>
                                    </div>
                                ))}
                            </div>
                        </DataPanel>
                    )}

                    {/* Quick Insights */}
                    {daily && (
                        <DataPanel title="Market Insights" icon={<BarChart3 className="text-zinc-400" size={16} />}>
                            <div className="p-6 space-y-5">
                                <div>
                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Average Ticket Price</p>
                                    <p className="text-xl font-black text-white">₹{daily.atp.toFixed(0)}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Total Venues</p>
                                    <p className="text-xl font-black text-white">{daily.venues}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">House Full Shows</p>
                                    <p className="text-xl font-black text-red-400">{daily.hfCount}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Fast Filling</p>
                                    <p className="text-xl font-black text-orange-400">{daily.ffCount}</p>
                                </div>
                            </div>
                        </DataPanel>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, gradient, accent }: any) {
    return (
        <div className={`relative overflow-hidden bg-[#111] border ${accent} rounded-3xl p-6 group`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 group-hover:opacity-100 transition-opacity`} />
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{title}</p>
                    <div className="p-2 bg-black/40 rounded-xl backdrop-blur-sm">
                        {icon}
                    </div>
                </div>
                <h3 className="text-3xl font-black text-white tracking-tight drop-shadow-md">{value}</h3>
            </div>
        </div>
    );
}

function DataPanel({ title, icon, children }: any) {
    return (
        <div className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                {icon}
                <h3 className="text-xs font-black text-white uppercase tracking-widest">{title}</h3>
            </div>
            <div>
                {children}
            </div>
        </div>
    );
}
