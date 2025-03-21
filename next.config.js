/** @type {import('next').NextConfig} */
const nextConfig = {
    // Disable strict mode in production to avoid double rerenders
    reactStrictMode: process.env.NODE_ENV !== 'production',
    // Reduce image optimization in dev to improve performance
    images: {
      domains: [],
      unoptimized: process.env.NODE_ENV !== 'production',
    },
    // Add experimental settings for performance
    experimental: {
      // Enable optimizations
      optimizeCss: true,
      // Reduce JS bundle size
      optimizePackageImports: ['framer-motion', 'gsap', 'three'],
    },
    // Handle ESLint and type checking during build
    eslint: {
      // Don't fail the build for warnings
      ignoreDuringBuilds: true,
    },
    typescript: {
      // Don't fail the build for type errors
      ignoreBuildErrors: true,
    },
  };
  
  module.exports = nextConfig;