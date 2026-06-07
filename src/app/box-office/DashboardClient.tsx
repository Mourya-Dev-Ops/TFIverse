'use client';

import React, { useState } from 'react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';
import { RefreshCw, TrendingUp, Users, Clapperboard, Ticket } from 'lucide-react';
import Image from 'next/image';

interface DashboardData {
    movie: any;
    stats: {
        totalGross: number;
        totalSold: number;
        totalSeats: number;
        showsCount: number;
    };
    trends: any[];
    citySplit: any[];
    lastUpdated: Date;
}

export default function DashboardClient({ initialData }: { initialData: DashboardData }) {
    const [data, setData] = useState(initialData);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const formatCurrency = (num: number) => {
        if (num >= 1e7) return `₹${(num / 1e7).toFixed(2)} Cr`;
        if (num >= 1e5) return `₹${(num / 1e5).toFixed(2)} L`;
        return `₹${num.toLocaleString('en-IN')}`;
    };

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString('en-IN', {
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    };

    // Calculate Occupancy %
    const occupancy = data.stats.totalSeats > 0 
        ? Math.round((data.stats.totalSold / data.stats.totalSeats) * 100) 
        : 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Header & Movie Info */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-6">
                    <div className="relative w-24 h-36 rounded-lg overflow-hidden shadow-2xl border border-white/10">
                        <Image 
                            src={`https://image.tmdb.org/t/p/w200${data.movie.posterPath}`} 
                            alt={data.movie.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
                            {data.movie.title} <span className="text-blue-500 text-2xl">• LIVE</span>
                        </h1>
                        <p className="text-gray-400 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            Tracked Box Office & Advance Sales
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <button 
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                    >
                        <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
                        Refresh Data
                    </button>
                    <p className="text-xs text-gray-500 mt-3">
                        Last tracked: {formatTime(data.lastUpdated)}
                    </p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Tracked Gross</p>
                    <h2 className="text-3xl font-bold text-green-400 flex items-center gap-2">
                        <TrendingUp size={24} /> {formatCurrency(data.stats.totalGross)}
                    </h2>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Footfalls (Sold)</p>
                    <h2 className="text-3xl font-bold text-blue-400 flex items-center gap-2">
                        <Users size={24} /> {data.stats.totalSold.toLocaleString('en-IN')}
                    </h2>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Tracked Shows</p>
                    <h2 className="text-3xl font-bold text-purple-400 flex items-center gap-2">
                        <Clapperboard size={24} /> {data.stats.showsCount.toLocaleString('en-IN')}
                    </h2>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Avg. Occupancy</p>
                    <h2 className="text-3xl font-bold text-orange-400 flex items-center gap-2">
                        <Ticket size={24} /> {occupancy}%
                    </h2>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 h-2 mt-4 rounded-full overflow-hidden">
                        <div 
                            className="bg-gradient-to-r from-orange-500 to-red-500 h-full"
                            style={{ width: `${occupancy}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Hourly Trend Chart */}
                <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-6">Hourly Tracking Trend (Gross)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.trends} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <Line type="monotone" dataKey="grossRevenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} />
                                <CartesianGrid stroke="#333" strokeDasharray="5 5" vertical={false} />
                                <XAxis 
                                    dataKey="timestamp" 
                                    tickFormatter={(tick) => new Date(tick).toLocaleTimeString('en-US', { hour: 'numeric' })}
                                    stroke="#888"
                                />
                                <YAxis 
                                    tickFormatter={(tick) => `₹${(tick/100000).toFixed(0)}L`}
                                    stroke="#888"
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }}
                                    labelFormatter={(label) => new Date(label).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}
                                    formatter={(value: number) => [formatCurrency(value), 'Gross']}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* City Wise Split */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-6">Top Cities (Gross)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.citySplit.slice(0, 5)} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#333" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="city" type="category" stroke="#ccc" width={80} />
                                <Tooltip 
                                    cursor={{fill: '#333'}}
                                    contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }}
                                    formatter={(value: number) => [formatCurrency(value), 'Gross']}
                                />
                                <Bar dataKey="gross" radius={[0, 4, 4, 0]}>
                                    {
                                        data.citySplit.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'][index % 5]} />
                                        ))
                                    }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            
            <div className="mt-10 text-center text-sm text-gray-500 bg-black/50 py-4 rounded-xl border border-white/5">
                <p>⚠️ Data is for tracking purposes only. Original producer or distributor figures may vary. We are not responsible for exact numbers.</p>
            </div>

        </div>
    );
}
