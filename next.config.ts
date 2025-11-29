import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const securityHeaders = [
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  // HSTS добавляет Caddy при проксировании через HTTPS
];

const staticAssetHeaders = [
  {
    key: "Cache-Control",
    value: "public, max-age=31536000, immutable",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  output: "standalone",
  compiler: {
    removeConsole: isProd ? { exclude: ["error"] } : false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 420, 640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 64, 96, 128, 256],
    minimumCacheTTL: 86400,
  },
  httpAgentOptions: {
    keepAlive: true,
  },
  productionBrowserSourceMaps: false,
  typedRoutes: true,
  headers: async () => [
    {
      source: "/_next/static/:path*",
      headers: staticAssetHeaders,
    },
    {
      source: "/:path*",
      headers: securityHeaders,
    },
  ],
};

export default nextConfig;
