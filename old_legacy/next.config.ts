// next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // ============================================
      // ✅ BACKBLAZE B2 (Primary Storage)
      // ============================================
      {
        protocol: 'https',
        hostname: 'f001.backblazeb2.com',
        pathname: '/file/**',
      },
      {
        protocol: 'https',
        hostname: 'f002.backblazeb2.com',
        pathname: '/file/**',
      },
      {
        protocol: 'https',
        hostname: 'f003.backblazeb2.com',
        pathname: '/file/**',
      },
      {
        protocol: 'https',
        hostname: 'f004.backblazeb2.com',
        pathname: '/file/**',
      },
      {
        protocol: 'https',
        hostname: 'f005.backblazeb2.com',
        pathname: '/file/**',
      },

      // ============================================
      // ✅ IMAGE SOURCES (External)
      // ============================================
      {
        protocol: 'https',
        hostname: '**.pinimg.com', // Pinterest
      },
      {
        protocol: 'https',
        hostname: 'imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org', // TMDb (Movies)
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Cloudinary
      },
      {
        protocol: 'https',
        hostname: 'placehold.co', // Placeholders
      },

      // ============================================
      // ✅ SOCIAL MEDIA (User Avatars)
      // ============================================
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // GitHub
      },
      {
        protocol: 'https',
        hostname: 'platform-lookaside.fbsbx.com', // Facebook
      },
    ],
  },

  // ============================================
  // ✅ PERFORMANCE OPTIMIZATIONS
  // ============================================
  swcMinify: true,
  compress: true,
  poweredByHeader: false,

  // ============================================
  // ✅ HEADERS (Caching + Security)
  // ============================================
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600', // 1 hour
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
