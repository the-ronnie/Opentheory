import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // Remove ppr: true line or set to false
    // ppr: true,
    newDevOverlay: true
  }
};

export default nextConfig;