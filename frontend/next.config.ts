import type { NextConfig } from '@/frontend/node_modules/next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    newDevOverlay: true
  }
};

export default nextConfig;
