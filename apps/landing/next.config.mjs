/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  output: 'export',
  // Set by the deploy workflow (`/nyx`), since GitHub Pages serves the repository under a subpath.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  images: {
    unoptimized: true,
  },
};
