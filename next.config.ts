import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export', // Disabled to support Server Actions with Cloudflare Adapter
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
