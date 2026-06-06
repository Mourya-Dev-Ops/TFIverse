"use client";

import React, { useEffect, useState } from 'react';
import { IndianRupee, Users, Flame, Info, ChevronDown, ChevronRight, Activity } from 'lucide-react';

interface BoxOfficeData {
    movieId: number;
    overview: {
        gross: number;
        totalSeats: number;
        soldSeats: number;
        occupancy: string;
        shows: number;
        housefull: number;
        fastFilling: number;
        atp: string;
    };
    states: Array<{
        state: string;
        totalGross: number;
        totalShows: number;
        cities: Array<{
            city: string;
            gross: number;
            shows: number;
            sold: number;
            hf: number;
            ff: number;
        }>;
    }>;
}

export default function LiveDashboard() {
    const [data, setData] = useState<BoxOfficeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [sourceFilter, setSourceFilter] = useState<'ALL' | 'BMS' | 'PAYTM'>('ALL');
    const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/box-office/live?source=${sourceFilter}`);
                const json = await res.json();
                if (json.success && json.data) {
                    setData(json.data);
                } else {
                    setData(null);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
            }
            setLoading(false);
        };

        fetchData();
        // Poll every 60 seconds
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, [sourceFilter]);

    const toggleState = (stateName: string) => {
        setExpandedStates(prev => {
            const next = new Set(prev);
            if (next.has(stateName)) next.delete(stateName);
            else next.add(stateName);
            return next;
        });
    };

    if (loading && !data) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-8 h-8 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                <p className="text-neutral-500 animate-pulse font-medium">Crunching live numbers...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-8 border border-white/5 bg-white/[0.02] rounded-2xl text-center">
                <p className="text-neutral-400">No live tracking data available right now.</p>
            </div>
        );
    }

    const o = data.overview;

    return (
        <div className="space-y-8 relative z-10">
            {/* Filter Toggle */}
            <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-xl w-fit backdrop-blur-md">
                {(['ALL', 'BMS', 'PAYTM'] as const).map(filter => (
                    <button
                        key={filter}
                        onClick={() => setSourceFilter(filter)}
                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                            sourceFilter === filter 
                            ? 'bg-white text-black shadow-lg shadow-white/10' 
                            : 'text-neutral-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {filter === 'ALL' ? 'Live Aggregated' : filter === 'BMS' ? 'BookMyShow Live' : 'District Live'}
                    </button>
                ))}
            </div>

            {/* Top Stat Cards (The Pills) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Gross Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-2 text-emerald-400 mb-2">
                        <IndianRupee size={18} />
                        <span className="font-semibold text-sm">Total Gross</span>
                    </div>
                    <div className="text-3xl font-bold tracking-tight">
                        ₹{(o.gross / 100000).toFixed(2)}L
                    </div>
                </div>

                {/* Shows Card */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                    <div className="flex items-center gap-2 text-blue-400 mb-2">
                        <Activity size={18} />
                        <span className="font-semibold text-sm">Total Shows</span>
                    </div>
                    <div className="text-3xl font-bold tracking-tight">{o.shows.toLocaleString()}</div>
                </div>

                {/* Housefull & Fast Filling Card */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-red-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    </div>
                    <div className="flex items-center gap-2 text-red-400 mb-2">
                        <Flame size={18} />
                        <span className="font-semibold text-sm">Status</span>
                    </div>
                    <div className="flex gap-4 mt-2">
                        <div>
                            <div className="text-2xl font-bold text-white">{o.housefull}</div>
                            <div className="text-xs text-red-400 font-medium">HOUSEFULL</div>
                        </div>
                        <div className="w-px bg-white/10" />
                        <div>
                            <div className="text-2xl font-bold text-white">{o.fastFilling}</div>
                            <div className="text-xs text-orange-400 font-medium">FAST FILLING</div>
                        </div>
                    </div>
                </div>

                {/* Occupancy Card */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                    <div className="flex items-center gap-2 text-purple-400 mb-2">
                        <Users size={18} />
                        <span className="font-semibold text-sm">Occupancy</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <div className="text-3xl font-bold tracking-tight">{o.occupancy}%</div>
                        <div className="text-sm text-neutral-400 mb-1 flex items-center gap-1">
                            <Info size={14}/> ATP: ₹{o.atp}
                        </div>
                    </div>
                </div>
            </div>

            {/* Expandable Data Table */}
            <div className="border border-white/10 bg-black/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-white/10 bg-white/[0.02] grid grid-cols-12 text-sm font-semibold text-neutral-400">
                    <div className="col-span-4">State / City</div>
                    <div className="col-span-2 text-right">Shows</div>
                    <div className="col-span-2 text-right">Gross (₹)</div>
                    <div className="col-span-2 text-center text-red-400">HF</div>
                    <div className="col-span-2 text-center text-orange-400">FF</div>
                </div>
                
                <div className="divide-y divide-white/5">
                    {data.states.map((stateData, idx) => {
                        const isExpanded = expandedStates.has(stateData.state);
                        
                        return (
                            <div key={idx} className="group">
                                {/* State Row */}
                                <div 
                                    onClick={() => toggleState(stateData.state)}
                                    className="p-4 grid grid-cols-12 items-center cursor-pointer hover:bg-white/[0.02] transition-colors"
                                >
                                    <div className="col-span-4 flex items-center gap-2 font-medium">
                                        {isExpanded ? <ChevronDown size={16} className="text-red-500" /> : <ChevronRight size={16} className="text-neutral-500" />}
                                        {stateData.state}
                                    </div>
                                    <div className="col-span-2 text-right font-mono text-neutral-300">{stateData.totalShows.toLocaleString()}</div>
                                    <div className="col-span-2 text-right font-mono text-emerald-400 font-medium">{(stateData.totalGross / 100000).toFixed(2)}L</div>
                                    <div className="col-span-4" /> {/* Empty spacing for parent row */}
                                </div>

                                {/* Cities Dropdown */}
                                {isExpanded && (
                                    <div className="bg-black/50 border-t border-white/5 py-2">
                                        {stateData.cities.map((city, cIdx) => (
                                            <div key={cIdx} className="px-4 py-2 grid grid-cols-12 items-center hover:bg-white/[0.02] text-sm transition-colors">
                                                <div className="col-span-4 pl-8 text-neutral-400">{city.city}</div>
                                                <div className="col-span-2 text-right font-mono text-neutral-500">{city.shows}</div>
                                                <div className="col-span-2 text-right font-mono text-emerald-500/80">{(city.gross).toLocaleString()}</div>
                                                <div className="col-span-2 flex justify-center">
                                                    {city.hf > 0 ? (
                                                        <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 font-mono text-xs border border-red-500/20">
                                                            {city.hf}
                                                        </span>
                                                    ) : '-'}
                                                </div>
                                                <div className="col-span-2 flex justify-center">
                                                    {city.ff > 0 ? (
                                                        <span className="px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 font-mono text-xs border border-orange-500/20">
                                                            {city.ff}
                                                        </span>
                                                    ) : '-'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
