import type { NextConfig } from "next";
import pkg from "./package.json";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: pkg.version,
    // Changes every build; versions the service worker and its caches.
    NEXT_PUBLIC_BUILD_ID: `${pkg.version}-${Date.now().toString(36)}`,
  },
  async headers() {
    return [
      {
        // The service worker must always be revalidated so updates ship immediately.
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ];
  },
};

export default nextConfig;
