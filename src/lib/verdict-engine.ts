// ============================================================================
// VERDICT ENGINE — Auto-calculate Hit/Flop/Blockbuster
// This file contains pure utility functions (NOT server actions)
// ============================================================================

export type Verdict = 
  | 'All-Time Blockbuster' 
  | 'Blockbuster' 
  | 'Super Hit' 
  | 'Hit' 
  | 'Above Average' 
  | 'Average' 
  | 'Below Average' 
  | 'Flop' 
  | 'Disaster'
  | 'Verdict Pending';

export type VerdictColor = string;

export function calculateVerdict(budget: number, revenue: number): { verdict: Verdict; color: VerdictColor; multiplier: string } {
  if (!budget || budget === 0 || !revenue) {
    return { verdict: 'Verdict Pending', color: 'text-zinc-500', multiplier: '-' };
  }

  const ratio = revenue / budget;
  const multiplier = `${ratio.toFixed(1)}x`;

  if (ratio >= 5) return { verdict: 'All-Time Blockbuster', color: 'text-yellow-400', multiplier };
  if (ratio >= 3.5) return { verdict: 'Blockbuster', color: 'text-emerald-400', multiplier };
  if (ratio >= 2.5) return { verdict: 'Super Hit', color: 'text-green-400', multiplier };
  if (ratio >= 2) return { verdict: 'Hit', color: 'text-lime-400', multiplier };
  if (ratio >= 1.5) return { verdict: 'Above Average', color: 'text-blue-400', multiplier };
  if (ratio >= 1) return { verdict: 'Average', color: 'text-zinc-300', multiplier };
  if (ratio >= 0.75) return { verdict: 'Below Average', color: 'text-orange-400', multiplier };
  if (ratio >= 0.5) return { verdict: 'Flop', color: 'text-red-400', multiplier };
  return { verdict: 'Disaster', color: 'text-red-600', multiplier };
}

export function getVerdictBadgeBg(verdict: Verdict): string {
  switch (verdict) {
    case 'All-Time Blockbuster': return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
    case 'Blockbuster': return 'bg-emerald-500/15 border-emerald-500/30';
    case 'Super Hit': return 'bg-green-500/15 border-green-500/30';
    case 'Hit': return 'bg-lime-500/15 border-lime-500/30';
    case 'Above Average': return 'bg-blue-500/15 border-blue-500/30';
    case 'Average': return 'bg-zinc-500/15 border-zinc-500/30';
    case 'Below Average': return 'bg-orange-500/15 border-orange-500/30';
    case 'Flop': return 'bg-red-500/15 border-red-500/30';
    case 'Disaster': return 'bg-red-800/20 border-red-700/30';
    default: return 'bg-zinc-800/50 border-zinc-700/30';
  }
}

export function formatToCrores(amountUSD: number | null): string {
  if (!amountUSD || amountUSD === 0) return '-';
  const inr = amountUSD * 83;
  if (inr >= 10000000) return `₹${(inr / 10000000).toFixed(1)} Cr`;
  if (inr >= 100000) return `₹${(inr / 100000).toFixed(1)} L`;
  return `₹${inr.toLocaleString('en-IN')}`;
}
