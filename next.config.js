/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable experimental features if needed
  },
  
  // Image optimization configuration
  images: {
    domains: ['localhost'],
    unoptimized: false
  },
  
  // Environment variables to expose to client
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Handle LightningCSS native module issues
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Handle missing native modules in production builds
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'lightningcss-linux-x64-gnu': false,
        'lightningcss-darwin-x64': false,
        'lightningcss-win32-x64-msvc': false,
      };
    }
    return config;
  },
  
  // Output configuration for deployment
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  },
  
  // Redirects for old paths
  async redirects() {
    return [
      {
        source: '/admin/dashboard',
        destination: '/admin',
        permanent: true
      }
    ];
  }
};

module.exports = nextConfig;
