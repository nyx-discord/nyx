/** Where the guide is served from. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** The guide's public origin, used to build absolute URLs for agents (llms.txt). */
export const siteOrigin =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ?? 'https://nyx-discord.github.io';

/** Absolute URL of a path inside the guide, e.g. `absoluteUrl('/use.md')`. */
export function absoluteUrl(path: string): string {
  return `${siteOrigin}${basePath}${path}`;
}
