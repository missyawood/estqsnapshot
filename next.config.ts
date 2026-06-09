import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/estqsnapshot",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
