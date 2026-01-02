import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["@mysten/walrus", "@mysten/walrus-wasm"],
};
export default nextConfig;
