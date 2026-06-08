'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  Tv, 
  MapPin, 
  Flame, 
  Compass, 
  Clock, 
  RefreshCw,
  Film,
  Building,
  Activity,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface TrackClientProps {
  initialData: {
    movie: any;
    stats: {
      totalGross: number;
      totalSold: number;
      totalSeats: number;
      showsCount: number;
    };
    statusCounts: {
      hfCount: number;
      ffCount: number;
      avCount: number;
    };
    trends: any[];
    citySplit: any[];
    stateBreakdown: any[];
    sourceSplit: any[];
    liveVenues?: any[];
    lastUpdated: string;
  };
}

export default function TrackClient({ initialData }: TrackClientProps) {
  const [activeTab, setActiveTab] = useState<'regions' | 'chains' | 'live'>('regions');
  const [sourceFilter, setSourceFilter] = useState<'ALL' | 'BMS' | 'PAYTM'>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { movie, stats, statusCounts, trends, citySplit, stateBreakdown, sourceSplit, liveVenues = [], lastUpdated } = initialData;

  const router = useRouter();

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const formatCurrency = (num: number) => {
    if (num >= 1e7) return `₹${(num / 1e7).toFixed(2)} Cr`;
    if (num >= 1e5) return `₹${(num / 1e5).toFixed(2)} L`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  // Filter stateBreakdown based on selected source
  const filteredStateBreakdown = stateBreakdown.filter(item => {
    if (sourceFilter === 'ALL') return true;
    if (sourceFilter === 'BMS') return item.chain !== 'Ticketnew'; // BMS chains
    if (sourceFilter === 'PAYTM') return item.chain === 'Ticketnew'; // Paytm source
    return true;
  });

  // Group filtered breakdown by state/city for display
  const stateSummaryMap = new Map<string, { gross: number; sold: number; shows: number; hf: number; ff: number; totalSeats: number; }>();
  filteredStateBreakdown.forEach(item => {
    const stateName = item.state || 'Unknown';
    if (!stateSummaryMap.has(stateName)) {
      stateSummaryMap.set(stateName, { gross: 0, sold: 0, shows: 0, hf: 0, ff: 0, totalSeats: 0 });
    }
    const stateVal = stateSummaryMap.get(stateName)!;
    stateVal.gross += item.gross || 0;
    stateVal.sold += item.sold || 0;
    stateVal.shows += item.shows || 0;
    stateVal.hf += item.hfCount || 0;
    stateVal.ff += item.ffCount || 0;
    stateVal.totalSeats += item.totalSeats || 0;
  });

  // Sort states by gross
  const sortedStates = Array.from(stateSummaryMap.entries())
    .map(([stateName, val]) => ({ name: stateName, ...val }))
    .sort((a, b) => b.gross - a.gross);

  // Group by chain
  const chainSummaryMap = new Map<string, { gross: number; sold: number; shows: number; hf: number; ff: number; totalSeats: number; }>();
  filteredStateBreakdown.forEach(item => {
    const chainName = (item.chain || 'INDEPENDENT').toUpperCase();
    if (!chainSummaryMap.has(chainName)) {
      chainSummaryMap.set(chainName, { gross: 0, sold: 0, shows: 0, hf: 0, ff: 0, totalSeats: 0 });
    }
    const chainVal = chainSummaryMap.get(chainName)!;
    chainVal.gross += item.gross || 0;
    chainVal.sold += item.sold || 0;
    chainVal.shows += item.shows || 0;
    chainVal.hf += item.hfCount || 0;
    chainVal.ff += item.ffCount || 0;
    chainVal.totalSeats += item.totalSeats || 0;
  });

  const sortedChains = Array.from(chainSummaryMap.entries())
    .map(([chainName, val]) => ({ name: chainName, ...val }))
    .sort((a, b) => b.gross - a.gross);

  // Prepare chart data
  const chartData = trends.map(log => {
    const date = new Date(log.timestamp);
    const hourLabel = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    });
    return {
      time: hourLabel,
      tickets: log.soldTickets,
      gross: Number((log.grossRevenue / 100000).toFixed(2)), // in Lakhs
      occupancy: log.averageOccupancy
    };
  });

  const overallOccupancy = stats.totalSeats > 0 ? (stats.totalSold / stats.totalSeats) * 100 : 0;
  const atp = stats.totalSold > 0 ? stats.totalGross / stats.totalSold : 0;

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-rose-500 selection:text-white">
      {/* 1. Cinematic Hero Header */}
      <div className="relative w-full h-[55vh] md:h-[65vh] flex flex-col justify-end overflow-hidden border-b border-zinc-800">
        {/* Background Image / Backdrop */}
        <div className="absolute inset-0 z-0">
          {movie.backdropUrl ? (
            <Image 
              src={movie.backdropUrl.startsWith('http') ? movie.backdropUrl : `https://image.tmdb.org/t/p/w1280${movie.backdropUrl}`} 
              alt={movie.title} 
              fill
              priority
              className="object-cover object-center opacity-30 md:opacity-40 scale-105 transition-transform duration-1000"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-zinc-900 to-zinc-950" />
          )}
          {/* Edge-to-Edge Gradients for Cinematic Blend */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent" />
        </div>

        {/* Hero Metadata Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <Link href="/box-office/live" className="inline-flex items-center gap-2 text-zinc-400 hover:text-rose-400 text-xs font-black uppercase tracking-widest mb-6 transition-colors group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Hub
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10">
            {/* Poster thumbnail */}
            {movie.posterUrl && (
              <div className="hidden md:block relative w-36 h-52 flex-shrink-0 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                <Image src={movie.posterUrl.startsWith('http') ? movie.posterUrl : `https://image.tmdb.org/t/p/w500${movie.posterUrl}`} alt={movie.title} fill className="object-cover" />
              </div>
            )}

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="bg-rose-500 text-black text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.4)]">
                  LIVE TRACKING ACTIVE
                </span>
                <span className="bg-zinc-800/80 backdrop-blur-md text-zinc-300 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/5">
                  RELEASE: {movie.year || '2026'}
                </span>
                {sourceSplit.map(s => (
                  <span key={s.source} className="bg-zinc-900/60 backdrop-blur-md text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded border border-white/5">
                    {s.source}: {s.showCount.toLocaleString()} shows
                  </span>
                ))}
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="text-zinc-400 text-sm md:text-base font-semibold italic mt-2 drop-shadow-md max-w-2xl">
                  "{movie.tagline}"
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Global Sticky Stats Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 w-full mb-12">
        <div className="bg-zinc-950/80 border border-white/10 backdrop-blur-2xl rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              Real-time Gross
            </p>
            <p className="text-2xl sm:text-3xl md:text-4xl font-black text-rose-500 tracking-tight">
              {formatCurrency(stats.totalGross)}
            </p>
            <p className="text-xs text-zinc-400 mt-1 font-bold">
              Nett: {formatCurrency(stats.totalGross * 0.84)} <span className="text-zinc-600 font-medium">(approx)</span>
            </p>
          </div>

          <div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              Tickets Sold
            </p>
            <p className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              {stats.totalSold.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-zinc-400 mt-1 font-bold">
              ATP: <span className="text-emerald-400">₹{atp.toFixed(2)}</span>
            </p>
          </div>

          <div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-blue-500" />
              Total Tracked Shows
            </p>
            <p className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              {stats.showsCount.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-zinc-400 mt-1 font-bold">
              Capacity: {stats.totalSeats.toLocaleString('en-IN')} seats
            </p>
          </div>

          <div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-purple-500" />
              Live Occupancy
            </p>
            <p className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight" style={{ color: overallOccupancy > 55 ? '#10b981' : overallOccupancy > 25 ? '#fb923c' : '#ef4444' }}>
              {overallOccupancy.toFixed(2)}%
            </p>
            <div className="flex gap-2 mt-1.5">
              <span className="bg-red-500/10 text-red-500 text-[9px] font-black px-1.5 py-0.5 rounded border border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.15)]">
                HF: {statusCounts.hfCount}
              </span>
              <span className="bg-orange-500/10 text-orange-500 text-[9px] font-black px-1.5 py-0.5 rounded border border-orange-500/20 shadow-[0_0_8px_rgba(251,146,60,0.15)]">
                FF: {statusCounts.ffCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 pb-24">
        {/* Sub-toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950/40 border border-white/5 rounded-2xl p-4 mb-8 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-zinc-500 tracking-wider">Source Filters:</span>
            <div className="flex bg-zinc-900 rounded-lg p-0.5 border border-white/5">
              {['ALL', 'BMS', 'PAYTM'].map(src => (
                <button
                  key={src}
                  onClick={() => setSourceFilter(src as any)}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${
                    sourceFilter === src
                      ? 'bg-rose-500 text-black shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {src}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-4">
            <p className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-600" />
              Last Polled: <span className="text-zinc-300 font-black">{lastUpdated}</span>
            </p>
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-zinc-900 border border-white/10 hover:bg-zinc-800 disabled:opacity-50 text-white font-black text-[10px] uppercase tracking-wider py-2 px-4 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-rose-500 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Feed
            </button>
          </div>
        </div>

        {/* Hourly Velocity Section */}
        <div className="bg-zinc-950/40 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-xl mb-10">
          <h2 className="text-lg font-black uppercase text-white tracking-wider mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-rose-500 animate-pulse" />
            Ticket Booking Velocity Chart (Hourly Speed)
          </h2>
          <div className="h-[300px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" h="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#71717a" 
                    fontSize={10} 
                    fontWeight="bold" 
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#71717a" 
                    fontSize={10} 
                    fontWeight="bold"
                    tickLine={false}
                    tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#09090b', 
                      borderColor: 'rgba(255,255,255,0.1)', 
                      borderRadius: '16px',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }} 
                    itemStyle={{ color: '#f43f5e' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="tickets" 
                    stroke="#f43f5e" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorTickets)" 
                    name="Tickets Booked"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 font-bold text-sm">
                No hourly activity logs found for today.
              </div>
            )}
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/5 mb-8">
          <button 
            onClick={() => setActiveTab('regions')}
            className={`pb-4 px-6 text-sm font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'regions' 
                ? 'border-rose-500 text-white' 
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Regional Analysis
          </button>
          <button 
            onClick={() => setActiveTab('chains')}
            className={`pb-4 px-6 text-sm font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'chains' 
                ? 'border-rose-500 text-white' 
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            National Chain Analysis
          </button>
          <button 
            onClick={() => setActiveTab('live')}
            className={`pb-4 px-6 text-sm font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'live' 
                ? 'border-rose-500 text-white' 
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Live Venues Polled
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'regions' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* States summary table (Left 2 cols) */}
            <div className="lg:col-span-2 bg-zinc-950/40 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <h3 className="text-md font-black uppercase text-white mb-6 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500" />
                State-wise Aggregates
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-500">
                      <th className="pb-4 text-[10px] font-black uppercase tracking-wider">State</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-wider text-right">Gross</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-wider text-right">Tickets Sold</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-wider text-right">Shows</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-wider text-right">Occupancy</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-wider text-right">HF/FF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedStates.map((st, idx) => {
                      const occ = st.totalSeats > 0 ? (st.sold / st.totalSeats) * 100 : 0;
                      return (
                        <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4 text-sm font-black text-white uppercase">{st.name}</td>
                          <td className="py-4 text-sm font-black text-emerald-400 text-right">{formatCurrency(st.gross)}</td>
                          <td className="py-4 text-sm font-bold text-white text-right">{st.sold.toLocaleString('en-IN')}</td>
                          <td className="py-4 text-sm font-bold text-zinc-400 text-right">{st.shows.toLocaleString()}</td>
                          <td className="py-4 text-sm font-black text-right" style={{ color: occ > 50 ? '#10b981' : occ > 20 ? '#fb923c' : '#ef4444' }}>
                            {occ.toFixed(2)}%
                          </td>
                          <td className="py-4 text-right">
                            <div className="inline-flex gap-1.5">
                              <span className="bg-red-500/10 text-red-500 text-[8px] font-black px-1.5 py-0.5 rounded border border-red-500/15">{st.hf}</span>
                              <span className="bg-orange-500/10 text-orange-500 text-[8px] font-black px-1.5 py-0.5 rounded border border-orange-500/15">{st.ff}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {sortedStates.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-zinc-500 font-bold text-sm">No state data matches your filters.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* City-wise summary list */}
            <div className="bg-zinc-950/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl flex flex-col">
              <h3 className="text-md font-black uppercase text-white mb-6 flex items-center gap-2">
                <Building className="w-4 h-4 text-rose-500" />
                Top 10 Cities
              </h3>
              <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[400px] pr-2">
                {citySplit.slice(0, 10).map((c, idx) => {
                  const occ = c.totalSeats > 0 ? (c.sold / c.totalSeats) * 100 : 0;
                  return (
                    <div key={idx} className="bg-zinc-900/40 border border-white/5 rounded-2xl p-4 flex justify-between items-center hover:border-white/10 transition-colors">
                      <div>
                        <p className="text-sm font-black uppercase text-white">{c.city}</p>
                        <p className="text-xs font-bold text-zinc-500 mt-1">{c.shows} active shows</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-rose-400">{formatCurrency(c.gross)}</p>
                        <p className="text-[10px] font-bold mt-1" style={{ color: occ > 55 ? '#10b981' : occ > 25 ? '#fb923c' : '#ef4444' }}>
                          {occ.toFixed(1)}% Occ
                        </p>
                      </div>
                    </div>
                  );
                })}
                {citySplit.length === 0 && (
                  <div className="py-8 text-center text-zinc-500 font-bold text-sm">No city data matches your filters.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chains' && (
          <div className="bg-zinc-950/40 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
            <h3 className="text-md font-black uppercase text-white mb-6 flex items-center gap-2">
              <Building className="w-4 h-4 text-rose-500" />
              Multiplex and National Chains Breakdown
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-500">
                    <th className="pb-4 text-[10px] font-black uppercase tracking-wider">Theater Chain</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-wider text-right">Gross Collection</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-wider text-right">Tickets Sold</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-wider text-right">Total Shows</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-wider text-right">Avg Occupancy</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-wider text-right">House Full / Fast Filling</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedChains.map((ch, idx) => {
                    const occ = ch.totalSeats > 0 ? (ch.sold / ch.totalSeats) * 100 : 0;
                    return (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 text-sm font-black text-white uppercase">{ch.name}</td>
                        <td className="py-4 text-sm font-black text-emerald-400 text-right">{formatCurrency(ch.gross)}</td>
                        <td className="py-4 text-sm font-bold text-white text-right">{ch.sold.toLocaleString('en-IN')}</td>
                        <td className="py-4 text-sm font-bold text-zinc-400 text-right">{ch.shows.toLocaleString()}</td>
                        <td className="py-4 text-sm font-black text-right" style={{ color: occ > 50 ? '#10b981' : occ > 20 ? '#fb923c' : '#ef4444' }}>
                          {occ.toFixed(2)}%
                        </td>
                        <td className="py-4 text-right">
                          <div className="inline-flex gap-1.5">
                            <span className="bg-red-500/10 text-red-500 text-[8px] font-black px-1.5 py-0.5 rounded border border-red-500/15">HF: {ch.hf}</span>
                            <span className="bg-orange-500/10 text-orange-500 text-[8px] font-black px-1.5 py-0.5 rounded border border-orange-500/15">FF: {ch.ff}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {sortedChains.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-zinc-500 font-bold text-sm">No chain data matches your filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'live' && (
          <div className="bg-zinc-950/40 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
            <h3 className="text-md font-black uppercase text-white mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-500 animate-pulse" />
              Live Raw Sessions Log (Top 100 Most Active Venues)
            </h3>
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto pr-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-500 sticky top-0 bg-[#0a0a0a] z-10">
                    <th className="pb-4 text-[10px] font-black uppercase tracking-wider">Venue / Cinema</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-wider">City</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-wider">Time</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-wider text-right">Sold / Capacity</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-wider text-right">Gross</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-wider text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {liveVenues.map((venue, idx) => {
                    const occ = venue.totalSeats > 0 ? (venue.soldSeats / venue.totalSeats) * 100 : 0;
                    const isHF = venue.totalSeats > 0 && venue.soldSeats >= venue.totalSeats;
                    const isFF = !isHF && occ >= 90;
                    return (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3.5 text-sm font-semibold text-white">{venue.venueName}</td>
                        <td className="py-3.5 text-sm text-zinc-400 uppercase">{venue.city}</td>
                        <td className="py-3.5 text-sm text-zinc-400">{venue.shows} show(s) aggregated</td>
                        <td className="py-3.5 text-sm font-bold text-white text-right">
                          {venue.soldSeats.toLocaleString()} / {venue.totalSeats.toLocaleString()}
                        </td>
                        <td className="py-3.5 text-sm font-black text-emerald-400 text-right">{formatCurrency(venue.gross)}</td>
                        <td className="py-3.5 text-right">
                          {isHF ? (
                            <span className="bg-red-500/10 text-red-500 text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded border border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.2)]">HOUSE FULL</span>
                          ) : isFF ? (
                            <span className="bg-orange-500/10 text-orange-500 text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded border border-orange-500/20 shadow-[0_0_8px_rgba(251,146,60,0.2)]">FAST FILLING</span>
                          ) : (
                            <span className="bg-emerald-500/10 text-emerald-400 text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded border border-emerald-500/20">AVAILABLE</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {liveVenues.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-zinc-500 font-bold text-sm">No live venues found for your filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
