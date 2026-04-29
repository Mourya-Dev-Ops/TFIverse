import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: 'gjonhhhxamhvcfvkctth.supabase.co',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'f004.backblazeb2.com',
        pathname: '/file/**',
      },
    ],
  },
};

export default nextConfig;
