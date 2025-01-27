import type { Collection } from '@discordjs/collection';
import type { Identifier } from '../identity/Identifier.js';

/** A collection that contains an object's metadata. */
export type MetaCollection = Collection<Identifier, unknown>;
