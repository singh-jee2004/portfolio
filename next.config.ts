import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevent Three.js from trying to access browser APIs during SSR
      config.externals = config.externals || [];
      (config.externals as string[]).push('canvas');
    }
    return config;
  },
};

export default nextConfig;
