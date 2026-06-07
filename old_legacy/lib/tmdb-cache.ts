const CACHE = new Map();

const TTL = 10 * 60 * 1000; // 10 minutes

export async function cachedJson(url: string) {
  const now = Date.now();
  const hit = CACHE.get(url);
  
  if (hit && now - hit.t < TTL) return hit.v;
  
  const res = await fetch(url, { next: { revalidate: TTL / 1000 } });
  const json = await res.json();
  
  CACHE.set(url, { t: now, v: json });
  
  return json;
}
