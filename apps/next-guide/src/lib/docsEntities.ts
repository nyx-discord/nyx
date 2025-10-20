import { pnpmWorkspaceRootSync } from '@node-kit/pnpm-workspace-root';
import { Schema } from '@repo/typedoc-plugin-entities';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import type { infer as zInfer } from 'zod';

let docsMapCache: zInfer<typeof Schema> | null = null;

const DOCS_MAP_URL = 'https://nyx-discord.github.io/nyx/typedoc/entities.json';

const workspaceRoot = pnpmWorkspaceRootSync();
if (!workspaceRoot) {
  throw new Error('Could not find workspace root');
}
const DOCS_MAP_LOCAL_PATH = join(
  workspaceRoot,
  'build',
  'docs',
  'entities.json',
);

function parseAndSetCache(json: object) {
  const parsed = Schema.parse(json);
  docsMapCache = parsed;
  return parsed;
}

export async function fetchDocsMap(): Promise<typeof docsMapCache> {
  if (docsMapCache) return docsMapCache;

  const fileExists = existsSync(DOCS_MAP_LOCAL_PATH);

  if (
    process.env.NODE_ENV === 'production'
    || (process.env.NODE_ENV === 'development' && !fileExists)
  ) {
    const res = await fetch(DOCS_MAP_URL, { next: { revalidate: false } });
    if (!res.ok) {
      throw new Error(`Failed to fetch docs map from ${DOCS_MAP_URL}`);
    }

    const result = await res.json();
    return parseAndSetCache(result);
  }

  const file = readFileSync(DOCS_MAP_LOCAL_PATH, 'utf-8');
  const result = JSON.parse(file);

  return parseAndSetCache(result);
}

export async function getLinks(pkg: string, name: string) {
  const map = await fetchDocsMap();
  const key = `@nyx-discord/${pkg}.${name}`;
  return map?.[key] ?? null;
}
