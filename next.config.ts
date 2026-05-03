import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverActions: {
    allowedOrigins: ['localhost:3000', '192.168.1.5:3000']
  },
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
