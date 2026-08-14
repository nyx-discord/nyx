import type { Constructor } from '@nyx-discord/types';
import { readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { LoaderError } from '../error/LoaderError.js';

const SUPPORTED_EXTENSIONS = new Set(['.js', '.mjs']);

export class ModuleUtils {
  public static async recurseDir(
    dir: string,
    filter?: (filePath: string) => boolean,
  ): Promise<string[]> {
    const seen = new Map<string, string>();

    try {
      const entries = await readdir(dir, {
        withFileTypes: true,
        recursive: true,
      });

      for (const entry of entries) {
        if (!entry.isFile()) continue;

        const fileExt = extname(entry.name);
        if (!SUPPORTED_EXTENSIONS.has(fileExt)) continue;

        const absolutePath = join(entry.parentPath ?? dir, entry.name);
        if (filter && !filter(absolutePath)) continue;

        const nameWithoutExt = entry.name.slice(0, -fileExt.length);
        const existing = seen.get(nameWithoutExt);

        if (existing === undefined) {
          seen.set(nameWithoutExt, absolutePath);
        } else if (fileExt === '.mjs') {
          seen.set(nameWithoutExt, absolutePath);
        }
      }

      return Array.from(seen.values());
    } catch (error) {
      throw new LoaderError(dir, 'Failed to recurse directory', error);
    }
  }

  public static async importModule(
    path: string,
  ): Promise<Record<string, unknown>> {
    try {
      return await import(pathToFileURL(path).href);
    } catch (error) {
      throw new LoaderError(path, 'Failed to import module', error);
    }
  }

  public static isConstructor(value: unknown): value is Constructor<object> {
    return typeof value === 'function' && !!value.prototype;
  }
}
