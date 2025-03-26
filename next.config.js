/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for development
  reactStrictMode: true,
  
  // Image optimization settings

  
  // Add experimental settings for performance
  experimental: {
    // Optimize CSS for production
    optimizeCss: true,
    // Add optimizations for package imports
    optimizePackageImports: ['framer-motion', 'gsap', 'three']
  },
  
  // Handle ESLint settings
  eslint: {
    // Display warnings but don't fail the build
    ignoreDuringBuilds: true,
  },
  
  // Add build optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Set headers for better security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;