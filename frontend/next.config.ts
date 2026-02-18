import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: "standalone",

  // Disable x-powered-by header
  poweredByHeader: false,

  // Pin Turbopack root to frontend/ so it resolves modules from here, not the monorepo root
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
