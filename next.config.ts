import type { NextConfig } from "next";

// On GitHub Pages the site is served from /<repo-name>, so every route and asset needs that prefix.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: { loader: "custom", loaderFile: "./src/lib/imageLoader.ts" },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
