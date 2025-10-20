import { pnpmWorkspaceRootSync } from '@node-kit/pnpm-workspace-root';
import { Schema } from '@repo/typedoc-plugin-entities';
import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { type infer as zInfer } from 'zod';

const workspaceRoot = pnpmWorkspaceRootSync();
if (!workspaceRoot) {
  throw new Error('Could not find workspace root');
}
const ENTITIES_LOCAL_PATH = join(
  workspaceRoot,
  'build',
  'docs',
  'entities.json',
);
const DEFAULT_BASE_URL = 'https://nyx-discord.github.io/nyx/typedoc/';
let docsMapCache: Record<
  string,
  zInfer<typeof Schema>[string] & { docResolved?: boolean }
> | null = null;
let baseUrlCache: string | null = null;

function getGitBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf-8',
    }).trim();
  } catch {
    console.error(
      'Could not get git branch, is git installed, and is this a repo?',
    );
    return null;
  }
}

function getUrlFromBranch(branch: string) {
  return `https://nyx-discord.github.io/nyx/typedoc@${branch}/`;
}

async function getBaseUrl() {
  if (baseUrlCache) return baseUrlCache;

  const branch = getGitBranch();
  if (branch && branch !== 'main') {
    const candidate = getUrlFromBranch(branch);

    const ok = await fetch(candidate, { next: { revalidate: false } })
      .then((res) => res.ok)
      .catch(() => false);

    const result = ok ? candidate : DEFAULT_BASE_URL;
    baseUrlCache = result;
    return result;
  }

  baseUrlCache = DEFAULT_BASE_URL;
  return DEFAULT_BASE_URL;
}

async function getEntitiesUrl() {
  const base = await getBaseUrl();
  return new URL('entities.json', base);
}

export async function fetchDocsMap(): Promise<typeof docsMapCache> {
  if (docsMapCache) return docsMapCache;

  const localExists = existsSync(ENTITIES_LOCAL_PATH);

  if (
    process.env.NODE_ENV === 'production'
    || (process.env.NODE_ENV === 'development' && !localExists)
  ) {
    const url = await getEntitiesUrl();
    const res = await fetch(url, { next: { revalidate: false } });
    if (!res.ok) {
      throw new Error(`Failed to fetch docs map from ${url}`);
    }

    const result = await res.json();
    docsMapCache = Schema.parse(result);
    return docsMapCache;
  }

  const file = readFileSync(ENTITIES_LOCAL_PATH, 'utf-8');
  const result = JSON.parse(file);

  docsMapCache = Schema.parse(result);
  return docsMapCache;
}

export async function getLinks(pkg: string, name: string) {
  const map = await fetchDocsMap();
  const key = `@nyx-discord/${pkg}.${name}`;
  const value = map?.[key];

  if (!value) return null;
  if (value.docResolved) return value;

  value.typedoc = new URL(value.typedoc, await getBaseUrl()).href;
  value.docResolved = true;

  return value;
}
