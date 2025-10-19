import { Schema } from '@repo/typedoc-plugin-entities';
import type { infer as zInfer } from 'zod';

let docsMapCache: zInfer<typeof Schema> | null = null;

const DOCS_MAP_URL = 'https://nyx-discord.github.io/nyx/typedoc/entities.json';

export async function fetchDocsMap(): Promise<typeof docsMapCache> {
  if (docsMapCache) return docsMapCache;

  const res = await fetch(DOCS_MAP_URL, { next: { revalidate: false } });
  if (!res.ok) {
    throw new Error(`Failed to fetch docs map from ${DOCS_MAP_URL}`);
  }

  const result = await res.json();
  const parsed = Schema.parse(result);

  docsMapCache = parsed;
  return docsMapCache;
}

export async function getLinks(pkg: string, name: string) {
  const map = await fetchDocsMap();
  const key = `@nyx-discord/${pkg}.${name}`;
  return map?.[key] ?? null;
}
