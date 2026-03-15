import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@db": path.resolve(__dirname, "db"),
      "@data": path.resolve(__dirname, "data"),
    };
    return config;
  },
  // Run seed on startup in development
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
