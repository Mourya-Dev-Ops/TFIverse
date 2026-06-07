// lib/sanitize.ts — Input sanitization utility for user-generated content

/**
 * Sanitizes user input to prevent XSS attacks.
 * Escapes HTML special characters that could be used for injection.
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Sanitizes input and also trims whitespace.
 * Use for all user-submitted text fields (titles, descriptions, comments, bios).
 */
export function sanitizeAndTrim(input: string | null | undefined): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (trimmed.length === 0) return null;
  return sanitizeInput(trimmed);
}

/**
 * Validates and sanitizes a URL input.
 * Only allows http:// and https:// protocols.
 */
export function sanitizeUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (trimmed.length === 0) return null;
  
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null; // Reject javascript:, data:, etc.
    }
    return trimmed;
  } catch {
    return null; // Invalid URL
  }
}

/**
 * File upload validation constants & helper
 */
export const UPLOAD_LIMITS = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_MEME_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const,
};

export function validateFileUpload(
  file: File, 
  maxSize: number = UPLOAD_LIMITS.MAX_IMAGE_SIZE,
  allowedTypes: readonly string[] = UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES
): { valid: boolean; error?: string } {
  if (file.size > maxSize) {
    const maxMB = Math.round(maxSize / 1024 / 1024);
    return { valid: false, error: `File too large. Maximum size is ${maxMB}MB.` };
  }
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` };
  }
  return { valid: true };
}
