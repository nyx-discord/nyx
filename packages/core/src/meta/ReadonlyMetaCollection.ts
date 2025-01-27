import type { MetaCollection } from '../meta/MetaCollection.js';
import type { ReadonlyCollectionFrom } from '../types/ReadonlyCollectionFrom.js';

/** A readonly collection that contains an object's metadata. */
export type ReadonlyMetaCollection = ReadonlyCollectionFrom<MetaCollection>;
