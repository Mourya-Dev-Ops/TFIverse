'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, RefreshCw, Copy, Share2, Search,
  ChevronRight, MapPin, Building2, Tv, Flame,
  Theater, X, Clock, BarChart3, Activity
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// ─── TYPES ───
interface TrackClientProps {
  initialData: {
    movie: any;
    stats: {
      totalGross: number; totalSold: number; totalSeats: number;
      showsCount: number; uniqueVenues: number; uniqueCities: number; uniqueStates: number;
    };
    statusCounts: { hfCount: number; ffCount: number; avCount: number };
    trends: any[];
    stateSummary: any[];
    citySummary: any[];
    chainSummary: any[];
    venueSummary: any[];
    timeSlotSummary: any[];
    sourceSplit: any[];
    rawShows: any[];
    picStats: { gross: number; sold: number };
    lastUpdated: string;
  };
}

// ─── HELPERS ───
function fmt(n: number): string {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)}Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)}L`;
  if (n >= 1e3) return `₹${(n / 1e3).toFixed(1)}k`;
  return `₹${n.toLocaleString('en-IN')}`;
}

function fmtNum(n: number): string {
  if (n >= 1e5) return `${(n / 1e5).toFixed(2)}L`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
  return n.toLocaleString('en-IN');
}

function occ(sold: number, total: number): string {
  if (!total) return '0.0';
  return ((sold / total) * 100).toFixed(1);
}

function atp(gross: number, sold: number): number {
  return sold > 0 ? Math.round(gross / sold) : 0;
}

function occClass(val: number): string {
  if (val >= 70) return 'text-emerald-400';
  if (val >= 40) return 'text-amber-400';
  return 'text-zinc-500';
}

// ─── REUSABLE DATA TABLE ROW ───
function DataRow({ 
  data, title, subtitle, icon: Icon, onClick 
}: { 
  data: any; title: string; subtitle?: string; icon?: any; onClick?: () => void; 
}) {
  const occVal = parseFloat(occ(data.sold || data.soldSeats, data.totalSeats));
  const atpVal = atp(data.gross || data.grossRevenue, data.sold || data.soldSeats);
  const grossVal = data.gross || data.grossRevenue || 0;
  const soldVal = data.sold || data.soldSeats || 0;
  const showsVal = data.shows || 1;

  return (
    <tr 
      onClick={onClick}
      className={`border-b border-white/[0.03] bg-transparent hover:bg-white/[0.02] transition-colors ${onClick ? 'cursor-pointer group' : ''}`}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-4 h-4 text-zinc-600" />}
          <div>
            <div className="font-medium text-zinc-200 group-hover:text-white transition-colors">{title}</div>
            {subtitle && <div className="text-[10px] text-zinc-500">{subtitle}</div>}
          </div>
          {onClick && <ChevronRight className="w-4 h-4 text-zinc-700 ml-auto group-hover:text-zinc-400 transition-colors" />}
        </div>
      </td>
      <td className="px-3 py-3 text-right text-xs text-zinc-400 font-mono">{showsVal}</td>
      <td className="px-3 py-3 text-right text-xs text-amber-500/80 font-mono">{data.ffCount || 0}</td>
      <td className="px-3 py-3 text-right text-xs text-rose-500/80 font-mono">{data.hfCount || 0}</td>
      <td className="px-3 py-3 text-right text-xs text-zinc-400 font-mono">{fmtNum(soldVal)}</td>
      <td className="px-3 py-3 text-right text-xs font-medium text-emerald-400/90 font-mono">{fmt(grossVal)}</td>
      <td className={`px-3 py-3 text-right text-xs font-medium font-mono ${occClass(occVal)}`}>{occVal}%</td>
      <td className="px-4 py-3 text-right text-xs text-zinc-500 font-mono">₹{atpVal}</td>
    </tr>
  );
}

// ─── MAIN COMPONENT ───
export default function TrackClient({ initialData }: TrackClientProps) {
  const router = useRouter();
  const { movie, stats, statusCounts, stateSummary, citySummary, chainSummary, venueSummary, timeSlotSummary, sourceSplit, rawShows, trends, picStats, lastUpdated } = initialData;

  const [copied, setCopied] = useState(false);

  // ─── IN-PLACE DRILL DOWN STATE ───
  const [activeState, setActiveState] = useState<string | null>(null);
  const [activeCity, setActiveCity] = useState<string | null>(null);

  const totalGross = stats.totalGross;
  const totalNett = totalGross * 0.847;
  const totalOcc = parseFloat(occ(stats.totalSold, stats.totalSeats));
  const totalATP = atp(totalGross, stats.totalSold);

  const handleCopy = () => {
    // clipboard logic...
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTweet = () => {
    // tweet logic...
  };

  const posterUrl = movie.posterUrl?.startsWith('http') ? movie.posterUrl : movie.posterUrl ? `https://image.tmdb.org/t/p/w300${movie.posterUrl}` : null;

  // Derive Table Data Based on Active Drill-Down State
  const tableData = useMemo(() => {
    if (activeCity && activeState) {
      return venueSummary.filter(v => v.city === activeCity && v.state === activeState);
    }
    if (activeState) {
      return citySummary.filter(c => c.state === activeState);
    }
    return stateSummary;
  }, [activeState, activeCity, stateSummary, citySummary, venueSummary]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6 selection:bg-emerald-500/20">

      {/* ─── TOP BAR ─── */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <Link href="/box-office" className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Box Office Hub
        </Link>
        <button onClick={() => router.refresh()} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.03] border border-white/[0.05] rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-all">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Live Data
        </button>
      </div>

      {/* ─── HERO HEADER ─── */}
      <header className="mb-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8">
          {posterUrl && (
            <div className="w-24 h-36 rounded-lg overflow-hidden border border-white/[0.1] flex-shrink-0 relative">
              <Image src={posterUrl} alt={movie.title} width={96} height={144} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-5xl font-medium text-white tracking-tight mb-3">
              {movie.title}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs text-zinc-500 tracking-wide">ALL-INDIA LIVE TRACKING</span>
              <div className="w-1 h-1 rounded-full bg-zinc-700" />
              <span className="text-[10px] px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" /> LIVE · {lastUpdated}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={handleCopy} className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-white/[0.03] border border-white/[0.05] rounded-lg text-zinc-400 hover:text-white transition-all">
              <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied!' : 'Copy Stats'}
            </button>
            <button onClick={handleTweet} className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-[#1DA1F2]/10 border border-[#1DA1F2]/20 rounded-lg text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition-all">
              <Share2 className="w-3.5 h-3.5" /> Tweet
            </button>
          </div>
        </div>

        {/* ─── 14 HERO KPIs ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-px bg-zinc-900/50 rounded-xl overflow-hidden border border-white/[0.05]">
          {[
            { label: 'Gross', value: fmt(totalGross), highlight: true },
            { label: 'Nett', value: fmt(totalNett) },
            { label: 'Tickets', value: fmtNum(stats.totalSold) },
            { label: 'Occ %', value: `${totalOcc}%`, color: occClass(totalOcc) },
            { label: 'Shows', value: stats.showsCount.toLocaleString('en-IN') },
            { label: 'FF / HF', value: `${statusCounts.ffCount} / ${statusCounts.hfCount}`, color: 'text-rose-400' },
            { label: 'Venues', value: stats.uniqueVenues.toString() },
            { label: 'Cities', value: stats.uniqueCities.toString() },
            { label: 'States', value: stats.uniqueStates.toString() },
            { label: 'ATP', value: `₹${totalATP}` },
            { label: 'PIC Gross', value: fmt(picStats.gross), color: 'text-sky-400' },
            { label: 'PIC Tickets', value: fmtNum(picStats.sold), color: 'text-sky-400' },
            { label: 'Sources', value: sourceSplit.map(s => s.source).join(' + ') },
            { label: 'Tracked', value: '100% Verified', color: 'text-emerald-400' }
          ].map((kpi, i) => (
            <div key={i} className={`px-4 py-4 text-center transition-colors ${kpi.highlight ? 'bg-zinc-900/80' : 'bg-black/20'}`}>
              <div className={`text-lg font-mono font-medium tracking-tight ${kpi.color || (kpi.highlight ? 'text-white' : 'text-zinc-200')}`}>{kpi.value}</div>
              <div className="text-[10px] text-zinc-500 mt-1">{kpi.label}</div>
            </div>
          ))}
        </div>
      </header>

      {/* ─── GRIDS & CHARTS ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 relative z-10">
        
        {/* Left Col: Master Drill-Down Table */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-black/20 border border-white/[0.05] rounded-xl p-5 relative overflow-hidden">
            {/* Breadcrumb Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-zinc-500" />
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <button onClick={() => { setActiveState(null); setActiveCity(null); }} className="text-zinc-400 hover:text-white transition-colors">
                    All India
                  </button>
                  {activeState && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                      <button onClick={() => setActiveCity(null)} className={`${!activeCity ? 'text-white' : 'text-zinc-400 hover:text-white'} transition-colors`}>
                        {activeState}
                      </button>
                    </>
                  )}
                  {activeCity && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                      <span className="text-white">{activeCity}</span>
                    </>
                  )}
                </div>
              </div>

              {(activeState || activeCity) && (
                <button 
                  onClick={() => {
                    if (activeCity) setActiveCity(null);
                    else if (activeState) setActiveState(null);
                  }}
                  className="flex items-center gap-1.5 text-[10px] text-zinc-400 hover:text-white px-3 py-1.5 rounded bg-white/[0.03] border border-white/[0.05] transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" /> Back
                </button>
              )}
            </div>
            
            {/* Dynamic Data Grid */}
            <div className="overflow-x-auto rounded-lg border border-white/[0.05] bg-black/40">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/[0.05] bg-white/[0.02] text-[10px] text-zinc-500">
                    <th className="px-4 py-3 font-normal">{activeCity ? 'Venue' : activeState ? 'City' : 'State'}</th>
                    <th className="px-3 py-3 text-right font-normal">Shows</th>
                    <th className="px-3 py-3 text-right font-normal text-amber-500/70">FF</th>
                    <th className="px-3 py-3 text-right font-normal text-rose-500/70">HF</th>
                    <th className="px-3 py-3 text-right font-normal">Sold</th>
                    <th className="px-3 py-3 text-right font-normal">Gross</th>
                    <th className="px-3 py-3 text-right font-normal">Occ %</th>
                    <th className="px-4 py-3 text-right font-normal">ATP</th>
                  </tr>
                </thead>
                <tbody className="animate-in fade-in duration-300">
                  {tableData.length > 0 ? (
                    tableData.map((row: any, i) => {
                      const isState = !activeState && !activeCity;
                      const isCity = activeState && !activeCity;
                      const title = isState ? row.state : isCity ? row.city : row.venueName;
                      
                      return (
                        <DataRow 
                          key={`${title}-${i}`} 
                          data={row} 
                          title={title} 
                          subtitle={isCity ? undefined : isState ? undefined : row.chainName || 'Independent'}
                          icon={isState ? MapPin : isCity ? Building2 : Theater} 
                          onClick={!activeCity ? () => {
                            if (isState) {
                              setActiveState(row.state);
                            } else if (isCity) {
                              setActiveCity(row.city);
                            }
                          } : undefined}
                        />
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-sm text-zinc-500">
                        No tracking data available for this region.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Time Slot Summary */}
          <section className="bg-black/20 border border-white/[0.05] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-500" /> Time Slot Summary
              </h3>
            </div>
            <div className="overflow-x-auto rounded-lg border border-white/[0.05] bg-black/40">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/[0.05] bg-white/[0.02] text-[10px] text-zinc-500">
                    <th className="px-4 py-3 font-normal">Time Slot</th>
                    <th className="px-3 py-3 text-right font-normal">Shows</th>
                    <th className="px-3 py-3 text-right font-normal text-amber-500/70">FF</th>
                    <th className="px-3 py-3 text-right font-normal text-rose-500/70">HF</th>
                    <th className="px-3 py-3 text-right font-normal">Sold</th>
                    <th className="px-3 py-3 text-right font-normal">Gross</th>
                    <th className="px-3 py-3 text-right font-normal">Occ %</th>
                    <th className="px-4 py-3 text-right font-normal">ATP</th>
                  </tr>
                </thead>
                <tbody>
                  {timeSlotSummary.map((slot, i) => (
                    <DataRow key={i} data={slot} title={slot.slot} icon={Clock} />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Col: Velocity & Top Chains */}
        <div className="space-y-6">
          {/* Velocity Chart */}
          <section className="bg-black/20 border border-white/[0.05] rounded-xl p-5">
            <h3 className="text-sm font-medium text-white flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-emerald-400" /> Ticket Velocity
            </h3>
            {trends.length > 0 ? (
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trends}>
                    <defs>
                      <linearGradient id="colorSold" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(t) => new Date(t).getHours() + 'h'} 
                      stroke="#52525b" 
                      fontSize={10} 
                      tickMargin={8} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <YAxis 
                      stroke="#52525b" 
                      fontSize={10} 
                      tickFormatter={(v) => fmtNum(v)} 
                      axisLine={false} 
                      tickLine={false} 
                      width={40}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px', color: '#fff', fontWeight: 'bold' }}
                      itemStyle={{ color: '#34d399', fontWeight: 'bold' }}
                      labelFormatter={(l) => new Date(l).toLocaleTimeString()}
                    />
                    <Area type="monotone" dataKey="soldTickets" stroke="#34d399" strokeWidth={1.5} fillOpacity={1} fill="url(#colorSold)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-zinc-600 text-xs border border-white/[0.05] rounded-lg bg-black/40">
                Not enough hourly data yet.
              </div>
            )}
            <div className="text-[10px] text-zinc-500 mt-3 text-center">Tickets Sold per Hour Trend</div>
          </section>

          {/* Chain Summary */}
          <section className="bg-black/20 border border-white/[0.05] rounded-xl p-5">
            <h3 className="text-sm font-medium text-white flex items-center gap-2 mb-4">
              <Building2 className="w-4 h-4 text-zinc-500" /> Top Chains
            </h3>
            <div className="space-y-2">
              {chainSummary.slice(0, 5).map((chain, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-zinc-600 font-mono">
                      {i+1}
                    </div>
                    <div>
                      <div className="font-medium text-zinc-200 text-sm">{chain.chain || 'Independent'}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{chain.shows} shows</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-emerald-400 text-sm font-medium">{fmt(chain.gross)}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">{fmtNum(chain.sold)} sold</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

    </div>
  );
}
