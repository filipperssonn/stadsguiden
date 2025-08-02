import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prestandaoptimiseringar
  compress: true,
  poweredByHeader: false,
  
  // ESLint konfiguration
  eslint: {
    ignoreDuringBuilds: false,
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
    optimizePackageImports: ['lucide-react', '@radix-ui/react-slot', '@radix-ui/react-separator'],
  },

  // Externa paket för server components
  serverExternalPackages: ['@supabase/supabase-js'],

  // Ytterligare prestandaoptimiseringar
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
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
      {
        source: '/api/photos/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800', // Cache foton längre
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // Cache statiska assets 1 år
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
