import type { NextConfig } from "next";
import { execSync } from "child_process";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_BUILD_DATE: new Date().toISOString(),
    NEXT_PUBLIC_GIT_COMMIT_SHA:
      process.env.VERCEL_GIT_COMMIT_SHA ||
      (() => {
        try {
          return execSync("git rev-parse HEAD").toString().trim();
        } catch {
          // no-op
        }
      })() ||
      "unknown",
  },
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
