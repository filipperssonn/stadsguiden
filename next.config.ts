import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prestandaoptimiseringar
  compress: true,
  poweredByHeader: false,
  
  // Ignorera ESLint fel under bygge för snabb deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Bildoptimering
  images: {
    domains: [
      'maps.googleapis.com',
      'lh3.googleusercontent.com', 
      'places.googleapis.com',
      'openweathermap.org'
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Tillåt lokala API routes som bildkällor
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
        port: '',
        pathname: '/maps/api/place/photo/**',
      },
      {
        protocol: 'https',
        hostname: 'openweathermap.org',
        port: '',
        pathname: '/img/**',
      },
    ],
  },

  // Experimentella funktioner för bättre prestanda
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // Headers för säkerhet och prestanda
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=60',
          },
        ],
      },
    ];
  },

  // Redirects för SEO
  async redirects() {
    return [
      {
        source: '/place/:id',
        destination: '/places/:id',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
