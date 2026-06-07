'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search, ChevronDown } from 'lucide-react';
import { useTransition } from 'react';

const SORT_OPTIONS = [
    { label: 'Popularity', value: 'popularity' },
    { label: 'Newest Releases', value: 'newest' },
    { label: 'Release Date (Old-New)', value: 'releaseDate' },
    { label: 'Rating', value: 'voteAverage' },
];

const PLATFORMS = [
    { label: 'All Platforms', value: 'all' },
    { label: 'Netflix', value: 'netflix' },
    { label: 'Prime Video', value: 'amazon prime video' },
    { label: 'Aha', value: 'aha' },
    { label: 'Hotstar', value: 'hotstar' },
    { label: 'Sun Nxt', value: 'sun nxt' },
    { label: 'Sony Liv', value: 'sony liv' },
    { label: 'Zee5', value: 'zee5' },
];

const YEARS = [
    { label: 'All Years', value: 'all' },
    { label: '2026', value: '2026' },
    { label: '2025', value: '2025' },
    { label: '2024', value: '2024' },
    { label: '2023', value: '2023' },
    { label: '2022', value: '2022' },
    { label: '2020 - 2021', value: '2020-2021' },
    { label: '2010 - 2019', value: '2010-2019' },
    { label: '2000 - 2009', value: '2000-2009' },
    { label: '1990 - 1999', value: '1990-1999' },
    { label: 'Before 1990', value: '1900-1989' },
];

export function MovieFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const currentQuery = searchParams.get('q') || '';
    const currentSort = searchParams.get('sort') || 'popularity';
    const currentPlatform = searchParams.get('platform') || 'all';
    const currentYear = searchParams.get('year') || 'all';

    const updateFilters = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== 'all') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        // Reset page to 1 when filters change
        params.delete('page');

        startTransition(() => {
            router.push(`/movies?${params.toString()}`);
        });
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-12 items-center bg-black p-4 rounded-3xl border border-zinc-900 shadow-2xl">
            {/* Search */}
            <div className="relative flex-1 w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
                <input 
                    type="text"
                    defaultValue={currentQuery}
                    placeholder="Search movies..."
                    onChange={(e) => {
                        const val = e.target.value;
                        const timeoutId = setTimeout(() => updateFilters('q', val), 500);
                        return () => clearTimeout(timeoutId);
                    }}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-white transition-all placeholder:text-zinc-600"
                />
            </div>

            {/* Platform Filter */}
            <div className="relative w-full md:w-48">
                <select 
                    value={currentPlatform}
                    onChange={(e) => updateFilters('platform', e.target.value)}
                    className="w-full appearance-none bg-zinc-900 border border-zinc-800 rounded-2xl py-3 pl-4 pr-10 text-white focus:outline-none focus:ring-1 focus:ring-white cursor-pointer"
                >
                    {PLATFORMS.map(p => (
                        <option key={p.value} value={p.value} className="bg-zinc-900">{p.label}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            </div>

            {/* Year Filter */}
            <div className="relative w-full md:w-40">
                <select 
                    value={currentYear}
                    onChange={(e) => updateFilters('year', e.target.value)}
                    className="w-full appearance-none bg-zinc-900 border border-zinc-800 rounded-2xl py-3 pl-4 pr-10 text-white focus:outline-none focus:ring-1 focus:ring-white cursor-pointer"
                >
                    {YEARS.map(y => (
                        <option key={y.value} value={y.value} className="bg-zinc-900">{y.label}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative w-full md:w-56">
                <select 
                    value={currentSort}
                    onChange={(e) => updateFilters('sort', e.target.value)}
                    className="w-full appearance-none bg-zinc-900 border border-zinc-800 rounded-2xl py-3 pl-4 pr-10 text-white focus:outline-none focus:ring-1 focus:ring-white cursor-pointer"
                >
                    {SORT_OPTIONS.map(s => (
                        <option key={s.value} value={s.value} className="bg-zinc-900">{s.label}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            </div>
        </div>
    );
}
