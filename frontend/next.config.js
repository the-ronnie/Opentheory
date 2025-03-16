/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // Re-enable SWC minification
  experimental: {
    // Enable Server Actions
    serverActions: true,
    // Force SWC transforms on
    forceSwcTransforms: true,
    // Other useful experimental options
    esmExternals: 'loose',
  },
  // Webpack custom configuration to handle the SWC loader issue
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add custom resolver to help with SWC loader
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
    // Force a specific module resolution method
    config.resolve.mainFields = ['browser', 'module', 'main'];
    
    return config;
  },
  // CORS configuration
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/:path*`,
      },
    ];
  },
}

module.exports = nextConfig
