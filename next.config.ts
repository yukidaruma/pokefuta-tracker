import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  // https://github.com/vercel/next.js/issues/61228#issuecomment-2002035619
  distDir: process.env.NODE_ENV === "development" ? ".next/dev" : ".next/build",
};

export default nextConfig;
