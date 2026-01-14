import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Turbopack configuration for Next.js 16+
  turbopack: {
    // Set the root directory explicitly to avoid lockfile detection issues
    root: path.resolve(__dirname),
    // Force single instance of Three.js to prevent R3F context conflicts
    resolveAlias: {
      three: "three",
    },
  },

  // Transpile reagraph and related packages for proper SSR handling
  transpilePackages: [
    "reagraph",
    "three",
    "three-stdlib",
    "@react-three/fiber",
    "@react-three/drei",
  ],
};

export default nextConfig;
