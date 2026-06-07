// Simple in-memory rate limiter for auth endpoints
// In a multi-instance production environment, this should be replaced with Redis

const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

export function checkRateLimit(ip: string | undefined | null, action: string, limit: number, windowMs: number) {
  if (!ip) return { success: true }; // Fallback if IP cannot be determined

  const key = `${ip}:${action}`;
  const now = Date.now();
  
  const record = rateLimitMap.get(key);

  if (!record || record.expiresAt < now) {
    // First request or expired
    rateLimitMap.set(key, { count: 1, expiresAt: now + windowMs });
    return { success: true };
  }

  if (record.count >= limit) {
    return { success: false };
  }

  record.count += 1;
  return { success: true };
}
