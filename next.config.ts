import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  // https://github.com/vercel/next.js/issues/61228#issuecomment-2002035619
  distDir: process.env.NODE_ENV === "development" ? ".next/dev" : ".next/build",
  images: {
    minimumCacheTTL: 31536000,
  },
  async headers() {
    return [
      {
        source: "/images/pokefuta/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
