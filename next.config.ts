import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // This is required for WASM modules to work in Next.js
    webVitalsAttribution: ["CLS", "LCP"],
  },
  webpack: (config, { isServer }) => {
    // Enable asyncWebAssembly
    config.experiments = { ...config.experiments, asyncWebAssembly: true };

    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};
export default nextConfig;
