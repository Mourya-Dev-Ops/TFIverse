// Shared platform branding for OTT logos across pages
export const getPlatformBrand = (platform: string) => {
  const p = platform.toLowerCase();
  const tmdb = (path: string) => `https://image.tmdb.org/t/p/w92${path}`;
  if (p.includes('netflix')) return { logo: tmdb('/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg'), name: 'Netflix', color: 'bg-[#E50914]' };
  if (p.includes('prime') || p.includes('amazon')) return { logo: tmdb('/pvske1MyAoymrs5bguRfVqYiM9a.jpg'), name: 'Prime Video', color: 'bg-[#00A8E1]' };
  if (p.includes('hotstar') || p.includes('jiohotstar') || p.includes('disney')) return { logo: tmdb('/kVqjgpcwvDJOhCupjcLzwwtOp52.jpg'), name: 'JioHotstar', color: 'bg-[#1F60B0]' };
  if (p === 'aha' || p.includes('aha')) return { logo: tmdb('/8WerMI8XcZXqPpkHTZNtzMzousF.jpg'), name: 'Aha', color: 'bg-[#FF6B00]' };
  if (p.includes('zee5')) return { logo: tmdb('/gP67NRy1ShUJilrzMsbOmEmdmcv.jpg'), name: 'ZEE5', color: 'bg-[#8230C6]' };
  if (p.includes('sun')) return { logo: tmdb('/6KEQzITx2RrCAQt5Nw9WrL1OI8z.jpg'), name: 'Sun NXT', color: 'bg-[#FF0000]' };
  if (p.includes('sony')) return { logo: tmdb('/3973zlBbBXdXxaWqRWzGG2GYxbT.jpg'), name: 'Sony LIV', color: 'bg-[#1A1A2E]' };
  if (p.includes('jio') && !p.includes('hotstar')) return { logo: tmdb('/kVqjgpcwvDJOhCupjcLzwwtOp52.jpg'), name: 'JioCinema', color: 'bg-[#E72D7A]' };
  if (p.includes('apple')) return { logo: tmdb('/mcbz1LgtErU9p4UdbZ0rG6RTWHX.jpg'), name: 'Apple TV', color: 'bg-[#2D2D2D]' };
  if (p.includes('youtube')) return { logo: tmdb('/pTnn5JwWr4p3pG8H6VrpiQo7Vs0.jpg'), name: 'YouTube', color: 'bg-[#FF0000]' };
  if (p.includes('mx player')) return { logo: tmdb('/ayHY6wKxvCKj2PU8eRPFxnPc6B0.jpg'), name: 'MX Player', color: 'bg-[#0D47A1]' };
  return { logo: '', name: platform, color: 'bg-zinc-700' };
};
