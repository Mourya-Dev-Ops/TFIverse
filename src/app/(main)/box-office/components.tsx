'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const YEARS = Array.from({ length: 20 }, (_, i) => (new Date().getFullYear() - i).toString());
const SORT_OPTIONS = [
  { value: 'revenue', label: 'Highest Grossing' },
  { value: 'roi', label: 'Best ROI' },
  { value: 'verdict', label: 'By Verdict' },
  { value: 'budget', label: 'Biggest Budget' },
];

export function BoxOfficeFilters({ currentYear, currentSort }: { currentYear: string; currentSort: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all' || value === 'revenue') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/box-office${params.toString() ? `?${params}` : ''}`);
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Year Filter */}
      <select
        value={currentYear}
        onChange={(e) => updateFilter('year', e.target.value)}
        className="bg-zinc-900 border border-white/10 text-white text-sm font-bold rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-colors cursor-pointer appearance-none"
      >
        <option value="all">All Years</option>
        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
      </select>

      {/* Sort Filter */}
      <div className="flex gap-1 bg-zinc-900/50 rounded-xl p-1 border border-white/5">
        {SORT_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => updateFilter('sort', opt.value)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              currentSort === opt.value
                ? 'bg-white text-black shadow-lg'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
