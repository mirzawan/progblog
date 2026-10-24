import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true, // Privremeno isključujemo da izbjegnemo instant grešku
  partialPrefetching: true,
  experimental: {
    devValidationWorker: false, // Isključuje validacioni radnik
  },
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