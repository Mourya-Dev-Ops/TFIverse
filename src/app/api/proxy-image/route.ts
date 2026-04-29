import { NextRequest, NextResponse } from 'next/server';

// In-memory cache for proxied images (survives between requests in the same process)
const imageCache = new Map<string, { buffer: Buffer; contentType: string; cachedAt: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours
const MAX_CACHE_SIZE = 500; // Max cached images to prevent memory leaks

// Only allow proxying images from trusted domains
const ALLOWED_DOMAINS = [
  'image.tmdb.org',
  'gjonhhhxamhvcfvkctth.supabase.co',
  'f004.backblazeb2.com',
];

function isAllowedUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ALLOWED_DOMAINS.some(domain => parsed.hostname.endsWith(domain));
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  // Security: only proxy from trusted image CDNs
  if (!isAllowedUrl(url)) {
    return new NextResponse('Domain not allowed', { status: 403 });
  }

  // Check in-memory cache first
  const cached = imageCache.get(url);
  if (cached && (Date.now() - cached.cachedAt) < CACHE_TTL) {
    return new NextResponse(cached.buffer, {
      headers: {
        'Content-Type': cached.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'X-Cache': 'HIT',
      },
    });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'TFiverse/2.0',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Store in cache (evict oldest if full)
    if (imageCache.size >= MAX_CACHE_SIZE) {
      const oldestKey = imageCache.keys().next().value;
      if (oldestKey) imageCache.delete(oldestKey);
    }
    imageCache.set(url, { buffer, contentType, cachedAt: Date.now() });

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return new NextResponse('Failed to proxy image', { status: 500 });
  }
}
