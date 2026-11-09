import { createMDX } from 'fumadocs-mdx/next';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

const withMDX = createMDX();

/** @type {(phase: string) => import('next').NextConfig} */
export default function config(phase) {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  return withMDX({
    reactStrictMode: true,
    // Only export on build: in dev, Next checks `generateStaticParams()` against the original URL instead of the
    // rewritten one, so a cold `/use.md` request fails with "missing param". `next build` still validates the params.
    output: isDev ? undefined : 'export',
    // Set by the deploy workflow (e.g. `/nyx/guide`), since GitHub Pages serves the guide under a subpath.
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
    images: {
      unoptimized: true,
    },
    serverExternalPackages: ['typescript', 'twoslash'],
    // Rewrites don't run in a static export. In production, `scripts/copy-llms-md.mjs`
    // copies each `/llms.mdx/<slug>/content.md` to `/<slug>.md` instead.
    ...(isDev && {
      async rewrites() {
        return [
          {
            source: '/:slug*.md',
            destination: '/llms.mdx/:slug*/content.md',
          },
        ];
      },
    }),
  });
}
