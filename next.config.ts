import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  outputFileTracingRoot: process.cwd(),
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'viralbook-ai.vercel.app',
          },
        ],
        destination: 'https://www.viralbook-ai.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
