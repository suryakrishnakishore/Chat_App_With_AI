import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_API_URL as string,
        pathname: "/uploads/**",
      }
    ],
  },
};

export default nextConfig;
