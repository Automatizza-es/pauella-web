import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  // Serve /es/ directly while preserving the existing slashless API URLs.
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
