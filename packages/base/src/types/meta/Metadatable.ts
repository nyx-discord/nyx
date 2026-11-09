import type { ReadonlyMetadata } from './ReadonlyMetadata';

/** An object that can contain metadata about it. */
export interface Metadatable {
  /** Returns a readonly metadata collection of this object, if any. */
  getMeta(): ReadonlyMetadata | null;
}
