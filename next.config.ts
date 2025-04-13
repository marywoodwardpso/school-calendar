import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    resolveAlias: {
      html2canvas: 'html2canvas-pro',
    },
  },
};

export default nextConfig;
