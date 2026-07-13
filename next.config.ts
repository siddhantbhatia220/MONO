import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Strict mode for React — catches potential issues early
  reactStrictMode: true,

  // Output standalone for Docker / production deployments
  // output: 'standalone',

  // Image optimization domains (Phase 2+)
  images: {
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: false,
  },

  // Compiler options — remove console.log in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

export default nextConfig
