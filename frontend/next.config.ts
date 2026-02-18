import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: "standalone",

  // Disable x-powered-by header
  poweredByHeader: false,
};

export default nextConfig;
