import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["@mysten/walrus-wasm"],
};
export default nextConfig;
