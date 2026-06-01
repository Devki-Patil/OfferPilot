import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  poweredByHeader: false,
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: ["lucide-react", "radix-ui"],
    turbopackMemoryLimit: 512 * 1024 * 1024,
    turbopackRemoveUnusedExports: true,
    turbopackTreeShaking: true,
  },
};

export default nextConfig;
